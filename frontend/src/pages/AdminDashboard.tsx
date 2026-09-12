import React, { useEffect, useState } from 'react';
import { Lock, ShieldAlert, Users, Activity, BarChart2 } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    total_users: 1420,
    total_scans: 8540,
    threats_detected: 642,
    medium_threats: 1120,
    safe_checks: 6778,
    distribution: {
      url: 3420,
      qr: 1280,
      opportunity: 2150,
      file: 890,
      message: 800
    }
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-4 px-4">
      <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
        <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400">
          <Lock className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Admin Security Metrics Dashboard</h1>
          <p className="text-xs text-slate-400">Platform telemetry, total scans evaluated, and threat distribution.</p>
        </div>
      </div>

      {/* Aggregate Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-panel p-4 space-y-1">
          <div className="text-[11px] text-slate-400 font-medium">Total Active Users</div>
          <div className="text-2xl font-black text-white font-mono">{stats.total_users}</div>
        </div>

        <div className="glass-panel p-4 space-y-1">
          <div className="text-[11px] text-slate-400 font-medium">Total Evaluated Scans</div>
          <div className="text-2xl font-black text-sky-400 font-mono">{stats.total_scans}</div>
        </div>

        <div className="glass-panel p-4 space-y-1 border-red-500/30">
          <div className="text-[11px] text-red-300 font-medium">High/Critical Threats Blocked</div>
          <div className="text-2xl font-black text-red-400 font-mono">{stats.threats_detected}</div>
        </div>

        <div className="glass-panel p-4 space-y-1 border-emerald-500/30">
          <div className="text-[11px] text-emerald-300 font-medium">Verified Safe Checks</div>
          <div className="text-2xl font-black text-emerald-400 font-mono">{stats.safe_checks}</div>
        </div>
      </div>

      {/* Distribution Chart Breakdown */}
      <div className="glass-panel p-6 space-y-4 border border-slate-800">
        <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <BarChart2 className="w-4 h-4 text-sky-400" /> SCAN EVALUATION DISTRIBUTION BY MODULE
        </h3>

        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs text-slate-300 mb-1">
              <span>URL & Website Protection</span>
              <span className="font-mono text-sky-400">{stats.distribution.url} scans</span>
            </div>
            <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
              <div className="h-full bg-sky-500" style={{ width: '40%' }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-300 mb-1">
              <span>Student Internship & Job Checker</span>
              <span className="font-mono text-purple-400">{stats.distribution.opportunity} scans</span>
            </div>
            <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
              <div className="h-full bg-purple-500" style={{ width: '25%' }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-300 mb-1">
              <span>QR Code Shield</span>
              <span className="font-mono text-amber-400">{stats.distribution.qr} scans</span>
            </div>
            <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500" style={{ width: '15%' }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-300 mb-1">
              <span>Malware & File Shield</span>
              <span className="font-mono text-red-400">{stats.distribution.file} scans</span>
            </div>
            <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
              <div className="h-full bg-red-500" style={{ width: '10%' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
