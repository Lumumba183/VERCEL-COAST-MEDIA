'use client';

import { useEffect, useState } from 'react';
import { Zap } from 'lucide-react';
import type { BriefItem } from '@/types';

export default function BriefSlider() {
  const [items, setItems] = useState<BriefItem[]>([]);

  useEffect(() => {
    fetch('/api/brief')
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => Array.isArray(data) && setItems(data))
      .catch(() => {});
  }, []);

  if (items.length === 0) return null;

  const ticker = [...items, ...items]; // duplicate for seamless loop

  return (
    <div className="w-full bg-coast-red text-white shadow-[0_2px_12px_rgba(239,45,63,0.35)]">
      <div className="max-w-7xl mx-auto flex items-stretch">
        {/* Live breaking badge */}
        <span className="relative flex items-center gap-2 shrink-0 z-10 bg-black/25 px-4 sm:px-6 py-2.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white" />
          </span>
          <Zap size={15} className="text-coast-gold fill-coast-gold" />
          <span className="text-xs sm:text-sm font-extrabold tracking-[0.2em] uppercase">Breaking</span>
        </span>

        {/* Scrolling items */}
        <div className="overflow-hidden flex-1 flex items-center">
          <div className="animate-ticker py-2.5">
            {ticker.map((item, i) => (
              <span key={`${item.id}-${i}`} className="mx-7 text-sm sm:text-[15px] font-semibold tracking-wide">
                <span className="text-coast-gold mr-3 font-extrabold">•</span>
                {item.text}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
