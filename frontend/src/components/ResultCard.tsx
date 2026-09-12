import React from 'react';
import { ShieldAlert, ShieldCheck, AlertTriangle, AlertOctagon, HelpCircle, CheckCircle2, MessageSquareText } from 'lucide-react';
import { ScanResult } from '../types';
import { TTSPlayer } from './TTSPlayer';

interface ResultCardProps {
  result: ScanResult;
  onAskAi?: (context: ScanResult) => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({ result, onAskAi }) => {
  const getBadgeStyle = () => {
    switch (result.threat_level) {
      case 'CRITICAL':
        return { bg: 'bg-red-500/20 text-red-400 border-red-500/40 glow-danger', icon: <AlertOctagon className="w-5 h-5 text-red-400" /> };
      case 'HIGH':
        return { bg: 'bg-rose-500/20 text-rose-400 border-rose-500/40 glow-danger', icon: <ShieldAlert className="w-5 h-5 text-rose-400" /> };
      case 'MEDIUM':
        return { bg: 'bg-amber-500/20 text-amber-400 border-amber-500/40', icon: <AlertTriangle className="w-5 h-5 text-amber-400" /> };
      case 'LOW':
        return { bg: 'bg-blue-500/20 text-blue-400 border-blue-500/40', icon: <HelpCircle className="w-5 h-5 text-blue-400" /> };
      default:
        return { bg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 glow-safe', icon: <ShieldCheck className="w-5 h-5 text-emerald-400" /> };
    }
  };

  const badge = getBadgeStyle();
  const fullTextToRead = `Security Analysis Result: Threat Level is ${result.threat_level} with a risk score of ${result.risk_score} out of 100. Key reasons include: ${result.reasons.join('. ')}. Recommendations: ${result.recommendations.join('. ')}`;

  return (
    <div className="glass-panel p-6 border border-cyber-border/80 space-y-5 animate-fade-in">
      {/* Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl border ${badge.bg}`}>
            {badge.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border ${badge.bg}`}>
                {result.threat_level} RISK
              </span>
              <span className="text-xs text-slate-400 font-mono">Confidence: {result.confidence}%</span>
            </div>
            <h3 className="text-sm font-medium text-slate-300 mt-1 line-clamp-1 break-all">
              {result.target_input}
            </h3>
          </div>
        </div>

        {/* Risk Meter Gauge */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-xs text-slate-400 font-medium">Risk Score</div>
            <div className={`text-2xl font-black font-mono ${result.risk_score >= 60 ? 'text-red-400' : result.risk_score >= 30 ? 'text-amber-400' : 'text-emerald-400'}`}>
              {result.risk_score} <span className="text-xs text-slate-500 font-normal">/ 100</span>
            </div>
          </div>
          <TTSPlayer textToRead={fullTextToRead} />
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-800">
        <div
          className={`h-full rounded-full transition-all duration-700 ${
            result.risk_score >= 80 ? 'bg-red-500 shadow-[0_0_12px_#ef4444]' : result.risk_score >= 50 ? 'bg-amber-500' : 'bg-emerald-500'
          }`}
          style={{ width: `${Math.max(5, result.risk_score)}%` }}
        />
      </div>

      {/* Evidence / Reasons Grid */}
      <div className="space-y-2">
        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> Key Security Reasons & Evidence
        </h4>
        <ul className="space-y-1.5 text-xs text-slate-200">
          {result.reasons.map((r, i) => (
            <li key={i} className="flex items-start gap-2 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
              <span className="text-amber-400 font-bold mt-0.5">•</span>
              <span>{r}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* AI Explanation Box */}
      {result.ai_explanation && (
        <div className="bg-cyber-panel/90 border border-sky-500/20 p-4 rounded-xl space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold text-sky-400">
            <span className="flex items-center gap-1.5">🤖 CYBER SHIELD X AI Explanation</span>
            <span className="text-[10px] bg-sky-500/10 text-sky-300 px-2 py-0.5 rounded font-mono">Explainable AI</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-sans whitespace-pre-line">
            {result.ai_explanation}
          </p>
        </div>
      )}

      {/* Recommended Action */}
      <div className="space-y-2 pt-2 border-t border-slate-800/80">
        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Recommended Safe Actions
        </h4>
        <ul className="space-y-1.5 text-xs">
          {result.recommendations.map((rec, i) => (
            <li key={i} className="p-2 rounded-lg bg-emerald-950/20 border border-emerald-500/20 text-emerald-300 font-medium">
              {rec}
            </li>
          ))}
        </ul>
      </div>

      {/* Action Footer */}
      {onAskAi && (
        <div className="pt-2 flex justify-end">
          <button
            onClick={() => onAskAi(result)}
            className="flex items-center gap-2 px-3.5 py-2 bg-cyber-accent/15 hover:bg-cyber-accent/25 text-sky-300 text-xs font-semibold rounded-lg border border-sky-500/30 transition-all"
          >
            <MessageSquareText className="w-4 h-4" /> Ask AI Cyber Assistant About This Result
          </button>
        </div>
      )}
    </div>
  );
};
