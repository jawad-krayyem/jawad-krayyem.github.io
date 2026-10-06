import Link from 'next/link';
import { SiteChrome, SiteFooter } from './components/SiteChrome';

const projects = [
  { number: '01', name: 'ai-interview', description: 'An AI interview project, built in the open.', tags: ['AI', 'Open source'], href: 'https://github.com/jawad-krayyem/ai-interview' },
  { number: '02', name: 'SDXL', description: 'Local SDXL text and image generation with inpainting, ControlNet, and LoRA tooling.', tags: ['Generative AI', 'Local-first'], href: 'https://github.com/jawad-krayyem/SDXL' },
  { number: '03', name: 'insightpilot-RAG', description: 'A local, document-grounded assistant with hybrid retrieval and reranking.', tags: ['RAG', 'Retrieval'], href: 'https://github.com/jawad-krayyem/insightpilot-RAG' },
  { number: '04', name: 'RAG', description: 'A full-stack retrieval-augmented generation prototype.', tags: ['Full stack', 'RAG'], href: 'https://github.com/jawad-krayyem/RAG' },
];

export default function HomePage() {
  return <div className="site-shell"><SiteChrome active="work" /><main id="main">
    <section className="hero">
      <div className="reveal">
        <div className="eyebrow">Software developer / builder</div>
        <h1>Jawad<br /><em>Krayyem.</em></h1>
        <p className="hero-copy">I build software that makes complex ideas feel tangible — from local AI tools to full-stack experiments.</p>
        <div className="hero-actions"><a className="button-primary" href="#work">Explore the work <span aria-hidden="true">↘</span></a><Link className="text-link" href="/terminal/">Enter the terminal lab ↗</Link></div>
      </div>
      <div className="portrait-stage reveal delay-1" aria-label="Portrait of Jawad Krayyem">
        <span className="orbit-label">A PERSON, NOT A PROMPT / 01</span>
        <div className="portrait-frame"><img src="/images/jawad-profile.webp" alt="Jawad Krayyem outdoors" /></div>
        <div className="portrait-stamp">BUILT<br />IN THE<br />OPEN</div>
        <div className="portrait-caption">JAWAD KRAYYEM &nbsp;—&nbsp; DEVELOPER</div>
      </div>
    </section>
    <div className="ticker" aria-label="Areas of exploration"><div className="ticker-track" aria-hidden="true">
      {Array.from({ length: 2 }, (_, i) => <span key={i}>LOCAL AI <b>·</b> RETRIEVAL SYSTEMS <b>·</b> IMAGE GENERATION <b>·</b> OPEN-SOURCE EXPERIMENTS <b>·</b> THOUGHTFUL SOFTWARE <b>·</b></span>)}
    </div></div>
    <section className="section" id="work">
      <div className="section-heading"><div><div className="eyebrow">A few things I’ve made</div><h2>Selected work<span style={{color:'var(--orange)'}}>.</span></h2></div><p>Small windows into a wider practice of building and learning in public.</p></div>
      <div className="project-list">{projects.map(project => <article className="project-row" key={project.number}>
        <span className="project-index">{project.number}</span><div><h3>{project.name}</h3><div className="project-tags">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div></div>
        <p>{project.description}</p><a className="repo-link" href={project.href} target="_blank" rel="noreferrer" aria-label={`View ${project.name} on GitHub`}>Repository ↗</a>
      </article>)}</div>
    </section>
    <section className="section workspace-section">
      <div><div className="eyebrow">A small detour</div><h2>There’s a shell<br />with your name on it.</h2><p>Not just a terminal window. A safe little command-line playground, a tiny top-down adventure, and a runner. All running right here in your browser.</p><Link className="button-primary" href="/terminal/">Open the lab <span aria-hidden="true">↗</span></Link></div>
      <div className="terminal-preview" aria-label="Decorative terminal preview"><div className="term-top"><span>jawad@workspace:~</span><span className="term-dots"><i/><i/><i/></span></div><div className="term-line"><strong>$</strong> ls ./projects</div><div className="term-line">ai-interview/ &nbsp; SDXL/</div><div className="term-line">insightpilot-RAG/ &nbsp; RAG/</div><br/><div className="term-line"><strong>$</strong> <span className="comment"># curiosity is a feature</span></div><div className="term-line"><strong>_</strong></div></div>
    </section>
    <section className="section about-band"><h2>Curiosity,<br />made useful.</h2><div className="about-text"><p>A practical kind of curiosity.</p><p>Jawad’s public GitHub work explores how AI can be made useful on a personal machine: generating images, finding signal in documents, and building the surrounding tools that make those ideas usable.</p><p>Each project is a snapshot of an ongoing practice: try the idea, make it work, and share what was learned.</p><a className="text-link" href="https://github.com/jawad-krayyem" target="_blank" rel="noreferrer">More on GitHub ↗</a></div></section>
  </main><SiteFooter /></div>;
}
