import { ScanResult, ScanType } from '../types';
import { DEMO_PRESETS } from './demoData';

const API_BASE = '/api';

export async function analyzeInput(type: ScanType, input: string, context?: Record<string, any>): Promise<ScanResult> {
  // Check if input matches any preloaded demo scenario
  const demoMatch = DEMO_PRESETS.find(p => p.input.toLowerCase().trim() === input.toLowerCase().trim() || p.type === type && input.includes(p.id));
  
  try {
    let endpoint = `/analyze/${type}`;
    if (type === 'website') endpoint = '/analyze/url';
    
    const body: Record<string, any> = { [type === 'url' || type === 'website' ? 'url' : type === 'qr' ? 'qr_content' : type === 'message' ? 'message' : 'details']: input };
    if (context) Object.assign(body, context);

    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (response.ok) {
      const data = await response.json();
      if (data.status === 'success') {
        return data.result;
      }
    }
  } catch (err) {
    console.warn("[API Notice] Backend endpoint unreachable. Using built-in CYBER SHIELD X AI Risk Engine.");
  }

  // Fallback to Demo Data / Client-side Engine if offline
  if (demoMatch) {
    return demoMatch.result;
  }

  // Generative Fallback Result for Arbitrary Inputs
  return generateClientFallbackResult(type, input, context);
}

export async function askCyberAssistant(query: string, scanContext?: any): Promise<string> {
  try {
    const response = await fetch(`${API_BASE}/assistant/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, scan_context: scanContext })
    });
    if (response.ok) {
      const data = await response.json();
      return data.response;
    }
  } catch (err) {
    console.warn("Assistant fallback");
  }

  const q = query.toLowerCase();
  if (q.includes('internship') || q.includes('job') || q.includes('pay') || q.includes('fee')) {
    return "🛡️ **CYBER SHIELD X Guidance**: Real companies and legitimate internship programs NEVER ask students to pay registration fees, processing charges, or security deposits upfront. If an offer requires ₹999 or any payment before joining, it is almost certainly a scam. Contact your college placement cell to verify independently.";
  } else if (q.includes('otp') || q.includes('code') || q.includes('bank')) {
    return "🔐 **CYBER SHIELD X Security Warning**: NEVER share an OTP or 2FA code with anyone over phone calls, SMS, or WhatsApp—even if they claim to be from your bank, college, or service provider. Legitimate organizations will never ask for your private OTP.";
  }
  return `🛡️ **CYBER SHIELD X AI Cyber Assistant**: Regarding your question: "${query}"\n\nAlways follow core digital safety rules:\n1. Never pay money upfront for jobs/internships.\n2. Keep your passwords and OTPs 100% private.\n3. Verify domain names independently before entering credentials.`;
}

function generateClientFallbackResult(type: ScanType, input: string, context?: any): ScanResult {
  const inputLower = input.toLowerCase();
  let score = 15;
  let level: 'SAFE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'SAFE';
  const reasons: string[] = [];
  const recs: string[] = [];

  if (inputLower.includes('pay') || inputLower.includes('fee') || inputLower.includes('₹') || inputLower.includes('rs') || inputLower.includes('deposit')) {
    score += 45;
    reasons.push('Upfront payment/registration fee requested in message.');
  }

  if (inputLower.includes('urgent') || inputLower.includes('immediately') || inputLower.includes('today') || inputLower.includes('warning')) {
    score += 25;
    reasons.push('High urgency wording detected in communication.');
  }

  if (inputLower.includes('http://') || inputLower.includes('.xyz') || inputLower.includes('.top') || inputLower.includes('.site')) {
    score += 35;
    reasons.push('Unencrypted connection or high-risk domain extension detected.');
  }

  if (score >= 85) level = 'CRITICAL';
  else if (score >= 60) level = 'HIGH';
  else if (score >= 40) level = 'MEDIUM';
  else if (score >= 20) level = 'LOW';

  if (level === 'CRITICAL' || level === 'HIGH') {
    recs.push('🛑 DO NOT enter credentials or send payment.');
    recs.push('✓ Verify organization independently through verified official channels.');
  } else {
    recs.push('✓ Proceed with standard digital safety precautions.');
  }

  if (reasons.length === 0) {
    reasons.push('Basic security metrics analyzed. No active threat indicators detected.');
  }

  return {
    scan_type: type,
    target_input: input,
    risk_score: Math.min(99, score),
    threat_level: level,
    confidence: 88,
    reasons: reasons,
    recommendations: recs,
    ai_explanation: `CYBER SHIELD X evaluated '${input.substring(0, 40)}...' with a Risk Score of ${score}/100 (${level}). Base your trust decision on verified primary sources.`
  };
}
