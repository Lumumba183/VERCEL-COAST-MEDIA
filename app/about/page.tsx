import { Mail, MapPin, Phone, Target, Eye, Heart } from 'lucide-react';
import { CONTACT_EMAIL, CONTACT_PHONE, WHATSAPP_URL } from '@/lib/utils';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'About Us' };

const TEAM = [
  { name: 'James Ochieng', role: 'Editor-in-Chief' },
  { name: 'Sarah Mwikali', role: 'Head of Radio' },
  { name: 'Baraka Mwaura', role: 'Head of TV Live' },
  { name: 'Grace Wanjiku', role: 'Senior Political Correspondent' },
  { name: 'Brian Otieno', role: 'Sports Editor' },
  { name: 'Amina Hassan', role: 'County News Correspondent' },
];

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 mt-10">
      <h1 className="text-3xl font-extrabold text-newsbooth-navy border-l-4 border-newsbooth-red pl-3 mb-8">About The News Booth</h1>

      <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
        <p className="text-gray-600 leading-relaxed text-lg">
          The News Booth is Kenya&apos;s leading news, radio and TV platform. From our studios in
          Nairobi, we bring breaking news, investigative journalism, vibrant radio programming and compelling
          television to audiences across Nairobi, Kisumu, Machakos, Tana River, Taita-Taveta and Eldoret counties —
          and to Kenyans everywhere online.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-10">
        {[
          { icon: Target, title: 'Our Mission', text: 'To inform, educate and entertain  Kenya with accurate, timely and relevant journalism.' },
          { icon: Eye, title: 'Our Vision', text: 'A well-informed nation where every voice is heard and every story matters.' },
          { icon: Heart, title: 'Our Values', text: 'Accuracy, independence, community and the spirit of the Kenyan coast in everything we do.' },
        ].map(({ icon: Icon, title, text }) => (
          <div key={title} className="bg-white rounded-2xl shadow-sm p-6">
            <span className="w-11 h-11 rounded-xl bg-newsbooth-navy text-newsbooth-accent flex items-center justify-center mb-4">
              <Icon size={20} />
            </span>
            <h2 className="font-bold text-newsbooth-navy mb-2">{title}</h2>
            <p className="text-sm text-gray-500 leading-relaxed">{text}</p>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-extrabold text-newsbooth-navy border-l-4 border-newsbooth-red pl-3 mb-6">Our Team</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
        {TEAM.map((m) => (
          <div key={m.name} className="bg-white rounded-2xl shadow-sm p-6 flex items-center gap-4">
            <span className="w-12 h-12 rounded-full bg-gradient-to-br from-newsbooth-blue to-sky-400 text-white flex items-center justify-center font-extrabold">
              {m.name.split(' ').map((n) => n[0]).join('')}
            </span>
            <div>
              <p className="font-bold text-newsbooth-navy">{m.name}</p>
              <p className="text-sm text-gray-500">{m.role}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-newsbooth-navy rounded-2xl p-8 text-white">
        <h2 className="font-extrabold text-xl mb-5">Get in Touch</h2>
        <div className="grid sm:grid-cols-2 gap-4 text-white/80 text-sm">
          <p className="flex items-center gap-3"><Phone size={16} className="text-newsbooth-accent" /> {CONTACT_PHONE}</p>
          <p className="flex items-center gap-3"><Mail size={16} className="text-newsbooth-accent" /> {CONTACT_EMAIL}</p>
          <p className="flex items-center gap-3"><MapPin size={16} className="text-newsbooth-accent" /> Nairobi, Kenya</p>
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
