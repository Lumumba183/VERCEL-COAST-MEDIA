'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash2, X, Loader2 } from 'lucide-react';
import { DAYS_OF_WEEK, type ScheduleItem } from '@/types';

const EMPTY = { day: 'Monday', start_time: '', end_time: '', show_name: '', host: '', description: '' };

export default function ScheduleTab() {
  const [items, setItems] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function load() {
    setLoading(true);
    const res = await fetch('/api/schedule');
    if (res.ok) setItems(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    const res = await fetch('/api/schedule', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      setError(d.error || 'Save failed');
      return;
    }
    setForm(EMPTY);
    setShowForm(false);
    load();
  }

  async function remove(id: string) {
    if (!confirm('Delete this programme slot?')) return;
    await fetch(`/api/schedule?id=${id}`, { method: 'DELETE' });
    load();
  }

  if (loading) return <div className="bg-white rounded-2xl p-10 text-center text-gray-400"><Loader2 className="animate-spin inline mr-2" />Loading schedule…</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-extrabold text-coast-navy text-xl">Programme Schedule ({items.length})</h2>
        <button onClick={() => { setShowForm(true); setError(''); }} className="bg-coast-red text-white font-bold px-4 py-2.5 rounded-lg flex items-center gap-2 text-sm hover:brightness-110">
          <Plus size={16} /> Add Show
        </button>
      </div>

      {showForm && (
        <form onSubmit={save} className="bg-white rounded-2xl shadow-sm p-6 mb-6 space-y-4 border-2 border-coast-blue/20">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-coast-navy">New Programme Slot</h3>
            <button type="button" onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <select value={form.day} onChange={(e) => setForm({ ...form, day: e.target.value })} className="border border-gray-200 rounded-lg px-4 py-2.5">
              {DAYS_OF_WEEK.map((d) => <option key={d}>{d}</option>)}
            </select>
            <input required type="time" value={form.start_time} onChange={(e) => setForm({ ...form, start_time: e.target.value })} className="border border-gray-200 rounded-lg px-4 py-2.5" />
            <input required type="time" value={form.end_time} onChange={(e) => setForm({ ...form, end_time: e.target.value })} className="border border-gray-200 rounded-lg px-4 py-2.5" />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <input required value={form.show_name} onChange={(e) => setForm({ ...form, show_name: e.target.value })} placeholder="Show name *" className="border border-gray-200 rounded-lg px-4 py-2.5" />
            <input value={form.host} onChange={(e) => setForm({ ...form, host: e.target.value })} placeholder="Host / presenter" className="border border-gray-200 rounded-lg px-4 py-2.5" />
          </div>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" rows={2} className="w-full border border-gray-200 rounded-lg px-4 py-2.5" />
          <div className="flex items-center gap-4">
            {error && <span className="text-sm text-coast-red">{error}</span>}
            <button disabled={saving} className="ml-auto bg-coast-navy text-white font-bold px-6 py-2.5 rounded-lg disabled:opacity-60 flex items-center gap-2">
              {saving && <Loader2 size={15} className="animate-spin" />} Add to Schedule
            </button>
          </div>
        </form>
      )}

      {DAYS_OF_WEEK.map((day) => {
        const dayItems = items.filter((i) => i.day === day);
        if (dayItems.length === 0) return null;
        return (
          <div key={day} className="mb-6">
            <h3 className="font-bold text-coast-navy mb-2">{day}</h3>
            <div className="bg-white rounded-2xl shadow-sm divide-y divide-gray-50">
              {dayItems.map((s) => (
                <div key={s.id} className="px-5 py-3.5 flex items-center gap-4">
                  <span className="text-coast-red font-bold text-sm w-32 shrink-0">{s.start_time} – {s.end_time}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-coast-navy truncate">{s.show_name}</p>
                    {s.host && <p className="text-xs text-gray-400">{s.host}</p>}
                  </div>
                  <button onClick={() => remove(s.id)} className="p-2 text-coast-red hover:bg-red-50 rounded-lg"><Trash2 size={15} /></button>
                </div>
              ))}
            </div>
          </div>
        );
      })}
      {items.length === 0 && (
        <div className="bg-white rounded-2xl p-10 text-center text-gray-500">No programmes yet — add your first show above.</div>
      )}
    </div>
  );
}
