'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Save } from 'lucide-react';

interface Settings {
  id: string;
  stream_url: string;
  youtube_channel_id: string;
  site_name: string;
  tagline: string;
  contact_email: string;
  phone: string;
  address: string;
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchSettings(); }, []);

  async function fetchSettings() {
    const res = await fetch('/api/settings');
    const data = await res.json();
    setSettings(data);
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    await fetch('/api/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(settings) });
    setSaving(false);
  }

  if (loading) return <AdminLayout><div className="text-center py-20 text-[#718096]">Loading...</div></AdminLayout>;
  if (!settings) return <AdminLayout><div className="text-center py-20 text-[#718096]">No settings found</div></AdminLayout>;

  return (
    <AdminLayout>
      <h1 className="text-[28px] font-bold text-[#0a1628] mb-8">Site Settings</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl p-8 shadow-sm max-w-[800px]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="form-group mb-0">
            <label>Site Name</label>
            <input type="text" value={settings.site_name} onChange={e => setSettings({...settings, site_name: e.target.value})} className="w-full px-4 py-3 border-2 border-[#e2e8f0] rounded-lg text-sm outline-none focus:border-[#0066cc]" />
          </div>
          <div className="form-group mb-0">
            <label>Tagline</label>
            <input type="text" value={settings.tagline} onChange={e => setSettings({...settings, tagline: e.target.value})} className="w-full px-4 py-3 border-2 border-[#e2e8f0] rounded-lg text-sm outline-none focus:border-[#0066cc]" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="form-group mb-0">
            <label>Contact Email</label>
            <input type="email" value={settings.contact_email} onChange={e => setSettings({...settings, contact_email: e.target.value})} className="w-full px-4 py-3 border-2 border-[#e2e8f0] rounded-lg text-sm outline-none focus:border-[#0066cc]" />
          </div>
          <div className="form-group mb-0">
            <label>Phone</label>
            <input type="tel" value={settings.phone} onChange={e => setSettings({...settings, phone: e.target.value})} className="w-full px-4 py-3 border-2 border-[#e2e8f0] rounded-lg text-sm outline-none focus:border-[#0066cc]" />
          </div>
        </div>
        <div className="form-group mb-4">
          <label>Address</label>
          <input type="text" value={settings.address} onChange={e => setSettings({...settings, address: e.target.value})} className="w-full px-4 py-3 border-2 border-[#e2e8f0] rounded-lg text-sm outline-none focus:border-[#0066cc]" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="form-group mb-0">
            <label>Stream URL</label>
            <input type="url" value={settings.stream_url} onChange={e => setSettings({...settings, stream_url: e.target.value})} className="w-full px-4 py-3 border-2 border-[#e2e8f0] rounded-lg text-sm outline-none focus:border-[#0066cc]" />
          </div>
          <div className="form-group mb-0">
            <label>YouTube Channel ID</label>
            <input type="text" value={settings.youtube_channel_id} onChange={e => setSettings({...settings, youtube_channel_id: e.target.value})} className="w-full px-4 py-3 border-2 border-[#e2e8f0] rounded-lg text-sm outline-none focus:border-[#0066cc]" placeholder="UC..." />
          </div>
        </div>
        <button type="submit" disabled={saving} className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#e63946] text-white rounded-lg font-semibold text-sm hover:bg-[#c1121f] transition-all disabled:opacity-50">
          <Save size={16} /> {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </AdminLayout>
  );
}
