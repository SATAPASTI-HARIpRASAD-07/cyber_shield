import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';

import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { UrlScanner } from './pages/UrlScanner';
import { QrScanner } from './pages/QrScanner';
import { EmailShield } from './pages/EmailShield';
import { OpportunityChecker } from './pages/OpportunityChecker';
import { OtpGuardian } from './pages/OtpGuardian';
import { MalwareShield } from './pages/MalwareShield';
import { AiAssistant } from './pages/AiAssistant';
import { SecurityHistory } from './pages/SecurityHistory';
import { FraudVisualization } from './pages/FraudVisualization';
import { WhatIfSimulator } from './pages/WhatIfSimulator';
import { SafetySimulator } from './pages/SafetySimulator';
import { MobileGuardian } from './pages/MobileGuardian';
import { AdminDashboard } from './pages/AdminDashboard';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Settings } from './pages/Settings';

export const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-[#0a0d14] text-slate-100 flex flex-col font-sans">
        <Navbar />

        <div className="flex flex-1">
          <Sidebar />

          <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/url-scanner" element={<UrlScanner />} />
              <Route path="/qr-scanner" element={<QrScanner />} />
              <Route path="/email-shield" element={<EmailShield />} />
              <Route path="/opportunity-checker" element={<OpportunityChecker />} />
              <Route path="/otp-guardian" element={<OtpGuardian />} />
              <Route path="/malware-shield" element={<MalwareShield />} />
              <Route path="/ai-assistant" element={<AiAssistant />} />
              <Route path="/history" element={<SecurityHistory />} />
              <Route path="/fraud-visualization" element={<FraudVisualization />} />
              <Route path="/what-if-simulator" element={<WhatIfSimulator />} />
              <Route path="/safety-simulator" element={<SafetySimulator />} />
              <Route path="/mobile-guardian" element={<MobileGuardian />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};
