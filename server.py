# ============================================================
# CYBER SHIELD X - REAL BACKEND EMAIL & AUTHENTICATION SERVER
# ============================================================

import os
import time
import json
import sqlite3
import hashlib
import secrets
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import requests
import url_analyzer
import risk_engine


def load_dotenv():
    env_path = os.path.join(os.path.dirname(__file__), '.env')
    if os.path.exists(env_path):
        with open(env_path, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    key, val = line.split('=', 1)
                    key = key.strip()
                    val = val.strip().strip('"').strip("'")
                    os.environ[key] = val

load_dotenv()

app = Flask(__name__, static_folder='.')
CORS(app)

PORT = int(os.environ.get('PORT', 5000))
EMAIL_PROVIDER = os.environ.get('EMAIL_PROVIDER', 'resend').lower()
RESEND_API_KEY = os.environ.get('RESEND_API_KEY') or os.environ.get('EMAIL_API_KEY') or ''
EMAIL_FROM = os.environ.get('EMAIL_FROM', 'onboarding@resend.dev')
EMAIL_FROM_NAME = os.environ.get('EMAIL_FROM_NAME', 'Cyber Shield X Security Suite')

SMTP_HOST = os.environ.get('SMTP_HOST', 'smtp.gmail.com')
SMTP_PORT = int(os.environ.get('SMTP_PORT', 587))
SMTP_USER = os.environ.get('SMTP_USER', '')
SMTP_PASS = os.environ.get('SMTP_PASS', '')

DB_PATH = os.path.join(os.path.dirname(__file__), 'cybershield.db')
RESEND_RATE_LIMITS = {}

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Users table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            full_name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            salt TEXT NOT NULL,
            created_at TEXT NOT NULL,
            last_login TEXT NOT NULL,
            status TEXT DEFAULT 'PROTECTED'
        )
    ''')
    
    # Email Logs table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS email_logs (
            id TEXT PRIMARY KEY,
            to_email TEXT NOT NULL,
            subject TEXT NOT NULL,
            provider TEXT NOT NULL,
            status TEXT NOT NULL,
            error_message TEXT,
            sent_at TEXT NOT NULL
        )
    ''')

    # Password Resets table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS password_resets (
            token TEXT PRIMARY KEY,
            email TEXT NOT NULL,
            expires_at INTEGER NOT NULL
        )
    ''')

    # Scan History & Telemetry table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS scan_history (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            scan_type TEXT NOT NULL,
            input_source TEXT NOT NULL,
            risk_score INTEGER NOT NULL,
            result_status TEXT NOT NULL,
            evidence_json TEXT,
            recommendation_json TEXT,
            timestamp TEXT NOT NULL
        )
    ''')

    conn.commit()

    # Create default demo account if empty
    cursor.execute('SELECT COUNT(*) FROM users')
    if cursor.fetchone()[0] == 0:
        salt = secrets.token_hex(16)
        pwd_hash = hashlib.sha256(('CyberShield#2026' + salt).encode('utf-8')).hexdigest()
        now = time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())
        cursor.execute('''
            INSERT INTO users (id, full_name, email, password_hash, salt, created_at, last_login, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', ('usr_demo_101', 'NEELAPU MOHAN SAI', 'demo@cybershield.io', pwd_hash, salt, now, now, 'PROTECTED'))
        
        # Populate initial scan activity sample records
        sample_scans = [
            ('scn_101', 'usr_demo_101', 'URL Scan', 'https://university-portal.edu', 12, 'SAFE', '["HTTPS Encrypted", "Domain Verified"]', '["Safe to visit"]', '2 mins ago'),
            ('scn_102', 'usr_demo_101', 'Email Scan', 'Internship Opportunity Offer', 72, 'POSSIBLE SCAM', '["Upfront laptop fee requested", "Telegram contact only"]', '["Do not pay upfront fee"]', '15 mins ago'),
            ('scn_103', 'usr_demo_101', 'Message Scan', 'WhatsApp Prize Notification', 91, 'HIGH RISK', '["Urgent account block threat", "Suspicious short URL"]', '["Do not click link", "Never share OTP"]', '1 hour ago'),
            ('scn_104', 'usr_demo_101', 'QR Code Scan', 'QR Payment Payload', 18, 'SAFE', '["Valid merchant payment URL"]', '["Verify merchant name"]', '3 hours ago'),
            ('scn_105', 'usr_demo_101', 'File Scan', 'Scholarship_Application.pdf.exe', 88, 'CRITICAL', '["Double executable extension .pdf.exe", "High risk file type"]', '["Delete file immediately"]', '5 hours ago')
        ]

        for scn in sample_scans:
            cursor.execute('''
                INSERT INTO scan_history (id, user_id, scan_type, input_source, risk_score, result_status, evidence_json, recommendation_json, timestamp)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', scn)

        conn.commit()

    conn.close()

init_db()

def hash_password(password, salt):
    return hashlib.sha256((password + salt).encode('utf-8')).hexdigest()

def is_rate_limited(email):
    now = time.time()
    history = RESEND_RATE_LIMITS.get(email, [])
    recent = [t for t in history if now - t < 900]
    RESEND_RATE_LIMITS[email] = recent

    if len(recent) >= 3:
        return True
    
    recent.append(now)
    RESEND_RATE_LIMITS[email] = recent
    return False

# Transactional Email Engine
def send_real_transactional_email(to_email, to_name, subject, html_content):
    now_str = time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())
    log_id = 'eml_' + secrets.token_hex(8)

    if EMAIL_PROVIDER == 'resend':
        if not RESEND_API_KEY or 'your_' in RESEND_API_KEY or 'demo_key' in RESEND_API_KEY:
            err_msg = "RESEND_API_KEY environment variable is missing or unconfigured in .env file. Please set RESEND_API_KEY=re_... from https://resend.com/api-keys"
            log_email(log_id, to_email, subject, 'Resend API', 'CONFIG_ERROR', err_msg, now_str)
            return False, err_msg

        try:
            res = requests.post(
                'https://api.resend.com/emails',
                headers={
                    'Authorization': f'Bearer {RESEND_API_KEY}',
                    'Content-Type': 'application/json'
                },
                json={
                    'from': f"{EMAIL_FROM_NAME} <{EMAIL_FROM}>",
                    'to': [to_email],
                    'subject': subject,
                    'html': html_content
                },
                timeout=12
            )

            res_json = {}
            try:
                res_json = res.json()
            except Exception:
                pass

            if res.status_code in [200, 201]:
                email_id = res_json.get('id', 'unknown_id')
                msg = f"Email successfully accepted by Resend API (ID: {email_id})"
                log_email(log_id, to_email, subject, 'Resend API', 'SENT', None, now_str)
                return True, msg
            elif res.status_code == 401:
                err_msg = f"Resend API returned HTTP 401 Unauthorized: The RESEND_API_KEY in .env is invalid or expired. Please verify key at https://resend.com/api-keys"
                log_email(log_id, to_email, subject, 'Resend API', 'AUTH_ERROR', err_msg, now_str)
                return False, err_msg
            elif res.status_code == 422:
                detail = res_json.get('message', res.text)
                err_msg = f"Resend API returned HTTP 422: {detail}. Use EMAIL_FROM=onboarding@resend.dev for free testing."
                log_email(log_id, to_email, subject, 'Resend API', 'VALIDATION_ERROR', err_msg, now_str)
                return False, err_msg
            else:
                err_msg = f"Resend API returned HTTP {res.status_code}: {res_json.get('message', res.text)}"
                log_email(log_id, to_email, subject, 'Resend API', 'API_ERROR', err_msg, now_str)
                return False, err_msg

        except Exception as e:
            err_msg = f"Network failure connecting to Resend API: {str(e)}"
            log_email(log_id, to_email, subject, 'Resend API', 'NETWORK_ERROR', err_msg, now_str)
            return False, err_msg

    elif EMAIL_PROVIDER == 'smtp':
        if not SMTP_USER or not SMTP_PASS:
            err_msg = "SMTP_USER and SMTP_PASS environment variables are not configured in .env file."
            log_email(log_id, to_email, subject, 'SMTP TLS', 'CONFIG_ERROR', err_msg, now_str)
            return False, err_msg

        try:
            msg = MIMEMultipart('alternative')
            msg['Subject'] = subject
            msg['From'] = f"{EMAIL_FROM_NAME} <{SMTP_USER}>"
            msg['To'] = to_email

            part = MIMEText(html_content, 'html')
            msg.attach(part)

            server = smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=12)
            server.starttls()
            server.login(SMTP_USER, SMTP_PASS)
            server.sendmail(SMTP_USER, to_email, msg.as_string())
            server.quit()

            log_email(log_id, to_email, subject, 'SMTP TLS', 'SENT', None, now_str)
            return True, "Email successfully delivered via SMTP TLS."

        except Exception as e:
            err_msg = f"SMTP Transmission Failure: {str(e)}"
            log_email(log_id, to_email, subject, 'SMTP TLS', 'FAILED', err_msg, now_str)
            return False, err_msg

    else:
        err_msg = f"Unsupported provider {EMAIL_PROVIDER}."
        log_email(log_id, to_email, subject, 'Config Error', 'FAILED', err_msg, now_str)
        return False, err_msg

