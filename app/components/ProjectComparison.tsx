'use client';
import { useState } from 'react';
import Link from 'next/link';
import { projects } from '../lib/projects';

const facts: Record<string, { workflow: string; runtime: string; interaction: string }> = {
  insightpilot: { workflow: 'Document retrieval and sourced answers', runtime: 'Python · FastAPI · React · Ollama · Qdrant', interaction: 'Synthetic question and citation preview' },
  'sdxl-studio': { workflow: 'Image generation and editing workflows', runtime: 'Python · Flask · Diffusers · local model weights', interaction: 'Static mode and prompt preview' },
  'interview-room': { workflow: 'Streaming voice conversation', runtime: 'Python · FastAPI · WebSocket · local speech models', interaction: 'Synthetic transcript steps' },
  'datheon-workbench': { workflow: 'Structured extraction and document Q&A', runtime: 'Python · Streamlit · Pydantic · local Ollama', interaction: 'Fictional handbook extraction' },
};

export default function ProjectComparison() {
  const [selected, setSelected] = useState<string[]>(projects.map(project => project.slug));
  const visible = projects.filter(project => selected.includes(project.slug));
  function toggle(slug: string) { setSelected(current => current.includes(slug) ? current.filter(item => item !== slug) : [...current, slug]); }
  return <div className="comparison-tool"><div className="comparison-picker" role="group" aria-label="Choose projects to compare">{projects.map(project => <button type="button" key={project.slug} aria-pressed={selected.includes(project.slug)} onClick={() => toggle(project.slug)}>{selected.includes(project.slug) ? '✓' : '+'} {project.name}</button>)}</div><div className="comparison-table-wrap"><table className="comparison-table"><caption>Project comparison. No published performance or customer outcome figures are available.</caption><thead><tr><th scope="col">Project</th><th scope="col">Workflow</th><th scope="col">Stack / runtime</th><th scope="col">Privacy and local preview</th><th scope="col">Source</th></tr></thead><tbody>{visible.map(project => <tr className="comparison-row" key={project.slug}><th scope="row"><Link href={`/projects/${project.slug}/`}>{project.name}</Link><small>{project.category}</small></th><td>{facts[project.slug].workflow}</td><td>{facts[project.slug].runtime}</td><td>{facts[project.slug].interaction}<small>Preview data stays in this browser; no live model or customer metrics shown.</small></td><td>{project.repository && <a href={project.repository} target="_blank" rel="noreferrer">Repository ↗</a>}</td></tr>)}</tbody></table></div><p className="comparison-note">Local requirements and capabilities follow each repository’s current README. Hardware and dependency details vary by machine.</p></div>;
}
