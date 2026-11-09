'use client';
import { useState } from 'react';
import Link from 'next/link';
import { projects } from '../lib/projects';

const roles: Record<string, (project: typeof projects[number]) => boolean> = {
  all: () => true,
  voice: project => project.slug === 'interview-room',
  ai: project => project.tags.some(tag => ['Ollama', 'Qdrant', 'LangChain', 'Diffusers'].includes(tag)),
  interface: project => project.tags.some(tag => ['React', 'Streamlit'].includes(tag)),
};
const filters = [['all', 'All work'], ['ai', 'AI & data'], ['voice', 'Voice & audio'], ['interface', 'Interfaces']];

export default function ResumeFocus() {
  const [role, setRole] = useState('all');
  const visible = projects.filter(roles[role]);
  return <section className="resume-focus" aria-labelledby="resume-focus-title"><div className="resume-focus-header"><div><p className="eyebrow">Project evidence by focus</p><h2 id="resume-focus-title">Choose a lens.</h2></div><div role="group" aria-label="Filter résumé projects">{filters.map(([key, label]) => <button type="button" data-role={key} key={key} aria-pressed={role === key} onClick={() => setRole(key)}>Focus: {key === 'voice' ? 'voice & audio' : label}</button>)}</div></div><div className="resume-focus-list">{visible.map(project => <article className="resume-project" key={project.slug}><h3><Link href={`/projects/${project.slug}/`}>{project.name}</Link><small>{project.category}</small></h3><p>{project.summary}</p><span>{project.tags.join(' · ')}</span>{project.repository && <a href={project.repository} target="_blank" rel="noreferrer">Repository ↗</a>}</article>)}</div><p className="resume-focus-note">This résumé describes verified project work. It does not add unconfirmed employers, education, or employment dates.</p></section>;
}
