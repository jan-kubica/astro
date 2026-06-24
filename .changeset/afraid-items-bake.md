---
'astro': patch
---

Fixes a false positive in the dev toolbar's accessibility audit where `<a>` elements with an explicit `role` attribute (e.g., `role="button"`) were incorrectly flagged for missing `href`
