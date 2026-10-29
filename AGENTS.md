<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Project rules
- All visible copy lives in src/locales/<lang>/*.json (namespaces common, home, faq, seo); components use react-i18next `t()`. Why: the PRD forbids hardcoded strings and needs new languages by copying JSON.
- Languages are declared once in SUPPORTED_LANGS (src/i18n/index.ts); pages live under the /$lang route and / redirects to the default. Why: URL-prefixed i18n with hreflang.
- Business data (prices, rating, booking URL, socials, flags) lives only in src/config/site.ts; photo paths only in src/data/media.ts. Why: swap data/photos without touching components.
- Never show invented reviews, addresses or schedules; testimonials stay behind SITE.showTestimonials. Why: client requirement.
