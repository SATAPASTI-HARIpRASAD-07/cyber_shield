import React, { useState } from 'react';
import { Key, AlertOctagon, PhoneCall, ShieldAlert, CheckCircle } from 'lucide-react';

export const OtpGuardian: React.FC = () => {
  const [requestedOtp, setRequestedOtp] = useState<boolean | null>(null);
  const [receivedCall, setReceivedCall] = useState<boolean>(false);
  const [bankName, setBankName] = useState('');

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-4 px-4">
      <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
        <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400">
          <Key className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">🔐 OTP Guardian & Call Protection</h1>
          <p className="text-xs text-slate-400">
            Responds to unexpected 2FA OTP events and social-engineering call attacks without storing actual OTP values.
          </p>
        </div>
      </div>

      <div className="glass-panel p-6 space-y-6 border border-rose-500/30">
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-slate-200">Question 1: Did you personally initiate a login or transaction right now?</h3>
          <div className="flex gap-3">
            <button
              onClick={() => setRequestedOtp(true)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                requestedOtp === true
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500'
                  : 'bg-slate-900 text-slate-300 border-slate-700'
              }`}
            >
              YES — I requested this OTP
            </button>
            <button
              onClick={() => setRequestedOtp(false)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                requestedOtp === false
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500 glow-danger'
                  : 'bg-slate-900 text-slate-300 border-slate-700'
              }`}
            >
              NO — I did NOT request an OTP
            </button>
          </div>
        </div>

        {requestedOtp === false && (
          <div className="space-y-4 pt-4 border-t border-slate-800 animate-fade-in">
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-slate-200">Question 2: Did you receive a phone call or WhatsApp message asking for this OTP?</h3>
              <div className="flex gap-3">
                <button
                  onClick={() => setReceivedCall(true)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                    receivedCall
                      ? 'bg-red-500/20 text-red-300 border-red-500 glow-danger'
                      : 'bg-slate-900 text-slate-300 border-slate-700'
                  }`}
                >
                  YES — Someone called asking for the OTP
                </button>
                <button
                  onClick={() => setReceivedCall(false)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                    !receivedCall
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500'
                      : 'bg-slate-900 text-slate-300 border-slate-700'
                  }`}
                >
                  NO — Only SMS received
                </button>
              </div>
            </div>

            {/* Assessment Panel */}
            <div className="p-5 bg-red-950/20 border border-red-500/40 rounded-xl space-y-3">
              <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
                <AlertOctagon className="w-5 h-5" /> UNEXPECTED AUTHENTICATION EVENT DETECTED (HIGH RISK)
              </div>

              <p className="text-xs text-slate-200 leading-relaxed">
                An attacker who possesses your stolen password or account credentials attempted to log in and triggered a 2FA OTP.
                {receivedCall && ' The follow-up phone call is a VISHING SOCIAL ENGINEERING attack designed to trick you into reading out the code.'}
              </p>

              <div className="space-y-1.5 pt-2 border-t border-red-500/30 text-xs">
                <div className="font-bold text-red-300">RECOMMENDED EMERGENCY ACTIONS:</div>
                <div className="text-slate-200">• 🛑 NEVER read out or share the OTP with the caller.</div>
                <div className="text-slate-200">• 🛑 Hang up the call immediately.</div>
                <div className="text-slate-200">• ✓ Immediately change your account password from your official banking app.</div>
              </div>
            </div>
          </div>
        )}

        {requestedOtp === true && (
          <div className="p-4 bg-emerald-950/20 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 shrink-0" />
            Standard authentication flow. Ensure the website domain in your browser matches the official domain before typing your OTP.
          </div>
        )}
      </div>
    </div>
  );
};
