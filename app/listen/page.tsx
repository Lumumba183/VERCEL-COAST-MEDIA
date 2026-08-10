'use client';

import { useEffect, useRef, useState } from 'react';
import { Pause, Play, Radio, Volume2, AlertCircle } from 'lucide-react';

export default function ListenPage() {
  const [streamUrl, setStreamUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => (r.ok ? r.json() : {}))
      .then((data: Record<string, string>) => setStreamUrl(data.stream_url || ''))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const toggle = () => {
    if (!streamUrl) return;
    if (!audioRef.current) audioRef.current = new Audio(streamUrl);
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play().catch(() => setPlaying(false));
      setPlaying(true);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 mt-10">
      <div className="bg-gradient-to-br from-coast-navy to-coast-navy-light rounded-3xl p-8 md:p-14 text-center text-white shadow-xl">
        <span className="inline-flex items-center gap-2 bg-coast-red/20 text-coast-red text-xs font-bold px-4 py-1.5 rounded-full mb-6">
          <span className="w-2 h-2 rounded-full bg-coast-red animate-pulse" /> LIVE NOW
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold mb-2">Radio Coast</h1>
        <p className="text-coast-gold font-semibold tracking-widest mb-8">98.7 FM — MOMBASA · KILIFI · MALINDI</p>

        <div className="flex items-end justify-center gap-1 h-10 mb-8">
          {playing ? (
            <>
              <span className="eq-bar" style={{ height: 22 }} /><span className="eq-bar" /><span className="eq-bar" />
              <span className="eq-bar" /><span className="eq-bar" /><span className="eq-bar" /><span className="eq-bar" />
            </>
          ) : (
            <Volume2 size={36} className="text-white/30" />
          )}
        </div>

        {loading ? (
          <p className="text-white/60">Loading player…</p>
        ) : streamUrl ? (
          <button
            onClick={toggle}
            className="w-24 h-24 rounded-full bg-coast-red flex items-center justify-center mx-auto hover:scale-105 transition shadow-lg shadow-coast-red/40"
            aria-label={playing ? 'Pause' : 'Play'}
          >
            {playing ? <Pause size={38} /> : <Play size={38} className="ml-1.5" />}
          </button>
        ) : (
          <div className="max-w-md mx-auto bg-white/10 rounded-xl p-5 flex items-start gap-3 text-left">
            <AlertCircle className="text-coast-gold shrink-0 mt-0.5" size={20} />
            <p className="text-sm text-white/80">
              The live stream isn&apos;t configured yet. Staff can set the stream URL in{' '}
              <strong>Admin → Settings</strong>.
            </p>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-5 mt-10">
        {[
          { time: '05:00 – 09:00', show: 'Fichua Wazi', host: 'DJ Kipawa', desc: 'Morning drive with news, traffic and hits' },
          { time: '09:00 – 13:00', show: 'Pwani Mid-Morning', host: 'Mama Bahari', desc: 'Talk, lifestyle and coastal culture' },
          { time: '16:00 – 20:00', show: 'Mwangaza Drive', host: 'MC Rais', desc: 'Evening drive-time and sports updates' },
        ].map((s) => (
          <div key={s.show} className="bg-white rounded-2xl p-6 shadow-sm">
            <p className="text-xs font-bold text-coast-red mb-1">{s.time}</p>
            <h3 className="font-bold text-coast-navy text-lg flex items-center gap-2"><Radio size={17} /> {s.show}</h3>
            <p className="text-sm text-coast-blue font-semibold mt-0.5">with {s.host}</p>
            <p className="text-sm text-gray-500 mt-2">{s.desc}</p>
          </div>
        ))}
      </div>
      <p className="text-center text-sm text-gray-400 mt-6">
        See the full programme line-up on the <a href="/schedule" className="text-coast-blue font-semibold">Schedule page</a>.
      </p>
    </div>
  );
}
