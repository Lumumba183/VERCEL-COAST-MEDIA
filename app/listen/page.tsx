'use client';

import { useState, useEffect, useRef } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BriefSlider from '@/components/BriefSlider';
import { Play, Pause, Volume2, Radio, Headphones } from 'lucide-react';

export default function ListenPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio('https://radio.thecoast.co.ke/stream');
    audioRef.current.volume = volume / 100;
    return () => { if (audioRef.current) { audioRef.current.pause(); audioRef.current.src = ''; } };
  }, []);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume / 100;
  }, [volume]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const schedule = [
    { time: '06:00 - 10:00', show: 'Morning Drive', host: 'DJ Kipawa', active: true },
    { time: '10:00 - 13:00', show: 'Coast Talk', host: 'Amina Hassan', active: false },
    { time: '13:00 - 16:00', show: 'The Vibe', host: 'Mike Juma', active: false },
    { time: '16:00 - 19:00', show: 'Evening Reflections', host: 'Sarah Ochieng', active: false },
    { time: '19:00 - 06:00', show: 'Night Coast', host: 'Auto DJ', active: false },
  ];

  return (
    <>
      <Header />
      <BriefSlider />

      <section className="bg-gradient-to-br from-[#0a1628] to-[#1e3a5f] py-20 text-white text-center">
        <div className="max-w-[800px] mx-auto px-6">
          <Radio size={64} className="mx-auto mb-6 text-[#c9a227]" />
          <h1 className="text-5xl font-bold mb-4 font-[var(--font-heading)]">Radio Coast Live</h1>
          <p className="text-xl text-white/70 mb-10">Your coastal voice, 24/7. News, music, and community.</p>

          <div className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] rounded-3xl p-10 border border-white/10 shadow-2xl max-w-[500px] mx-auto">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-3 h-3 bg-[#ff4757] rounded-full live-pulse" />
              <span className="text-[#c9a227] font-semibold text-sm uppercase tracking-wider">On Air Now</span>
            </div>

            <div className="flex items-end justify-center gap-1 h-16 mb-8">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="w-1.5 bg-gradient-to-t from-[#00a8a8] to-[#0066cc] rounded-sm equalizer-bar" style={{ height: `${[30,70,50,90,40,80,60,100,45,75,55,85][i]}%`, animationDelay: `${i * 0.08}s` }} />
              ))}
            </div>

            <h2 className="text-2xl font-bold mb-2">Morning Drive with DJ Kipawa</h2>
            <p className="text-white/60 mb-8">06:00 - 10:00 | Mon - Fri</p>

            <button
              onClick={togglePlay}
              className="w-20 h-20 bg-gradient-to-br from-[#e63946] to-[#ff6b6b] rounded-full flex items-center justify-center text-white text-3xl shadow-lg hover:scale-110 transition-transform mx-auto mb-6"
            >
              {isPlaying ? <Pause size={32} fill="white" /> : <Play size={32} fill="white" className="ml-1" />}
            </button>

            <div className="flex items-center justify-center gap-3">
              <Volume2 size={18} className="text-white/60" />
              <input
                type="range" min="0" max="100" value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-40 accent-[#c9a227]"
              />
              <span className="text-white/60 text-sm w-8">{volume}%</span>
            </div>
          </div>
        </div>
      </section>

      {/* Schedule */}
      <section className="py-[60px] bg-[#f8f9fa]">
        <div className="max-w-[800px] mx-auto px-6">
          <h2 className="section-title mb-8 text-center justify-center">Today&apos;s Schedule</h2>
          <div className="flex flex-col gap-3">
            {schedule.map((slot, i) => (
              <div key={i} className={`flex items-center gap-4 p-4 rounded-xl ${slot.active ? 'bg-[#0a1628] text-white' : 'bg-white text-[#2d3748] shadow-sm'}`}>
                <div className="w-24 shrink-0">
                  <span className={`text-sm font-semibold ${slot.active ? 'text-[#c9a227]' : 'text-[#718096]'}`}>{slot.time}</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-base">{slot.show}</h3>
                  <p className={`text-sm ${slot.active ? 'text-white/70' : 'text-[#718096]'}`}>with {slot.host}</p>
                </div>
                {slot.active && (
                  <span className="bg-[#e63946] text-white text-[11px] font-bold uppercase px-3 py-1 rounded-full flex items-center gap-1">
                    <Headphones size={12} /> Live
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
