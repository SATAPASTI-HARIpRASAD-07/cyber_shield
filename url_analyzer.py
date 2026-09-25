# ============================================================
# CYBER SHIELD - COMMON URL ANALYSIS ENGINE (SECTION 10)
# ============================================================

import re
import math
from risk_engine import build_risk_response

def calculate_entropy(text):
    if not text:
        return 0.0
    prob = [float(text.count(c)) / len(text) for c in set(text)]
    return -sum([p * math.log2(p) for p in prob])

def analyze_url_common(url_input):
    """
    Common URL Analysis Pipeline (Section 10)
    Shared by URL Shield, Email Shield, QR Scanner, and Screenshot Shield.
    """
    url = (url_input or '').strip()
    if not url:
        return build_risk_response(
            success=False,
            prediction="invalid_input",
            verification_status="ANALYSIS_FAILED",
            recommendation="Please enter a valid URL to analyze."
        )

    url_lower = url.lower()
    
    # Ensure protocol prefix for parsing
    if not (url_lower.startswith('http://') or url_lower.startswith('https://')):
        url_lower_full = 'http://' + url_lower
    else:
        url_lower_full = url_lower

    protocol = 'HTTPS' if url_lower.startswith('https://') else ('HTTP' if url_lower.startswith('http://') else 'UNKNOWN')
    domain_match = re.search(r'https?://([^/:\?#]+)', url_lower_full)
    domain = domain_match.group(1) if domain_match else url_lower.split('/')[0]

    indicators = []
    features = {}

    # Structural feature calculations
    url_length = len(url)
    dots_count = domain.count('.')
    hyphens_count = domain.count('-')
    has_at_symbol = '@' in url
    has_ip = bool(re.search(r'\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b', domain))
    has_punycode = domain.startswith('xn--') or 'xn--' in domain
    entropy = calculate_entropy(domain)

    features['url_length'] = url_length
    features['domain_dots'] = dots_count
    features['domain_hyphens'] = hyphens_count
    features['domain_entropy'] = round(entropy, 2)
    features['protocol'] = protocol

    # Base calibrated score
    score = 3.2
    confidence = 0.90
    prediction = "likely_safe"
    status = "ANALYZED"

    # Rule 1: Protocol Security
    if protocol == 'HTTP':
        score += 24.5
        indicators.append({
            "type": "unencrypted_http",
            "severity": "medium",
            "message": "Unencrypted HTTP connection detected (No TLS/SSL certificate)."
        })
    else:
        indicators.append({
            "type": "https_verified",
            "severity": "low",
            "message": "✓ HTTPS TLS/SSL connection detected."
        })

    # Rule 2: IP Address in URL
    if has_ip:
        score += 45.0
        prediction = "suspicious_ip_url"
        indicators.append({
            "type": "ip_address_url",
            "severity": "high",
            "message": "Raw IP address used as web host instead of a domain name."
        })

    # Rule 3: Punycode / Homograph Attack
    if has_punycode:
        score += 42.0
        indicators.append({
            "type": "punycode_domain",
            "severity": "high",
            "message": "Punycode domain detected (potential internationalized homograph spoofing)."
        })

    # Rule 4: URL Shorteners
    if any(s in domain for s in ['bit.ly', 'tinyurl.com', 'goo.gl', 't.co', 'is.gd', 'buff.ly']):
        score += 35.0
        prediction = "shortened_url"
        indicators.append({
            "type": "shortened_url",
            "severity": "medium",
            "message": "Shortened URL redirect detected. Destination is obscured."
        })

    # Rule 5: High-Risk TLDs
    tld = '.' + domain.split('.')[-1] if '.' in domain else ''
    if tld in ['.xyz', '.top', '.tk', '.ga', '.work', '.info', '.click', '.zip', '.mov']:
        score += 28.0
        indicators.append({
            "type": "suspicious_tld",
            "severity": "medium",
            "message": f"High-risk top-level domain extension detected ({tld})."
        })

    # Rule 6: Brand Impersonation / Lookalike Keywords
    lookalike_keywords = ['paypa1', 'bank-verify', 'security-check', 'login-verify', 'stipend-claim', 'account-update', 'signin-alert']
    if any(k in domain for k in lookalike_keywords):
        score += 65.0
        prediction = "likely_phishing"
        status = "MULTIPLE_INDICATORS"
        indicators.append({
            "type": "suspicious_domain",
            "severity": "high",
            "message": f"Lookalike domain brand impersonation detected on '{domain}'."
        })

    # Rule 7: Login / Payment Path Keywords
    if any(k in url_lower for k in ['login', 'signin', 'verify', 'password', 'credential', 'banking', 'secure-update']):
        score += 18.5
        indicators.append({
            "type": "credential_request",
            "severity": "medium",
            "message": "Credential or login keywords present in URL path."
        })

    # Rule 8: @ Symbol in URL
    if has_at_symbol:
        score += 30.0
        indicators.append({
            "type": "at_symbol_in_url",
            "severity": "high",
            "message": "@ symbol detected in URL (used to obscure real host destination)."
        })

    # Rule 9: Multiple Subdomains Anomaly
    if dots_count >= 3:
        score += 22.0
        indicators.append({
            "type": "multiple_subdomains",
            "severity": "medium",
            "message": f"Excessive subdomain levels detected ({dots_count} domain dots)."
        })

    # Rule 10: Suspiciously Long URL
    if url_length > 75:
        score += 15.0
        indicators.append({
            "type": "excessive_url_length",
            "severity": "low",
            "message": f"Excessive URL character length ({url_length} chars)."
        })

    # Rule 11: High Domain Entropy or Hyphen Overuse
    if entropy > 4.2 or hyphens_count >= 3:
        score += 14.0
        indicators.append({
            "type": "suspicious_entropy",
            "severity": "low",
            "message": f"High character entropy ({round(entropy, 2)}) or excessive hyphens ({hyphens_count}) in domain."
        })

    if score >= 60.0:
        prediction = "likely_phishing"
        confidence = 0.94
        if len(indicators) > 2:
            status = "MULTIPLE_INDICATORS"

    return build_risk_response(
        success=True,
        prediction=prediction,
        raw_score=score,
        confidence=confidence,
        verification_status=status,
        indicators=indicators,
        features=features
    )

def analyze_url(url):
    """Alias function for analyze_url_common"""
    return analyze_url_common(url)

