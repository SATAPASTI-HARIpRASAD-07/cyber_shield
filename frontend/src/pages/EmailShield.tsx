import React, { useState } from 'react';
import { Mail, MessageSquare, ShieldAlert } from 'lucide-react';
import { analyzeInput } from '../services/api';
import { ScanResult } from '../types';
import { ResultCard } from '../components/ResultCard';

export const EmailShield: React.FC = () => {
  const [sender, setSender] = useState('');
  const [subject, setSubject] = useState('');
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    setLoading(true);
    try {
      const res = await analyzeInput('message', messageText.trim(), { sender, subject });
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
        <div className="p-3 bg-sky-500/10 border border-sky-500/30 rounded-xl text-sky-400">
          <Mail className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Email & Message Shield</h1>
          <p className="text-xs text-slate-400">
            NLP security parser for urgency, credential harvesting, threat language, and phishing scams.
          </p>
        </div>
      </div>

      <form onSubmit={handleAnalyze} className="glass-panel p-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-slate-300">Sender Email / Number (Optional):</label>
            <input
              type="text"
              value={sender}
              onChange={(e) => setSender(e.target.value)}
              placeholder="e.g. security-update@bank-verify-team.com"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-300">Email Subject (Optional):</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Urgent: Account Closure Notice"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-300">Message Content / Email Body:</label>
          <textarea
            rows={4}
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Paste suspicious email text, SMS message, or WhatsApp message here..."
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 outline-none resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !messageText.trim()}
          className="w-full py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl disabled:opacity-50 transition-all"
        >
          {loading ? 'Analyzing NLP Indicators...' : 'Analyze Message Content'}
        </button>
      </form>

      {result && <ResultCard result={result} />}
    </div>
  );
};
