import Link from 'next/link';
import { CONTACT_EMAIL, CONTACT_PHONE, WHATSAPP_URL } from '@/lib/utils';

export default function Footer() {
  return (
    <footer className="bg-coast-navy text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-coast-blue to-sky-400 flex items-center justify-center font-extrabold text-xl">
              C
            </span>
            <span className="leading-tight">
              <span className="block font-extrabold text-xl">The Coast</span>
              <span className="block text-coast-gold text-[10px] font-bold tracking-[0.3em]">MEDIA GROUP</span>
            </span>
          </div>
          <p className="text-white/60 text-sm leading-relaxed">
            Kenya&apos;s leading coastal news, radio and TV platform — informing, educating and entertaining the coast and beyond.
          </p>
        </div>

        <div>
          <h4 className="font-bold mb-4 text-coast-gold">Sections</h4>
          <ul className="space-y-2 text-sm text-white/70">
            <li><Link href="/news" className="hover:text-white">News</Link></li>
            <li><Link href="/listen" className="hover:text-white">Radio Coast</Link></li>
            <li><Link href="/tv" className="hover:text-white">Coast TV</Link></li>
            <li><Link href="/schedule" className="hover:text-white">Programme Schedule</Link></li>
            <li><Link href="/report" className="hover:text-white">Submit a Story</Link></li>
            <li><Link href="/advertise" className="hover:text-white">Advertise With Us</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-4 text-coast-gold">Company</h4>
          <ul className="space-y-2 text-sm text-white/70">
            <li><Link href="/about" className="hover:text-white">About Us</Link></li>
            <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
            <li><Link href="/cookies" className="hover:text-white">Cookie Policy</Link></li>
            <li><Link href="/admin" className="hover:text-white">Staff Portal</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-4 text-coast-gold">Contact</h4>
          <ul className="space-y-2 text-sm text-white/70">
            <li>Phone: {CONTACT_PHONE}</li>
            <li>Email: {CONTACT_EMAIL}</li>
            <li>
              <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="hover:text-white">
                WhatsApp Chat
              </a>
            </li>
            <li>Mombasa, Kenya</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 text-center text-xs text-white/50">
          © {new Date().getFullYear()} The Coast Media Group. All rights reserved. Built by NexaFlow Digital.
        </div>
      </div>
    </footer>
  );
}
