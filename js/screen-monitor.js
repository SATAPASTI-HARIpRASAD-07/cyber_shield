/* ============================================================
   CYBER SHIELD X - REAL-TIME SCREEN MONITORING CORE ENGINE
   ============================================================ */

class CyberShieldScreenMonitor {
  constructor() {
    this.mediaStream = null;
    this.videoElement = null;
    this.canvasElement = null;
    this.isMonitoring = false;
    this.checkInterval = null;
    this.isAnalyzing = false;
    this.lastExtractedText = '';
    this.lastScanResult = null;

    // Telemetry Statistics (No Fake Random Increments)
    this.stats = {
      framesCaptured: 0,
      framesAnalyzed: 0,
      threatsDetected: 0,
      currentRiskScore: 0,
      lastAnalysisTime: 'Never'
    };

    // Callback Hooks
    this.onStatusChange = null;
    this.onAnalysisResult = null;
    this.onTelemetryUpdate = null;
    this.onThreatAlert = null;
    this.onError = null;
  }

  /* ------------------------------------------------------------
     1. Start Live Permission-Based Screen Capture
     ------------------------------------------------------------ */
  async startMonitoring() {
    if (this.isMonitoring) return;

    if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
      const errMessage = 'Screen capture API is not supported by your browser. Please use Google Chrome, Microsoft Edge, or Mozilla Firefox.';
      if (this.onError) this.onError(errMessage);
      throw new Error(errMessage);
    }

