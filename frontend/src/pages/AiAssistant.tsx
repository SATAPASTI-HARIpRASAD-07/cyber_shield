import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { HelpCircle, Send, Bot, User, Sparkles } from 'lucide-react';
import { askCyberAssistant } from '../services/api';
import { ScanResult } from '../types';

export const AiAssistant: React.FC = () => {
  const location = useLocation();
  const contextResult = (location.state as any)?.contextResult as ScanResult | undefined;

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'assistant'; text: string }>>([
    {
      sender: 'assistant',
      text: '🤖 **Hello! I am CYBER SHIELD X AI Assistant.** How can I help you evaluate a suspicious link, internship offer, or digital security concern today?'
    }
  ]);

  useEffect(() => {
    if (contextResult) {
      const initialPrompt = `I just analyzed "${contextResult.target_input}" which was flagged as ${contextResult.threat_level} Risk (${contextResult.risk_score}/100). Can you explain what I should do next?`;
      setInput(initialPrompt);
    }
  }, [contextResult]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input.trim();
    setInput('');
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setLoading(true);

    try {
      const reply = await askCyberAssistant(userText, contextResult);
      setMessages(prev => [...prev, { sender: 'assistant', text: reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'assistant', text: '⚠️ Unable to connect to assistant service.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-4 px-4">
      <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
        <div className="p-3 bg-sky-500/10 border border-sky-500/30 rounded-xl text-sky-400">
          <HelpCircle className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">AI Cyber Assistant</h1>
          <p className="text-xs text-slate-400">
            Conversational cybersecurity helper grounded in actual scan evidence and student security guidelines.
          </p>
        </div>
      </div>

      {/* Chat Messages Stream */}
      <div className="glass-panel p-4 h-[420px] overflow-y-auto space-y-4 border border-cyber-border/60">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex gap-3 max-w-[85%] ${m.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
              m.sender === 'user' ? 'bg-purple-600 text-white' : 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
            }`}>
              {m.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>
            <div className={`p-3.5 rounded-2xl text-xs leading-relaxed whitespace-pre-line ${
              m.sender === 'user' 
                ? 'bg-purple-600 text-white font-medium' 
                : 'bg-slate-900 border border-slate-800 text-slate-200 font-sans'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-3 max-w-[85%]">
            <div className="w-8 h-8 rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center">
              <Bot className="w-4 h-4 animate-pulse" />
            </div>
            <div className="p-3 bg-slate-900 border border-slate-800 text-xs text-slate-400 rounded-2xl flex items-center gap-2">
              <span className="w-2 h-2 bg-sky-400 rounded-full animate-ping"></span>
              Grounded AI Assistant is formulating answer...
            </div>
          </div>
        )}
      </div>

      {/* Input Box */}
      <form onSubmit={handleSend} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask AI Cyber Assistant anything..."
          className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 outline-none focus:border-sky-400"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 transition-all disabled:opacity-50"
        >
          <Send className="w-4 h-4" /> Send
        </button>
      </form>
    </div>
  );
};