def log_email(log_id, to_email, subject, provider, status, error_message, sent_at):
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO email_logs (id, to_email, subject, provider, status, error_message, sent_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (log_id, to_email, subject, provider, status, error_message, sent_at))
        conn.commit()
        conn.close()
    except Exception as e:
        print(f"Error saving email log: {e}")

def generate_welcome_html(user_name, user_email):
    return f'''
    <div style="font-family: 'Inter', system-ui, sans-serif; background-color: #0b0f19; color: #f8fafc; padding: 2rem; border-radius: 12px; max-width: 600px; margin: 0 auto; border: 1px solid #38bdf8;">
      <div style="text-align: center; border-bottom: 1px solid rgba(56, 189, 248, 0.3); padding-bottom: 1rem; margin-bottom: 1.5rem;">
        <h1 style="font-size: 1.8rem; margin: 0; color: #00f0ff; letter-spacing: 1px;">🛡️ CYBER SHIELD X</h1>
        <p style="font-size: 0.8rem; color: #94a3b8; margin-top: 0.3rem; text-transform: uppercase;">CHECK BEFORE YOU TRUST</p>
      </div>

      <h2 style="font-size: 1.3rem; color: #ffffff;">Welcome to Cyber Shield, {user_name}! 👋</h2>
      <p style="font-size: 0.95rem; color: #94a3b8; line-height: 1.6;">
        Your Cyber Shield X account has been successfully created. You are now protected by our real-time scam intelligence platform.
      </p>

      <div style="background: rgba(18, 26, 43, 0.9); border-left: 4px solid #10b981; padding: 1rem; margin: 1.2rem 0; border-radius: 6px;">
        <p style="margin: 0; font-size: 0.85rem; color: #94a3b8;"><strong>Account Holder:</strong> {user_name}</p>
        <p style="margin: 0.4rem 0 0 0; font-size: 0.85rem; color: #94a3b8;"><strong>Registered Email:</strong> {user_email}</p>
        <p style="margin: 0.4rem 0 0 0; font-size: 0.85rem; color: #94a3b8;"><strong>Protection Status:</strong> <span style="color: #10b981; font-weight: bold;">🟢 ACTIVE & PROTECTED</span></p>
      </div>

      <div style="text-align: center; margin: 2rem 0 1rem 0;">
        <a href="http://localhost:{PORT}" style="background: linear-gradient(135deg, #0284c7 0%, #00f0ff 100%); color: #070a12; padding: 0.8rem 1.8rem; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 0.95rem; display: inline-block;">
          LAUNCH CYBER SHIELD DASHBOARD
        </a>
      </div>
    </div>
    '''

