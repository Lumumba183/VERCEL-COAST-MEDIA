'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser, UserButton } from '@clerk/nextjs';
import {
  LayoutDashboard, Newspaper, Radio, Tv, BookOpen, Inbox, Users, Settings,
  ChevronLeft
} from 'lucide-react';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/articles', label: 'Articles', icon: Newspaper },
  { href: '/admin/schedule', label: 'Schedule', icon: Radio },
  { href: '/admin/brief', label: 'Brief Slider', icon: Inbox },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useUser();

  return (
    <div className="flex min-h-screen bg-[#f8f9fa]">
      {/* Sidebar */}
      <aside className="w-[260px] bg-[#0a1628] min-h-screen fixed left-0 top-0 p-6 text-white hidden lg:block">
        <Link href="/" className="flex items-center gap-3 no-underline mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-[#0066cc] to-[#00a8a8] rounded-lg flex items-center justify-center text-white font-black text-lg">
            C
          </div>
          <div>
            <h1 className="text-white text-lg font-black leading-none">The Coast</h1>
            <span className="text-[#c9a227] text-[10px] uppercase tracking-wider font-semibold">Admin</span>
          </div>
        </Link>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all no-underline ${
                  isActive
                    ? 'bg-white/10 text-[#c9a227]'
                    : 'text-white/70 hover:bg-white/10 hover:text-[#c9a227]'
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-8 pt-6 border-t border-white/10">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-white/70 hover:bg-white/10 hover:text-[#c9a227] transition-all no-underline">
            <ChevronLeft size={18} /> View Site
          </Link>
          <div className="px-4 py-3 flex items-center gap-3">
            <UserButton afterSignOutUrl="/" />
            <span className="text-sm text-white/70">{user?.primaryEmailAddress?.emailAddress}</span>
          </div>
        </div>
      </aside>

      {/* Mobile sidebar toggle + main content */}
      <main className="flex-1 lg:ml-[260px] p-6 lg:p-10">
        {children}
      </main>
    </div>
  );
}
