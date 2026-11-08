import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { projects } from '../../lib/projects';
import { SiteChrome, SiteFooter } from '../../components/SiteChrome';
import { Icon } from '../../components/Icons';
type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return projects.map(project => ({ slug: project.slug })); }
export const dynamicParams = false;
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find(item => item.slug === slug);
  return { title: `${project?.name || 'Project'} — Jawad Krayyem`, description: project?.summary, alternates: { canonical: `/projects/${slug}/` }, openGraph: { title: `${project?.name} — Jawad Krayyem`, description: project?.summary, images: ['/og-image.png'] } };
}
export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = projects.find(item => item.slug === slug);
  if (!project) notFound();
  const next = projects[(projects.indexOf(project) + 1) % projects.length];
  return <div className="site-shell"><SiteChrome/><main id="main" className="project-detail section-container"><Link href="/#work" className="back-link">← Back to selected work</Link><header className="case-header"><p className="eyebrow">{project.category} / Project study</p><h1>{project.name}</h1><p className="case-kicker">{project.kicker}</p><p className="case-summary">{project.summary}</p><div className="case-actions"><span className="project-status">{project.status}</span>{project.repository ? <a className="button-secondary" href={project.repository} target="_blank" rel="noreferrer">View source on GitHub <Icon name="external"/></a> : null}</div></header>
    <figure className={`case-cover ${project.color}`}><Image src={project.image} alt={project.imageAlt} width={1200} height={750} sizes="(max-width: 760px) 100vw, 1100px" preload/><figcaption>{project.sourceLabel}</figcaption></figure>
    <div className="case-content"><aside className="case-sidebar"><p className="eyebrow">At a glance</p><h2>Built with</h2><ul className="case-stack">{project.tags.map(tag => <li key={tag}>{tag}</li>)}</ul><a href="#approach">The approach</a><a href="#preview">A closer look</a><a href="#details">Details &amp; limitations</a></aside><div className="case-prose"><section><p className="eyebrow">The problem</p><h2>{project.kicker}</h2><p>{project.problem}</p></section><section id="approach"><p className="eyebrow">The approach</p><h2>How it fits together.</h2>{project.approach.map((text, index) => <div className="approach-step" key={text}><span>0{index + 1}</span><p>{text}</p></div>)}</section></div></div>
    <section className="pipeline-section" aria-labelledby="pipeline-title"><p className="eyebrow" id="pipeline-title">A simple view of the flow</p><ol className="pipeline">{project.pipeline.map((step, index) => <li key={step}><span>0{index + 1}</span><strong>{step}</strong>{index < project.pipeline.length - 1 && <Icon name="arrow"/>}</li>)}</ol></section>
    <section className="case-preview" id="preview"><div className="section-heading"><div><p className="eyebrow">A closer look</p><h2>{project.video ? 'See the workflow.' : 'Inside the project.'}</h2></div></div>{project.video ? <><video controls playsInline preload="none" poster={project.image} aria-label={`${project.name} walkthrough`}><source src={project.video} type="video/webm"/><track default kind="captions" srcLang="en" label="English" src={`/demos/${project.slug}.vtt`}/>Your browser cannot play this video. <a href={project.video}>Download the walkthrough</a>.</video><p className="media-disclosure">Recorded interface preview using synthetic content and responses. No live AI inference is shown. Silent video with English captions. <a href={`/demos/${project.slug}.vtt`}>Read the captions</a>.</p></> : <div className="feature-list">{project.features.map((feature, index) => <div key={feature}><span>0{index + 1}</span><h3>{feature}</h3><Icon name="check"/></div>)}</div>}</section>
    <section className="case-bottom-grid" id="details"><article><p className="eyebrow">What to know</p><h2>Scope &amp; limitations.</h2><p>{project.limitation}</p></article><article><p className="eyebrow">Try it yourself</p><h2>{project.repository ? 'Run it locally.' : 'More about the app.'}</h2><p>{project.setup}</p>{project.repository && <a className="inline-link" href={`${project.repository}#readme`} target="_blank" rel="noreferrer">Setup instructions <Icon name="external"/></a>}</article></section>
    <Link className="next-project" href={`/projects/${next.slug}/`}><span><small>Keep exploring / Next project</small><strong>{next.name}</strong></span><Icon name="arrow" width="36" height="36"/></Link>
  </main><SiteFooter/></div>;
}
