import { NextRequest, NextResponse } from 'next/server';
import { getServiceClient } from '@/lib/supabase';
import { authorizeArea } from '@/lib/data';

export const dynamic = 'force-dynamic';

const PLACEMENTS = ['leaderboard', 'sidebar', 'article-bottom'];

// GET — public: active adverts within their date window; ?all=1: admin sees everything
export async function GET(req: NextRequest) {
  const supabase = getServiceClient();
  const wantAll = req.nextUrl.searchParams.get('all') === '1';
  if (wantAll) {
    const auth = await authorizeArea('adverts');
    if (!auth.authorized) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { data, error } = await supabase.from('adverts').select('*').order('created_at', { ascending: false });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data || []);
  }
  const today = new Date().toISOString().slice(0, 10);
  const { data, error } = await supabase
    .from('adverts')
    .select('id, title, image_url, link_url, placement')
    .eq('active', true)
    .lte('start_date', today)
    .gte('end_date', today);
  if (error) return NextResponse.json([]);
  return NextResponse.json(data || []);
}

// POST — admin: create advert. Body may include `days` (number) instead of end_date.
export async function POST(req: NextRequest) {
  const auth = await authorizeArea('adverts');
  if (!auth.authorized) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const title = String(body.title || '').trim();
  const clientName = String(body.client_name || '').trim();
  const imageUrl = String(body.image_url || '').trim();
  const placement = PLACEMENTS.includes(body.placement) ? body.placement : 'sidebar';
  if (!title || !clientName || !imageUrl) {
    return NextResponse.json({ error: 'Title, client name and image are required.' }, { status: 400 });
  }

  const start = /^\d{4}-\d{2}-\d{2}$/.test(body.start_date || '')
    ? body.start_date
    : new Date().toISOString().slice(0, 10);
  let end = /^\d{4}-\d{2}-\d{2}$/.test(body.end_date || '') ? body.end_date : null;
  if (!end) {
    const days = Math.min(Math.max(parseInt(body.days, 10) || 30, 1), 365);
    const d = new Date(start);
    d.setDate(d.getDate() + days);
    end = d.toISOString().slice(0, 10);
  }

  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from('adverts')
    .insert({
      title,
      client_name: clientName,
      client_contact: body.client_contact ? String(body.client_contact).slice(0, 255) : null,
      image_url: imageUrl,
      link_url: body.link_url ? String(body.link_url).slice(0, 500) : null,
      placement,
      start_date: start,
      end_date: end,
      active: body.active !== false,
      notes: body.notes ? String(body.notes).slice(0, 1000) : null,
    })
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// PATCH — admin: update any fields (toggle active, extend dates, swap image…)
export async function PATCH(req: NextRequest) {
  const auth = await authorizeArea('adverts');
  if (!auth.authorized) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const id = String(body.id || '');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  const updates: Record<string, unknown> = {};
  for (const key of ['title', 'client_name', 'client_contact', 'image_url', 'link_url', 'notes', 'start_date', 'end_date']) {
    if (body[key] !== undefined) updates[key] = body[key];
  }
  if (body.placement !== undefined && PLACEMENTS.includes(body.placement)) updates.placement = body.placement;
  if (body.active !== undefined) updates.active = body.active === true;

  const supabase = getServiceClient();
  const { error } = await supabase.from('adverts').update(updates).eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

// DELETE — admin: remove advert permanently
export async function DELETE(req: NextRequest) {
  const auth = await authorizeArea('adverts');
  if (!auth.authorized) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const id = req.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  const supabase = getServiceClient();
  const { error } = await supabase.from('adverts').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