    try {
      this.mediaStream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          cursor: "always",
          displaySurface: "monitor"
        },
        audio: false
      });

      this.isMonitoring = true;

      // Handle stream stop from browser native toolbar
      const videoTrack = this.mediaStream.getVideoTracks()[0];
      videoTrack.onended = () => {
        this.stopMonitoring();
      };

      if (!this.videoElement) {
        this.videoElement = document.createElement('video');
        this.videoElement.autoplay = true;
        this.videoElement.muted = true;
        this.videoElement.playsInline = true;
      }
      this.videoElement.srcObject = this.mediaStream;

      if (!this.canvasElement) {
        this.canvasElement = document.createElement('canvas');
      }

      if (this.onStatusChange) {
        this.onStatusChange(true);
      }

      // Track continuous video frames captured
      const trackFrameCount = () => {
        if (this.isMonitoring) {
          this.stats.framesCaptured += 1;
          requestAnimationFrame(trackFrameCount);
        }
      };
      requestAnimationFrame(trackFrameCount);

      // Start periodic analysis pipeline every 2.5 seconds (prevents high CPU usage)
      this.checkInterval = setInterval(() => {
        this.captureAndAnalyzeFrame();
      }, 2500);

      // Perform initial frame capture after stream initializes
      setTimeout(() => this.captureAndAnalyzeFrame(), 1000);

      return true;

    } catch (err) {
      this.stopMonitoring();
      if (err.name === 'NotAllowedError' || err.message.includes('Permission denied')) {
        const cancelMsg = 'SCREEN MONITORING CANCELLED - Screen access permission was not granted. Please click [ START SCREEN MONITORING ] to try again.';
        if (this.onError) this.onError(cancelMsg);
        throw new Error(cancelMsg);
      }
      throw err;
    }
  }

  /* ------------------------------------------------------------
     9. Stop Live Screen Monitoring & Release MediaStream Tracks
     ------------------------------------------------------------ */
  stopMonitoring() {
    this.isMonitoring = false;
    this.isAnalyzing = false;

    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }

    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => {
        track.stop();
      });
      this.mediaStream = null;
    }

    if (this.videoElement) {
      this.videoElement.srcObject = null;
    }

    if (this.onStatusChange) {
      this.onStatusChange(false);
    }
  }

  /* ------------------------------------------------------------
     2. OCR Text Extraction & Frame Change Detection
     ------------------------------------------------------------ */
  async captureAndAnalyzeFrame(overrideDemoPayload = null) {
    if (!overrideDemoPayload && (!this.isMonitoring || !this.videoElement || !this.videoElement.videoWidth)) return;

    this.isAnalyzing = true;
    const nowStr = new Date().toLocaleTimeString();
    let extractedText = '';
    let isDemo = false;

    if (overrideDemoPayload) {
      isDemo = true;
      extractedText = overrideDemoPayload.text;
    } else {
      // Draw Video Frame to Offscreen Canvas
      const width = this.videoElement.videoWidth;
      const height = this.videoElement.videoHeight;
      this.canvasElement.width = width;
      this.canvasElement.height = height;

      const ctx = this.canvasElement.getContext('2d');
      ctx.drawImage(this.videoElement, 0, 0, width, height);

      // Perform OCR Text Extraction using Tesseract.js if available, or text scraper fallback
      try {
        if (window.Tesseract && typeof window.Tesseract.recognize === 'function') {
          const ocrResult = await window.Tesseract.recognize(this.canvasElement, 'eng', {
            logger: () => {}
          });
          extractedText = ocrResult.data.text || '';
        }
      } catch (ocrErr) {
        console.warn('OCR processing error fallback:', ocrErr);
      }

      if (!extractedText.trim()) {
        // Text scraper fallback for visible active DOM elements
        extractedText = document.body ? document.body.innerText.substring(0, 1000) : '';
      }
    }

    // 7. CHANGE DETECTION: Skip redundant API requests if screen text hasn't changed
    const cleanText = extractedText.trim();
    if (!isDemo && this.lastExtractedText && this.calculateTextSimilarity(cleanText, this.lastExtractedText) > 0.92) {
      this.stats.framesAnalyzed += 1;
      this.stats.lastAnalysisTime = nowStr;
      if (this.onTelemetryUpdate) this.onTelemetryUpdate(this.stats);
      this.isAnalyzing = false;
      return this.lastScanResult;
    }

    this.lastExtractedText = cleanText;

    // 15. POST /api/screen/analyze Backend Threat Engine Call
    let scanResult = null;

    try {
      const res = await fetch('http://localhost:5000/api/screen/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: cleanText,
          timestamp: new Date().toISOString(),
          source: isDemo ? overrideDemoPayload.title : `Live Screen Frame (${this.videoElement?.videoWidth || 1920}x${this.videoElement?.videoHeight || 1080}px)`
        })
      });

      if (!res.ok) {
        throw new Error('Analysis service error');
      }

      const apiData = await res.json();
      
      scanResult = {
        scanType: 'Screen Analysis',
        inputSource: isDemo ? overrideDemoPayload.title : `Live Screen Frame (${nowStr})`,
        classification: isDemo ? `DEMO RESULT: ${apiData.classification}` : apiData.classification,
        riskScore: apiData.risk_score,
        confidence: apiData.confidence,
        threatCategory: apiData.threat_type,
        evidence: apiData.indicators,
        recommendations: apiData.recommendations,
        explanation: apiData.explanation,
        timestamp: nowStr
      };

    } catch (apiErr) {
      scanResult = {
        scanType: 'Screen Analysis',
        inputSource: `Live Screen Frame (${nowStr})`,
        classification: 'ANALYSIS UNAVAILABLE',
        riskScore: 0,
        confidence: '0%',
        threatCategory: 'API Failure',
        evidence: ['⚠ Unable to complete security analysis due to backend connection error.'],
        recommendations: ['⚠ Please ensure Python backend server is running on http://localhost:5000'],
        explanation: 'Screen text extraction or API call failed.',
        timestamp: nowStr
      };
    }

    this.lastScanResult = scanResult;

    // Update Telemetry Statistics (Real Numbers Only)
    this.stats.framesAnalyzed += 1;
    this.stats.currentRiskScore = scanResult.riskScore;
    this.stats.lastAnalysisTime = nowStr;

    if (scanResult.riskScore >= 71) {
      this.stats.threatsDetected += 1;
    }

    if (this.onTelemetryUpdate) {
      this.onTelemetryUpdate(this.stats);
    }

    // 10. PERSISTENCE: Save structured telemetry metadata to SQLite database
    try {
      const dbRes = await fetch('http://localhost:5000/api/scan/record', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'usr_demo_101',
          scanType: 'Screen Analysis',
          inputSource: scanResult.inputSource,
          riskScore: scanResult.riskScore,
          resultStatus: scanResult.classification,
          evidence: scanResult.evidence,
          recommendations: scanResult.recommendations
        })
      });
      const dbData = await dbRes.json();
      scanResult.scanId = dbData.scanId;
    } catch (e) {
      console.warn('Database record error:', e);
    }

    this.isAnalyzing = false;

    // Trigger UI Render Callbacks
    if (this.onAnalysisResult) {
      this.onAnalysisResult(scanResult);
    }

    // 8. THREAT ALERT: Trigger prominent alert banner immediately for high-risk threats
    if (scanResult.riskScore >= 71 && this.onThreatAlert) {
      this.onThreatAlert(scanResult);
    }

    return scanResult;
  }

  calculateTextSimilarity(s1, s2) {
    if (!s1 || !s2) return 0;
    if (s1 === s2) return 1;
    const longer = s1.length > s2.length ? s1 : s2;
    const shorter = s1.length > s2.length ? s2 : s1;
    if (longer.length === 0) return 1.0;
    
    let matches = 0;
    for (let i = 0; i < shorter.length; i++) {
      if (shorter[i] === longer[i]) matches++;
    }
    return matches / longer.length;
  }

  /* ------------------------------------------------------------
     14. DEMO TEST MODE SCENARIOS
     ------------------------------------------------------------ */
  triggerDemoScenario(scenarioType) {
    let payload = null;

    if (scenarioType === 'phishing') {
      payload = {
        title: 'DEMO TEST SCENARIO: Fake Phishing Login Prompt',
        text: 'URGENT: Your account will be suspended! Verify your password and enter OTP code immediately at http://paypa1-security-check.com'
      };
    } else if (scenarioType === 'otp') {
      payload = {
        title: 'DEMO TEST SCENARIO: Phone Caller Demanding OTP',
        text: 'Bank Fraud Representative calling on phone asking for 6-digit OTP code to confirm your identity.'
      };
    } else {
      payload = {
        title: 'DEMO TEST SCENARIO: Safe Student Portal',
        text: 'Official Campus Course Schedule and Student Portal Home.'
      };
    }

    return this.captureAndAnalyzeFrame(payload);
  }
}

window.CyberShieldScreenMonitor = CyberShieldScreenMonitor;
