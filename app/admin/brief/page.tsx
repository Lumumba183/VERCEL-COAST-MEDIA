'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Plus, Trash2, GripVertical } from 'lucide-react';

interface BriefItem {
  id: string;
  content: string;
  order_index: number;
  created_at: string;
}

export default function AdminBriefPage() {
  const [items, setItems] = useState<BriefItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [newContent, setNewContent] = useState('');

  useEffect(() => { fetchItems(); }, []);

  async function fetchItems() {
    const res = await fetch('/api/brief');
    const data = await res.json();
    setItems(data);
    setLoading(false);
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!newContent.trim()) return;
    await fetch('/api/brief', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ content: newContent }) });
    setNewContent('');
    fetchItems();
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this item?')) return;
    await fetch(`/api/brief/${id}`, { method: 'DELETE' });
    fetchItems();
  }

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-[28px] font-bold text-[#0a1628]">Brief Slider</h1>
      </div>

      <form onSubmit={handleAdd} className="bg-white rounded-xl p-6 shadow-sm mb-8">
        <h3 className="text-lg font-bold text-[#0a1628] mb-4">Add Breaking News Item</h3>
        <div className="flex gap-3">
          <input
            type="text"
            value={newContent}
            onChange={e => setNewContent(e.target.value)}
            placeholder="Enter breaking news headline..."
            className="flex-1 px-4 py-3 border-2 border-[#e2e8f0] rounded-lg text-sm outline-none focus:border-[#0066cc]"
          />
          <button type="submit" className="inline-flex items-center gap-2 px-6 py-3 bg-[#e63946] text-white rounded-lg text-sm font-semibold hover:bg-[#c1121f] transition-all">
            <Plus size={16} /> Add
          </button>
        </div>
      </form>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-[#e2e8f0]">
          <h3 className="font-bold text-[#0a1628]">Current Items ({items.length})</h3>
        </div>
        <div className="divide-y divide-[#e2e8f0]">
          {loading ? (
            <div className="px-4 py-8 text-center text-[#718096]">Loading...</div>
          ) : items.length === 0 ? (
            <div className="px-4 py-8 text-center text-[#718096]">No brief items found</div>
          ) : (
            items.map((item, index) => (
              <div key={item.id} className="flex items-center gap-4 px-4 py-4 hover:bg-[#f8f9fa] transition-colors">
                <GripVertical size={16} className="text-[#718096] shrink-0" />
                <span className="text-xs font-bold text-[#718096] w-6">{index + 1}</span>
                <p className="flex-1 text-sm text-[#0a1628]">{item.content}</p>
                <button onClick={() => handleDelete(item.id)} className="text-[#e63946] hover:text-red-700 transition-colors shrink-0"><Trash2 size={16} /></button>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
