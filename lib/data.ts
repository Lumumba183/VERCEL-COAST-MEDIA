import { getAnonClient, getServiceClient } from './supabase';
import type { Article, BriefItem, ScheduleItem } from '@/types';

// ---------- Public read helpers (server components) ----------

export async function getArticles(opts: {
  category?: string;
  featured?: boolean;
  limit?: number;
  q?: string;
} = {}): Promise<Article[]> {
  try {
    const supabase = getAnonClient();
    let query = supabase
      .from('articles')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false });
    if (opts.category) query = query.eq('category', opts.category);
    if (opts.featured !== undefined) query = query.eq('featured', opts.featured);
    if (opts.q) query = query.or(`title.ilike.%${opts.q}%,excerpt.ilike.%${opts.q}%`);
    if (opts.limit) query = query.limit(opts.limit);
    const { data, error } = await query;
    if (error) return [];
    return (data as Article[]) || [];
  } catch {
    return [];
  }
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  try {
    const supabase = getAnonClient();
    // Only compare id when the param is a UUID — PostgREST rejects
    // non-UUID values against a uuid column with error 22P02 (HTTP 400).
    const isUuid = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(slug);
    let query = supabase.from('articles').select('*');
    query = isUuid
      ? query.or(`slug.eq.${slug},id.eq.${slug}`)
      : query.eq('slug', slug);
    const { data } = await query.single();
    return (data as Article) || null;
  } catch {
    return null;
  }
}

export async function getSchedule(day?: string): Promise<ScheduleItem[]> {
  try {
    const supabase = getAnonClient();
    let query = supabase.from('schedule').select('*').order('start_time');
    if (day) query = query.eq('day', day);
    const { data, error } = await query;
    if (error) return [];
    return (data as ScheduleItem[]) || [];
  } catch {
    return [];
  }
}

export async function getSettings(): Promise<Record<string, string>> {
  try {
    const supabase = getAnonClient();
    const { data, error } = await supabase.from('settings').select('*');
    if (error) return {};
    const map: Record<string, string> = {};
    (data || []).forEach((row: { key: string; value: string }) => {
      map[row.key] = row.value;
    });
    return map;
  } catch {
    return {};
  }
}

export async function getBriefItems(): Promise<BriefItem[]> {
  try {
    const supabase = getAnonClient();
    const { data, error } = await supabase
      .from('brief_items')
      .select('*')
      .eq('active', true)
      .order('position');
    if (error) return [];
    return (data as BriefItem[]) || [];
  } catch {
    return [];
  }
}

// ---------- Admin authorization helper (API routes) ----------

export interface AuthResult {
  authorized: boolean;
  userId: string | null;
  role: string | null;
  areas: string[];
}

/**
 * Authorizes an admin-area request: requires a signed-in Clerk user who
 * exists in app_users with role admin/editor (or matches ADMIN_EMAIL).
 * `area` is checked against allowed_areas unless role is admin.
 */
export async function authorizeArea(area: string): Promise<AuthResult> {
  const deny: AuthResult = { authorized: false, userId: null, role: null, areas: [] };
  try {
    const { auth, currentUser } = await import('@clerk/nextjs/server');
    const { userId } = await auth();
    if (!userId) return deny;

    const supabase = getServiceClient();
    const { data } = await supabase
      .from('app_users')
      .select('*')
      .or(`id.eq.${userId}`)
      .maybeSingle();

    let role = data?.role as string | null;
    let areas = (data?.allowed_areas as string[]) || [];

    if (!data) {
      // Fallback: match by email (covers users added by email before first login)
      const user = await currentUser();
      const email = user?.emailAddresses?.[0]?.emailAddress;
      if (email) {
        const { data: byEmail } = await supabase
          .from('app_users')
          .select('*')
          .eq('email', email)
          .maybeSingle();
        if (byEmail) {
          role = byEmail.role;
          areas = byEmail.allowed_areas || [];
          // Bind Clerk id for future lookups
          await supabase.from('app_users').update({ id: userId }).eq('email', email);
        } else if (process.env.ADMIN_EMAIL && email === process.env.ADMIN_EMAIL) {
          // Bootstrap: ADMIN_EMAIL becomes admin automatically
          role = 'admin';
          areas = ['all'];
          await supabase.from('app_users').upsert({
            id: userId,
            email,
            full_name: user?.fullName || '',
            role: 'admin',
            allowed_areas: ['all'],
          });
        }
      }
    }

    if (!role || (role !== 'admin' && role !== 'editor')) return { ...deny, userId };
    const authorized = role === 'admin' || areas.includes('all') || areas.includes(area);
    return { authorized, userId, role, areas };
  } catch {
    return deny;
  }
}
