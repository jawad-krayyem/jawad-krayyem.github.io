import type { Metadata } from 'next';
import Script from 'next/script';
import type { ReactNode } from 'react';

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
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-ZZ44GL8H6H"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-ZZ44GL8H6H');
          `}
        </Script>
      </body>
    </html>
  );
}
