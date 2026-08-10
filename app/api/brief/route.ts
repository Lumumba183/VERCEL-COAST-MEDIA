import { NextRequest, NextResponse } from 'next/server';
import { getServiceClient } from '@/lib/supabase';
import { authorizeArea } from '@/lib/data';

export const dynamic = 'force-dynamic';

// GET — public active items; ?all=1 for admin (includes inactive)
export async function GET(req: NextRequest) {
  const supabase = getServiceClient();
  const wantAll = req.nextUrl.searchParams.get('all') === '1';
  if (wantAll) {
    const auth = await authorizeArea('brief');
    if (!auth.authorized) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  let query = supabase.from('brief_items').select('*').order('position');
  if (!wantAll) query = query.eq('active', true);
  const { data, error } = await query;
  if (error) return NextResponse.json([]);
  return NextResponse.json(data || []);
}

// POST — admin: add manual item, or { autofill: true } to seed from latest articles
export async function POST(req: NextRequest) {
  const auth = await authorizeArea('brief');
  if (!auth.authorized) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const supabase = getServiceClient();

  if (body.autofill) {
    const { data: articles } = await supabase
      .from('articles')
      .select('id, title')
      .eq('published', true)
      .order('created_at', { ascending: false })
      .limit(5);
    if (!articles || articles.length === 0) {
      return NextResponse.json({ error: 'No published articles to auto-fill from' }, { status: 400 });
    }
    const { data: maxPos } = await supabase
      .from('brief_items')
      .select('position')
      .order('position', { ascending: false })
      .limit(1)
      .maybeSingle();
    let pos = (maxPos?.position ?? -1) + 1;
    const rows = articles.map((a) => ({ text: a.title, article_id: a.id, position: pos++, active: true }));
    const { data, error } = await supabase.from('brief_items').insert(rows).select();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data, { status: 201 });
  }

  if (!body.text) return NextResponse.json({ error: 'text is required' }, { status: 400 });
  const { data: maxPos } = await supabase
    .from('brief_items')
    .select('position')
    .order('position', { ascending: false })
    .limit(1)
    .maybeSingle();

  const { data, error } = await supabase
    .from('brief_items')
    .insert({
      text: String(body.text).slice(0, 300),
      article_id: body.article_id || null,
      position: (maxPos?.position ?? -1) + 1,
      active: body.active !== false,
    })
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

// PATCH — update text/active/position, or { order: [ids] } to reorder
export async function PATCH(req: NextRequest) {
  const auth = await authorizeArea('brief');
  if (!auth.authorized) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const supabase = getServiceClient();

  if (Array.isArray(body.order)) {
    for (let i = 0; i < body.order.length; i++) {
      await supabase.from('brief_items').update({ position: i }).eq('id', body.order[i]);
    }
    return NextResponse.json({ ok: true });
  }

  const { id, ...fields } = body;
  if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 });
  delete fields.created_at;

  const { data, error } = await supabase.from('brief_items').update(fields).eq('id', id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(req: NextRequest) {
  const auth = await authorizeArea('brief');
  if (!auth.authorized) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const id = req.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 });

  const supabase = getServiceClient();
  const { error } = await supabase.from('brief_items').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
