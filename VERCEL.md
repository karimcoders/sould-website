# Vercel par deploy — 3 minute me live (admin ke saath)

Repo: `karimcoders/sould-website` · Website + Admin dono Vercel par chalenge.

---

## 1 · Vercel par project banao

1. [vercel.com](https://vercel.com) → **Add New → Project**
2. **Import Git Repository** → `karimcoders/sould-website` → **Import**
3. Settings (bas itna):
   - **Framework Preset:** `Other`
   - **Build Command:** *(khaali chhod do)*
   - **Output Directory:** *(khaali chhod do — plain static site hai)*
   - **Root Directory:** `./`
4. **Environment Variables** me ye 4 add karo (Settings → Environment Variables):

| Name | Value | Kya hai |
|---|---|---|
| `GH_TOKEN` | `github_pat_...` | GitHub token (**repo** scope) — sirf server pe rehta hai |
| `GH_REPO` | `karimcoders/sould-website` | kahan content commit karna hai |
| `CMS_PASSWORD` | apna password | admin panel ka password |
| `GH_BRANCH` | `main` | optional |
| `GH_FILE` | `content.json` | optional |

5. **Deploy** dabao. 40 second me URL milega:
   `https://sould-website.vercel.app`

---

## 2 · Client ko sirf ye dena hai

| | |
|---|---|
| **Website** | `https://sould-website.vercel.app` |
| **Admin** | `https://sould-website.vercel.app/admin.html` |
| **Password** | aapka `CMS_PASSWORD` |

Bas. Client **koi GitHub token nahi** daalega — token Vercel ke environment me
server-side rehta hai. Admin khulte hi **"Publish server live hai"** dikhega aur
**Save** karte hi content GitHub me commit ho kar ~1 minute me live ho jayega.

---

## 3 · Kaise kaam karta hai

```
admin.html  --(Save / Publish)-->  /api/publish  (Vercel function, token yahan hai)
                                        |
                                        v
                        GitHub commit: content.json
                                        |
                                        v
                     Vercel rebuild (~30s) → naya content live
```

`api/publish.js` already repo me hai. Admin khud usko `GET` karke detect karta hai,
isliye kuch configure karne ki zarurat nahi.

---

## 4 · Content edits **turant** chahiye (rebuild wait nahi)?

Do options:

1. **GitHub Pages ko hi website rakho** — Vercel sirf publish endpoint ke liye
   (Static site Vercel par bhi deploy karna hai to chalta hai). Pages par commit
   hone ke baad ~1 min me update hota hai.
2. **Content server chalao** (`server/server.js` — Render/Railway/VPS): wahan
   content server ke paas rehta hai, isliye Save = **0 second** live, koi rebuild nahi.
   Details: `server/README.md`.

---

## 5 · Apna domain

Vercel → Project → **Settings → Domains** → apna domain add karo, DNS me dikhaye
gaye records daal do. Admin usi domain par `/admin.html` pe chalega.

---

## 6 · Security checklist

- [ ] `CMS_PASSWORD` strong rakho (Vercel env var me, code me nahi)
- [ ] GitHub token **fine-grained** banao, sirf is repo ka *Contents: Read & write*
- [ ] Admin URL public hai — password hi protection hai; chaaho to Vercel ka
      **Password Protection** (Pro) ya Cloudflare Access laga do
- [ ] Kabhi bhi token chat/email me share na karo — jo share ho gaya use **revoke** karo
