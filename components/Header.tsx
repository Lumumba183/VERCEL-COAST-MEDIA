'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  Home, Newspaper, CalendarDays, Radio, Tv, Megaphone, Info, Menu, X,
  PenSquare, PlayCircle, Search, MessageCircle,
} from 'lucide-react';
import { WHATSAPP_URL } from '@/lib/utils';

const NAV = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/news', label: 'News', icon: Newspaper },
  { href: '/schedule', label: 'Schedule', icon: CalendarDays },
  { href: '/listen', label: 'Radio', icon: Radio },
  { href: '/tv', label: 'TV Coast', icon: Tv },
  { href: '/advertise', label: 'Advertise', icon: Megaphone },
  { href: '/about', label: 'About', icon: Info },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [today, setToday] = useState('');

  useEffect(() => {
    setToday(
      new Date().toLocaleDateString('en-KE', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    );
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="sticky top-0 z-50 shadow-lg">
      {/* Top utility bar */}
      <div className="bg-coast-navy text-white/80 text-xs">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-8">
          <span>{today}</span>
          <div className="flex items-center gap-3">
            <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="hover:text-white flex items-center gap-1">
              <MessageCircle size={12} /> WhatsApp
            </a>
            <Link href="/admin" className="hover:text-white">Staff Login</Link>
          </div>
        </div>
      </div>

      {/* Main bar */}
      <div className="bg-coast-navy border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="The Coast Media Group" className="h-14 w-14 rounded-full object-cover shadow-md ring-2 ring-white/25" />
            <span className="leading-tight">
              <span className="block text-white font-extrabold text-xl tracking-tight">The Coast</span>
              <span className="block text-coast-gold text-[10px] font-bold tracking-[0.3em]">MEDIA GROUP</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/report"
              className="px-4 py-2 rounded-lg border border-white/30 text-white text-sm font-semibold hover:bg-white/10 transition flex items-center gap-2"
            >
              <PenSquare size={15} /> Submit Story
            </Link>
            <Link
              href="/advertise"
              className="px-4 py-2 rounded-lg bg-coast-gold text-coast-navy text-sm font-bold hover:brightness-110 transition flex items-center gap-2"
            >
              <Megaphone size={15} /> Advertise
            </Link>
            <Link
              href="/listen"
              className="px-4 py-2 rounded-lg bg-coast-red text-white text-sm font-bold hover:brightness-110 transition flex items-center gap-2"
            >
              <PlayCircle size={15} /> Listen Live
            </Link>
          </div>

          <button
            className="md:hidden text-white p-2"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Nav bar */}
      <nav className="bg-coast-navy-light">
        <div className="max-w-7xl mx-auto px-4 hidden md:flex items-center">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold transition border-b-2 ${
                  active
                    ? 'text-coast-gold border-coast-gold'
                    : 'text-white/85 border-transparent hover:text-white'
                }`}
              >
                <Icon size={15} /> {label}
              </Link>
            );
          })}
          <div className="ml-auto py-2">
            <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-1.5 text-white/60 text-sm">
              <Search size={14} />
              <input
                placeholder="Search news..."
                className="bg-transparent outline-none placeholder-white/50 text-white w-36"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const q = (e.target as HTMLInputElement).value.trim();
                    if (q) window.location.href = `/news?q=${encodeURIComponent(q)}`;
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden px-4 pb-4 space-y-1">
            {NAV.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/90 hover:bg-white/10 font-semibold"
              >
                <Icon size={16} /> {label}
              </Link>
            ))}
            <div className="flex gap-2 pt-2">
              <Link href="/report" className="flex-1 text-center px-3 py-2.5 rounded-lg border border-white/30 text-white text-sm font-semibold">
                Submit Story
              </Link>
              <Link href="/listen" className="flex-1 text-center px-3 py-2.5 rounded-lg bg-coast-red text-white text-sm font-bold">
                Listen Live
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