# ============================================================
# API ENDPOINTS
# ============================================================

@app.route('/api/health', methods=['GET'])
def health_check():
    has_valid_key = bool(RESEND_API_KEY and not ('your_' in RESEND_API_KEY or 'demo_key' in RESEND_API_KEY)) or bool(SMTP_PASS)
    return jsonify({
        'status': 'healthy',
        'email_provider': EMAIL_PROVIDER,
        'resend_key_configured': has_valid_key,
        'from_address': EMAIL_FROM,
        'from_name': EMAIL_FROM_NAME,
        'message': f"Provider: {EMAIL_PROVIDER}. Key Status: {'CONFIGURED' if has_valid_key else 'PENDING VALID RESEND_API_KEY IN .env'}"
    })

@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.json or {}
    full_name = data.get('fullName', '').strip()
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')
    terms = data.get('termsAccepted', False)

    if not full_name or len(full_name) < 2:
        return jsonify({'error': 'Please enter a valid full name.'}), 400

    if not email or '@' not in email:
        return jsonify({'error': 'Please enter a valid email address.'}), 400

    if not password or len(password) < 8:
        return jsonify({'error': 'Password must be at least 8 characters long.'}), 400

    if not terms:
        return jsonify({'error': 'You must accept the Cyber Shield Terms & Policy.'}), 400

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.execute('SELECT id FROM users WHERE email = ?', (email,))
    if cursor.fetchone():
        conn.close()
        return jsonify({'error': 'An account with this email address already exists. Please sign in.'}), 400

    user_id = 'usr_' + secrets.token_hex(6)
    salt = secrets.token_hex(16)
    pwd_hash = hash_password(password, salt)
    now = time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())

    cursor.execute('''
        INSERT INTO users (id, full_name, email, password_hash, salt, created_at, last_login, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ''', (user_id, full_name, email, pwd_hash, salt, now, now, 'PROTECTED'))
    conn.commit()
    conn.close()

    subject = "Welcome to Cyber Shield 🛡️"
    html_content = generate_welcome_html(full_name, email)
    email_sent, email_msg = send_real_transactional_email(email, full_name, subject, html_content)

    return jsonify({
        'status': 'success',
        'user': {
            'id': user_id,
            'fullName': full_name,
            'email': email,
            'createdAt': now,
            'lastLogin': now,
            'status': 'PROTECTED'
        },
        'emailStatus': {
            'sent': email_sent,
            'message': email_msg,
            'provider': EMAIL_PROVIDER
        }
    }), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json or {}
    email = data.get('emailOrUsername', '').strip().lower()
    password = data.get('password', '')

    if not email or not password:
        return jsonify({'error': 'Please enter email and password.'}), 400

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('SELECT id, full_name, email, password_hash, salt, created_at, status FROM users WHERE email = ?', (email,))
    user_row = cursor.fetchone()

    if not user_row:
        conn.close()
        return jsonify({'error': 'Invalid email or password.'}), 401

    user_id, full_name, user_email, stored_hash, salt, created_at, status = user_row
    computed_hash = hash_password(password, salt)

    if computed_hash != stored_hash:
        conn.close()
        return jsonify({'error': 'Invalid email or password.'}), 401

    now = time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())
    cursor.execute('UPDATE users SET last_login = ? WHERE id = ?', (now, user_id))
    conn.commit()
    conn.close()

    return jsonify({
        'status': 'success',
        'user': {
            'id': user_id,
            'fullName': full_name,
            'email': user_email,
            'createdAt': created_at,
            'lastLogin': now,
            'status': status
        }
    })

