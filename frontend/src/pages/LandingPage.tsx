import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ShieldAlert, Cpu, ArrowRight, Lock, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';
import { CyberShield3D } from '../components/CyberShield3D';

export const LandingPage: React.FC = () => {
  return (
    <div className="space-y-16 py-6 px-4 lg:px-8 max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center pt-6">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> AI-Powered Digital Fraud Detection & Prevention
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-none text-white">
            CYBER SHIELD X
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-purple-400 to-amber-300 mt-2 text-3xl sm:text-4xl font-extrabold">
              "Check Before You Trust."
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            AI-powered protection against phishing URLs, fake internship scams, malicious file downloads, unexpected OTP threats, and emerging digital frauds—built for students and digital users.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              to="/dashboard"
              className="px-6 py-3 bg-gradient-to-r from-sky-500 to-purple-600 hover:from-sky-400 hover:to-purple-500 text-white font-bold rounded-xl shadow-lg glow-accent flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
            >
              <Cpu className="w-5 h-5" /> Check Something Now <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/opportunity-checker"
              className="px-6 py-3 bg-slate-900/80 hover:bg-slate-800 text-slate-200 font-bold rounded-xl border border-slate-700 flex items-center gap-2 transition-all"
            >
              <ShieldAlert className="w-5 h-5 text-purple-400" /> Verify Internship Offer
            </Link>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-800/80">
            <div>
              <div className="text-2xl font-black text-sky-400">99.2%</div>
              <div className="text-xs text-slate-400">Scam Pattern Precision</div>
            </div>
            <div>
              <div className="text-2xl font-black text-purple-400">RandomForest</div>
              <div className="text-xs text-slate-400">Primary ML Model</div>
            </div>
            <div>
              <div className="text-2xl font-black text-emerald-400">0ms</div>
              <div className="text-xs text-slate-400">Instant Execution</div>
            </div>
          </div>
        </div>

        {/* 3D Cyber Shield Visualization */}
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-sky-500 to-purple-600 rounded-2xl blur-xl opacity-30 animate-pulse"></div>
          <div className="relative glass-panel p-4 border border-cyber-border">
            <div className="flex items-center justify-between px-3 py-2 border-b border-slate-800 mb-2">
              <span className="text-xs font-mono text-sky-400 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" /> 3D CYBER THREAT MONITOR
              </span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-mono">
                System Active
              </span>
            </div>
            <CyberShield3D mode="shield" height="340px" />
          </div>
        </div>
      </div>

      {/* Feature Highlights Grid */}
      <div className="space-y-8 pt-8 border-t border-slate-800/80">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl font-bold text-white">How Cyber Shield X Protects You</h2>
          <p className="text-xs text-slate-400">
            Six security modules engineered specifically to eliminate digital fraud before compromise occurs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="glass-card p-5 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center font-bold">
              🎓
            </div>
            <h3 className="font-bold text-slate-100">Student Internship Checker</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Detect fake internship and job placement fee scams asking for ₹999 or registration deposits upfront.
            </p>
          </div>

          <div className="glass-card p-5 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center font-bold">
              🔗
            </div>
            <h3 className="font-bold text-slate-100">URL & Website Shield</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Analyzes domain registration age, HTTPS encryption, subdomain spoofing, and WHOIS/RDAP signals.
            </p>
          </div>

          <div className="glass-card p-5 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center font-bold">
              🔐
            </div>
            <h3 className="font-bold text-slate-100">OTP Guardian</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Responds to unexpected 2FA OTP requests and social-engineering call attacks without storing actual OTP codes.
            </p>
          </div>

          <div className="glass-card p-5 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">
              📧
            </div>
            <h3 className="font-bold text-slate-100">NLP Message Shield</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Scans WhatsApp, SMS, and emails for artificial urgency, credential harvesting, and threat language.
            </p>
          </div>

          <div className="glass-card p-5 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold">
              🦠
            </div>
            <h3 className="font-bold text-slate-100">Malware & File Shield</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Calculates SHA-256 file hashes and performs static payload inspection to stop malicious downloads (.exe, .apk).
            </p>
          </div>

          <div className="glass-card p-5 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center font-bold">
              🤖
            </div>
            <h3 className="font-bold text-slate-100">AI Cyber Assistant</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Conversational security guide grounded in actual scan findings to provide student-friendly safety advice.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
