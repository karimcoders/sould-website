/* ==========================================================================
   Soul-D. CMS — admin.js
   A zero-dependency CMS for the Soul-D. site. Edits every word, image and
   list item, saves a local draft, exports/imports JSON, and can publish
   straight to GitHub with one click.
   ========================================================================== */

/* ---------------------------------------------------------------- icons */
const IC = {
  grid: '<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>',
  type: '<polyline points="4 7 4 4 20 4 20 7"/><line x1="9" x2="15" y1="20" y2="20"/><line x1="12" x2="12" y1="4" y2="20"/>',
  phone: '<path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"/>',
  image: '<rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>',
  layers: '<path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/>',
  briefcase: '<rect width="20" height="14" x="2" y="7" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
  quote: '<path d="M16 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z"/><path d="M5 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z"/><path d="M5 15v2a4 4 0 0 0 4 4h1"/><path d="M16 15v2a4 4 0 0 0 4 4h1"/>',
  help: '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  list: '<line x1="8" x2="21" y1="6" y2="6"/><line x1="8" x2="21" y1="12" y2="12"/><line x1="8" x2="21" y1="18" y2="18"/><line x1="3" x2="3.01" y1="6" y2="6"/><line x1="3" x2="3.01" y1="12" y2="12"/><line x1="3" x2="3.01" y1="18" y2="18"/>',
  award: '<circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>',
  settings: '<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>',
  plus: '<path d="M5 12h14"/><path d="M12 5v14"/>',
  trash: '<path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
  up: '<path d="m18 15-6-6-6 6"/>',
  down: '<path d="m6 9 6 6 6-6"/>',
  eye: '<path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/>',
  save: '<path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"/><path d="M7 3v4a1 1 0 0 0 1 1h7"/>',
  upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/>',
  download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>',
  github: '<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/>',
  refresh: '<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>',
  logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/>',
  check: '<path d="M20 6 9 17l-5-5"/>'
};
const ic = (n, s = 16) =>
  `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IC[n] || ''}</svg>`;

/* ---------------------------------------------------------------- state */
const DEFAULT_SETTINGS = {
  password: 'sould2026',
  repo: 'karimcoders/sould-website',   // pre-filled — the client never has to type this
  branch: 'main',
  filePath: 'content.json',
  token: '',                            // only needed for direct publishing
  endpoint: '',                         // optional: serverless publisher (client needs no token)
  autoPublish: false                    // publish automatically every time you save
};
const LS_DRAFT = 'sould_content_draft';
const LS_SET = 'sould_cms_settings';
const LS_AUTH = 'sould_cms_auth';

let C = {};                 // working copy of the content
let S = {};                 // settings
let dirty = false;
let active = 'dashboard';
let collapsed = {};         // item collapse state

const get = (p) => p.split('.').reduce((o, k) => (o == null ? undefined : o[k]), C);
function set(p, v) {
  const keys = p.split('.');
  const last = keys.pop();
  let o = C;
  for (const k of keys) { if (o[k] == null) o[k] = {}; o = o[k]; }
  o[last] = v;
  markDirty();
}
const esc = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const clone = (o) => JSON.parse(JSON.stringify(o));

function loadSettings() {
  try { S = Object.assign({}, DEFAULT_SETTINGS, JSON.parse(localStorage.getItem(LS_SET) || '{}')); }
  catch (e) { S = { ...DEFAULT_SETTINGS }; }
}
function saveSettings() { localStorage.setItem(LS_SET, JSON.stringify(S)); }

function markDirty() {
  dirty = true;
  document.getElementById('dirty')?.classList.add('on');
}

/* ---------------------------------------------------------------- toasts */
function toast(msg, kind = '') {
  const box = document.getElementById('toast');
  const el = document.createElement('div');
  el.className = kind;
  el.textContent = msg;
  box.appendChild(el);
  setTimeout(() => el.remove(), 4200);
}

/* ---------------------------------------------------------------- images */
function downscale(file, maxW = 1400, quality = 0.82) {
  return new Promise((resolve) => {
    const fr = new FileReader();
    fr.onload = () => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxW / img.width);
        const cv = document.createElement('canvas');
        cv.width = Math.round(img.width * scale);
        cv.height = Math.round(img.height * scale);
        cv.getContext('2d').drawImage(img, 0, 0, cv.width, cv.height);
        const isPng = /png/i.test(file.type);
        resolve(cv.toDataURL(isPng ? 'image/png' : 'image/jpeg', quality));
      };
      img.onerror = () => resolve(fr.result);
      img.src = fr.result;
    };
    fr.readAsDataURL(file);
  });
}
function pickImage(path) {
  const inp = document.createElement('input');
  inp.type = 'file';
  inp.accept = 'image/*';
  inp.onchange = async () => {
    const f = inp.files && inp.files[0];
    if (!f) return;
    const uri = await downscale(f);
    set(path, uri);
    render();
    toast('Image updated (saved as embedded data)');
  };
  inp.click();
}

/* ---------------------------------------------------------------- fields */
function fText(path, label, opts = {}) {
  const v = get(path);
  const tip = opts.tip ? ` <span class="tip">${esc(opts.tip)}</span>` : '';
  if (opts.type === 'area') {
    return `<div class="f ${opts.full ? 'full' : ''}">
      <label>${esc(label)}${tip}</label>
      <textarea data-path="${path}" rows="${opts.rows || 3}">${esc(v)}</textarea>
    </div>`;
  }
  return `<div class="f ${opts.full ? 'full' : ''}">
    <label>${esc(label)}${tip}</label>
    <input data-path="${path}" type="${opts.type || 'text'}" value="${esc(v)}" placeholder="${esc(opts.ph || '')}">
  </div>`;
}

/** Field bound to the SETTINGS object (S), not to the site content (C). */
function fSetting(key, label, opts = {}) {
  const v = S[key];
  const tip = opts.tip ? ` <span class="tip">${esc(opts.tip)}</span>` : '';
  if (opts.type === 'checkbox') {
    return `<label style="display:flex;align-items:flex-start;gap:11px;padding:14px;border:1px solid var(--line);border-radius:11px;background:#f8fafc;cursor:pointer">
      <input type="checkbox" data-set="${key}" ${v ? 'checked' : ''} style="width:18px;height:18px;margin-top:2px">
      <span><b style="display:block;font-size:13.5px">${esc(label)}</b>
      ${opts.hint ? `<span style="color:var(--muted);font-size:12.5px">${opts.hint}</span>` : ''}</span>
    </label>`;
  }
  return `<div class="f ${opts.full ? 'full' : ''}">
    <label>${esc(label)}${tip}</label>
    <input data-set="${key}" type="${opts.type || 'text'}" value="${esc(v == null ? '' : v)}" placeholder="${esc(opts.ph || '')}">
  </div>`;
}

