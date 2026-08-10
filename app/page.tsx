import Link from 'next/link';
import { Clock, MessageSquare, Eye, Radio, PlayCircle, CloudSun, TrendingUp, ArrowRight, Tv, Megaphone, PenSquare } from 'lucide-react';
import { getArticles } from '@/lib/data';
import { timeAgo, CATEGORY_COLORS, WHATSAPP_URL } from '@/lib/utils';
import type { Article } from '@/types';

export const dynamic = 'force-dynamic';

function CategoryBadge({ category }: { category: string }) {
  const color = CATEGORY_COLORS[category] || 'bg-coast-blue';
  return (
    <span className={`${color} text-white text-[11px] font-bold uppercase tracking-wide px-2.5 py-1 rounded`}>
      {category}
    </span>
  );
}

function ArticleCard({ article }: { article: Article }) {
  return (
    <Link href={`/article/${article.slug}`} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition group flex flex-col">
      <div className="relative h-44 bg-coast-navy overflow-hidden">
        {article.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={article.image_url} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/20 text-5xl font-extrabold">C</div>
        )}
        <div className="absolute top-3 left-3"><CategoryBadge category={article.category} /></div>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold text-coast-navy leading-snug mb-2 line-clamp-2 group-hover:text-coast-blue transition">
          {article.title}
        </h3>
        <p className="text-sm text-gray-500 line-clamp-2 mb-3">{article.excerpt}</p>
        <div className="mt-auto flex items-center gap-4 text-xs text-gray-400">
          <span className="flex items-center gap-1"><Clock size={12} /> {timeAgo(article.created_at)}</span>
          <span className="flex items-center gap-1"><Eye size={12} /> {article.views}</span>
        </div>
      </div>
    </Link>
  );
}

