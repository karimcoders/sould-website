#!/usr/bin/env node
/* ---------------------------------------------------------------------------
   Soul-D. Content Server  —  "CMS bina GitHub"
   ---------------------------------------------------------------------------
   Ek chhota sa server (koi dependency nahi) jo:
     • poori website serve karta hai
     • content apne paas rakhta hai  (server/data/content.json)
     • admin panel se aane wale save seedha live kar deta hai  (POST /api/save)

   Chalane ka tarika:      node server/server.js
   Port badalna ho:        PORT=3000 node server/server.js
   Password badalna ho:    server/data/config.json  ({ "password": "..." })

   Iske saath content GitHub me jaata hi nahi — client sirf password daalta hai,
   Save dabata hai, aur turant website update ho jaati hai (WordPress jaisa).
--------------------------------------------------------------------------- */

const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.resolve(__dirname, '..');            // website folder
const DATA = path.join(__dirname, 'data');             // content + uploads
const CONTENT = path.join(DATA, 'content.json');
const CONFIG = path.join(DATA, 'config.json');
const UPLOADS = path.join(DATA, 'uploads');
const PORT = process.env.PORT || 8000;

fs.mkdirSync(DATA, { recursive: true });
fs.mkdirSync(UPLOADS, { recursive: true });

if (!fs.existsSync(CONFIG)) {
  fs.writeFileSync(CONFIG, JSON.stringify({ password: process.env.CMS_PASSWORD || 'sould2026' }, null, 2));
  console.log('• created server/data/config.json  (default password: sould2026 — badal lena)');
}
if (!fs.existsSync(CONTENT)) {
  const seed = path.join(ROOT, 'content.json');
  if (fs.existsSync(seed)) {
    fs.copyFileSync(seed, CONTENT);
    console.log('• seeded server/data/content.json from website content.json');
  } else {
    fs.writeFileSync(CONTENT, '{}');
  }
}

const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp',
  '.svg': 'image/svg+xml', '.gif': 'image/gif', '.ico': 'image/x-icon',
  '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf',
  '.mp4': 'video/mp4', '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml',
};