function fImage(path, label, opts = {}) {
  const v = get(path) || '';
  const isData = String(v).startsWith('data:');
  return `<div class="f ${opts.full ? 'full' : ''}">
    <label>${esc(label)}</label>
    <img class="thumb ${opts.tall ? 'tall' : ''}" src="${esc(v)}" alt="" onerror="this.style.opacity=.35">
    <div class="row">
      <input data-path="${path}" type="text" value="${esc(isData ? '' : v)}" placeholder="${isData ? '✱ uploaded file (embedded)' : 'assets/photo.jpg or https://…'}">
      <button type="button" class="btn btn-ghost btn-sm" data-act="pick" data-path="${path}">${ic('upload', 14)} Upload</button>
      <button type="button" class="btn btn-ghost btn-sm" data-act="clear" data-path="${path}" title="Clear">${ic('trash', 14)}</button>
    </div>
  </div>`;
}

function strList(path, opts = {}) {
  const arr = get(path) || [];
  return `<div class="f full">
    <label>${esc(opts.label || 'Items')}</label>
    ${arr
      .map(
        (v, i) => `<div class="row" style="margin-bottom:7px">
        <input data-path="${path}.${i}" value="${esc(v)}" placeholder="${esc(opts.ph || '')}">
        <button type="button" class="btn-icon" data-act="mv" data-path="${path}" data-i="${i}" data-d="-1" title="Move up">${ic('up', 14)}</button>
        <button type="button" class="btn-icon" data-act="mv" data-path="${path}" data-i="${i}" data-d="1" title="Move down">${ic('down', 14)}</button>
        <button type="button" class="btn-icon" data-act="rm" data-path="${path}" data-i="${i}" title="Remove">${ic('trash', 14)}</button>
      </div>`
      )
      .join('')}
    <button type="button" class="btn btn-ghost btn-sm" data-act="addStr" data-path="${path}" data-tpl="${opts.tpl || 'str'}" style="align-self:flex-start">${ic('plus', 14)} ${esc(opts.addLabel || 'Add item')}</button>
  </div>`;
}

/* Render a list of objects. `body(item, i, path)` returns the inner form HTML. */
function objList(path, items, body, opts = {}) {
  return `<div>
    ${items
      .map((it, i) => {
        const key = path + '.' + i;
        const isCol = collapsed[key];
        const title = opts.title ? opts.title(it, i) : `Item ${i + 1}`;
        return `<div class="item ${isCol ? 'collapsed' : ''}">
        <div class="item-head">
          <span class="n">${i + 1}</span>
          <span class="t" data-act="toggle" data-key="${key}" style="cursor:pointer">${esc(title)}</span>
          <button type="button" class="btn-icon" data-act="mv" data-path="${path}" data-i="${i}" data-d="-1" title="Move up">${ic('up', 14)}</button>
          <button type="button" class="btn-icon" data-act="mv" data-path="${path}" data-i="${i}" data-d="1" title="Move down">${ic('down', 14)}</button>
          <button type="button" class="btn-icon" data-act="rm" data-path="${path}" data-i="${i}" title="Delete">${ic('trash', 14)}</button>
        </div>
        <div class="item-body">${body(it, i, key)}</div>
      </div>`;
      })
      .join('')}
    <button type="button" class="btn btn-primary btn-sm" data-act="addObj" data-path="${path}" data-tpl="${opts.tpl}">${ic('plus', 14)} ${esc(opts.addLabel || 'Add')}</button>
  </div>`;
}

const str = (v) => esc(v == null ? '' : v);

/* ---------------------------------------------------------------- boot */
document.addEventListener('DOMContentLoaded', () => {
  loadSettings();
  if (localStorage.getItem(LS_AUTH) !== '1') return renderLogin();
  bootCms();
});

async function bootCms() {
  let content = clone(window.SOULD_DEFAULTS || {});
  try {
    const res = await fetch('content.json', { cache: 'no-store' });
    if (res.ok) content = deepMerge(content, await res.json());
  } catch (e) {}
  try {
    const d = localStorage.getItem(LS_DRAFT);
    if (d) content = deepMerge(content, JSON.parse(d));
  } catch (e) {}
  C = content;
  render();
  window.addEventListener('beforeunload', (e) => {
    if (dirty) { e.preventDefault(); e.returnValue = ''; }
  });
}

function deepMerge(base, over) {
  if (over == null) return base;
  if (Array.isArray(base) || Array.isArray(over)) return Array.isArray(over) ? over : base;
  if (typeof base !== 'object' || typeof over !== 'object') return over;
  const out = Object.assign({}, base);
  for (const k of Object.keys(over)) out[k] = deepMerge(base[k], over[k]);
  return out;
}

/* ---------------------------------------------------------------- login */
function renderLogin() {
  document.getElementById('root').innerHTML = `
  <div class="login">
    <div class="box">
      <img src="assets/sould-logo-1-BkM_pOXT.png" alt="Soul-D.">
      <h1>Content Manager</h1>
      <p>Sign in to edit your website content.</p>
      <div class="f"><label>Password</label><input id="pw" type="password" placeholder="Enter password" autofocus></div>
      <button class="btn btn-primary" style="width:100%;justify-content:center;padding:12px" id="go">Sign In</button>
      <div class="err" id="err"></div>
    </div>
  </div>`;
  const go = () => {
    const pw = document.getElementById('pw').value;
    if (pw === S.password) {
      localStorage.setItem(LS_AUTH, '1');
      bootCms();
    } else document.getElementById('err').textContent = 'Wrong password. Try again.';
  };
  document.getElementById('go').onclick = go;
  document.getElementById('pw').addEventListener('keydown', (e) => e.key === 'Enter' && go());
}

/* ---------------------------------------------------------------- shell */
const SECTIONS = [
  ['dashboard', 'Dashboard', 'grid'],
  ['pagetext', 'Page Text', 'type'],
  ['brand', 'Brand & Contact', 'phone'],
  ['hero', 'Hero Slideshow', 'image'],
  ['pages', 'Page Headings', 'layers'],
  ['services', 'Services', 'layers'],
  ['work', 'Case Studies', 'briefcase'],
  ['testimonials', 'Testimonials', 'quote'],
  ['faq', 'FAQ', 'help'],
  ['about', 'About & Team', 'users'],
  ['extras', 'Stats / Process / Logos', 'award'],
  ['settings', 'Publish & Settings', 'settings']
];

