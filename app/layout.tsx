import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import AnalyticsConsent from './components/AnalyticsConsent';

import './globals.css';

export const metadata: Metadata = {
  title: 'Jawad Krayyem — Software Developer & Builder',
  description:
    'Selected software projects and browser experiments by Jawad Krayyem.',
  icons: {
    icon: '/favicon.svg',
  },
  openGraph: {
    title: 'Jawad Krayyem — Software Developer & Builder',
    description: 'Selected software projects and browser experiments.',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        {children}
        <AnalyticsConsent />
      </body>
    </html>
  );
}
