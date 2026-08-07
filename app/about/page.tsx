import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BriefSlider from '@/components/BriefSlider';
import { Award, Users, Globe, Radio, Tv, Newspaper } from 'lucide-react';

export default function AboutPage() {
  const team = [
    { name: 'James Mwangi', role: 'Editor-in-Chief', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop&crop=face' },
    { name: 'Amina Hassan', role: 'Deputy Editor', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face' },
    { name: 'David Ochieng', role: 'Sports Editor', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face' },
    { name: 'Sarah Kimani', role: 'Business Editor', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=face' },
  ];

  return (
    <>
      <Header />
      <BriefSlider />

      <section className="bg-gradient-to-br from-[#0a1628] to-[#1e3a5f] py-20 text-white">
        <div className="max-w-[800px] mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-4 font-[var(--font-heading)]">About The Coast Media Group</h1>
          <p className="text-xl text-white/70">Kenya&apos;s leading coastal media house since 2015</p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-[60px]">
        <div className="max-w-[1000px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="section-title mb-6">Our Mission</h2>
              <p className="text-[#2d3748] leading-relaxed mb-4">
                The Coast Media Group was founded with a singular vision: to amplify the voice of Kenya&apos;s coastal region. 
                From Mombasa to Kilifi, Lamu to Kwale, we bring you the stories that matter most to coastal communities.
              </p>
              <p className="text-[#2d3748] leading-relaxed mb-4">
                We believe in journalism that serves the people — accurate, fair, and deeply rooted in the communities we cover. 
                Our team of experienced reporters, editors, and broadcasters work around the clock to keep you informed.
              </p>
              <p className="text-[#2d3748] leading-relaxed">
                Whether it&apos;s breaking news, investigative reporting, or cultural storytelling, The Coast Media Group 
                is committed to excellence in every story we tell.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Newspaper, value: '500K+', label: 'Monthly Readers' },
                { icon: Radio, value: '50K+', label: 'Radio Listeners' },
                { icon: Tv, value: '100K+', label: 'Video Views' },
                { icon: Globe, value: '8+', label: 'Years of Service' },
              ].map((stat, i) => (
                <div key={i} className="bg-[#f8f9fa] rounded-xl p-6 text-center">
                  <stat.icon size={28} className="mx-auto mb-3 text-[#0066cc]" />
                  <h3 className="text-2xl font-black text-[#0a1628]">{stat.value}</h3>
                  <p className="text-sm text-[#718096]">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-[60px] bg-[#f8f9fa]">
        <div className="max-w-[1000px] mx-auto px-6">
          <h2 className="section-title mb-10 text-center justify-center">Our Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden shadow-md text-center p-6 hover:-translate-y-1 hover:shadow-lg transition-all">
                <img src={member.image} alt={member.name} className="w-24 h-24 rounded-full mx-auto mb-4 object-cover" />
                <h3 className="font-bold text-[#0a1628]">{member.name}</h3>
                <p className="text-sm text-[#718096]">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Awards */}
      <section className="py-[60px]">
        <div className="max-w-[800px] mx-auto px-6 text-center">
          <Award size={48} className="mx-auto mb-4 text-[#c9a227]" />
          <h2 className="section-title justify-center mb-6">Recognition</h2>
          <p className="text-[#2d3748] leading-relaxed">
            Coast Media Group has been recognized for excellence in journalism, winning regional awards 
            for investigative reporting, community engagement, and digital innovation. Our commitment to 
            ethical journalism and community service continues to drive everything we do.
          </p>
        </div>
      </section>

      <Footer />
    </>
  );
}