function render() {
  document.getElementById('root').innerHTML = `
  <div class="wrap">
    <aside class="side">
      <div class="logo">
        <img src="assets/sould-logo-C0ARBR39.png" alt="Soul-D.">
        <div class="sub">Content Manager</div>
      </div>
      <nav>
        ${SECTIONS.map(
          ([id, label, icon]) =>
            `<button data-nav="${id}" class="${active === id ? 'on' : ''}">${ic(icon, 17)} ${esc(label)}</button>`
        ).join('')}
        <div class="sep">Actions</div>
        <button data-act="viewSite">${ic('eye', 17)} View Website</button>
        <button data-act="logout">${ic('logout', 17)} Sign Out</button>
      </nav>
      <div class="foot">Soul-D. CMS · v1.0</div>
    </aside>

    <div class="main">
      <div class="top">
        <h1>${esc(SECTIONS.find((s) => s[0] === active)[1])}</h1>
        <span class="dirty ${dirty ? 'on' : ''}" id="dirty">Unsaved draft</span>
        <button class="btn btn-ghost" data-act="viewSite">${ic('eye', 15)} Preview</button>
        <button class="btn btn-ghost" data-act="discard">${ic('refresh', 15)} Discard</button>
        <button class="btn btn-primary" data-act="save">${ic('save', 15)} Save Draft</button>
        <button class="btn btn-ok" data-act="publish">${ic('github', 15)} Publish</button>
      </div>
      <div class="content" id="panel">${panel()}</div>
    </div>
  </div>
  <div class="toast" id="toast"></div>`;

  bind();
}

function panel() {
  switch (active) {
    case 'dashboard': return viewDashboard();
    case 'pagetext': return viewPageText();
    case 'brand': return viewBrand();
    case 'hero': return viewHero();
    case 'pages': return viewPages();
    case 'services': return viewServices();
    case 'work': return viewWork();
    case 'testimonials': return viewTestimonials();
    case 'faq': return viewFaq();
    case 'about': return viewAbout();
    case 'extras': return viewExtras();
    case 'settings': return viewSettings();
    default: return '';
  }
}

/* ---------------------------------------------------------------- views */
function viewDashboard() {
  const img = (get('heroSlides') || []).length;
  return `
  <div class="banner">
    <b>Welcome to your content manager.</b> Everything on the website can be edited here — text,
    images, services, case studies, testimonials and FAQs. Changes are saved as a <b>draft in this
    browser</b> first (click <b>Preview</b> to check them), then click <b>Publish</b> to make them
    live for everyone.
  </div>

  <div class="tiles">
    <div class="tile"><div class="v">${(get('services') || []).length}</div><div class="l">Services</div></div>
    <div class="tile"><div class="v">${(get('works') || []).length}</div><div class="l">Case Studies</div></div>
    <div class="tile"><div class="v">${(get('testimonials') || []).length}</div><div class="l">Testimonials</div></div>
    <div class="tile"><div class="v">${img}</div><div class="l">Hero Images</div></div>
  </div>

  <div class="card">
    <h2>${canPublish() ? '✅ Publishing is connected' : '⚠️ Publishing is not connected yet'}</h2>
    <p class="hint">
      ${canPublish()
        ? 'Everything is set up. Edit anything, then press <b>Save Draft</b>.'
        : 'Open <b>Publish &amp; Settings</b> and paste your GitHub access token once.'}
    </p>
    <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:6px">
      <button class="btn ${canPublish() ? 'btn-ghost' : 'btn-primary'}" data-nav="settings">${ic('settings', 15)} ${canPublish() ? 'Publish settings' : 'Set up publishing'}</button>
      ${canPublish() ? `<button class="btn btn-ok" data-act="publish">${ic('github', 15)} Publish now</button>` : ''}
    </div>
  </div>

  <div class="card">
    <h2>How to publish your changes</h2>
    <p class="hint">Three steps, no coding.</p>
    <div class="steps">
      <div class="step"><span class="n">1</span><div><b>Edit &amp; Save Draft</b><span>Change anything on the left. Click <b>Save Draft</b> — only you see this until you publish.</span></div></div>
      <div class="step"><span class="n">2</span><div><b>Preview</b><span>Click <b>Preview</b> to open the website with your draft applied.</span></div></div>
      <div class="step"><span class="n">3</span><div><b>Publish</b><span>Click <b>Publish</b> to push the new content live. First time, add your GitHub details under <b>Publish &amp; Settings</b>.</span></div></div>
    </div>
  </div>

  <div class="card">
    <h2>Backup</h2>
    <p class="hint">Download a copy of all your content any time — you can restore it later with Import.</p>
    <div style="display:flex;gap:10px;flex-wrap:wrap">
      <button class="btn btn-dark" data-act="export">${ic('download', 15)} Export content.json</button>
      <button class="btn btn-ghost" data-act="import">${ic('upload', 15)} Import content.json</button>
      <button class="btn btn-danger" data-act="resetAll">${ic('refresh', 15)} Reset to original site content</button>
    </div>
  </div>`;
}

function viewPageText() {
  const c = [
    ['Navigation', [
      ['copy.navHome', 'Home'], ['copy.navServices', 'Services'], ['copy.navWork', 'Our Work'],
      ['copy.navAbout', 'About Us'], ['copy.navContact', 'Contact'], ['copy.navCta', 'Header button']
    ]],
    ['Home — Hero & Buttons', [
      ['copy.homeHero1', 'Big heading (line 1)'],
      ['copy.homeHero2', 'Big heading (line 2)', 'area'],
      ['copy.homeHeroBtn1', 'Primary button'], ['copy.homeHeroBtn2', 'Secondary link']
    ]],
    ['Home — "Transforming Ideas" section', [
      ['copy.homeAboutTitle', 'Heading', 'area'],
      ['copy.homeAboutText', 'Paragraph', 'area'],
      ['copy.homeAboutBtn', 'Button'], ['copy.homeAboutLink', 'Link']
    ]],
    ['Home — "Strategies" section', [
      ['copy.homeStrategyTitle', 'Heading', 'area'],
      ['copy.homeStrategyText', 'Paragraph', 'area'],
      ['copy.homeStrategyLink', 'Link text']
    ]],
    ['Home — Recognition & Testimonials', [
      ['copy.homeRecognitionTitle', 'Heading'], ['copy.homeRecognitionText', 'Sub-paragraph', 'area']
    ]],
    ['Home — Proposal form', [
      ['copy.homeProposalTitle', 'Heading'], ['copy.homeProposalText', 'Paragraph', 'area'],
      ['copy.formTitle', 'Form title'], ['copy.formHint', 'Form sub-text'], ['copy.formSubmit', 'Submit button']
    ]],
    ['Home — FAQ', [['copy.homeFaqTitle', 'Heading'], ['copy.homeFaqText', 'Sub-text', 'area']]],
    ['Footer', [
      ['copy.footerTagline', 'Tagline', 'area'], ['copy.footerServicesTitle', 'Services column title'],
      ['copy.footerContactTitle', 'Contact column title'], ['copy.footerCopyright', 'Copyright line']
    ]]
  ];
  return `
  <div class="banner">
    Formatting: type <code>[b]</code>blue text<code>[/b]</code> to colour words Soul-D blue, and press
    Enter to break the line. Example: <code>The Best [b]Digital Marketing[/b]</code>
  </div>
  ${c
    .map(
      ([title, rows]) => `
    <div class="card">
      <h2>${esc(title)}</h2>
      <div class="grid" style="margin-top:14px">
        ${rows.map(([p, l, t]) => fText(p, l, { type: t === 'area' ? 'area' : 'text', full: t === 'area' })).join('')}
      </div>
    </div>`
    )
    .join('')}`;
}

