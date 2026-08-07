import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BriefSlider from '@/components/BriefSlider';
import { BookOpen, Calendar, FileText } from 'lucide-react';

export default function EpaperPage() {
  const editions = [
    { title: "Today's Edition", date: '31 July 2026', pages: 24, type: 'Daily', label: '31 July 2026' },
    { title: "Yesterday's Edition", date: '30 July 2026', pages: 22, type: 'Daily', label: '30 July 2026' },
    { title: 'Weekend Magazine', date: '26-27 July 2026', pages: 32, type: 'Weekend Special', label: 'Weekend Special' },
    { title: 'July 2026 Review', date: 'Monthly compilation', pages: 48, type: 'Monthly Review', label: 'Monthly Review' },
    { title: 'June 2026 Review', date: 'Monthly compilation', pages: 46, type: 'Monthly Review', label: 'Monthly Review' },
    { title: '25 July 2026', date: '25 July 2026', pages: 24, type: 'Daily', label: '25 July 2026' },
    { title: '24 July 2026', date: '24 July 2026', pages: 20, type: 'Daily', label: '24 July 2026' },
    { title: 'Weekend Special 19-20 July', date: '19-20 July 2026', pages: 30, type: 'Weekend Special', label: 'Weekend Special' },
  ];

  return (
    <>
      <Header />
      <BriefSlider />

      <section className="bg-gradient-to-br from-[#0a1628] to-[#1e3a5f] py-16 text-white">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex items-center gap-4 mb-4">
            <BookOpen size={40} className="text-[#c9a227]" />
            <h1 className="text-[42px] font-bold font-[var(--font-heading)]">Digital E-Paper</h1>
          </div>
          <p className="text-lg text-white/70 max-w-[600px]">Browse our digital newspaper archive. Read today&apos;s edition or explore past publications.</p>
        </div>
      </section>

      <section className="py-[60px] bg-[#f8f9fa]">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {editions.map((ep, i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden shadow-md hover:-translate-y-1.5 hover:shadow-xl transition-all cursor-pointer group">
                <div className="h-[280px] bg-gradient-to-br from-[#0a1628] to-[#1e3a5f] flex items-center justify-center relative overflow-hidden">
                  <div className="w-[80%] h-[90%] bg-white rounded shadow-lg group-hover:shadow-xl transition-shadow" />
                  <h5 className="absolute z-[1] text-[#0a1628] text-lg text-center p-5 font-bold font-[var(--font-heading)]">
                    The Coast<br />Media Group<br /><small className="text-xs text-[#718096]">{ep.label}</small>
                  </h5>
                </div>
                <div className="p-5">
                  <h4 className="text-base font-bold text-[#0a1628] mb-2">{ep.title}</h4>
                  <div className="flex items-center gap-3 text-[13px] text-[#718096]">
                    <span className="flex items-center gap-1"><Calendar size={12} /> {ep.date}</span>
                    <span className="flex items-center gap-1"><FileText size={12} /> {ep.pages} pages</span>
                  </div>
                  <span className={`inline-block mt-3 text-[11px] font-bold uppercase px-2.5 py-1 rounded ${ep.type === 'Daily' ? 'bg-blue-100 text-blue-700' : ep.type === 'Weekend Special' ? 'bg-purple-100 text-purple-700' : 'bg-amber-100 text-amber-700'}`}>
                    {ep.type}
                  </span>
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