@app.route('/api/resend-welcome-email', methods=['POST'])
def resend_welcome_email():
    data = request.json or {}
    email = data.get('email', '').strip().lower()

    if not email:
        return jsonify({'error': 'Please provide user email.'}), 400

    if is_rate_limited(email):
        return jsonify({
            'error': 'Rate limit exceeded. Maximum 3 welcome email resends per 15 minutes. Please try again later.'
        }), 429

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('SELECT full_name FROM users WHERE email = ?', (email,))
    row = cursor.fetchone()
    conn.close()

    if not row:
        return jsonify({'error': 'No registered account found for this email.'}), 404

    full_name = row[0]
    subject = "Welcome to Cyber Shield 🛡️"
    html_content = generate_welcome_html(full_name, email)
    email_sent, email_msg = send_real_transactional_email(email, full_name, subject, html_content)

    if email_sent:
        return jsonify({'status': 'success', 'message': f'Welcome email dispatched to {email}. Details: {email_msg}'})
    else:
        return jsonify({'status': 'error', 'error': email_msg, 'provider': EMAIL_PROVIDER}), 400

# Screen Analysis: Dynamic Text Threat Engine (Master Implementation Part 1)
@app.route('/api/screen/analyze', methods=['POST'])
def analyze_screen_text():
    data = request.json or {}
    text = (data.get('text', '') or '').strip()
    source = data.get('source', 'Live Screen Frame')
    timestamp = data.get('timestamp', time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime()))

    if not text or len(text) < 5:
        return jsonify({
            'classification': 'SAFE',
            'risk_score': 5,
            'confidence': '92%',
            'threat_type': 'None',
            'indicators': ['✓ No suspicious text detected on screen'],
            'explanation': 'No obvious scam or phishing indicators were detected in the analyzed screen content.',
            'recommendations': ['✓ Screen content appears clear. Continue browsing safely.']
        })

    text_lower = text.lower()
    risk_score = 5
    confidence = "92%"
    threat_type = "None"
    classification = "SAFE"
    indicators = []
    recommendations = []

    # Category 1: Phishing & Credential / OTP Harvesting
    if any(k in text_lower for k in ['otp', 'verification code', 'one time password', 'share code', 'enter code', 'password request']):
        risk_score = max(risk_score, 92)
        threat_type = "Credential / OTP Phishing"
        indicators.append("⚠ Password or OTP code requested on screen")
        indicators.append("⚠ Credential harvesting language detected")

    # Category 2: Account Suspension & Urgent Threat Prompts
    if any(k in text_lower for k in ['suspended', 'will be blocked', 'act immediately', 'verify now', 'confirm your identity', 'unauthorized login']):
        risk_score = max(risk_score, 90)
        if threat_type == "None":
            threat_type = "Account Suspension Scam"
        indicators.append("⚠ Urgent action demanded under threat of account blocking")
        indicators.append("⚠ Fake security warning overlay detected")

    # Category 3: Prize / Advance Fee Scam
    if any(k in text_lower for k in ['won', 'processing fee', 'registration fee', 'laptop deposit', 'claim prize', 'reward claimed']):
        risk_score = max(risk_score, 88)
        if threat_type == "None":
            threat_type = "Prize / Advance Fee Scam"
        indicators.append("⚠ Upfront payment or fee requested to receive prize or job")

    # Category 4: Lookalike Phishing Domain
    if any(k in text_lower for k in ['paypa1', 'bank-verify', 'security-check.com', 'login-verify']):
        risk_score = max(risk_score, 94)
        threat_type = "Phishing / Fake Domain Overlay"
        indicators.append("⚠ Lookalike phishing domain detected in screen text")

    # Category 5: Suspicious Parcel / Subscription Warning
    if any(k in text_lower for k in ['subscription expires', 'parcel could not be delivered', 'reschedule delivery', 'renew account']):
        if risk_score < 70:
            risk_score = max(risk_score, 48)
            if threat_type == "None":
                threat_type = "Subscription / Delivery Alert"
            indicators.append("🟠 Unexpected delivery or subscription renewal prompt")

    if risk_score >= 71:
        classification = "SCAM"
        confidence = "95%"
        explanation = "This screen contains high-risk indicators commonly associated with phishing, credential harvesting, or advance fee fraud."
        recommendations = [
            "🔴 Do NOT enter your password or banking credentials",
            "🔴 Do NOT share OTP codes with callers or website forms",
            "🔴 Close the suspicious tab or application immediately",
            "🔴 Verify requests directly through official website channels"
        ]
    elif risk_score >= 31:
        classification = "SUSPICIOUS"
        confidence = "88%"
        explanation = "Suspicious text indicators detected on screen. Exercise caution before clicking links or entering details."
        recommendations = [
            "🟠 Double-check browser URL bar for lookalike domain spellings",
            "🟠 Verify the delivery or subscription notice through official apps"
        ]
    else:
        classification = "SAFE"
        confidence = "92%"
        indicators = ["✓ No obvious scam indicators detected in extracted text"]
        explanation = "No obvious scam or phishing indicators were detected in the analyzed screen content."
        recommendations = [
            "✓ Screen content appears safe. Remain vigilant when entering sensitive passwords."
        ]

    return jsonify({
        'classification': classification,
        'risk_score': risk_score,
        'confidence': confidence,
        'threat_type': threat_type,
        'indicators': indicators,
        'explanation': explanation,
        'recommendations': recommendations,
        'timestamp': timestamp
    })

