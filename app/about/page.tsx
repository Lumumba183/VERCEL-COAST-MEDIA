import { Mail, MapPin, Phone, Target, Eye, Heart } from 'lucide-react';
import { CONTACT_EMAIL, CONTACT_PHONE, WHATSAPP_URL } from '@/lib/utils';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'About Us' };

const TEAM = [
  { name: 'Amina Juma', role: 'Managing Editor' },
  { name: 'DJ Kipawa', role: 'Head of Radio' },
  { name: 'Baraka Mwaura', role: 'Head of TV Coast' },
  { name: 'Zawadi Kombo', role: 'Senior Political Correspondent' },
  { name: 'Hassan Salim', role: 'Sports Editor' },
  { name: 'Neema Charo', role: 'County News Correspondent' },
];

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 mt-10">
      <h1 className="text-3xl font-extrabold text-coast-navy border-l-4 border-coast-red pl-3 mb-8">About The Coast Media Group</h1>

      <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
        <p className="text-gray-600 leading-relaxed text-lg">
          The Coast Media Group is Kenya&apos;s leading coastal news, radio and TV platform. From our studios in
          Mombasa, we bring breaking news, investigative journalism, vibrant radio programming and compelling
          television to audiences across Mombasa, Kilifi, Kwale, Tana River, Taita-Taveta and Lamu counties —
          and to coastal Kenyans everywhere online.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-10">
        {[
          { icon: Target, title: 'Our Mission', text: 'To inform, educate and entertain coastal Kenya with accurate, timely and relevant journalism.' },
          { icon: Eye, title: 'Our Vision', text: 'A well-informed coastal region where every voice is heard and every story matters.' },
          { icon: Heart, title: 'Our Values', text: 'Accuracy, independence, community and the spirit of the Kenyan coast in everything we do.' },
        ].map(({ icon: Icon, title, text }) => (
          <div key={title} className="bg-white rounded-2xl shadow-sm p-6">
            <span className="w-11 h-11 rounded-xl bg-coast-navy text-coast-gold flex items-center justify-center mb-4">
              <Icon size={20} />
            </span>
            <h2 className="font-bold text-coast-navy mb-2">{title}</h2>
            <p className="text-sm text-gray-500 leading-relaxed">{text}</p>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-extrabold text-coast-navy border-l-4 border-coast-red pl-3 mb-6">Our Team</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
        {TEAM.map((m) => (
          <div key={m.name} className="bg-white rounded-2xl shadow-sm p-6 flex items-center gap-4">
            <span className="w-12 h-12 rounded-full bg-gradient-to-br from-coast-blue to-sky-400 text-white flex items-center justify-center font-extrabold">
              {m.name.split(' ').map((n) => n[0]).join('')}
            </span>
            <div>
              <p className="font-bold text-coast-navy">{m.name}</p>
              <p className="text-sm text-gray-500">{m.role}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-coast-navy rounded-2xl p-8 text-white">
        <h2 className="font-extrabold text-xl mb-5">Get in Touch</h2>
        <div className="grid sm:grid-cols-2 gap-4 text-white/80 text-sm">
          <p className="flex items-center gap-3"><Phone size={16} className="text-coast-gold" /> {CONTACT_PHONE}</p>
          <p className="flex items-center gap-3"><Mail size={16} className="text-coast-gold" /> {CONTACT_EMAIL}</p>
          <p className="flex items-center gap-3"><MapPin size={16} className="text-coast-gold" /> Mombasa, Kenya</p>
          <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="flex items-center gap-3 hover:text-white">
            <MessageCircleIcon /> WhatsApp Chat
          </a>
        </div>
      </div>
    </div>
  );
}

function MessageCircleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f5b301" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
    </svg>
  );
}
