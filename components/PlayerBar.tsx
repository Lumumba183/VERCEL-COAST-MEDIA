'use client';

import { useState, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, X } from 'lucide-react';

interface PlayerBarProps {
  streamUrl?: string;
}

export default function PlayerBar({ streamUrl = 'https://radio.thecoast.co.ke/stream' }: PlayerBarProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [visible, setVisible] = useState(false);
  const [volume, setVolume] = useState(70);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    const a = new Audio(streamUrl);
    a.volume = volume / 100;
    setAudio(a);
    return () => { a.pause(); a.src = ''; };
  }, [streamUrl]);

  useEffect(() => {
    if (audio) audio.volume = volume / 100;
  }, [volume, audio]);

  const togglePlay = () => {
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      setVisible(false);
    } else {
      audio.play().catch(() => {});
      setIsPlaying(true);
      setVisible(true);
    }
  };

  const closePlayer = () => {
    if (audio) audio.pause();
    setIsPlaying(false);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-[#0a1628] to-[#1e3a5f] border-t-2 border-[#c9a227] py-3 px-6 flex justify-between items-center z-[999] transition-transform duration-300">
      <div className="flex items-center gap-4">
        <img src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=100&h=100&fit=crop" alt="Radio Coast" className="w-12 h-12 rounded-lg object-cover" />
        <div>
          <h4 className="text-white text-sm font-semibold font-[var(--font-body)]">Radio Coast — Fichua Wazi</h4>
          <span className="text-[#c9a227] text-xs">Morning Drive with DJ Kipawa</span>
        </div>
      </div>
      <div className="flex items-center gap-5">
        <button className="bg-none border-none text-white text-lg hover:text-[#c9a227] transition-colors cursor-pointer"><SkipBack size={18} /></button>
        <button onClick={togglePlay} className="w-11 h-11 bg-[#e63946] rounded-full flex items-center justify-center text-white cursor-pointer hover:scale-110 transition-transform">
          {isPlaying ? <Pause size={18} /> : <Play size={18} />}
        </button>
        <button className="bg-none border-none text-white text-lg hover:text-[#c9a227] transition-colors cursor-pointer"><SkipForward size={18} /></button>
      </div>
      <div className="flex items-center gap-2.5">
        <Volume2 size={16} className="text-white" />
        <input
          type="range" min="0" max="100" value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          className="w-[100px] accent-[#c9a227]"
        />
      </div>
      <button onClick={closePlayer} className="bg-none border-none text-white/50 text-lg cursor-pointer hover:text-white transition-colors">
        <X size={18} />
      </button>
    </div>
  );
}
