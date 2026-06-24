---
'astro': patch
---

Fixes dev server script paths (`/@vite/client`, dev toolbar) to include the configured `base` path prefix. This allows the dev server to work correctly when accessed through a path-based reverse proxy (e.g. code-server's `/absproxy/{port}`) that preserves the URL path.
