'use client';

import { useEffect, useState } from 'react';
import { Activity, Users, Eye, TrendingUp, Radio } from 'lucide-react';

interface Analytics {
  live: number;
  today: number;
  week: number;
  month: number;
  viewsToday: number;
  viewsWeek: number;
  viewsMonth: number;
  daily: { date: string; visitors: number; views: number }[];
  topPages: { path: string; views: number }[];
}

export default function AnalyticsPanel() {
  const [data, setData] = useState<Analytics | null>(null);
  const [err, setErr] = useState(false);

  const load = () => {
    fetch('/api/analytics')
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setData)
      .catch(() => setErr(true));
  };

  useEffect(() => {
    load();
    const t = setInterval(load, 30000); // refresh live count every 30s
    return () => clearInterval(t);
  }, []);

  if (err) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
        <p className="text-sm text-gray-500">
          Analytics unavailable. Make sure the <code className="bg-gray-100 px-1 rounded">page_views</code> table
          exists in Supabase (run the analytics SQL in the SQL Editor).
        </p>
      </div>
    );
  }
  if (!data) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 animate-pulse">
        <div className="h-4 bg-gray-100 rounded w-40 mb-4" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => <div key={i} className="h-20 bg-gray-100 rounded-xl" />)}
        </div>
      </div>
    );
  }

  const maxVisitors = Math.max(...data.daily.map((d) => d.visitors), 1);
  const cards = [
    { label: 'Visitors today', value: data.today, sub: `${data.viewsToday} page views`, icon: Users, color: 'text-coast-blue' },
    { label: 'Last 7 days', value: data.week, sub: `${data.viewsWeek} page views`, icon: TrendingUp, color: 'text-emerald-600' },
    { label: 'This month', value: data.month, sub: `${data.viewsMonth} page views`, icon: Eye, color: 'text-coast-gold' },
  ];
  const fmtDay = (iso: string) => new Date(iso + 'T00:00:00').toLocaleDateString('en-KE', { day: 'numeric', month: 'short' });

  return (
    <div className="mb-8">
      <h3 className="font-extrabold text-coast-navy text-lg mb-4 flex items-center gap-2">
        <Activity size={18} className="text-coast-blue" /> Website Traffic
      </h3>

      {/* Live now banner */}
      <div className="bg-coast-navy rounded-2xl shadow-sm p-6 mb-5 flex items-center justify-between text-white">
        <div className="flex items-center gap-4">
          <span className="relative flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-400" />
          </span>
          <div>
            <p className="text-3xl font-extrabold leading-none">{data.live}</p>
            <p className="text-xs text-white/60 mt-1 uppercase tracking-widest font-semibold">on the site right now</p>
          </div>
        </div>
        <Radio size={32} className="text-white/20" />
      </div>

      {/* Period cards */}
      <div className="grid sm:grid-cols-3 gap-4 mb-5">
        {cards.map((c) => (
          <div key={c.label} className="bg-white rounded-2xl shadow-sm p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{c.label}</p>
              <c.icon size={16} className={c.color} />
            </div>
            <p className="text-2xl font-extrabold text-coast-navy">{c.value.toLocaleString()}</p>
            <p className="text-xs text-gray-400 mt-0.5">{c.sub}</p>
          </div>
        ))}
      </div>

      {/* 14-day chart */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-5">
        <p className="text-sm font-bold text-coast-navy mb-4">Unique visitors — last 14 days</p>
        <div className="flex items-end gap-1.5 h-32">
          {data.daily.map((d) => (
            <div key={d.date} className="flex-1 flex flex-col items-center gap-1 group relative">
              <div
                className="w-full bg-coast-blue/80 rounded-t hover:bg-coast-blue transition min-h-[3px]"
                style={{ height: `${(d.visitors / maxVisitors) * 100}%` }}
              />
              <span className="text-[9px] text-gray-400 rotate-45 origin-left whitespace-nowrap">{fmtDay(d.date)}</span>
              <div className="absolute -top-8 hidden group-hover:block bg-coast-navy text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-10">
                {d.visitors} visitors · {d.views} views
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top pages */}
      {data.topPages.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <p className="text-sm font-bold text-coast-navy mb-3">Most viewed pages (last 14 days)</p>
          <ul className="divide-y divide-gray-50">
            {data.topPages.map((p) => (
              <li key={p.path} className="py-2 flex items-center justify-between text-sm">
                <span className="text-gray-600 truncate mr-4 font-medium">{p.path === '/' ? 'Homepage' : p.path}</span>
                <span className="text-coast-navy font-extrabold shrink-0">{p.views.toLocaleString()}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