const md5 = (s) => crypto.createHash('md5').update(s).digest('hex');
const readConfig = () => { try { return JSON.parse(fs.readFileSync(CONFIG, 'utf8')); } catch { return { password: 'sould2026' }; } };
const okPass = (p) => String(p || '') === String(readConfig().password);

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}
const send = (res, code, obj) => {
  cors(res);
  const body = JSON.stringify(obj);
  res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8', 'Content-Length': Buffer.byteLength(body) });
  res.end(body);
};
function body(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (c) => { raw += c; if (raw.length > 25e6) reject(new Error('too big')); });
    req.on('end', () => { try { resolve(raw ? JSON.parse(raw) : {}); } catch (e) { reject(e); } });
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  const p = decodeURIComponent(url.pathname);

  if (req.method === 'OPTIONS') { cors(res); res.writeHead(204); return res.end(); }

  /* ------------------------------- API ------------------------------- */
  if (p === '/api/health') {
    return send(res, 200, { ok: true, service: 'sould-content-server', time: new Date().toISOString() });
  }

  if (p === '/api/content' && req.method === 'GET') {
    try {
      const stat = fs.statSync(CONTENT);
      const data = fs.readFileSync(CONTENT, 'utf8');
      if (!res.getHeader('Access-Control-Allow-Origin')) cors(res);
      res.writeHead(200, {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-store',
        'ETag': '"' + md5(data) + '"',
        'Access-Control-Allow-Origin': '*',
      });
      return res.end(data);
    } catch (e) { return send(res, 500, { ok: false, error: 'content unreadable' }); }
  }

  if (p === '/api/save' && req.method === 'POST') {
    try {
      const b = await body(req);
      if (!okPass(b.password)) return send(res, 401, { ok: false, error: 'Wrong password' });
      if (!b.content || typeof b.content !== 'object') return send(res, 400, { ok: false, error: 'content missing' });
      const json = JSON.stringify(b.content, null, 2);
      fs.writeFileSync(CONTENT + '.tmp', json);
      fs.renameSync(CONTENT + '.tmp', CONTENT);                 // atomic write
      fs.writeFileSync(path.join(DATA, 'backup-' + Date.now() + '.json'), json);   // simple backup
      const backups = fs.readdirSync(DATA).filter((f) => f.startsWith('backup-')).sort();
      backups.slice(0, Math.max(0, backups.length - 20)).forEach((f) => fs.unlinkSync(path.join(DATA, f)));
      console.log('• content saved', new Date().toLocaleString(), '  (' + json.length + ' bytes)');
      return send(res, 200, { ok: true, bytes: json.length, updatedAt: new Date().toISOString() });
    } catch (e) { return send(res, 400, { ok: false, error: String(e.message || e) }); }
  }

  if (p === '/api/upload' && req.method === 'POST') {
    try {
      const b = await body(req);
      if (!okPass(b.password)) return send(res, 401, { ok: false, error: 'Wrong password' });
      const m = /^data:image\/(png|jpe?g|webp|gif|svg\+xml);base64,(.+)$/i.exec(b.dataUrl || '');
      if (!m) return send(res, 400, { ok: false, error: 'unsupported image' });
      const ext = m[1].toLowerCase().replace('svg+xml', 'svg').replace('jpeg', 'jpg');
      const name = (b.name || 'upload').replace(/[^\w.\-]/g, '').replace(/\.[^.]*$/, '').slice(0, 40) || 'upload';
      const file = name + '-' + Date.now().toString(36) + '.' + ext;
      fs.writeFileSync(path.join(UPLOADS, file), Buffer.from(m[2], 'base64'));
      console.log('• image uploaded', file);
      return send(res, 200, { ok: true, url: 'server/data/uploads/' + file });
    } catch (e) { return send(res, 400, { ok: false, error: String(e.message || e) }); }
  }

  if (p === '/api/password' && req.method === 'POST') {
    try {
      const b = await body(req);
      if (!okPass(b.password)) return send(res, 401, { ok: false, error: 'Wrong password' });
      if (!b.newPassword || b.newPassword.length < 4) return send(res, 400, { ok: false, error: 'too short' });
      fs.writeFileSync(CONFIG, JSON.stringify({ password: b.newPassword }, null, 2));
      return send(res, 200, { ok: true });
    } catch (e) { return send(res, 400, { ok: false, error: String(e.message || e) }); }
  }

  if (p.startsWith('/api/')) return send(res, 404, { ok: false, error: 'unknown endpoint' });

  /* ---------------------------- static site --------------------------- */
  let file = path.join(ROOT, p === '/' ? 'index.html' : p);
  if (!file.startsWith(ROOT)) { res.writeHead(403); return res.end('forbidden'); }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  if (!fs.existsSync(file)) {
    // GitHub-Pages style: unknown path -> index.html (hash routing in this site)
    file = path.join(ROOT, 'index.html');
  }
  const ext = path.extname(file).toLowerCase();
  res.writeHead(200, {
    'Content-Type': MIME[ext] || 'application/octet-stream',
    'Cache-Control': ext === '.json' || ext === '.html' ? 'no-store' : 'public, max-age=300',
  });
  fs.createReadStream(file).pipe(res);
});

server.listen(PORT, '0.0.0.0', () => {
  console.log('\n  Soul-D. Content Server');
  console.log('  -------------------------------------------------');
  console.log('  Website :  http://localhost:' + PORT + '/index.html');
  console.log('  Admin   :  http://localhost:' + PORT + '/admin.html');
  console.log('  Content :  server/data/content.json   (GitHub ki zarurat nahi)');
  console.log('  -------------------------------------------------\n');
});
