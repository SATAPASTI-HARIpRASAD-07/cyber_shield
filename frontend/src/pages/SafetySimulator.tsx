import React, { useState } from 'react';
import { ShieldCheck, Award, CheckCircle2, XCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

export const SafetySimulator: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState<number | null>(null);

  const questions = [
    {
      q: 'A recruiter sends an offer letter asking for ₹999 registration fee before sending your laptop. What should you do?',
      options: ['Pay ₹999 immediately', 'Ignore & report to College Placement Office', 'Send half the money'],
      correct: 1,
      explanation: 'Legitimate employers NEVER charge candidates for internships or job offers.'
    },
    {
      q: 'You receive an unexpected SMS with a net banking OTP. What is the safest action?',
      options: ['Share it if someone calls asking for it', 'Never share it with anyone', 'Post it on Twitter'],
      correct: 1,
      explanation: 'Bank employees and legitimate systems will NEVER ask for your OTP over phone calls.'
    },
    {
      q: 'A friend sends a link `nptel-free-courses-claim.top`. What should you check first?',
      options: ['Check if domain is official (nptel.ac.in)', 'Click immediately', 'Type your password'],
      correct: 0,
      explanation: 'Scammers create lookalike domain names with suspicious TLDs like `.top` or `.xyz`.'
    }
  ];

  const q = questions[currentIdx];

  const handleSelect = (idx: number) => {
    if (answered !== null) return;
    setAnswered(idx);

    if (idx === q.correct) {
      setScore(s => s + 1);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    }
  };

  const handleNext = () => {
    setAnswered(null);
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(c => c + 1);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto py-4 px-4">
      <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Student Cyber Safety Quiz</h1>
          <p className="text-xs text-slate-400">Test your digital fraud defense skills and earn safety badges.</p>
        </div>
      </div>

      <div className="glass-panel p-6 space-y-5 border border-slate-800">
        <div className="flex justify-between items-center text-xs font-mono text-slate-400">
          <span>Question {currentIdx + 1} of {questions.length}</span>
          <span className="text-emerald-400 font-bold">Score: {score} Points</span>
        </div>

        <h3 className="text-sm font-bold text-white leading-relaxed">{q.q}</h3>

        <div className="space-y-2.5">
          {q.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              className={`w-full p-3.5 rounded-xl text-xs font-medium text-left border transition-all ${
                answered === null
                  ? 'bg-slate-900/80 border-slate-800 hover:border-sky-500/40 text-slate-200'
                  : i === q.correct
                  ? 'bg-emerald-950/40 border-emerald-500 text-emerald-200'
                  : answered === i
                  ? 'bg-red-950/40 border-red-500 text-red-200'
                  : 'bg-slate-950 border-slate-900 text-slate-500'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>

        {answered !== null && (
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2 text-xs">
            <div className="font-bold text-sky-400">
              {answered === q.correct ? '✓ Correct Answer!' : '❌ Incorrect'}
            </div>
            <p className="text-slate-300">{q.explanation}</p>
            {currentIdx < questions.length - 1 && (
              <button
                onClick={handleNext}
                className="mt-2 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-lg text-xs"
              >
                Next Question →
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
