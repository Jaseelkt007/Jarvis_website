# Captain — marketing & download site

Static site (plain HTML/CSS, no build step) for **Captain**. Brand matches the
desktop hub (warm off-white, ink text, single teal accent).

```
index.html     landing (hero, how-it-works, features, pricing, download)
welcome.html   Stripe checkout SUCCESS page (subscription active → open the app)
privacy.html   privacy policy (template — get legal review)
terms.html     terms of service (template — get legal review)
styles.css     the design system
```

## Deploy (pick one)

**Cloudflare Pages (recommended — free, fast, your stack):**
1. Cloudflare dashboard → Workers & Pages → Create → Pages → Connect to Git → this repo.
2. Framework preset: **None**. Build command: *(empty)*. Output dir: `/` (root).
3. Deploy. You get `https://<project>.pages.dev`; add a custom domain if you have one.
   (Pages serves `welcome.html` at both `/welcome.html` and `/welcome`.)

**GitHub Pages:** repo Settings → Pages → Deploy from branch → `main` / root.
(Use the `.html` links as-is.)

## Hosting the installer download — IMPORTANT (the Jarvis code repo is private)

The private `Jarvis/` repo's Releases are **not** publicly downloadable, so host the
installer somewhere public. Easiest: a **GitHub Release on THIS (public) repo**.

1. Make this `Jarvis_website` repo **Public** (Settings → Danger Zone).
2. Build the installer (`build-installer.ps1` in the Jarvis repo) → get
   `Captain_x.y.z_x64-setup.exe`.
3. Here → **Releases → Draft a new release** → tag e.g. `v0.3.0` → upload the `.exe`,
   **renaming the asset to `Captain_x64-setup.exe`** (so the link is version-stable).
4. The Download button already points at:
   `https://github.com/Jaseelkt007/Jarvis_website/releases/latest/download/Captain_x64-setup.exe`
   — it resolves to whatever the latest release's `Captain_x64-setup.exe` is.

Alternatives: Cloudflare R2 (host the `.exe`, update the button href) or a `downloads/`
folder committed here (simplest, but binaries bloat git history).

## Wire Stripe to this site (after it's deployed)

Once the site has a real URL, point the backend's checkout redirects at it
(in `Jarvis/backend/wrangler.jsonc`, then `wrangler deploy`):

```jsonc
"CHECKOUT_SUCCESS_URL": "https://YOUR-DOMAIN/welcome.html",
"CHECKOUT_CANCEL_URL":  "https://YOUR-DOMAIN/#pricing",
```

## Before public launch
- Replace `support@example.com` (nav/footer/legal) with your real support address.
- Have `privacy.html` / `terms.html` reviewed by a professional.
- Optional: a real domain, an OG/social image, analytics.
