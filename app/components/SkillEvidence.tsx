import { skills } from '../lib/projects';
const evidence: Record<string, { project: string; path: string; href: string }[]> = {
  Interfaces: [
    { project: 'InsightPilot', path: 'frontend/main.tsx', href: 'https://github.com/jawad-krayyem/insightpilot-RAG/blob/main/frontend/main.tsx' },
    { project: 'SDXL Studio', path: 'frontend/main.tsx', href: 'https://github.com/jawad-krayyem/SDXL/blob/main/frontend/main.tsx' },
    { project: 'The Interview Room', path: 'frontend/index.tsx', href: 'https://github.com/jawad-krayyem/ai-interview/blob/main/frontend/index.tsx' },
  ],
  'Backend & data': [
    { project: 'InsightPilot', path: 'backend/main.py', href: 'https://github.com/jawad-krayyem/insightpilot-RAG/blob/main/backend/main.py' },
    { project: 'The Interview Room', path: 'backend/main.py', href: 'https://github.com/jawad-krayyem/ai-interview/blob/main/backend/main.py' },
    { project: 'Datheon Workbench', path: 'src/datheon_ai/schemas.py', href: 'https://github.com/jawad-krayyem/Datheon_Generative_AI_Internship/blob/main/src/datheon_ai/schemas.py' },
  ],
  'Applied AI': [
    { project: 'InsightPilot', path: 'backend/main.py', href: 'https://github.com/jawad-krayyem/insightpilot-RAG/blob/main/backend/main.py' },
    { project: 'SDXL Studio', path: 'backend/main.py', href: 'https://github.com/jawad-krayyem/SDXL/blob/main/backend/main.py' },
    { project: 'Datheon Workbench', path: 'src/datheon_ai/rag.py', href: 'https://github.com/jawad-krayyem/Datheon_Generative_AI_Internship/blob/main/src/datheon_ai/rag.py' },
  ],
  'Systems & tooling': [
    { project: 'InsightPilot', path: 'README.md', href: 'https://github.com/jawad-krayyem/insightpilot-RAG/blob/main/README.md' },
    { project: 'The Interview Room', path: 'readme.md', href: 'https://github.com/jawad-krayyem/ai-interview/blob/main/readme.md' },
    { project: 'Datheon Workbench', path: 'tests/test_extraction.py', href: 'https://github.com/jawad-krayyem/Datheon_Generative_AI_Internship/blob/main/tests/test_extraction.py' },
  ],
};
export default function SkillEvidence() {
  return <section className="section-container skill-evidence-section" aria-labelledby="skill-evidence-title"><div className="section-heading"><div><p className="eyebrow">Skills, tied to source</p><h2 id="skill-evidence-title">Show me where it lives.</h2></div><p>Each link opens a relevant file in a public project repository.</p></div><div className="skill-evidence-grid">{skills.map(group => <article className="skill-evidence" key={group.title}><span>{group.title}</span><ul>{group.items.map(skill => <li key={skill}>{skill}</li>)}</ul><div>{evidence[group.title].map(item => <a href={item.href} target="_blank" rel="noreferrer" key={`${item.project}-${item.path}`}><strong>{item.project}</strong><code>{item.path}</code></a>)}</div></article>)}</div></section>;
}
