import { getServiceClient } from './supabase';
import type { AppUser } from '@/types';

export interface Identity {
  userId: string;
  email: string;
  appUser: AppUser | null;
  isStaff: boolean;
  isAdmin: boolean;
  areas: string[];
}

/**
 * Resolves the signed-in Clerk user against the app_users table.
 * - Binds Clerk id to pre-provisioned email rows on first login.
 * - Bootstraps ADMIN_EMAIL as full admin automatically.
 */
export async function getIdentity(): Promise<Identity | null> {
  try {
    const { auth, currentUser } = await import('@clerk/nextjs/server');
    const { userId } = await auth();
    if (!userId) return null;

    const user = await currentUser();
    const email = user?.emailAddresses?.[0]?.emailAddress || '';
    const supabase = getServiceClient();

    let { data: appUser } = await supabase
      .from('app_users')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (!appUser && email) {
      const { data: byEmail } = await supabase
        .from('app_users')
        .select('*')
        .eq('email', email)
        .maybeSingle();
      if (byEmail) {
        await supabase.from('app_users').update({ id: userId }).eq('email', email);
        appUser = { ...byEmail, id: userId };
      } else if (process.env.ADMIN_EMAIL && email === process.env.ADMIN_EMAIL) {
        const { data: created } = await supabase
          .from('app_users')
          .upsert({
            id: userId,
            email,
            full_name: user?.fullName || '',
            role: 'admin',
            allowed_areas: ['all'],
          })
          .select()
          .single();
        appUser = created;
      }
    }

    const role = appUser?.role;
    const isStaff = role === 'admin' || role === 'editor';
    const areas = (appUser?.allowed_areas as string[]) || [];
    return {
      userId,
      email,
      appUser: (appUser as AppUser) || null,
      isStaff,
      isAdmin: role === 'admin',
      areas,
    };
  } catch {
    return null;
  }
}

export function canAccess(identity: Identity, area: string): boolean {
  return identity.isAdmin || identity.areas.includes('all') || identity.areas.includes(area);
}
