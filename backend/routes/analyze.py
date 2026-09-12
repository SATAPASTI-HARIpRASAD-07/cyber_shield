import json
import hashlib
from flask import Blueprint, request, jsonify
from database import db, ScanRecord
from services.risk_engine import evaluate_risk

analyze_bp = Blueprint('analyze', __name__, url_prefix='/api/analyze')

@analyze_bp.route('/url', methods=['POST'])
def analyze_url():
    data = request.get_json() or {}
    url_input = data.get('url', '').strip()
    user_id = data.get('user_id')
    
    if not url_input:
        return jsonify({'status': 'error', 'message': 'URL input is required.'}), 400
        
    result = evaluate_risk('url', url_input)
    
    # Save scan record
    record = ScanRecord(
        user_id=user_id,
        scan_type='url',
        target_input=url_input,
        risk_score=result['risk_score'],
        threat_level=result['threat_level'],
        confidence=result['confidence'],
        reasons_json=json.dumps(result['reasons']),
        technical_details_json=json.dumps(result['technical_details']),
        recommendation="\n".join(result['recommendations']),
        ai_explanation=result['ai_explanation']
    )
    db.session.add(record)
    db.session.commit()
    
    result['id'] = record.id
    return jsonify({'status': 'success', 'result': result})


@analyze_bp.route('/qr', methods=['POST'])
def analyze_qr():
    data = request.get_json() or {}
    qr_content = data.get('qr_content', '').strip()
    user_id = data.get('user_id')
    
    if not qr_content:
        return jsonify({'status': 'error', 'message': 'QR code decoded content is required.'}), 400
        
    result = evaluate_risk('qr', qr_content)
    
    record = ScanRecord(
        user_id=user_id,
        scan_type='qr',
        target_input=qr_content,
        risk_score=result['risk_score'],
        threat_level=result['threat_level'],
        confidence=result['confidence'],
        reasons_json=json.dumps(result['reasons']),
        technical_details_json=json.dumps(result['technical_details']),
        recommendation="\n".join(result['recommendations']),
        ai_explanation=result['ai_explanation']
    )
    db.session.add(record)
    db.session.commit()
    
    result['id'] = record.id
    return jsonify({'status': 'success', 'result': result})


@analyze_bp.route('/message', methods=['POST'])
def analyze_message():
    data = request.get_json() or {}
    msg_text = data.get('message', '').strip()
    sender = data.get('sender', '').strip()
    user_id = data.get('user_id')
    
    if not msg_text:
        return jsonify({'status': 'error', 'message': 'Message text is required.'}), 400
        
    result = evaluate_risk('message', msg_text, context={'sender': sender})
    
    record = ScanRecord(
        user_id=user_id,
        scan_type='message',
        target_input=msg_text,
        risk_score=result['risk_score'],
        threat_level=result['threat_level'],
        confidence=result['confidence'],
        reasons_json=json.dumps(result['reasons']),
        technical_details_json=json.dumps(result['technical_details']),
        recommendation="\n".join(result['recommendations']),
        ai_explanation=result['ai_explanation']
    )
    db.session.add(record)
    db.session.commit()
    
    result['id'] = record.id
    return jsonify({'status': 'success', 'result': result})


@analyze_bp.route('/opportunity', methods=['POST'])
def analyze_opportunity():
    data = request.get_json() or {}
    company = data.get('company', '').strip()
    role = data.get('role', '').strip()
    details = data.get('details', '').strip()
    user_id = data.get('user_id')
    
    if not details:
        return jsonify({'status': 'error', 'message': 'Opportunity message or offer details required.'}), 400
        
    input_summary = f"{role} at {company}: {details}" if company else details
    result = evaluate_risk('opportunity', input_summary, context={'company': company, 'details': details})
    
    record = ScanRecord(
        user_id=user_id,
        scan_type='opportunity',
        target_input=input_summary,
        risk_score=result['risk_score'],
        threat_level=result['threat_level'],
        confidence=result['confidence'],
        reasons_json=json.dumps(result['reasons']),
        technical_details_json=json.dumps(result['technical_details']),
        recommendation="\n".join(result['recommendations']),
        ai_explanation=result['ai_explanation']
    )
    db.session.add(record)
    db.session.commit()
    
    result['id'] = record.id
    return jsonify({'status': 'success', 'result': result})


@analyze_bp.route('/file', methods=['POST'])
def analyze_file():
    user_id = request.form.get('user_id')
    file_obj = request.files.get('file')
    
    if not file_obj:
        # Fallback payload if JSON hash submitted
        data = request.get_json() or {}
        filename = data.get('filename', 'submitted_file.exe')
        file_hash = data.get('sha256', hashlib.sha256(filename.encode()).hexdigest())
    else:
        filename = file_obj.filename
        content = file_obj.read()
        file_hash = hashlib.sha256(content).hexdigest()
        
    result = evaluate_risk('file', filename, context={'sha256': file_hash})
    result['sha256'] = file_hash
    
    # Check suspicious extensions
    ext = filename.rsplit('.', 1)[-1].lower() if '.' in filename else ''
    if ext in ['exe', 'bat', 'vbs', 'scr', 'ps1', 'apk', 'dll', 'cmd']:
        result['risk_score'] = max(result['risk_score'], 85)
        result['threat_level'] = 'HIGH' if result['risk_score'] < 90 else 'CRITICAL'
        result['reasons'].append(f"Executable file extension (.{ext}) detected. Static execution threat.")

    record = ScanRecord(
        user_id=user_id,
        scan_type='file',
        target_input=f"{filename} (SHA256: {file_hash[:16]}...)",
        risk_score=result['risk_score'],
        threat_level=result['threat_level'],
        confidence=result['confidence'],
        reasons_json=json.dumps(result['reasons']),
        technical_details_json=json.dumps(result['technical_details']),
        recommendation="\n".join(result['recommendations']),
        ai_explanation=result['ai_explanation']
    )
    db.session.add(record)
    db.session.commit()
    
    result['id'] = record.id
    return jsonify({'status': 'success', 'result': result})
