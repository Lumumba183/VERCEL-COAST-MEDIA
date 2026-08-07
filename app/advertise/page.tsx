import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BriefSlider from '@/components/BriefSlider';
import { Bullhorn, Check, Star } from 'lucide-react';

export default function AdvertisePage() {
  const packages = [
    {
      name: 'Starter',
      price: 'KES 15,000',
      period: 'per month',
      features: ['Homepage banner (728x90)', '1 sponsored article', 'Social media shoutout', 'Monthly performance report'],
      highlighted: false,
    },
    {
      name: 'Business',
      price: 'KES 50,000',
      period: 'per month',
      features: ['Homepage + Article sidebar banners', '4 sponsored articles', 'Radio mention (2x/week)', 'Social media campaign', 'Weekly performance report', 'Priority support'],
      highlighted: true,
    },
    {
      name: 'Enterprise',
      price: 'KES 150,000',
      period: 'per month',
      features: ['All banner positions', 'Unlimited sponsored articles', 'Daily radio mentions', 'Full social media campaign', 'TV commercial slot', 'Dedicated account manager', 'Real-time analytics dashboard'],
      highlighted: false,
    },
  ];

  return (
    <>
      <Header />
      <BriefSlider />

      <section className="bg-gradient-to-br from-[#0a1628] to-[#1e3a5f] py-20 text-white text-center">
        <div className="max-w-[800px] mx-auto px-6">
          <Bullhorn size={64} className="mx-auto mb-6 text-[#c9a227]" />
          <h1 className="text-5xl font-bold mb-4 font-[var(--font-heading)]">Advertise With Us</h1>
          <p className="text-xl text-white/70">Connect your brand with over 500,000 monthly readers across Kenya&apos;s coast and beyond.</p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16">
        <div className="max-w-[1000px] mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { value: '500K+', label: 'Monthly Readers' },
              { value: '50K+', label: 'Radio Listeners' },
              { value: '12.5K+', label: 'Social Followers' },
              { value: '8+', label: 'Years of Trust' },
            ].map((stat, i) => (
              <div key={i}>
                <h3 className="text-4xl font-black text-[#0a1628] mb-2">{stat.value}</h3>
                <p className="text-[#718096] font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages */}
      <section className="py-16 bg-[#f8f9fa]">
        <div className="max-w-[1100px] mx-auto px-6">
          <h2 className="section-title mb-10 text-center justify-center">Advertising Packages</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {packages.map((pkg, i) => (
              <div key={i} className={`rounded-2xl p-8 ${pkg.highlighted ? 'bg-[#0a1628] text-white shadow-2xl scale-105' : 'bg-white shadow-lg'}`}>
                {pkg.highlighted && <div className="flex items-center justify-center gap-1 text-[#c9a227] font-bold text-sm uppercase tracking-wider mb-4"><Star size={14} fill="#c9a227" /> Most Popular</div>}
                <h3 className={`text-2xl font-bold mb-2 ${pkg.highlighted ? 'text-white' : 'text-[#0a1628]'}`}>{pkg.name}</h3>
                <div className="mb-6">
                  <span className={`text-3xl font-black ${pkg.highlighted ? 'text-[#c9a227]' : 'text-[#0a1628]'}`}>{pkg.price}</span>
                  <span className={`text-sm ${pkg.highlighted ? 'text-white/60' : 'text-[#718096]'}`}> / {pkg.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {pkg.features.map((feat, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm">
                      <Check size={16} className={`shrink-0 mt-0.5 ${pkg.highlighted ? 'text-[#c9a227]' : 'text-[#059669]'}`} />
                      <span className={pkg.highlighted ? 'text-white/80' : 'text-[#2d3748]'}>{feat}</span>
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-3 rounded-lg font-semibold transition-all ${pkg.highlighted ? 'bg-[#e63946] text-white hover:bg-[#c1121f]' : 'bg-[#0a1628] text-white hover:bg-[#1e3a5f]'}`}>
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