function viewBrand() {
  return `
  <div class="card">
    <h2>Business details</h2>
    <p class="hint">Used in the header, footer, contact page and the floating call / WhatsApp buttons.</p>
    <div class="grid">
      ${fText('site.name', 'Business name')}
      ${fText('site.tagline', 'Tagline under logo')}
      ${fText('site.email', 'Email address', { type: 'email' })}
      ${fText('site.phone', 'Phone (displayed)')}
      ${fText('site.tel', 'Phone for click-to-call', { tip: 'no spaces, e.g. +919866500578' })}
      ${fText('site.whatsapp', 'WhatsApp number', { tip: 'country code, no +, e.g. 919866500578' })}
      ${fText('site.hours', 'Working hours')}
      ${fText('site.domain', 'Website address shown')}
      ${fText('site.address', 'Full address', { full: true })}
    </div>
  </div>

  <div class="card">
    <h2>Social media links</h2>
    <div class="grid">
      ${fText('site.social.linkedin', 'LinkedIn')}
      ${fText('site.social.instagram', 'Instagram')}
      ${fText('site.social.facebook', 'Facebook')}
      ${fText('site.social.youtube', 'YouTube')}
      ${fText('site.social.twitter', 'X / Twitter')}
    </div>
  </div>

  <div class="card">
    <h2>Logos</h2>
    <div class="grid">
      ${fImage('images.souldLogoHeader', 'Header logo')}
      ${fImage('images.souldLogoFooter', 'Footer logo')}
    </div>
  </div>`;
}

function viewHero() {
  const arr = get('heroSlides') || [];
  return `
  <div class="card">
    <h2>Home page background slideshow</h2>
    <p class="hint">These images fade into each other behind the big headline. Use wide, high-quality photos.</p>
    ${arr
      .map(
        (v, i) => `<div class="sub-item">
        <div class="sh"><strong>Slide ${i + 1}</strong>
          <button type="button" class="btn-icon" data-act="mv" data-path="heroSlides" data-i="${i}" data-d="-1">${ic('up', 13)}</button>
          <button type="button" class="btn-icon" data-act="mv" data-path="heroSlides" data-i="${i}" data-d="1">${ic('down', 13)}</button>
          <button type="button" class="btn-icon" data-act="rm" data-path="heroSlides" data-i="${i}">${ic('trash', 13)}</button>
        </div>
        ${fImage('heroSlides.' + i, '', { tall: true })}
      </div>`
      )
      .join('')}
    <button class="btn btn-primary btn-sm" data-act="addStr" data-path="heroSlides" data-tpl="hero">${ic('plus', 14)} Add slide</button>
  </div>`;
}

function viewPages() {
  const c = [
    ['Services page', [
      ['copy.servicesHeroTitle', 'Banner heading', 'area'],
      ['copy.servicesHeroText', 'Banner paragraph', 'area'],
      ['copy.servicesProcessTitle', 'Process heading'],
      ['copy.servicesProcessText', 'Process paragraph', 'area'],
      ['copy.servicesCtaTitle', 'Bottom CTA heading'],
      ['copy.servicesCtaText', 'Bottom CTA paragraph', 'area'],
      ['copy.servicesCtaBtn', 'Bottom CTA button']
    ]],
    ['Service detail pages', [
      ['copy.detailProjectsWord', 'Word after the service name (e.g. "Projects")'],
      ['copy.detailCtaTitle', 'Bottom CTA heading'],
      ['copy.detailCtaText', 'Bottom CTA paragraph', 'area'],
      ['copy.detailCtaBtn', 'Bottom CTA button']
    ]],
    ['Our Work page', [
      ['copy.workHeroTitle', 'Banner heading', 'area'],
      ['copy.workHeroText', 'Banner paragraph', 'area'],
      ['copy.workCtaTitle', 'Bottom CTA heading'],
      ['copy.workCtaText', 'Bottom CTA paragraph', 'area'],
      ['copy.workCtaBtn', 'Bottom CTA button']
    ]],
    ['About page', [
      ['copy.aboutHeroTitle', 'Banner heading', 'area'],
      ['copy.aboutHeroText', 'Banner paragraph', 'area'],
      ['copy.aboutStoryEyebrow', 'Small label above story'],
      ['copy.aboutStoryTitle', 'Story heading'],
      ['copy.aboutStoryP1', 'Story paragraph 1', 'area'],
      ['copy.aboutStoryP2', 'Story paragraph 2', 'area'],
      ['copy.aboutMottoLabel', 'Motto label'],
      ['copy.aboutMottoText', 'Motto text'],
      ['copy.aboutValuesTitle', 'Values heading'],
      ['copy.aboutValuesText', 'Values paragraph', 'area'],
      ['copy.aboutTeamTitle', 'Team heading'],
      ['copy.aboutTeamText', 'Team paragraph', 'area'],
      ['copy.aboutCtaTitle', 'Bottom CTA heading'],
      ['copy.aboutCtaText', 'Bottom CTA paragraph', 'area'],
      ['copy.aboutCtaBtn', 'Bottom CTA button']
    ]],
    ['Contact page', [
      ['copy.contactHeroTitle', 'Banner heading', 'area'],
      ['copy.contactHeroText', 'Banner paragraph', 'area'],
      ['copy.contactDirectTitle', 'Contact info heading'],
      ['copy.contactDirectText', 'Contact info paragraph', 'area']
    ]]
  ];
  return c
    .map(
      ([title, rows]) => `
    <div class="card">
      <h2>${esc(title)}</h2>
      <div class="grid" style="margin-top:14px">
        ${rows.map(([p, l, t]) => fText(p, l, { type: t === 'area' ? 'area' : 'text', full: t === 'area' })).join('')}
      </div>
    </div>`
    )
    .join('');
}

