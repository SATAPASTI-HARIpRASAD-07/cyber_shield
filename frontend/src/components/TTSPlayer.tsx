import React, { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface TTSPlayerProps {
  textToRead: string;
}

export const TTSPlayer: React.FC<TTSPlayerProps> = ({ textToRead }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleToggleSpeech = () => {
    if (!('speechSynthesis' in window)) {
      alert('Text-to-speech is not supported in this browser.');
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      window.speechSynthesis.cancel(); // Clear any ongoing speech
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.rate = 0.95;
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      
      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
    }
  };

  return (
    <button
      onClick={handleToggleSpeech}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
        isPlaying
          ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 glow-danger'
          : 'bg-cyber-accent/10 text-cyber-accent border-cyber-accent/30 hover:bg-cyber-accent/20'
      }`}
      title={isPlaying ? 'Stop Voice Alert' : 'Listen to Voice Security Warning'}
    >
      {isPlaying ? (
        <>
          <VolumeX className="w-3.5 h-3.5 animate-pulse" /> Stop Voice Alert
        </>
      ) : (
        <>
          <Volume2 className="w-3.5 h-3.5" /> Listen Audio Warning
        </>
      )}
    </button>
  );
};
