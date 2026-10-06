'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export function SiteChrome({ active = '' }: { active?: string }) {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const saved = localStorage.getItem('jk-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDark(saved ? saved === 'dark' : prefersDark);
  }, []);
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('jk-theme', dark ? 'dark' : 'light');
  }, [dark]);
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="topbar">
      <Link href="/" className="brand" aria-label="Jawad Krayyem home"><span className="brand-mark">jk</span><span>Jawad Krayyem</span></Link>
      <nav className="nav-links" aria-label="Main navigation">
        <Link className={active === 'work' ? 'active' : ''} href="/#work">Selected work</Link>
        <Link className={active === 'terminal' ? 'active' : ''} href="/terminal/">Terminal lab</Link>
        <Link href="/privacy-policy/">Privacy policy</Link>
      </nav>
      <div className="mobile-nav" aria-label="Mobile navigation">
        <Link href="/#work">Work</Link><Link href="/terminal/">Lab</Link><Link href="/privacy-policy/">Policy</Link>
        <button className="theme-toggle" type="button" aria-label={`Switch to ${dark ? 'light' : 'dark'} theme`} onClick={() => setDark(!dark)}>{dark ? 'Light' : 'Dark'}</button>
      </div>
      <button className="theme-toggle desktop-theme" type="button" aria-label={`Switch to ${dark ? 'light' : 'dark'} theme`} onClick={() => setDark(!dark)}>{dark ? 'Light mode' : 'Dark mode'}</button>
    </header>
  </>;
}

export function SiteFooter() {
  return <footer className="footer"><span>© {new Date().getFullYear()} Jawad Krayyem</span><div className="footer-links"><Link href="/terminal/">Explore the terminal</Link><Link href="/privacy-policy/">Privacy policy</Link><a href="https://github.com/jawad-krayyem" target="_blank" rel="noreferrer">GitHub ↗</a></div></footer>;
}
