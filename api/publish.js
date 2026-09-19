/**
 * Soul-D. — Publish server (Vercel / Netlify function)
 * ----------------------------------------------------
 * Same job as the Cloudflare Worker, for people who prefer Vercel or Netlify.
 *
 * VERCEL — put this file at  api/publish.js  in the repo root, then in
 *          Vercel → Project → Settings → Environment Variables add:
 *
 *            GH_TOKEN      your GitHub personal access token (repo scope)
 *            GH_REPO       karimcoders/sould-website
 *            GH_BRANCH     main              (optional)
 *            GH_FILE       content.json      (optional)
 *            CMS_PASSWORD  the CMS password
 *
 *          Deploy. Your endpoint is  https://<project>.vercel.app/api/publish
 *          Paste that into the CMS → Publish & Settings → "Publish server".
 *
 * NETLIFY — put it at  netlify/functions/publish.js  and add the same
 *           environment variables under Site settings → Environment.
 *           Endpoint: https://<site>.netlify.app/.netlify/functions/publish
 */

const enc = new TextEncoder();

function b64utf8(str) {
  const bytes = enc.encode(str);
  let bin = '';
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();

  /* GET — admin panel isse check karta hai ki publish server live hai ya nahi */
  if (req.method === 'GET') {
    const repo = process.env.GH_REPO || '';
    return res.status(200).json({
      ok: true,
      service: 'sould-publish',
      repo,
      configured: Boolean(process.env.GH_TOKEN && repo && process.env.CMS_PASSWORD)
    });
  }

  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Use POST' });

  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};

  if (!process.env.CMS_PASSWORD || body.password !== process.env.CMS_PASSWORD) {
    return res.status(401).json({ ok: false, error: 'Wrong password' });
  }

  const repo = process.env.GH_REPO;
  const branch = process.env.GH_BRANCH || 'main';
  const file = process.env.GH_FILE || 'content.json';

  if (!process.env.GH_TOKEN || !repo) {
    return res.status(500).json({ ok: false, error: 'Server is not configured (GH_TOKEN / GH_REPO missing)' });
  }

  const api = `https://api.github.com/repos/${repo}/contents/${file}`;
  const ghHeaders = {
    Authorization: `token ${process.env.GH_TOKEN}`,
    Accept: 'application/vnd.github+json',
    'User-Agent': 'sould-publish',
    'Content-Type': 'application/json'
  };

  if (body.test) {
    const r = await fetch(`https://api.github.com/repos/${repo}`, { headers: ghHeaders });
    const d = await r.json().catch(() => ({}));
    return res.status(r.ok ? 200 : 400).json({
      ok: r.ok,
      repo: d.full_name || repo,
      canPush: d.permissions ? d.permissions.push : null,
      error: r.ok ? undefined : d.message
    });
  }

  if (!body.content || typeof body.content !== 'object') {
    return res.status(400).json({ ok: false, error: 'No content received' });
  }

  let sha;
  const g = await fetch(`${api}?ref=${branch}`, { headers: ghHeaders });
  if (g.ok) sha = (await g.json()).sha;
  else if (g.status !== 404) {
    const d = await g.json().catch(() => ({}));
    return res.status(400).json({ ok: false, error: d.message || 'Could not read the repository' });
  }

  const payload = {
    message: `Content update — ${new Date().toISOString().slice(0, 16).replace('T', ' ')}`,
    content: b64utf8(JSON.stringify(body.content, null, 2)),
    branch
  };
  if (sha) payload.sha = sha;

  const r = await fetch(api, { method: 'PUT', headers: ghHeaders, body: JSON.stringify(payload) });
  const d = await r.json().catch(() => ({}));

  if (!r.ok) return res.status(400).json({ ok: false, error: d.message || 'GitHub rejected the update' });

  return res.status(200).json({
    ok: true,
    commit: d.commit && d.commit.sha ? d.commit.sha.slice(0, 8) : null,
    repo,
    branch
  });
}
