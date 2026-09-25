# Shared Risk Engine Implementation
import math


def classify_risk_level(score):
    """
    Maps 0-100 score to dynamic risk level (Section 8):
    0–19.99     VERY LOW
    20–39.99    LOW
    40–59.99    MEDIUM
    60–79.99    HIGH
    80–100      CRITICAL
    """
    if score is None:
        return "NOT_APPLICABLE"
    
    if score >= 80.0:
        return "CRITICAL"
    elif score >= 60.0:
        return "HIGH"
    elif score >= 40.0:
        return "MEDIUM"
    elif score >= 20.0:
        return "LOW"
    else:
        return "VERY LOW"

def build_risk_response(
    success=True,
    prediction="likely_safe",
    raw_score=0.0,
    confidence=0.90,
    verification_status="ANALYZED",
    indicators=None,
    recommendation=None,
    features=None
):
    """
    Standard API Response Builder (Section 18 & 19)
    Returns consistent JSON structure across all security tools.
    """
    if not success:
        return {
            "success": False,
            "prediction": "unknown",
            "risk_score": None,
            "risk_level": "ANALYSIS_FAILED",
            "confidence": None,
            "verification_status": "ANALYSIS_FAILED",
            "indicators": [],
            "recommendation": "Unable to complete security analysis. Please try again.",
            "features": {}
        }

    if verification_status == "NOT_APPLICABLE":
        return {
            "success": True,
            "prediction": "not_applicable",
            "risk_score": None,
            "risk_level": "NOT_APPLICABLE",
            "confidence": None,
            "verification_status": "NOT_APPLICABLE",
            "indicators": indicators or [],
            "recommendation": recommendation or "No security risk analysis applicable for this content.",
            "features": features or {}
        }

    # Clamp & round risk score to 1 decimal place (e.g. 18.7, 34.6, 67.8, 87.4)
    clamped_score = max(0.0, min(100.0, float(raw_score)))
    risk_score = round(clamped_score, 1)
    risk_level = classify_risk_level(risk_score)

    if not recommendation:
        if risk_level in ["CRITICAL", "HIGH"]:
            recommendation = "Avoid interacting with this content, entering credentials, or making payments."
        elif risk_level == "MEDIUM":
            recommendation = "Exercise caution. Verify the domain or source before logging in or proceeding."
        else:
            recommendation = "Proceed with standard cybersecurity awareness."

    return {
        "success": True,
        "prediction": prediction,
        "risk_score": risk_score,
        "risk_level": risk_level,
        "confidence": round(float(confidence), 2),
        "verification_status": verification_status,
        "indicators": indicators or [],
        "recommendation": recommendation,
        "features": features or {}
    }

def create_risk_result(risk_score, model_confidence=93, verification_status="ANALYZED", reasons=None, recommendations=None, breakdown=None, metadata=None):
    if risk_score is None or verification_status in ["NOT_APPLICABLE", "INSUFFICIENT_EVIDENCE", "ANALYSIS_FAILED"]:
        return {
            "success": verification_status != "ANALYSIS_FAILED",
            "risk_score": None,
            "risk_level": verification_status,
            "model_confidence": None if verification_status == "ANALYSIS_FAILED" else int(model_confidence),
            "verification_status": verification_status,
            "reasons": reasons or [],
            "recommendations": recommendations or [],
            "analysis_breakdown": breakdown or {},
            "metadata": metadata or {}
        }

    clamped_score = max(0.0, min(100.0, float(risk_score)))
    score_float = round(clamped_score, 1)
    level = classify_risk_level(score_float)
    return {
        "success": True,
        "risk_score": score_float,
        "risk_level": level,
        "model_confidence": int(model_confidence),
        "verification_status": verification_status,
        "reasons": reasons or [],
        "recommendations": recommendations or [],
        "analysis_breakdown": breakdown or {
            "rule_heuristics": round(score_float * 0.4, 1),
            "url_structure": round(score_float * 0.3, 1),
            "nlp_urgency": round(score_float * 0.3, 1)
        },
        "metadata": metadata or {}
    }

def compute_calibrated_risk(rule_score=0.0, url_score=0.0, nlp_score=0.0, file_score=0.0, ext_score=0.0, base_confidence=92, reasons=None, recommendations=None, status_if_safe="ANALYZED", status_if_risky="MULTIPLE_INDICATORS"):
    combined = max(rule_score, url_score, nlp_score, file_score, ext_score)
    if combined > 0 and len(reasons or []) > 1:
        combined = min(100.0, combined + 3.5)
    
    score_float = round(float(combined), 1)
    status = status_if_risky if score_float >= 30.0 else status_if_safe
    
    breakdown = {}
    if rule_score > 0: breakdown['rule_heuristics'] = round(rule_score, 1)
    if url_score > 0: breakdown['url_structure'] = round(url_score, 1)
    if nlp_score > 0: breakdown['nlp_urgency'] = round(nlp_score, 1)
    if file_score > 0: breakdown['file_extension'] = round(file_score, 1)
    if ext_score > 0: breakdown['external_signals'] = round(ext_score, 1)

    return create_risk_result(
        risk_score=score_float,
        model_confidence=base_confidence,
        verification_status=status,
        reasons=reasons or [],
        recommendations=recommendations or [],
        breakdown=breakdown
    )

