'use client';

import { useEffect, useRef, useState } from 'react';
import { Plus, Pencil, Trash2, Star, X, Loader2, Eye, EyeOff, UploadCloud } from 'lucide-react';
import { ARTICLE_CATEGORIES, type Article } from '@/types';
import { timeAgo } from '@/lib/utils';
import { getAnonClient } from '@/lib/supabase';

const EMPTY = {
  title: '',
  excerpt: '',
  content: '',
  category: 'National News',
  image_url: '',
  author: 'Coast Editorial',
  featured: false,
  published: true,
};

export default function ArticlesTab() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Article | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function uploadImage(file: File) {
    setUploading(true);
    setError('');
    try {
      const supabase = getAnonClient();
      const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const path = `articles/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from('media')
        .upload(path, file, { cacheControl: '31536000', upsert: false });
      if (upErr) throw new Error(`Upload failed: ${upErr.message}. Make sure the "media" storage bucket exists (see supabase/schema.sql).`);
      const { data } = supabase.storage.from('media').getPublicUrl(path);
      setForm((f) => ({ ...f, image_url: data.publicUrl }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Image upload failed');
    } finally {
      setUploading(false);
    }
  }

  async function load() {
    setLoading(true);
    const res = await fetch('/api/articles?all=1');
    if (res.ok) setArticles(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function openNew() {
    setEditing(null);
    setForm(EMPTY);
    setError('');
    setShowForm(true);
  }

  function openEdit(a: Article) {
    setEditing(a);
    setForm({
      title: a.title,
      excerpt: a.excerpt,
      content: a.content,
      category: a.category,
      image_url: a.image_url || '',
      author: a.author,
      featured: a.featured,
      published: a.published,
    });
    setError('');
    setShowForm(true);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    const res = await fetch('/api/articles', {
      method: editing ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editing ? { id: editing.id, ...form } : form),
    });
    setSaving(false);
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      setError(d.error || 'Save failed');
      return;
    }
    setShowForm(false);
    load();
  }

  async function toggleFlag(a: Article, flag: 'featured' | 'published') {
    await fetch('/api/articles', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: a.id, [flag]: !a[flag] }),
    });
    load();
  }

  async function remove(a: Article) {
    if (!confirm(`Delete “${a.title}”? This cannot be undone.`)) return;
    await fetch(`/api/articles?id=${a.id}`, { method: 'DELETE' });
    load();
  }

  if (loading) return <div className="bg-white rounded-2xl p-10 text-center text-gray-400"><Loader2 className="animate-spin inline mr-2" />Loading articles…</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-extrabold text-coast-navy text-xl">Articles ({articles.length})</h2>
        <button onClick={openNew} className="bg-coast-red text-white font-bold px-4 py-2.5 rounded-lg flex items-center gap-2 text-sm hover:brightness-110">
          <Plus size={16} /> New Article
        </button>
      </div>

      {showForm && (
        <form onSubmit={save} className="bg-white rounded-2xl shadow-sm p-6 mb-6 space-y-4 border-2 border-coast-blue/20">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-coast-navy">{editing ? 'Edit Article' : 'New Article'}</h3>
            <button type="button" onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
          </div>
          <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Headline *" className="w-full border border-gray-200 rounded-lg px-4 py-2.5" />
          <div className="grid sm:grid-cols-2 gap-4">
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="border border-gray-200 rounded-lg px-4 py-2.5">
              {ARTICLE_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
            <input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} placeholder="Author" className="border border-gray-200 rounded-lg px-4 py-2.5" />
          </div>

          {/* Article image — upload a file OR paste a URL */}
          <div className="border border-dashed border-gray-300 rounded-xl p-4">
            <p className="text-sm font-bold text-coast-navy mb-3">Article image</p>
            <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
              {form.image_url ? (
                <div className="relative w-36 h-24 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={form.image_url} alt="Article" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, image_url: '' })}
                    className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 hover:bg-black/80"
                    title="Remove image"
                  >
                    <X size={12} />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  disabled={uploading}
                  onClick={() => fileRef.current?.click()}
                  className="w-36 h-24 rounded-lg bg-coast-light flex flex-col items-center justify-center gap-1.5 text-coast-blue hover:bg-blue-50 transition shrink-0 disabled:opacity-60"
                >
                  {uploading ? <Loader2 size={20} className="animate-spin" /> : <UploadCloud size={20} />}
                  <span className="text-xs font-bold">{uploading ? 'Uploading…' : 'Upload image'}</span>
                </button>
              )}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) uploadImage(f);
                  e.target.value = '';
                }}
              />
              <div className="flex-1">
                <input
                  value={form.image_url}
                  onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                  placeholder="…or paste an image URL (https://…)"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm"
                />
                <p className="text-xs text-gray-400 mt-1.5">Upload a file from your device, or paste a direct image link.</p>
              </div>
            </div>
          </div>
          <textarea value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} placeholder="Excerpt (shown in listings)" rows={2} className="w-full border border-gray-200 rounded-lg px-4 py-2.5" />
          <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="Article body — HTML supported (<p>, <h2>, <ul>…)" rows={10} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 font-mono text-sm" />
          <div className="flex flex-wrap items-center gap-6">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-600">
              <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> Featured (homepage hero)
            </label>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-600">
              <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} /> Published
            </label>
            {error && <span className="text-sm text-coast-red">{error}</span>}
            <button disabled={saving} className="ml-auto bg-coast-navy text-white font-bold px-6 py-2.5 rounded-lg disabled:opacity-60 flex items-center gap-2">
              {saving && <Loader2 size={15} className="animate-spin" />} {editing ? 'Save Changes' : 'Publish Article'}
            </button>
          </div>
        </form>
      )}

      {articles.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center text-gray-500">No articles yet — publish your first story above.</div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-400 uppercase border-b border-gray-100">
                <th className="px-5 py-3">Title</th>
                <th className="px-5 py-3 hidden md:table-cell">Category</th>
                <th className="px-5 py-3 hidden sm:table-cell">Status</th>
                <th className="px-5 py-3 hidden lg:table-cell">Created</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((a) => (
                <tr key={a.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-5 py-3">
                    <p className="font-semibold text-coast-navy line-clamp-1 max-w-xs">{a.title}</p>
                    <p className="text-xs text-gray-400">{a.author}</p>
                  </td>
                  <td className="px-5 py-3 hidden md:table-cell text-gray-500">{a.category}</td>
                  <td className="px-5 py-3 hidden sm:table-cell">
                    <span className={`text-xs font-bold px-2 py-1 rounded ${a.published ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                      {a.published ? 'Live' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-5 py-3 hidden lg:table-cell text-gray-400">{timeAgo(a.created_at)}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button title="Featured" onClick={() => toggleFlag(a, 'featured')} className={`p-2 rounded-lg ${a.featured ? 'text-coast-gold' : 'text-gray-300 hover:text-gray-500'}`}>
                        <Star size={16} fill={a.featured ? 'currentColor' : 'none'} />
                      </button>
                      <button title={a.published ? 'Unpublish' : 'Publish'} onClick={() => toggleFlag(a, 'published')} className="p-2 rounded-lg text-gray-400 hover:text-gray-600">
                        {a.published ? <Eye size={16} /> : <EyeOff size={16} />}
                      </button>
                      <button title="Edit" onClick={() => openEdit(a)} className="p-2 rounded-lg text-coast-blue hover:bg-blue-50"><Pencil size={16} /></button>
                      <button title="Delete" onClick={() => remove(a)} className="p-2 rounded-lg text-coast-red hover:bg-red-50"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
