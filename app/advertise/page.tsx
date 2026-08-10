'use client';

import { useState } from 'react';
import { Megaphone, Radio, Tv, Globe, CheckCircle2, Loader2 } from 'lucide-react';
import { WHATSAPP_URL } from '@/lib/utils';

const PACKAGES = [
  {
    icon: Radio,
    name: 'Radio Spots',
    price: 'From KES 15,000',
    features: ['30-second spot on Radio Coast', 'Prime drive-time slots', 'Live presenter mentions', 'Production assistance'],
  },
  {
    icon: Globe,
    name: 'Digital Banners',
    price: 'From KES 25,000',
    features: ['Homepage leaderboard banner', 'Article page placements', 'Sponsored news features', 'Monthly performance report'],
  },
  {
    icon: Tv,
    name: 'Coast TV',
    price: 'From KES 40,000',
    features: ['Pre-roll video ads', 'Sponsored segments', 'Product placement', 'YouTube channel reach'],
  },
];

export default function AdvertisePage() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('sending');
    setErrorMsg('');
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      name: fd.get('name'),
      email: fd.get('email'),
      phone: fd.get('phone'),
      subject: `Advertising Enquiry: ${fd.get('package') || 'General'}`,
      location: fd.get('company'),
      message: fd.get('message'),
    };
    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Submission failed');
      }
      setStatus('sent');
      form.reset();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Submission failed');
      setStatus('error');
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 mt-10">
      <div className="text-center mb-10">
        <span className="inline-flex w-14 h-14 rounded-2xl bg-coast-gold text-coast-navy items-center justify-center mb-4">
          <Megaphone size={26} />
        </span>
        <h1 className="text-3xl font-extrabold text-coast-navy">Advertise With Us</h1>
        <p className="text-gray-500 mt-2 max-w-xl mx-auto">
          Reach over 2 million listeners and readers across the Kenyan coast — on radio, online and on TV.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {PACKAGES.map(({ icon: Icon, name, price, features }) => (
          <div key={name} className="bg-white rounded-2xl shadow-sm p-7 hover:shadow-lg transition">
            <span className="w-12 h-12 rounded-xl bg-coast-navy text-coast-gold flex items-center justify-center mb-4">
              <Icon size={22} />
            </span>
            <h2 className="font-bold text-coast-navy text-lg">{name}</h2>
            <p className="text-coast-red font-extrabold mt-1 mb-4">{price}</p>
            <ul className="space-y-2 text-sm text-gray-600">
              {features.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <CheckCircle2 size={15} className="text-emerald-500 mt-0.5 shrink-0" /> {f}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8 items-start">
        <div className="bg-coast-navy rounded-2xl p-8 text-white">
          <h2 className="font-extrabold text-2xl mb-4">Why advertise with The Coast?</h2>
          <ul className="space-y-3 text-white/80 text-sm">
            <li>• 98.7 FM reaches Mombasa, Kilifi, Kwale, Malindi and Lamu</li>
            <li>• Growing digital readership across Kenya and the diaspora</li>
            <li>• Trusted local brand with deep community roots</li>
            <li>• Flexible packages for SMEs and corporates alike</li>
          </ul>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 bg-emerald-500 text-white font-bold px-6 py-3 rounded-full mt-6 hover:brightness-110 transition"
          >
            Chat with Sales on WhatsApp
          </a>
        </div>

        {status === 'sent' ? (
          <div className="bg-white rounded-2xl shadow-sm p-10 text-center">
            <CheckCircle2 size={52} className="mx-auto text-emerald-500 mb-4" />
            <h2 className="font-bold text-coast-navy text-xl mb-2">Enquiry sent!</h2>
            <p className="text-gray-500">Our sales team will get back to you within one business day.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-7 space-y-4">
            <h2 className="font-bold text-coast-navy text-lg">Request a Media Kit</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <input name="name" required placeholder="Contact person *" className="border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-coast-blue" />
              <input name="company" placeholder="Company / Organisation" className="border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-coast-blue" />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <input name="email" type="email" required placeholder="Email *" className="border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-coast-blue" />
              <input name="phone" placeholder="Phone" className="border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-coast-blue" />
            </div>
            <select name="package" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-coast-blue text-gray-600">
              <option value="">Interested package…</option>
              <option>Radio Spots</option>
              <option>Digital Banners</option>
              <option>Coast TV</option>
              <option>Custom / Multi-channel</option>
            </select>
            <textarea name="message" required rows={4} placeholder="Tell us about your campaign goals *" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-coast-blue" />
            {status === 'error' && (
              <p className="text-sm text-coast-red bg-red-50 rounded-lg px-4 py-2.5">{errorMsg}</p>
            )}
            <button
              type="submit"
              disabled={status === 'sending'}
              className="w-full bg-coast-navy text-white font-bold py-3.5 rounded-xl hover:brightness-125 transition flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {status === 'sending' ? <><Loader2 size={18} className="animate-spin" /> Sending…</> : 'Send Enquiry'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
