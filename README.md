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

## 🚀 Publishing — client ke liye sirf "Save"

### Option 1 · Content server — **bina GitHub** ⭐ (recommended)

Website aur admin dono ek chhote Node server se chalte hain. Client sirf password
jaanta hai; **Save** dabaate hi website update ho jaati hai — WordPress jaisa.

```bash
node server/server.js        # http://localhost:8000   (admin: /admin.html)
```

Live karne ke liye: [render.com](https://render.com) → **New → Blueprint** → ye repo
chuno (`render.yaml` already andar hai) → `CMS_PASSWORD` daalo → Deploy. Bas.
Details: **`server/README.md`** (Railway / Fly / VPS / Docker bhi).

- Content server ke paas rehta hai (`server/data/content.json`), har save ka backup banta hai.
- Na token, na repo, na GitHub account — client ke liye sirf ek password.
- Local chala kar dekhna ho: `python3 -m http.server` ki jagah `node server/server.js` use karo.

### Option 2 · GitHub token se auto-publish

Admin → **Publish & Settings** me repository / branch / file **pehle se bhari hui** hai.
Sirf ek baar GitHub token paste karo, **"Publish automatically after every save"** tick karo —
uske baad client jo bhi edit karke **Save Draft** dabayega, woh khud live chala jayega.

> **Token kaise banaen:** GitHub → Settings → Developer settings → Personal access tokens →
> **Tokens (classic)** → Generate new token → **`repo`** tick karo → copy.
> Token sirf client ke browser me rehta hai, website files me kabhi nahi.

### Option 3 · Publish server (GitHub Pages ke saath, client ko token nahi)

`proxy/cloudflare-worker.js` (ya `proxy/vercel-api/publish.js`) deploy karo — token
server pe rahega. Worker ka URL admin ke **"Publish server"** box me daal do.

### Option 4 · Manual backup

**Dashboard → Export content.json**, aur chaaho to commit kar do.

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
server/             content server — website + admin, GitHub ki zarurat nahi
proxy/              optional serverless publisher (GitHub Pages ke liye)
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
