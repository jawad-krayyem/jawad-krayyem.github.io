---
name: Workspace package installs
description: How to add dependencies to a specific package in this pnpm monorepo.
---

Install a dependency into its owning workspace package, not the monorepo root. The package installer helper does not accept pnpm filter flags; if it targets the root or rejects a filter token, use `pnpm --filter @workspace/<package> add <dependency>` so the package manifest and lockfile stay scoped correctly.

**Why:** An unfiltered install attempted to add a package to the workspace root, and the helper rejected `--filter` as an invalid package token.

**How to apply:** For future dependency changes, prefer the package installer when no workspace selection is needed; otherwise use pnpm's explicit workspace filter from the shell.
