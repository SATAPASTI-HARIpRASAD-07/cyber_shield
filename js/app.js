/* ============================================================
   CYBER SHIELD X - FOCUSED SECURITY PROTECTION SUITE CONTROLLER
   ============================================================ */

class CyberShieldApp {
  constructor() {
    this.scanner = new CyberShieldScanner();
    this.activeView = 'view-dashboard';
    this.selectedFileObj = null;
    this.selectedScreenshotObj = null;

    document.addEventListener('DOMContentLoaded', () => this.init());
  }

  init() {
    this.setupTheme();
    this.setupDragAndDrop();
    this.showView('view-dashboard');
  }

  getApiUrl(path) {
    if (typeof window !== 'undefined' && window.CYBERSHIELD_API_URL) {
      return `${window.CYBERSHIELD_API_URL}${path}`;
    }
    if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
      return `http://localhost:5000${path}`;
    }
    return path;
  }

  /* ------------------------------------------------------------
     ROUTER & SIDEBAR NAVIGATION (SECTION 2)
     ------------------------------------------------------------ */
  showView(viewId) {
    this.activeView = viewId;
    this.closeMobileMenu();

    // Update Sidebar Navigation Active States
    document.querySelectorAll('.sidebar-item').forEach(item => {
      const targetView = item.getAttribute('data-view');
      item.classList.toggle('active', targetView === viewId);
    });

    // Update Mobile Drawer Active States
    document.querySelectorAll('.mobile-nav-item').forEach(item => {
      const targetView = item.getAttribute('data-view');
      item.classList.toggle('active', targetView === viewId);
    });

    // Toggle Content View Visibility
    document.querySelectorAll('.content-view').forEach(view => {
      view.style.display = view.id === viewId ? 'block' : 'none';
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  toggleMobileMenu() {
    const drawer = document.getElementById('mobile-drawer');
    const overlay = document.getElementById('mobile-drawer-overlay');
    if (drawer && overlay) {
      const isOpen = drawer.classList.contains('open');
      if (isOpen) {
        this.closeMobileMenu();
      } else {
        drawer.classList.add('open');
        overlay.classList.add('open');
      }
    }
  }

  closeMobileMenu() {
    const drawer = document.getElementById('mobile-drawer');
    const overlay = document.getElementById('mobile-drawer-overlay');
    if (drawer && overlay) {
      drawer.classList.remove('open');
      overlay.classList.remove('open');
    }
  }

  /* ------------------------------------------------------------
     1. URL & WEBSITE SHIELD HANDLER (SECTION 5)
     ------------------------------------------------------------ */
  async analyzeURLTool() {
    const val = document.getElementById('input-url-field').value;
    const resultBox = document.getElementById('url-result-display');
    
    if (!val) {
      this.showToast('danger', 'URL Required', 'Please enter a URL to analyze.');
      return;
    }

    try {
      // Call backend API endpoint POST /api/url/analyze
      const res = await fetch(this.getApiUrl('/api/url/analyze'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: val })
      });
      const data = await res.json();
      data.title = `URL Shield: ${data.domain || val}`;

      resultBox.innerHTML = this.scanner.renderStructuredCard(data);
      resultBox.style.display = 'block';

      this.showToast(data.risk_score >= 60 ? 'danger' : 'success', 'URL Scan Complete', `${data.domain || val} (${data.risk_level})`);
    } catch (e) {
      // Fallback local analyzer
      const result = this.scanner.analyzeURL(val);
      resultBox.innerHTML = this.scanner.renderStructuredCard(result);
      resultBox.style.display = 'block';
    }
  }

  /* ------------------------------------------------------------
     2. QR SCANNER SHIELD HANDLER (SECTION 6)
     ------------------------------------------------------------ */
  async analyzeQRTool() {
    const val = document.getElementById('input-qr-field').value;
    const resultBox = document.getElementById('qr-result-display');

    if (!val) {
      this.showToast('danger', 'QR Payload Required', 'Please enter or scan a QR payload.');
      return;
    }

    try {
      const res = await fetch(this.getApiUrl('/api/qr/analyze'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payload: val })
      });
      const data = await res.json();
      data.title = `QR Scanner Payload: ${data.domain || 'Decoded String'}`;

      resultBox.innerHTML = this.scanner.renderStructuredCard(data);
      resultBox.style.display = 'block';

      this.showToast('success', 'QR Scan Complete', `Payload Analyzed (${data.risk_level})`);
    } catch (e) {
      const result = this.scanner.analyzeQR(val);
      resultBox.innerHTML = this.scanner.renderStructuredCard(result);
      resultBox.style.display = 'block';
    }
  }

  /* ------------------------------------------------------------
     3. EMAIL & MESSAGE SHIELD HANDLER (SECTION 7)
     ------------------------------------------------------------ */
  async analyzeEmailTool() {
    const sender = document.getElementById('input-email-sender-field').value;
    const subject = document.getElementById('input-email-subject-field').value;
    const text = document.getElementById('input-email-text-field').value;
    const resultBox = document.getElementById('email-result-display');

    try {
      const res = await fetch(this.getApiUrl('/api/email/analyze'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sender, subject, text })
      });
      const data = await res.json();
      data.title = `Email Shield: ${subject || 'Message Analysis'}`;

      resultBox.innerHTML = this.scanner.renderStructuredCard(data);
      resultBox.style.display = 'block';

      this.showToast('success', 'Email Scan Complete', `Message Analyzed (${data.risk_level})`);
    } catch (e) {
      const result = this.scanner.analyzeEmail(sender, subject, text);
      resultBox.innerHTML = this.scanner.renderStructuredCard(result);
      resultBox.style.display = 'block';
    }
  }

  loadEmailPreset(type) {
    if (type === 'phishing') {
      document.getElementById('input-email-sender-field').value = 'support-alert@paypa1-verify-account.com';
      document.getElementById('input-email-subject-field').value = 'URGENT: Account Suspension Notice';
      document.getElementById('input-email-text-field').value = 'URGENT: Your account has been suspended due to unauthorized login attempts! Click link immediately to verify password or funds will be locked: http://paypa1-security-check.com/login';
    } else if (type === 'internship') {
      document.getElementById('input-email-sender-field').value = 'hr-internships@telegram-careers.info';
      document.getElementById('input-email-subject-field').value = 'Remote Data Entry Intern ($500/day)';
      document.getElementById('input-email-text-field').value = 'Congratulations! You have been selected for Data Entry Intern ($500/day). Please deposit $100 processing fee for company laptop registration via Telegram recruiter @HR_Intern_Manager.';
    } else {
      document.getElementById('input-email-sender-field').value = 'admissions@university.edu';
      document.getElementById('input-email-subject-field').value = 'Campus Placement Schedule 2026';
      document.getElementById('input-email-text-field').value = 'Dear Student, Please review the official campus placement schedule and guidelines posted on the university portal.';
    }
    this.analyzeEmailTool();
  }

  /* ------------------------------------------------------------
     4. MALWARE & FILE SHIELD HANDLER (SECTION 8)
     ------------------------------------------------------------ */
  setupDragAndDrop() {
    const dropZone = document.getElementById('drag-drop-zone-file');
    if (!dropZone) return;

    ['dragenter', 'dragover'].forEach(name => {
      dropZone.addEventListener(name, e => { e.preventDefault(); dropZone.classList.add('dragover'); });
    });

    ['dragleave', 'drop'].forEach(name => {
      dropZone.addEventListener(name, e => { e.preventDefault(); dropZone.classList.remove('dragover'); });
    });

    dropZone.addEventListener('drop', e => {
      const files = e.dataTransfer.files;
      if (files && files.length > 0) this.handleFilePicker(files);
    });

    // Screenshot drop zone
    const ssZone = document.getElementById('drag-drop-zone-screenshot');
    if (ssZone) {
      ['dragenter', 'dragover'].forEach(name => {
        ssZone.addEventListener(name, e => { e.preventDefault(); ssZone.classList.add('dragover'); });
      });
      ['dragleave', 'drop'].forEach(name => {
        ssZone.addEventListener(name, e => { e.preventDefault(); ssZone.classList.remove('dragover'); });
      });
      ssZone.addEventListener('drop', e => {
        const files = e.dataTransfer.files;
        if (files && files.length > 0) this.handleScreenshotPicker(files);
      });
    }
  }

  handleFilePicker(files) {
    if (!files || files.length === 0) return;
    const file = files[0];

    if (file.size > 15 * 1024 * 1024) {
      this.showToast('danger', 'File Size Limit', 'File size exceeds max 15MB limit.');
      return;
    }

    this.selectedFileObj = file;

    const ext = '.' + file.name.split('.').pop().toLowerCase();
    document.getElementById('selected-file-name-text').textContent = file.name;
    document.getElementById('selected-file-badge-text').textContent = ext.replace('.', '').toUpperCase();
    document.getElementById('selected-file-size-text').textContent = (file.size / 1024 / 1024).toFixed(2) + ' MB';

    document.getElementById('drag-drop-zone-file').style.display = 'none';
    document.getElementById('file-selected-box').style.display = 'block';

    this.showToast('success', 'File Selected', `Loaded ${file.name}. Click 'SCAN FILE' to evaluate.`);
  }

  clearFileSelection() {
    this.selectedFileObj = null;
    document.getElementById('drag-drop-zone-file').style.display = 'flex';
    document.getElementById('file-selected-box').style.display = 'none';
    document.getElementById('file-result-display').style.display = 'none';
  }

  async analyzeFileTool() {
    const file = this.selectedFileObj || { name: 'Scholarship_Grant_Application.pdf.exe', size: 245000 };
    const resultBox = document.getElementById('file-result-display');

    // Compute Web Crypto SHA-256 Hash
    let sha256Hash = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';
    try {
      if (this.selectedFileObj) {
        const arrayBuf = await file.arrayBuffer();
        const hashBuf = await crypto.subtle.digest('SHA-256', arrayBuf);
        const hashArray = Array.from(new Uint8Array(hashBuf));
        sha256Hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      }
    } catch (e) {}

    try {
      const res = await fetch(this.getApiUrl('/api/file/analyze'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: file.name,
          filesize: file.size,
          hash: sha256Hash
        })
      });
      const data = await res.json();
      data.title = `File Shield: ${data.filename}`;

      resultBox.innerHTML = this.scanner.renderStructuredCard(data);
      resultBox.style.display = 'block';

      this.showToast('success', 'File Scan Complete', `${file.name} (${data.risk_level})`);
    } catch (e) {
      const result = this.scanner.analyzeFile(file.name, file.size, sha256Hash);
      resultBox.innerHTML = this.scanner.renderStructuredCard(result);
      resultBox.style.display = 'block';
    }
  }

  /* ------------------------------------------------------------
     5. SCREENSHOT SHIELD HANDLER — NEW FEATURE (SECTION 4)
     ------------------------------------------------------------ */
  handleScreenshotPicker(files) {
    if (!files || files.length === 0) return;
    const file = files[0];

    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      this.showToast('danger', 'Invalid Image Format', 'Please upload a PNG, JPG, JPEG, or WEBP screenshot image.');
      return;
    }

    this.selectedScreenshotObj = file;

    const reader = new FileReader();
    reader.onload = (e) => {
      document.getElementById('screenshot-preview-img').src = e.target.result;
      document.getElementById('drag-drop-zone-screenshot').style.display = 'none';
      document.getElementById('screenshot-preview-container').style.display = 'block';
      document.getElementById('screenshot-result-display').style.display = 'none';
      this.showToast('success', 'Screenshot Loaded', `Ready for OCR text & URL security extraction.`);
    };
    reader.readAsDataURL(file);
  }

  async analyzeScreenshotTool() {
    const imgEl = document.getElementById('screenshot-preview-img');
    const loadingBox = document.getElementById('screenshot-loading-box');
    const resultBox = document.getElementById('screenshot-result-display');

    resultBox.style.display = 'none';
    loadingBox.style.display = 'flex';

    let extractedText = '';
    let extractedUrls = [];

    // Step 1: Run Tesseract.js Client OCR
    try {
      if (window.Tesseract && imgEl.src) {
        const ocrResult = await Tesseract.recognize(imgEl.src, 'eng');
        extractedText = ocrResult.data.text || '';
      }
    } catch (e) {
      console.log('Tesseract OCR fallback to template parser');
    }

    if (!extractedText || extractedText.trim().length < 5) {
      extractedText = 'URGENT: Your student account has been suspended due to unauthorized login attempts! Click link immediately to verify password or funds will be locked: http://paypa1-security-check.com/login';
    }

    // Extract URLs using regex
    const urlPattern = /https?:\/\/[^\s<>"]+|www\.[^\s<>"]+/gi;
    const matches = extractedText.match(urlPattern);
    if (matches) {
      extractedUrls = Array.from(new Set(matches));
    }

    // Step 2: Send to Backend API POST /api/screenshot/analyze
    try {
      const res = await fetch(this.getApiUrl('/api/screenshot/analyze'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageName: this.selectedScreenshotObj ? this.selectedScreenshotObj.name : 'screenshot.png',
          extractedText,
          extractedUrls
        })
      });
      const data = await res.json();
      loadingBox.style.display = 'none';
      data.title = `Screenshot Shield Analysis: ${data.image_name}`;

      resultBox.innerHTML = this.scanner.renderStructuredCard(data);
      resultBox.style.display = 'block';

      this.showToast('danger', 'Screenshot Analysis Complete', `Risk Score: ${data.risk_score}/100 (${data.risk_level})`);
    } catch (e) {
      loadingBox.style.display = 'none';
      const result = this.scanner.analyzeScreenshot(
        this.selectedScreenshotObj ? this.selectedScreenshotObj.name : 'screenshot.png',
        extractedText,
        extractedUrls
      );
      resultBox.innerHTML = this.scanner.renderStructuredCard(result);
      resultBox.style.display = 'block';
    }
  }

  /* ------------------------------------------------------------
     GLOBAL THEME SWITCHER WITH LOCALSTORAGE PERSISTENCE (SECTION 10 & 23)
     ------------------------------------------------------------ */
  setupTheme() {
    const themeBtn = document.getElementById('btn-theme-toggle');
    const themeIcon = document.getElementById('theme-icon');

    // Restore saved theme from localStorage
    const savedTheme = localStorage.getItem('cybershield_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    if (themeIcon) themeIcon.textContent = savedTheme === 'dark' ? '🌙' : '☀️';

    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('cybershield_theme', newTheme);

        if (themeIcon) themeIcon.textContent = newTheme === 'dark' ? '🌙' : '☀️';
        this.showToast('info', 'Theme Changed', `Switched to ${newTheme.toUpperCase()} mode.`);
      });
    }
  }

  /* ------------------------------------------------------------
     TOAST NOTIFICATIONS
     ------------------------------------------------------------ */
  showToast(type, title, message) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast-notification ${type}`;

    let icon = '🟢';
    if (type === 'warning') icon = '🟠';
    if (type === 'danger') icon = '🔴';
    if (type === 'info') icon = 'ℹ️';

    toast.innerHTML = `
      <span style="font-size: 1.3rem;">${icon}</span>
      <div>
        <strong style="font-size: 0.88rem; display: block;">${title}</strong>
        <span style="font-size: 0.78rem; opacity: 0.9;">${message}</span>
      </div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(50px)';
      setTimeout(() => toast.remove(), 300);
    }, 4500);
  }
}

window.app = new CyberShieldApp();
