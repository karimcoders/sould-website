/**
 * Soul-D. — Publish server (Cloudflare Worker)
 * ---------------------------------------------
 * Lets the CMS publish content WITHOUT the client ever seeing a GitHub token.
 * The token is stored here as a secret, on the server.
 *
 * SETUP (about 2 minutes, free plan is enough)
 * --------------------------------------------
 *  1. Go to https://dash.cloudflare.com → Workers & Pages → Create → Worker
 *  2. Paste this whole file in, press Deploy.
 *  3. Worker → Settings → Variables → add these (as "Secret"/encrypted):
 *
 *        GH_TOKEN      your GitHub personal access token  (repo scope)
 *        GH_REPO       karimcoders/sould-website
 *        GH_BRANCH     main
 *        GH_FILE       content.json
 *        CMS_PASSWORD  the password people type in the CMS
 *        ALLOW_ORIGIN  https://karimcoders.github.io        (optional, locks it down)
 *
 *  4. Copy the worker URL (https://xxxx.workers.dev) and paste it into the CMS at
 *     Publish & Settings → "Publish server (optional)".
 *
 * After that the client just clicks Save / Publish — no GitHub anything.
 */

const enc = new TextEncoder();

/** base64 that survives non-ASCII characters (₹, —, ’ …) */
function b64utf8(str) {
  const bytes = enc.encode(str);
  let bin = '';
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}

function cors(origin) {
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400'
  };
}

export default {
  async fetch(request, env) {
    const origin = env.ALLOW_ORIGIN || '*';
    const headers = cors(origin);

    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers });
    if (request.method !== 'POST') {
      return Response.json({ ok: false, error: 'Use POST' }, { status: 405, headers });
    }

    let body;
    try {
      body = await request.json();
    } catch (e) {
      return Response.json({ ok: false, error: 'Invalid JSON' }, { status: 400, headers });
    }

    if (!env.CMS_PASSWORD || body.password !== env.CMS_PASSWORD) {
      return Response.json({ ok: false, error: 'Wrong password' }, { status: 401, headers });
    }

    const repo = env.GH_REPO;
    const branch = env.GH_BRANCH || 'main';
    const file = env.GH_FILE || 'content.json';

    if (!env.GH_TOKEN || !repo) {
      return Response.json({ ok: false, error: 'Server is not configured (GH_TOKEN / GH_REPO missing)' }, { status: 500, headers });
    }

    const api = `https://api.github.com/repos/${repo}/contents/${file}`;
    const ghHeaders = {
      Authorization: `token ${env.GH_TOKEN}`,
      Accept: 'application/vnd.github+json',
      'User-Agent': 'sould-publish-worker',
      'Content-Type': 'application/json'
    };

    // ---- health check from the CMS "Test connection" button ----
    if (body.test) {
      const r = await fetch(`https://api.github.com/repos/${repo}`, { headers: ghHeaders });
      const d = await r.json().catch(() => ({}));
      return Response.json(
        { ok: r.ok, repo: d.full_name || repo, canPush: d.permissions ? d.permissions.push : null, error: r.ok ? undefined : d.message },
        { status: r.ok ? 200 : 400, headers }
      );
    }

    if (!body.content || typeof body.content !== 'object') {
      return Response.json({ ok: false, error: 'No content received' }, { status: 400, headers });
    }

    // ---- find the current file sha (needed to update an existing file) ----
    let sha;
    const g = await fetch(`${api}?ref=${branch}`, { headers: ghHeaders, cf: { cacheTtl: 0 } });
    if (g.ok) sha = (await g.json()).sha;
    else if (g.status !== 404) {
      const d = await g.json().catch(() => ({}));
      return Response.json({ ok: false, error: d.message || 'Could not read the repository' }, { status: 400, headers });
    }

    const payload = {
      message: `Content update — ${new Date().toISOString().slice(0, 16).replace('T', ' ')}`,
      content: b64utf8(JSON.stringify(body.content, null, 2)),
      branch
    };
    if (sha) payload.sha = sha;

    const r = await fetch(api, { method: 'PUT', headers: ghHeaders, body: JSON.stringify(payload) });
    const d = await r.json().catch(() => ({}));

    if (!r.ok) {
      return Response.json({ ok: false, error: d.message || 'GitHub rejected the update' }, { status: 400, headers });
    }

    return Response.json(
      { ok: true, commit: d.commit && d.commit.sha ? d.commit.sha.slice(0, 8) : null, repo, branch },
      { status: 200, headers }
    );
  }
};
