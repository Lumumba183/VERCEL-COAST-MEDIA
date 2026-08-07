'use client';

import { useEffect, useState } from 'react';
import { supabaseClient } from '@/lib/supabase';

interface BriefItem {
  id: string;
  content: string;
}

export default function BriefSlider() {
  const [items, setItems] = useState<BriefItem[]>([]);

  useEffect(() => {
    async function fetchBriefs() {
      const { data } = await supabaseClient
        .from('brief_items')
        .select('id, content')
        .order('order_index', { ascending: true })
        .limit(10);
      if (data) setItems(data);
    }
    fetchBriefs();
  }, []);

  const displayItems = items.length > 0 ? items : [
    { id: '1', content: 'President Ruto announces new coastal development fund for Mombasa and Kilifi counties' },
    { id: '2', content: 'Radio Coast launches new morning show "Fichua Wazi" with expanded coverage' },
    { id: '3', content: 'Mombasa Port records highest cargo throughput in five years' },
    { id: '4', content: 'Kilifi tourism sector sees 40% growth as international visitors return' },
    { id: '5', content: 'Coast Media Group wins regional journalism excellence award 2026' },
  ];

  // Duplicate for seamless loop
  const allItems = [...displayItems, ...displayItems];

  return (
    <div className="bg-gradient-to-r from-[#e63946] to-[#ff4757] text-white py-2.5 overflow-hidden relative z-[1001]">
      <div className="absolute left-0 top-0 h-full bg-[#0a1628] text-[#c9a227] px-4 flex items-center font-extrabold text-[11px] uppercase tracking-wider z-[2]">
        Breaking
      </div>
      <div className="flex whitespace-nowrap ticker-animation pl-[100px]">
        {allItems.map((item, idx) => (
          <span key={`${item.id}-${idx}`} className="px-10 text-sm font-medium flex items-center gap-2">
            <span className="text-[#c9a227] text-[8px]">&#9679;</span>
            {item.content}
          </span>
        ))}
      </div>
    </div>
  );
}
