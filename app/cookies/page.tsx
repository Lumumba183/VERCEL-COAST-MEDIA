import LegalPage from '@/components/LegalPage';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Cookie Policy' };

export default function CookiesPage() {
  return (
    <LegalPage
      title="Cookie Policy"
      updated="August 2026"
      sections={[
        { heading: '1. What Are Cookies', body: 'Cookies are small text files stored on your device when you visit a website. They help sites function, remember preferences and understand usage.' },
        { heading: '2. Cookies We Use', body: 'Essential cookies: required for staff sign-in (provided by Clerk, our authentication provider) and site security. Preference cookies: remember choices such as audio player state. Analytics cookies: help us understand readership in aggregate.' },
        { heading: '3. Third-Party Cookies', body: 'Embedded YouTube videos and social features may set their own cookies governed by those providers’ policies.' },
        { heading: '4. Managing Cookies', body: 'You can block or delete cookies in your browser settings. Note that blocking essential cookies will prevent staff sign-in and may degrade some features.' },
        { heading: '5. Contact', body: 'Questions about cookies? Email thecoastnewspaper@gmail.com or call +254 720 870 176.' },
      ]}
    />
  );
}
