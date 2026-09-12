from flask import Blueprint, request, jsonify
from config import Config

assistant_bp = Blueprint('assistant', __name__, url_prefix='/api/assistant')

@assistant_bp.route('/chat', methods=['POST'])
def assistant_chat():
    data = request.get_json() or {}
    user_query = data.get('query', '').strip()
    scan_context = data.get('scan_context')
    
    if not user_query:
        return jsonify({'status': 'error', 'message': 'Query is required.'}), 400
        
    api_key = Config.OPENAI_API_KEY
    if api_key and api_key.strip():
        try:
            import openai
            client = openai.OpenAI(api_key=api_key)
            context_str = f"Current Scan Findings Context: {scan_context}" if scan_context else ""
            system_instruction = f"You are CYBER SHIELD X AI Cyber Assistant. Answer the user's cybersecurity question with practical, student-friendly, and actionable guidance. {context_str}"
            
            res = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": system_instruction},
                    {"role": "user", "content": user_query}
                ],
                max_tokens=300,
                temperature=0.4
            )
            return jsonify({'status': 'success', 'response': res.choices[0].message.content.strip()})
        except Exception as e:
            pass # Fallback to deterministic AI response
            
    # Grounded Deterministic AI Assistant Engine
    q_lower = user_query.lower()
    if 'internship' in q_lower or 'pay' in q_lower or 'fee' in q_lower or 'job' in q_lower:
        reply = "🛡️ **CYBER SHIELD X Guidance**: Real companies and legitimate internship programs NEVER ask students to pay registration fees, processing charges, or security deposits upfront. If an offer requires ₹999 or any payment before joining, it is almost certainly a scam. Contact your college placement cell to verify independently."
    elif 'otp' in q_lower or 'code' in q_lower or 'call' in q_lower:
        reply = "🔐 **CYBER SHIELD X Security Warning**: NEVER share an OTP or 2FA code with anyone over phone calls, SMS, or WhatsApp—even if they claim to be from your bank, college, or service provider. Legitimate organizations will never ask for your private OTP."
    elif 'url' in q_lower or 'link' in q_lower or 'phishing' in q_lower or 'http' in q_lower:
        reply = "🔗 **CYBER SHIELD X Link Safety Tip**: Before clicking or entering credentials, check if the domain is newly registered, lacks HTTPS, or uses strange spelling tricks (e.g. `g00gle.com` or `internship-portal-free.xyz`). Always access portals through your browser bookmarks."
    elif 'virus' in q_lower or 'file' in q_lower or 'download' in q_lower or 'malware' in q_lower:
        reply = "🦠 **CYBER SHIELD X Malware Warning**: Avoid downloading executable files (.exe, .apk, .bat, .vbs) from unknown links, Telegram channels, or email attachments. Always run files through CYBER SHIELD X Malware Shield or VirusTotal."
    else:
        reply = f"🛡️ **CYBER SHIELD X AI Cyber Assistant**: Regarding your question: *'{user_query}'*\n\nCYBER SHIELD X advises following core security hygiene:\n1. Never pay upfront fees for job or internship offers.\n2. Keep your passwords and OTPs 100% private.\n3. Verify domain names independently before entering credentials."

    return jsonify({'status': 'success', 'response': reply})