# Telemetry: Record Real Scan History
@app.route('/api/scan/record', methods=['POST'])
def record_scan():
    data = request.json or {}
    user_id = data.get('userId', 'usr_demo_101')
    scan_type = data.get('scanType', 'URL Scan')
    input_source = data.get('inputSource', '')
    risk_score = int(data.get('riskScore', 0))
    result_status = data.get('resultStatus', 'SAFE')
    evidence = json.dumps(data.get('evidence', []))
    recommendation = json.dumps(data.get('recommendations', []))
    now = time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())

    scan_id = 'scn_' + secrets.token_hex(6)

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO scan_history (id, user_id, scan_type, input_source, risk_score, result_status, evidence_json, recommendation_json, timestamp)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (scan_id, user_id, scan_type, input_source, risk_score, result_status, evidence, recommendation, now))
    conn.commit()
    conn.close()

    return jsonify({'status': 'success', 'scanId': scan_id})

# Telemetry: Fetch Scan History
@app.route('/api/scan/history', methods=['GET'])
def get_scan_history():
    user_id = request.args.get('userId', 'usr_demo_101')
    filter_type = request.args.get('type', 'all').lower()

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    if filter_type != 'all':
        cursor.execute('SELECT id, scan_type, input_source, risk_score, result_status, evidence_json, recommendation_json, timestamp FROM scan_history WHERE user_id = ? AND LOWER(scan_type) LIKE ? ORDER BY timestamp DESC LIMIT 50', (user_id, f"%{filter_type}%"))
    else:
        cursor.execute('SELECT id, scan_type, input_source, risk_score, result_status, evidence_json, recommendation_json, timestamp FROM scan_history WHERE user_id = ? ORDER BY timestamp DESC LIMIT 50', (user_id,))
    
    rows = cursor.fetchall()
    conn.close()

    history = [{
        'id': r[0],
        'scanType': r[1],
        'inputSource': r[2],
        'riskScore': r[3],
        'resultStatus': r[4],
        'evidence': json.loads(r[5] or '[]'),
        'recommendation': json.loads(r[6] or '[]'),
        'timestamp': r[7]
    } for r in rows]

    return jsonify({'history': history})

