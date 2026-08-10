'use client';

import { useEffect, useState } from 'react';
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
    <div className="bg-coast-red text-white overflow-hidden">
      <div className="max-w-7xl mx-auto flex items-stretch">
        <span className="bg-coast-navy px-4 py-2 text-xs font-extrabold tracking-widest flex items-center shrink-0 z-10">
          BREAKING
        </span>
        <div className="overflow-hidden flex-1 flex items-center">
          <div className="animate-ticker py-2">
            {ticker.map((item, i) => (
              <span key={`${item.id}-${i}`} className="mx-6 text-sm font-medium">
                • {item.text}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