export default async function HomePage() {
  const [featured, latest] = await Promise.all([
    getArticles({ featured: true, limit: 1 }),
    getArticles({ limit: 9 }),
  ]);
  const hero = featured[0] || latest[0];
  const rest = latest.filter((a) => a.id !== hero?.id).slice(0, 8);
  const trending = latest.slice(0, 5);

  return (
    <div>
      {/* Hero section */}
      <section className="bg-coast-navy pb-10">
        <div className="max-w-7xl mx-auto px-4 pt-6 grid lg:grid-cols-3 gap-6">
          {/* Top story */}
          <div className="lg:col-span-2">
            {hero ? (
              <Link href={`/article/${hero.slug}`} className="block relative rounded-2xl overflow-hidden h-[380px] group">
                {hero.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={hero.image_url} alt={hero.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-coast-navy-light to-coast-navy" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                <div className="absolute bottom-0 p-6 md:p-8">
                  <span className="bg-coast-red text-white text-xs font-bold px-3 py-1 rounded">TOP STORY</span>
                  <h1 className="text-white text-2xl md:text-4xl font-extrabold leading-tight mt-4 max-w-2xl">
                    {hero.title}
                  </h1>
                  <div className="flex items-center gap-4 text-white/70 text-sm mt-3">
                    <span className="flex items-center gap-1.5"><Clock size={14} /> {timeAgo(hero.created_at)}</span>
                    <span>By {hero.author}</span>
                  </div>
                </div>
              </Link>
            ) : (
              <div className="rounded-2xl bg-coast-navy-light h-[380px] flex flex-col items-center justify-center text-center p-8">
                <p className="text-coast-gold font-extrabold text-3xl mb-2">The Coast Media Group</p>
                <p className="text-white/70 max-w-md">
                  Kenya&apos;s leading coastal news, radio and TV platform. Stories published in the admin panel will appear here.
                </p>
              </div>
            )}
          </div>

          {/* Sidebar widgets */}
          <div className="space-y-6">
            {/* Radio widget */}
            <div className="bg-coast-navy-light rounded-2xl p-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-coast-red animate-pulse" />
                <span className="text-white font-bold">Radio Coast</span>
              </div>
              <p className="text-coast-gold text-xs mb-4">Live — 98.7 FM Mombasa</p>
              <div className="flex items-end justify-center gap-[3px] h-6 mb-4">
                <span className="eq-bar" /><span className="eq-bar" /><span className="eq-bar" />
                <span className="eq-bar" /><span className="eq-bar" /><span className="eq-bar" /><span className="eq-bar" />
              </div>
              <Link
                href="/listen"
                className="inline-flex items-center gap-2 bg-coast-red text-white font-bold px-6 py-2.5 rounded-full hover:brightness-110 transition"
              >
                <PlayCircle size={18} /> Listen Live
              </Link>
            </div>

            {/* Weather */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <p className="flex items-center gap-2 text-xs font-bold text-gray-400 tracking-widest mb-3">
                <CloudSun size={14} /> COASTAL WEATHER
              </p>
              {[
                { city: 'Mombasa', temp: '31°C', cond: 'Sunny' },
                { city: 'Kilifi', temp: '29°C', cond: 'Partly Cloudy' },
                { city: 'Nairobi', temp: '22°C', cond: 'Light Rain' },
              ].map((w) => (
                <div key={w.city} className="flex items-center justify-between py-2 border-b last:border-0 border-gray-100 text-sm">
                  <span className="font-semibold text-coast-navy">{w.city}</span>
                  <span className="text-gray-500">{w.temp} · {w.cond}</span>
                </div>
              ))}
            </div>

            {/* Trending */}
            {trending.length > 0 && (
              <div className="bg-white rounded-2xl p-5 shadow-sm">
                <p className="flex items-center gap-2 text-xs font-bold text-gray-400 tracking-widest mb-3">
                  <TrendingUp size={14} /> TRENDING NOW
                </p>
                {trending.map((a, i) => (
                  <Link key={a.id} href={`/article/${a.slug}`} className="flex gap-3 py-2.5 border-b last:border-0 border-gray-100 group">
                    <span className="text-coast-red font-extrabold text-lg leading-none">{i + 1}</span>
                    <span>
                      <span className="block text-sm font-semibold text-coast-navy group-hover:text-coast-blue line-clamp-2">{a.title}</span>
                      <span className="text-xs text-gray-400">{timeAgo(a.created_at)}</span>
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Latest news */}
      <section className="max-w-7xl mx-auto px-4 mt-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-extrabold text-coast-navy border-l-4 border-coast-red pl-3">Latest News</h2>
          <Link href="/news" className="text-coast-blue font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all">
            View All <ArrowRight size={15} />
          </Link>
        </div>
        {rest.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {rest.map((a) => <ArticleCard key={a.id} article={a} />)}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-10 text-center text-gray-500">
            No articles yet — check back soon, or sign in to the admin panel to publish your first story.
          </div>
        )}
      </section>

      {/* Quick links */}
      <section className="max-w-7xl mx-auto px-4 mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { href: '/listen', icon: Radio, title: 'Radio Coast', desc: 'Stream live radio 24/7', color: 'bg-coast-red' },
          { href: '/tv', icon: Tv, title: 'Coast TV', desc: 'Watch our video content', color: 'bg-coast-blue' },
          { href: '/report', icon: PenSquare, title: 'Submit a Story', desc: 'Tip off our news desk', color: 'bg-emerald-600' },
          { href: '/advertise', icon: Megaphone, title: 'Advertise', desc: 'Reach coastal audiences', color: 'bg-coast-gold' },
        ].map(({ href, icon: Icon, title, desc, color }) => (
          <Link key={href} href={href} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition group">
            <span className={`${color} w-12 h-12 rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition`}>
              <Icon size={22} />
            </span>
            <h3 className="font-bold text-coast-navy mb-1">{title}</h3>
            <p className="text-sm text-gray-500">{desc}</p>
          </Link>
        ))}
      </section>

      {/* WhatsApp CTA */}
      <section className="max-w-7xl mx-auto px-4 mt-12">
        <div className="bg-gradient-to-r from-coast-navy to-coast-navy-light rounded-2xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-white font-extrabold text-2xl mb-2">Talk to our news desk</h3>
            <p className="text-white/70">Have a story tip, advert enquiry or feedback? Reach us instantly on WhatsApp.</p>
          </div>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noreferrer"
            className="bg-emerald-500 text-white font-bold px-8 py-3.5 rounded-full hover:brightness-110 transition flex items-center gap-2 shrink-0"
          >
            <MessageSquare size={18} /> Chat on WhatsApp
          </a>
        </div>
      </section>
    </div>
  );
}
