import type { Metadata } from 'next';
import Link from 'next/link';
import { notes } from '../lib/notes';
import { SiteChrome, SiteFooter } from '../components/SiteChrome';
import { Icon } from '../components/Icons';
export const metadata: Metadata = { title: 'Build notes — Jawad Krayyem', description: 'Notes on retrieval systems, structured AI output, and offline application design.', alternates: { canonical: '/notes/' } };
export default function NotesPage() {
  return <div className="site-shell"><SiteChrome/><main id="main" className="section-container notes-index"><header className="page-intro"><p className="eyebrow">From the workbench</p><h1>Notes on<br/>building<span className="accent-dot">.</span></h1><p>Small explorations of the decisions behind the interface. Grounded in the projects, with links to look closer.</p></header><div className="notes-grid">{notes.map(note => <Link className="note-card" key={note.slug} href={`/notes/${note.slug}/`}><span className="eyebrow">{note.category}</span><h2>{note.title}</h2><p>{note.summary}</p><span className="inline-link">Read note <Icon name="arrow"/></span></Link>)}</div></main><SiteFooter/></div>;
}
