---
'astro': patch
---

Fixes a race condition during dev where renaming a content collection image and updating its reference would cause an `ImageNotFound` error. The data store and asset imports files are now written in the correct order, ensuring `content-assets.mjs` is up-to-date before the data store change triggers a page reload.
