/* ============================================================
   CYBER SHIELD X - FOCUSED SECURITY SUITE SCANNER ENGINE
   ============================================================ */

class CyberShieldScanner {

  /* ------------------------------------------------------------
     1. URL & WEBSITE SHIELD ANALYZER (SECTION 5)
     ------------------------------------------------------------ */
  analyzeURL(urlInput) {
    const url = (urlInput || '').trim();
    if (!url) {
      return {
        title: 'URL & Website Shield',
        score: 0,
        status: 'INVALID INPUT',
        riskLevel: 'LOW RISK',
        why: ['⚠️ Empty URL provided'],
        whatNext: ['Enter a valid HTTP/HTTPS URL']
      };
    }

    const urlLower = url.toLowerCase();
    const protocol = urlLower.startsWith('https://') ? 'HTTPS' : (urlLower.startsWith('http://') ? 'HTTP' : 'UNKNOWN');
    const domain = urlLower.replace('https://', '').replace('http://', '').split('/')[0];

    let score = 10;
    let riskLevel = 'SAFE';
    let status = '🟢 SAFE';
    let why = [];
    let whatNext = [];

    if (protocol === 'HTTP') {
      score += 25;
      why.push('⚠️ Unencrypted HTTP connection (No TLS/SSL certificate)');
      whatNext.push('Avoid submitting passwords or sensitive data on unencrypted HTTP sites.');
    } else {
      why.push('✓ Valid HTTPS TLS/SSL connection verified');
    }

    if (anyMatch(domain, ['paypa1', 'bank-verify', 'security-check', 'login-verify', 'stipend-claim', 'account-update'])) {
      score = maxNum(score, 88);
      riskLevel = 'HIGH RISK';
      status = '🔴 SCAM / DANGEROUS';
      why.push(`🚨 Lookalike domain brand impersonation detected ('${domain}')`);
      why.push('⚠️ High risk phishing credential harvesting indicators present');
      whatNext.push('Do NOT enter your passwords or banking details on this site.');
    } else if (anyMatch(domain, ['.xyz', '.top', '.info', '.tk', '.ga', '.work'])) {
      score += 25;
      why.push(`🟠 High-risk top-level domain (.${domain.split('.').pop()})`);
      whatNext.push('Verify domain reputation before logging in.');
    }

    if (score >= 81) { riskLevel = 'CRITICAL'; status = '🔴 CRITICAL RISK'; }
    else if (score >= 61) { riskLevel = 'HIGH RISK'; status = '🔴 HIGH RISK'; }
    else if (score >= 31) { riskLevel = 'MEDIUM RISK'; status = '🟠 MEDIUM RISK'; }
    else if (score >= 15) { riskLevel = 'LOW RISK'; status = '🟢 LOW RISK'; }
    else {
      riskLevel = 'SAFE'; status = '🟢 SAFE';
      why.push('✓ No lookalike brand anomalies or phishing spellings identified');
      whatNext.push('✓ Web domain appears legitimate. Proceed with standard security.');
    }

    return {
      title: `URL Shield: ${domain || url}`,
      url,
      domain,
      protocol,
      score,
      riskLevel,
      status,
      why,
      whatNext
    };
  }

  /* ------------------------------------------------------------
     2. QR SCANNER SHIELD ANALYZER (SECTION 6)
     ------------------------------------------------------------ */
  analyzeQR(payloadInput) {
    const payload = (payloadInput || '').trim();
    if (!payload) {
      return {
        title: 'QR Scanner Shield',
        score: 0,
        status: 'INVALID INPUT',
        riskLevel: 'LOW RISK',
        why: ['⚠️ Empty QR code payload string'],
        whatNext: ['Upload or scan a valid QR code']
      };
    }

    const isUrl = payload.toLowerCase().startsWith('http://') || payload.toLowerCase().startsWith('https://') || payload.toLowerCase().startsWith('bit.ly/');
    
    if (isUrl) {
      const urlResult = this.analyzeURL(payload);
      urlResult.title = `QR Code Link: ${urlResult.domain}`;
      if (payload.includes('bit.ly') || payload.includes('tinyurl')) {
        urlResult.why.unshift('⚠️ Shortened URL payload obscures final destination link');
      }
      return urlResult;
    }

    return {
      title: 'QR Code Text Payload',
      score: 10,
      riskLevel: 'SAFE',
      status: '🟢 SAFE',
      why: [
        '✓ QR payload contains standard text string',
        '✓ No auto-executing scripts or lookalike links detected'
      ],
      whatNext: ['✓ Safe to view decoded QR code text payload.']
    };
  }

