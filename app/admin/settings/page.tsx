'use client';

import { useEffect, useState } from 'react';
import { Loader2, Save, CheckCircle2, Radio, Tv } from 'lucide-react';

export default function SettingsPage() {
  const [form, setForm] = useState({
    stream_url: '',
    tv_provider: 'youtube',
    youtube_channel_id: '',
    twitch_channel: '',
    site_tagline: '',
  });
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
          tv_provider: data.tv_provider === 'twitch' ? 'twitch' : 'youtube',
          youtube_channel_id: data.youtube_channel_id || '',
          twitch_channel: data.twitch_channel || '',
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
      <form onSubmit={save} className="space-y-6 max-w-2xl">
        {/* Radio stream */}
        <div className="bg-white rounded-2xl shadow-sm p-7">
          <h3 className="font-bold text-coast-navy mb-4 flex items-center gap-2"><Radio size={18} className="text-coast-red" /> Radio Coast — Live Stream</h3>
          <label className="block text-sm font-semibold text-gray-600 mb-1.5">Stream URL</label>
          <input
            value={form.stream_url}
            onChange={(e) => setForm({ ...form, stream_url: e.target.value })}
            placeholder="https://stream.zeno.fm/xxxx"
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5"
          />
          <p className="text-xs text-gray-400 mt-1.5">
            Your live audio stream link (Zeno.fm, Radio.co, etc.). Powers the persistent player and the Listen page.
          </p>
        </div>

        {/* TV provider */}
        <div className="bg-white rounded-2xl shadow-sm p-7">
          <h3 className="font-bold text-coast-navy mb-4 flex items-center gap-2"><Tv size={18} className="text-coast-blue" /> Coast TV — Live Video</h3>
          <p className="text-sm font-semibold text-gray-600 mb-2">Choose your live video platform — tick one</p>
          <div className="grid grid-cols-2 gap-3 mb-5">
            {[
              { id: 'youtube', label: 'YouTube', desc: 'Embed a YouTube channel live stream' },
              { id: 'twitch', label: 'Twitch', desc: 'Embed a Twitch channel player' },
            ].map((p) => (
              <label
                key={p.id}
                className={`flex items-start gap-3 border-2 rounded-xl p-4 cursor-pointer transition ${
                  form.tv_provider === p.id ? 'border-coast-blue bg-blue-50/50' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="tv_provider"
                  checked={form.tv_provider === p.id}
                  onChange={() => setForm({ ...form, tv_provider: p.id })}
                  className="mt-1"
                />
                <span>
                  <span className="block font-bold text-coast-navy text-sm">{p.label}</span>
                  <span className="block text-xs text-gray-400">{p.desc}</span>
                </span>
              </label>
            ))}
          </div>

          {form.tv_provider === 'youtube' ? (
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1.5">YouTube Channel ID or link</label>
              <input
                value={form.youtube_channel_id}
                onChange={(e) => setForm({ ...form, youtube_channel_id: e.target.value })}
                placeholder="UCxxxxxxxxxxxxxxxx  or  https://www.youtube.com/@YourChannel"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5"
              />
              <p className="text-xs text-gray-400 mt-1.5">
                Paste the channel ID or the full channel link — the /tv page embeds its live stream.
              </p>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1.5">Twitch channel name or link</label>
              <input
                value={form.twitch_channel}
                onChange={(e) => setForm({ ...form, twitch_channel: e.target.value })}
                placeholder="yourchannel  or  https://www.twitch.tv/yourchannel"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5"
              />
              <p className="text-xs text-gray-400 mt-1.5">
                Paste the Twitch channel name or the full channel link — the /tv page embeds the Twitch player.
              </p>
            </div>
          )}
        </div>

        {/* General */}
        <div className="bg-white rounded-2xl shadow-sm p-7">
          <h3 className="font-bold text-coast-navy mb-4">General</h3>
          <label className="block text-sm font-semibold text-gray-600 mb-1.5">Site Tagline</label>
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