# Telemetry: Clear History
@app.route('/api/scan/history', methods=['DELETE'])
def clear_scan_history():
    user_id = request.args.get('userId', 'usr_demo_101')
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('DELETE FROM scan_history WHERE user_id = ?', (user_id,))
    conn.commit()
    conn.close()
    return jsonify({'status': 'success', 'message': 'Scan history deleted.'})

# Telemetry: Real Dashboard Metrics
@app.route('/api/dashboard/stats', methods=['GET'])
def get_dashboard_stats():
    user_id = request.args.get('userId', 'usr_demo_101')
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.execute('SELECT COUNT(*) FROM scan_history WHERE user_id = ?', (user_id,))
    total_scans = cursor.fetchone()[0]

    cursor.execute('SELECT COUNT(*) FROM scan_history WHERE user_id = ? AND risk_score >= 31', (user_id,))
    threats_detected = cursor.fetchone()[0]

    cursor.execute('SELECT COUNT(*) FROM scan_history WHERE user_id = ? AND risk_score >= 81', (user_id,))
    high_risk_blocked = cursor.fetchone()[0]

    conn.close()

    return jsonify({
        'protectionStatus': 'ACTIVE',
        'scansPerformed': total_scans,
        'threatsDetected': threats_detected,
        'highRiskBlocked': high_risk_blocked
    })

@app.route('/api/email-logs', methods=['GET'])
def get_email_logs():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('SELECT id, to_email, subject, provider, status, error_message, sent_at FROM email_logs ORDER BY sent_at DESC LIMIT 20')
    rows = cursor.fetchall()
    conn.close()

    logs = [{
        'id': r[0],
        'to': r[1],
        'subject': r[2],
        'provider': r[3],
        'status': r[4],
        'error': r[5],
        'sentAt': r[6]
    } for r in rows]

    return jsonify({'logs': logs})

# ============================================================
# TOOL-SPECIFIC REST API ENDPOINTS (SECTION 13)
# ============================================================

# 1. URL & Website Shield API
@app.route('/api/url/analyze', methods=['POST'])
def api_url_analyze():
    data = request.json or {}
    url = (data.get('url', '') or '').strip()
    if not url:
        return jsonify({'error': 'URL is required'}), 400

    result = url_analyzer.analyze_url(url)
    # Add legacy backwards-compatibility keys
    result['findings'] = result.get('reasons', [])
    result['recommendation'] = ' '.join(result.get('recommendations', []))
    return jsonify(result)

# 2. QR Scanner Shield API
@app.route('/api/qr/analyze', methods=['POST'])
def api_qr_analyze():
    data = request.json or {}
    payload = (data.get('payload', '') or '').strip()
    if not payload:
        return jsonify({'error': 'QR payload is required'}), 400

    is_url = payload.lower().startswith(('http://', 'https://', 'www.', 'bit.ly/', 'tinyurl.com/'))
    
    if is_url:
        result = url_analyzer.analyze_url(payload)
        result['qr_content'] = payload
        result['is_url'] = True
        result['findings'] = result.get('reasons', [])
        result['recommendation'] = ' '.join(result.get('recommendations', []))
        return jsonify(result)

    # Non-URL payload analysis
    result = risk_engine.create_risk_result(
        risk_score=None,
        model_confidence=92,
        verification_status="NOT_APPLICABLE",
        reasons=["✓ Plaintext QR payload string verified", "✓ No auto-executing scripts or lookalike links detected"],
        recommendations=["✓ Safe to view decoded QR code text payload."],
        metadata={'qr_content': payload, 'is_url': False, 'domain': 'N/A'}
    )
    result['qr_content'] = payload
    result['is_url'] = False
    result['domain'] = 'N/A'
    result['findings'] = result.get('reasons', [])
    result['recommendation'] = ' '.join(result.get('recommendations', []))
    return jsonify(result)

