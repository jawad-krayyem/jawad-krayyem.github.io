'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { projects } from '../lib/projects';
import { Icon } from './Icons';
const destinations = [
  { name: 'Home', detail: 'Introduction', href: '/' }, { name: 'Selected work', detail: 'All projects', href: '/#work' },
  { name: 'About', detail: 'Skills and approach', href: '/#about' }, { name: 'Contact', detail: 'Get in touch', href: '/#contact' },
  { name: 'Build notes', detail: 'Technical writing', href: '/notes/' }, { name: 'Compare projects', detail: 'Scope and requirements', href: '/compare/' }, { name: 'Résumé', detail: 'Project-based profile', href: '/resume/' },
  { name: 'Terminal lab', detail: 'Interactive playground', href: '/terminal/' },
  ...projects.map(project => ({ name: project.name, detail: project.tags.join(' · '), href: `/projects/${project.slug}/` })),
];
export default function CommandPalette() {
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  const [query, setQuery] = useState('');
  const pathname = usePathname();
  const results = destinations.filter(item => `${item.name} ${item.detail}`.toLowerCase().includes(query.trim().toLowerCase()));
  useEffect(() => {
    const open = () => {
      if (dialog.current?.open) return;
      document.querySelectorAll<HTMLDialogElement>('dialog[open]').forEach(item => item.close());
      previousFocus.current = document.activeElement as HTMLElement;
      setQuery(''); dialog.current?.showModal(); input.current?.focus();
    };
    const shortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k' && !event.altKey) {
        event.preventDefault(); if (dialog.current?.open) dialog.current.close(); else open();
      }
    };
    window.addEventListener('jk:open-commands', open); window.addEventListener('keydown', shortcut);
    return () => { window.removeEventListener('jk:open-commands', open); window.removeEventListener('keydown', shortcut); };
  }, []);
  useEffect(() => { dialog.current?.close(); }, [pathname]);
  function close() { dialog.current?.close(); }
  return <dialog ref={dialog} className="command-dialog" aria-labelledby="command-title" onKeyDown={event => { if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); close(); } }} onClose={() => { setQuery(''); if (previousFocus.current?.isConnected) previousFocus.current.focus(); }} onClick={event => { if (event.target === event.currentTarget) { const rect = event.currentTarget.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) close(); } }}>
    <div className="command-header"><h2 id="command-title">Quick navigation</h2><button className="icon-button" type="button" onClick={close} aria-label="Close quick navigation"><Icon name="close"/></button></div>
    <div className="command-search"><Icon name="search"/><input ref={input} type="search" value={query} onChange={event => setQuery(event.target.value)} aria-label="Search pages and projects" placeholder="Find a page or project…" onKeyDown={event => { if (event.key === 'ArrowDown') { event.preventDefault(); dialog.current?.querySelector<HTMLAnchorElement>('.command-results a')?.focus(); } if (event.key === 'Enter') { event.preventDefault(); dialog.current?.querySelector<HTMLAnchorElement>('.command-results a')?.click(); } }}/></div>
    <p className="sr-only" role="status">{results.length} destinations found.</p><ul className="command-results">{results.map(item => <li key={item.href}><Link href={item.href} onClick={close}><span><strong>{item.name}</strong><small>{item.detail}</small></span><Icon name="arrow"/></Link></li>)}</ul>
    {results.length === 0 && <p className="command-empty">No matches. Try a project name or “contact”.</p>}<div className="command-hint"><span>Tab to explore · Enter to visit</span><span>Esc to close</span></div>
  </dialog>;
}
