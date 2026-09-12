import re
import urllib.parse
import requests
from datetime import datetime, timezone

def analyze_domain(url_str):
    """
    Extracts domain parameters, checks HTTPS state, subdomains, IP host format,
    and performs RDAP domain age verification with graceful fallback.
    """
    if not url_str.startswith(('http://', 'https://')):
        url_str = 'http://' + url_str
        
    parsed = urllib.parse.urlparse(url_str)
    hostname = parsed.netloc.split(':')[0]
    
    is_https = parsed.scheme.lower() == 'https'
    url_length = len(url_str)
    
    # Check if host is an IP address
    contains_ip = 1 if re.match(r'^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$', hostname) else 0
    
    # Count subdomains
    domain_parts = hostname.split('.')
    subdomain_count = max(0, len(domain_parts) - 2)
    
    # Default fallback values for domain age
    domain_age_days = 365 # Default fallback
    registration_date_str = "Established / Unverified"
    is_new_domain = False

    # Perform lightweight RDAP query for public TLDs if not IP
    if not contains_ip and len(domain_parts) >= 2:
        top_domain = '.'.join(domain_parts[-2:])
        try:
            rdap_url = f"https://rdap.org/domain/{top_domain}"
            resp = requests.get(rdap_url, timeout=3)
            if resp.status_code == 200:
                data = resp.json()
                events = data.get('events', [])
                for ev in events:
                    if ev.get('eventAction') == 'registration':
                        reg_date_raw = ev.get('eventDate')
                        if reg_date_raw:
                            reg_dt = datetime.fromisoformat(reg_date_raw.replace('Z', '+00:00'))
                            now_dt = datetime.now(timezone.utc)
                            domain_age_days = (now_dt - reg_dt).days
                            registration_date_str = reg_dt.strftime('%Y-%m-%d')
                            if domain_age_days < 30:
                                is_new_domain = True
                        break
        except Exception:
            # Fallback gracefully if RDAP API is blocked or offline
            pass

    return {
        'hostname': hostname,
        'is_https': is_https,
        'url_length': url_length,
        'contains_ip': contains_ip,
        'subdomain_count': subdomain_count,
        'domain_age_days': domain_age_days,
        'registration_date': registration_date_str,
        'is_new_domain': is_new_domain
    }
