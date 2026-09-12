import os
from dotenv import load_dotenv

basedir = os.path.abspath(os.path.dirname(__file__))
load_dotenv(os.path.join(basedir, '..', '.env'))

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'cybershieldx-secret-key-2026'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
        'sqlite:///' + os.path.join(basedir, 'cybershield.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # API Keys
    OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY')
    VIRUSTOTAL_API_KEY = os.environ.get('VIRUSTOTAL_API_KEY')
    URLSCAN_API_KEY = os.environ.get('URLSCAN_API_KEY')
    GOOGLE_SAFE_BROWSING_KEY = os.environ.get('GOOGLE_SAFE_BROWSING_KEY')
    
    # File upload limits
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB
