'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';

interface Article {
  id: string;
  title: string;
  slug: string;
  category: string;
  author: string;
  status: string;
  views: number;
  created_at: string;
}

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', slug: '', content: '', excerpt: '', category: 'news', author: 'Coast Editorial', featured: false, status: 'draft' });

  useEffect(() => {
    fetchArticles();
  }, []);

  async function fetchArticles() {
    const res = await fetch('/api/articles');
    const data = await res.json();
    setArticles(data);
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await fetch('/api/articles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    setShowForm(false);
    setFormData({ title: '', slug: '', content: '', excerpt: '', category: 'news', author: 'Coast Editorial', featured: false, status: 'draft' });
    fetchArticles();
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this article?')) return;
    await fetch(`/api/articles/${id}`, { method: 'DELETE' });
    fetchArticles();
  }

  const categoryColors: Record<string, string> = {
    news: 'bg-[#e63946]', business: 'bg-[#2563eb]', sports: 'bg-[#059669]',
    education: 'bg-[#7c3aed]', lifestyle: 'bg-[#db2777]', health: 'bg-[#0891b2]',
    opinion: 'bg-[#ea580c]', international: 'bg-[#4f46e5]',
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-[28px] font-bold text-[#0a1628]">Articles</h1>
        <button onClick={() => setShowForm(!showForm)} className="inline-flex items-center gap-2 px-4 py-2 bg-[#e63946] text-white rounded-lg text-sm font-semibold hover:bg-[#c1121f] transition-all">
          <Plus size={16} /> {showForm ? 'Cancel' : 'New Article'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm mb-8">
          <h3 className="text-lg font-bold text-[#0a1628] mb-4">Create Article</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="form-group mb-0">
              <label>Title *</label>
              <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})} className="w-full px-4 py-3 border-2 border-[#e2e8f0] rounded-lg text-sm outline-none focus:border-[#0066cc]" placeholder="Article headline..." />
            </div>
            <div className="form-group mb-0">
              <label>Category *</label>
              <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-3 border-2 border-[#e2e8f0] rounded-lg text-sm outline-none focus:border-[#0066cc]">
                {['news', 'business', 'sports', 'education', 'lifestyle', 'health', 'opinion', 'international'].map(c => (
                  <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Excerpt</label>
            <input type="text" value={formData.excerpt} onChange={e => setFormData({...formData, excerpt: e.target.value})} className="w-full px-4 py-3 border-2 border-[#e2e8f0] rounded-lg text-sm outline-none focus:border-[#0066cc]" placeholder="Short description..." />
          </div>
          <div className="form-group">
            <label>Content (HTML) *</label>
            <textarea required value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} rows={8} className="w-full px-4 py-3 border-2 border-[#e2e8f0] rounded-lg text-sm outline-none focus:border-[#0066cc] resize-y font-mono" placeholder="<p>Write article content here...</p>" />
          </div>
          <div className="flex items-center gap-4 mb-4">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={formData.featured} onChange={e => setFormData({...formData, featured: e.target.checked})} className="w-4 h-4" />
              Featured
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="px-2 py-1 border border-[#e2e8f0] rounded text-sm">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="review">Review</option>
              </select>
            </label>
          </div>
          <button type="submit" className="px-6 py-2.5 bg-[#e63946] text-white rounded-lg font-semibold text-sm hover:bg-[#c1121f] transition-all">
            Publish Article
          </button>
        </form>
      )}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-[#e2e8f0] flex items-center gap-3">
          <Search size={16} className="text-[#718096]" />
          <input type="text" placeholder="Search articles..." className="flex-1 text-sm outline-none bg-transparent" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#f8f9fa]">
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#0a1628] uppercase tracking-wider">Title</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#0a1628] uppercase tracking-wider">Category</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#0a1628] uppercase tracking-wider">Author</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#0a1628] uppercase tracking-wider">Views</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#0a1628] uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#0a1628] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-[#718096]">Loading...</td></tr>
              ) : articles.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-[#718096]">No articles found</td></tr>
              ) : (
                articles.map((article) => (
                  <tr key={article.id} className="border-b border-[#e2e8f0] last:border-0">
                    <td className="px-4 py-3 text-sm font-medium text-[#0a1628] max-w-[300px] truncate">{article.title}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-bold uppercase px-2 py-1 rounded text-white ${categoryColors[article.category] || 'bg-gray-500'}`}>
                        {article.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-[#718096]">{article.author}</td>
                    <td className="px-4 py-3 text-sm text-[#718096]">{article.views?.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-bold uppercase px-2 py-1 rounded ${article.status === 'published' ? 'bg-green-100 text-green-700' : article.status === 'draft' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                        {article.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button className="text-[#0066cc] hover:text-[#e63946] transition-colors"><Pencil size={16} /></button>
                        <button onClick={() => handleDelete(article.id)} className="text-[#e63946] hover:text-red-700 transition-colors"><Trash2 size={16} /></button>
                      </div>
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
