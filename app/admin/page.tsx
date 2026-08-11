'use client';

import { useEffect, useState } from 'react';
import { Newspaper, CalendarDays, Inbox, LayoutDashboard } from 'lucide-react';
import ArticlesTab from '@/components/admin/ArticlesTab';
import ScheduleTab from '@/components/admin/ScheduleTab';
import ReportsTab from '@/components/admin/ReportsTab';
import AnalyticsPanel from '@/components/admin/AnalyticsPanel';
import type { Article, Report, ScheduleItem } from '@/types';

type Tab = 'dashboard' | 'articles' | 'schedule' | 'reports';

const TABS: { id: Tab; label: string; icon: typeof Newspaper }[] = [
  { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
  { id: 'articles', label: 'Articles', icon: Newspaper },
  { id: 'schedule', label: 'Schedule', icon: CalendarDays },
  { id: 'reports', label: 'Reports', icon: Inbox },
];

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>('dashboard');
  const [stats, setStats] = useState({ articles: 0, published: 0, schedule: 0, newReports: 0 });

  useEffect(() => {
    if (tab !== 'dashboard') return;
    Promise.all([
      fetch('/api/articles?all=1').then((r) => (r.ok ? r.json() : [])),
      fetch('/api/schedule').then((r) => (r.ok ? r.json() : [])),
      fetch('/api/reports').then((r) => (r.ok ? r.json() : [])),
    ]).then(([articles, schedule, reports]: [Article[], ScheduleItem[], Report[]]) => {
      setStats({
        articles: articles.length,
        published: articles.filter((a) => a.published).length,
        schedule: schedule.length,
        newReports: reports.filter((r) => r.status === 'new').length,
      });
    });
  }, [tab]);

  return (
    <div>
      {/* Tab nav */}
      <div className="bg-white rounded-2xl shadow-sm p-2 flex gap-1 mb-6 overflow-x-auto">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition whitespace-nowrap ${
              tab === id ? 'bg-coast-navy text-white' : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            <Icon size={16} /> {label}
          </button>
        ))}
      </div>

      {tab === 'dashboard' && (
        <div>
          <h2 className="font-extrabold text-coast-navy text-xl mb-5">Overview</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {[
              { label: 'Total Articles', value: stats.articles, color: 'bg-coast-blue', action: () => setTab('articles') },
              { label: 'Published', value: stats.published, color: 'bg-emerald-600', action: () => setTab('articles') },
              { label: 'Programme Slots', value: stats.schedule, color: 'bg-coast-gold', action: () => setTab('schedule') },
              { label: 'New Reports', value: stats.newReports, color: 'bg-coast-red', action: () => setTab('reports') },
            ].map((s) => (
              <button key={s.label} onClick={s.action} className="bg-white rounded-2xl shadow-sm p-6 text-left hover:shadow-lg transition">
                <span className={`${s.color} w-2 h-10 rounded-full inline-block mb-3`} />
                <p className="text-3xl font-extrabold text-coast-navy">{s.value}</p>
                <p className="text-sm text-gray-500">{s.label}</p>
              </button>
            ))}
          </div>
          <AnalyticsPanel />
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="font-bold text-coast-navy mb-3">Quick guide</h3>
            <ul className="text-sm text-gray-500 space-y-2">
              <li>• <strong>Articles</strong> — publish news; mark one as Featured to make it the homepage hero.</li>
              <li>• <strong>Schedule</strong> — manage the weekly radio line-up shown on /schedule.</li>
              <li>• <strong>Reports</strong> — review public story tips and advertising enquiries.</li>
              <li>• <strong>Brief Slider</strong> (sidebar) — control the breaking-news ticker on the homepage.</li>
              <li>• <strong>Settings</strong> (sidebar) — set the radio stream URL and YouTube channel ID.</li>
            </ul>
          </div>
        </div>
      )}

      {tab === 'articles' && <ArticlesTab />}
      {tab === 'schedule' && <ScheduleTab />}
      {tab === 'reports' && <ReportsTab />}
    </div>
  );
}
