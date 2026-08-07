import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BriefSlider from '@/components/BriefSlider';
import { supabaseClient } from '@/lib/supabase';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Clock, User, Eye, ChevronLeft, Share2, Facebook, Twitter, Linkedin } from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const { data: article } = await supabaseClient
    .from('articles')
    .select('title, excerpt')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (!article) return { title: 'Article Not Found' };

  return {
    title: `${article.title} | The Coast Media Group`,
    description: article.excerpt,
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;

  const { data: article } = await supabaseClient
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (!article) {
    notFound();
  }

  const { data: related } = await supabaseClient
    .from('articles')
    .select('id, title, slug, image_url, category, created_at')
    .eq('status', 'published')
    .eq('category', article.category)
    .neq('id', article.id)
    .order('created_at', { ascending: false })
    .limit(4);

  const categoryColors: Record<string, string> = {
    news: 'bg-[#e63946]',
    business: 'bg-[#2563eb]',
    sports: 'bg-[#059669]',
    education: 'bg-[#7c3aed]',
    lifestyle: 'bg-[#db2777]',
    health: 'bg-[#0891b2]',
    opinion: 'bg-[#ea580c]',
    international: 'bg-[#4f46e5]',
  };

  return (
    <>
      <Header />
      <BriefSlider />

      <article className="py-10">
        <div className="max-w-[900px] mx-auto px-6">
          <Link href="/news" className="inline-flex items-center gap-2 text-[#0066cc] font-semibold text-sm mb-6 hover:text-[#e63946] transition-colors">
            <ChevronLeft size={16} /> Back to News
          </Link>

          <span className={`inline-block ${categoryColors[article.category] || 'bg-[#e63946]'} text-white px-3.5 py-1 rounded text-[11px] font-bold uppercase tracking-wider mb-4`}>
            {article.category}
          </span>

          <h1 className="text-3xl lg:text-4xl font-bold text-[#0a1628] mb-4 font-[var(--font-heading)] leading-tight">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-[#718096] mb-6 pb-6 border-b border-[#e2e8f0]">
            <span className="flex items-center gap-1.5"><User size={14} /> By {article.author}</span>
            <span className="flex items-center gap-1.5"><Clock size={14} /> {new Date(article.created_at).toLocaleDateString('en-KE')}</span>
            <span className="flex items-center gap-1.5"><Eye size={14} /> {article.views?.toLocaleString() || 0} views</span>
          </div>

          {article.image_url && (
            <div className="rounded-2xl overflow-hidden mb-8 shadow-lg">
              <img src={article.image_url} alt={article.title} className="w-full h-[400px] lg:h-[500px] object-cover" />
            </div>
          )}

          <div
            className="prose prose-lg max-w-none text-[#2d3748] leading-relaxed"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Share */}
          <div className="mt-10 pt-6 border-t border-[#e2e8f0]">
            <p className="font-semibold text-[#0a1628] mb-3 flex items-center gap-2"><Share2 size={16} /> Share this article</p>
            <div className="flex gap-3">
              <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}`} target="_blank" className="w-10 h-10 bg-[#1DA1F2] rounded-lg flex items-center justify-center text-white hover:opacity-80 transition-opacity"><Twitter size={18} /></a>
              <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://thecoast.co.ke/article/${article.slug}`)}`} target="_blank" className="w-10 h-10 bg-[#4267B2] rounded-lg flex items-center justify-center text-white hover:opacity-80 transition-opacity"><Facebook size={18} /></a>
              <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://thecoast.co.ke/article/${article.slug}`)}`} target="_blank" className="w-10 h-10 bg-[#0077b5] rounded-lg flex items-center justify-center text-white hover:opacity-80 transition-opacity"><Linkedin size={18} /></a>
            </div>
          </div>
        </div>
      </article>

      {/* Related Articles */}
      {related && related.length > 0 && (
        <section className="py-10 bg-[#f8f9fa]">
          <div className="max-w-[1400px] mx-auto px-6">
            <h2 className="section-title mb-8">Related Articles</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((a) => (
                <Link key={a.id} href={`/article/${a.slug}`} className="bg-white rounded-xl overflow-hidden shadow-md hover:-translate-y-1.5 hover:shadow-xl transition-all no-underline text-inherit group">
                  <div className="h-[160px] overflow-hidden relative">
                    <img src={a.image_url || 'https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=400&h=300&fit=crop'} alt={a.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <span className={`absolute top-2 left-2 ${categoryColors[a.category] || 'bg-[#e63946]'} text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase`}>
                      {a.category}
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-bold text-[#0a1628] mb-1 font-[var(--font-body)] leading-snug">{a.title}</h3>
                    <span className="text-xs text-[#718096]">{new Date(a.created_at).toLocaleDateString('en-KE')}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </>
  );
}
