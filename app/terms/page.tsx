import LegalPage from '@/components/LegalPage';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Terms of Service' };

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      updated="August 2026"
      sections={[
        { heading: '1. Acceptance of Terms', body: 'By accessing The Coast Media Group website, radio streams and TV content, you agree to these Terms of Service and all applicable laws of the Republic of Kenya. If you do not agree, please do not use our services.' },
        { heading: '2. Content & Copyright', body: 'All articles, audio, video and graphics published by The Coast Media Group are protected by copyright. You may share links and short excerpts with attribution; reproduction of full content requires written permission.' },
        { heading: '3. Story Submissions', body: 'By submitting a story or tip, you confirm the information is accurate to the best of your knowledge and grant us the right to investigate and publish based on it. We reserve the right to verify, edit or decline any submission.' },
        { heading: '4. Acceptable Use', body: 'You may not misuse our platforms — including submitting false information, attempting to breach staff areas, scraping content at scale, or interfering with streams and broadcasts.' },
        { heading: '5. Advertising', body: 'Advertising placements are governed by individual insertion orders. We reserve the right to decline advertising that conflicts with our editorial values or Kenyan law.' },
        { heading: '6. Liability', body: 'News content is provided in good faith; while we strive for accuracy, The Coast Media Group is not liable for decisions made based on published content. Corrections are published promptly when errors are identified.' },
        { heading: '7. Changes', body: 'We may update these terms from time to time. Continued use of our services after changes constitutes acceptance.' },
      ]}
    />
  );
}
