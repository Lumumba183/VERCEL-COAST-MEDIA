import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BriefSlider from '@/components/BriefSlider';
import { Play, Tv, Eye } from 'lucide-react';

export default function TVPage() {
  const videos = [
    { title: 'Coast TV Evening Bulletin', views: '15k views', date: '31 Jul 2026', duration: '45:00', thumb: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&h=450&fit=crop', live: true },
    { title: 'Exclusive: Inside the new Mombasa Expressway project', views: '15k views', date: '30 Jul 2026', duration: '12:45', thumb: 'https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?w=300&h=200&fit=crop' },
    { title: 'Coast Leaders Forum: Discussing regional development', views: '8.2k views', date: '29 Jul 2026', duration: '08:30', thumb: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=300&h=200&fit=crop' },
    { title: 'Documentary: The Swahili Coast — A Cultural Journey', views: '22k views', date: '28 Jul 2026', duration: '15:20', thumb: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=300&h=200&fit=crop' },
    { title: 'Sports Roundup: Bandari FC vs Tusker match highlights', views: '18k views', date: '27 Jul 2026', duration: '06:15', thumb: 'https://images.unsplash.com/photo-1551818255-e6e10975bc17?w=300&h=200&fit=crop' },
    { title: 'Coast TV Midday Report', views: '10k views', date: '26 Jul 2026', duration: '30:00', thumb: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop' },
  ];

  return (
    <>
      <Header />
      <BriefSlider />

      <section className="bg-gradient-to-br from-[#0a1628] to-[#1e3a5f] py-16 text-white">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex items-center gap-4 mb-4">
            <Tv size={40} className="text-[#c9a227]" />
            <h1 className="text-[42px] font-bold font-[var(--font-heading)]">Coast TV</h1>
          </div>
          <p className="text-lg text-white/70 max-w-[600px]">Watch live broadcasts, documentaries, and exclusive interviews from Kenya&apos;s coast.</p>
        </div>
      </section>

      {/* Live Stream */}
      <section className="py-10">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="relative rounded-2xl overflow-hidden aspect-video bg-black group">
            <img src={videos[0].thumb} alt={videos[0].title} className="w-full h-full object-cover" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-[rgba(230,57,70,0.9)] rounded-full flex items-center justify-center text-white text-3xl border-[3px] border-white/30 hover:scale-110 transition-transform cursor-pointer">
              <Play size={28} fill="white" />
            </div>
            <div className="absolute top-4 left-4">
              <span className="bg-[#e63946] text-white px-3 py-1 rounded text-[11px] font-bold uppercase flex items-center gap-1.5">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse" /> Live Now
              </span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-6 pt-16 bg-gradient-to-t from-black/90 to-transparent">
              <h2 className="text-2xl font-bold text-white">{videos[0].title}</h2>
              <p className="text-white/70 text-sm mt-1 flex items-center gap-4">
                <span className="flex items-center gap-1"><Eye size={14} /> {videos[0].views}</span>
                <span>{videos[0].date}</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Video Grid */}
      <section className="py-10 bg-[#f8f9fa]">
        <div className="max-w-[1400px] mx-auto px-6">
          <h2 className="section-title mb-8">Latest Videos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.slice(1).map((video, i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden shadow-md hover:-translate-y-1.5 hover:shadow-xl transition-all cursor-pointer group">
                <div className="aspect-video relative overflow-hidden">
                  <img src={video.thumb} alt={video.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-14 h-14 bg-[#e63946] rounded-full flex items-center justify-center text-white">
                      <Play size={24} fill="white" />
                    </div>
                  </div>
                  <span className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-0.5 rounded text-[11px] font-semibold">{video.duration}</span>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-[#0a1628] mb-1 font-[var(--font-body)]">{video.title}</h3>
                  <p className="text-xs text-[#718096] flex items-center gap-3">
                    <span className="flex items-center gap-1"><Eye size={12} /> {video.views}</span>
                    <span>{video.date}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
