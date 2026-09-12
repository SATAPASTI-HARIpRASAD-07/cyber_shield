import React, { useState } from 'react';
import { Settings as SettingsIcon, Shield, Lock, EyeOff, Save } from 'lucide-react';

export const Settings: React.FC = () => {
  const [saved, setSaved] = useState(false);
  const [anonymousMode, setAnonymousMode] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-4 px-4">
      <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
        <div className="p-3 bg-slate-800 border border-slate-700 rounded-xl text-slate-300">
          <SettingsIcon className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Privacy & Protection Settings</h1>
          <p className="text-xs text-slate-400">Configure data retention preferences and privacy controls.</p>
        </div>
      </div>

      {saved && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs rounded-xl font-medium">
          ✓ Settings saved successfully!
        </div>
      )}

      <form onSubmit={handleSave} className="glass-panel p-6 space-y-6 border border-slate-800">
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-200">Privacy & Data Retention</h3>

          <div className="flex items-center justify-between p-3.5 bg-slate-900 rounded-xl border border-slate-800">
            <div>
              <div className="text-xs font-bold text-white">Anonymous Scan Mode</div>
              <div className="text-[11px] text-slate-400">Do not store IP address or device identifiers with scan history</div>
            </div>
            <input
              type="checkbox"
              checked={anonymousMode}
              onChange={(e) => setAnonymousMode(e.target.checked)}
              className="w-4 h-4 accent-sky-500 cursor-pointer"
            />
          </div>
        </div>

        <button
          type="submit"
          className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 transition-all"
        >
          <Save className="w-4 h-4" /> Save Settings
        </button>
      </form>
    </div>
  );
};
