import React, { useState } from 'react';
import { Globe } from 'lucide-react';

interface LanguageSelectorProps {
  onLanguageChange?: (lang: string) => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ onLanguageChange }) => {
  const [currentLang, setCurrentLang] = useState<string>('en');

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'te', label: 'తెలుగు (Telugu)' },
    { code: 'hi', label: 'हिंदी (Hindi)' },
  ];

  const handleSelect = (code: string) => {
    setCurrentLang(code);
    if (onLanguageChange) onLanguageChange(code);
  };

  return (
    <div className="flex items-center gap-1.5 bg-cyber-panel/80 border border-cyber-border px-2.5 py-1 rounded-lg text-xs">
      <Globe className="w-3.5 h-3.5 text-cyber-accent" />
      <select
        value={currentLang}
        onChange={(e) => handleSelect(e.target.value)}
        className="bg-transparent text-slate-200 outline-none cursor-pointer font-medium"
      >
        {languages.map((l) => (
          <option key={l.code} value={l.code} className="bg-slate-900 text-slate-100">
            {l.label}
          </option>
        ))}
      </select>
    </div>
  );
};
