import unittest
import json
import sys
import os

# Add backend directory to sys.path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

from app import create_app
from database import db, User, ScanRecord

class TestCyberShieldX(unittest.TestCase):
    def setUp(self):
        self.app = create_app()
        self.app.config['TESTING'] = True
        self.app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
        self.client = self.app.test_client()

        with self.app.app_context():
            db.create_all()

    def test_health(self):
        res = self.client.get('/api/health')
        self.assertEqual(res.status_code, 200)
        data = json.loads(res.data)
        self.assertEqual(data['status'], 'ONLINE')

    def test_url_analysis_phishing(self):
        payload = {'url': 'http://login.google-account-verify-sec.top/auth/login.php'}
        res = self.client.post('/api/analyze/url', json=payload)
        self.assertEqual(res.status_code, 200)
        data = json.loads(res.data)
        self.assertEqual(data['status'], 'success')
        self.assertIn(data['result']['threat_level'], ['HIGH', 'CRITICAL'])

    def test_opportunity_scam_analysis(self):
        payload = {
            'company': 'Apex Tech Labs',
            'role': 'Software Development Intern',
            'details': 'Selected for internship. Pay ₹999 refundable processing deposit within 2 hours. Link: http://apex-tech-labs-verify.xyz/pay'
        }
        res = self.client.post('/api/analyze/opportunity', json=payload)
        self.assertEqual(res.status_code, 200)
        data = json.loads(res.data)
        self.assertEqual(data['status'], 'success')
        self.assertIn(data['result']['threat_level'], ['HIGH', 'CRITICAL'])
        self.assertGreaterEqual(data['result']['risk_score'], 60)

    def test_qr_scanner_analysis(self):
        payload = {'qr_content': 'http://192.168.1.45/upi-pay-get-free-cashback-1000'}
        res = self.client.post('/api/analyze/qr', json=payload)
        self.assertEqual(res.status_code, 200)
        data = json.loads(res.data)
        self.assertEqual(data['status'], 'success')
        self.assertIn(data['result']['threat_level'], ['HIGH', 'CRITICAL'])

    def test_assistant_chat(self):
        payload = {'query': 'What should I do if an internship asks for ₹999 registration fee?'}
        res = self.client.post('/api/assistant/chat', json=payload)
        self.assertEqual(res.status_code, 200)
        data = json.loads(res.data)
        self.assertEqual(data['status'], 'success')
        self.assertIn('scam', data['response'].lower())

    def test_admin_stats(self):
        res = self.client.get('/api/admin/stats')
        self.assertEqual(res.status_code, 200)
        data = json.loads(res.data)
        self.assertEqual(data['status'], 'success')
        self.assertIn('total_scans', data['stats'])

if __name__ == '__main__':
    unittest.main()
