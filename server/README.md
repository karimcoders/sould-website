# Content Server — "CMS bina GitHub"

Ye chhota sa server (koi dependency nahi, sirf Node) website ko serve karta hai aur
content apne paas rakhta hai. Client sirf password jaanta hai — **Save** dabaate hi
website update ho jaati hai. Na token, na repo, na GitHub.

```
node server/server.js          # http://localhost:8000
PORT=3000 node server/server.js
```

| | |
|---|---|
| Website | `/index.html` |
| Admin | `/admin.html` (password default `sould2026`) |
| Content | `server/data/content.json` |
| Backups | har save par `server/data/backup-*.json` (last 20) |
| Uploads | `server/data/uploads/` |

## API

| Method | Endpoint | Body | Kaam |
|---|---|---|---|
| GET | `/api/content` | — | poori site ka content (JSON) |
| POST | `/api/save` | `{password, content}` | content save (public site turant update) |
| POST | `/api/upload` | `{password, name, dataUrl}` | image upload |
| POST | `/api/password` | `{password, newPassword}` | panel password badlo |
| GET | `/api/health` | — | server zinda hai? |

## Password

Pehli baar chalane par `server/data/config.json` ban jaata hai (default `sould2026`).
Badalne ke liye: `CMS_PASSWORD=apnapassword node server/server.js`, ya file edit karo,
ya admin panel → **Publish & Settings → /api/password**.

## Hosting — 5 minute me live

**Render.com (free, sabse aasan)**
1. [render.com](https://render.com) → New → **Blueprint** → apna repo `karimcoders/sould-website` chuno
   (`render.yaml` already repo me hai).
2. `CMS_PASSWORD` env var me apna password likho → **Apply**.
3. Ready hone par URL milega, jaise `https://sould-cms.onrender.com`.
   Website: `/index.html` · Admin: `/admin.html`.

**Railway / Fly.io** — repo import karo, start command `node server/server.js`.

**Apna VPS / cPanel (Node app)**
```bash
git clone https://github.com/karimcoders/sould-website.git && cd sould-website
CMS_PASSWORD=apnapassword PORT=8080 node server/server.js
# ya: docker build -t sould . && docker run -p 8000:8000 -e CMS_PASSWORD=apnapassword sould
```

**Dhyan rakho:** data folder (`server/data/`) ko host ke disk par rehne do, ya
persistent volume mount karo (Render free me disk reset ho sakti hai — tab
`server/data/content.json` ka backup rakhna).

## GitHub Pages ke saath mix

Agar website GitHub Pages par hi rakhni hai aur sirf CMS server pe, to server ko
kisi bhi host par chalao aur admin → *Publish server* box me us URL ko daal do
(CORS already on hai). Details main `README.md` me.
