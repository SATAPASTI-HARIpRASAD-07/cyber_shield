import React, { useState } from 'react';
import { Globe, Search, ArrowRight, ShieldCheck, AlertTriangle } from 'lucide-react';
import { analyzeInput } from '../services/api';
import { ScanResult } from '../types';
import { ResultCard } from '../components/ResultCard';

export const UrlScanner: React.FC = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    try {
      const res = await analyzeInput('url', url.trim());
      setResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-4 px-4">
      <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
          <Globe className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">URL & Website Shield</h1>
          <p className="text-xs text-slate-400">
            Analyzes domain age, SSL encryption, subdomains, and threat intelligence before you enter credentials.
          </p>
        </div>
      </div>

      <form onSubmit={handleScan} className="glass-panel p-4 space-y-3">
        <label className="text-xs font-semibold text-slate-300">Enter Website URL to Analyze:</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="e.g. http://apex-tech-labs-verify.xyz/login"
            className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 outline-none focus:border-emerald-500"
          />
          <button
            type="submit"
            disabled={loading || !url.trim()}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 transition-all disabled:opacity-50"
          >
            {loading ? 'Analyzing...' : 'Scan URL'}
          </button>
        </div>
      </form>

      {result && <ResultCard result={result} />}
    </div>
  );
};
