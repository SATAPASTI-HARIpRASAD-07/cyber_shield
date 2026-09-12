import os
import joblib
import numpy as np

_model = None

def get_ml_model():
    global _model
    if _model is None:
        model_path = os.path.join(os.path.dirname(__file__), '..', 'models', 'rf_model.joblib')
        if os.path.exists(model_path):
            try:
                _model = joblib.load(model_path)
            except Exception as e:
                print(f"[Warning] Failed to load Random Forest model: {e}")
                _model = None
    return _model

def predict_security_risk(domain_age, is_https, url_len, subdomains, contains_ip, urgency_score, payment_flag, login_flag):
    """
    Predicts threat probability using Random Forest ML Model.
    Returns risk probability (0.0 to 1.0) and model name.
    """
    model = get_ml_model()
    
    # Feature vector matching seed_ml.py
    features = np.array([[
        domain_age, 
        1 if is_https else 0, 
        url_len, 
        subdomains, 
        1 if contains_ip else 0, 
        urgency_score, 
        1 if payment_flag else 0, 
        1 if login_flag else 0
    ]])
    
    if model is not None:
        try:
            proba = model.predict_proba(features)[0][1] # Probability of threat class 1
            return float(proba), "RandomForestClassifier"
        except Exception as e:
            print(f"[Warning] ML Inference fallback: {e}")
            
    # Heuristic fallback if model not loaded
    score = 0.0
    if domain_age < 30: score += 0.3
    if not is_https: score += 0.25
    if payment_flag: score += 0.25
    if urgency_score > 50: score += 0.20
    return min(1.0, score), "HeuristicRuleFallback"
