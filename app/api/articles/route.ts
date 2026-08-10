import { NextRequest, NextResponse } from 'next/server';
import { getServiceClient } from '@/lib/supabase';
import { authorizeArea } from '@/lib/data';
import { slugify } from '@/lib/utils';

export const dynamic = 'force-dynamic';

// GET /api/articles?all=1 (admin) — public callers get published only via RLS
export async function GET(req: NextRequest) {
  const supabase = getServiceClient();
  const wantAll = req.nextUrl.searchParams.get('all') === '1';
  if (wantAll) {
    const auth = await authorizeArea('articles');
    if (!auth.authorized) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  let query = supabase.from('articles').select('*').order('created_at', { ascending: false });
  if (!wantAll) query = query.eq('published', true);
  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data || []);
}

// POST /api/articles — create
export async function POST(req: NextRequest) {
  const auth = await authorizeArea('articles');
  if (!auth.authorized) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  if (!body.title) return NextResponse.json({ error: 'Title is required' }, { status: 400 });

  const supabase = getServiceClient();
  let slug = body.slug || slugify(body.title);
  // Ensure unique slug
  const { data: existing } = await supabase.from('articles').select('id').eq('slug', slug).maybeSingle();
  if (existing) slug = `${slug}-${Date.now().toString(36)}`;

  const { data, error } = await supabase
    .from('articles')
    .insert({
      title: body.title,
      slug,
      excerpt: body.excerpt || '',
      content: body.content || '',
      category: body.category || 'National News',
      image_url: body.image_url || null,
      author: body.author || 'Coast Editorial',
      featured: !!body.featured,
      published: body.published !== false,
    })
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

// PATCH /api/articles — update { id, ...fields }
export async function PATCH(req: NextRequest) {
  const auth = await authorizeArea('articles');
  if (!auth.authorized) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { id, ...fields } = body;
  if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 });
  delete fields.slug; // slugs are stable
  delete fields.created_at;

  const supabase = getServiceClient();
  const { data, error } = await supabase.from('articles').update(fields).eq('id', id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// DELETE /api/articles?id=...
export async function DELETE(req: NextRequest) {
  const auth = await authorizeArea('articles');
  if (!auth.authorized) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const id = req.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 });

  const supabase = getServiceClient();
  const { error } = await supabase.from('articles').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
