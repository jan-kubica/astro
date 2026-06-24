---
'astro': patch
---

Fixes localized 404 pages not being served in dev mode when using i18n with `prefixDefaultLocale: true`. Also fixes localized 404/500 pages generating as `[locale]/404/index.html` instead of `[locale]/404.html` during static builds.
