import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, ShieldAlert, Cpu, History, User, Settings, Lock, Smartphone } from 'lucide-react';
import { LanguageSelector } from './LanguageSelector';

interface NavbarProps {
  onLanguageChange?: (lang: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onLanguageChange }) => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-[#0a0d14]/90 backdrop-blur-md border-b border-cyber-border/60 px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Logo & Branding */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-purple-600 flex items-center justify-center text-white glow-accent transition-transform group-hover:scale-105">
            <Shield className="w-6 h-6 fill-white/20" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-lg tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-purple-300 to-white">
                CYBER SHIELD X
              </span>
              <span className="text-[10px] bg-sky-500/15 text-sky-300 border border-sky-500/30 px-1.5 py-0.5 rounded font-mono font-bold">
                AI MVP
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono tracking-tight">
              Check Before You Trust
            </p>
          </div>
        </Link>

        {/* Primary Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          <Link
            to="/dashboard"
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              isActive('/dashboard') ? 'bg-sky-500/15 text-sky-300 border border-sky-500/30' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Cpu className="w-4 h-4 text-sky-400" /> Student Dashboard
          </Link>

          <Link
            to="/opportunity-checker"
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              isActive('/opportunity-checker') ? 'bg-purple-500/15 text-purple-300 border border-purple-500/30' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-purple-400" /> Internship & Job Checker
          </Link>

          <Link
            to="/ai-assistant"
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              isActive('/ai-assistant') ? 'bg-sky-500/15 text-sky-300 border border-sky-500/30' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            🤖 AI Assistant
          </Link>

          <Link
            to="/mobile-guardian"
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              isActive('/mobile-guardian') ? 'bg-sky-500/15 text-sky-300 border border-sky-500/30' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Smartphone className="w-4 h-4 text-sky-400" /> Screen Guardian
          </Link>

          <Link
            to="/history"
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              isActive('/history') ? 'bg-sky-500/15 text-sky-300 border border-sky-500/30' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <History className="w-4 h-4 text-slate-400" /> History
          </Link>
        </nav>

        {/* Right Tools */}
        <div className="flex items-center gap-3">
          <LanguageSelector onLanguageChange={onLanguageChange} />

          <Link
            to="/settings"
            className="p-2 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-lg text-xs transition-colors"
            title="Settings & Privacy"
          >
            <Settings className="w-4 h-4" />
          </Link>

          <Link
            to="/login"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-sky-500 to-purple-600 hover:from-sky-400 hover:to-purple-500 text-white text-xs font-bold rounded-lg shadow-md transition-all"
          >
            <User className="w-3.5 h-3.5" /> Sign In
          </Link>
        </div>
      </div>
    </header>
  );
};
