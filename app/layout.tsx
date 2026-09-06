import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PlayerBar from '@/components/PlayerBar';
import BriefSlider from '@/components/BriefSlider';
import AnalyticsTracker from '@/components/AnalyticsTracker';

export const metadata: Metadata = {
  title: {
    default: 'The News Booth — News, Radio & TV',
    template: '%s | The News Booth',
  },
  description:
    "Kenya's leading news, radio and TV platform. Breaking news, Live Radio live, TV Live, e-paper and advertising opportunities.",
  openGraph: {
    siteName: 'The News Booth',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="antialiased min-h-screen flex flex-col">
          <Header />
          <BriefSlider />
          <main className="flex-1 pb-16">{children}</main>
          <Footer />
          <PlayerBar />
          <AnalyticsTracker />
        </body>
      </html>
    </ClerkProvider>
  );
}
