import type { Metadata } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'The Coast Media Group | Kenya\'s Coastal Voice',
  description: 'Kenya\'s leading coastal news, radio and TV platform. Breaking news from Mombasa, Kilifi, Nairobi and beyond. Listen to Radio Coast live.',
  keywords: 'Kenya news, Mombasa news, coastal news, Radio Coast, Coast TV, Kenyan media',
  openGraph: {
    title: 'The Coast Media Group | Kenya\'s Coastal Voice',
    description: 'Breaking news, live radio, and video from Kenya\'s coast.',
    type: 'website',
    url: 'https://thecoast.co.ke',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
        <body className="font-body text-text-main bg-white overflow-x-hidden antialiased">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
