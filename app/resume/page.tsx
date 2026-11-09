import type { Metadata } from 'next';
import { SiteChrome, SiteFooter } from '../components/SiteChrome';
import { skills } from '../lib/projects';
import { Icon } from '../components/Icons';
import ResumeFocus from '../components/ResumeFocus';
export const metadata: Metadata = { title: 'Résumé — Jawad Krayyem', description: 'A project-based profile covering local AI, web interfaces, and applied software development.', alternates: { canonical: '/resume/' } };
export default function ResumePage() {
  return <div className="site-shell"><SiteChrome/><main id="main" className="section-container resume-page"><div className="resume-toolbar"><p className="eyebrow">Experience through projects</p><a className="button-primary" href="/resume/jawad-krayyem-resume.pdf" download>Download PDF <Icon name="download"/></a></div><article className="resume-sheet"><header><h1>Jawad Krayyem<span className="accent-dot">.</span></h1><p className="resume-role">Software Developer · AI &amp; Web</p><div className="resume-contact"><a href="mailto:krayyemjawad@gmail.com">krayyemjawad@gmail.com</a><a href="https://github.com/jawad-krayyem">github.com/jawad-krayyem</a><a href="https://jawad-krayyem.github.io/">jawad-krayyem.github.io</a></div></header><section><h2>Profile</h2><p>Developer building local AI tools and web interfaces. Project work spans document retrieval, image generation, browser audio, and structured extraction.</p></section><section><h2>Technical skills</h2><div className="resume-skills">{skills.map(group => <div key={group.title}><strong>{group.title}</strong><span>{group.items.join(' · ')}</span></div>)}</div></section><ResumeFocus/><p className="resume-endnote">Project-focused profile · November 2026</p></article></main><SiteFooter/></div>;
}
