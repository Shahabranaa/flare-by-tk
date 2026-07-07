---
name: Next.js install in Replit
description: Replit package firewall blocks next.js tarballs; workaround for running Next.js dev/build/start scripts
---

The Replit package firewall returns HTTP 403 for next.js tarballs, even though the package binary is already present at `node_modules/next/dist/bin/next` after a partial pnpm install. pnpm's install fails partway through and does not create the `.bin/next` symlink.

**The fix:** In `package.json` scripts, call the binary directly instead of relying on the `.bin` symlink:

```json
"dev": "node node_modules/next/dist/bin/next dev -p ${PORT:-3001}",
"build": "node node_modules/next/dist/bin/next build",
"start": "node node_modules/next/dist/bin/next start -p ${PORT:-3001}"
```

**Why:** pnpm resolves and symlinks next's dependency tree successfully (busboy, react, etc.) but can't download the next tarball itself. The binary lands at `node_modules/next/dist/bin/next` via an earlier install or the .pnpm virtual store, but the `.bin/next` wrapper is never created. Calling `node` directly bypasses the missing symlink entirely.

**How to apply:** Any time you create a Next.js artifact in this workspace, use the `node node_modules/next/dist/bin/next` form for all scripts. Also add `next` to `minimumReleaseAgeExclude` in `pnpm-workspace.yaml` to allow the latest release through if the firewall is ever lifted.
