import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PlayerBar from '@/components/PlayerBar';
import BriefSlider from '@/components/BriefSlider';

export const metadata: Metadata = {
  title: {
    default: 'The Coast Media Group — News, Radio & TV',
    template: '%s | The Coast Media Group',
  },
  description:
    "Kenya's leading coastal news, radio and TV platform. Breaking news, Radio Coast live, Coast TV, e-paper and advertising opportunities.",
  openGraph: {
    siteName: 'The Coast Media Group',
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
        </body>
      </html>
    </ClerkProvider>
  );
}
