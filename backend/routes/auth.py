from flask import Blueprint, request, jsonify
from database import db, User

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json() or {}
    username = data.get('username', '').strip()
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')
    role = data.get('role', 'student')
    
    if not username or not email or not password:
        return jsonify({'status': 'error', 'message': 'Username, email, and password are required.'}), 400
        
    if User.query.filter_by(email=email).first():
        return jsonify({'status': 'error', 'message': 'Email address already registered.'}), 400
        
    if User.query.filter_by(username=username).first():
        return jsonify({'status': 'error', 'message': 'Username is already taken.'}), 400
        
    user = User(username=username, email=email, role=role)
    user.set_password(password)
    
    db.session.add(user)
    db.session.commit()
    
    return jsonify({
        'status': 'success',
        'message': 'Registration successful!',
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'role': user.role
        }
    })

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')
    
    if not email or not password:
        return jsonify({'status': 'error', 'message': 'Email and password are required.'}), 400
        
    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({'status': 'error', 'message': 'Invalid email or password.'}), 401
        
    return jsonify({
        'status': 'success',
        'message': f'Welcome back to CYBER SHIELD X, {user.username}!',
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'role': user.role
        }
    })
