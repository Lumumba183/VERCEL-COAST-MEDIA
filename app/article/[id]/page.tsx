import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Clock, Eye, ArrowLeft, User } from 'lucide-react';
import { getArticleBySlug, getArticles } from '@/lib/data';
import AdSlot from '@/components/AdSlot';
import { formatDate, timeAgo, CATEGORY_COLORS, stripHtml } from '@/lib/utils';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const article = await getArticleBySlug(id);
  if (!article) return { title: 'Article not found' };
  return {
    title: article.title,
    description: article.excerpt || stripHtml(article.content).slice(0, 160),
    openGraph: article.image_url ? { images: [article.image_url] } : undefined,
  };
}

export default async function ArticlePage({ params }: Props) {
  const { id } = await params;
  const article = await getArticleBySlug(id);
  if (!article) notFound();

  const related = (await getArticles({ category: article.category, limit: 4 })).filter(
    (a) => a.id !== article.id
  ).slice(0, 3);

  return (
    <div className="max-w-4xl mx-auto px-4 mt-8">
      <Link href="/news" className="inline-flex items-center gap-2 text-coast-blue font-semibold text-sm mb-6 hover:gap-3 transition-all">
        <ArrowLeft size={16} /> Back to News
      </Link>

      <article className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {article.image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={article.image_url} alt={article.title} className="w-full h-72 md:h-96 object-cover" />
        )}
        <div className="p-6 md:p-10">
          <span className={`${CATEGORY_COLORS[article.category] || 'bg-coast-blue'} text-white text-xs font-bold uppercase px-3 py-1 rounded`}>
            {article.category}
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-coast-navy leading-tight mt-4 mb-4">
            {article.title}
          </h1>
          <div className="flex flex-wrap items-center gap-5 text-sm text-gray-500 pb-6 border-b border-gray-100 mb-6">
            <span className="flex items-center gap-1.5"><User size={15} /> {article.author}</span>
            <span className="flex items-center gap-1.5"><Clock size={15} /> {formatDate(article.created_at)} ({timeAgo(article.created_at)})</span>
            <span className="flex items-center gap-1.5"><Eye size={15} /> {article.views} views</span>
          </div>

          {article.excerpt && (
            <p className="text-lg text-gray-600 font-medium leading-relaxed mb-6">{article.excerpt}</p>
          )}

          <div className="article-body" dangerouslySetInnerHTML={{ __html: article.content }} />
        </div>
      </article>

      <AdSlot placement="article-bottom" className="mt-8" />

      {related.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-extrabold text-coast-navy border-l-4 border-coast-red pl-3 mb-5">Related Stories</h2>
          <div className="grid sm:grid-cols-3 gap-5">
            {related.map((a) => (
              <Link key={a.id} href={`/article/${a.slug}`} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition group">
                <div className="h-32 bg-coast-navy overflow-hidden">
                  {a.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={a.image_url} alt={a.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/20 text-3xl font-extrabold">C</div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-sm text-coast-navy line-clamp-2 group-hover:text-coast-blue transition">{a.title}</h3>
                  <p className="text-xs text-gray-400 mt-2">{timeAgo(a.created_at)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
