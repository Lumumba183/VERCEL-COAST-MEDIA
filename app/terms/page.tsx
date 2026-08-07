import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function TermsPage() {
  return (
    <>
      <Header />
      <section className="py-[60px]">
        <div className="max-w-[800px] mx-auto px-6">
          <h1 className="text-4xl font-bold text-[#0a1628] mb-8 font-[var(--font-heading)]">Terms of Service</h1>
          <div className="prose prose-lg max-w-none text-[#2d3748] leading-relaxed">
            <p className="mb-4">Last updated: August 2026</p>
            <h2 className="text-xl font-bold text-[#0a1628] mt-8 mb-4">1. Agreement to Terms</h2>
            <p className="mb-4">By accessing or using The Coast Media Group website, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the website.</p>
            <h2 className="text-xl font-bold text-[#0a1628] mt-8 mb-4">2. Use of Content</h2>
            <p className="mb-4">All content on this website, including text, graphics, logos, images, and software, is the property of The Coast Media Group and is protected by copyright and other intellectual property laws.</p>
            <h2 className="text-xl font-bold text-[#0a1628] mt-8 mb-4">3. User Submissions</h2>
            <p className="mb-4">By submitting content to our website (such as story tips or comments), you grant us a non-exclusive, royalty-free license to use, reproduce, and distribute that content.</p>
            <h2 className="text-xl font-bold text-[#0a1628] mt-8 mb-4">4. Limitation of Liability</h2>
            <p className="mb-4">In no event shall The Coast Media Group be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or relating to your use of the website.</p>
            <h2 className="text-xl font-bold text-[#0a1628] mt-8 mb-4">5. Governing Law</h2>
            <p className="mb-4">These Terms shall be governed by and construed in accordance with the laws of Kenya.</p>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
