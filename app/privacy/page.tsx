import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <section className="py-[60px]">
        <div className="max-w-[800px] mx-auto px-6">
          <h1 className="text-4xl font-bold text-[#0a1628] mb-8 font-[var(--font-heading)]">Privacy Policy</h1>
          <div className="prose prose-lg max-w-none text-[#2d3748] leading-relaxed">
            <p className="mb-4">Last updated: August 2026</p>
            <h2 className="text-xl font-bold text-[#0a1628] mt-8 mb-4">1. Introduction</h2>
            <p className="mb-4">The Coast Media Group (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.</p>
            <h2 className="text-xl font-bold text-[#0a1628] mt-8 mb-4">2. Information We Collect</h2>
            <p className="mb-4">We may collect personal information that you voluntarily provide to us when you register on our website, express interest in obtaining information about us or our products and services, or otherwise contact us.</p>
            <h2 className="text-xl font-bold text-[#0a1628] mt-8 mb-4">3. How We Use Your Information</h2>
            <p className="mb-4">We use personal information collected via our website for a variety of business purposes, including to provide and maintain our services, improve our website, and communicate with you.</p>
            <h2 className="text-xl font-bold text-[#0a1628] mt-8 mb-4">4. Cookies</h2>
            <p className="mb-4">We may use cookies and similar tracking technologies to access or store information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.</p>
            <h2 className="text-xl font-bold text-[#0a1628] mt-8 mb-4">5. Contact Us</h2>
            <p className="mb-4">If you have questions or comments about this Privacy Policy, please contact us at: support@wedialai.com</p>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
