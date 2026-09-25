# 🛡️ CYBER SHIELD

> **Cyber Security Protection Platform & Decision-Support Suite**  
> *Check Before You Trust*

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Python: 3.10+](https://img.shields.io/badge/Python-3.10%2B-green.svg)](https://python.org)
[![React: 18](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org)
[![Status: Verified](https://img.shields.io/badge/E2E%20API-100%25%20Verified-success.svg)](#verification-status--e2e-test-matrix)

---

## 📖 Overview

**Cyber Shield** is a cybersecurity protection and threat analysis platform designed to shield users against web phishing, deceptive QR code payloads, malicious email/message scams, malware attachment anomalies, and suspicious screenshot messages. 

Powered by a transparent **Hybrid Heuristic Risk Engine**, Cyber Shield evaluates incoming artifacts against structural, entropy, regex pattern, and natural language urgency signals to provide dynamic risk scoring, qualitative severity levels, structured threat evidence, and actionable safety recommendations.

---

## ✨ Primary Security Shields

Cyber Shield features **5 core protection tools**:

1. **🌐 URL & Website Shield**: Analyzes web addresses for brand typosquatting, IP hosts, `@` redirect credentials, suspicious TLDs, Punycode encoding, URL shorteners, and character entropy anomalies.
2. **▦ QR Scanner Shield**: Scans and evaluates QR code payloads. Distinguishes between interactive URLs and non-executable plaintext/Wi-Fi configurations with explicit `null` score handling.
3. **✉️ Email & Message Shield**: Inspects email headers, sender domain mismatches, urgency/coercion language, advance fee demands, and embedded link threats.
4. **📄 Malware & File Shield**: Evaluates file uploads for dangerous double extensions (`.pdf.exe`), suspicious naming anomalies, file size constraints, and SHA-256 cryptographic hashes.
5. **📸 Screenshot Shield**: Integrates client-side OCR engine (Tesseract.js) to extract visual overlay text and embedded links from message screenshots, detecting OTP verification traps and phishing URLs.

---

## 🛠️ Architecture & Tech Stack

```text
                  GitHub Repository
               SATAPASTI-HARIpRASAD-07/cyber_shield
                               │
                               ▼
            ┌─────────────────────────────────────┐
            │        Vercel / Web Frontend        │
            │ React 18 / Vite / TypeScript / CSS  │
            └──────────────────┬──────────────────┘
                               │
                               │ HTTPS REST API
                               ▼
            ┌─────────────────────────────────────┐
            │       Python Flask API Backend      │
            │ server.py / WSGI / Vercel Serverless│
            └──────────────────┬──────────────────┘
                               │
                               ▼
            ┌─────────────────────────────────────┐
            │     Hybrid Heuristic Risk Engine    │
            │ risk_engine.py / url_analyzer.py    │
            └──────────────────┬──────────────────┘
                               │
       ┌───────────────────────┼───────────────────────┐
       ▼                       ▼                       ▼
   URL Shield             Email Shield            QR Scanner
       │                       │                       │
       └───────────────────────┼───────────────────────┘
                               ▼
                       Screenshot Shield
                               │
                               ▼
                         Malware Shield
```

- **Frontend**: HTML5, Vanilla CSS / Tailwind CSS, JavaScript (ES6+), React 18, Vite, Tesseract.js (Client OCR).
- **Backend**: Python 3.10+, Flask, Flask-CORS, Gunicorn / Vercel Python Serverless.
- **Risk Engine**: Hybrid Heuristic Rules Engine (structural analysis, entropy calculation, regex heuristics, keyword weights).

---

## ⚙️ Hybrid Heuristic Risk Engine & Dynamic Scoring

Cyber Shield employs a **transparent Heuristic Scoring System**:

- **Dynamic Score Range**: `0.0` to `100.0` (with 5 distinct threat levels: `VERY LOW`, `LOW`, `MEDIUM`, `HIGH`, `CRITICAL`).
- **Cumulative Thresholding**: High scores (`100.0`) are assigned **only** when multiple high-severity indicators coincide (e.g. IP host + brand typosquatting + suspicious TLD).
- **Null Score Handling (`null` / `N/A`)**: If a payload does not represent an executable threat or contains insufficient evidence:
  - **Plaintext QR payloads**: `risk_score: null`, `verification_status: "NOT_APPLICABLE"`
  - **Textless Screenshots**: `risk_score: null`, `verification_status: "INSUFFICIENT_EVIDENCE"`

---

## 🚀 Quick Start & Local Setup

### 1. Prerequisites
- Python 3.10 or higher
- Node.js 18+ (optional for Vite static server, standard browser supported)

### 2. Backend Setup
```bash
# Clone the repository
git clone https://github.com/SATAPASTI-HARIpRASAD-07/cyber_shield.git
cd cyber_shield

# Create virtual environment (optional)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start Flask backend server
python server.py
```
Backend will start at: `http://localhost:5000`

### 3. Frontend Setup
Option A: Open `index.html` directly in your browser.  
Option B: Serve via any static web server (e.g. `npx serve .` or Vite dev server).

---

## 🔑 Environment Variables Configuration

Copy `.env.example` to `.env`:

```env
# Server Port
PORT=5000

# Resend Email Configuration (Optional)
EMAIL_PROVIDER=resend
RESEND_API_KEY=your_resend_api_key_here
EMAIL_FROM=onboarding@resend.dev
EMAIL_FROM_NAME=Cyber Shield X Security Suite
```

---

## 📡 REST API Documentation

| Method | Endpoint | Description | Sample Payload |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Backend Health Check | None |
| `POST` | `/api/url/analyze` | URL & Domain Security Analysis | `{"url": "http://192.168.1.1/paypa1-login"}` |
| `POST` | `/api/email/analyze` | Email Scam & Phishing Analysis | `{"sender": "alert@paypa1.com", "subject": "Urgent", "text": "Click link"}` |
| `POST` | `/api/qr/analyze` | QR Code Payload Analysis | `{"payload": "http://suspicious-link.com"}` |
| `POST` | `/api/file/analyze` | Malware File Anomaly Analysis | `{"filename": "Form.pdf.exe", "filesize": 150000, "hash": "sha256..."}` |
| `POST` | `/api/screenshot/analyze` | Screenshot OCR Text & URL Analysis | `{"extractedText": "Urgent OTP verify", "extractedUrls": []}` |

---

## 📊 Verification Status & E2E Test Matrix

All endpoints have been rigorously validated across 31 distinct automated test cases:

| Module | Test Scenario | Expected Result | Actual Result | Verification Status |
| :--- | :--- | :--- | :--- | :--- |
| **Health** | `GET /api/health` | `HTTP 200` | `HTTP 200` | **PASS** |
| **URL** | Legitimate Domain (`google.com`) | `VERY LOW` (0.0 - 15.0) | `VERY LOW` (3.2) | **PASS** |
| **URL** | Phishing IP Host + Brand Typosquat | `CRITICAL` (80.0 - 100.0) | `CRITICAL` (100.0) | **PASS** |
| **Email** | Safe Academic Notice | `VERY LOW` (0.0 - 15.0) | `VERY LOW` (0.0) | **PASS** |
| **Email** | Urgent Password Suspension | `CRITICAL` (80.0 - 100.0) | `CRITICAL` (85.0) | **PASS** |
| **QR** | Phishing Link Payload | `HIGH / CRITICAL` | `HIGH` (76.2) | **PASS** |
| **QR** | Plaintext Message Payload | `risk_score: null` | `risk_score: null` | **PASS (`NOT_APPLICABLE`)** |
| **Screenshot** | Phishing Screenshot OCR | `HIGH / CRITICAL` | `HIGH` (73.2) | **PASS** |
| **Screenshot** | Blank / Textless Screenshot | `risk_score: null` | `risk_score: null` | **PASS (`INSUFFICIENT_EVIDENCE`)** |
| **File** | Clean Document (`.pdf`) | `VERY LOW` (0.0 - 15.0) | `VERY LOW` (0.0) | **PASS** |
| **File** | Double Extension (`.pdf.exe`) | `CRITICAL` (80.0 - 100.0) | `CRITICAL` (95.0) | **PASS** |

---

## 🌐 Production Deployment Guide

### Deploying Frontend on Vercel
1. Push repository to GitHub: `SATAPASTI-HARIpRASAD-07/cyber_shield`
2. Import project into Vercel Dashboard.
3. Environment Variable (Optional for decoupled host):  
   `VITE_API_URL` = `https://your-backend-api.domain`
4. Deploy!

### Deploying Backend
The Flask backend (`server.py`) can be deployed via:
- **Vercel Serverless**: Configured out of the box via `vercel.json` and `api/index.py`.
- **Render / Railway / AWS / Heroku**: Use Gunicorn startup command `gunicorn server:app`.

---

## ⚠️ Limitations & Security Disclaimer

> **IMPORTANT NOTICE**: Cyber Shield is designed as a **cybersecurity decision-support and educational threat analysis tool**. It relies on deterministic heuristics, structural patterns, entropy metrics, and rules-based NLP keyword models.  
>  
> Cyber Shield is **NOT** a substitute for:
> - Enterprise Endpoint Detection and Response (EDR) agents
> - Antivirus / Anti-Malware sandbox engines (e.g. VirusTotal API)
> - Secure Email Gateways (SEG) with DKIM/SPF/DMARC hard validation
> - Professional Incident Response Teams

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
