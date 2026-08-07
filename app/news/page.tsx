import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BriefSlider from '@/components/BriefSlider';
import { supabaseClient } from '@/lib/supabase';
import Link from 'next/link';
import { Clock, Eye } from 'lucide-react';

export const revalidate = 60;

interface Props {
  searchParams: Promise<{ cat?: string }>;
}

export default async function NewsPage({ searchParams }: Props) {
  const params = await searchParams;
  const category = params.cat || 'news';

  let query = supabaseClient
    .from('articles')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  if (category !== 'news') {
    query = query.eq('category', category);
  }

  const { data: articles } = await query.limit(20);

  const articleList = articles || [];

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

  const categories = [
    { key: 'news', label: 'All News' },
    { key: 'business', label: 'Business' },
    { key: 'sports', label: 'Sports' },
    { key: 'education', label: 'Education' },
    { key: 'lifestyle', label: 'Lifestyle' },
    { key: 'health', label: 'Health' },
    { key: 'opinion', label: 'Opinion' },
  ];

  return (
    <>
      <Header />
      <BriefSlider />

      <section className="bg-gradient-to-br from-[#0a1628] to-[#1e3a5f] py-16 text-white">
        <div className="max-w-[1400px] mx-auto px-6">
          <h1 className="text-[42px] font-bold mb-3 font-[var(--font-heading)]">{category.charAt(0).toUpperCase() + category.slice(1)}</h1>
          <p className="text-lg text-white/70">Breaking news and in-depth reporting from Kenya&apos;s coast</p>
          <div className="flex gap-3 mt-6 flex-wrap">
            {categories.map((cat) => (
              <Link
                key={cat.key}
                href={`/news?cat=${cat.key}`}
                className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                  category === cat.key
                    ? 'bg-[#e63946] text-white'
                    : 'border-2 border-white/30 text-white bg-transparent hover:border-[#c9a227] hover:text-[#c9a227]'
                }`}
              >
                {cat.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-[60px]">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {articleList.map((article) => (
              <Link key={article.id} href={`/article/${article.slug}`} className="bg-white rounded-xl overflow-hidden shadow-md hover:-translate-y-1.5 hover:shadow-xl transition-all no-underline text-inherit group">
                <div className="h-[180px] overflow-hidden relative">
                  <img src={article.image_url || 'https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=400&h=300&fit=crop'} alt={article.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <span className={`absolute top-3 left-3 ${categoryColors[article.category] || 'bg-[#e63946]'} text-white px-3 py-1 rounded text-[11px] font-bold uppercase`}>
                    {article.category}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="text-[17px] font-bold text-[#0a1628] mb-2.5 font-[var(--font-body)] leading-snug">{article.title}</h3>
                  <p className="text-sm text-[#718096] leading-relaxed mb-3">{article.excerpt}</p>
                  <div className="flex justify-between text-xs text-[#718096]">
                    <span className="flex items-center gap-1"><Clock size={12} /> 3 hours ago</span>
                    <span className="flex items-center gap-1"><Eye size={12} /> {article.views?.toLocaleString() || 0}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          {articleList.length === 0 && (
            <div className="text-center py-20 text-[#718096]">
              <p className="text-lg">No articles found in this category yet.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}
