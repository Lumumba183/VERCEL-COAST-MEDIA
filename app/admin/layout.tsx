import Link from 'next/link';
import { UserButton } from '@clerk/nextjs';
import { getIdentity, canAccess } from '@/lib/admin';
import { LayoutDashboard, Users, ListOrdered, Settings, ShieldAlert, Megaphone } from 'lucide-react';

export const dynamic = 'force-dynamic';

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, area: null },
  { href: '/admin/users', label: 'Users', icon: Users, area: 'users' },
  { href: '/admin/brief', label: 'Brief Slider', icon: ListOrdered, area: 'brief' },
  { href: '/admin/ads', label: 'Adverts', icon: Megaphone, area: 'adverts' },
  { href: '/admin/settings', label: 'Settings', icon: Settings, area: 'settings' },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const identity = await getIdentity();

  if (!identity || !identity.isStaff) {
    return (
      <div className="max-w-lg mx-auto px-4 mt-16">
        <div className="bg-white rounded-2xl shadow-sm p-10 text-center">
          <ShieldAlert size={48} className="mx-auto text-coast-red mb-4" />
          <h1 className="font-extrabold text-coast-navy text-2xl mb-2">Access Denied</h1>
          <p className="text-gray-500 text-sm leading-relaxed">
            {identity
              ? `Signed in as ${identity.email}, but this account has no staff role yet. An administrator must add you in Supabase → app_users (role: admin or editor).`
              : 'Please sign in with a staff account to access the admin panel.'}
          </p>
          <Link href="/" className="inline-block mt-6 text-coast-blue font-semibold text-sm">
            ← Back to homepage
          </Link>
        </div>
      </div>
    );
  }

  const visibleNav = NAV.filter((n) => n.area === null || canAccess(identity, n.area));

  return (
    <div className="max-w-7xl mx-auto px-4 mt-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <aside className="lg:w-60 shrink-0">
          <div className="bg-white rounded-2xl shadow-sm p-5 lg:sticky lg:top-32">
            <div className="flex items-center justify-between mb-5 pb-4 border-b border-gray-100">
              <div>
                <p className="font-extrabold text-coast-navy">Admin Panel</p>
                <p className="text-xs text-gray-400 capitalize">{identity.appUser?.role} · {identity.email}</p>
              </div>
              <UserButton />
            </div>
            <nav className="flex lg:flex-col gap-1 overflow-x-auto">
              {visibleNav.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-gray-600 hover:bg-coast-light hover:text-coast-navy transition whitespace-nowrap"
                >
                  <Icon size={17} /> {label}
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        {/* Content */}
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  );
}
