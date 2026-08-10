'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash2, X, Loader2, ShieldCheck } from 'lucide-react';
import { ADMIN_AREAS, type AppUser } from '@/types';

const EMPTY = { email: '', full_name: '', role: 'editor', allowed_areas: [] as string[] };

export default function UsersPage() {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

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
    const res = await fetch('/api/users', {
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

  async function setRole(u: AppUser, role: string) {
    await fetch('/api/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: u.id, role }),
    });
    load();
  }

  async function remove(u: AppUser) {
    if (!confirm(`Remove ${u.email} from staff?`)) return;
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
        <button onClick={() => { setShowForm(true); setError(''); }} className="bg-coast-red text-white font-bold px-4 py-2.5 rounded-lg flex items-center gap-2 text-sm hover:brightness-110">
          <Plus size={16} /> Add Staff
        </button>
      </div>

      {showForm && (
        <form onSubmit={save} className="bg-white rounded-2xl shadow-sm p-6 mb-6 space-y-4 border-2 border-coast-blue/20">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-coast-navy">New Staff Member</h3>
            <button type="button" onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
          </div>
          <p className="text-xs text-gray-400">They sign in via Clerk with this email; the role binds automatically on first login.</p>
          <div className="grid sm:grid-cols-3 gap-4">
            <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email *" className="border border-gray-200 rounded-lg px-4 py-2.5" />
            <input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} placeholder="Full name" className="border border-gray-200 rounded-lg px-4 py-2.5" />
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="border border-gray-200 rounded-lg px-4 py-2.5">
              <option value="editor">Editor</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-600 mb-2">Allowed areas</p>
            <div className="flex flex-wrap gap-3">
              {ADMIN_AREAS.filter((a) => a !== 'all').map((area) => (
                <label key={area} className="flex items-center gap-2 text-sm text-gray-600 capitalize">
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
          <div className="flex items-center gap-4">
            {error && <span className="text-sm text-coast-red">{error}</span>}
            <button disabled={saving} className="ml-auto bg-coast-navy text-white font-bold px-6 py-2.5 rounded-lg disabled:opacity-60 flex items-center gap-2">
              {saving && <Loader2 size={15} className="animate-spin" />} Add Staff Member
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {users.length === 0 ? (
          <p className="p-10 text-center text-gray-500">No staff users yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-400 uppercase border-b border-gray-100">
                <th className="px-5 py-3">Name / Email</th>
                <th className="px-5 py-3">Role</th>
                <th className="px-5 py-3 hidden md:table-cell">Areas</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-5 py-3">
                    <p className="font-semibold text-coast-navy">{u.full_name || '—'}</p>
                    <p className="text-xs text-gray-400">{u.email}</p>
                  </td>
                  <td className="px-5 py-3">
                    <select
                      value={u.role}
                      onChange={(e) => setRole(u, e.target.value)}
                      className="border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs font-bold capitalize"
                    >
                      <option value="admin">admin</option>
                      <option value="editor">editor</option>
                      <option value="user">user</option>
                    </select>
                  </td>
                  <td className="px-5 py-3 hidden md:table-cell text-xs text-gray-500">
                    {u.allowed_areas?.length ? u.allowed_areas.join(', ') : '—'}
                  </td>
                  <td className="px-5 py-3 text-right">
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
