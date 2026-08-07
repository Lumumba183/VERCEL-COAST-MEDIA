'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Plus, Trash2, Shield } from 'lucide-react';

interface User {
  id: string;
  email: string;
  full_name: string;
  role: string;
  allowed_areas: string[];
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ email: '', full_name: '', role: 'editor' as const, allowed_areas: [] as string[] });

  useEffect(() => { fetchUsers(); }, []);

  async function fetchUsers() {
    const res = await fetch('/api/users');
    const data = await res.json();
    setUsers(data);
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await fetch('/api/users', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
    setShowForm(false);
    setFormData({ email: '', full_name: '', role: 'editor', allowed_areas: [] });
    fetchUsers();
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this user?')) return;
    await fetch(`/api/users/${id}`, { method: 'DELETE' });
    fetchUsers();
  }

  const areas = ['articles', 'schedule', 'reports', 'users', 'brief', 'settings'];

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-[28px] font-bold text-[#0a1628]">Users</h1>
        <button onClick={() => setShowForm(!showForm)} className="inline-flex items-center gap-2 px-4 py-2 bg-[#e63946] text-white rounded-lg text-sm font-semibold hover:bg-[#c1121f] transition-all">
          <Plus size={16} /> {showForm ? 'Cancel' : 'Add User'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="form-group mb-0">
              <label>Email *</label>
              <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3 border-2 border-[#e2e8f0] rounded-lg text-sm outline-none focus:border-[#0066cc]" />
            </div>
            <div className="form-group mb-0">
              <label>Full Name *</label>
              <input type="text" required value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} className="w-full px-4 py-3 border-2 border-[#e2e8f0] rounded-lg text-sm outline-none focus:border-[#0066cc]" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="form-group mb-0">
              <label>Role</label>
              <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value as 'editor' | 'admin' | 'contributor'})} className="w-full px-4 py-3 border-2 border-[#e2e8f0] rounded-lg text-sm outline-none focus:border-[#0066cc]">
                <option value="admin">Admin</option>
                <option value="editor">Editor</option>
                <option value="contributor">Contributor</option>
              </select>
            </div>
          </div>
          <div className="mb-4">
            <label className="block font-semibold text-sm mb-2 text-[#0a1628]">Allowed Areas</label>
            <div className="flex flex-wrap gap-3">
              {areas.map(area => (
                <label key={area} className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={formData.allowed_areas.includes(area)} onChange={e => {
                    if (e.target.checked) setFormData({...formData, allowed_areas: [...formData.allowed_areas, area]});
                    else setFormData({...formData, allowed_areas: formData.allowed_areas.filter(a => a !== area)});
                  }} className="w-4 h-4" />
                  {area.charAt(0).toUpperCase() + area.slice(1)}
                </label>
              ))}
            </div>
          </div>
          <button type="submit" className="px-6 py-2.5 bg-[#e63946] text-white rounded-lg font-semibold text-sm hover:bg-[#c1121f] transition-all">Add User</button>
        </form>
      )}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#f8f9fa]">
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#0a1628] uppercase tracking-wider">User</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#0a1628] uppercase tracking-wider">Role</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#0a1628] uppercase tracking-wider">Areas</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#0a1628] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} className="px-4 py-8 text-center text-[#718096]">Loading...</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={4} className="px-4 py-8 text-center text-[#718096]">No users found</td></tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="border-b border-[#e2e8f0] last:border-0">
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-[#0a1628]">{user.full_name || 'Unnamed'}</p>
                        <p className="text-xs text-[#718096]">{user.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-bold uppercase px-2 py-1 rounded flex items-center gap-1 w-fit ${user.role === 'admin' ? 'bg-red-100 text-red-700' : user.role === 'editor' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                        <Shield size={12} /> {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {user.allowed_areas?.map(area => (
                          <span key={area} className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-[#f8f9fa] text-[#718096]">{area}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleDelete(user.id)} className="text-[#e63946] hover:text-red-700 transition-colors"><Trash2 size={16} /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
