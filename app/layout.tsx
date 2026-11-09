import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import AnalyticsConsent from './components/AnalyticsConsent';
import CommandPalette from './components/CommandPalette';
import SiteLoader from './components/SiteLoader';
import CustomCursor from './components/CustomCursor';

import './globals.css';
import './portfolio.css';
import './processor.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://jawad-krayyem.github.io'),
  title: 'Jawad Krayyem — Software Developer & Builder',
  description:
    'Selected software projects and browser experiments by Jawad Krayyem.',
  icons: {
    icon: '/favicon.svg',
  },
  openGraph: {
    title: 'Jawad Krayyem — Software Developer & Builder',
    description: 'Selected software projects and browser experiments.',
    type: 'website', siteName: 'Jawad Krayyem', locale: 'en_US',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Jawad Krayyem — Software developer. Local AI and thoughtful web interfaces.' }],
  },
  twitter: { card: 'summary_large_image', title: 'Jawad Krayyem — Software Developer', description: 'Local AI, thoughtful interfaces, and offline experiences.', images: ['/og-image.png'] },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: "try{localStorage.removeItem('jk-theme')}catch(e){}" }}/></head>
      <body>
        <SiteLoader />
        {children}
        <CommandPalette />
        <CustomCursor />
        <AnalyticsConsent />
      </body>
    </html>
  );
}
