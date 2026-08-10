import { NextRequest, NextResponse } from 'next/server';
import { getServiceClient } from '@/lib/supabase';
import { authorizeArea } from '@/lib/data';

export const dynamic = 'force-dynamic';

// GET — public (stream URL, YouTube channel, tagline are not sensitive)
export async function GET() {
  const supabase = getServiceClient();
  const { data, error } = await supabase.from('settings').select('*');
  if (error) return NextResponse.json({});
  const map: Record<string, string> = {};
  (data || []).forEach((row: { key: string; value: string }) => {
    map[row.key] = row.value;
  });
  return NextResponse.json(map);
}

// PUT — admin: upsert settings { stream_url, youtube_channel_id, ... }
export async function PUT(req: NextRequest) {
  const auth = await authorizeArea('settings');
  if (!auth.authorized) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const allowed = ['stream_url', 'tv_provider', 'youtube_channel_id', 'twitch_channel', 'site_tagline'];
  const rows = Object.entries(body)
    .filter(([k, v]) => allowed.includes(k) && typeof v === 'string')
    .map(([key, value]) => ({ key, value: value as string }));
  if (rows.length === 0) return NextResponse.json({ error: 'No valid settings provided' }, { status: 400 });

  const supabase = getServiceClient();
  const { error } = await supabase.from('settings').upsert(rows);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