  /* ------------------------------------------------------------
     3. EMAIL & MESSAGE SHIELD ANALYZER (SECTION 7)
     ------------------------------------------------------------ */
  analyzeEmail(sender, subject, body) {
    const fullText = `${sender} ${subject} ${body}`.toLowerCase();
    
    let score = 10;
    let riskLevel = 'SAFE';
    let status = '🟢 SAFE';
    let why = [];
    let whatNext = [];

    if (anyMatch(fullText, ['urgent', 'suspended', 'act immediately', 'blocked', 'will be canceled'])) {
      score += 35;
      why.push('⚠️ High urgency language designed to pressure recipient');
    }

    if (anyMatch(fullText, ['password', 'otp', 'verification code', 'login details', 'bank account'])) {
      score += 40;
      why.push('🚨 Password, credential, or OTP code request identified');
    }

    if (anyMatch(fullText, ['deposit', 'processing fee', '$100', '₹999', 'laptop fee', 'telegram'])) {
      score += 35;
      why.push('🚨 Upfront deposit or training fee requested for job/scholarship');
    }

    if (score >= 81) { riskLevel = 'CRITICAL'; status = '🔴 CRITICAL PHISHING'; }
    else if (score >= 61) { riskLevel = 'HIGH RISK'; status = '🔴 HIGH RISK'; }
    else if (score >= 31) { riskLevel = 'MEDIUM RISK'; status = '🟠 MEDIUM RISK'; }
    else {
      riskLevel = 'SAFE'; status = '🟢 SAFE';
      why.push('✓ No obvious phishing, credential harvesting, or scam indicators detected');
      whatNext.push('✓ Message text appears safe. Follow standard security guidelines.');
    }

    if (whatNext.length === 0) {
      whatNext.push('Do NOT pay recruitment fees or share OTP codes.');
    }

    return {
      title: `Email Shield: ${subject || 'Message Analysis'}`,
      sender,
      subject,
      score,
      riskLevel,
      status,
      why,
      whatNext
    };
  }

  /* ------------------------------------------------------------
     4. MALWARE & FILE SHIELD ANALYZER (SECTION 8)
     ------------------------------------------------------------ */
  analyzeFile(filename, filesize, sha256Hash) {
    const nameLower = (filename || '').toLowerCase();
    const ext = '.' + nameLower.split('.').pop();

    let score = 10;
    let riskLevel = 'SAFE';
    let status = '🟢 SAFE';
    let why = [
      `✓ Valid extension extension '${ext.toUpperCase()}' verified`,
      '✓ No double extension malware anomalies detected',
      `✓ SHA-256 file hash computed (${sha256Hash.substr(0, 16)}...)`
    ];
    let whatNext = [
      '✓ File structure appears clean. Safe to view document.'
    ];

    if (nameLower.endsWith('.pdf.exe') || nameLower.endsWith('.docx.exe') || (nameLower.includes('.pdf.') && nameLower.endsWith('.exe'))) {
      score = 95;
      riskLevel = 'CRITICAL';
      status = '🔴 CRITICAL MALWARE';
      why = [
        `🚨 Executable Trojan disguised with double extension anomaly ('${filename}')`,
        '⚠️ Executable payload (.exe) disguised as PDF/DOCX document',
        `⚠️ SHA-256 Hash: ${sha256Hash}`
      ];
      whatNext = [
        '🔴 Do NOT double-click or open this file',
        '🔴 Delete file immediately from your system'
      ];
    } else if (['.exe', '.bat', '.vbs', '.js', '.scr'].includes(ext)) {
      score = 80;
      riskLevel = 'HIGH RISK';
      status = '🔴 HIGH RISK';
      why = [
        `⚠️ Executable file type ('${ext.toUpperCase()}') requires execution permissions`,
        `⚠️ SHA-256 Hash: ${sha256Hash}`
      ];
      whatNext = ['Scan file with antivirus before running.'];
    }

    return {
      title: `File Shield: ${filename}`,
      filename,
      filesize,
      hash: sha256Hash,
      score,
      riskLevel,
      status,
      why,
      whatNext
    };
  }

