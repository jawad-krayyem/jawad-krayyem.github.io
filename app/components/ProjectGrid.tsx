'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { projects } from '../lib/projects';
import { Icon } from './Icons';
export default function ProjectGrid() {
  const [category, setCategory] = useState('All work');
  const visible = projects.filter(project => category === 'All work' || project.category === category);
  return <><div className="project-toolbar"><div className="filter-buttons" role="group" aria-label="Filter projects">{['All work', 'Documents', 'Voice & audio', 'Image generation'].map(item => <button type="button" aria-pressed={category === item} onClick={() => setCategory(item)} key={item}>{item}</button>)}</div><p className="result-count" role="status">{visible.length} {visible.length === 1 ? 'project' : 'projects'}</p></div><div className="project-grid">{visible.map((project, index) => <article className={`project-card ${project.color}`} key={project.slug}>
    <Link className="project-image-link" href={`/projects/${project.slug}/`} aria-label={`Explore ${project.name}`}><div className="project-image"><Image src={project.image} width={1200} height={750} alt={project.imageAlt} sizes="(max-width: 760px) 100vw, 50vw"/><span className="image-arrow"><Icon name="arrow"/></span></div></Link>
    <div className="project-card-body"><div className="project-meta"><span>{project.category}</span><span>{String(index + 1).padStart(2, '0')}</span></div><h3><Link href={`/projects/${project.slug}/`}>{project.name}</Link></h3><p>{project.summary}</p><ul className="technology-tags" aria-label={`${project.name} technologies`}>{project.tags.map(tag => <li key={tag}>{tag}</li>)}</ul><div className="project-card-links"><Link className="inline-link" href={`/projects/${project.slug}/`}>View project <Icon name="arrow"/></Link>{project.repository && <a href={project.repository} className="subtle-link" target="_blank" rel="noreferrer">Source <Icon name="external"/></a>}</div></div>
  </article>)}</div></>;
}
