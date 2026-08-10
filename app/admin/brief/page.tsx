'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash2, ArrowUp, ArrowDown, Loader2, Sparkles, Eye, EyeOff, Newspaper } from 'lucide-react';
import type { Article, BriefItem } from '@/types';

export default function BriefPage() {
  const [items, setItems] = useState<BriefItem[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('');
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const [briefRes, artRes] = await Promise.all([
      fetch('/api/brief?all=1'),
      fetch('/api/articles?all=1'),
    ]);
    if (briefRes.ok) setItems(await briefRes.json());
    if (artRes.ok) setArticles(await artRes.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function addManual(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    setSaving(true);
    await fetch('/api/brief', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: text.trim() }),
    });
    setText('');
    setSaving(false);
    load();
  }

  async function addFromArticle(articleId: string) {
    if (!articleId) return;
    const article = articles.find((a) => a.id === articleId);
    if (!article) return;
    setSaving(true);
    await fetch('/api/brief', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: article.title, article_id: article.id }),
    });
    setSaving(false);
    load();
  }

  async function autofill() {
    setSaving(true);
    const res = await fetch('/api/brief', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ autofill: true }),
    });
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      alert(d.error || 'Auto-fill failed');
    }
    setSaving(false);
    load();
  }

  async function move(index: number, dir: -1 | 1) {
    const next = [...items];
    const swap = index + dir;
    if (swap < 0 || swap >= next.length) return;
    [next[index], next[swap]] = [next[swap], next[index]];
    setItems(next);
    await fetch('/api/brief', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order: next.map((i) => i.id) }),
    });
  }

  async function toggle(item: BriefItem) {
    await fetch('/api/brief', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: item.id, active: !item.active }),
    });
    load();
  }

  async function remove(id: string) {
    if (!confirm('Remove this ticker item?')) return;
    await fetch(`/api/brief?id=${id}`, { method: 'DELETE' });
    load();
  }

  if (loading) return <div className="bg-white rounded-2xl p-10 text-center text-gray-400"><Loader2 className="animate-spin inline mr-2" />Loading ticker…</div>;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <h2 className="font-extrabold text-coast-navy text-xl">Breaking News Ticker ({items.length})</h2>
        <button
          onClick={autofill}
          disabled={saving}
          className="bg-coast-navy text-white font-bold px-4 py-2.5 rounded-lg flex items-center gap-2 text-sm hover:brightness-125 disabled:opacity-60"
        >
          <Sparkles size={15} /> Auto-fill 5 Latest Articles
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-5 mb-6">
        {/* Option 1: pick from existing articles */}
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <p className="font-bold text-coast-navy text-sm mb-3 flex items-center gap-2">
            <Newspaper size={16} className="text-coast-blue" /> Pick from existing articles
          </p>
          <select
            defaultValue=""
            disabled={saving || articles.length === 0}
            onChange={(e) => { addFromArticle(e.target.value); e.target.value = ''; }}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm"
          >
            <option value="" disabled>
              {articles.length === 0 ? 'No articles available' : 'Select an article to add to the ticker…'}
            </option>
            {articles.slice(0, 100).map((a) => (
              <option key={a.id} value={a.id}>{a.title}</option>
            ))}
          </select>
          <p className="text-xs text-gray-400 mt-2">The article headline is added and linked to the story.</p>
        </div>

        {/* Option 2: write manually */}
        <form onSubmit={addManual} className="bg-white rounded-2xl shadow-sm p-5">
          <p className="font-bold text-coast-navy text-sm mb-3 flex items-center gap-2">
            <Plus size={16} className="text-coast-red" /> Or write a ticker item manually
          </p>
          <div className="flex gap-3">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="e.g. Mombasa Port records highest cargo traffic…"
              className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 text-sm"
            />
            <button disabled={saving || !text.trim()} className="bg-coast-red text-white font-bold px-5 py-2.5 rounded-lg text-sm disabled:opacity-60 shrink-0">
              Add
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2">Free-text item, not linked to any article.</p>
        </form>
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center text-gray-500">
          No ticker items — pick an article, auto-fill, or add one manually above.
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm divide-y divide-gray-50">
          {items.map((item, i) => (
            <div key={item.id} className={`px-5 py-3.5 flex items-center gap-3 ${item.active ? '' : 'opacity-50'}`}>
              <span className="text-xs font-bold text-gray-300 w-6">{i + 1}</span>
              <p className="flex-1 text-sm text-coast-navy min-w-0 truncate">
                {item.text}
                {item.article_id && <span className="ml-2 text-[10px] text-coast-blue font-bold">LINKED</span>}
              </p>
              <button onClick={() => move(i, -1)} disabled={i === 0} className="p-1.5 text-gray-400 hover:text-gray-600 disabled:opacity-30"><ArrowUp size={15} /></button>
              <button onClick={() => move(i, 1)} disabled={i === items.length - 1} className="p-1.5 text-gray-400 hover:text-gray-600 disabled:opacity-30"><ArrowDown size={15} /></button>
              <button onClick={() => toggle(item)} className="p-1.5 text-gray-400 hover:text-gray-600" title={item.active ? 'Hide' : 'Show'}>
                {item.active ? <Eye size={15} /> : <EyeOff size={15} />}
              </button>
              <button onClick={() => remove(item.id)} className="p-1.5 text-coast-red hover:bg-red-50 rounded-lg"><Trash2 size={15} /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
