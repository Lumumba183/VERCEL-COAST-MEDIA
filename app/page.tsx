import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BriefSlider from '@/components/BriefSlider';
import PlayerBar from '@/components/PlayerBar';
import Link from 'next/link';
import { supabaseClient } from '@/lib/supabase';
import { Clock, User, MessageCircle, Eye, Play, ChevronRight, Radio, CloudSun, Sun, CloudRain, Cloud, PaperPlane, TrendingUp, BookOpen, Tv } from 'lucide-react';

export const revalidate = 60;

export default async function HomePage() {
  const { data: articles } = await supabaseClient
    .from('articles')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(9);

  const { data: featured } = await supabaseClient
    .from('articles')
    .select('*')
    .eq('status', 'published')
    .eq('featured', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  const { data: settings } = await supabaseClient
    .from('settings')
    .select('*')
    .limit(1)
    .single();

  const articleList = articles || [];
  const topStory = featured || articleList[0];
  const latestArticles = topStory ? articleList.filter(a => a.id !== topStory.id).slice(0, 8) : articleList.slice(0, 8);

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

  const trending = [
    { num: 1, title: 'New SGR extension to Malindi gets cabinet approval', timeAgo: '2 hours ago', slug: '#' },
    { num: 2, title: 'Coast fishermen receive modern boats from EU grant', timeAgo: '4 hours ago', slug: '#' },
    { num: 3, title: 'Mombasa Old Town heritage restoration project launched', timeAgo: '5 hours ago', slug: '#' },
    { num: 4, title: 'Kilifi County invests KES 500M in water infrastructure', timeAgo: '6 hours ago', slug: '#' },
    { num: 5, title: 'International hotel chains eye Watamu coast expansion', timeAgo: '8 hours ago', slug: '#' },
  ];

  return (
    <>
      <Header />
      <BriefSlider />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#0a1628] to-[#1e3a5f] py-10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
        <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 relative z-[1]">
          {/* Featured Story */}
          {topStory && (
            <Link href={`/article/${topStory.slug}`} className="relative rounded-2xl overflow-hidden h-[400px] lg:h-[500px] shadow-2xl group block">
              <img src={topStory.image_url || 'https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=1200&h=600&fit=crop'} alt={topStory.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute bottom-0 left-0 right-0 p-8 pt-16 bg-gradient-to-t from-[rgba(10,22,40,0.95)] to-transparent">
                <span className="inline-block bg-[#e63946] text-white px-3.5 py-1 rounded text-[11px] font-bold uppercase tracking-wider mb-3">Top Story</span>
                <h2 className="text-white text-2xl lg:text-4xl font-bold leading-tight mb-3 font-[var(--font-heading)]">{topStory.title}</h2>
                <div className="flex gap-4 text-white/70 text-[13px]">
                  <span className="flex items-center gap-1.5"><Clock size={14} /> 3 hours ago</span>
                  <span className="flex items-center gap-1.5"><User size={14} /> By {topStory.author}</span>
                  <span className="flex items-center gap-1.5"><MessageCircle size={14} /> 24 comments</span>
                </div>
              </div>
            </Link>
          )}

          {/* Sidebar */}
          <div className="flex flex-col gap-5">
            {/* Radio Widget */}
            <div className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] rounded-2xl p-6 border border-white/10 shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2.5 h-2.5 bg-[#ff4757] rounded-full live-pulse" />
                <div>
                  <h3 className="text-white text-lg font-bold font-[var(--font-body)]">Radio Coast</h3>
                  <span className="text-[#c9a227] text-xs font-semibold">Fichua Wazi — Live Now</span>
                </div>
              </div>
              <div className="flex items-end justify-center gap-1 h-10 mb-4">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="w-1 bg-gradient-to-t from-[#00a8a8] to-[#0066cc] rounded-sm equalizer-bar" style={{ height: `${[20,60,40,80,30,70,50,90,35,65][i]}%`, animationDelay: `${i * 0.1}s` }} />
                ))}
              </div>
              <div className="flex justify-center items-center gap-5 mb-3">
                <button className="bg-none border-none text-white opacity-70 hover:opacity-100 transition-opacity cursor-pointer"><SkipBack size={18} /></button>
                <Link href="/listen" className="w-14 h-14 bg-gradient-to-br from-[#e63946] to-[#ff6b6b] rounded-full flex items-center justify-center text-white text-xl shadow-lg hover:scale-110 transition-transform">
                  <Play size={20} fill="white" />
                </Link>
                <button className="bg-none border-none text-white opacity-70 hover:opacity-100 transition-opacity cursor-pointer"><SkipForward size={18} /></button>
              </div>
              <div className="text-center text-white/70 text-[13px]">
                Now Playing
                <strong className="text-white text-sm block mt-1">Morning Drive with DJ Kipawa</strong>
              </div>
            </div>

            {/* Weather Widget */}
            <div className="bg-white rounded-2xl p-5 shadow-lg">
              <h4 className="text-sm text-[#718096] mb-4 uppercase tracking-wider flex items-center gap-2"><CloudSun size={16} /> Coastal Weather</h4>
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center py-2 border-b border-[#e2e8f0]">
                  <span className="font-semibold text-sm text-[#2d3748]">Mombasa</span>
                  <span className="flex items-center gap-2 text-sm text-[#718096]"><Sun size={16} className="text-[#0066cc]" /> 31°C Sunny</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-[#e2e8f0]">
                  <span className="font-semibold text-sm text-[#2d3748]">Kilifi</span>
                  <span className="flex items-center gap-2 text-sm text-[#718096]"><Cloud size={16} className="text-[#0066cc]" /> 29°C Partly Cloudy</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="font-semibold text-sm text-[#2d3748]">Nairobi</span>
                  <span className="flex items-center gap-2 text-sm text-[#718096]"><CloudRain size={16} className="text-[#0066cc]" /> 22°C Light Rain</span>
                </div>
              </div>
            </div>

            {/* Trending */}
            <div className="bg-white rounded-2xl p-5 shadow-lg flex-1">
              <h4 className="text-sm text-[#718096] mb-4 uppercase tracking-wider flex items-center gap-2"><TrendingUp size={16} /> Trending Now</h4>
              <div className="flex flex-col">
                {trending.map((t) => (
                  <Link key={t.num} href={t.slug} className="flex gap-3 py-3 border-b border-[#e2e8f0] last:border-0 no-underline hover:bg-[#f8f9fa] -mx-5 px-5 transition-all group">
                    <span className="text-2xl font-black text-[#e63946] leading-none min-w-[30px]">{t.num}</span>
                    <div>
                      <h5 className="text-sm text-[#2d3748] font-semibold mb-1 group-hover:text-[#0066cc] transition-colors">{t.title}</h5>
                      <span className="text-xs text-[#718096]">{t.timeAgo}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest News */}
      <section className="py-[60px]">
        <div className="max-w-[1400px] mx-auto px-6 flex justify-between items-center mb-10">
          <h2 className="section-title">Latest News</h2>
          <Link href="/news" className="text-[#0066cc] font-semibold text-sm flex items-center gap-1.5 hover:text-[#e63946] hover:gap-2.5 transition-all">
            View All <ChevronRight size={16} />
          </Link>
        </div>
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {latestArticles.map((article) => (
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
        </div>
      </section>

      {/* Coast TV Section */}
      <section className="py-[60px] bg-gradient-to-br from-[#0a1628] to-[#0f2847] text-white">
        <div className="max-w-[1400px] mx-auto px-6 flex justify-between items-center mb-10">
          <h2 className="text-3xl text-white relative pl-5 before:content-[''] before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1 before:bg-[#c9a227] before:rounded">Coast TV Live</h2>
          <Link href="/tv" className="text-[#c9a227] font-semibold text-sm flex items-center gap-1.5 hover:gap-2.5 transition-all">
            View All Videos <ChevronRight size={16} />
          </Link>
        </div>
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-6">
            <div className="relative rounded-2xl overflow-hidden aspect-video bg-black group cursor-pointer">
              <img src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&h=450&fit=crop" alt="Coast TV Live" className="w-full h-full object-cover" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-[rgba(230,57,70,0.9)] rounded-full flex items-center justify-center text-white text-3xl border-[3px] border-white/30 hover:scale-110 transition-transform">
                <Play size={28} fill="white" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 pt-12 bg-gradient-to-t from-black/90 to-transparent">
                <span className="bg-[#e63946] text-white px-3 py-1 rounded text-[11px] font-bold uppercase inline-block mb-3">Live Now</span>
                <h3 className="text-2xl font-bold mb-2">Coast TV Evening Bulletin</h3>
                <p className="text-white/70 text-sm">Comprehensive news coverage from across the coastal region and beyond</p>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              {[
                { title: 'Exclusive: Inside the new Mombasa Expressway project', views: '15k views', date: '1 day ago', thumb: 'https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?w=300&h=200&fit=crop', duration: '12:45' },
                { title: 'Coast Leaders Forum: Discussing regional development', views: '8.2k views', date: '2 days ago', thumb: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=300&h=200&fit=crop', duration: '08:30' },
                { title: 'Documentary: The Swahili Coast — A Cultural Journey', views: '22k views', date: '3 days ago', thumb: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=300&h=200&fit=crop', duration: '15:20' },
                { title: 'Sports Roundup: Bandari FC vs Tusker match highlights', views: '18k views', date: '1 day ago', thumb: 'https://images.unsplash.com/photo-1551818255-e6e10975bc17?w=300&h=200&fit=crop', duration: '06:15' },
              ].map((video, i) => (
                <Link key={i} href="/tv" className="flex gap-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all no-underline text-white">
                  <div className="w-[120px] h-[80px] rounded-lg overflow-hidden relative shrink-0">
                    <img src={video.thumb} alt={video.title} className="w-full h-full object-cover" />
                    <span className="absolute bottom-1 right-1 bg-black/80 text-white px-1.5 py-0.5 rounded text-[11px] font-semibold">{video.duration}</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold font-[var(--font-body)] mb-1.5">{video.title}</h4>
                    <span className="text-xs text-white/60 flex items-center gap-1"><Eye size={12} /> {video.views} &bull; {video.date}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Advertise CTA */}
      <section className="py-[60px] bg-gradient-to-br from-[#c9a227] to-[#d4a017] text-center relative overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-[radial-gradient(circle,rgba(255,255,255,0.1)_0%,transparent_60%)] animate-[spin_20s_linear_infinite]" />
        <div className="max-w-[800px] mx-auto px-6 relative z-[1]">
          <h2 className="text-[42px] text-[#0a1628] font-bold mb-4 font-[var(--font-heading)]">Reach the Coast. Reach Kenya.</h2>
          <p className="text-lg text-[rgba(10,22,40,0.8)] mb-8">Connect your brand with over 500,000 monthly readers across Mombasa, Kilifi, Nairobi and beyond. From banner ads to sponsored content, we have the perfect package for your business.</p>
          <Link href="/advertise" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg font-semibold text-base bg-[#0a1628] text-white hover:-translate-y-0.5 transition-all">
            <Bullhorn size={18} /> View Advertising Packages
          </Link>
        </div>
      </section>

      {/* E-Paper Section */}
      <section className="py-[60px] bg-[#f8f9fa]">
        <div className="max-w-[1400px] mx-auto px-6 flex justify-between items-center mb-10">
          <h2 className="section-title">Digital E-Paper</h2>
          <Link href="/epaper" className="text-[#0066cc] font-semibold text-sm flex items-center gap-1.5 hover:text-[#e63946] hover:gap-2.5 transition-all">
            Browse Archive <ChevronRight size={16} />
          </Link>
        </div>
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Today's Edition", date: '31 July 2026', pages: 24, label: '31 July 2026' },
              { title: "Yesterday's Edition", date: '30 July 2026', pages: 20, label: '30 July 2026' },
              { title: 'Weekend Magazine', date: '26-27 July 2026', pages: 32, label: 'Weekend Special' },
              { title: 'July 2026 Review', date: 'Monthly compilation', pages: 48, label: 'Monthly Review' },
            ].map((ep, i) => (
              <Link key={i} href="/epaper" className="bg-white rounded-xl overflow-hidden shadow-md hover:-translate-y-1.5 hover:shadow-xl transition-all no-underline text-inherit">
                <div className="h-[280px] bg-gradient-to-br from-[#0a1628] to-[#1e3a5f] flex items-center justify-center relative overflow-hidden">
                  <div className="w-[80%] h-[90%] bg-white rounded shadow-lg" />
                  <h5 className="absolute z-[1] text-[#0a1628] text-lg text-center p-5 font-bold font-[var(--font-heading)]">
                    The Coast<br />Media Group<br /><small className="text-xs text-[#718096]">{ep.label}</small>
                  </h5>
                </div>
                <div className="p-5">
                  <h4 className="text-base font-bold text-[#0a1628] mb-2">{ep.title}</h4>
                  <p className="text-[13px] text-[#718096]">{ep.date} &bull; {ep.pages} pages</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Submit Story Section */}
      <section className="py-20 bg-gradient-to-br from-[#0a1628] to-[#1e3a5f] text-white">
        <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-[42px] font-bold mb-5 font-[var(--font-heading)]">Your Story Matters</h2>
            <p className="text-lg text-white/80 mb-8 leading-relaxed">Have a news tip, photo, or video from your community? The Coast Media Group's public news desk is open 24/7. Submit your story anonymously or with credit — our editorial team reviews every submission.</p>
            <Link href="/report" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg font-semibold text-base bg-[#e63946] text-white hover:-translate-y-0.5 hover:bg-[#c1121f] transition-all">
              <PaperPlane size={18} /> Submit a Story Now
            </Link>
            <div className="mt-8 flex gap-6">
              <div><h3 className="text-[32px] text-[#c9a227] font-bold mb-1">2,400+</h3><p className="text-white/70 text-sm">Stories submitted</p></div>
              <div><h3 className="text-[32px] text-[#c9a227] font-bold mb-1">850+</h3><p className="text-white/70 text-sm">Published</p></div>
              <div><h3 className="text-[32px] text-[#c9a227] font-bold mb-1">24h</h3><p className="text-white/70 text-sm">Response time</p></div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-10 text-[#2d3748]">
            <h3 className="text-xl font-bold mb-5 text-[#0a1628]">Quick Submit</h3>
            <form action="/report" method="GET">
              <div className="form-group">
                <label>Your Name (optional)</label>
                <input type="text" name="name" placeholder="Enter your name" className="w-full px-4 py-3 border-2 border-[#e2e8f0] rounded-lg text-sm outline-none focus:border-[#0066cc]" />
              </div>
              <div className="form-group">
                <label>Story Title *</label>
                <input type="text" name="title" placeholder="What's your story about?" required className="w-full px-4 py-3 border-2 border-[#e2e8f0] rounded-lg text-sm outline-none focus:border-[#0066cc]" />
              </div>
              <div className="form-group">
                <label>Story Details *</label>
                <textarea name="message" placeholder="Tell us what happened..." required className="w-full px-4 py-3 border-2 border-[#e2e8f0] rounded-lg text-sm outline-none focus:border-[#0066cc] resize-y min-h-[120px]" />
              </div>
              <div className="flex items-center gap-2.5 mb-6">
                <input type="checkbox" name="anonymous" id="anonymous" className="w-[18px] h-[18px] accent-[#e63946]" />
                <label htmlFor="anonymous" className="text-sm text-[#718096]">Submit anonymously</label>
              </div>
              <button type="submit" className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm bg-[#e63946] text-white hover:bg-[#c1121f] transition-all">
                <PaperPlane size={16} /> Send to News Desk
              </button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
      <PlayerBar streamUrl={settings?.stream_url} />

      {/* WhatsApp Float */}
      <a href="https://wa.me/254106216699" target="_blank" className="fixed bottom-20 right-6 w-[60px] h-[60px] bg-[#25d366] rounded-full flex items-center justify-center text-white text-3xl shadow-lg z-[998] hover:scale-110 transition-transform">
        <i className="fab fa-whatsapp"></i>
      </a>
    </>
  );
}