function viewServices() {
  const arr = get('services') || [];
  const ICONS = ['globe', 'smartphone', 'pen-tool', 'video', 'instagram', 'target', 'user-round', 'package', 'message', 'send', 'bar-chart', 'shield-check', 'users', 'heart', 'zap', 'clock'];
  const CATS = [
    ['web-mobile', 'Web & Mobile'],
    ['ads-smm', 'Paid Ads & SMM'],
    ['content-video', 'Content & Video'],
    ['branding', 'Branding & Portfolios']
  ];
  return `
  <div class="banner">
    Each service automatically appears on the home carousel, the Services page and the footer.
    The <b>project cards</b> inside a service become that service's detail page.
  </div>
  ${objList(
    'services',
    arr,
    (s, i, key) => `
    <div class="grid">
      ${fText(key + '.title', 'Service name')}
      ${fText(key + '.id', 'Link (URL slug)', { tip: 'lowercase, dashes only' })}
      <div class="f"><label>Card number</label><input data-path="${key}.num" type="number" value="${str(s.num)}"></div>
      <div class="f"><label>Icon</label><select data-path="${key}.icon">
        ${ICONS.map((n) => `<option ${s.icon === n ? 'selected' : ''}>${n}</option>`).join('')}
      </select></div>
      <div class="f"><label>Category (used by the filter buttons)</label><select data-path="${key}.category">
        ${CATS.map(([v, l]) => `<option value="${v}" ${s.category === v ? 'selected' : ''}>${l}</option>`).join('')}
      </select></div>
      ${fText(key + '.group', 'Group label')}
      ${fText(key + '.desc', 'Short description', { type: 'area', rows: 3, full: true })}
      ${fText(key + '.detailLead', 'Detail page sub-heading', { full: true })}
    </div>
    <div style="margin-top:14px">
      ${strList(key + '.bullets', { label: 'Feature bullets', addLabel: 'Add bullet', ph: 'e.g. SEO & Mobile Optimization' })}
    </div>
    <div style="margin-top:16px">
      <label style="font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#334155">Card image</label>
      <div style="margin-top:8px">${fImage(key + '.img', '')}</div>
    </div>
    <div style="margin-top:18px;padding-top:16px;border-top:1px solid var(--line)">
      <div class="card-head"><h3>Projects shown on this service's page</h3></div>
      ${objList(
        key + '.projects',
        s.projects || [],
        (p, pi, pkey) => `
        <div class="grid">
          ${fText(pkey + '.client', 'Client name')}
          ${fText(pkey + '.metric', 'Result badge', { tip: 'shown on the image' })}
          ${fText(pkey + '.title', 'Project title', { full: true })}
          ${fText(pkey + '.desc', 'Description', { type: 'area', rows: 3, full: true })}
          ${fText(pkey + '.badge', 'Small badge')}
        </div>
        <div style="margin-top:12px">${fImage(pkey + '.img', 'Project image')}</div>
        <div style="margin-top:12px">${strList(pkey + '.highlights', { label: 'Key highlights', addLabel: 'Add highlight' })}</div>
        <div style="margin-top:12px">${strList(pkey + '.tags', { label: 'Tags', addLabel: 'Add tag' })}`,
        { tpl: 'serviceProject', addLabel: 'Add project', title: (p) => p.title || 'New project' }
      )}
    </div>`,
    {
      tpl: 'service',
      addLabel: 'Add service',
      title: (s) => s.title || 'New service'
    }
  )}`;
}

function viewWork() {
  const arr = get('works') || [];
  const CATS = [
    ['web-mobile', 'Web & Mobile Apps'],
    ['ads-smm', 'Ads & Growth'],
    ['content-video', 'Video & Content'],
    ['branding', 'Branding']
  ];
  return `
  <div class="banner">These are the case studies on the <b>Our Work</b> page, and also the top block of the home page's filter tabs.</div>
  ${objList(
    'works',
    arr,
    (w, i, key) => `
    <div class="grid">
      ${fText(key + '.client', 'Client name')}
      ${fText(key + '.title', 'Project title')}
      <div class="f"><label>Filter category</label><select data-path="${key}.cat">
        ${CATS.map(([v, l]) => `<option value="${v}" ${w.cat === v ? 'selected' : ''}>${l}</option>`).join('')}
      </select></div>
      ${fText(key + '.chip', 'Category chip label', { tip: 'e.g. Web & E-Commerce' })}
      ${fText(key + '.metric', 'Result badge', { tip: 'e.g. +240% Sales Conversion', full: true })}
      ${fText(key + '.desc', 'Description', { type: 'area', rows: 3, full: true })}
    </div>
    <div style="margin-top:14px">${fImage(key + '.img', 'Project image', { tall: true })}</div>
    <div style="margin-top:14px">${strList(key + '.highlights', { label: 'Key highlights', addLabel: 'Add highlight' })}</div>
    <div style="margin-top:12px">${strList(key + '.tags', { label: 'Tags', addLabel: 'Add tag' })}</div>`,
    { tpl: 'work', addLabel: 'Add case study', title: (w) => w.title || 'New case study' }
  )}`;
}

function viewTestimonials() {
  const arr = get('testimonials') || [];
  return `
  <div class="banner">Client reviews in the home page slider. Three are shown at a time.</div>
  ${objList(
    'testimonials',
    arr,
    (t, i, key) => `
    <div class="grid">
      ${fText(key + '.quote', 'Review text', { type: 'area', rows: 3, full: true })}
      ${fText(key + '.name', 'Client name')}
      ${fText(key + '.role', 'Designation')}
    </div>`,
    { tpl: 'testimonial', addLabel: 'Add review', title: (t) => t.name || 'New review' }
  )}`;
}

function viewFaq() {
  const arr = get('faqs') || [];
  return `
  <div class="banner">These questions appear at the bottom of the <b>Home</b> and <b>Contact</b> pages.</div>
  ${objList(
    'faqs',
    arr,
    (f, i, key) => `
    <div class="grid one">
      ${fText(key + '.q', 'Question', { full: true })}
      ${fText(key + '.a', 'Answer', { type: 'area', rows: 3, full: true })}
    </div>`,
    { tpl: 'faq', addLabel: 'Add question', title: (f) => f.q || 'New question' }
  )}`;
}

