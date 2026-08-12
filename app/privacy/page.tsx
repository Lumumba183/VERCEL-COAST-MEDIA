import LegalPage from '@/components/LegalPage';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Privacy Policy' };

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="August 2026"
      sections={[
        { heading: '1. Information We Collect', body: 'We collect information you provide directly, such as your name, email address and phone number when you submit a story, send an advertising enquiry, or contact our news desk. We also collect standard technical data (browser type, device, pages visited) to improve our services.' },
        { heading: '2. How We Use Your Information', body: 'Submissions are used by our editorial team to review and follow up on story tips. Contact details are never published without your consent. Advertising enquiries are shared only with our sales team. We do not sell your personal data to third parties.' },
        { heading: '3. Story Source Protection', body: 'The Coast Media Group protects the identity of confidential news sources in line with Kenyan media law and our editorial code. Tell us if you wish to remain anonymous when submitting a story.' },
        { heading: '4. Data Storage & Security', body: 'Your data is stored securely using industry-standard encryption via our database provider (Supabase) and authentication provider (Clerk). Access is restricted to authorised staff only.' },
        { heading: '5. Your Rights', body: 'You may request access to, correction of, or deletion of your personal data at any time by emailing thecoastnewspaper@gmail.com. We respond to all requests within 30 days.' },
        { heading: '6. Contact', body: 'Questions about this policy? Contact The Coast Media Group, Mombasa, Kenya — phone +254 720 870 176 or email thecoastnewspaper@gmail.com.' },
      ]}
    />
  );
}