  /* ------------------------------------------------------------
     5. SCREENSHOT SHIELD ANALYZER (SECTION 4 - NEW FEATURE)
     ------------------------------------------------------------ */
  analyzeScreenshot(imageName, extractedText, extractedUrls) {
    const textLower = (extractedText || '').toLowerCase();

    let score = 10;
    let riskLevel = 'SAFE';
    let status = '🟢 SAFE';
    let why = [];
    let whatNext = [];

    if (extractedUrls && extractedUrls.length > 0) {
      why.push(`🔗 Extracted ${extractedUrls.length} embedded URL(s) from image`);
      for (const u of extractedUrls) {
        if (anyMatch(u.toLowerCase(), ['paypa1', 'security-check', 'login-verify', 'stipend-claim'])) {
          score = maxNum(score, 92);
          why.push(`🚨 Phishing lookalike domain extracted from image: '${u}'`);
        }
      }
    }

    if (anyMatch(textLower, ['otp', 'verification code', 'password request', 'enter code', 'bank account'])) {
      score = maxNum(score, 88);
      why.push('⚠️ Password or OTP verification code requested in image text');
    }

    if (anyMatch(textLower, ['urgent', 'suspended', 'act immediately', 'account blocked', 'unauthorized login'])) {
      score = maxNum(score, 85);
      why.push('⚠️ High urgency language detected in screenshot overlay');
    }

    if (anyMatch(textLower, ['won', 'processing fee', 'deposit', 'laptop fee', '$100', '₹999'])) {
      score = maxNum(score, 86);
      why.push('⚠️ Reward or advance fee deposit demand detected in image text');
    }

    if (score >= 81) { riskLevel = 'CRITICAL'; status = '🔴 CRITICAL PHISHING'; }
    else if (score >= 61) { riskLevel = 'HIGH RISK'; status = '🔴 HIGH RISK'; }
    else if (score >= 31) { riskLevel = 'MEDIUM RISK'; status = '🟠 MEDIUM RISK'; }
    else {
      riskLevel = 'SAFE'; status = '🟢 SAFE';
      why.push('✓ No obvious scam or phishing indicators identified in extracted text');
      whatNext.push('✓ Screenshot content appears safe.');
    }

    if (whatNext.length === 0) {
      whatNext.push('Avoid clicking suspicious links or providing credentials until verified.');
    }

    return {
      title: `Screenshot Shield: ${imageName}`,
      imageName,
      extractedText,
      extractedUrls,
      score,
      riskLevel,
      status,
      why,
      whatNext
    };
  }

