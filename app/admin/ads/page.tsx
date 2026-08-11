'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Megaphone, Plus, Loader2, Trash2, Power, CalendarDays, Image as ImageIcon,
  Link2, Upload, X, Building2, Clock3, CheckCircle2, AlertTriangle, Ban,
} from 'lucide-react';
import { getAnonClient } from '@/lib/supabase';
import type { Advert, AdPlacement } from '@/types';

const PLACEMENTS: { id: AdPlacement; label: string; hint: string }[] = [
  { id: 'leaderboard', label: 'Homepage Leaderboard', hint: 'Wide banner below the hero' },
  { id: 'sidebar', label: 'Homepage Sidebar', hint: 'Square slot beside top stories' },
  { id: 'article-bottom', label: 'Article Page Bottom', hint: 'Banner at the end of every story' },
];

const DAY_PRESETS = [7, 14, 30, 60, 90];

type AdStatus = 'live' | 'scheduled' | 'expired' | 'paused';

function adStatus(ad: Advert): AdStatus {
  const today = new Date().toISOString().slice(0, 10);
  if (!ad.active) return 'paused';
  if (ad.start_date > today) return 'scheduled';
  if (ad.end_date < today) return 'expired';
  return 'live';
}

const STATUS_STYLE: Record<AdStatus, { label: string; cls: string; icon: typeof CheckCircle2 }> = {
  live: { label: 'Live', cls: 'bg-emerald-100 text-emerald-700', icon: CheckCircle2 },
  scheduled: { label: 'Scheduled', cls: 'bg-blue-100 text-blue-700', icon: Clock3 },
  expired: { label: 'Expired', cls: 'bg-gray-100 text-gray-500', icon: Ban },
  paused: { label: 'Paused', cls: 'bg-amber-100 text-amber-700', icon: AlertTriangle },
};

function daysLeft(ad: Advert): string {
  const status = adStatus(ad);
  const today = new Date().toISOString().slice(0, 10);
  if (status === 'scheduled') {
    const d = Math.ceil((new Date(ad.start_date).getTime() - new Date(today).getTime()) / 86400000);
    return `starts in ${d}d`;
  }
  if (status !== 'live') return '—';
  const d = Math.ceil((new Date(ad.end_date).getTime() - new Date(today).getTime()) / 86400000);
  return `${d} day${d === 1 ? '' : 's'} left`;
}

