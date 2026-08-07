'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Plus, Trash2 } from 'lucide-react';

interface ScheduleItem {
  id: string;
  show_name: string;
  host: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
}

export default function AdminSchedulePage() {
  const [items, setItems] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ show_name: '', host: '', day_of_week: 'Monday', start_time: '', end_time: '', description: '' });

  useEffect(() => { fetchItems(); }, []);

  async function fetchItems() {
    const res = await fetch('/api/schedule');
    const data = await res.json();
    setItems(data);
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await fetch('/api/schedule', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
    setShowForm(false);
    setFormData({ show_name: '', host: '', day_of_week: 'Monday', start_time: '', end_time: '', description: '' });
    fetchItems();
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this schedule item?')) return;
    await fetch(`/api/schedule/${id}`, { method: 'DELETE' });
    fetchItems();
  }

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-[28px] font-bold text-[#0a1628]">Programme Schedule</h1>
        <button onClick={() => setShowForm(!showForm)} className="inline-flex items-center gap-2 px-4 py-2 bg-[#e63946] text-white rounded-lg text-sm font-semibold hover:bg-[#c1121f] transition-all">
          <Plus size={16} /> {showForm ? 'Cancel' : 'Add Slot'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="form-group mb-0">
              <label>Show Name *</label>
              <input type="text" required value={formData.show_name} onChange={e => setFormData({...formData, show_name: e.target.value})} className="w-full px-4 py-3 border-2 border-[#e2e8f0] rounded-lg text-sm outline-none focus:border-[#0066cc]" />
            </div>
            <div className="form-group mb-0">
              <label>Host *</label>
              <input type="text" required value={formData.host} onChange={e => setFormData({...formData, host: e.target.value})} className="w-full px-4 py-3 border-2 border-[#e2e8f0] rounded-lg text-sm outline-none focus:border-[#0066cc]" />
            </div>
            <div className="form-group mb-0">
              <label>Day *</label>
              <select value={formData.day_of_week} onChange={e => setFormData({...formData, day_of_week: e.target.value})} className="w-full px-4 py-3 border-2 border-[#e2e8f0] rounded-lg text-sm outline-none focus:border-[#0066cc]">
                {['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'].map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="form-group mb-0">
              <label>Start Time *</label>
              <input type="time" required value={formData.start_time} onChange={e => setFormData({...formData, start_time: e.target.value})} className="w-full px-4 py-3 border-2 border-[#e2e8f0] rounded-lg text-sm outline-none focus:border-[#0066cc]" />
            </div>
            <div className="form-group mb-0">
              <label>End Time *</label>
              <input type="time" required value={formData.end_time} onChange={e => setFormData({...formData, end_time: e.target.value})} className="w-full px-4 py-3 border-2 border-[#e2e8f0] rounded-lg text-sm outline-none focus:border-[#0066cc]" />
            </div>
          </div>
          <button type="submit" className="px-6 py-2.5 bg-[#e63946] text-white rounded-lg font-semibold text-sm hover:bg-[#c1121f] transition-all">Add Schedule</button>
        </form>
      )}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#f8f9fa]">
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#0a1628] uppercase tracking-wider">Time</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#0a1628] uppercase tracking-wider">Show</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#0a1628] uppercase tracking-wider">Host</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#0a1628] uppercase tracking-wider">Day</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#0a1628] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-[#718096]">Loading...</td></tr>
              ) : items.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-[#718096]">No schedule items found</td></tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className="border-b border-[#e2e8f0] last:border-0">
                    <td className="px-4 py-3 text-sm font-medium">{item.start_time} - {item.end_time}</td>
                    <td className="px-4 py-3 text-sm font-medium text-[#0a1628]">{item.show_name}</td>
                    <td className="px-4 py-3 text-sm text-[#718096]">{item.host}</td>
                    <td className="px-4 py-3 text-sm text-[#718096]">{item.day_of_week}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleDelete(item.id)} className="text-[#e63946] hover:text-red-700 transition-colors"><Trash2 size={16} /></button>
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