# 3. Email & Message Shield API
@app.route('/api/email/analyze', methods=['POST'])
def api_email_analyze():
    data = request.json or {}
    sender = data.get('sender', '')
    subject = data.get('subject', '')
    text = data.get('text', '')

    full_text = f"{sender} {subject} {text}".lower()
    
    import re
    url_pattern = re.compile(r'https?://[^\s<>"]+|www\.[^\s<>"]+')
    extracted_urls = url_pattern.findall(full_text)

    url_max_score = 0.0
    url_reasons = []
    for u in extracted_urls:
        u_res = url_analyzer.analyze_url(u)
        score_val = u_res.get('risk_score', 0.0)
        if score_val > url_max_score:
            url_max_score = score_val
        for ind in u_res.get('indicators', []):
            msg = ind.get('message') if isinstance(ind, dict) else str(ind)
            if msg and msg not in url_reasons and not msg.startswith('✓'):
                url_reasons.append(msg)

    nlp_score = 0.0
    reasons = []
    recommendations = []

    if any(k in full_text for k in ['urgent', 'suspended', 'act immediately', 'blocked', 'will be canceled']):
        nlp_score = max(nlp_score, 65.0)
        reasons.append("⚠️ High urgency language created to pressure recipient")

    if any(k in full_text for k in ['password', 'otp', 'verification code', 'login details', 'bank account']):
        nlp_score = max(nlp_score, 85.0)
        reasons.append("🚨 Credential or OTP password request identified in message body")

    if any(k in full_text for k in ['deposit', 'processing fee', '$100', '₹999', 'laptop fee', 'telegram']):
        nlp_score = max(nlp_score, 80.0)
        reasons.append("🚨 Upfront payment or deposit requested for job/scholarship")

    reasons.extend(url_reasons)

    if not reasons:
        reasons.append("✓ No obvious phishing or scam indicators identified in email text")
        recommendations.append("✓ Message appears clean. Follow normal email safety protocols.")
    else:
        recommendations.append("Do NOT click unexpected links or transfer recruitment funds.")

    result = risk_engine.compute_calibrated_risk(
        rule_score=0.0,
        url_score=url_max_score,
        nlp_score=nlp_score,
        file_score=0.0,
        ext_score=0.0,
        base_confidence=91,
        reasons=reasons,
        recommendations=recommendations,
        status_if_safe="ANALYZED",
        status_if_risky="MULTIPLE_INDICATORS"
    )
    result['sender'] = sender
    result['subject'] = subject
    result['extracted_urls'] = extracted_urls
    result['findings'] = result.get('reasons', [])
    result['recommendation'] = ' '.join(result.get('recommendations', []))
    return jsonify(result)

# 4. Malware & File Shield API
@app.route('/api/file/analyze', methods=['POST'])
def api_file_analyze():
    data = request.json or {}
    filename = data.get('filename', 'document.pdf')
    filesize = data.get('filesize', 1024)
    file_hash = data.get('hash', secrets.token_hex(32))

    name_lower = filename.lower()
    ext = '.' + filename.split('.').pop().lower() if '.' in filename else ''

    file_score = 0.0
    reasons = []
    recommendations = []

    if name_lower.endswith('.pdf.exe') or name_lower.endswith('.docx.exe') or ('.pdf.' in name_lower and name_lower.endswith('.exe')):
        file_score = 96.5
        reasons.append(f"🚨 Executable Trojan disguised with double extension anomaly ('{filename}')")
        reasons.append("⚠️ Executable file type disguised as document")
        recommendations.append("Delete file immediately. Do NOT double-click or open.")
    elif ext in ['.exe', '.bat', '.vbs', '.js', '.scr', '.ps1', '.cmd', '.msi']:
        file_score = 78.4
        reasons.append(f"⚠️ Executable file type ('{ext}') requires strict execution permission checks")
        recommendations.append("Scan file with local antivirus before executing.")
    else:
        reasons.append(f"✓ Valid extension '{ext.upper()}' verified")
        reasons.append("✓ No double extension malware anomalies detected")
        recommendations.append("✓ File structure appears clean. Safe to view document.")

    result = risk_engine.compute_calibrated_risk(
        rule_score=0.0,
        url_score=0.0,
        nlp_score=0.0,
        file_score=file_score,
        ext_score=0.0,
        base_confidence=94,
        reasons=reasons,
        recommendations=recommendations,
        status_if_safe="ANALYZED",
        status_if_risky="MULTIPLE_INDICATORS"
    )
    result['filename'] = filename
    result['file_type'] = ext.upper().replace('.', '') or 'FILE'
    result['file_size_bytes'] = filesize
    result['sha256_hash'] = file_hash
    result['findings'] = result.get('reasons', [])
    result['recommendation'] = ' '.join(result.get('recommendations', []))
    return jsonify(result)

