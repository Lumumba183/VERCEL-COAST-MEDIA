'use client';

import { useEffect, useState } from 'react';
import { Loader2, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import type { Report } from '@/types';
import { timeAgo } from '@/lib/utils';

const STATUS_STYLES: Record<string, string> = {
  new: 'bg-coast-red/10 text-coast-red',
  reviewed: 'bg-amber-100 text-amber-700',
  resolved: 'bg-emerald-100 text-emerald-700',
};

export default function ReportsTab() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');

  async function load() {
    setLoading(true);
    const res = await fetch('/api/reports');
    if (res.ok) setReports(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function setStatus(id: string, status: string) {
    await fetch('/api/reports', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    load();
  }

  async function remove(id: string) {
    if (!confirm('Delete this report permanently?')) return;
    await fetch(`/api/reports?id=${id}`, { method: 'DELETE' });
    load();
  }

  if (loading) return <div className="bg-white rounded-2xl p-10 text-center text-gray-400"><Loader2 className="animate-spin inline mr-2" />Loading reports…</div>;

  const filtered = filter === 'all' ? reports : reports.filter((r) => r.status === filter);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <h2 className="font-extrabold text-coast-navy text-xl">Story Submissions ({reports.length})</h2>
        <div className="flex gap-2">
          {['all', 'new', 'reviewed', 'resolved'].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold capitalize transition ${
                filter === s ? 'bg-coast-navy text-white' : 'bg-white text-gray-500 hover:bg-gray-100'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center text-gray-500">
          {reports.length === 0 ? 'No submissions yet.' : `No ${filter} reports.`}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((r) => (
            <div key={r.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <button
                onClick={() => setExpanded(expanded === r.id ? null : r.id)}
                className="w-full px-5 py-4 flex items-center gap-4 text-left"
              >
                <span className={`text-xs font-bold px-2.5 py-1 rounded capitalize shrink-0 ${STATUS_STYLES[r.status]}`}>
                  {r.status}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-coast-navy truncate">{r.subject}</p>
                  <p className="text-xs text-gray-400">
                    {r.name} · {r.location || 'No location'} · {timeAgo(r.created_at)}
                  </p>
                </div>
                {expanded === r.id ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
              </button>

              {expanded === r.id && (
                <div className="px-5 pb-5 border-t border-gray-100 pt-4">
                  <p className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed mb-4">{r.message}</p>
                  <div className="text-xs text-gray-400 mb-4 space-y-1">
                    <p>Email: <a href={`mailto:${r.email}`} className="text-coast-blue">{r.email}</a></p>
                    {r.phone && <p>Phone: {r.phone}</p>}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {r.status !== 'reviewed' && (
                      <button onClick={() => setStatus(r.id, 'reviewed')} className="px-4 py-2 rounded-lg bg-amber-100 text-amber-700 text-xs font-bold hover:brightness-95">
                        Mark Reviewed
                      </button>
                    )}
                    {r.status !== 'resolved' && (
                      <button onClick={() => setStatus(r.id, 'resolved')} className="px-4 py-2 rounded-lg bg-emerald-100 text-emerald-700 text-xs font-bold hover:brightness-95">
                        Mark Resolved
                      </button>
                    )}
                    <button onClick={() => remove(r.id)} className="px-4 py-2 rounded-lg bg-red-50 text-coast-red text-xs font-bold hover:brightness-95 flex items-center gap-1.5 ml-auto">
                      <Trash2 size={13} /> Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
