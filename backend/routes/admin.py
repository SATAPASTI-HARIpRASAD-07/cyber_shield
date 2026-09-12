from flask import Blueprint, jsonify
from database import db, ScanRecord, User

admin_bp = Blueprint('admin', __name__, url_prefix='/api/admin')

@admin_bp.route('/stats', methods=['GET'])
def get_admin_stats():
    total_users = User.query.count()
    total_scans = ScanRecord.query.count()
    
    threats_detected = ScanRecord.query.filter(ScanRecord.threat_level.in_(['HIGH', 'CRITICAL'])).count()
    medium_threats = ScanRecord.query.filter_by(threat_level='MEDIUM').count()
    safe_checks = ScanRecord.query.filter_by(threat_level='SAFE').count()
    
    # Distribution by scan type
    url_scans = ScanRecord.query.filter_by(scan_type='url').count()
    qr_scans = ScanRecord.query.filter_by(scan_type='qr').count()
    opportunity_scans = ScanRecord.query.filter_by(scan_type='opportunity').count()
    file_scans = ScanRecord.query.filter_by(scan_type='file').count()
    message_scans = ScanRecord.query.filter_by(scan_type='message').count()

    return jsonify({
        'status': 'success',
        'stats': {
            'total_users': total_users,
            'total_scans': total_scans,
            'threats_detected': threats_detected,
            'medium_threats': medium_threats,
            'safe_checks': safe_checks,
            'distribution': {
                'url': url_scans,
                'qr': qr_scans,
                'opportunity': opportunity_scans,
                'file': file_scans,
                'message': message_scans
            }
        }
    })
