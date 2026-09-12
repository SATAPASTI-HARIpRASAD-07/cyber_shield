import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Globe, QrCode, Mail, Key, ShieldAlert, Cpu, FileText, 
  HelpCircle, History, Network, PlaySquare, Award, Smartphone, 
  Settings, Lock, ShieldCheck
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { label: 'Student Dashboard', path: '/dashboard', icon: <Cpu className="w-4 h-4 text-sky-400" /> },
    { label: 'URL & Website Shield', path: '/url-scanner', icon: <Globe className="w-4 h-4 text-emerald-400" /> },
    { label: 'QR Scanner Shield', path: '/qr-scanner', icon: <QrCode className="w-4 h-4 text-purple-400" /> },
    { label: 'Email & Message Shield', path: '/email-shield', icon: <Mail className="w-4 h-4 text-sky-400" /> },
    { label: 'Student Opportunity Checker', path: '/opportunity-checker', icon: <Award className="w-4 h-4 text-amber-400" /> },
    { label: 'OTP Guardian', path: '/otp-guardian', icon: <Key className="w-4 h-4 text-rose-400" /> },
    { label: 'Malware & File Shield', path: '/malware-shield', icon: <FileText className="w-4 h-4 text-red-400" /> },
    { label: 'AI Cyber Assistant', path: '/ai-assistant', icon: <HelpCircle className="w-4 h-4 text-sky-300" /> },
    { label: 'Security History', path: '/history', icon: <History className="w-4 h-4 text-slate-400" /> },
    { label: '3D Fraud Twin Graph', path: '/fraud-visualization', icon: <Network className="w-4 h-4 text-purple-400" /> },
    { label: 'What-If Simulator', path: '/what-if-simulator', icon: <PlaySquare className="w-4 h-4 text-amber-400" /> },
    { label: 'Cyber Safety Simulator', path: '/safety-simulator', icon: <ShieldAlert className="w-4 h-4 text-emerald-400" /> },
    { label: 'Mobile Screen Guardian', path: '/mobile-guardian', icon: <Smartphone className="w-4 h-4 text-sky-400" /> },
    { label: 'Admin Security Metrics', path: '/admin', icon: <Lock className="w-4 h-4 text-rose-400" /> },
    { label: 'Privacy & Settings', path: '/settings', icon: <Settings className="w-4 h-4 text-slate-400" /> },
  ];

  return (
    <aside className="w-64 bg-cyber-panel/60 border-r border-cyber-border/40 min-h-[calc(100vh-65px)] p-4 hidden lg:block">
      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3 px-2">
        SECURITY PROTECTION SUITE
      </div>
      <div className="space-y-1">
        {navItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                active
                  ? 'bg-sky-500/15 text-sky-300 border border-sky-500/30 glow-accent'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              {item.icon}
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
};
