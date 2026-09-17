# Soul-D. — Website + Content Manager (CMS)

A pixel-faithful SPA clone of **soulddigitalmarketing.com** with a built-in
**WordPress-style admin panel** so the client can change every word, image and
list on the site — without touching code.

---

## 🔗 Links

| | |
|---|---|
| **Website** | `/index.html` (or just the domain root) |
| **Admin panel** | `/admin.html` |
| **Default password** | `sould2026` — change it in **Publish & Settings** |

---

## ✨ What the client can edit (100% of the site)

| CMS section | Controls |
|---|---|
| **Dashboard** | Overview, publish steps, backup / restore |
| **Page Text** | Every heading, paragraph and button label on all pages |
| **Brand & Contact** | Business name, tagline, email, phone, WhatsApp, address, hours, social links, logos |
| **Hero Slideshow** | Home page background images (add / remove / reorder) |
| **Page Headings** | Banner titles for Services, Work, About, Contact + all CTA blocks |
| **Services** | 8 services — name, slug, icon, category, description, feature bullets, image, and the project cards inside each one |
| **Case Studies** | Our Work page projects — client, title, result badge, description, highlights, tags, image |
| **Testimonials** | Client reviews (shown 3 at a time) |
| **FAQ** | Questions + answers |
| **About & Team** | Company values, team cards, the two collage photos, "what we do" list |
| **Stats / Process / Logos** | The 4 counters, delivery process steps, client logo strip, filter labels |
| **Publish & Settings** | GitHub connection, password, exports, reset |

**Formatted text:** type `[b]blue text[/b]` to colour words Soul-D blue — used for
headlines like `The Best [b]Digital Marketing[/b]`.

---

## 🚀 How the client publishes (3 clicks)

1. **Edit** anything, click **Save Draft** → saved privately in their browser.
2. Click **Preview** → see the change on the real website instantly.
3. Click **Publish** → content is committed to `content.json` on GitHub and the
   live site updates in about a minute.

Before the first publish, open **Publish & Settings** and fill in:

| Field | Example |
|---|---|
| Repository | `karimcoders/sould-website` |
| Branch | `main` |
| Content file path | `content.json` |
| GitHub access token | a fine-grained token with **Contents: Read & write** |

> The token is stored **only in the client's browser** (localStorage). It is never
> written into the website files and never visible to visitors. Treat it like a password.
> Create one at **GitHub → Settings → Developer settings → Personal access tokens**.

---

## 🧱 How it works

```
index.html          loads defaults → content.json        → localStorage draft   → renders
admin.html          edits the same structure, writes the draft, publishes content.json
content.json        the single source of truth for all site content
src/content-defaults.js   the built-in fallback (the original site content)
src/app.js          the website  (router + components, renders from CONTENT)
src/admin.js        the CMS      (form builders for every content type)
src/styles.css      website styles
src/admin.css       admin styles
assets/             photos, logos, fonts
```

**Three content layers**, lowest priority first:
1. `src/content-defaults.js` — always present, so the site never breaks
2. `content.json` — what the client published (read by the live site)
3. `localStorage` draft — only in the client's own browser, for previewing

---

## 🌐 Deploying it live

The repo is a plain static site — no build step.

**Netlify (recommended):** New site → Import from GitHub → pick `sould-website` →
leave build command empty, publish directory `.`  → Deploy.
`netlify.toml` already disables caching for `content.json`.

**Vercel:** New Project → import the repo → Framework preset **Other** → Deploy.
`vercel.json` is included.

**GitHub Pages:** Settings → Pages → Source: `main` / root. Done.

**Own hosting / cPanel:** upload everything in this folder to `public_html`.

Point the domain at it and you're finished.

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
- The contact form validates and confirms but does not send email yet — wire it to
  Formspree / EmailJS / a backend when you're ready.
- If an uploaded image makes content bigger than ~1 MB, the CMS warns you; prefer
  uploading compressed photos.
