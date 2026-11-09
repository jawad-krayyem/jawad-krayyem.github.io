# Portfolio Enhancements Design

## Intent

Extend Jawad Krayyem's portfolio with the twenty enhancements proposed in the conversation. The portfolio should work for recruiters, clients, and developers: make project work easier to understand, provide credible evidence, and give visitors useful ways to explore and make contact.

## Existing foundation

The site already has four project case studies, project category filters, a project processor with a reveal state, two captioned sample walkthrough videos, simple project pipelines, notes, a résumé, contact links, a terminal lab, consent-gated Google Analytics, a custom cursor, and persistent light/dark themes. Improvements should deepen these experiences rather than replace them.

## Goals

1. Add an explodable CPU with individually selectable compute tiles and accessible controls.
2. Add clearly labeled, local sample demos and guided tours for all four projects.
3. Improve evidence, measurement transparency, architecture views, implementation maps, trade-off notes, privacy disclosures, and project status visibility.
4. Add recruiter, client, and developer pathways; project comparison; and skill-to-project evidence links.
5. Add offline support, keyboard and reduced-motion support, project-specific sharing metadata, and contextual contact links.

## Non-goals and safeguards

- Do not invent customer counts, performance results, releases, employment history, testimonials, or other personal facts.
- Do not include FRACTURE or StudyFlow in portfolio content.
- Do not send sample-demo input to a backend or third party. Label synthetic data and non-live inference clearly.
- Do not add new analytics vendors or bypass the existing analytics-consent choice.
- Do not cache or store private information in the offline cache.
- Keep the website English-only, as requested. Do not add a language selector or RTL behavior.

## Approaches

- **Add all content inline to the existing pages:** fastest initially, but makes project data inconsistent and case-study components unwieldy.
- **Create one shared project-enhancement schema and reusable components:** recommended. Each project keeps its existing source data and gains structured evidence, architecture, decisions, demo, and contact metadata. Shared components render consistent case-study sections, while client-only pieces handle the demos and CPU interactions.
- **Build a separate portal or connect live services:** would add deployment and privacy dependencies, and is unnecessary for this static GitHub Pages portfolio.

The shared-schema approach is selected because it keeps the site static, self-contained, consistent, and easy to maintain.

## Feature mapping

1. CPU exploded-view mode with drag orbit, keyboard controls, and reset.
2. Selectable chiplet hotspots linked to project case studies.
3. Four local interactive sample demos using synthetic inputs.
4. Step-based guided tours derived from existing project descriptions and videos.
5. Evidence cards for verified project outcomes; show a clear unavailable state where no measured outcome has been provided.
6. Reproducible benchmark cards and a measurement protocol; never present unmeasured values as results.
7. Expandable project architecture diagrams.
8. Source-linked implementation maps.
9. Explicit engineering decisions and trade-offs.
10. Clear local/cloud, sample/live, dependency, hardware, and privacy disclosures.
11. Source/release status links with no stale promise of a live service.
12. Recruiter, client, and developer discovery paths.
13. Side-by-side project comparison.
14. Skill-to-project evidence map.
15. A project build-story timeline using factual implementation phases, not invented dates.
16. Role-focused résumé views that reuse verified content only.
17. English-only interface; Arabic language selection and RTL behavior were explicitly declined by the user.
18. Static offline shell with a bounded same-origin cache that excludes analytics and user-entered data.
19. Keyboard-operable, reduced-motion-aware interactions and accessible media transcripts.
20. Project-specific Open Graph images and contact email drafts with contextual subjects.

## Constraints

- Preserve the current Liquid Glass visual system, existing routes, project content, theme switch, cursor opt-out, consent controls, and the CPU's existing click-to-reveal behavior.
- Remain compatible with Next.js static export on GitHub Pages.
- Use no new runtime service or paid dependency.
- Keep sample content visibly synthetic and keep the project site's privacy choices intact.
- Implement all twenty feature areas in a small number of cohesive iterations and run the existing browser smoke checks plus production build before publishing.

## Acceptance

- Each numbered feature has a working interface or a transparent, functional evidence state rather than placeholder claims.
- A visitor can complete every new interaction by keyboard, and reduced-motion preferences are respected.
- The portfolio remains usable with WebGL unavailable and offline after one successful visit.
- The interface remains English-only and the light/dark controls work.
- No unverified impact or performance values appear anywhere on the site.
- Existing project links, privacy controls, theme preference, and analytics consent continue to work.