function viewAbout() {
  return `
  ${fImage('images.hub1', 'Home "Transforming Ideas" — large photo')}
  <div style="height:14px"></div>
  ${fImage('images.hub2', 'Home "Transforming Ideas" — small overlapping photo')}

  <div class="card" style="margin-top:22px">
    <h2>What we do list (home page)</h2>
    <p class="hint">The four small items with ticks under "Transforming Ideas".</p>
    ${objList(
      'transformFeatures',
      get('transformFeatures') || [],
      (t, i, key) => `<div class="grid">${fText(key + '.label', 'Text')}${fText(key + '.icon', 'Icon name')}</div>`,
      { tpl: 'transformFeature', addLabel: 'Add item', title: (t) => t.label || 'Item' }
    )}
  </div>

  <div class="card">
    <h2>Company values</h2>
    <p class="hint">"The Principles That Guide Us" on the About page.</p>
    ${objList(
      'values',
      get('values') || [],
      (v, i, key) => `
      <div class="grid">
        ${fText(key + '.title', 'Title')}
        ${fText(key + '.icon', 'Icon name')}
        ${fText(key + '.text', 'Description', { type: 'area', rows: 3, full: true })}
      </div>`,
      { tpl: 'value', addLabel: 'Add value', title: (v) => v.title || 'Value' }
    )}
  </div>

  <div class="card">
    <h2>Team cards</h2>
    <p class="hint">"Meet the Experts Behind Your Growth" on the About page.</p>
    ${objList(
      'team',
      get('team') || [],
      (t, i, key) => `
      <div class="grid">
        ${fText(key + '.title', 'Team name')}
        ${fText(key + '.role', 'Role / speciality')}
        ${fText(key + '.text', 'Description', { type: 'area', rows: 3, full: true })}
      </div>
      <div style="margin-top:12px">${fImage(key + '.img', 'Photo')}</div>`,
      { tpl: 'team', addLabel: 'Add team card', title: (t) => t.title || 'Team' }
    )}
  </div>`;
}

function viewExtras() {
  return `
  <div class="card">
    <h2>Statistics</h2>
    <p class="hint">The four blue numbers under the home carousel.</p>
    ${objList(
      'stats',
      get('stats') || [],
      (s, i, key) => `
      <div class="grid">
        <div class="f"><label>Number</label><input data-path="${key}.value" type="number" value="${str(s.value)}"></div>
        ${fText(key + '.suffix', 'Symbol after number', { tip: '+ or %' })}
        ${fText(key + '.label', 'Caption', { full: true })}
      </div>`,
      { tpl: 'stat', addLabel: 'Add statistic', title: (s) => `${s.value}${s.suffix} ${s.label}` }
    )}
  </div>

  <div class="card">
    <h2>"Strategies that Turn Attention into Growth"</h2>
    <p class="hint">The three dark cards on the home page.</p>
    ${objList(
      'strategies',
      get('strategies') || [],
      (s, i, key) => `
      <div class="grid">
        ${fText(key + '.title', 'Title')}
        ${fText(key + '.icon', 'Icon name')}
        ${fText(key + '.text', 'Description', { type: 'area', rows: 3, full: true })}
      </div>`,
      { tpl: 'strategy', addLabel: 'Add card', title: (s) => s.title || 'Card' }
    )}
  </div>

  <div class="card">
    <h2>Service delivery process</h2>
    <p class="hint">The four numbered steps on the Services page.</p>
    ${objList(
      'process',
      get('process') || [],
      (p, i, key) => `
      <div class="grid">
        ${fText(key + '.n', 'Step number')}
        ${fText(key + '.title', 'Title')}
        ${fText(key + '.text', 'Description', { type: 'area', rows: 2, full: true })}
      </div>`,
      { tpl: 'process', addLabel: 'Add step', title: (p) => `${p.n} ${p.title}` }
    )}
  </div>

  <div class="card">
    <h2>Client logos</h2>
    <p class="hint">The scrolling logo strip on the home page. Best results with a transparent PNG on a white background.</p>
    ${objList(
      'clients',
      get('clients') || [],
      (c, i, key) => `<div class="grid one">${fText(key + '.name', 'Client name')}</div>
        <div style="margin-top:12px">${fImage(key + '.img', 'Logo image')}</div>`,
      { tpl: 'client', addLabel: 'Add logo', title: (c) => c.name || 'Logo' }
    )}
  </div>

  <div class="card">
    <h2>Filter buttons</h2>
    <p class="hint">Labels of the filter pills on the Services and Our Work pages.</p>
    ${objList(
      'serviceFilters',
      get('serviceFilters') || [],
      (f, i, key) => `<div class="grid">${fText(key + '.label', 'Label')}${fText(key + '.id', 'Key', { tip: 'must match the category keys' })}</div>`,
      { tpl: 'filter', addLabel: 'Add filter', title: (f) => f.label }
    )}
    <div style="height:14px"></div>
    ${objList(
      'workFilters',
      get('workFilters') || [],
      (f, i, key) => `<div class="grid">${fText(key + '.label', 'Label')}${fText(key + '.id', 'Key')}</div>`,
      { tpl: 'filterW', addLabel: 'Add filter', title: (f) => f.label }
    )}
  </div>`;
}

function viewSettings() {
  const size = new Blob([JSON.stringify(C)]).size;
  const connected = canPublish();
  return `
  <div class="card">
    <h2>${connected ? '✅ Ready to publish' : '⚠️ One-time setup'}</h2>
    <p class="hint">
      ${connected
        ? 'Your website is connected. <b>Save Draft</b> stores your changes and <b>Publish</b> puts them live.'
        : 'Paste a GitHub access token below <b>once</b> — it is remembered in this browser and you never type it again.'}
    </p>

    ${connected
      ? `<div class="banner ok"><b>Connected.</b> Repo <code>${esc(S.repo)}</code> ·
           branch <code>${esc(S.branch)}</code> · file <code>${esc(S.filePath)}</code>
           ${S.endpoint ? ' · using a publish server (no token needed here)' : ''}</div>`
      : `<div class="banner warn">
           <b>Step 1.</b> GitHub → Settings → Developer settings → Personal access tokens →
           <b>Tokens (classic)</b> → <b>Generate new token</b>.<br>
           <b>Step 2.</b> Tick <code>repo</code>, generate it, copy the value.<br>
           <b>Step 3.</b> Paste it below and press <b>Save settings</b>. One time only.
         </div>`}

    <div class="grid">
      ${fSetting('repo', 'Repository', { tip: 'already filled in for you' })}
      ${fSetting('branch', 'Branch')}
      ${fSetting('filePath', 'Content file path')}
      ${fSetting('token', 'GitHub access token', { type: 'password', tip: 'stored in this browser only' })}
      ${fSetting('endpoint', 'Publish server (optional)', { tip: 'set this and no token is needed at all' })}
    </div>

    <div style="margin-top:16px;display:flex;gap:10px;flex-wrap:wrap">
      <button class="btn btn-primary" data-act="saveSettings">${ic('save', 15)} Save settings</button>
      <button class="btn btn-ghost" data-act="test">${ic('check', 15)} Test connection</button>
      <button class="btn btn-ok" data-act="publish">${ic('github', 15)} Publish now</button>
      <a class="btn btn-ghost" href="https://github.com/${esc(S.repo || '')}" target="_blank" rel="noopener">${ic('github', 15)} Open repository</a>
    </div>

    <div style="margin-top:20px">${fSetting('autoPublish', 'Publish automatically after every save', { type: 'checkbox', hint: 'When this is on, <b>Save Draft</b> also pushes straight to the live website — no second click.' })}</div>

    <p style="margin-top:14px;font-size:12.5px;color:var(--muted)">
      Current content size: <b>${(size / 1024).toFixed(1)} KB</b>
      ${size > 900000 ? ' — large. Prefer image URLs over uploaded files.' : ''}
    </p>
  </div>

  <div class="card">
    <h2>Admin password</h2>
    <p class="hint">The password used to open this panel.</p>
    <div class="grid">${fSetting('password', 'Panel password')}</div>
    <div style="margin-top:16px"><button class="btn btn-primary" data-act="saveSettings">${ic('save', 15)} Save settings</button></div>
  </div>

  <div class="card">
    <h2>Danger zone</h2>
    <p class="hint">Reset everything back to the original website content. Nothing changes live until you publish.</p>
    <button class="btn btn-danger" data-act="resetAll">${ic('refresh', 15)} Reset to original content</button>
  </div>`;
}

