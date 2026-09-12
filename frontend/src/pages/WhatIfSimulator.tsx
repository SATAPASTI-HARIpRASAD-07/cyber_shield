import React, { useState } from 'react';
import { PlaySquare, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';

export const WhatIfSimulator: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState<number>(0);
  const [chosenOption, setChosenOption] = useState<'A' | 'B' | null>(null);

  const scenarios = [
    {
      title: 'Fake Internship Registration Deposit',
      context: 'You receive an email claiming you were selected for an internship, but you must pay ₹999 within 2 hours to confirm your slot.',
      optionA: {
        label: 'Option A: Pay ₹999 immediately to secure the internship slot.',
        result: 'CRITICAL FAILURE (100% Loss)',
        riskScore: 98,
        consequence: 'Money is stolen. The fake recruiter stops responding. Your bank details may be compromised.'
      },
      optionB: {
        label: 'Option B: Close link & verify the company via your College Placement Office.',
        result: 'SUCCESSFUL DEFENSE (0% Loss)',
        riskScore: 0,
        consequence: 'You protected your money and reported the fake placement scam to your campus authority.'
      }
    },
    {
      title: 'Unexpected OTP + Urgent Call from "Bank Security"',
      context: 'An OTP arrives on your phone out of nowhere. 2 minutes later, someone calls claiming your account will be blocked unless you tell them the OTP.',
      optionA: {
        label: 'Option A: Tell them the OTP so they can unblock your account.',
        result: 'CRITICAL FAILURE (Account Drain)',
        riskScore: 100,
        consequence: 'The attacker uses the OTP to drain your bank balance or take control of your UPI account.'
      },
      optionB: {
        label: 'Option B: Hang up immediately and change your password from your official bank app.',
        result: 'SUCCESSFUL DEFENSE (Account Saved)',
        riskScore: 0,
        consequence: 'The attacker is blocked. Your funds remain 100% secure.'
      }
    }
  ];

  const current = scenarios[selectedScenario];

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-4 px-4">
      <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
        <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
          <PlaySquare className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">What-If Attack Path Simulator</h1>
          <p className="text-xs text-slate-400">
            Compare consequences of risky vs recommended safe actions in real-time scenarios.
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        {scenarios.map((sc, i) => (
          <button
            key={i}
            onClick={() => { setSelectedScenario(i); setChosenOption(null); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
              selectedScenario === i
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-slate-900 text-slate-400 border-slate-800'
            }`}
          >
            Scenario {i + 1}: {sc.title}
          </button>
        ))}
      </div>

      <div className="glass-panel p-6 space-y-5 border border-slate-800">
        <h3 className="text-base font-bold text-white">{current.title}</h3>
        <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-lg border border-slate-800">
          {current.context}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Option A */}
          <button
            onClick={() => setChosenOption('A')}
            className={`p-4 rounded-xl text-left border transition-all ${
              chosenOption === 'A'
                ? 'bg-red-950/30 border-red-500 text-red-200 glow-danger'
                : 'bg-slate-900/60 border-slate-800 hover:border-red-500/40 text-slate-200'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-bold text-red-400 mb-2">
              <span>RISKY CHOICE</span>
              <XCircle className="w-4 h-4" />
            </div>
            <p className="text-xs font-medium">{current.optionA.label}</p>
          </button>

          {/* Option B */}
          <button
            onClick={() => setChosenOption('B')}
            className={`p-4 rounded-xl text-left border transition-all ${
              chosenOption === 'B'
                ? 'bg-emerald-950/30 border-emerald-500 text-emerald-200 glow-safe'
                : 'bg-slate-900/60 border-slate-800 hover:border-emerald-500/40 text-slate-200'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-bold text-emerald-400 mb-2">
              <span>SAFE CHOICE</span>
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <p className="text-xs font-medium">{current.optionB.label}</p>
          </button>
        </div>

        {/* Simulator Consequence Outcome Box */}
        {chosenOption && (
          <div className={`p-5 rounded-xl border space-y-2 animate-fade-in ${
            chosenOption === 'A' ? 'bg-red-950/40 border-red-500/50 text-red-200' : 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
          }`}>
            <div className="flex items-center justify-between font-bold text-xs uppercase tracking-wider">
              <span>SIMULATED OUTCOME: {chosenOption === 'A' ? current.optionA.result : current.optionB.result}</span>
              <span className="font-mono text-sm">Risk Score: {chosenOption === 'A' ? current.optionA.riskScore : current.optionB.riskScore}/100</span>
            </div>
            <p className="text-xs leading-relaxed font-sans">
              {chosenOption === 'A' ? current.optionA.consequence : current.optionB.consequence}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
