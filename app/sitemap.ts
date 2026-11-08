import type { MetadataRoute } from 'next';
import { projects } from './lib/projects';
import { notes } from './lib/notes';
export const dynamic = 'force-static';
export default function sitemap(): MetadataRoute.Sitemap {
  return ['/', '/notes/', '/resume/', '/terminal/', '/privacy-policy/', ...projects.map(project => `/projects/${project.slug}/`), ...notes.map(note => `/notes/${note.slug}/`)].map(path => ({ url: `https://jawad-krayyem.github.io${path}` }));
}