/* ---------------------------------------------------------------- events */
const TEMPLATES = {
  str: '',
  hero: 'assets/1522071820081.jpg',
  service: {
    id: 'new-service',
    num: 9,
    title: 'New Service',
    icon: 'globe',
    img: '',
    category: 'web-mobile',
    group: 'Web & Mobile',
    desc: '',
    bullets: [''],
    detailLead: '',
    projects: []
  },
  serviceProject: {
    badge: 'Project Card',
    metric: '',
    client: '',
    title: 'New Project',
    desc: '',
    img: '',
    highlights: [''],
    tags: ['']
  },
  work: {
    cat: 'web-mobile',
    chip: '',
    metric: '',
    client: '',
    title: 'New Case Study',
    desc: '',
    img: '',
    highlights: [''],
    tags: ['']
  },
  testimonial: { quote: '', name: '', role: '' },
  faq: { q: '', a: '' },
  stat: { value: 0, suffix: '+', label: '' },
  value: { icon: 'target', title: '', text: '' },
  team: { img: '', title: '', role: '', text: '' },
  client: { name: '', img: '' },
  strategy: { icon: 'message', title: '', text: '' },
  transformFeature: { icon: 'smartphone', label: '' },
  process: { n: '05', title: '', text: '' },
  filter: { id: 'new-cat', label: 'New Filter' },
  filterW: { id: 'new-cat', label: 'New Filter' }
};

/* Listeners are attached to `document` ONCE. Rendered markup is replaced on
   every re-render, so binding to the panel itself would stack duplicate
   handlers (and make one click fire several times). */
function bind() {
  if (window.__cmsBound) return;
  window.__cmsBound = true;

  document.addEventListener('input', (e) => {
    const el = e.target;

    // ---- settings fields (live-saved, no content touched) ----
    const sk = el.dataset ? el.dataset.set : null;
    if (sk) {
      S[sk] = el.type === 'checkbox' ? el.checked : el.value;
      saveSettings();
      return;
    }

    const p = el.dataset ? el.dataset.path : null;
    if (!p) return;
    set(p, el.type === 'number' ? Number(el.value) : el.value);

    // keep the collapsed item header label in sync while typing
    const head = el.closest('.item') ? el.closest('.item').querySelector('.item-head .t') : null;
    if (head) {
      const parts = p.split('.');
      const idx = Number(parts[parts.length - 2]);
      const listPath = parts.slice(0, -1).join('.');
      const it = get(listPath);
      if (it && typeof it === 'object' && !Array.isArray(it)) {
        head.textContent = it.title || it.name || it.q || head.textContent;
      } else if (Array.isArray(it)) {
        const obj = get(listPath + '.' + idx);
        if (obj && typeof obj === 'object') head.textContent = obj.title || obj.name || obj.q || head.textContent;
      }
    }
  });

  document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-act],[data-nav]');
    if (!el) return;

    if (el.dataset.nav) {
      active = el.dataset.nav;
      document.getElementById('panel').innerHTML = panel();
      document.querySelectorAll('[data-nav]').forEach((b) => b.classList.toggle('on', b.dataset.nav === active));
      const t = document.querySelector('.top h1');
      if (t) t.textContent = SECTIONS.find((s) => s[0] === active)[1];
      window.scrollTo(0, 0);
      return;
    }

    const act = el.dataset.act;
    const path = el.dataset.path;
    const i = el.dataset.i != null ? Number(el.dataset.i) : null;

    // checkbox toggles that write straight into the settings object
    if (el.dataset.set) {
      S[el.dataset.set] = el.type === 'checkbox' ? el.checked : el.value;
      saveSettings();
      if (el.dataset.set === 'autoPublish') {
        toast(el.checked ? 'Auto-publish is ON — Save will also go live' : 'Auto-publish is OFF', 'ok');
      }
      return;
    }

    switch (act) {
      case 'toggle': {
        collapsed[el.dataset.key] = !collapsed[el.dataset.key];
        el.closest('.item').classList.toggle('collapsed');
        break;
      }
      case 'pick': pickImage(path); break;
      case 'clear': set(path, ''); render(); break;
      case 'addStr': {
        const arr = get(path) || [];
        arr.push(TEMPLATES[el.dataset.tpl] != null ? TEMPLATES[el.dataset.tpl] : '');
        set(path, arr);
        render();
        toast('Item added');
        break;
      }
      case 'addObj': {
        const arr = get(path) || [];
        arr.push(clone(TEMPLATES[el.dataset.tpl]));
        set(path, arr);
        render();
        toast('Item added');
        break;
      }
      case 'rm': {
        const arr = get(path) || [];
        if (!confirm('Delete this item?')) return;
        arr.splice(i, 1);
        set(path, arr);
        render();
        toast('Item deleted');
        break;
      }
      case 'mv': {
        const arr = get(path) || [];
        const j = i + Number(el.dataset.d);
        if (j < 0 || j >= arr.length) return;
        const tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
        set(path, arr);
        render();
        break;
      }
      case 'save': saveDraft(); break;
      case 'discard': discard(); break;
      case 'export': exportJson(); break;
      case 'import': importJson(); break;
      case 'publish': publish(); break;
      case 'saveSettings': {
        document.querySelectorAll('[data-set]').forEach((el) => {
          S[el.dataset.set] = el.type === 'checkbox' ? el.checked : el.value;
        });
        saveSettings();
        toast(S.token || S.endpoint ? 'Settings saved — you are ready to publish ✅' : 'Settings saved', 'ok');
        render();
        break;
      }
      case 'test': testConnection(); break;
      case 'viewSite': window.open('index.html', '_blank'); break;
      case 'logout': localStorage.removeItem(LS_AUTH); location.reload(); break;
      case 'resetAll': {
        if (!confirm('Reset ALL content back to the original website content? Your published file is not affected until you publish.')) return;
        localStorage.removeItem(LS_DRAFT);
        C = clone(window.SOULD_DEFAULTS || {});
        dirty = false;
        render();
        toast('Content reset to the original site', 'ok');
        break;
      }
    }
  });
}

