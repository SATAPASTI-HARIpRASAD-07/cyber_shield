import React from 'react';
import { Network, Activity, ShieldAlert, Cpu } from 'lucide-react';
import { CyberShield3D } from '../components/CyberShield3D';

export const FraudVisualization: React.FC = () => {
  const fraudDnaProfile = [
    { label: 'Phishing & URL Spoofing', percentage: 92, color: 'bg-red-500' },
    { label: 'Social Engineering & Vishing', percentage: 84, color: 'bg-amber-500' },
    { label: 'Credential Harvesting', percentage: 78, color: 'bg-purple-500' },
    { label: 'Student Internship Payment Scam', percentage: 70, color: 'bg-sky-500' }
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-4 px-4">
      <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
        <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-xl text-purple-400">
          <Network className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">3D Fraud Twin & Fraud DNA Matrix</h1>
          <p className="text-xs text-slate-400">
            Interactive multi-stage attack path graph and risk breakdown vector.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 3D Attack Graph Container */}
        <div className="glass-panel p-5 space-y-4 border border-purple-500/30">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-purple-400" /> FRAUD TWIN ATTACK PATH
            </h3>
            <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded font-mono">
              3D Interactive
            </span>
          </div>
          <CyberShield3D mode="network" height="300px" />
          <div className="grid grid-cols-5 text-center text-[10px] text-slate-400 font-mono gap-1">
            <span className="p-1 bg-slate-900 rounded">1. OTP</span>
            <span className="p-1 bg-slate-900 rounded">2. CALL</span>
            <span className="p-1 bg-slate-900 rounded">3. SMS</span>
            <span className="p-1 bg-slate-900 rounded">4. LINK</span>
            <span className="p-1 bg-slate-900 rounded">5. SITE</span>
          </div>
        </div>

        {/* Fraud DNA Matrix */}
        <div className="glass-panel p-5 space-y-5 border border-slate-800">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Cpu className="w-4 h-4 text-sky-400" /> FRAUD DNA RISK INDICATOR PROFILE
          </h3>
          <p className="text-xs text-slate-400">
            Vector decomposition of correlated threat indicators across recent digital activities.
          </p>

          <div className="space-y-4 pt-2">
            {fraudDnaProfile.map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-300">{item.label}</span>
                  <span className="font-mono text-sky-400 font-bold">{item.percentage}%</span>
                </div>
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color} transition-all duration-700`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
