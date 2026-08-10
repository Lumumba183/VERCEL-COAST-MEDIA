'use client';

import { useEffect, useRef, useState } from 'react';
import { Pause, Play, Radio, X } from 'lucide-react';
import { usePathname } from 'next/navigation';

/**
 * Persistent bottom audio player.
 * Reads the stream URL from site settings (set in Admin → Settings).
 * Hidden on admin pages and when no stream URL is configured.
 */
export default function PlayerBar() {
  const [streamUrl, setStreamUrl] = useState('');
  const [playing, setPlaying] = useState(false);
  const [visible, setVisible] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => (r.ok ? r.json() : {}))
      .then((data: Record<string, string>) => setStreamUrl(data.stream_url || ''))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setPlaying(false);
    }
  }, [streamUrl]);

  if (!streamUrl || pathname.startsWith('/admin') || !visible) return null;

  const toggle = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(streamUrl);
    }
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play().catch(() => setPlaying(false));
      setPlaying(true);
    }
  };

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 bg-coast-navy text-white shadow-2xl border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-4">
        <span className="w-9 h-9 rounded-lg bg-coast-red flex items-center justify-center shrink-0">
          <Radio size={18} />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-bold truncate">Radio Coast — Live</p>
          <div className="flex items-end gap-[3px] h-4" aria-hidden>
            {playing ? (
              <>
                <span className="eq-bar" /><span className="eq-bar" /><span className="eq-bar" />
                <span className="eq-bar" /><span className="eq-bar" /><span className="eq-bar" />
                <span className="eq-bar" />
              </>
            ) : (
              <span className="text-xs text-white/50">Paused</span>
            )}
          </div>
        </div>
        <button
          onClick={toggle}
          className="ml-auto w-10 h-10 rounded-full bg-coast-red flex items-center justify-center hover:brightness-110 transition shrink-0"
          aria-label={playing ? 'Pause' : 'Play'}
        >
          {playing ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
        </button>
        <button
          onClick={() => { audioRef.current?.pause(); setPlaying(false); setVisible(false); }}
          className="text-white/50 hover:text-white shrink-0"
          aria-label="Close player"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}
