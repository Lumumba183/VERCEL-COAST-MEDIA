import { NextRequest, NextResponse } from 'next/server';
import { clerkClient } from '@clerk/nextjs/server';
import { getServiceClient } from '@/lib/supabase';
import { authorizeArea } from '@/lib/data';

export const dynamic = 'force-dynamic';

async function requireAdmin() {
  const auth = await authorizeArea('users');
  // User management is admin-only per the deployment guide
  if (!auth.authorized || auth.role !== 'admin') return null;
  return auth;
}

function makeUsername(email: string): string {
  const prefix = email.split('@')[0].replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 20) || 'user';
  return `${prefix}${Math.floor(1000 + Math.random() * 9000)}`;
}

function makeTempPassword(): string {
  // Format per internal Clerk guide: Coast@<random>!X7
  return `Coast@${Math.random().toString(36).slice(2, 8)}${Math.floor(1000 + Math.random() * 9000)}!X7`;
}

export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const supabase = getServiceClient();
  const { data, error } = await supabase.from('app_users').select('*').order('created_at');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data || []);
}

/**
 * POST — create a staff account.
 * 1. Creates the user in Clerk (username/firstName/lastName are REQUIRED by
 *    this Clerk instance — missing any causes "missing data" / form_data_missing).
 * 2. Inserts the role row into Supabase app_users (source of truth for roles).
 * Returns the generated temporary password for the admin to share securely.
 */
export async function POST(req: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const email = String(body.email || '').trim();
  const fullName = String(body.full_name || '').trim();
  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'A valid email is required' }, { status: 400 });
  }
  if (!fullName) {
    return NextResponse.json({ error: 'full_name is required' }, { status: 400 });
  }
  const role = ['admin', 'editor', 'user'].includes(body.role) ? body.role : 'user';
  const areas = Array.isArray(body.allowed_areas) ? body.allowed_areas : [];

  // Split full name (Clerk instance requires firstName AND lastName)
  const parts = fullName.split(/\s+/);
  const firstName = parts[0] || 'User';
  const lastName = parts.slice(1).join(' ') || 'Coast';
  const tempPassword = makeTempPassword();

  // 1. Create in Clerk
  let clerkUser;
  try {
    const client = await clerkClient();
    clerkUser = await client.users.createUser({
      emailAddress: [email],
      username: makeUsername(email),
      password: tempPassword,
      firstName,
      lastName,
      skipPasswordChecks: true,
    });
  } catch (err) {
    const e = err as { status?: number; errors?: { code?: string; message?: string }[]; message?: string };
    const code = e.errors?.[0]?.code;
    const msg = e.errors?.[0]?.message || e.message || 'Clerk user creation failed';
    if (e.status === 409 || code === 'form_identifier_exists') {
      return NextResponse.json(
        { error: 'This email is already registered in Clerk. Use a different email or delete the existing Clerk user first.' },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: `Clerk error: ${msg}` }, { status: 422 });
  }

  // 2. Insert role row in Supabase
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from('app_users')
    .upsert(
      { id: clerkUser.id, email, full_name: fullName, role, allowed_areas: areas },
      { onConflict: 'email' }
    )
    .select()
    .single();
  if (error) {
    // Roll back the Clerk user so the two stores stay in sync
    try {
      const client = await clerkClient();
      await client.users.deleteUser(clerkUser.id);
    } catch { /* best effort */ }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ...data, temp_password: tempPassword }, { status: 201 });
}

// PATCH — update role / areas / name in app_users
export async function PATCH(req: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id, ...fields } = await req.json();
  if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 });
  delete fields.created_at;
  delete fields.id;
  delete fields.email;

  const supabase = getServiceClient();
  const { data, error } = await supabase.from('app_users').update(fields).eq('id', id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// DELETE — removes from Clerk first, then Supabase (keeps stores in sync)
export async function DELETE(req: NextRequest) {
  const auth = await requireAdmin();
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const id = req.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 });
  if (id === auth.userId) {
    return NextResponse.json({ error: 'You cannot delete your own account' }, { status: 400 });
  }

  if (id.startsWith('user_')) {
    try {
      const client = await clerkClient();
      await client.users.deleteUser(id);
    } catch {
      // If Clerk deletion fails (user doesn't exist), continue with Supabase
    }
  }

  const supabase = getServiceClient();
  const { error } = await supabase.from('app_users').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
