import { DemoPreset } from '../types';

export const DEMO_PRESETS: DemoPreset[] = [
  {
    id: 'fake-internship',
    label: '🎓 Fake Internship Fee Scam',
    type: 'opportunity',
    input: 'Congratulations! You have been selected for a Remote Software Development Internship at Apex Tech Labs. To confirm your slot and receive your offer letter & laptop, pay a refundable processing fee of ₹999 within 2 hours. Link: http://apex-tech-labs-verify.xyz/pay',
    context: {
      company: 'Apex Tech Labs',
      role: 'Software Development Intern'
    },
    result: {
      scan_type: 'opportunity',
      target_input: 'Software Development Intern at Apex Tech Labs: Congratulations! You are selected... Pay ₹999',
      risk_score: 92,
      threat_level: 'CRITICAL',
      confidence: 94,
      reasons: [
        'Upfront payment/registration fee requested (₹999) for an internship offer.',
        'Urgency indicators detected: "within 2 hours", "refundable processing fee".',
        'Very new domain (apex-tech-labs-verify.xyz registered 2 days ago).',
        'Unencrypted connection (HTTP instead of HTTPS).'
      ],
      recommendations: [
        '🛑 DO NOT pay any registration fee or security deposit.',
        '🛑 Real companies NEVER demand upfront money from interns or job applicants.',
        '✓ Contact your official College Placement Cell to report this fake offer.'
      ],
      ai_explanation: 'CYBER SHIELD X identified a critical student placement scam pattern. Legitimate organizations provide stipend details and formal contracts without requiring money from candidates. The domain `apex-tech-labs-verify.xyz` was registered 48 hours ago specifically to impersonate a tech firm. Do not send funds or share personal documents.'
    }
  },
  {
    id: 'phishing-url',
    label: '🔗 Phishing Login Link',
    type: 'url',
    input: 'http://login.google-account-verify-sec.top/auth/login.php',
    result: {
      scan_type: 'url',
      target_input: 'http://login.google-account-verify-sec.top/auth/login.php',
      risk_score: 88,
      threat_level: 'HIGH',
      confidence: 92,
      reasons: [
        'Domain `google-account-verify-sec.top` registered 4 hours ago.',
        'Spoofed brand name ("google") in suspicious TLD (.top).',
        'Unencrypted connection (HTTP scheme).',
        'Excessive subdomains (3 levels) masking destination.'
      ],
      recommendations: [
        '🛑 DO NOT enter your Google email or password on this page.',
        '🛑 Close the tab immediately.',
        '✓ Always check that Google login URLs start exactly with https://accounts.google.com'
      ],
      ai_explanation: 'This link is a credential phishing website attempting to steal your Google account login. The domain `.top` was created today and has no official relation to Google LLC. Never type your password on unverified third-party domains.'
    }
  },
  {
    id: 'suspicious-qr',
    label: '📷 Suspicious QR Destination',
    type: 'qr',
    input: 'http://192.168.1.45/upi-pay-get-free-cashback-1000',
    result: {
      scan_type: 'qr',
      target_input: 'http://192.168.1.45/upi-pay-get-free-cashback-1000',
      risk_score: 85,
      threat_level: 'HIGH',
      confidence: 90,
      reasons: [
        'QR destination uses direct IP address host (192.168.1.45) instead of a domain.',
        'UPI payment & free cashback lure detected in URL path.',
        'Unencrypted HTTP connection.'
      ],
      recommendations: [
        '🛑 Do NOT scan or complete UPI payment PIN entry.',
        '🛑 Remember: Scanning a QR code in UPI apps is ONLY for PAYING money, never for receiving money.',
        '✓ Cancel the transaction immediately.'
      ],
      ai_explanation: 'CYBER SHIELD X decoded this QR code to a suspicious IP link promising "free cashback". Scammers frequently use QR codes to trick users into entering their UPI PIN under the pretense of receiving money, when in fact it deducts funds from your account.'
    }
  },
  {
    id: 'otp-call-scenario',
    label: '🔐 Unexpected OTP + Impersonation Call',
    type: 'otp',
    input: 'Received unexpected SBI YONO NetBanking OTP: 849201. 10 minutes later, received a phone call from an unknown person claiming to be SBI Fraud Manager asking to verify the OTP to stop illegal transaction.',
    result: {
      scan_type: 'otp',
      target_input: 'Unexpected OTP + Impersonation Call',
      risk_score: 95,
      threat_level: 'CRITICAL',
      confidence: 96,
      reasons: [
        'Unexpected 2FA OTP generated without your action indicates credential theft attempt.',
        'Follow-up phone call asking for OTP is a classic Social Engineering Vishing attack.',
        'Impersonation of bank security team to gain trust.'
      ],
      recommendations: [
        '🛑 NEVER share an OTP or 2FA code with anyone over phone or chat.',
        '🛑 Hang up the call immediately.',
        '✓ Change your net banking password right now from the official bank app.'
      ],
      ai_explanation: 'This is a multi-stage social engineering vishing incident. An attacker who already possessed your username/password triggered an OTP request and called you to trick you into reading out the code. SBI and all legitimate banks will NEVER call you to ask for your OTP.'
    }
  },
  {
    id: 'malware-file',
    label: '🦠 Malicious File Download',
    type: 'file',
    input: 'HallTicket_Exam_AdmitCard_2026.exe (SHA256: 8f3c7a1e9b2d4f5a...)',
    result: {
      scan_type: 'file',
      target_input: 'HallTicket_Exam_AdmitCard_2026.exe',
      risk_score: 91,
      threat_level: 'CRITICAL',
      confidence: 95,
      reasons: [
        'Suspicious double extension / executable file (.exe) disguised as an exam admit card document.',
        'Static indicators show file contains hidden downloader payload.',
        'Threat intelligence flagged executable file disguised as PDF/document.'
      ],
      recommendations: [
        '🛑 DO NOT double-click or execute this file.',
        '🛑 Delete the file from your Downloads folder immediately.',
        '✓ Official admit cards are always provided as .PDF files from secure portals.'
      ],
      ai_explanation: 'CYBER SHIELD X identified a malicious executable file (.exe) masquerading as an academic admit card. Running this program could install ransomware or a trojan keylogger on your computer. Delete it immediately.'
    }
  },
  {
    id: 'safe-website',
    label: '🟢 Safe Verified Website',
    type: 'url',
    input: 'https://nptel.ac.in/courses',
    result: {
      scan_type: 'url',
      target_input: 'https://nptel.ac.in/courses',
      risk_score: 5,
      threat_level: 'SAFE',
      confidence: 98,
      reasons: [
        'Verified academic domain (.ac.in) registered over 15 years ago.',
        'Valid TLS/HTTPS encryption certificate.',
        'Clean reputation with zero threat intelligence flags.'
      ],
      recommendations: [
        '✓ Verified safe academic portal.',
        '✓ You may proceed safely.'
      ],
      ai_explanation: 'CYBER SHIELD X verified `nptel.ac.in` as an official, highly trusted educational platform. Encrypted connection and domain history are fully authentic.'
    }
  }
];
