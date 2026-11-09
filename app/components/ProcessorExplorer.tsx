'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { projects } from '../lib/projects';
import type { ProcessorScene } from '../lib/processor-scene';
import { Icon } from './Icons';
function ProcessorPoster({ expanded }: { expanded: boolean }) {
  return <svg className="cpu-poster" viewBox="0 0 600 450" aria-hidden="true"><defs>
    <linearGradient id="cpu-metal" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#edf0ee"/><stop offset=".38" stopColor="#929e9f"/><stop offset=".58" stopColor="#d7dddb"/><stop offset="1" stopColor="#9aa7a7"/></linearGradient>
    <linearGradient id="cpu-board" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#245347"/><stop offset="1" stopColor="#101d20"/></linearGradient>
    <linearGradient id="cpu-silicon" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#294452"/><stop offset=".55" stopColor="#111d25"/><stop offset="1" stopColor="#39515b"/></linearGradient>
    <pattern id="cpu-brush" width="8" height="8" patternUnits="userSpaceOnUse"><path d="M0 1h8M0 5h8" stroke="#fff" strokeOpacity=".16" strokeWidth=".6"/></pattern>
  </defs><g transform="translate(300 229) scale(1 .66) rotate(-28)">
    <rect x="-152" y="-152" width="304" height="304" rx="16" fill="#0d1416" stroke="#607772" strokeWidth="4"/>
    <rect x="-145" y="-145" width="290" height="290" rx="12" fill="url(#cpu-board)" stroke="#31574a" strokeWidth="3"/>
    <path d="M-131-100h42l22 20h43m-107 57h28l16 15h37m160-83h-43l-19 19h-38m100 62h-31l-16-17h-45M-115 116h37l16-18h31m123-2h37l16 20h36" fill="none" stroke="#b18b55" strokeOpacity=".58" strokeWidth="2"/>
    <rect x="-120" y="-120" width="240" height="240" rx="9" fill="#121a1e" stroke="#71827e" strokeWidth="3"/>
    <rect x="-102" y="-102" width="204" height="204" rx="8" fill="url(#cpu-silicon)" stroke="#789096" strokeWidth="2"/>
    {[[-54,-54],[3,-54],[-54,3],[3,3]].map(([x,y],i)=><g key={i}>
      <rect x={x} y={y} width="48" height="48" rx="3" fill="url(#cpu-silicon)" stroke="#78939b" strokeWidth="1.5"/>
      <path d={`M${x+5} ${y+12}h13l7 7h16M${x+5} ${y+28}h10l8-8h18`} fill="none" stroke="#82b4bd" strokeOpacity=".72" strokeWidth="1.5"/>
    </g>)}
    <rect x="-6" y="-54" width="12" height="108" rx="2" fill="#71868a" stroke="#d2b477" strokeWidth="1"/>
    {Array.from({ length: 18 }, (_, i) => <g stroke="#d0ae6f" strokeWidth="5" key={i}><path d={`M${-122 + i * 14.35} -169v17M${-122 + i * 14.35} 152v17M-169 ${-122 + i * 14.35}h17M152 ${-122 + i * 14.35}h17`}/></g>)}
    <g transform={expanded ? 'translate(-35 -238) rotate(-7)' : undefined}>
      <rect x="-124" y="-124" width="248" height="248" rx="11" fill="#525d60" stroke="#d7ddda" strokeWidth="3"/>
      <rect x="-119" y="-119" width="238" height="238" rx="8" fill="url(#cpu-metal)" stroke="#e9efed" strokeOpacity=".72" strokeWidth="1.5"/>
      <rect x="-119" y="-119" width="238" height="238" rx="8" fill="url(#cpu-brush)"/>
      <path d="M-89-87h178v174H-89z" fill="none" stroke="#5a6869" strokeOpacity=".4" strokeWidth="1.5"/>
      <text x="-68" y="-25" fill="#344144" fontSize="58" fontFamily="monospace" fontWeight="bold">JK</text>
      <text x="-68" y="8" fill="#344144" fontSize="12" fontFamily="monospace" fontWeight="bold">CREATIVE CORE / 004</text>
      <text x="-68" y="30" fill="#475658" fontSize="8" fontFamily="monospace">AI · SOFTWARE · SYSTEMS</text>
      <text x="-68" y="64" fill="#475658" fontSize="7" fontFamily="monospace">JK-PORTFOLIO-2026</text>
      {[-102,102].flatMap(x=>[-102,102].map(y=><circle key={`${x}-${y}`} cx={x} cy={y} r="5" fill="#5f6b6e" stroke="#e0e4e2" strokeWidth="1.4"/>))}
    </g>
  </g></svg>;
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
    <div className="cpu-orbit" aria-hidden="true"/><button className="cpu-toggle" type="button" aria-label="Explore the processor" aria-expanded={expanded} aria-controls="cpu-projects" data-cursor={expanded ? 'Close' : 'Explore'} onClick={() => setExpanded(!expanded)} onPointerMove={event => { if (event.pointerType !== 'mouse') return; const rect = event.currentTarget.getBoundingClientRect(); scene.current?.setPointer((event.clientX - rect.left) / rect.width * 2 - 1, (event.clientY - rect.top) / rect.height * 2 - 1); }} onPointerLeave={() => scene.current?.setPointer(0, 0)}><span ref={host} className="cpu-canvas"/>{!ready && <ProcessorPoster expanded={expanded}/>}<span className="sr-only">Click to reveal four projects. Use the project links to open each case study.</span></button>
    <div className="cpu-projects" id="cpu-projects" role="region" aria-label="Projects inside the processor" hidden={!expanded}>{projects.map((project, index) => <Link className={`cpu-project-link module-${index}`} data-cursor="View" href={`/projects/${project.slug}/`} key={project.slug}><span className="module-code">0{index + 1} / {project.category}</span><strong>{project.name}</strong><span className="module-footer">{project.tags[0]} <Icon name="arrow"/></span></Link>)}</div>
    <div className="cpu-coordinate coord-left" aria-hidden="true">X / BUILD</div><div className="cpu-coordinate coord-right" aria-hidden="true">Y / EXPLORE</div>
  </div><div className="cpu-lab-footer"><span className="cpu-action-hint"><span aria-hidden="true">{expanded ? '−' : '+'}</span>{expanded ? 'Click the chip to close' : 'Click the chip. Explore the work.'}</span><a href="#work">All projects <Icon name="arrow"/></a></div></section>;
}
