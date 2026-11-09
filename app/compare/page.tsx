import type { Metadata } from 'next';
import { SiteChrome, SiteFooter } from '../components/SiteChrome';
import ProjectComparison from '../components/ProjectComparison';
export const metadata: Metadata = { title: 'Compare projects — Jawad Krayyem', description: 'Compare project goals, implementation stacks, local workflows, and source links.', alternates: { canonical: '/compare/' } };
export default function ComparePage() {
  return <div className="site-shell"><SiteChrome/><main id="main" className="section-container compare-page"><a className="back-link" href="/#work">← Back to selected work</a><header className="compare-header"><p className="eyebrow">A practical overview</p><h1>Four projects.<br/>Different problems.</h1><p>Compare each project’s purpose, runtime, and local preview. No performance figures are invented or implied.</p></header><ProjectComparison/></main><SiteFooter/></div>;
}
