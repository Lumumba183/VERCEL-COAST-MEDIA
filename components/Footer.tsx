'use client';

import Link from 'next/link';
import { MapPin, Phone, Mail, Twitter, Facebook, Instagram, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#0a1628] text-white pt-[60px]">
      <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
        {/* Brand */}
        <div className="lg:col-span-2">
          <Link href="/" className="flex items-center gap-3 no-underline mb-4">
            <div className="w-[50px] h-[50px] bg-gradient-to-br from-[#0066cc] to-[#00a8a8] rounded-xl flex items-center justify-center text-white font-black text-2xl">
              C
            </div>
            <div>
              <h1 className="text-white text-2xl font-black leading-none">The Coast</h1>
              <span className="text-[#c9a227] text-[11px] uppercase tracking-[3px] font-semibold">Media Group</span>
            </div>
          </Link>
          <p className="text-white/70 text-sm leading-relaxed my-4">
            Kenya's leading coastal media house, bringing you news, radio, and television from Mombasa, Kilifi, and beyond since 2015.
          </p>
          <div className="flex gap-3">
            <a href="https://x.com/CoastNewspaper" target="_blank" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-white hover:bg-[#c9a227] hover:text-[#0a1628] hover:-translate-y-[3px] transition-all"><Twitter size={16} /></a>
            <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-white hover:bg-[#c9a227] hover:text-[#0a1628] hover:-translate-y-[3px] transition-all"><Facebook size={16} /></a>
            <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-white hover:bg-[#c9a227] hover:text-[#0a1628] hover:-translate-y-[3px] transition-all"><Instagram size={16} /></a>
            <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-white hover:bg-[#c9a227] hover:text-[#0a1628] hover:-translate-y-[3px] transition-all"><Youtube size={16} /></a>
            <a href="https://wa.me/254106216699" target="_blank" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-white hover:bg-[#c9a227] hover:text-[#0a1628] hover:-translate-y-[3px] transition-all"><i className="fab fa-whatsapp"></i></a>
          </div>
        </div>

        {/* Sections */}
        <div>
          <h4 className="text-[#c9a227] text-base font-bold mb-5 font-[var(--font-heading)]">Sections</h4>
          <ul className="list-none">
            {['News', 'Business', 'Sports', 'Education', 'Lifestyle', 'Health'].map((cat) => (
              <li key={cat} className="mb-2.5">
                <Link href={`/news?cat=${cat.toLowerCase()}`} className="text-white/70 no-underline text-sm hover:text-[#c9a227] hover:pl-1 transition-all">
                  {cat}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Media */}
        <div>
          <h4 className="text-[#c9a227] text-base font-bold mb-5 font-[var(--font-heading)]">Media</h4>
          <ul className="list-none">
            <li className="mb-2.5"><Link href="/listen" className="text-white/70 no-underline text-sm hover:text-[#c9a227] hover:pl-1 transition-all">Radio Coast Live</Link></li>
            <li className="mb-2.5"><Link href="/tv" className="text-white/70 no-underline text-sm hover:text-[#c9a227] hover:pl-1 transition-all">Coast TV</Link></li>
            <li className="mb-2.5"><Link href="/epaper" className="text-white/70 no-underline text-sm hover:text-[#c9a227] hover:pl-1 transition-all">E-Paper</Link></li>
            <li className="mb-2.5"><Link href="/advertise" className="text-white/70 no-underline text-sm hover:text-[#c9a227] hover:pl-1 transition-all">Advertise With Us</Link></li>
            <li className="mb-2.5"><Link href="/report" className="text-white/70 no-underline text-sm hover:text-[#c9a227] hover:pl-1 transition-all">Submit a Story</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-[#c9a227] text-base font-bold mb-5 font-[var(--font-heading)]">Contact Us</h4>
          <p className="flex items-center gap-2.5 text-white/70 text-sm mb-3"><MapPin size={16} className="text-[#c9a227] shrink-0" /> Mombasa, Kenya</p>
          <p className="flex items-center gap-2.5 text-white/70 text-sm mb-3"><Phone size={16} className="text-[#c9a227] shrink-0" /> +254 106 216 699</p>
          <p className="flex items-center gap-2.5 text-white/70 text-sm mb-3"><Mail size={16} className="text-[#c9a227] shrink-0" /> support@wedialai.com</p>
          <div className="mt-4 rounded-xl overflow-hidden h-[120px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d255281.19891870286!2d39.58222215!3d-4.03501385!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x184012e78ec26c0b%3A0x50a7c65e0d013c2c!2sMombasa%2C%20Kenya!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s"
              width="100%" height="120" style={{ border: 0 }} allowFullScreen loading="lazy"
            />
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 mt-10 py-5 px-6 text-center text-white/50 text-[13px]">
        <p>&copy; {new Date().getFullYear()} The Coast Media Group. All rights reserved. | <Link href="/privacy" className="text-white/50 hover:text-[#c9a227]">Privacy Policy</Link> | <Link href="/terms" className="text-white/50 hover:text-[#c9a227]">Terms of Use</Link></p>
      </div>
    </footer>
  );
}
