import Link from 'next/link';
import { CONTACT_EMAIL, CONTACT_PHONE, WHATSAPP_URL, SOCIAL_LINKS } from '@/lib/utils';

function TikTokIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
}

function FacebookIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.09 10.13 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.8-4.7 4.54-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.5c-1.5 0-1.96.93-1.96 1.89v2.26h3.32l-.53 3.49h-2.8V24C19.62 23.1 24 18.1 24 12.07z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="bg-coast-navy text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-3 mb-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="The Coast Media Group" className="h-14 w-14 rounded-full object-cover shadow-md" />
            <span className="leading-tight">
              <span className="block font-extrabold text-xl">The Coast</span>
              <span className="block text-coast-gold text-[10px] font-bold tracking-[0.3em]">MEDIA GROUP</span>
            </span>
          </div>
          <p className="text-white/60 text-sm leading-relaxed">
            Kenya&apos;s leading coastal news, radio and TV platform — informing, educating and entertaining the coast and beyond.
          </p>
          <div className="flex items-center gap-3 mt-5">
            <a
              href={SOCIAL_LINKS.tiktok}
              target="_blank"
              rel="noreferrer"
              aria-label="Follow us on TikTok"
              className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-coast-gold hover:text-coast-navy transition"
            >
              <TikTokIcon />
            </a>
            <a
              href={SOCIAL_LINKS.facebook}
              target="_blank"
              rel="noreferrer"
              aria-label="Follow us on Facebook"
              className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-coast-gold hover:text-coast-navy transition"
            >
              <FacebookIcon />
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-bold mb-4 text-coast-gold">Sections</h4>
          <ul className="space-y-2 text-sm text-white/70">
            <li><Link href="/news" className="hover:text-white">News</Link></li>
            <li><Link href="/listen" className="hover:text-white">Radio Coast</Link></li>
            <li><Link href="/tv" className="hover:text-white">TV Coast</Link></li>
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
