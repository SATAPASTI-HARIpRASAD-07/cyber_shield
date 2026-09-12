from config import Config

def generate_ai_explanation(scan_type, target_input, risk_score, threat_level, reasons, recommendations):
    """
    Generates explainable AI explanations grounded in actual evidence (reasons, threat level, risk score).
    Uses OpenAI API if configured, or deterministic rule-based explainability if unconfigured.
    """
    api_key = Config.OPENAI_API_KEY
    
    reasons_str = "\n".join([f"- {r}" for r in reasons])
    rec_str = "\n".join([f"- {r}" for r in recommendations])
    
    if api_key and api_key.strip():
        try:
            import openai
            client = openai.OpenAI(api_key=api_key)
            prompt = f"""You are CYBER SHIELD X AI Explanation Engine. Explain why this digital input received a {threat_level} risk rating ({risk_score}/100).
Do NOT invent new security evidence. Base your response ONLY on these findings:

Input Type: {scan_type}
Target Input: {target_input}
Risk Score: {risk_score}/100 ({threat_level})
Identified Evidence:
{reasons_str}

Recommendations:
{rec_str}

Provide a concise, student-friendly 2-paragraph cybersecurity breakdown explaining why this is risky and what exact steps to take."""

            res = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=250,
                temperature=0.3
            )
            return res.choices[0].message.content.strip()
        except Exception as e:
            pass # Fall through to rule-based explanation
            
    # Deterministic Grounded Explanation Engine
    if threat_level in ['HIGH', 'CRITICAL']:
        return f"CYBER SHIELD X identified critical threat indicators for '{target_input}'. Key evidence shows:\n{reasons_str}\n\nOur AI system strongly advises you NOT to proceed or share any credentials. Always verify through official channels before trusting."
    elif threat_level in ['MEDIUM', 'LOW']:
        return f"CYBER SHIELD X detected moderate risk flags for '{target_input}'. Findings include:\n{reasons_str}\n\nExercise caution. Do not make payments or enter passwords without verifying the sender or domain independently."
    else:
        return f"CYBER SHIELD X evaluated '{target_input}' as SAFE (Risk Score: {risk_score}/100). No malicious indicators, domain anomalies, or scam patterns were identified. However, remain vigilant and protect your personal information."
