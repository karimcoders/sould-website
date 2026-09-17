# Soul-D. — Website + Content Manager (CMS)

A pixel-faithful SPA clone of **soulddigitalmarketing.com** with a built-in
**WordPress-style admin panel** so the client can change every word, image and
list on the site — without touching code.

---

## 🌍 Live URLs

| | |
|---|---|
| **Website** | https://karimcoders.github.io/sould-website/ |
| **Admin panel** | https://karimcoders.github.io/sould-website/admin.html |
| **Password** | `sould2026` — change it in **Publish & Settings** the first time |

---

## 🚀 Publishing — three options

### Option 1 · Auto-publish (what most people want) ⭐

1. Open **Publish & Settings**.
2. Repository / Branch / Content file are **already filled in** — leave them.
3. Paste a GitHub access token once, press **Save settings**.
4. Tick **"Publish automatically after every save"**.
5. Done. From now on the client just edits and presses **Save Draft** — it goes
   live by itself, ~1 minute later.

> **Getting the token:** GitHub → Settings → Developer settings → Personal access
> tokens → **Tokens (classic)** → Generate new token → tick **`repo`** → copy.
> It is stored **only in the client's browser**, never in the website files, and
> never visible to visitors.

### Option 2 · No token for the client at all (most secure)

Deploy the tiny **publish server** in `proxy/` once. The GitHub token then lives on
the server and the client only ever types the CMS password.

**Cloudflare Worker** (free, ~2 minutes) — paste `proxy/cloudflare-worker.js` into a
new Worker, then add these variables under *Settings → Variables*:

| Variable | Value |
|---|---|
| `GH_TOKEN` | your GitHub token (`repo` scope) |
| `GH_REPO` | `karimcoders/sould-website` |
| `GH_BRANCH` | `main` |
| `GH_FILE` | `content.json` |
| `CMS_PASSWORD` | the CMS password |
| `ALLOW_ORIGIN` | `https://karimcoders.github.io` (optional lock-down) |

Copy the worker URL (`https://xxxx.workers.dev`) into the CMS →
**Publish & Settings → "Publish server (optional)"**. The token box can then be
left empty — the client never sees GitHub at all.

`proxy/vercel-api/publish.js` does the same job on Vercel (`api/publish.js`) or
Netlify (`netlify/functions/publish.js`) with the same environment variables.

### Option 3 · Manual backup

**Dashboard → Export content.json**, edit it by hand if you must, and commit it.

---

## ✨ What the client can edit (100% of the site)

| CMS section | Controls |
|---|---|
| **Dashboard** | Publishing status, step-by-step help, backup / restore |
| **Page Text** | Every heading, paragraph and button label on all pages |
| **Brand & Contact** | Business name, tagline, email, phone, WhatsApp, address, hours, social links, logos |
| **Hero Slideshow** | Home page background images (add / remove / reorder) |
| **Page Headings** | Banner titles for Services, Work, About, Contact + all CTA blocks |
| **Services** | 8 services — name, slug, icon, category, description, bullets, image, and the project cards inside each one |
| **Case Studies** | Our Work projects — client, title, result badge, description, highlights, tags, image |
| **Testimonials** | Client reviews (3 shown at a time) |
| **FAQ** | Questions + answers |
| **About & Team** | Company values, team cards, collage photos, "what we do" list |
| **Stats / Process / Logos** | The 4 counters, delivery steps, client logo strip, filter labels |
| **Publish & Settings** | GitHub connection, auto-publish, publish server, password, reset |

**Formatted text:** type `[b]blue text[/b]` to colour words Soul-D blue — e.g.
`The Best [b]Digital Marketing[/b]`.

---

## 🧱 How it works

```
index.html          defaults → content.json → localStorage draft → renders
admin.html          edits the same structure, saves the draft, publishes
content.json        single source of truth for all site content
src/content-defaults.js   built-in fallback (the original site content)
src/app.js          the website  (router + components, renders from CONTENT)
src/admin.js        the CMS      (form builders for every content type)
src/styles.css      website styles
src/admin.css       admin styles
assets/             photos, logos, fonts
proxy/              optional serverless publisher (no client token)
```

**Three content layers**, lowest priority first:
1. `src/content-defaults.js` — always present, so the site never breaks
2. `content.json` — what the client published (read by the live site)
3. `localStorage` draft — only in the client's own browser, for previewing

---

## 🌐 Deploying to your own domain

Plain static site — no build step.

**Netlify:** New site → Import from GitHub → publish directory `.` → Deploy.
`netlify.toml` already disables caching for `content.json`.

**Vercel:** New Project → import repo → Framework preset **Other** → Deploy.
`vercel.json` is included.

**GitHub Pages:** already enabled (Settings → Pages → `main` / root).

**cPanel / own hosting:** upload everything in this folder to `public_html`.

---

## 🛠 Local preview

```bash
python3 -m http.server 8000
# website → http://localhost:8000/index.html
# admin   → http://localhost:8000/admin.html
```

## 📦 Pages included

`/` Home · `/services` + 8 service detail pages · `/work` · `/about` · `/contact`
Routing is hash-based (`#/services`, `#/work`, …) so it works on any host without
server config.

## 🔒 Notes

- Change the admin password on first login.
- Revoke any token that has been shared in a chat and generate a fresh one.
- The contact form validates and confirms but does not send email yet — wire it to
  Formspree / EmailJS / a backend when you're ready.
- If an uploaded image pushes the content over ~1 MB the CMS warns you; prefer
  compressed photos or image URLs.
