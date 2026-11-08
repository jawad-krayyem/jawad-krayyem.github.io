'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { projects } from '../lib/projects';
import type { ProcessorScene } from '../lib/processor-scene';
import { Icon } from './Icons';
function ProcessorPoster() {
  return <svg className="cpu-poster" viewBox="0 0 600 450" aria-hidden="true"><defs><linearGradient id="cpu-metal" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#e1e8e8"/><stop offset=".5" stopColor="#8a9d9c"/><stop offset="1" stopColor="#d4e4e0"/></linearGradient></defs><g transform="translate(300 220) scale(1 .65) rotate(-28)"><rect x="-135" y="-135" width="270" height="270" fill="#214a3e" stroke="#70d7ac" strokeWidth="2"/><rect x="-112" y="-112" width="224" height="224" rx="9" fill="url(#cpu-metal)" stroke="#a8c7b9" strokeWidth="3"/><text textAnchor="middle" y="8" fill="#19342a" fontSize="64" fontFamily="monospace" fontWeight="bold">JK</text><text textAnchor="middle" y="42" fill="#294c3d" fontSize="11" fontFamily="monospace">CREATIVE PROCESSOR</text>{Array.from({ length: 14 }, (_, i) => <g stroke="#c3a76b" strokeWidth="5" key={i}><path d={`M${-112 + i * 17} -153v18M${-112 + i * 17} 135v18M-153 ${-112 + i * 17}h18M135 ${-112 + i * 17}h18`}/></g>)}</g></svg>;
}
export default function ProcessorExplorer() {
  const [expanded, setExpanded] = useState(false);
  const [ready, setReady] = useState(false);
  const host = useRef<HTMLSpanElement>(null);
  const scene = useRef<ProcessorScene | null>(null);
  useEffect(() => {
    let cancelled = false;
    import('../lib/processor-scene').then(({ mountProcessor }) => {
      if (cancelled || !host.current) return;
      scene.current = mountProcessor(host.current, () => setReady(false)); setReady(true);
    }).catch(() => { if (!cancelled) setReady(false); });
    return () => { cancelled = true; scene.current?.dispose(); scene.current = null; };
  }, []);
  useEffect(() => { scene.current?.setExpanded(expanded); }, [expanded, ready]);
  return <section className={`cpu-lab ${expanded ? 'cpu-open' : ''}`} data-scene={ready ? 'ready' : 'poster'} aria-label="Interactive project processor"><div className="cpu-lab-heading"><span><i aria-hidden="true"/>The project processor</span><span>JK / 004</span></div><div className="cpu-stage">
    <div className="cpu-orbit" aria-hidden="true"/><button className="cpu-toggle" type="button" aria-label="Explore the processor" aria-expanded={expanded} aria-controls="cpu-projects" data-cursor={expanded ? 'Close' : 'Explore'} onClick={() => setExpanded(!expanded)} onPointerMove={event => { if (event.pointerType !== 'mouse') return; const rect = event.currentTarget.getBoundingClientRect(); scene.current?.setPointer((event.clientX - rect.left) / rect.width * 2 - 1, (event.clientY - rect.top) / rect.height * 2 - 1); }} onPointerLeave={() => scene.current?.setPointer(0, 0)}><span ref={host} className="cpu-canvas"/>{!ready && <ProcessorPoster/>}<span className="sr-only">Click to reveal four projects. Use the project links to open each case study.</span></button>
    <div className="cpu-projects" id="cpu-projects" role="region" aria-label="Projects inside the processor" hidden={!expanded}>{projects.map((project, index) => <Link className={`cpu-project-link module-${index}`} data-cursor="View" href={`/projects/${project.slug}/`} key={project.slug}><span className="module-code">0{index + 1} / {project.category}</span><strong>{project.name}</strong><span className="module-footer">{project.tags[0]} <Icon name="arrow"/></span></Link>)}</div>
    <div className="cpu-coordinate coord-left" aria-hidden="true">X / BUILD</div><div className="cpu-coordinate coord-right" aria-hidden="true">Y / EXPLORE</div>
  </div><div className="cpu-lab-footer"><span className="cpu-action-hint"><span aria-hidden="true">{expanded ? '−' : '+'}</span>{expanded ? 'Click the chip to close' : 'Click the chip. Explore the work.'}</span><a href="#work">All projects <Icon name="arrow"/></a></div></section>;
}
