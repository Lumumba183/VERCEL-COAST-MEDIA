'use client';

import { useEffect, useState } from 'react';
import { Loader2, Save, CheckCircle2 } from 'lucide-react';

export default function SettingsPage() {
  const [form, setForm] = useState({ stream_url: '', youtube_channel_id: '', site_tagline: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => (r.ok ? r.json() : {}))
      .then((data: Record<string, string>) =>
        setForm({
          stream_url: data.stream_url || '',
          youtube_channel_id: data.youtube_channel_id || '',
          site_tagline: data.site_tagline || '',
        })
      )
      .finally(() => setLoading(false));
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    setError('');
    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      setError(d.error || 'Save failed');
      return;
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  if (loading) return <div className="bg-white rounded-2xl p-10 text-center text-gray-400"><Loader2 className="animate-spin inline mr-2" />Loading settings…</div>;

  return (
    <div>
      <h2 className="font-extrabold text-coast-navy text-xl mb-5">Site Settings</h2>
      <form onSubmit={save} className="bg-white rounded-2xl shadow-sm p-7 space-y-6 max-w-2xl">
        <div>
          <label className="block text-sm font-bold text-coast-navy mb-1.5">Radio Stream URL</label>
          <input
            value={form.stream_url}
            onChange={(e) => setForm({ ...form, stream_url: e.target.value })}
            placeholder="https://stream.zeno.fm/xxxx"
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5"
          />
          <p className="text-xs text-gray-400 mt-1.5">
            Your live audio stream (Zeno.fm, Radio.co, etc.). Powers the persistent player and the Listen page.
          </p>
        </div>
        <div>
          <label className="block text-sm font-bold text-coast-navy mb-1.5">YouTube Channel ID</label>
          <input
            value={form.youtube_channel_id}
            onChange={(e) => setForm({ ...form, youtube_channel_id: e.target.value })}
            placeholder="UCxxxxxxxxxxxxxxxx"
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5"
          />
          <p className="text-xs text-gray-400 mt-1.5">
            Used to embed the Coast TV live stream on the /tv page.
          </p>
        </div>
        <div>
          <label className="block text-sm font-bold text-coast-navy mb-1.5">Site Tagline</label>
          <input
            value={form.site_tagline}
            onChange={(e) => setForm({ ...form, site_tagline: e.target.value })}
            placeholder="Kenya's Leading Coastal News, Radio & TV Platform"
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5"
          />
        </div>
        <div className="flex items-center gap-4">
          {error && <span className="text-sm text-coast-red">{error}</span>}
          {saved && <span className="text-sm text-emerald-600 flex items-center gap-1.5"><CheckCircle2 size={15} /> Saved!</span>}
          <button disabled={saving} className="ml-auto bg-coast-navy text-white font-bold px-6 py-2.5 rounded-lg disabled:opacity-60 flex items-center gap-2">
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />} Save Settings
          </button>
        </div>
      </form>
    </div>
  );
}
