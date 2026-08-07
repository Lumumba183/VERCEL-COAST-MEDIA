'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useUser, SignInButton, UserButton } from '@clerk/nextjs';
import { Menu, X, Home, Newspaper, Briefcase, Dribbble, GraduationCap, Heart, HeartPulse, MessageSquare, Radio, Tv, BookOpen, Search, Info, Pen, Bullhorn } from 'lucide-react';

const navLinks = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/news?cat=news', label: 'News', icon: Newspaper },
  { href: '/news?cat=business', label: 'Business', icon: Briefcase },
  { href: '/news?cat=sports', label: 'Sports', icon: Dribbble },
  { href: '/news?cat=education', label: 'Education', icon: GraduationCap },
  { href: '/news?cat=lifestyle', label: 'Lifestyle', icon: Heart },
  { href: '/news?cat=health', label: 'Health', icon: HeartPulse },
  { href: '/news?cat=opinion', label: 'Opinion', icon: MessageSquare },
  { href: '/listen', label: 'Radio', icon: Radio },
  { href: '/tv', label: 'Coast TV', icon: Tv },
  { href: '/epaper', label: 'E-Paper', icon: BookOpen },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isSignedIn } = useUser();

  const today = new Date().toLocaleDateString('en-KE', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <header className="bg-[#0a1628] sticky top-0 z-[1000] shadow-lg">
      {/* Top bar */}
      <div className="border-b border-white/10 py-2">
        <div className="max-w-[1400px] mx-auto px-6 flex justify-between items-center">
          <span className="text-white/70 text-[13px]">{today}</span>
          <div className="flex gap-4">
            <a href="https://x.com/CoastNewspaper" target="_blank" className="text-white/70 hover:text-[#c9a227] transition-colors text-sm"><i className="fab fa-x-twitter"></i></a>
            <a href="#" className="text-white/70 hover:text-[#c9a227] transition-colors text-sm"><i className="fab fa-facebook-f"></i></a>
            <a href="#" className="text-white/70 hover:text-[#c9a227] transition-colors text-sm"><i className="fab fa-instagram"></i></a>
            <a href="#" className="text-white/70 hover:text-[#c9a227] transition-colors text-sm"><i className="fab fa-youtube"></i></a>
            <a href="https://wa.me/254106216699" target="_blank" className="text-white/70 hover:text-[#c9a227] transition-colors text-sm"><i className="fab fa-whatsapp"></i></a>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="max-w-[1400px] mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3 no-underline">
          <div className="w-[50px] h-[50px] bg-gradient-to-br from-[#0066cc] to-[#00a8a8] rounded-xl flex items-center justify-center text-white font-black text-2xl font-[var(--font-heading)]">
            C
          </div>
          <div>
            <h1 className="text-white text-[28px] font-black leading-none tracking-tight">The Coast</h1>
            <span className="text-[#c9a227] text-[11px] uppercase tracking-[3px] font-semibold">Media Group</span>
          </div>
        </Link>
        <div className="flex items-center gap-5">
          <Link href="/report" className="hidden sm:inline-flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold text-sm transition-all duration-300 border-2 border-white/30 text-white bg-transparent hover:border-[#c9a227] hover:text-[#c9a227]">
            <Pen size={16} /> Submit Story
          </Link>
          <Link href="/advertise" className="hidden sm:inline-flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold text-sm transition-all duration-300 bg-[#c9a227] text-[#0a1628] hover:-translate-y-0.5 hover:bg-[#b8941f]">
            <Bullhorn size={16} /> Advertise
          </Link>
          <Link href="/listen" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold text-sm transition-all duration-300 bg-[#e63946] text-white hover:-translate-y-0.5 hover:bg-[#c1121f] hover:shadow-lg">
            <Radio size={16} /> Listen Live
          </Link>
          {isSignedIn ? (
            <UserButton afterSignOutUrl="/" />
          ) : (
            <SignInButton mode="modal">
              <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all border border-white/30 text-white bg-transparent hover:border-[#c9a227] hover:text-[#c9a227]">
                Sign In
              </button>
            </SignInButton>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-[#1e3a5f] border-t border-white/5">
        <div className="max-w-[1400px] mx-auto px-4 flex justify-between items-center">
          <button
            className="lg:hidden bg-none border-none text-white text-2xl cursor-pointer py-3"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <ul className={`${mobileOpen ? 'flex' : 'hidden'} lg:flex list-none gap-0 flex-col lg:flex-row absolute lg:relative left-0 right-0 top-full lg:top-auto bg-[#1e3a5f] lg:bg-transparent p-4 lg:p-0`}>
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="flex items-center gap-[5px] text-white/85 no-underline py-3.5 px-3 text-xs font-semibold uppercase tracking-wide transition-all border-b-[3px] border-transparent hover:text-[#c9a227] hover:border-b-[#c9a227] hover:bg-white/5 whitespace-nowrap"
                >
                  <link.icon size={12} /> {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-2 flex-shrink-0 ml-1.5 py-2">
            <input
              type="text"
              placeholder="Search news..."
              className="bg-white/10 border border-white/20 rounded-lg py-2 px-2.5 text-white text-xs w-[130px] outline-none focus:border-[#c9a227] focus:bg-white/15 transition-all"
            />
            <Link href="/about" className="text-white/70 hover:text-[#c9a227] transition-colors"><Info size={16} /></Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
