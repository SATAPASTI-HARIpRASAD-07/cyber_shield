import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Globe, QrCode, Mail, Key, Award, FileText, 
  ShieldCheck, ShieldAlert, Cpu, Sparkles, AlertTriangle, ArrowRight 
} from 'lucide-react';
import { analyzeInput } from '../services/api';
import { ScanResult, DemoPreset } from '../types';
import { ResultCard } from '../components/ResultCard';
import { DemoBanner } from '../components/DemoBanner';

export const Dashboard: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentResult, setCurrentResult] = useState<ScanResult | null>(null);
  const navigate = useNavigate();

  const handleUnifiedAnalyze = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setCurrentResult(null);

    // Auto-detect input type (URL, Opportunity, Message)
    let detectedType: 'url' | 'opportunity' | 'message' = 'url';
    const qLower = query.toLowerCase();

    if (qLower.includes('internship') || qLower.includes('job') || qLower.includes('hired') || qLower.includes('selected')) {
      detectedType = 'opportunity';
    } else if (!qLower.startsWith('http://') && !qLower.startsWith('https://') && !qLower.includes('.')) {
      detectedType = 'message';
    }

    try {
      const res = await analyzeInput(detectedType, query);
      setCurrentResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPreset = async (preset: DemoPreset) => {
    setQuery(preset.input);
    setLoading(true);
    setCurrentResult(null);
    setTimeout(() => {
      setCurrentResult(preset.result);
      setLoading(false);
    }, 400);
  };

  const handleAskAi = (result: ScanResult) => {
    navigate('/ai-assistant', { state: { contextResult: result } });
  };

  return (
    <div className="space-y-8 py-4 px-4 lg:px-8 max-w-7xl mx-auto">
      {/* Demo Banner */}
      <DemoBanner onSelectPreset={handleSelectPreset} />

      {/* Main Hero Input Box */}
      <div className="glass-panel p-6 sm:p-10 border border-cyber-border/80 text-center space-y-6 glow-accent">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-500/10 border border-sky-500/30 rounded-full text-sky-300 text-xs font-semibold">
          <Cpu className="w-3.5 h-3.5" /> UNIFIED SECURITY SEARCH ENGINE
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          CHECK BEFORE YOU TRUST
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto">
          Paste any suspicious URL, website link, email, SMS message, or internship offer letter below for instant AI risk analysis.
        </p>

        {/* Search Input Bar */}
        <form onSubmit={handleUnifiedAnalyze} className="max-w-2xl mx-auto">
          <div className="relative flex items-center bg-slate-950 border border-cyber-border rounded-2xl p-2 shadow-2xl focus-within:border-sky-400 focus-within:ring-2 focus-within:ring-sky-500/20 transition-all">
            <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Paste URL, message, or internship details here..."
              className="w-full bg-transparent px-3 py-2 text-sm text-slate-100 placeholder-slate-500 outline-none font-medium"
            />
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="px-6 py-2.5 bg-gradient-to-r from-sky-500 to-purple-600 hover:from-sky-400 hover:to-purple-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-lg flex items-center gap-2 shrink-0 transition-all"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Analyzing...
                </span>
              ) : (
                <>
                  ANALYZE <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Analysis Result Card Output */}
      {currentResult && (
        <div className="max-w-3xl mx-auto">
          <ResultCard result={currentResult} onAskAi={handleAskAi} />
        </div>
      )}

      {/* Quick Action Protection Cards */}
      <div className="space-y-4 pt-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          STUDENT QUICK PROTECTION MODULES
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          <button
            onClick={() => navigate('/opportunity-checker')}
            className="glass-card p-4 text-left space-y-2 group hover:border-amber-500/40"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold">
              🎓
            </div>
            <div className="font-bold text-xs text-slate-200 group-hover:text-amber-400 transition-colors">
              Check Internship / Job
            </div>
            <div className="text-[11px] text-slate-400 line-clamp-2">
              Detect fake offers demanding ₹999 fees.
            </div>
          </button>

          <button
            onClick={() => navigate('/url-scanner')}
            className="glass-card p-4 text-left space-y-2 group hover:border-sky-500/40"
          >
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 text-sky-400 flex items-center justify-center font-bold">
              🔗
            </div>
            <div className="font-bold text-xs text-slate-200 group-hover:text-sky-400 transition-colors">
              Check URL & Website
            </div>
            <div className="text-[11px] text-slate-400 line-clamp-2">
              Verify HTTPS, domain age, and login pages.
            </div>
          </button>

          <button
            onClick={() => navigate('/qr-scanner')}
            className="glass-card p-4 text-left space-y-2 group hover:border-purple-500/40"
          >
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center font-bold">
              📷
            </div>
            <div className="font-bold text-xs text-slate-200 group-hover:text-purple-400 transition-colors">
              Scan QR Code
            </div>
            <div className="text-[11px] text-slate-400 line-clamp-2">
              Decode QR image links safely.
            </div>
          </button>

          <button
            onClick={() => navigate('/otp-guardian')}
            className="glass-card p-4 text-left space-y-2 group hover:border-rose-500/40"
          >
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center font-bold">
              🔐
            </div>
            <div className="font-bold text-xs text-slate-200 group-hover:text-rose-400 transition-colors">
              OTP Guardian
            </div>
            <div className="text-[11px] text-slate-400 line-clamp-2">
              Handle unexpected OTP calls safely.
            </div>
          </button>

          <button
            onClick={() => navigate('/email-shield')}
            className="glass-card p-4 text-left space-y-2 group hover:border-sky-500/40"
          >
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 text-sky-400 flex items-center justify-center font-bold">
              📧
            </div>
            <div className="font-bold text-xs text-slate-200 group-hover:text-sky-400 transition-colors">
              Check Email & Message
            </div>
            <div className="text-[11px] text-slate-400 line-clamp-2">
              NLP urgency & scam detection.
            </div>
          </button>

          <button
            onClick={() => navigate('/malware-shield')}
            className="glass-card p-4 text-left space-y-2 group hover:border-red-500/40"
          >
            <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 flex items-center justify-center font-bold">
              🦠
            </div>
            <div className="font-bold text-xs text-slate-200 group-hover:text-red-400 transition-colors">
              Malware & File Shield
            </div>
            <div className="text-[11px] text-slate-400 line-clamp-2">
              SHA-256 hash & static payload inspection.
            </div>
          </button>

          <button
            onClick={() => navigate('/fraud-visualization')}
            className="glass-card p-4 text-left space-y-2 group hover:border-purple-500/40"
          >
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center font-bold">
              🕸️
            </div>
            <div className="font-bold text-xs text-slate-200 group-hover:text-purple-400 transition-colors">
              3D Fraud Twin Graph
            </div>
            <div className="text-[11px] text-slate-400 line-clamp-2">
              Interactive 3D attack network path.
            </div>
          </button>

          <button
            onClick={() => navigate('/what-if-simulator')}
            className="glass-card p-4 text-left space-y-2 group hover:border-amber-500/40"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold">
              🎮
            </div>
            <div className="font-bold text-xs text-slate-200 group-hover:text-amber-400 transition-colors">
              What-If Simulator
            </div>
            <div className="text-[11px] text-slate-400 line-clamp-2">
              Compare risky vs safe action choices.
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
