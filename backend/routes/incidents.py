import json
from flask import Blueprint, request, jsonify
from database import db, ScanRecord, Incident, EventCorrelation

incidents_bp = Blueprint('incidents', __name__, url_prefix='/api/incidents')

@incidents_bp.route('/history', methods=['GET'])
def get_history():
    user_id = request.args.get('user_id', type=int)
    query = ScanRecord.query
    if user_id:
        query = query.filter_by(user_id=user_id)
        
    records = query.order_by(ScanRecord.created_at.desc()).limit(50).all()
    history = []
    for r in records:
        history.append({
            'id': r.id,
            'scan_type': r.scan_type,
            'target_input': r.target_input,
            'risk_score': r.risk_score,
            'threat_level': r.threat_level,
            'confidence': r.confidence,
            'reasons': json.loads(r.reasons_json) if r.reasons_json else [],
            'recommendation': r.recommendation,
            'ai_explanation': r.ai_explanation,
            'created_at': r.created_at.strftime('%Y-%m-%d %H:%M')
        })
    return jsonify({'status': 'success', 'history': history})


@incidents_bp.route('/<int:scan_id>', methods=['GET'])
def get_scan_details(scan_id):
    r = ScanRecord.query.get_or_404(scan_id)
    return jsonify({
        'status': 'success',
        'result': {
            'id': r.id,
            'scan_type': r.scan_type,
            'target_input': r.target_input,
            'risk_score': r.risk_score,
            'threat_level': r.threat_level,
            'confidence': r.confidence,
            'reasons': json.loads(r.reasons_json) if r.reasons_json else [],
            'technical_details': json.loads(r.technical_details_json) if r.technical_details_json else {},
            'recommendation': r.recommendation,
            'ai_explanation': r.ai_explanation,
            'created_at': r.created_at.strftime('%Y-%m-%d %H:%M')
        }
    })