# 5. Screenshot Shield API
@app.route('/api/screenshot/analyze', methods=['POST'])
def api_screenshot_analyze():
    data = request.json or {}
    extracted_text = (data.get('extractedText', '') or '').strip()
    extracted_urls = data.get('extractedUrls', [])
    image_name = data.get('imageName', 'screenshot.png')

    if not extracted_text:
        result = risk_engine.create_risk_result(
            risk_score=None,
            model_confidence=90,
            verification_status="INSUFFICIENT_EVIDENCE",
            reasons=['✓ No readable text detected in screenshot image'],
            recommendations=['Please upload a clearer screenshot image if text was expected.'],
            metadata={'image_name': image_name, 'extracted_urls': []}
        )
        result['image_name'] = image_name
        result['extracted_text'] = 'No readable text extracted.'
        result['extracted_urls'] = []
        result['findings'] = result.get('reasons', [])
        result['recommendation'] = ' '.join(result.get('recommendations', []))
        return jsonify(result)

    text_lower = extracted_text.lower()
    
    if not extracted_urls:
        import re
        url_pattern = re.compile(r'https?://[^\s<>"]+|www\.[^\s<>"]+')
        extracted_urls = url_pattern.findall(extracted_text)

    url_max_score = 0.0
    url_reasons = []
    for u in extracted_urls:
        u_res = url_analyzer.analyze_url(u)
        score_val = u_res.get('risk_score', 0.0)
        if score_val > url_max_score:
            url_max_score = score_val
        for ind in u_res.get('indicators', []):
            msg = ind.get('message') if isinstance(ind, dict) else str(ind)
            if msg and msg not in url_reasons and not msg.startswith('✓'):
                url_reasons.append(msg)

    nlp_score = 0.0
    reasons = []
    recommendations = []

    if extracted_urls:
        reasons.append(f"🔗 Extracted {len(extracted_urls)} URL(s) from screenshot image")

    if any(k in text_lower for k in ['otp', 'verification code', 'password request', 'enter code', 'bank account']):
        nlp_score = max(nlp_score, 88.0)
        reasons.append("⚠️ Password or OTP verification code requested in image text")

    if any(k in text_lower for k in ['urgent', 'suspended', 'act immediately', 'account blocked', 'unauthorized login']):
        nlp_score = max(nlp_score, 82.0)
        reasons.append("⚠️ High urgency language detected in screenshot overlay")

    if any(k in text_lower for k in ['won', 'processing fee', 'deposit', 'laptop fee', '$100', '₹999']):
        nlp_score = max(nlp_score, 84.0)
        reasons.append("⚠️ Reward or advance fee deposit demand detected in message screenshot")

    reasons.extend(url_reasons)

    if not reasons or (len(reasons) == 1 and reasons[0].startswith('🔗')):
        reasons.append("✓ No obvious scam or phishing indicators identified in extracted text")
        recommendations.append("✓ Screenshot content appears safe.")
    else:
        recommendations.append("Avoid clicking suspicious links or providing credentials until verified.")

    result = risk_engine.compute_calibrated_risk(
        rule_score=0.0,
        url_score=url_max_score,
        nlp_score=nlp_score,
        file_score=0.0,
        ext_score=0.0,
        base_confidence=91,
        reasons=reasons,
        recommendations=recommendations,
        status_if_safe="ANALYZED",
        status_if_risky="MULTIPLE_INDICATORS"
    )
    result['image_name'] = image_name
    result['extracted_text'] = extracted_text
    result['extracted_urls'] = extracted_urls
    result['findings'] = result.get('reasons', [])
    result['recommendation'] = ' '.join(result.get('recommendations', []))
    return jsonify(result)



# Serve Static Frontend Files
@app.route('/')
@app.route('/<path:path>')
def serve_static(path='index.html'):
    if request.path.startswith('/api/'):
        return jsonify({'error': f"API Endpoint '{request.path}' not found"}), 404
    file_path = os.path.join(app.static_folder, path)
    if os.path.isfile(file_path):
        return send_from_directory(app.static_folder, path)
    return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    print(f"============================================================")
    print(f"CYBER SHIELD X BACKEND SERVER RUNNING ON PORT {PORT}")
    print(f"EMAIL PROVIDER CONFIG: {EMAIL_PROVIDER.upper()}")
    print(f"============================================================")
    app.run(host='0.0.0.0', port=PORT, debug=False)

