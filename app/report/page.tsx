'use client';

import { useState } from 'react';
import { PenSquare, CheckCircle2, Loader2 } from 'lucide-react';

export default function ReportPage() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('sending');
    setErrorMsg('');
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      name: fd.get('name'),
      email: fd.get('email'),
      phone: fd.get('phone'),
      subject: fd.get('subject'),
      location: fd.get('location'),
      message: fd.get('message'),
    };
    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Submission failed');
      }
      setStatus('sent');
      form.reset();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Submission failed');
      setStatus('error');
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 mt-10">
      <div className="text-center mb-8">
        <span className="inline-flex w-14 h-14 rounded-2xl bg-emerald-600 text-white items-center justify-center mb-4">
          <PenSquare size={26} />
        </span>
        <h1 className="text-3xl font-extrabold text-coast-navy">Submit a Story</h1>
        <p className="text-gray-500 mt-2">
          Seen something newsworthy at the coast? Tip off our news desk — your identity stays confidential.
        </p>
      </div>

      {status === 'sent' ? (
        <div className="bg-white rounded-2xl shadow-sm p-10 text-center">
          <CheckCircle2 size={52} className="mx-auto text-emerald-500 mb-4" />
          <h2 className="font-bold text-coast-navy text-xl mb-2">Story received!</h2>
          <p className="text-gray-500">Thank you — our editors will review your submission shortly.</p>
          <button
            onClick={() => setStatus('idle')}
            className="mt-6 text-coast-blue font-semibold text-sm"
          >
            Submit another story
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-6 md:p-8 space-y-5">
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-coast-navy mb-1.5">Full Name *</label>
              <input name="name" required className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-coast-blue" placeholder="Your name" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-coast-navy mb-1.5">Email *</label>
              <input name="email" type="email" required className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-coast-blue" placeholder="you@example.com" />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-coast-navy mb-1.5">Phone</label>
              <input name="phone" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-coast-blue" placeholder="+254 7XX XXX XXX" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-coast-navy mb-1.5">Location</label>
              <input name="location" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-coast-blue" placeholder="e.g. Mombasa, Likoni" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-coast-navy mb-1.5">Story Subject *</label>
            <input name="subject" required className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-coast-blue" placeholder="Brief headline for your tip" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-coast-navy mb-1.5">Story Details *</label>
            <textarea name="message" required rows={6} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-coast-blue" placeholder="What happened? When? Who is involved? Any photos or videos available?" />
          </div>
          {status === 'error' && (
            <p className="text-sm text-coast-red bg-red-50 rounded-lg px-4 py-2.5">{errorMsg}</p>
          )}
          <button
            type="submit"
            disabled={status === 'sending'}
            className="w-full bg-coast-red text-white font-bold py-3.5 rounded-xl hover:brightness-110 transition flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {status === 'sending' ? <><Loader2 size={18} className="animate-spin" /> Sending…</> : <><PenSquare size={18} /> Send to News Desk</>}
          </button>
        </form>
      )}
    </div>
  );
}