/* ---------------------------------------------------------------- actions */
function saveDraft() {
  try {
    localStorage.setItem(LS_DRAFT, JSON.stringify(C));
    dirty = false;
    document.getElementById('dirty')?.classList.remove('on');
    if (S.autoPublish && canPublish()) {
      publish();
    } else if (S.autoPublish) {
      toast('Draft saved. Auto-publish is ON but no GitHub token is set yet.', 'err');
    } else {
      toast('Draft saved — click Preview to see it on the website', 'ok');
    }
  } catch (e) {
    toast('Could not save — your browser storage is full. Try using image URLs instead of uploads.', 'err');
  }
}

function discard() {
  if (!confirm('Discard your unsaved changes and reload the last saved draft?')) return;
  localStorage.removeItem(LS_DRAFT);
  location.reload();
}

function exportJson() {
  const blob = new Blob([JSON.stringify(C, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'content.json';
  a.click();
  URL.revokeObjectURL(a.href);
  toast('content.json downloaded', 'ok');
}

function importJson() {
  const inp = document.createElement('input');
  inp.type = 'file';
  inp.accept = '.json,application/json';
  inp.onchange = () => {
    const f = inp.files && inp.files[0];
    if (!f) return;
    const fr = new FileReader();
    fr.onload = () => {
      try {
        C = deepMerge(clone(window.SOULD_DEFAULTS || {}), JSON.parse(fr.result));
        markDirty();
        render();
        toast('Content imported — review it, then Save Draft', 'ok');
      } catch (e) {
        toast('That file is not valid JSON', 'err');
      }
    };
    fr.readAsText(f);
  };
  inp.click();
}

/** Are we able to publish at all? (either a proxy endpoint or a token) */
function canPublish() {
  if (S.endpoint) return true;
  return Boolean(S.token && S.repo);
}

/** Publish the current content.
 *  - If a publish endpoint is configured we POST to it: the GitHub token lives on
 *    the server, so the client needs no credentials at all.
 *  - Otherwise we talk to GitHub directly with the saved token. */
async function publish() {
  if (!canPublish()) {
    toast('Add your GitHub access token first (one time only)', 'err');
    active = 'settings';
    render();
    return;
  }
  try {
    if (S.endpoint) {
      toast('Publishing…');
      const r = await fetch(S.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: S.password, content: C })
      });
      const res = await r.json().catch(() => ({}));
      if (!r.ok || res.ok === false) throw new Error(res.error || res.message || 'Publish failed (' + r.status + ')');
    } else {
      await publishDirect();
    }

    localStorage.setItem(LS_DRAFT, JSON.stringify(C));
    dirty = false;
    document.getElementById('dirty')?.classList.remove('on');
    toast('Published! Your live website updates in about a minute.', 'ok');
  } catch (e) {
    toast('Publish failed: ' + e.message, 'err');
  }
}

/** Direct commit to GitHub via the REST API (used when no proxy is set). */
async function publishDirect() {
  const branch = S.branch || 'main';
  const filePath = S.filePath || 'content.json';
  const api = `https://api.github.com/repos/${S.repo}/contents/${filePath}`;
  const headers = { Authorization: `token ${S.token}`, Accept: 'application/vnd.github+json' };

  toast('Publishing…');
  let sha;
  const g = await fetch(`${api}?ref=${branch}`, { headers, cache: 'no-store' });
  if (g.ok) sha = (await g.json()).sha;
  else if (g.status === 401) throw new Error('your access token is wrong or expired');
  else if (g.status === 404) throw new Error('repository "' + S.repo + '" or branch "' + branch + '" not found');
  else {
    const err = await g.json().catch(() => ({}));
    throw new Error(err.message || 'Could not read the repository (' + g.status + ')');
  }

  const body = {
    message: 'Content update — ' + new Date().toISOString().slice(0, 16).replace('T', ' '),
    content: b64utf8(JSON.stringify(C, null, 2)),
    branch
  };
  if (sha) body.sha = sha;

  const r = await fetch(api, {
    method: 'PUT',
    headers: Object.assign({}, headers, { 'Content-Type': 'application/json' }),
    body: JSON.stringify(body)
  });
  if (!r.ok) {
    const err = await r.json().catch(() => ({}));
    if (r.status === 401) throw new Error('your access token is wrong or expired');
    if (r.status === 403) throw new Error('the token has no write access to this repository');
    throw new Error(err.message || 'Publish failed (' + r.status + ')');
  }
}

/** Health-check used by the "Test connection" button. */
async function testConnection() {
  if (S.endpoint) {
    try {
      const r = await fetch(S.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: S.password, test: true })
      });
      const d = await r.json().catch(() => ({}));
      if (r.ok && d.ok !== false) toast('Publish server reachable ✅ ' + (d.repo ? '→ ' + d.repo : ''), 'ok');
      else toast('Publish server said: ' + (d.error || r.status), 'err');
    } catch (e) {
      toast('Could not reach the publish server: ' + e.message, 'err');
    }
    return;
  }
  if (!S.token || !S.repo) { toast('Add a token first', 'err'); return; }
  try {
    const r = await fetch('https://api.github.com/repos/' + S.repo, {
      headers: { Authorization: 'token ' + S.token, Accept: 'application/vnd.github+json' }
    });
    if (r.ok) {
      const d = await r.json();
      toast('Connected ✅ ' + d.full_name + (d.permissions ? ' (can push: ' + d.permissions.push + ')' : ''), 'ok');
    } else if (r.status === 401) toast('Token is wrong or expired', 'err');
    else toast('Repository not found — check the name', 'err');
  } catch (e) {
    toast('Connection failed: ' + e.message, 'err');
  }
}

function b64utf8(str) {
  const bytes = new TextEncoder().encode(str);
  let bin = '';
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin);
}
