import re
from services.domain_service import analyze_domain
from services.nlp_service import analyze_text_nlp
from services.ml_service import predict_security_risk
from services.threat_intel import check_threat_intelligence
from services.llm_service import generate_ai_explanation

HIGH_RISK_TLDS = ['.top', '.xyz', '.site', '.fun', '.click', '.download', '.online', '.win']
SPOOFED_BRANDS = ['google', 'sbi', 'icici', 'hdfc', 'amazon', 'paypal', 'microsoft', 'apple', 'paytm']

def evaluate_risk(scan_type, target_input, context=None):
    """
    Central CYBER SHIELD X Risk Engine.
    Executes domain parsing, NLP extraction, ML classification, and threat intelligence.
    """
    context = context or {}
    reasons = []
    recommendations = []
    technical_details = {}
    
    score = 10 # Base score
    input_lower = target_input.lower()
    
    # 1. URL / Domain Analysis
    if scan_type in ['url', 'qr', 'website'] or target_input.startswith(('http://', 'https://', 'www.')) or '.' in target_input:
        dom_info = analyze_domain(target_input)
        technical_details['domain'] = dom_info
        
        # Check high-risk TLD extensions
        for tld in HIGH_RISK_TLDS:
            if dom_info['hostname'].endswith(tld):
                score += 35
                reasons.append(f"High-risk domain extension ({tld}) commonly associated with phishing campaigns.")
                break

        # Check spoofed brand keywords in host
        for brand in SPOOFED_BRANDS:
            if brand in dom_info['hostname'] and not dom_info['hostname'].endswith(f"{brand}.com"):
                score += 30
                reasons.append(f"Impersonated brand name ('{brand}') detected in suspicious domain name.")
                break

        if dom_info['is_new_domain']:
            score += 35
            reasons.append(f"Very new domain registered on {dom_info['registration_date']} ({dom_info['domain_age_days']} days old).")
        elif dom_info['domain_age_days'] < 90:
            score += 15
            reasons.append(f"Recently registered domain ({dom_info['domain_age_days']} days old).")
            
        if not dom_info['is_https']:
            score += 25
            reasons.append("Unencrypted connection (HTTP instead of HTTPS).")
            
        if dom_info['contains_ip']:
            score += 35
            reasons.append("URL uses direct IP address host instead of a legitimate domain name.")
            
        if dom_info['subdomain_count'] >= 3:
            score += 20
            reasons.append(f"Excessive subdomains detected ({dom_info['subdomain_count']} levels), masking true destination.")

    # 2. NLP Content Analysis
    nlp_text = target_input
    if scan_type == 'opportunity':
        nlp_text += " " + context.get('company', '') + " " + context.get('details', '')
    elif scan_type == 'email' or scan_type == 'message':
        nlp_text += " " + context.get('subject', '') + " " + context.get('sender', '')

    nlp_info = analyze_text_nlp(nlp_text)
    technical_details['nlp'] = nlp_info
    
    if nlp_info['has_urgency']:
        score += 25
    if nlp_info['has_scam_keywords']:
        score += 30
    if nlp_info['has_credential_request']:
        score += 35
    if nlp_info['has_payment_request'] or '₹' in nlp_text or 'rs' in nlp_text.lower() or 'fee' in nlp_text.lower():
        score += 45
        reasons.append("Upfront payment/registration fee requested (classic student internship/job scam indicator).")

    for match in nlp_info['matches']:
        if match not in reasons:
            reasons.append(match)

    # 3. Machine Learning Inferencing
    dom_age = technical_details.get('domain', {}).get('domain_age_days', 365)
    is_https = technical_details.get('domain', {}).get('is_https', True)
    url_len = technical_details.get('domain', {}).get('url_length', len(target_input))
    subdomains = technical_details.get('domain', {}).get('subdomain_count', 0)
    contains_ip = technical_details.get('domain', {}).get('contains_ip', 0)
    urgency_val = nlp_info['urgency_score']
    payment_flag = nlp_info['has_payment_request'] or ('fee' in input_lower or '₹' in input_lower)
    login_flag = nlp_info['has_credential_request'] or ('login' in input_lower or 'account' in input_lower)

    ml_prob, model_name = predict_security_risk(
        dom_age, is_https, url_len, subdomains, contains_ip, urgency_val, payment_flag, login_flag
    )
    technical_details['ml'] = {
        'model_name': model_name,
        'threat_probability': round(ml_prob * 100, 2)
    }

    # Blend ML probability into risk score
    score = int(score * 0.4 + (ml_prob * 100) * 0.6)
    score = max(0, min(100, score)) # Clamp 0 to 100

    # 4. Threat Intelligence API Lookup
    threat_intel = check_threat_intelligence(target_input)
    technical_details['threat_intelligence'] = threat_intel
    if threat_intel.get('positives', 0) > 0:
        score = max(score, 90)
        reasons.append(f"Threat Intelligence: {threat_intel['details']}")

    # Determine Threat Level
    if score >= 85:
        threat_level = 'CRITICAL'
        recommendations.append("🛑 DO NOT enter login credentials or make any financial payments.")
        recommendations.append("🛑 Close the link or email immediately and report as scam.")
    elif score >= 60:
        threat_level = 'HIGH'
        recommendations.append("⚠️ Do not trust the offer or website without independent verification.")
        recommendations.append("⚠️ Verify the official organization through their verified main domain.")
    elif score >= 35:
        threat_level = 'MEDIUM'
        recommendations.append("⚡ Exercise caution. Verify recruiter identity or URL domain carefully.")
    elif score >= 20:
        threat_level = 'LOW'
        recommendations.append("✓ Low risk detected, but always ensure your password/OTP remains private.")
    else:
        threat_level = 'SAFE'
        recommendations.append("✓ Verified clean. Standard safe browsing practices apply.")

    if not reasons:
        reasons.append("Standard domain and message checks passed with no suspicious anomalies detected.")

    confidence = min(95, max(70, 100 - (10 if threat_intel['status'] == 'UNAVAILABLE' else 0)))

    # Generate AI explanation
    ai_explanation = generate_ai_explanation(
        scan_type, target_input, score, threat_level, reasons, recommendations
    )

    return {
        'scan_type': scan_type,
        'target_input': target_input,
        'risk_score': score,
        'threat_level': threat_level,
        'confidence': confidence,
        'reasons': reasons,
        'recommendations': recommendations,
        'technical_details': technical_details,
        'ai_explanation': ai_explanation
    }
