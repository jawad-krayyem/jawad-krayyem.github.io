'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { PrivacySettingsButton } from './AnalyticsConsent';
import { Icon } from './Icons';
import { CursorSettingsButton } from './CustomCursor';
const navigation = [{ label: 'Work', href: '/#work' }, { label: 'About', href: '/#about' }, { label: 'Notes', href: '/notes/' }, { label: 'Lab', href: '/terminal/' }];
export function SiteChrome({ active = '' }: { active?: string }) {
  const [dark, setDark] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const menu = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  useEffect(() => {
    let saved: string | null = null;
    try { saved = localStorage.getItem('jk-theme'); } catch { /* Keep the default theme if storage is unavailable. */ }
    const next = saved !== 'light';
    document.documentElement.classList.toggle('dark', next);
    setDark(next);
  }, []);
  useEffect(() => { menu.current?.close(); }, [pathname]);
  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 900px)');
    const close = () => { if (desktop.matches) menu.current?.close(); };
    desktop.addEventListener('change', close); return () => desktop.removeEventListener('change', close);
  }, []);
  function toggleTheme() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    try { localStorage.setItem('jk-theme', next ? 'dark' : 'light'); } catch { /* The selected theme still applies on this visit. */ }
  }
  return <><a className="skip-link" href="#main">Skip to content</a><header className="topbar">
    <Link href="/" className="brand" aria-label="Jawad Krayyem home"><span className="brand-mark">jk<span>.</span></span><span>Jawad Krayyem<span className="brand-subtitle">Software developer</span></span></Link>
    <nav className="nav-links" aria-label="Main navigation">{navigation.map(item => <Link key={item.label} className={(active === 'terminal' && item.label === 'Lab') || (active === 'work' && item.label === 'Work') || (pathname.startsWith('/notes') && item.label === 'Notes') ? 'active' : ''} href={item.href}>{item.label}</Link>)}</nav>
    <div className="header-actions"><button className="icon-button command-trigger" type="button" aria-label="Open quick navigation" title="Quick navigation (Ctrl or ⌘ K)" onClick={() => window.dispatchEvent(new Event('jk:open-commands'))}><Icon name="search"/><kbd>⌘ K</kbd></button><button className="icon-button theme-trigger" type="button" aria-label={`Switch to ${dark ? 'light' : 'dark'} theme`} title={`Switch to ${dark ? 'light' : 'dark'} theme`} onClick={toggleTheme}><Icon name={dark ? 'sun' : 'moon'}/></button><Link className="header-contact" href="/#contact">Let’s talk <Icon name="arrow"/></Link><button ref={trigger} className="icon-button menu-trigger" type="button" aria-label="Open menu" aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={() => { menu.current?.showModal(); setMenuOpen(true); }}><Icon name="menu"/></button></div>
  </header><dialog ref={menu} className="mobile-menu-dialog" aria-label="Site menu" onClose={() => { setMenuOpen(false); if (trigger.current?.isConnected) trigger.current.focus(); }}>
    <div className="mobile-menu-heading"><span className="eyebrow">Explore the site</span><button className="icon-button" type="button" aria-label="Close menu" onClick={() => menu.current?.close()}><Icon name="close"/></button></div><nav id="mobile-navigation" aria-label="Mobile navigation">{[...navigation, { label: 'Résumé', href: '/resume/' }, { label: 'Contact', href: '/#contact' }].map((item, index) => <Link href={item.href} key={item.label} onClick={() => menu.current?.close()}><span className="menu-number" aria-hidden="true">0{index + 1}</span>{item.label}<Icon name="arrow"/></Link>)}</nav><p>Thoughtful software, built with curiosity.</p>
  </dialog></>;
}
export function SiteFooter() {
  return <footer className="footer"><div><Link href="/" className="footer-name">Jawad Krayyem<span>.</span></Link><p>Useful ideas, made into software.</p><small>© {new Date().getFullYear()} Jawad Krayyem</small></div><div className="footer-links"><Link href="/resume/">Résumé</Link><Link href="/terminal/">Terminal lab</Link><a href="https://github.com/jawad-krayyem" target="_blank" rel="noreferrer">GitHub <Icon name="external"/></a><Link href="/privacy-policy/">Privacy policy</Link><PrivacySettingsButton /><CursorSettingsButton /></div></footer>;
}
