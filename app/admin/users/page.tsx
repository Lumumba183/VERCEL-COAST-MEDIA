'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash2, X, Loader2, ShieldCheck, Copy, CheckCircle2 } from 'lucide-react';
import { ADMIN_AREAS, type AppUser } from '@/types';

const ROLES = [
  { id: 'admin', label: 'Admin', desc: 'Full access to everything' },
  { id: 'editor', label: 'Editor', desc: 'Manage content areas ticked below' },
  { id: 'user', label: 'User', desc: 'Basic access (no admin areas)' },
] as const;

const EMPTY = { email: '', full_name: '', role: 'editor', allowed_areas: ['articles'] as string[] };

export default function UsersPage() {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [created, setCreated] = useState<{ email: string; temp_password: string } | null>(null);
  const [copied, setCopied] = useState(false);

  async function load() {
    setLoading(true);
    const res = await fetch('/api/users');
    if (res.status === 401) setForbidden(true);
    else if (res.ok) setUsers(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    setCreated(null);
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setSaving(false);
    const d = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(d.error || 'Save failed');
      return;
    }
    // Show generated credentials once — admin copies and shares securely
    setCreated({ email: d.email, temp_password: d.temp_password });
    setForm(EMPTY);
    setShowForm(false);
    load();
  }

  async function update(u: AppUser, fields: Partial<AppUser>) {
    await fetch('/api/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: u.id, ...fields }),
    });
    load();
  }

  function toggleArea(u: AppUser, area: string) {
    const current = u.allowed_areas || [];
    const next = current.includes(area) ? current.filter((a) => a !== area) : [...current, area];
    update(u, { allowed_areas: next });
  }

  async function remove(u: AppUser) {
    if (!confirm(`Remove ${u.email}? This deletes their Clerk login AND staff role.`)) return;
    const res = await fetch(`/api/users?id=${encodeURIComponent(u.id)}`, { method: 'DELETE' });
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      alert(d.error || 'Delete failed');
    }
    load();
  }

  if (loading) return <div className="bg-white rounded-2xl p-10 text-center text-gray-400"><Loader2 className="animate-spin inline mr-2" />Loading users…</div>;

  if (forbidden) {
    return (
      <div className="bg-white rounded-2xl p-10 text-center">
        <ShieldCheck size={40} className="mx-auto text-coast-red mb-3" />
        <p className="font-bold text-coast-navy">Admins only</p>
        <p className="text-sm text-gray-500 mt-1">User management requires the admin role.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-extrabold text-coast-navy text-xl">Staff Users ({users.length})</h2>
        <button onClick={() => { setShowForm(true); setError(''); setCreated(null); }} className="bg-coast-red text-white font-bold px-4 py-2.5 rounded-lg flex items-center gap-2 text-sm hover:brightness-110">
          <Plus size={16} /> Add Staff
        </button>
      </div>

      {created && (
        <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-5 mb-6">
          <p className="font-bold text-emerald-800 flex items-center gap-2 mb-2">
            <CheckCircle2 size={18} /> Account created for {created.email}
          </p>
          <p className="text-sm text-emerald-700 mb-3">
            Share these login credentials securely — the password is shown only once. The user should change it after first login.
          </p>
          <div className="flex items-center gap-3 bg-white rounded-lg px-4 py-2.5 font-mono text-sm">
            <span className="flex-1">{created.temp_password}</span>
            <button
              onClick={() => { navigator.clipboard.writeText(created.temp_password); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
              className="text-coast-blue flex items-center gap-1 text-xs font-bold"
            >
              <Copy size={14} /> {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>
      )}

      {showForm && (
        <form onSubmit={save} className="bg-white rounded-2xl shadow-sm p-6 mb-6 space-y-5 border-2 border-coast-blue/20">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-coast-navy">New Staff Member</h3>
            <button type="button" onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
          </div>
          <p className="text-xs text-gray-400">
            A Clerk login is created automatically with a temporary password — no sign-up needed by the staff member.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email *" className="border border-gray-200 rounded-lg px-4 py-2.5" />
            <input required value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} placeholder="Full name *" className="border border-gray-200 rounded-lg px-4 py-2.5" />
          </div>

          <div>
            <p className="text-sm font-bold text-coast-navy mb-2">Role — tick one</p>
            <div className="grid sm:grid-cols-3 gap-3">
              {ROLES.map((r) => (
                <label
                  key={r.id}
                  className={`flex items-start gap-3 border-2 rounded-xl p-3.5 cursor-pointer transition ${
                    form.role === r.id ? 'border-coast-blue bg-blue-50/50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    checked={form.role === r.id}
                    onChange={() => setForm({ ...form, role: r.id })}
                    className="mt-1"
                  />
                  <span>
                    <span className="block font-bold text-coast-navy text-sm">{r.label}</span>
                    <span className="block text-xs text-gray-400">{r.desc}</span>
                  </span>
                </label>
              ))}
            </div>
          </div>

          {form.role !== 'admin' && (
            <div>
              <p className="text-sm font-bold text-coast-navy mb-2">Allowed areas — tick each area this person can manage</p>
              <div className="flex flex-wrap gap-3">
                {ADMIN_AREAS.filter((a) => a !== 'all').map((area) => (
                  <label
                    key={area}
                    className={`flex items-center gap-2 border-2 rounded-xl px-4 py-2.5 cursor-pointer text-sm font-semibold capitalize transition ${
                      form.allowed_areas.includes(area) ? 'border-coast-blue bg-blue-50/50 text-coast-navy' : 'border-gray-200 text-gray-500 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={form.allowed_areas.includes(area)}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          allowed_areas: e.target.checked
                            ? [...form.allowed_areas, area]
                            : form.allowed_areas.filter((a) => a !== area),
                        })
                      }
                    />
                    {area}
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-4">
            {error && <span className="text-sm text-coast-red">{error}</span>}
            <button disabled={saving} className="ml-auto bg-coast-navy text-white font-bold px-6 py-2.5 rounded-lg disabled:opacity-60 flex items-center gap-2">
              {saving && <Loader2 size={15} className="animate-spin" />} Create Account
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">
        {users.length === 0 ? (
          <p className="p-10 text-center text-gray-500">No staff users yet.</p>
        ) : (
          <table className="w-full text-sm min-w-[720px]">
            <thead>
              <tr className="text-left text-xs text-gray-400 uppercase border-b border-gray-100">
                <th className="px-5 py-3">Name / Email</th>
                <th className="px-5 py-3">Role (tick one)</th>
                <th className="px-5 py-3">Allowed areas (tick to grant)</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50/50 align-top">
                  <td className="px-5 py-4">
                    <p className="font-semibold text-coast-navy">{u.full_name || '—'}</p>
                    <p className="text-xs text-gray-400">{u.email}</p>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-3">
                      {ROLES.map((r) => (
                        <label key={r.id} className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 cursor-pointer">
                          <input
                            type="radio"
                            name={`role-${u.id}`}
                            checked={u.role === r.id}
                            onChange={() => update(u, { role: r.id as AppUser['role'] })}
                          />
                          {r.label}
                        </label>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    {u.role === 'admin' ? (
                      <span className="text-xs text-gray-400 italic">Admin has access to all areas</span>
                    ) : (
                      <div className="flex flex-wrap gap-2.5">
                        {ADMIN_AREAS.filter((a) => a !== 'all').map((area) => (
                          <label key={area} className="flex items-center gap-1.5 text-xs text-gray-600 capitalize cursor-pointer">
                            <input
                              type="checkbox"
                              checked={(u.allowed_areas || []).includes(area)}
                              onChange={() => toggleArea(u, area)}
                            />
                            {area}
                          </label>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button onClick={() => remove(u)} className="p-2 text-coast-red hover:bg-red-50 rounded-lg"><Trash2 size={15} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
