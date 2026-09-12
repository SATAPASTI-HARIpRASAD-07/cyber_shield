import React, { useState } from 'react';
import { Smartphone, Shield, Lock, Eye, AlertCircle } from 'lucide-react';

export const MobileGuardian: React.FC = () => {
  const [screenAccess, setScreenAccess] = useState(false);
  const [notificationAccess, setNotificationAccess] = useState(true);

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-4 px-4">
      <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
        <div className="p-3 bg-sky-500/10 border border-sky-500/30 rounded-xl text-sky-400">
          <Smartphone className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">AI Mobile Screen Guardian</h1>
          <p className="text-xs text-slate-400">
            Permission-based overlay guardian for mobile browsing protection.
          </p>
        </div>
      </div>

      <div className="glass-panel p-4 border border-sky-500/20 bg-sky-950/10 rounded-xl text-xs text-sky-200 flex items-start gap-2">
        <Lock className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold">Strict Privacy Guarantee:</strong> CYBER SHIELD X Mobile Guardian works 100% on-device with explicit user permissions. It NEVER records your camera, microphone, or private conversations.
        </div>
      </div>

      <div className="glass-panel p-6 space-y-5 border border-slate-800">
        <h3 className="text-sm font-bold text-slate-200">Device Permission Manager</h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-3.5 bg-slate-900 rounded-xl border border-slate-800">
            <div>
              <div className="text-xs font-bold text-white">Overlay & Screen Safety Inspection</div>
              <div className="text-[11px] text-slate-400">Highlights dangerous URLs on mobile screen before tapping</div>
            </div>
            <button
              onClick={() => setScreenAccess(!screenAccess)}
              className={`px-3 py-1 rounded-full text-xs font-bold font-mono transition-all ${
                screenAccess ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {screenAccess ? 'GRANTED' : 'GRANT PERMISSION'}
            </button>
          </div>

          <div className="flex items-center justify-between p-3.5 bg-slate-900 rounded-xl border border-slate-800">
            <div>
              <div className="text-xs font-bold text-white">Phishing SMS & OTP Alert Interceptor</div>
              <div className="text-[11px] text-slate-400">Notifies you if an incoming SMS contains fake internship or OTP scam keywords</div>
            </div>
            <button
              onClick={() => setNotificationAccess(!notificationAccess)}
              className={`px-3 py-1 rounded-full text-xs font-bold font-mono transition-all ${
                notificationAccess ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {notificationAccess ? 'GRANTED' : 'GRANT PERMISSION'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
