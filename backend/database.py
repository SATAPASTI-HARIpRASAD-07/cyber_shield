from datetime import datetime, timezone
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

def utc_now():
    return datetime.now(timezone.utc)

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    role = db.Column(db.String(20), default='student') # student, admin
    created_at = db.Column(db.DateTime, default=utc_now)
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
        
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)


class ScanRecord(db.Model):
    __tablename__ = 'scans'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    scan_type = db.Column(db.String(32), nullable=False) # url, qr, message, opportunity, file, otp
    target_input = db.Column(db.Text, nullable=False)
    risk_score = db.Column(db.Integer, nullable=False)
    threat_level = db.Column(db.String(20), nullable=False) # SAFE, LOW, MEDIUM, HIGH, CRITICAL
    confidence = db.Column(db.Integer, default=85)
    reasons_json = db.Column(db.Text, nullable=False)
    technical_details_json = db.Column(db.Text, nullable=True)
    recommendation = db.Column(db.Text, nullable=False)
    ai_explanation = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=utc_now)


class Incident(db.Model):
    __tablename__ = 'incidents'
    
    id = db.Column(db.Integer, primary_key=True)
    incident_code = db.Column(db.String(32), unique=True, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    title = db.Column(db.String(128), nullable=False)
    primary_threat = db.Column(db.String(64), nullable=False)
    overall_risk_score = db.Column(db.Integer, nullable=False)
    status = db.Column(db.String(32), default='ACTIVE') # ACTIVE, RESOLVED, DISMISSED
    created_at = db.Column(db.DateTime, default=utc_now)


class EventCorrelation(db.Model):
    __tablename__ = 'event_correlations'
    
    id = db.Column(db.Integer, primary_key=True)
    incident_id = db.Column(db.Integer, db.ForeignKey('incidents.id'), nullable=False)
    event_type = db.Column(db.String(32), nullable=False) # OTP, CALL, MESSAGE, LINK, WEBSITE, FILE
    details = db.Column(db.Text, nullable=False)
    risk_weight = db.Column(db.Integer, default=20)
    timestamp = db.Column(db.DateTime, default=utc_now)
