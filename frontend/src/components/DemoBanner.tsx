import React from 'react';
import { Play, Sparkles } from 'lucide-react';
import { DEMO_PRESETS } from '../services/demoData';
import { DemoPreset } from '../types';

interface DemoBannerProps {
  onSelectPreset: (preset: DemoPreset) => void;
}

export const DemoBanner: React.FC<DemoBannerProps> = ({ onSelectPreset }) => {
  return (
    <div className="bg-gradient-to-r from-purple-950/40 via-cyber-panel to-sky-950/40 border border-purple-500/30 p-3 rounded-xl mb-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="p-1.5 bg-purple-500/20 text-purple-300 rounded-lg">
            <Sparkles className="w-4 h-4 animate-pulse" />
          </span>
          <div>
            <div className="text-xs font-bold text-purple-300 uppercase tracking-wider">
              DEMO MODE • Live Presentation Scenarios
            </div>
            <div className="text-[11px] text-slate-400">
              Click any scenario to test CYBER SHIELD X instantly without typing:
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {DEMO_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => onSelectPreset(preset)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-900/80 hover:bg-purple-900/40 border border-purple-500/30 hover:border-purple-400/60 rounded-lg text-xs font-medium text-slate-200 transition-all"
            >
              <Play className="w-3 h-3 text-purple-400 fill-purple-400" />
              {preset.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
