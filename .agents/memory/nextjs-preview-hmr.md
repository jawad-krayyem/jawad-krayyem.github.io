---
name: Next.js preview HMR
description: A preview-only HMR WebSocket failure observed in the portfolio while pages and production export worked.
---

In this workspace, Next.js Turbopack's HMR WebSocket returned 502 through the Replit preview proxy even though page routes loaded and the static production export built successfully. Adjusting dev-origin allowances and explicitly listing the HMR route did not resolve it.

**Why:** the observed failure is in preview WebSocket delivery, not the app's page rendering or static build.

**How to apply:** verify the route and production build before changing app code to address this symptom. Treat it as a preview live-reload issue until proxy behavior or new evidence points elsewhere.
