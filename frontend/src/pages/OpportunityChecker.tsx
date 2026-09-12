import React, { useState } from 'react';
import { Award, ShieldAlert, CheckCircle, AlertOctagon } from 'lucide-react';
import { analyzeInput } from '../services/api';
import { ScanResult } from '../types';
import { ResultCard } from '../components/ResultCard';

export const OpportunityChecker: React.FC = () => {
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [details, setDetails] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!details.trim()) return;

    setLoading(true);
    try {
      const inputStr = company ? `${role} at ${company}: ${details}` : details;
      const res = await analyzeInput('opportunity', inputStr, { company, role });
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
        <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
          <Award className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Student Internship & Job Checker</h1>
          <p className="text-xs text-slate-400">
            Detect fake internship offers, training fee demands, hackathon deposits, and placement scams.
          </p>
        </div>
      </div>

      <div className="glass-panel p-4 border border-amber-500/20 bg-amber-950/10 rounded-xl text-xs text-amber-200 flex items-start gap-2">
        <AlertOctagon className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold">Golden Student Rule:</strong> Real companies and legitimate internship programs NEVER demand ₹999, registration fees, or processing charges from candidates.
        </div>
      </div>

      <form onSubmit={handleAnalyze} className="glass-panel p-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-slate-300">Company / Organization Name:</label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g. Apex Tech Labs"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-300">Position / Role Offered:</label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Remote Software Development Intern"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-300">Offer Message / Email Body / Details:</label>
          <textarea
            rows={4}
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="Paste the WhatsApp offer message, Telegram details, or email text here..."
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 outline-none resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !details.trim()}
          className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-purple-600 hover:from-amber-400 hover:to-purple-500 text-white font-bold text-xs rounded-xl disabled:opacity-50 transition-all shadow-lg"
        >
          {loading ? 'Evaluating Opportunity Trust Score...' : 'Calculate Opportunity Trust Score'}
        </button>
      </form>

      {result && <ResultCard result={result} />}
    </div>
  );
};