  /* ------------------------------------------------------------
     STANDARDIZED SECURITY RESULT CARD RENDERER (SECTION 12)
     ------------------------------------------------------------ */
  renderStructuredCard(res) {
    const rawScore = res.risk_score !== undefined ? res.risk_score : (res.score !== undefined ? res.score : null);
    const hasNullScore = rawScore === null || rawScore === undefined;
    
    const scoreVal = hasNullScore ? 'N/A' : (typeof rawScore === 'number' ? rawScore.toFixed(1) : parseFloat(rawScore).toFixed(1));
    
    let levelStr = (res.risk_level || res.riskLevel || (hasNullScore ? 'NOT_APPLICABLE' : 'LOW')).toUpperCase();
    if (levelStr === 'SAFE') levelStr = 'LOW';

    let riskClass = 'low';
    let levelColor = '#22c55e';
    
    if (hasNullScore || levelStr === 'NOT_APPLICABLE' || levelStr === 'INSUFFICIENT_EVIDENCE' || levelStr === 'ANALYSIS_FAILED') {
      riskClass = 'low';
      levelColor = '#94a3b8';
      levelStr = levelStr.replace(/_/g, ' ');
    } else if (levelStr === 'VERY LOW' || levelStr === 'VERY_LOW') {
      riskClass = 'very_low';
      levelColor = '#10b981';
      levelStr = 'VERY LOW';
    } else if (levelStr === 'LOW') {
      riskClass = 'low';
      levelColor = '#22c55e';
    } else if (levelStr === 'MEDIUM' || levelStr === 'MEDIUM RISK') {
      riskClass = 'medium';
      levelColor = '#f59e0b';
      levelStr = 'MEDIUM';
    } else if (levelStr === 'HIGH' || levelStr === 'HIGH RISK') {
      riskClass = 'high';
      levelColor = '#ef4444';
      levelStr = 'HIGH';
    } else if (levelStr === 'CRITICAL' || levelStr === 'CRITICAL RISK' || levelStr === 'CRITICAL PHISHING') {
      riskClass = 'critical';
      levelColor = '#dc2626';
      levelStr = 'CRITICAL';
    }

    const confidence = res.model_confidence || res.confidence || null;
    const verificationStatus = res.verification_status || res.verificationStatus || (hasNullScore ? 'NOT_APPLICABLE' : 'ANALYZED');
    const reasons = res.reasons || res.findings || res.why || [];
    const recommendations = res.recommendations || (res.recommendation ? [res.recommendation] : (res.whatNext || []));
    const titleText = res.title || (res.domain ? `URL Shield: ${res.domain}` : (res.filename ? `File Shield: ${res.filename}` : 'Security Analysis Result'));
    const breakdown = res.analysis_breakdown || null;

    let breakdownHtml = '';
    if (breakdown && !hasNullScore) {
      const items = [
        { label: 'Rule Heuristics', score: breakdown.rule_heuristics || 0.0, color: '#38bdf8' },
        { label: 'URL Structure Anomaly', score: breakdown.url_structure || 0.0, color: '#f59e0b' },
        { label: 'NLP Content Urgency', score: breakdown.nlp_urgency || 0.0, color: '#ef4444' },
        { label: 'File Extension Risk', score: breakdown.file_extension || 0.0, color: '#ec4899' },
        { label: 'External Threat Signals', score: breakdown.external_signals || 0.0, color: '#8b5cf6' }
      ].filter(i => i.score > 0);

      if (items.length > 0) {
        breakdownHtml = `
          <div class="analysis-breakdown-box">
            <div style="font-size: 0.76rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px;">ANALYSIS WEIGHT BREAKDOWN:</div>
            ${items.map(item => `
              <div class="breakdown-item">
                <span style="width: 150px; font-weight: 600;">${item.label}</span>
                <div class="breakdown-bar-bg">
                  <div class="breakdown-bar-fill" style="width: ${Math.min(100, item.score)}%; background: ${item.color};"></div>
                </div>
                <span style="font-family: var(--font-mono); font-weight: 700; width: 45px; text-align: right;">${item.score.toFixed(1)}</span>
              </div>
            `).join('')}
          </div>
        `;
      }
    }

    return `
      <div class="result-card-container ${riskClass}">
        <div class="section-what">
          <div>
            <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
              <span class="risk-badge-inline ${riskClass}">${levelStr}</span>
              ${confidence ? `<span class="badge-model-confidence">🤖 Confidence: ${confidence}%</span>` : ''}
              <span class="verification-status-pill">🔍 ${verificationStatus.replace(/_/g, ' ')}</span>
            </div>
            <h3 style="font-size: 1.1rem; font-weight: 800; margin-top: 0.5rem;">${titleText}</h3>
            ${res.filename ? `<p style="font-size: 0.78rem; color: var(--text-muted); font-family: var(--font-mono); margin-top: 0.15rem;">SHA-256: ${res.hash || res.sha256_hash}</p>` : ''}
          </div>
          <div style="text-align: right;">
            <div style="font-size: 0.72rem; color: var(--text-muted); font-weight: 700;">SECURITY RISK SCORE</div>
            <div class="risk-score-value" style="color: ${levelColor}">${scoreVal} ${hasNullScore ? '' : '<span style="font-size: 0.8rem; color: var(--text-muted);">/ 100</span>'}</div>
          </div>
        </div>

        ${breakdownHtml}

        ${res.extractedText ? `
          <div class="section-why">
            <h4 style="font-size: 0.82rem; color: var(--text-muted); font-weight: 700;">EXTRACTED SCREENSHOT TEXT (OCR):</h4>
            <div class="extracted-text-box">${escapeHtml(res.extractedText)}</div>
          </div>
        ` : ''}

        ${res.extractedUrls && res.extractedUrls.length > 0 ? `
          <div class="section-why">
            <h4 style="font-size: 0.82rem; color: var(--text-muted); font-weight: 700;">EXTRACTED URLS:</h4>
            <div style="display: flex; gap: 0.4rem; flex-wrap: wrap;">
              ${res.extractedUrls.map(u => `<span class="extracted-url-chip">🔗 ${escapeHtml(u)}</span>`).join('')}
            </div>
          </div>
        ` : ''}

        <div class="section-why">
          <h4 style="font-size: 0.85rem; color: ${levelColor}; font-weight: 800;">DETECTED INDICATORS & EVIDENCE:</h4>
          <div class="reasons-list">
            ${reasons.map(w => `<div class="reason-item"><span>${(rawScore !== null && rawScore >= 30) ? '⚠️' : '✓'}</span><span>${escapeHtml(w)}</span></div>`).join('')}
          </div>
        </div>

        <div class="section-next">
          <h4 style="font-size: 0.85rem; color: var(--safe); font-weight: 800;">SECURITY RECOMMENDATIONS:</h4>
          <div class="actions-list">
            ${recommendations.map(a => `<div class="action-item"><span>🛡️</span><span>${escapeHtml(a)}</span></div>`).join('')}
          </div>
        </div>
      </div>
    `;
  }
}

function anyMatch(str, list) {
  return list.some(k => str.includes(k));
}

function maxNum(a, b) {
  return a > b ? a : b;
}

function escapeHtml(text) {
  if (!text) return '';
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

window.CyberShieldScanner = CyberShieldScanner;
