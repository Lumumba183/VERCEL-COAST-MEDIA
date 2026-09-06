import { NextRequest, NextResponse } from 'next/server';
import { getAnonClient, getServiceClient } from '@/lib/supabase';
import { authorizeArea } from '@/lib/data';

export const dynamic = 'force-dynamic';

// GET — admin only (reports contain personal contact details)
export async function GET() {
  const auth = await authorizeArea('reports');
  if (!auth.authorized) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from('reports')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data || []);
}

// POST — public story submission
export async function POST(req: NextRequest) {
  const body = await req.json();
  if (!body.name || !body.email || !body.subject || !body.message) {
    return NextResponse.json(
      { error: 'name, email, subject and message are required' },
      { status: 400 }
    );
  }
  const supabase = getAnonClient(); // RLS allows public inserts
  const { data, error } = await supabase
    .from('reports')
    .insert({
      name: String(body.name).slice(0, 200),
      email: String(body.email).slice(0, 200),
      phone: body.phone ? String(body.phone).slice(0, 50) : null,
      subject: String(body.subject).slice(0, 300),
      location: body.location ? String(body.location).slice(0, 200) : null,
      message: String(body.message).slice(0, 10000),
    })
    .select('id')
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Send email notification
  try {
    const { Resend } = await import('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: 'The News Booth <onboarding@resend.dev>',
      to: 'info.newsbooth@gmail.com',
      subject: `New Submission: ${body.subject}`,
      html: `
        <h2>New submission from The News Booth website</h2>
        <p><strong>Name:</strong> ${body.name}</p>
        <p><strong>Email:</strong> ${body.email}</p>
        <p><strong>Phone:</strong> ${body.phone || 'N/A'}</p>
        <p><strong>Subject:</strong> ${body.subject}</p>
        <p><strong>Location:</strong> ${body.location || 'N/A'}</p>
        <p><strong>Message:</strong></p>
        <p>${body.message.replace(/\n/g, '<br>')}</p>
      `,
    });
  } catch (e) {
    console.error('Email send failed:', e);
  }

  return NextResponse.json({ ok: true, id: data.id }, { status: 201 });
}

// PATCH — admin: mark reviewed / resolved
export async function PATCH(req: NextRequest) {
  const auth = await authorizeArea('reports');
  if (!auth.authorized) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id, status } = await req.json();
  if (!id || !['new', 'reviewed', 'resolved'].includes(status)) {
    return NextResponse.json({ error: 'id and valid status are required' }, { status: 400 });
  }
  const supabase = getServiceClient();
  const { data, error } = await supabase.from('reports').update({ status }).eq('id', id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// DELETE — admin
export async function DELETE(req: NextRequest) {
  const auth = await authorizeArea('reports');
  if (!auth.authorized) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const id = req.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 });

  const supabase = getServiceClient();
  const { error } = await supabase.from('reports').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
