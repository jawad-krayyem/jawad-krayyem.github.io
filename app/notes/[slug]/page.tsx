import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { notes } from '../../lib/notes';
import { SiteChrome, SiteFooter } from '../../components/SiteChrome';
import { Icon } from '../../components/Icons';
type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return notes.map(note => ({ slug: note.slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params; const note = notes.find(item => item.slug === slug);
  return { title: `${note?.title || 'Note'} — Jawad Krayyem`, description: note?.summary, alternates: { canonical: `/notes/${slug}/` } };
}
export default async function NotePage({ params }: Props) {
  const { slug } = await params; const note = notes.find(item => item.slug === slug); if (!note) notFound();
  return <div className="site-shell"><SiteChrome/><main id="main" className="article-container"><Link className="back-link" href="/notes/">← All build notes</Link><article><header><p className="eyebrow">{note.category} / Build note</p><h1>{note.title}</h1><p className="article-deck">{note.summary}</p><div className="article-byline">Jawad Krayyem <span>November 2026</span></div></header><div className="article-body">{note.sections.map(section => <section key={section.heading}><h2>{section.heading}</h2><p>{section.text}</p></section>)}</div><footer className="article-source"><p>Explore the project behind this note.</p><Link className="inline-link" href={`/projects/${note.project}/`}>View the project <Icon name="arrow"/></Link>{note.source && <a className="inline-link" href={note.source} target="_blank" rel="noreferrer">Source &amp; documentation <Icon name="external"/></a>}</footer></article></main><SiteFooter/></div>;
}
