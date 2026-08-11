import { NextResponse } from 'next/server';
import { getServiceClient } from '@/lib/supabase';
import { authorizeArea } from '@/lib/data';

export const dynamic = 'force-dynamic';

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

/**
 * GET — admin analytics summary:
 *   live            visitors active in the last 5 minutes
 *   today / week / month   unique visitors in that period
 *   viewsToday / viewsWeek / viewsMonth   total page views
 *   daily[]         last 14 days: { date, visitors, views }
 *   topPages[]      most viewed paths in the last 7 days
 */
export async function GET() {
  const auth = await authorizeArea('articles'); // any staff role can view analytics
  if (!auth.authorized) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const supabase = getServiceClient();
  const now = new Date();
  const fiveMinAgo = new Date(now.getTime() - 5 * 60 * 1000).toISOString();
  const todayStart = startOfDay(now).toISOString();
  const weekStart = startOfDay(new Date(now.getTime() - 6 * 86400000)).toISOString();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const fourteenDaysAgo = startOfDay(new Date(now.getTime() - 13 * 86400000)).toISOString();

  const uniq = (rows: { visitor_id: string }[]) => new Set(rows.map((r) => r.visitor_id)).size;

  const [liveRes, todayRes, weekRes, monthRes, chartRes] = await Promise.all([
    supabase.from('page_views').select('visitor_id').gte('last_seen', fiveMinAgo),
    supabase.from('page_views').select('visitor_id').gte('created_at', todayStart),
    supabase.from('page_views').select('visitor_id').gte('created_at', weekStart),
    supabase.from('page_views').select('visitor_id').gte('created_at', monthStart),
    supabase
      .from('page_views')
      .select('visitor_id, path, created_at')
      .gte('created_at', fourteenDaysAgo)
      .order('created_at', { ascending: false })
      .limit(5000),
  ]);

  const chartRows = chartRes.data || [];

  // 14-day daily series
  const days: { date: string; visitors: number; views: number }[] = [];
  for (let i = 13; i >= 0; i--) {
    const d = startOfDay(new Date(now.getTime() - i * 86400000));
    const key = d.toISOString().slice(0, 10);
    const rows = chartRows.filter((r) => r.created_at.slice(0, 10) === key);
    days.push({
      date: key,
      visitors: uniq(rows),
      views: rows.length,
    });
  }

  // Top pages (last 14 days window of rows we already have)
  const pageCounts = new Map<string, number>();
  for (const r of chartRows) pageCounts.set(r.path, (pageCounts.get(r.path) || 0) + 1);
  const topPages = [...pageCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([path, views]) => ({ path, views }));

  return NextResponse.json({
    live: uniq(liveRes.data || []),
    today: uniq(todayRes.data || []),
    week: uniq(weekRes.data || []),
    month: uniq(monthRes.data || []),
    viewsToday: (todayRes.data || []).length,
    viewsWeek: (weekRes.data || []).length,
    viewsMonth: (monthRes.data || []).length,
    daily: days,
    topPages,
  });
}
