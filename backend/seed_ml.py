import os
import joblib
import numpy as np
from sklearn.ensemble import RandomForestClassifier

def train_and_save_model():
    # Synthetic / structured feature dataset for security risk classification
    # Features:
    # 0: domain_age_days (0 to 3650)
    # 1: is_https (1 or 0)
    # 2: url_length
    # 3: subdomain_count
    # 4: contains_ip (1 or 0)
    # 5: nlp_urgency_score (0 to 100)
    # 6: payment_request_flag (1 or 0)
    # 7: login_indicator_flag (1 or 0)
    
    np.random.seed(42)
    X = []
    y = []

    # Safe instances (label = 0 -> SAFE/LOW)
    for _ in range(300):
        domain_age = np.random.randint(180, 3650) # Established domain
        is_https = 1
        url_len = np.random.randint(15, 45)
        subdomains = np.random.randint(1, 3)
        contains_ip = 0
        urgency = np.random.randint(0, 20)
        payment_req = 0
        login_flag = np.random.randint(0, 2)
        X.append([domain_age, is_https, url_len, subdomains, contains_ip, urgency, payment_req, login_flag])
        y.append(0)

    # Phishing / Scam instances (label = 1 -> HIGH/CRITICAL)
    for _ in range(300):
        domain_age = np.random.randint(0, 30) # Brand new domain
        is_https = np.random.choice([0, 1], p=[0.6, 0.4])
        url_len = np.random.randint(50, 120)
        subdomains = np.random.randint(3, 7)
        contains_ip = np.random.choice([0, 1], p=[0.8, 0.2])
        urgency = np.random.randint(60, 100)
        payment_req = np.random.choice([0, 1], p=[0.4, 0.6])
        login_flag = np.random.choice([0, 1], p=[0.3, 0.7])
        X.append([domain_age, is_https, url_len, subdomains, contains_ip, urgency, payment_req, login_flag])
        y.append(1)

    X = np.array(X)
    y = np.array(y)

    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X, y)

    models_dir = os.path.join(os.path.dirname(__file__), 'models')
    os.makedirs(models_dir, exist_ok=True)
    model_path = os.path.join(models_dir, 'rf_model.joblib')
    
    joblib.dump(model, model_path)
    print(f"[OK] Random Forest ML Security Model successfully trained & saved to {model_path}")

if __name__ == '__main__':
    train_and_save_model()
