import { NextRequest, NextResponse } from 'next/server';
import { getServiceClient } from '@/lib/supabase';
import { authorizeArea } from '@/lib/data';

export const dynamic = 'force-dynamic';

export async function GET() {
  const supabase = getServiceClient();
  const { data, error } = await supabase.from('schedule').select('*').order('start_time');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data || []);
}

export async function POST(req: NextRequest) {
  const auth = await authorizeArea('schedule');
  if (!auth.authorized) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  if (!body.day || !body.start_time || !body.end_time || !body.show_name) {
    return NextResponse.json({ error: 'day, start_time, end_time and show_name are required' }, { status: 400 });
  }
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from('schedule')
    .insert({
      day: body.day,
      start_time: body.start_time,
      end_time: body.end_time,
      show_name: body.show_name,
      host: body.host || '',
      description: body.description || '',
    })
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const auth = await authorizeArea('schedule');
  if (!auth.authorized) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id, ...fields } = await req.json();
  if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 });
  delete fields.created_at;

  const supabase = getServiceClient();
  const { data, error } = await supabase.from('schedule').update(fields).eq('id', id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(req: NextRequest) {
  const auth = await authorizeArea('schedule');
  if (!auth.authorized) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const id = req.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 });

  const supabase = getServiceClient();
  const { error } = await supabase.from('schedule').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
