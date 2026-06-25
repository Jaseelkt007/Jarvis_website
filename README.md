# Voxhelm — marketing & download site

The Voxhelm marketing site. Built with **Astro + React + Tailwind + Framer Motion**,
output as **static HTML (SSG)** and served on **Cloudflare Pages** at
[voxhelm.de](https://voxhelm.de).

Astro renders every page to real HTML at build time, so all copy is in the page
source — readable by Google, ChatGPT/Claude, and non-JS scrapers. The cinematic
hero is a React/Framer-Motion island hydrated on top of that HTML.

```
src/
  layouts/Base.astro      SEO head: meta, OG/Twitter, canonical, JSON-LD, fonts
  components/Hero.tsx      cinematic React island (video bg, staggered headline)
  pages/
    index.astro            home (hero island + features/how/pricing/FAQ/download)
    privacy.astro          privacy policy
    terms.astro            terms of service
    welcome.astro          Stripe checkout success (noindex)
  styles/global.css        Tailwind + liquid-glass + glass-card utilities
public/
  robots.txt               allows search + AI crawlers; points to sitemap
  sitemap.xml              hand-authored (small fixed page set)
  llms.txt                 plain-text product summary for AI agents
  og.svg, favicon.svg
  downloads/               installer .exe — gitignored, staged at deploy time
```

## Develop / build

```bash
npm install
npm run dev       # local dev at http://localhost:4321
npm run build     # → dist/  (static HTML)
```

## Deploy (Cloudflare Pages, direct upload — repo can stay private)

```bash
# 1. stage the freshly-built installer into the build output
mkdir -p public/downloads
cp /path/to/Voxhelm_x.y.z_x64-setup.exe public/downloads/Voxhelm-Setup.exe

# 2. build, then publish dist/ to the `voxhelm` Pages project
npm run build
npx wrangler pages deploy dist --project-name voxhelm --branch main
```

Custom domain `voxhelm.de` (+ `www`) is attached to the `voxhelm` Pages project.
The download button targets `/downloads/Voxhelm-Setup.exe`, so it works on any
domain the project is bound to.

## SEO
- Per-page `<title>`/description, canonical, Open Graph + Twitter cards.
- JSON-LD: `Organization`, `WebSite`, `SoftwareApplication` (with pricing offers),
  and `FAQPage` on the home page.
- `robots.txt` explicitly welcomes GPTBot / ClaudeBot / PerplexityBot etc.;
  `llms.txt` gives AI agents a clean product summary.

## Follow-ups
- The hero background video (`HERO_VIDEO` in `Hero.tsx`) is a placeholder — swap
  for on-brand footage anytime.
- The installer is unsigned → SmartScreen warns "unknown publisher" (code-signing
  cert is a launch follow-up).
- Set up Cloudflare Email Routing so `support@voxhelm.de` forwards to a real inbox.
