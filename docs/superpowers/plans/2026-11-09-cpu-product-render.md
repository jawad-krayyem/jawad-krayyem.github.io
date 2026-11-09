# CPU Product Render Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the interactive processor read as a detailed, physically plausible CPU while preserving the portfolio's click-to-reveal experience.

**Architecture:** Continue to generate all geometry and textures in `processor-scene.ts` with the existing Three.js dependency. Build the closed processor from rounded substrate layers, fine board details, a brushed and etched heat spreader, then expose a chiplet-style silicon layout and restrained thermal lighting as the spreader lifts. Keep the static SVG poster visually consistent as the WebGL fallback.

**Tech Stack:** Next.js 16, React 19, Three.js 0.185.1, CanvasTexture, existing CSS.

**Spec:** `docs/superpowers/specs/2026-11-08-portfolio-design.md`

## Global Constraints

- Keep the static GitHub Pages export and existing hero project links working.
- Generate model details procedurally; do not download or add external 3D assets.
- Preserve render-on-demand, DPR cap 1.6, offscreen/hidden pausing, reduced-motion support, and full renderer/resource disposal.
- Keep the scene operable through the existing accessible button and static poster fallback.
- Keep changes in the existing checkout, following the approved portfolio workflow.
- Do not add or run automated tests unless the user asks; use the production build and visible browser review.

## Review Focus

- Closed chip should read as machined metal over a layered CPU package in both Liquid Glass themes.
- Opening the chip should clearly reveal silicon, routing and contact details while the existing project cards remain usable.
- Mobile canvas sizing and the static poster should still show the full processor without clipping.
- Reduced motion should still make the reveal immediate and stable.
- All new textures, geometry and materials should be disposed with the existing scene.

### Task 1: Add product-grade CPU geometry and materials

**Files:** Modify `app/lib/processor-scene.ts`.

- [ ] Replace sharp package slabs with beveled substrate layers and a subtly reflective inspection plinth; remove the CAD-like floor grid.
- [ ] Rework the heat-spreader finish into brushed metal with a fine laser-marked label and tiny serial/QR details.
- [ ] Add efficient instanced routing, vias and soldered surface-mount parts around the carrier.
- [ ] Render the underlying silicon as a non-metallic, multi-chip assembly with dense microcircuit texture and believable interposer detail.
- [ ] Keep camera framing and lights balanced for the existing hero area in dark and light themes.

### Task 2: Improve reveal and fallback consistency

**Files:** Modify `app/lib/processor-scene.ts`, `app/components/ProcessorExplorer.tsx`.

- [ ] Make the lid's existing eased reveal uncover the new chiplet layout and bring in a subtle cool thermal glow only as it opens.
- [ ] Preserve immediate reduced-motion behavior, render-on-demand settling and cleanup of every new GPU resource.
- [ ] Update the inline SVG fallback so it retains the layered substrate and product labeling when WebGL is unavailable.

### Task 3: Inspect and publish

**Files:** Update this plan and the portfolio design spec with final outcomes.

- [ ] Run the production build and check the working tree diff.
- [ ] Inspect the published CPU closed and open in the light and dark themes; verify the existing project reveal remains usable.
- [ ] Commit and push the finished scene to `main`; confirm GitHub Pages deployment succeeds.
