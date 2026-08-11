import { NextRequest, NextResponse } from 'next/server';
import { getServiceClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

/**
 * Lightweight privacy-friendly analytics beacon.
 * POST { vid, path, hb? } — vid is an anonymous random id stored in the
 * visitor's browser localStorage (no cookies, no personal data collected).
 *
 * - Page view  → inserts a row (visitor_id, path, created_at, last_seen)
 * - Heartbeat  → refreshes last_seen on the visitor's latest row so the
 *   "live now" count stays accurate while they keep the tab open.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const vid = typeof body.vid === 'string' ? body.vid.slice(0, 64) : '';
    const path = typeof body.path === 'string' ? body.path.slice(0, 255) : '/';
    const hb = body.hb === true;
    if (!vid || vid.length < 8) return NextResponse.json({ ok: false }, { status: 400 });

    const supabase = getServiceClient();

    // Find the visitor's most recent row
    const { data: latest } = await supabase
      .from('page_views')
      .select('id, path')
      .eq('visitor_id', vid)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    const now = new Date().toISOString();

    if (hb && latest) {
      // Heartbeat: just refresh last_seen on the latest row
      await supabase.from('page_views').update({ last_seen: now }).eq('id', latest.id);
    } else if (latest && latest.path === path && !hb) {
      // Same page re-mount (e.g. React strict mode double-fire): treat as heartbeat
      await supabase.from('page_views').update({ last_seen: now }).eq('id', latest.id);
    } else {
      // Genuine new page view
      await supabase.from('page_views').insert({ visitor_id: vid, path, last_seen: now });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
