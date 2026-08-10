import Link from 'next/link';
import { Clock, Eye } from 'lucide-react';
import { getArticles } from '@/lib/data';
import { timeAgo, CATEGORY_COLORS } from '@/lib/utils';
import { ARTICLE_CATEGORIES } from '@/types';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'News' };

export default async function NewsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const { category, q } = await searchParams;
  const articles = await getArticles({ category, q, limit: 60 });

  return (
    <div className="max-w-7xl mx-auto px-4 mt-8">
      <h1 className="text-3xl font-extrabold text-coast-navy border-l-4 border-coast-red pl-3 mb-6">
        {q ? `Search: “${q}”` : category || 'All News'}
      </h1>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        <Link
          href="/news"
          className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
            !category ? 'bg-coast-navy text-white' : 'bg-white text-coast-navy hover:bg-gray-100'
          }`}
        >
          All
        </Link>
        {ARTICLE_CATEGORIES.map((c) => (
          <Link
            key={c}
            href={`/news?category=${encodeURIComponent(c)}`}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
              category === c ? 'bg-coast-navy text-white' : 'bg-white text-coast-navy hover:bg-gray-100'
            }`}
          >
            {c}
          </Link>
        ))}
      </div>

      {articles.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center text-gray-500">
          No articles found{q ? ` for “${q}”` : category ? ` in ${category}` : ''}.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((a) => (
            <Link key={a.id} href={`/article/${a.slug}`} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition group flex flex-col">
              <div className="relative h-48 bg-coast-navy overflow-hidden">
                {a.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={a.image_url} alt={a.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/20 text-5xl font-extrabold">C</div>
                )}
                <div className="absolute top-3 left-3">
                  <span className={`${CATEGORY_COLORS[a.category] || 'bg-coast-blue'} text-white text-[11px] font-bold uppercase px-2.5 py-1 rounded`}>
                    {a.category}
                  </span>
                </div>
              </div>
              <div className="p-5 flex flex-col flex-1">
                <h2 className="font-bold text-coast-navy leading-snug mb-2 line-clamp-2 group-hover:text-coast-blue transition">{a.title}</h2>
                <p className="text-sm text-gray-500 line-clamp-3 mb-4">{a.excerpt}</p>
                <div className="mt-auto flex items-center gap-4 text-xs text-gray-400">
                  <span className="flex items-center gap-1"><Clock size={12} /> {timeAgo(a.created_at)}</span>
                  <span className="flex items-center gap-1"><Eye size={12} /> {a.views}</span>
                  <span className="ml-auto">By {a.author}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
