import os
from flask import Flask, jsonify, render_template, request
from flask_cors import CORS
from config import Config
from database import db

def create_app():
    app = Flask(__name__, template_folder='templates')
    app.config.from_object(Config)
    
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    
    db.init_app(app)
    
    # Register Blueprints
    from routes.auth import auth_bp, register, login
    from routes.analyze import analyze_bp
    from routes.incidents import incidents_bp
    from routes.assistant import assistant_bp
    from routes.admin import admin_bp
    
    app.register_blueprint(auth_bp)
    app.register_blueprint(analyze_bp)
    app.register_blueprint(incidents_bp)
    app.register_blueprint(assistant_bp)
    app.register_blueprint(admin_bp)

    # Alias endpoints for direct /api/signup, /api/login, /api/email-logs
    app.add_url_rule('/api/signup', view_func=register, methods=['POST'])
    app.add_url_rule('/api/login', view_func=login, methods=['POST'])
    
    @app.route('/api/email-logs', methods=['GET'])
    def email_logs():
        return jsonify({'status': 'success', 'logs': []})

    @app.route('/', methods=['GET'])
    def index():
        return render_template('index.html')

    @app.route('/api/health', methods=['GET'])
    def health():
        return jsonify({
            'status': 'ONLINE',
            'platform': 'CYBER SHIELD X API',
            'version': '1.0.0'
        })
        
    with app.app_context():
        db.create_all()
        
    return app

app = create_app()

if __name__ == '__main__':
    print("[START] Launching CYBER SHIELD X Universal App on http://127.0.0.1:5000")
    app.run(host='127.0.0.1', port=5000, debug=True)
