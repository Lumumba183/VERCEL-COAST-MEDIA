import { NextRequest, NextResponse } from 'next/server';
import { getServiceClient } from '@/lib/supabase';
import { authorizeArea } from '@/lib/data';

export const dynamic = 'force-dynamic';

async function requireAdmin() {
  const auth = await authorizeArea('users');
  // User management is admin-only per the deployment guide
  if (!auth.authorized || auth.role !== 'admin') return null;
  return auth;
}

export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const supabase = getServiceClient();
  const { data, error } = await supabase.from('app_users').select('*').order('created_at');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data || []);
}

// POST — create staff account row (they sign in via Clerk afterwards;
// the email match binds their Clerk id on first admin access)
export async function POST(req: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  if (!body.email) return NextResponse.json({ error: 'email is required' }, { status: 400 });

  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from('app_users')
    .upsert(
      {
        id: body.id || `pending:${body.email}`,
        email: body.email,
        full_name: body.full_name || '',
        role: ['admin', 'editor', 'user'].includes(body.role) ? body.role : 'user',
        allowed_areas: Array.isArray(body.allowed_areas) ? body.allowed_areas : [],
      },
      { onConflict: 'email' }
    )
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

// PATCH — update role / areas / name
export async function PATCH(req: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id, ...fields } = await req.json();
  if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 });
  delete fields.created_at;
  delete fields.id;

  const supabase = getServiceClient();
  const { data, error } = await supabase.from('app_users').update(fields).eq('id', id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(req: NextRequest) {
  const auth = await requireAdmin();
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const id = req.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 });
  if (id === auth.userId) {
    return NextResponse.json({ error: 'You cannot delete your own account' }, { status: 400 });
  }

  const supabase = getServiceClient();
  const { error } = await supabase.from('app_users').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
