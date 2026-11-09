import Link from 'next/link';
import { projects } from '../lib/projects';

export default function AudiencePathways() {
  return <section className="section-container audience-pathways" aria-labelledby="audience-title"><div className="section-heading"><div><p className="eyebrow">Choose a path</p><h2 id="audience-title">Start where you’re curious.</h2></div><p>Jump to the view that helps you understand the work.</p></div><div className="audience-grid"><Link href="/resume/"><span>01 / Hiring teams</span><strong>See the project-focused résumé.</strong><small>Verified skills, project evidence, and role views ↗</small></Link><Link href="/compare/"><span>02 / Product teams</span><strong>Compare the work side by side.</strong><small>Scope, local requirements, and source links ↗</small></Link><Link href={`/projects/${projects[0].slug}/`}><span>03 / Developers</span><strong>Open a case study.</strong><small>Architecture, code map, trade-offs, and setup ↗</small></Link></div></section>;
}
