'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BriefSlider from '@/components/BriefSlider';
import { PaperPlane, CheckCircle, MapPin } from 'lucide-react';

export default function ReportPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.get('name') || 'Anonymous',
          email: formData.get('email') || '',
          title: formData.get('title'),
          message: formData.get('message'),
          anonymous: formData.get('anonymous') === 'on',
          location: formData.get('location'),
        }),
      });
      setSubmitted(true);
      form.reset();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Header />
      <BriefSlider />

      <section className="bg-gradient-to-br from-[#0a1628] to-[#1e3a5f] py-16 text-white">
        <div className="max-w-[800px] mx-auto px-6 text-center">
          <PaperPlane size={48} className="mx-auto mb-4 text-[#c9a227]" />
          <h1 className="text-4xl font-bold mb-3 font-[var(--font-heading)]">Submit a Story</h1>
          <p className="text-lg text-white/70">Have a news tip, photo, or video from your community? Our editorial team reviews every submission.</p>
        </div>
      </section>

      <section className="py-[60px]">
        <div className="max-w-[600px] mx-auto px-6">
          {submitted ? (
            <div className="bg-white rounded-2xl p-10 shadow-lg text-center">
              <CheckCircle size={64} className="mx-auto mb-4 text-[#10b981]" />
              <h2 className="text-2xl font-bold text-[#0a1628] mb-2">Thank You!</h2>
              <p className="text-[#718096] mb-6">Your story has been submitted to our news desk. Our editorial team will review it and get back to you within 24 hours.</p>
              <button onClick={() => setSubmitted(false)} className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold text-sm bg-[#0a1628] text-white hover:bg-[#1e3a5f] transition-all">
                Submit Another Story
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="form-group">
                <label>Your Name (optional)</label>
                <input type="text" name="name" placeholder="Enter your name" className="w-full px-4 py-3 border-2 border-[#e2e8f0] rounded-lg text-sm outline-none focus:border-[#0066cc]" />
              </div>
              <div className="form-group">
                <label>Email (optional)</label>
                <input type="email" name="email" placeholder="Enter your email" className="w-full px-4 py-3 border-2 border-[#e2e8f0] rounded-lg text-sm outline-none focus:border-[#0066cc]" />
              </div>
              <div className="form-group">
                <label>Story Title *</label>
                <input type="text" name="title" placeholder="What's your story about?" required className="w-full px-4 py-3 border-2 border-[#e2e8f0] rounded-lg text-sm outline-none focus:border-[#0066cc]" />
              </div>
              <div className="form-group">
                <label>Location</label>
                <div className="relative">
                  <MapPin size={16} className="absolute left-3 top-3.5 text-[#718096]" />
                  <input type="text" name="location" placeholder="e.g., Kisauni, Mombasa" className="w-full px-4 py-3 pl-10 border-2 border-[#e2e8f0] rounded-lg text-sm outline-none focus:border-[#0066cc]" />
                </div>
              </div>
              <div className="form-group">
                <label>Story Details *</label>
                <textarea name="message" placeholder="Tell us what happened..." required rows={5} className="w-full px-4 py-3 border-2 border-[#e2e8f0] rounded-lg text-sm outline-none focus:border-[#0066cc] resize-y" />
              </div>
              <div className="flex items-center gap-2.5 mb-6">
                <input type="checkbox" name="anonymous" id="anonymous" className="w-[18px] h-[18px] accent-[#e63946]" />
                <label htmlFor="anonymous" className="text-sm text-[#718096]">Submit anonymously</label>
              </div>
              <button type="submit" disabled={loading} className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm bg-[#e63946] text-white hover:bg-[#c1121f] transition-all disabled:opacity-50">
                {loading ? 'Sending...' : <><PaperPlane size={16} /> Send to News Desk</>}
              </button>
            </form>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}
