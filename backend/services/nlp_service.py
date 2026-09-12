import re

URGENCY_KEYWORDS = [
    'immediately', 'urgent', 'now', 'account suspended', 'closed today', 
    'action required', '24 hours', 'verify now', 'limited time', 'expired',
    'last chance', 'warning', 'emergency', 'block'
]

SCAM_KEYWORDS = [
    'congratulations', 'selected', 'internship fee', 'registration fee', 
    'processing fee', 'security deposit', 'guaranteed job', 'earn money fast',
    'lottery', 'winner', 'free gift', 'crypto bonus', 'claim now', 'offer letter',
    'telegram link', 'whatsapp group', 'hr department'
]

CREDENTIAL_KEYWORDS = [
    'password', 'otp', 'pin', 'cvv', 'card details', 'bank account',
    'ssn', 'login credentials', 'verification code', 'secret key'
]

PAYMENT_KEYWORDS = [
    'pay', 'fee', 'upi', 'gpay', 'phonepe', 'transfer', 'amount', 'rs', '₹', 'dollar', '$'
]

def analyze_text_nlp(text):
    """
    Parses text content to extract NLP risk features: urgency score,
    scam indicator density, credential request flags, and upfront fee demands.
    """
    if not text:
        return {
            'urgency_score': 0,
            'has_urgency': False,
            'has_scam_keywords': False,
            'has_credential_request': False,
            'has_payment_request': False,
            'matches': []
        }

    text_lower = text.lower()
    matches = []
    
    # 1. Check Urgency
    urgency_hits = [k for k in URGENCY_KEYWORDS if k in text_lower]
    if urgency_hits:
        matches.append(f"Urgency phrases detected: {', '.join(urgency_hits[:3])}")

    # 2. Check Scam Keywords
    scam_hits = [k for k in SCAM_KEYWORDS if k in text_lower]
    if scam_hits:
        matches.append(f"Suspicious opportunity/scam phrases: {', '.join(scam_hits[:3])}")

    # 3. Check Credential Requests
    cred_hits = [k for k in CREDENTIAL_KEYWORDS if k in text_lower]
    if cred_hits:
        matches.append(f"Sensitive credential request indicators: {', '.join(cred_hits[:3])}")

    # 4. Check Upfront Payment Requests
    pay_hits = [k for k in PAYMENT_KEYWORDS if k in text_lower]
    if pay_hits:
        matches.append(f"Upfront payment/financial request: {', '.join(pay_hits[:3])}")

    # Calculate weighted NLP urgency & threat score (0 - 100)
    score = (len(urgency_hits) * 20) + (len(scam_hits) * 25) + (len(cred_hits) * 30) + (len(pay_hits) * 20)
    urgency_score = min(100, score)

    return {
        'urgency_score': urgency_score,
        'has_urgency': len(urgency_hits) > 0,
        'has_scam_keywords': len(scam_hits) > 0,
        'has_credential_request': len(cred_hits) > 0,
        'has_payment_request': len(pay_hits) > 0,
        'matches': matches
    }
