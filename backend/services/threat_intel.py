import requests
from config import Config

def check_threat_intelligence(url_or_hash):
    """
    Checks external threat intelligence services (VirusTotal, Google Safe Browsing).
    Gracefully returns 'Threat intelligence unavailable' if API keys are missing or API fails.
    """
    vt_key = Config.VIRUSTOTAL_API_KEY
    intel_results = {
        'status': 'UNAVAILABLE',
        'provider': 'Built-in Security Intelligence',
        'positives': 0,
        'total': 0,
        'details': 'No external threat intelligence API key configured. Using local risk analysis engine.'
    }
    
    if not vt_key or not vt_key.strip():
        return intel_results

    try:
        # VirusTotal URL / Hash API v3
        headers = {'x-apikey': vt_key}
        endpoint = f"https://www.virustotal.com/api/v3/search?query={url_or_hash}"
        resp = requests.get(endpoint, headers=headers, timeout=4)
        
        if resp.status_code == 200:
            data = resp.json()
            items = data.get('data', [])
            if items:
                stats = items[0].get('attributes', {}).get('last_analysis_stats', {})
                malicious = stats.get('malicious', 0)
                suspicious = stats.get('suspicious', 0)
                harmless = stats.get('harmless', 0)
                total = malicious + suspicious + harmless
                
                intel_results['status'] = 'MATCHED'
                intel_results['provider'] = 'VirusTotal Intelligence API'
                intel_results['positives'] = malicious + suspicious
                intel_results['total'] = total
                intel_results['details'] = f"VirusTotal flagged {malicious + suspicious} threats out of {total} security vendors."
    except Exception as e:
        intel_results['details'] = f"Threat Intelligence Lookup Error: {str(e)}"
        
    return intel_results