export default function AdminAdsPage() {
  const [ads, setAds] = useState<Advert[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);

  // form state
  const [title, setTitle] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientContact, setClientContact] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [placement, setPlacement] = useState<AdPlacement>('sidebar');
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [days, setDays] = useState(30);
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  const load = () => {
    setLoading(true);
    fetch('/api/adverts?all=1')
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => Array.isArray(d) && setAds(d))
      .catch(() => setError('Could not load adverts.'))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const endDate = useMemo(() => {
    const d = new Date(startDate);
    d.setDate(d.getDate() + days);
    return d.toISOString().slice(0, 10);
  }, [startDate, days]);

  async function uploadImage(file: File) {
    setUploading(true);
    setError('');
    try {
      const supabase = getAnonClient();
      const ext = file.name.split('.').pop() || 'jpg';
      const path = `ads/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error: upErr } = await supabase.storage.from('media').upload(path, file, { cacheControl: '3600' });
      if (upErr) throw new Error(upErr.message);
      const { data } = supabase.storage.from('media').getPublicUrl(path);
      setImageUrl(data.publicUrl);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  async function createAd(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch('/api/adverts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title, client_name: clientName, client_contact: clientContact,
          image_url: imageUrl, link_url: linkUrl || null,
          placement, start_date: startDate, days,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Save failed');
      setSuccess(`Advert created — it will run from ${startDate} to ${endDate} (${days} days), then automatically stop showing.`);
      setTitle(''); setClientName(''); setClientContact(''); setLinkUrl(''); setImageUrl('');
      setDays(30); setStartDate(new Date().toISOString().slice(0, 10));
      setShowForm(false);
      load();
    } catch (e2) {
      setError(e2 instanceof Error ? e2.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(ad: Advert) {
    await fetch('/api/adverts', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: ad.id, active: !ad.active }),
    });
    load();
  }

  async function extend(ad: Advert, extra: number) {
    const base = ad.end_date > new Date().toISOString().slice(0, 10) ? ad.end_date : new Date().toISOString().slice(0, 10);
    const d = new Date(base);
    d.setDate(d.getDate() + extra);
    await fetch('/api/adverts', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: ad.id, end_date: d.toISOString().slice(0, 10), active: true }),
    });
    load();
  }

  async function remove(id: string) {
    if (!confirm('Delete this advert permanently?')) return;
    await fetch(`/api/adverts?id=${id}`, { method: 'DELETE' });
    load();
  }

  const liveCount = ads.filter((a) => adStatus(a) === 'live').length;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-extrabold text-coast-navy text-xl flex items-center gap-2">
            <Megaphone size={20} className="text-coast-red" /> Adverts
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {liveCount} live · {ads.length} total. Adverts automatically stop showing the day after their end date.
          </p>
        </div>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="flex items-center gap-2 bg-coast-red text-white font-bold text-sm px-5 py-2.5 rounded-xl hover:brightness-110 transition"
        >
          {showForm ? <X size={16} /> : <Plus size={16} />} {showForm ? 'Close' : 'New Advert'}
        </button>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-4">{error}</div>}
      {success && <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-xl px-4 py-3 mb-4 flex items-start gap-2"><CheckCircle2 size={16} className="mt-0.5 shrink-0" />{success}</div>}

      {/* Create form */}
      {showForm && (
        <form onSubmit={createAd} className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h3 className="font-bold text-coast-navy mb-5">New customer advert</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Advert title *</span>
              <input required value={title} onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Summer Sale — 50% Off"
                className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-coast-blue/40" />
            </label>
            <label className="block">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Client / company *</span>
              <div className="mt-1 flex items-center gap-2 border border-gray-200 rounded-lg px-3 focus-within:ring-2 focus-within:ring-coast-blue/40">
                <Building2 size={15} className="text-gray-400 shrink-0" />
                <input required value={clientName} onChange={(e) => setClientName(e.target.value)}
                  placeholder="e.g. Mombasa Beach Hotel"
                  className="w-full py-2.5 text-sm focus:outline-none" />
              </div>
            </label>
            <label className="block">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Client contact (email / phone)</span>
              <input value={clientContact} onChange={(e) => setClientContact(e.target.value)}
                placeholder="For your records — not shown publicly"
                className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-coast-blue/40" />
            </label>
            <label className="block">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Click-through link</span>
              <div className="mt-1 flex items-center gap-2 border border-gray-200 rounded-lg px-3 focus-within:ring-2 focus-within:ring-coast-blue/40">
                <Link2 size={15} className="text-gray-400 shrink-0" />
                <input value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} type="url"
                  placeholder="https://… where visitors go when they click"
                  className="w-full py-2.5 text-sm focus:outline-none" />
              </div>
            </label>

            <div className="md:col-span-2">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Placement *</span>
              <div className="grid sm:grid-cols-3 gap-3 mt-2">
                {PLACEMENTS.map((p) => (
                  <button type="button" key={p.id} onClick={() => setPlacement(p.id)}
                    className={`text-left rounded-xl border-2 p-3 transition ${placement === p.id ? 'border-coast-blue bg-coast-blue/5' : 'border-gray-100 hover:border-gray-200'}`}>
                    <p className="font-bold text-sm text-coast-navy">{p.label}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{p.hint}</p>
                  </button>
                ))}
              </div>
            </div>

            <label className="block">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Start date</span>
              <div className="mt-1 flex items-center gap-2 border border-gray-200 rounded-lg px-3">
                <CalendarDays size={15} className="text-gray-400 shrink-0" />
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
                  className="w-full py-2.5 text-sm focus:outline-none" />
              </div>
            </label>
            <div>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Run duration</span>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                {DAY_PRESETS.map((d) => (
                  <button type="button" key={d} onClick={() => setDays(d)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${days === d ? 'bg-coast-navy text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                    {d}d
                  </button>
                ))}
                <input type="number" min={1} max={365} value={days} onChange={(e) => setDays(Math.min(Math.max(parseInt(e.target.value, 10) || 1, 1), 365))}
                  className="w-20 border border-gray-200 rounded-lg px-2 py-1.5 text-xs text-center focus:outline-none focus:ring-2 focus:ring-coast-blue/40" />
                <span className="text-xs text-gray-400">days → ends <strong className="text-coast-navy">{endDate}</strong></span>
              </div>
            </div>

            {/* Image */}
            <div className="md:col-span-2">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Advert artwork *</span>
              {imageUrl ? (
                <div className="mt-2 relative inline-block">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imageUrl} alt="Advert preview" className="max-h-44 rounded-xl border border-gray-200" />
                  <button type="button" onClick={() => setImageUrl('')}
                    className="absolute -top-2 -right-2 bg-coast-red text-white rounded-full p-1 shadow hover:brightness-110">
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <label className={`flex items-center gap-2 cursor-pointer bg-coast-navy text-white text-sm font-bold px-4 py-2.5 rounded-xl hover:brightness-110 transition ${uploading ? 'opacity-60 pointer-events-none' : ''}`}>
                    {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                    {uploading ? 'Uploading…' : 'Upload image'}
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0])} />
                  </label>
                  <span className="text-xs text-gray-400">or</span>
                  <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 flex-1 min-w-[220px]">
                    <ImageIcon size={15} className="text-gray-400 shrink-0" />
                    <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="Paste an image URL"
                      className="w-full py-2.5 text-sm focus:outline-none" />
                  </div>
                </div>
              )}
              <p className="text-xs text-gray-400 mt-2">Recommended: 970×120 for leaderboard, 600×500 for sidebar, 728×90 for article bottom. JPG/PNG/WebP.</p>
            </div>
          </div>

          <button disabled={saving || uploading || !imageUrl}
            className="mt-6 flex items-center gap-2 bg-coast-red text-white font-bold px-6 py-3 rounded-xl hover:brightness-110 transition disabled:opacity-50">
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
            {saving ? 'Saving…' : 'Publish Advert'}
          </button>
        </form>
      )}

      {/* Adverts list */}
      {loading ? (
        <div className="bg-white rounded-2xl shadow-sm p-10 text-center text-gray-400 text-sm">
          <Loader2 size={22} className="animate-spin mx-auto mb-2" /> Loading adverts…
        </div>
      ) : ads.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm p-10 text-center">
          <Megaphone size={40} className="mx-auto text-gray-200 mb-3" />
          <p className="font-bold text-coast-navy">No adverts yet</p>
          <p className="text-sm text-gray-400 mt-1">Click “New Advert” to add your first customer advert.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {ads.map((ad) => {
            const st = adStatus(ad);
            const S = STATUS_STYLE[st];
            return (
              <div key={ad.id} className="bg-white rounded-2xl shadow-sm p-5 flex flex-col md:flex-row gap-5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={ad.image_url} alt={ad.title} className="w-full md:w-44 h-28 object-cover rounded-xl border border-gray-100 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-extrabold text-coast-navy leading-snug">{ad.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {ad.client_name}{ad.client_contact ? ` · ${ad.client_contact}` : ''} · {PLACEMENTS.find((p) => p.id === ad.placement)?.label}
                      </p>
                    </div>
                    <span className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full shrink-0 ${S.cls}`}>
                      <S.icon size={12} /> {S.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                    <span className="flex items-center gap-1"><CalendarDays size={12} /> {ad.start_date} → {ad.end_date}</span>
                    <span className="flex items-center gap-1 font-semibold text-coast-navy"><Clock3 size={12} /> {daysLeft(ad)}</span>
                    {ad.link_url && <a href={ad.link_url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-coast-blue hover:underline"><Link2 size={12} /> link</a>}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mt-3">
                    <button onClick={() => toggleActive(ad)}
                      className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition ${ad.active ? 'bg-amber-50 text-amber-700 hover:bg-amber-100' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'}`}>
                      <Power size={12} /> {ad.active ? 'Pause' : 'Activate'}
                    </button>
                    <button onClick={() => extend(ad, 7)} className="text-xs font-bold px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200">+7 days</button>
                    <button onClick={() => extend(ad, 30)} className="text-xs font-bold px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200">+30 days</button>
                    <button onClick={() => remove(ad.id)}
                      className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 ml-auto">
                      <Trash2 size={12} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
