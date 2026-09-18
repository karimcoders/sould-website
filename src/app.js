/* ==========================================================================
   Soul-D. Digital Marketing Solutions — SPA
   Hash router + view components. No build step, no dependencies.
   ========================================================================== */

/* -------------------------------------------------------------------------
   0. Content binding
   The whole site renders from CONTENT. It starts as the built-in defaults and
   is replaced at boot by (a) published content.json and (b) the admin draft
   saved in this browser — see SOULD_BOOT() at the bottom of this file.
   ------------------------------------------------------------------------- */
let CONTENT = window.SOULD_DEFAULTS || {};

/** Tiny inline markup for headings:
 *    [b]blue text[/b]   -> highlighted in Soul-D blue
 *    [w]white text[/w]  -> forced white (used inside a blue phrase)
 *    newline            -> line break
 *  Everything else is escaped, so no HTML injection is possible. */
function rich(str, cls) {
  const safe = esc(String(str == null ? '' : str));
  return safe
    .replace(/\[b\]([\s\S]*?)\[\/b\]/g, '<span class="' + (cls || 'blue') + '">$1</span>')
    .replace(/\[w\]([\s\S]*?)\[\/w\]/g, '<span style="color:#fff">$1</span>')
    .replace(/\n/g, '<br>');
}

/* -------------------------------------------------------------------------
   1. Icons (lucide-style, inlined)
   ------------------------------------------------------------------------- */
const I = {
  'chevron-down': '<path d="m6 9 6 6 6-6"/>',
  'chevron-right': '<path d="m9 18 6-6-6-6"/>',
  'chevron-left': '<path d="m15 18-6-6 6-6"/>',
  'arrow-right': '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  menu: '<path d="M4 5h16"/><path d="M4 12h16"/><path d="M4 19h16"/>',
  x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  'globe': '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
  smartphone: '<rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/>',
  'pen-tool': '<path d="M15.707 21.293a1 1 0 0 1-1.414 0l-1.586-1.586a1 1 0 0 1 0-1.414l5.586-5.586a1 1 0 0 1 1.414 0l1.586 1.586a1 1 0 0 1 0 1.414z"/><path d="m18 13-1.375-6.874a1 1 0 0 0-.746-.776L3.235 2.028a1 1 0 0 0-1.207 1.207L5.35 15.879a1 1 0 0 0 .776.746L13 18"/><path d="m2.3 2.3 7.286 7.286"/><circle cx="11" cy="11" r="2"/>',
  video: '<path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"/><rect x="2" y="6" width="14" height="12" rx="2"/>',
  instagram: '<rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>',
  target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
  'user-round': '<circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/>',
  package: '<path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"/><path d="M12 22V12"/><path d="m3.3 7 7.703 4.734a2 2 0 0 0 1.994 0L20.7 7"/>',
  'layout-panel': '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/>',
  send: '<path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"/><path d="m21.854 2.147-10.94 10.939"/>',
  'bar-chart': '<line x1="12" x2="12" y1="20" y2="10"/><line x1="18" x2="18" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="16"/>',
  'check-circle': '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
  'shield-check': '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  heart: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
  phone: '<path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"/>',
  mail: '<path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"/><rect height="16" rx="2" width="20" x="2" y="4"/>',
  'map-pin': '<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>',
  clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  linkedin: '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect height="12" width="4" x="2" y="9"/><circle cx="4" cy="4" r="2"/>',
  facebook: '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>',
  youtube: '<path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/>',
  twitter: '<path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>',
  message: '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>',
  megaphone: '<path d="M11 6a13 13 0 0 0 8.4-2.8A1 1 0 0 1 21 4v12a1 1 0 0 1-1.6.8A13 13 0 0 0 11 14H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z"/><path d="M6 14a12 12 0 0 0 2.4 7.2 2 2 0 0 0 3.2-2.4A8 8 0 0 1 10 14"/><path d="M8 6v8"/>',
  clapperboard: '<path d="M20.2 6 3 11l-.9-2.4c-.3-1.1.3-2.2 1.3-2.5l13.5-4c1.1-.3 2.2.3 2.5 1.3Z"/><path d="m6.2 5.3 3.1 3.9"/><path d="m12.4 3.4 3.1 4"/><path d="M3 11h18v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/>',
  'badge-dollar': '<path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 18V6"/>',
  sparkles: '<path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"/><path d="M20 2v4"/><path d="M22 4h-4"/><circle cx="4" cy="20" r="2"/>',
  zap: '<path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>'
};

function icon(name, size = 24, cls = '') {
  return `<svg class="${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
    aria-hidden="true">${I[name] || ''}</svg>`;
}

/* -------------------------------------------------------------------------
   2. Small helpers
   ------------------------------------------------------------------------- */
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function go(path) {
  if (location.hash === '#' + path) return;
  location.hash = path;
}

/** home services carousel — desktop card (number · title · explore · icon) */
function svcCardDesk(s) {
  return `
  <article class="svc-card" data-goto="/services/${s.id}" tabindex="0" role="link" aria-label="${esc(s.title)}">
    <img src="${s.img}" alt="${esc(s.title)}" loading="lazy">
    <div class="veil"></div>
    <div class="body">
      <span class="num">${s.num}</span>
      <h3>${esc(s.title)}</h3>
      <div class="foot">
        <span class="explore">Explore ${icon('chevron-right', 16)}</span>
        <span class="ic-btn">${icon(s.icon, 24)}</span>
      </div>
    </div>
  </article>`;
}

/** home services — mobile card (number · title · description · explore/quote) */
function svcCardMobile(s) {
  return `
  <article class="svc-card m" data-goto="/services/${s.id}" tabindex="0" role="link" aria-label="${esc(s.title)}">
    <img src="${s.img}" alt="${esc(s.title)}">
    <div class="veil"></div>
    <div class="body">
      <span class="num">${s.num}</span>
      <h3>${esc(s.title)}</h3>
      <p>${esc(s.desc)}</p>
      <div class="foot">
        <button type="button" class="explore" data-goto="/services/${s.id}">Explore ${icon('chevron-right', 16)}</button>
        <button type="button" class="quote" data-goto="/contact">Quote</button>
      </div>
    </div>
  </article>`;
}

/* -------------------------------------------------------------------------
   3. Header / footer / floating buttons
   ------------------------------------------------------------------------- */
function Header(route) {
  const isActive = (p) => route.path === p || (p !== '/' && route.path.startsWith(p));
  const svcLinks = CONTENT.services.map(
    (s) => `<a href="#/services/${s.id}" class="${route.path === '/services/' + s.id ? 'active' : ''}">${esc(s.shortTitle || s.title)}</a>`
  ).join('');

  return `
  <header class="site-header" id="siteHeader">
    <div class="shell">
      <div class="bar">
        <div class="brand-col-wrap">
          <a class="brand" href="#/" aria-label="Soul-D. home">
            <img src="${CONTENT.images.souldLogoHeader}" alt="Soul-D.">
          </a>
          <span class="brand-tag">${CONTENT.site.tagline}</span>
        </div>

        <nav class="nav">
          <a href="#/" class="${route.path === '/' ? 'active' : ''}">${esc(CONTENT.copy.navHome)}</a>
          <div class="nav-drop">
            <a class="nav-link ${isActive('/services') ? 'active' : ''}" href="#/services">
              Services ${icon('chevron-down', 14)}
            </a>
            <div class="nav-menu">${svcLinks}</div>
          </div>
          <a href="#/work" class="${route.path === '/work' ? 'active' : ''}">${esc(CONTENT.copy.navWork)}</a>
          <a href="#/about" class="${route.path === '/about' ? 'active' : ''}">${esc(CONTENT.copy.navAbout)}</a>
          <a href="#/contact" class="${route.path === '/contact' ? 'active' : ''}">${esc(CONTENT.copy.navContact)}</a>
        </nav>

        <div class="header-actions">
          <button type="button" class="btn btn-primary" data-goto="/contact">${esc(CONTENT.copy.navCta)}</button>
        </div>

        <button type="button" class="burger" id="burger" aria-label="Toggle menu" aria-expanded="false">
          ${icon('menu', 24, 'ic-menu')}${icon('x', 24, 'ic-close')}
        </button>
      </div>
    </div>

    <div class="mobile-nav" id="mobileNav">
      <a href="#/" class="${route.path === '/' ? 'active' : ''}">Home</a>
      <a href="#/services" class="${route.path === '/services' ? 'active' : ''}">${esc(CONTENT.copy.navServices)}</a>
      <div class="sub">${CONTENT.services.map((s) => `<a href="#/services/${s.id}">${esc(s.shortTitle || s.title)}</a>`).join('')}</div>
      <a href="#/work" class="${route.path === '/work' ? 'active' : ''}">${esc(CONTENT.copy.navWork)}</a>
      <a href="#/about" class="${route.path === '/about' ? 'active' : ''}">${esc(CONTENT.copy.navAbout)}</a>
      <a href="#/contact" class="${route.path === '/contact' ? 'active' : ''}">${esc(CONTENT.copy.navContact)}</a>
      <button type="button" class="btn btn-primary" data-goto="/contact">${esc(CONTENT.copy.navCta)}</button>
    </div>
  </header>`;
}

function Footer() {
  const socials = [
    ['linkedin', 'LinkedIn', CONTENT.site.social.linkedin],
    ['instagram', 'Instagram', CONTENT.site.social.instagram],
    ['facebook', 'Facebook', CONTENT.site.social.facebook],
    ['youtube', 'YouTube', CONTENT.site.social.youtube],
    ['twitter', 'X', CONTENT.site.social.twitter]
  ]
    .map(
      ([ic, label, url]) =>
        `<a href="${url}" target="_blank" rel="noopener noreferrer" aria-label="Soul-D. on ${label}">${icon(ic, 34)}</a>`
    )
    .join('');

  return `
  <footer class="footer">
    <div class="shell">
      <div class="footer-grid">
        <div class="brand-col">
          <a href="#/" class="brand" aria-label="Soul-D. home">
            <img src="${CONTENT.images.souldLogoFooter}" alt="Soul-D.">
          </a>
          <p class="tagline">${esc(CONTENT.copy.footerTagline)}</p>
          <div class="socials">${socials}</div>
        </div>

        <div>
          <h4>${esc(CONTENT.copy.footerServicesTitle)}</h4>
          <ul class="svc-links">
            ${CONTENT.services.map((s) => `<li><a href="#/services/${s.id}">${esc(s.title)}</a></li>`).join('')}
          </ul>
        </div>

        <div>
          <h4>${esc(CONTENT.copy.footerContactTitle)}</h4>
          <div class="contact-links">
            <a href="mailto:${CONTENT.site.email}">${icon('globe', 20)}<span>${CONTENT.site.domain}</span></a>
            <a href="mailto:${CONTENT.site.email}">${icon('mail', 20)}<span>${CONTENT.site.email}</span></a>
            <a href="tel:${CONTENT.site.tel}">${icon('phone', 20)}<span>${CONTENT.site.phone}</span></a>
            <div>${icon('map-pin', 20)}<span>${CONTENT.site.address}</span></div>
          </div>
        </div>
      </div>

      <div class="footer-bottom">${esc(CONTENT.copy.footerCopyright)}</div>
    </div>
  </footer>`;
}

function Floaters() {
  return `
  <div class="floaters">
    <a class="wa" href="https://wa.me/${CONTENT.site.whatsapp}" target="_blank" rel="noopener noreferrer" aria-label="Chat with us on WhatsApp">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
    </a>
    <a class="call" href="tel:${CONTENT.site.tel}" aria-label="Call us">
      ${icon('phone', 24)}
    </a>
  </div>`;
}

/* -------------------------------------------------------------------------
   4. Reusable blocks
   ------------------------------------------------------------------------- */
function ProposalForm() {
  const options = CONTENT.services.map((s) => `<option>${esc(s.title)}</option>`).join('');
  return `
  <form class="form-card" id="proposalForm" novalidate>
    <h3>${esc(CONTENT.copy.formTitle)}</h3>
    <p class="hint">${esc(CONTENT.copy.formHint)}</p>

    <div class="form-grid">
      <div class="field">
        <label for="p-name">Full Name <span class="req">*</span></label>
        <input id="p-name" name="name" type="text" placeholder="John Doe" required>
      </div>
      <div class="field">
        <label for="p-email">Email Address <span class="req">*</span></label>
        <input id="p-email" name="email" type="email" placeholder="john@example.com" required>
      </div>
      <div class="field">
        <label for="p-phone">Phone Number <span class="req">*</span></label>
        <input id="p-phone" name="phone" type="tel" placeholder="+91 9866500578" required>
      </div>
      <div class="field">
        <label for="p-company">Company / Brand</label>
        <input id="p-company" name="company" type="text" placeholder="Acme Corp">
      </div>
      <div class="field full">
        <label for="p-service">Service <span class="req">*</span></label>
        <select id="p-service" name="service" required>${options}</select>
      </div>
      <div class="field full">
        <label for="p-budget">Estimated Budget (INR)</label>
        <input id="p-budget" name="budget" type="text" placeholder="e.g. 50000">
      </div>
      <div class="field full">
        <label for="p-details">Project Details <span class="req">*</span></label>
        <textarea id="p-details" name="details" placeholder="Tell us about your goals, audience, deliverables, and any launch deadlines." required></textarea>
      </div>
    </div>

    <div style="margin-top:22px">
      <button type="submit" class="btn btn-primary btn-block">
        ${icon('send', 16)} ${esc(CONTENT.copy.formSubmit)}
      </button>
    </div>
    <p class="form-note" id="formNote" role="status"></p>
  </form>`;
}

function FaqBlock() {
  return `
  <div class="faq">
    ${CONTENT.faqs.map(
      (f, i) => `
      <div class="faq-item" data-faq="${i}">
        <button type="button" class="faq-q" aria-expanded="false" aria-controls="faq-${i}">
          <span>${esc(f.q)}</span>${icon('chevron-down', 20)}
        </button>
        <div class="faq-a" id="faq-${i}" hidden>${esc(f.a)}</div>
      </div>`
    ).join('')}
  </div>`;
}

/* -------------------------------------------------------------------------
   5. HOME
   ------------------------------------------------------------------------- */
function Home() {
  const logos = CONTENT.clients.concat(CONTENT.clients);
  const logoRow = logos
    .map(
      (c) =>
        `<div class="logo-tile${c.name.startsWith('Blue Diamond') ? ' big' : ''}"><img src="${c.img}" alt="${esc(c.name)}"></div>`
    )
    .join('');

  const pages = [];
  for (let i = 0; i < CONTENT.testimonials.length; i += 3) pages.push(CONTENT.testimonials.slice(i, i + 3));

  return `
  <section class="hero" id="home">
    <div class="hero-bg">
      ${CONTENT.heroSlides.map(
        (src, i) => `<div class="hero-slide ${i === 0 ? 'active' : ''}"><div class="img" style="background-image:url('${src}')"></div></div>`
      ).join('')}
      <div class="hero-tint"></div>
      <div class="hero-shape-1"></div>
      <div class="hero-shape-2"></div>
    </div>

    <div class="hero-dots" id="heroDots">
      ${CONTENT.heroSlides.map(
        (_, i) => `<button type="button" class="${i === 0 ? 'on' : ''}" data-slide="${i}" aria-label="Go to slide ${i + 1}"></button>`
      ).join('')}
    </div>

    <div class="shell-wide" style="position:relative;z-index:4">
      <div class="hero-inner">
        <h1 class="a">${rich(CONTENT.copy.homeHero1)}</h1>
        <h1 class="b">${rich(CONTENT.copy.homeHero2)}</h1>
        <div class="hero-actions">
          <button type="button" class="btn btn-outline" data-goto="/contact">${esc(CONTENT.copy.homeHeroBtn1)}</button>
          <button type="button" class="btn btn-ghost" data-scroll="#services">
            <span>${esc(CONTENT.copy.homeHeroBtn2)}</span>${icon('arrow-right', 16)}
          </button>
        </div>
      </div>
    </div>
  </section>

  <section class="svc-strip" id="services">
    <div class="shell-wide">
      <div class="svc-grid-mobile">
        ${CONTENT.services.map(svcCardMobile).join('')}
      </div>
      <div class="svc-track-wrap">
        <div class="svc-track-outer">
          <button type="button" class="svc-arrow prev" id="svcPrev" data-scroll-track="-1" aria-label="Previous services">${icon('chevron-left', 20)}</button>
          <button type="button" class="svc-arrow next" id="svcNext" data-scroll-track="1" aria-label="More services">${icon('chevron-right', 20)}</button>
          <div class="svc-track" id="svcTrack">${CONTENT.services.map(svcCardDesk).join('')}</div>
        </div>
      </div>
    </div>
  </section>

  <section class="sec sec-light" id="about">
    <div class="shell">
      <div class="stats">
        <div class="stats-grid">
          ${CONTENT.stats.map(
            (s) => `
            <div class="stat">
              <span class="value"><span class="count" data-to="${s.value}">0</span>${s.suffix}</span>
              <span class="label">${esc(s.label)}</span>
            </div>`
          ).join('')}
        </div>
      </div>

      <div class="split">
        <div class="reveal">
          <h2 class="title">${rich(CONTENT.copy.homeAboutTitle)}</h2>
          <p class="lead" style="max-width:36rem">${esc(CONTENT.copy.homeAboutText)}</p>
          <ul class="feature-list">
            ${CONTENT.transformFeatures.map((f) => `<li>${icon(f.icon, 16)}<span>${esc(f.label)}</span></li>`).join('')}
          </ul>
          <div class="cta-row">
            <button type="button" class="btn-gradient" data-goto="/services">
              <span>${esc(CONTENT.copy.homeAboutBtn)}</span>${icon('sparkles', 16)}
            </button>
            <button type="button" class="btn btn-ghost" style="color:var(--muted-2)" data-scroll="#services">
              <span>${esc(CONTENT.copy.homeAboutLink)}</span>${icon('arrow-right', 16)}
            </button>
          </div>
        </div>
        <div class="reveal" style="display:flex;justify-content:flex-end">
          <div class="collage">
            <div class="big"><img src="${CONTENT.images.hub1}" alt="Team collaboration on HubSpot website" loading="lazy"></div>
            <div class="small"><img src="${CONTENT.images.hub2}" alt="Focused marketer creating drag-and-drop website" loading="lazy"></div>
            <div class="glow"></div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="sec sec-dark" id="what-we-do">
    <div class="shell">
      <div class="strategy-head">
        <h2 class="title reveal">${rich(CONTENT.copy.homeStrategyTitle)}</h2>
        <p class="kicker reveal">${esc(CONTENT.copy.homeStrategyText)}</p>
      </div>
      <div class="cols-3">
        ${CONTENT.strategies.map(
          (s) => `
          <div class="reveal">
            <div class="card-icon">${icon(s.icon, 24)}</div>
            <h3>${esc(s.title)}</h3>
            <p>${esc(s.text)}</p>
            <a class="link-arrow" href="#/services">${esc(CONTENT.copy.homeStrategyLink)} ${icon('chevron-right', 14)}</a>
          </div>`
        ).join('')}
      </div>
    </div>
  </section>

  <section class="sec sec-gray" id="our-work" style="padding:60px 0 96px">
    <div class="shell">
      <div class="center reveal" style="margin-bottom:64px">
        <h2 class="title" style="margin-bottom:16px">${rich(CONTENT.copy.homeRecognitionTitle)}</h2>
        <p style="color:var(--muted-2);font-size:30px;line-height:1.5;max-width:1000px;margin:0 auto">${esc(CONTENT.copy.homeRecognitionText)}</p>
      </div>

      <div class="marquee-zone">
        <div class="marquee">
          <div class="marquee-track">${logoRow}${logoRow}</div>
        </div>
      </div>

      <div class="tst-viewport reveal">
        <button type="button" class="tst-arrow prev" data-tst="-1" aria-label="Previous testimonials">${icon('chevron-left', 18)}</button>
        <div class="tst-window">
          <div class="tst-track" id="tstTrack">
            ${pages
              .map(
                (pg) => `
              <div class="tst-page">
                ${pg
                  .map(
                    (t) => `
                  <article class="tst-card">
                    <div class="stars" aria-label="5 out of 5 stars">★★★★★</div>
                    <blockquote>“${esc(t.quote)}”</blockquote>
                    <footer class="who">
                      <div class="nm">${esc(t.name)}</div>
                      <div class="rl">${esc(t.role)}</div>
                    </footer>
                  </article>`
                  )
                  .join('')}
              </div>`
              )
              .join('')}
          </div>
        </div>
        <button type="button" class="tst-arrow next" data-tst="1" aria-label="Next testimonials">${icon('chevron-right', 18)}</button>
      </div>
    </div>
  </section>

  <section class="sec sec-black" id="custom-proposal">
    <div class="glow-1"></div>
    <div class="glow-2"></div>
    <div class="shell">
      <div class="proposal">
        <div class="reveal">
          <h2 class="title" style="margin-bottom:20px">${rich(CONTENT.copy.homeProposalTitle)}</h2>
          <p style="color:#cbd5e1;font-size:18px;line-height:1.7;max-width:36rem;margin-bottom:32px">${esc(CONTENT.copy.homeProposalText)}</p>
          <div class="perks">
            <div class="perk">
              <span class="ic">${icon('shield-check', 20)}</span>
              <div>
                <h4>Tailored Scope</h4>
                <p>Services mapped to your stage, goals, and budget.</p>
              </div>
            </div>
            <div class="perk">
              <span class="ic">${icon('clock', 20)}</span>
              <div>
                <h4>Fast Review</h4>
                <p>Expect a response within 2 to 4 business hours.</p>
              </div>
            </div>
            <div class="perk">
              <span class="ic">${icon('mail', 20)}</span>
              <div>
                <h4>Direct Contact</h4>
                <p>${CONTENT.site.email}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="reveal">${ProposalForm()}</div>
      </div>
    </div>
  </section>

  <section class="sec sec-white">
    <div class="shell" style="max-width:896px">
      <div class="center reveal" style="margin-bottom:48px">
        <h2 class="title" style="margin-bottom:12px">${rich(CONTENT.copy.homeFaqTitle)}</h2>
        <p style="color:var(--muted-2);font-size:30px;line-height:1.45">${rich(CONTENT.copy.homeFaqText)}</p>
      </div>
      ${FaqBlock()}
    </div>
  </section>`;
}

/* -------------------------------------------------------------------------
   6. CONTENT.services
   ------------------------------------------------------------------------- */
function ServicesPage() {
  return `
  <section class="hero-inner-page">
    <div class="glow"></div>
    <div class="shell" style="max-width:1280px">
      <div class="wrap">
        <h1>${rich(CONTENT.copy.servicesHeroTitle)}</h1>
        <p>${esc(CONTENT.copy.servicesHeroText)}</p>
      </div>
    </div>
  </section>

  <div class="page-light">
    <section class="sec">
      <div class="shell" style="max-width:1280px">
        <div class="tabs">
          ${CONTENT.serviceFilters.map(
            (f) => `<button type="button" class="tab ${f.id === 'all' ? 'on' : ''}" data-svc-filter="${f.id}">${esc(f.label)}</button>`
          ).join('')}
        </div>

        <div class="svc-grid" id="svcGrid">
          ${CONTENT.services.map(
            (s) => `
            <article class="svc-tile" data-cat="${s.category}">
              <div>
                <div class="ic">${icon(s.icon, 24)}</div>
                <h3>${esc(s.title)}</h3>
                <p>${esc(s.desc)}</p>
                <ul>
                  ${s.bullets.map((b) => `<li>${icon('check-circle', 14)}<span>${esc(b)}</span></li>`).join('')}
                </ul>
              </div>
              <div class="foot">
                <button type="button" class="req" data-goto="/contact">Request Quote ${icon('chevron-right', 14)}</button>
                <a class="det" href="#/services/${s.id}">Details</a>
              </div>
            </article>`
          ).join('')}
        </div>
      </div>
    </section>

    <section class="sec sec-white">
      <div class="shell" style="max-width:1280px">
        <div class="sec-head reveal">
          <h2 class="title">${rich(CONTENT.copy.servicesProcessTitle)}</h2>
          <p>${esc(CONTENT.copy.servicesProcessText)}</p>
        </div>
        <div class="process">
          ${CONTENT.process.map(
            (p) => `
            <div class="step reveal">
              <span class="n">${p.n}</span>
              <h4>${esc(p.title)}</h4>
              <p>${esc(p.text)}</p>
            </div>`
          ).join('')}
        </div>
      </div>
    </section>

    <section class="hero-inner-page" style="padding:80px 0">
      <div class="glow"></div>
      <div class="shell" style="max-width:1024px">
        <div class="wrap">
          <h2 class="title" style="color:#fff;margin-bottom:16px">${rich(CONTENT.copy.servicesCtaTitle)}</h2>
          <p style="margin-bottom:32px">${esc(CONTENT.copy.servicesCtaText)}</p>
          <button type="button" class="btn btn-cta" data-goto="/contact">${esc(CONTENT.copy.servicesCtaBtn)} ${icon('arrow-right', 18)}</button>
        </div>
      </div>
    </section>
  </div>`;
}

/* -------------------------------------------------------------------------
   7. SERVICE DETAIL
   ------------------------------------------------------------------------- */
function ServiceDetailPage(id) {
  const s = CONTENT.services.find((x) => x.id === id);
  if (!s) {
    return `
    <section class="nf">
      <div>
        <div class="code">404</div>
        <h1>Service Not Found</h1>
        <p>That service page doesn’t exist. Browse our full list of digital marketing services instead.</p>
        <div style="margin-top:28px"><button type="button" class="btn btn-solid" data-goto="/services">View All Services ${icon('arrow-right', 18)}</button></div>
      </div>
    </section>`;
  }

  return `
  <section class="hero-inner-page">
    <div class="glow"></div>
    <div class="shell" style="max-width:1280px">
      <div class="wrap" style="text-align:left">
        <h1>${esc(s.title)}<br><span class="blue">${esc(CONTENT.copy.detailProjectsWord || 'Projects')}</span></h1>
        <p style="margin:0">${esc(s.detailLead)}</p>
      </div>
    </div>
  </section>

  <div class="page-light">
    <section class="sec">
      <div class="shell" style="max-width:1280px">
        <div class="work-grid" style="grid-template-columns:repeat(2,1fr)">
          ${s.projects.map(workCard).join('')}
        </div>
      </div>
    </section>

    <section class="hero-inner-page" style="padding:80px 0">
      <div class="glow"></div>
      <div class="shell" style="max-width:1024px">
        <div class="wrap">
          <h2 class="title" style="color:#fff;margin-bottom:16px">${rich(CONTENT.copy.detailCtaTitle)}</h2>
          <p style="margin-bottom:32px">${esc(CONTENT.copy.detailCtaText)}</p>
          <button type="button" class="btn btn-cta" data-goto="/contact">${esc(CONTENT.copy.detailCtaBtn)} ${icon('arrow-right', 18)}</button>
        </div>
      </div>
    </section>
  </div>`;
}

/* -------------------------------------------------------------------------
   8. WORK
   ------------------------------------------------------------------------- */
function workCard(w) {
  return `
  <article class="work-card" data-cat="${w.cat}">
    <div class="work-media">
      <img src="${w.img}" alt="${esc(w.title)}" loading="lazy">
      <span class="chip">${esc(w.chip || w.badge || 'Project Card')}</span>
      <span class="chip-metric">${esc(w.metric)}</span>
    </div>
    <div class="work-body">
      <div class="client">${esc(w.client)}</div>
      <h3>${esc(w.title)}</h3>
      <p class="desc">${esc(w.desc)}</p>
      <div class="hl-label">Key Highlights:</div>
      <ul class="hl">
        ${w.highlights.map((h) => `<li>${icon('check-circle', 15)}<span>${esc(h)}</span></li>`).join('')}
      </ul>
      <div class="tags">${w.tags.map((t) => `<span class="tag">${esc(t)}</span>`).join('')}</div>
      <button type="button" class="cta" data-goto="/contact">Build Similar Solution ${icon('arrow-right', 18)}</button>
    </div>
  </article>`;
}

function WorkPage() {
  return `
  <section class="hero-inner-page">
    <div class="glow"></div>
    <div class="shell" style="max-width:1280px">
      <div class="wrap">
        <h1>${rich(CONTENT.copy.workHeroTitle)}</h1>
        <p>${esc(CONTENT.copy.workHeroText)}</p>
      </div>
    </div>
  </section>

  <div class="page-light">
    <section class="sec">
      <div class="shell" style="max-width:1280px">
        <div class="tabs">
          ${CONTENT.workFilters.map(
            (f) => `<button type="button" class="tab ${f.id === 'all' ? 'on' : ''}" data-work-filter="${f.id}">${esc(f.label)}</button>`
          ).join('')}
        </div>
        <div class="work-grid" id="workGrid">
          ${CONTENT.works.map(workCard).join('')}
        </div>
      </div>
    </section>

    <section class="hero-inner-page" style="padding:80px 0">
      <div class="glow"></div>
      <div class="shell" style="max-width:1024px">
        <div class="wrap">
          <h2 class="title" style="color:#fff;margin-bottom:16px">${rich(CONTENT.copy.workCtaTitle)}</h2>
          <p style="margin-bottom:32px">${esc(CONTENT.copy.workCtaText)}</p>
          <button type="button" class="btn btn-cta" data-goto="/contact">${esc(CONTENT.copy.workCtaBtn)} ${icon('arrow-right', 18)}</button>
        </div>
      </div>
    </section>
  </div>`;
}

/* -------------------------------------------------------------------------
   9. ABOUT
   ------------------------------------------------------------------------- */
function AboutPage() {
  return `
  <section class="hero-inner-page">
    <div class="glow"></div>
    <div class="shell" style="max-width:1280px">
      <div class="wrap">
        <h1>${rich(CONTENT.copy.aboutHeroTitle)}</h1>
        <p>${esc(CONTENT.copy.aboutHeroText)}</p>
      </div>
    </div>
  </section>

  <div class="page-light">
    <section class="sec">
      <div class="shell" style="max-width:1280px">
        <div class="split">
          <div class="reveal">
            <span class="eyebrow">${esc(CONTENT.copy.aboutStoryEyebrow)}</span>
            <h2 class="title" style="margin-top:14px">${rich(CONTENT.copy.aboutStoryTitle)}</h2>
            <p class="lead">${esc(CONTENT.copy.aboutStoryP1)}</p>
            <p class="lead">${esc(CONTENT.copy.aboutStoryP2)}</p>
            <ul class="feature-list" style="grid-template-columns:1fr">
              <li>${icon('check-circle', 18)}<span>Tailored digital strategies with guaranteed transparency</span></li>
              <li>${icon('check-circle', 18)}<span>Multi-disciplinary team of engineers, designers &amp; marketers</span></li>
              <li>${icon('check-circle', 18)}<span>End-to-end execution from design to ad optimization</span></li>
            </ul>
          </div>
          <div class="collage reveal" style="border-radius:18px;overflow:hidden;box-shadow:var(--shadow-lg)">
            <img src="assets/1522071820081.jpg" alt="Soul-D Team" style="width:100%;height:420px;object-fit:cover" loading="lazy">
            <div class="motto">
              <div class="lbl">${esc(CONTENT.copy.aboutMottoLabel)}</div>
              <div class="txt">${esc(CONTENT.copy.aboutMottoText)}</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="sec sec-white">
      <div class="shell" style="max-width:1280px">
        <div class="sec-head reveal">
          <h2 class="title">${rich(CONTENT.copy.aboutValuesTitle)}</h2>
          <p>${esc(CONTENT.copy.aboutValuesText)}</p>
        </div>
        <div class="value-grid">
          ${CONTENT.values.map(
            (v) => `
            <div class="value-card reveal">
              <div class="card-icon">${icon(v.icon, 22)}</div>
              <h3>${esc(v.title)}</h3>
              <p>${esc(v.text)}</p>
            </div>`
          ).join('')}
        </div>
      </div>
    </section>

    <section class="sec">
      <div class="shell" style="max-width:1280px">
        <div class="sec-head reveal">
          <h2 class="title">${rich(CONTENT.copy.aboutTeamTitle)}</h2>
          <p>${esc(CONTENT.copy.aboutTeamText)}</p>
        </div>
        <div class="team-grid">
          ${CONTENT.team.map(
            (t) => `
            <article class="team-card reveal">
              <div class="pic"><img src="${t.img}" alt="${esc(t.title)}" loading="lazy"></div>
              <div class="info">
                <h3>${esc(t.title)}</h3>
                <div class="role">${esc(t.role)}</div>
                <p>${esc(t.text)}</p>
              </div>
            </article>`
          ).join('')}
        </div>
      </div>
    </section>

    <section class="hero-inner-page" style="padding:80px 0">
      <div class="glow"></div>
      <div class="shell" style="max-width:1024px">
        <div class="wrap">
          <h2 class="title" style="color:#fff;margin-bottom:16px">${rich(CONTENT.copy.aboutCtaTitle)}</h2>
          <p style="margin-bottom:32px">${esc(CONTENT.copy.aboutCtaText)}</p>
          <button type="button" class="btn btn-cta" data-goto="/contact">${esc(CONTENT.copy.aboutCtaBtn)} ${icon('arrow-right', 18)}</button>
        </div>
      </div>
    </section>
  </div>`;
}

/* -------------------------------------------------------------------------
   10. CONTACT
   ------------------------------------------------------------------------- */
function ContactPage() {
  return `
  <section class="hero-inner-page">
    <div class="glow"></div>
    <div class="shell" style="max-width:1280px">
      <div class="wrap">
        <h1>${rich(CONTENT.copy.contactHeroTitle)}</h1>
        <p>${esc(CONTENT.copy.contactHeroText)}</p>
      </div>
    </div>
  </section>

  <div class="page-light">
    <section class="sec">
      <div class="shell" style="max-width:1280px">
        <div class="contact-grid">
          <div class="reveal">
            <h2 class="title" style="font-size:32px">${rich(CONTENT.copy.contactDirectTitle)}</h2>
            <p class="lead" style="font-size:15px;margin-top:14px">${esc(CONTENT.copy.contactDirectText)}</p>

            <div class="contact-cards">
              <div class="contact-card">
                <span class="ic">${icon('phone', 22)}</span>
                <div>
                  <div class="lbl">Phone &amp; WhatsApp</div>
                  <a class="val" href="tel:${CONTENT.site.tel}">${CONTENT.site.phone}</a>
                  <div class="sub">${CONTENT.site.hours}</div>
                </div>
              </div>
              <div class="contact-card">
                <span class="ic">${icon('mail', 22)}</span>
                <div>
                  <div class="lbl">Email Inquiry</div>
                  <a class="val" href="mailto:${CONTENT.site.email}">${CONTENT.site.email}</a>
                  <div class="sub">2-4 Hour Guaranteed Response SLA</div>
                </div>
              </div>
              <div class="contact-card">
                <span class="ic">${icon('map-pin', 22)}</span>
                <div>
                  <div class="lbl">Headquarters</div>
                  <div class="val">${CONTENT.site.address}</div>
                  <div class="sub">Serving Clients Globally</div>
                </div>
              </div>
            </div>
          </div>

          <div class="reveal">${ProposalForm()}</div>
        </div>
      </div>
    </section>

    <section class="sec sec-white">
      <div class="shell" style="max-width:900px">
        <div class="sec-head reveal">
          <h2 class="title">Frequently Asked Questions</h2>
          <p>Everything you need to know about partnering with Soul-D.</p>
        </div>
        ${FaqBlock()}
      </div>
    </section>
  </div>`;
}

/* -------------------------------------------------------------------------
   11. Terms / Privacy (not on live site -> not routed)
   ------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------
   12. Router
   ------------------------------------------------------------------------- */
function parseHash() {
  let raw = location.hash.replace(/^#/, '');
  if (!raw || raw === '/') return { path: '/', parts: [] };
  if (!raw.startsWith('/')) raw = '/' + raw;
  const parts = raw.split('/').filter(Boolean);
  return { path: '/' + parts.join('/'), parts };
}

function renderRoute() {
  const route = parseHash();
  const app = document.getElementById('app');
  let view;

  if (route.parts.length === 0) view = Home();
  else if (route.parts[0] === 'services') {
    view = route.parts.length === 1 ? ServicesPage() : ServiceDetailPage(route.parts[1]);
  } else if (route.parts[0] === 'work') view = WorkPage();
  else if (route.parts[0] === 'about') view = AboutPage();
  else if (route.parts[0] === 'contact') view = ContactPage();
  else view = Home(); // catch-all — matches the live site's SPA fallback

  app.innerHTML = Header(route) + `<main>${view}</main>` + Footer() + Floaters();

  document.title =
    route.path === '/' ? 'Soul-D. | Digital Marketing Solutions'
    : route.parts[0] === 'services' && route.parts[1]
      ? `${(CONTENT.services.find((s) => s.id === route.parts[1]) || {}).title || 'Services'} | Soul-D.`
      : route.parts[0] === 'services' ? 'Services | Soul-D.'
      : route.parts[0] === 'work' ? 'Our Work | Soul-D.'
      : route.parts[0] === 'about' ? 'About Us | Soul-D.'
      : route.parts[0] === 'contact' ? 'Contact | Soul-D.'
      : 'Soul-D. | Digital Marketing Solutions';

  document.getElementById('mobileNav')?.classList.remove('open');
  const root = document.documentElement;
  const prevBehavior = root.style.scrollBehavior;
  root.style.scrollBehavior = 'auto';
  window.scrollTo(0, 0);
  root.style.scrollBehavior = prevBehavior;
  window.__routeKey = route.path; // re-arm per-route widgets
  initRouteWidgets();
}

/* -------------------------------------------------------------------------
   13. Per-route widgets / behaviour
   ------------------------------------------------------------------------- */
function on(el, evt, fn) { el && el.addEventListener(evt, fn); }

let heroTimer = null;
let revealObs = null;
let countObs = null;
let activeFaq = null;

function initRouteWidgets() {
  /* ---- header scroll state + hero dots visibility ---- */
  const header = document.getElementById('siteHeader');
  const dots = document.getElementById('heroDots');
  const heroEl = document.getElementById('home');
  const onScroll = () => {
    header?.classList.toggle('scrolled', window.scrollY > 24);
    if (dots && heroEl) dots.style.opacity = window.scrollY > heroEl.offsetHeight * 0.7 ? '0' : '1';
  };
  window.removeEventListener('scroll', window.__onScroll || (() => {}));
  window.__onScroll = onScroll;
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- mobile nav ---- */
  const burger = document.getElementById('burger');
  const mobileNav = document.getElementById('mobileNav');
  on(burger, 'click', () => {
    const open = mobileNav.classList.toggle('open');
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
  });

  /* ---- hero slideshow ---- */
  clearInterval(heroTimer);
  const slides = document.querySelectorAll('.hero-slide');
  if (slides.length) {
    const dots = document.querySelectorAll('#heroDots button');
    let idx = 0;
    const show = (n) => {
      idx = (n + slides.length) % slides.length;
      slides.forEach((s, i) => s.classList.toggle('active', i === idx));
      dots.forEach((d, i) => d.classList.toggle('on', i === idx));
    };
    dots.forEach((d) =>
      d.addEventListener('click', () => {
        show(Number(d.dataset.slide));
        restartHero();
      })
    );
    show(0);
    const restartHero = () => {
      clearInterval(heroTimer);
      heroTimer = setInterval(() => show(idx + 1), 5000);
    };
    restartHero();
  }

  /* ---- services strip arrows ---- */
  const track = document.getElementById('svcTrack');
  const prev = document.getElementById('svcPrev');
  const next = document.getElementById('svcNext');
  if (track && prev && next) {
    const sync = () => {
      prev.disabled = track.scrollLeft <= 4;
      next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
    };
    prev.addEventListener('click', () => track.scrollBy({ left: -760, behavior: 'smooth' }));
    next.addEventListener('click', () => track.scrollBy({ left: 760, behavior: 'smooth' }));
    track.addEventListener('scroll', sync, { passive: true });
    sync();
  }

  /* ---- testimonials pager ---- */
  const tst = document.getElementById('tstTrack');
  if (tst) {
    const total = tst.querySelectorAll('.tst-page').length;
    let page = 0;
    const draw = () => {
      tst.style.transform = `translateX(-${page * 100}%)`;
    };
    document.querySelectorAll('[data-tst]').forEach((b) =>
      b.addEventListener('click', () => {
        page = Math.min(Math.max(page + Number(b.dataset.tst), 0), total - 1);
        draw();
      })
    );
    draw();
  }

  /* ---- counters ---- */
  countObs?.disconnect();
  const counters = document.querySelectorAll('.count');
  if (counters.length) {
    countObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const el = e.target;
          countObs.unobserve(el);
          const to = Number(el.dataset.to);
          const t0 = performance.now();
          const tick = (t) => {
            const p = Math.min((t - t0) / 1200, 1);
            el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        });
      },
      { threshold: 0.4 }
    );
    counters.forEach((c) => countObs.observe(c));
  }

  /* ---- reveal on scroll ---- */
  revealObs?.disconnect();
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    revealObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            revealObs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    reveals.forEach((r) => revealObs.observe(r));
  }

  /* ---- FAQ accordion ---- */
  activeFaq = null;
  document.querySelectorAll('.faq-item').forEach((item) => {
    const btn = item.querySelector('.faq-q');
    const panel = item.querySelector('.faq-a');
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach((o) => {
        o.classList.remove('open');
        o.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
        o.querySelector('.faq-a').hidden = true;
      });
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
        panel.hidden = false;
      }
    });
  });

  /* ---- service / work filters ---- */
  document.querySelectorAll('[data-svc-filter]').forEach((b) =>
    b.addEventListener('click', () => {
      document.querySelectorAll('[data-svc-filter]').forEach((x) => x.classList.remove('on'));
      b.classList.add('on');
      const f = b.dataset.svcFilter;
      document.querySelectorAll('#svcGrid .svc-tile').forEach((c) => {
        c.style.display = f === 'all' || c.dataset.cat === f ? '' : 'none';
      });
    })
  );
  document.querySelectorAll('[data-work-filter]').forEach((b) =>
    b.addEventListener('click', () => {
      document.querySelectorAll('[data-work-filter]').forEach((x) => x.classList.remove('on'));
      b.classList.add('on');
      const f = b.dataset.workFilter;
      document.querySelectorAll('#workGrid .work-card').forEach((c) => {
        c.style.display = f === 'all' || c.dataset.cat === f ? '' : 'none';
      });
    })
  );

  /* ---- proposal form ---- */
  const form = document.getElementById('proposalForm');
  on(form, 'submit', (e) => {
    e.preventDefault();
    const note = document.getElementById('formNote');
    const data = Object.fromEntries(new FormData(form).entries());
    const missing = ['name', 'email', 'phone', 'service', 'details'].filter((k) => !String(data[k] || '').trim());
    if (missing.length) {
      note.className = 'form-note err';
      note.textContent = 'Please fill in all required fields (marked *).';
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      note.className = 'form-note err';
      note.textContent = 'Please enter a valid email address.';
      return;
    }
    note.className = 'form-note ok';
    note.textContent = `Thanks ${data.name.split(' ')[0]}! Your request is ready — our team replies within 2 to 4 business hours.`;
    form.reset();
  });
}

/* -------------------------------------------------------------------------
   14. Global delegated clicks (works after every re-render)
   ------------------------------------------------------------------------- */
document.addEventListener('click', (e) => {
  const gotoEl = e.target.closest('[data-goto]');
  if (gotoEl) {
    e.preventDefault();
    go(gotoEl.dataset.goto);
    return;
  }
  const scrollEl = e.target.closest('[data-scroll]');
  if (scrollEl) {
    e.preventDefault();
    document.querySelector(scrollEl.dataset.scroll)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }
  const card = e.target.closest('.svc-card');
  if (card && !e.target.closest('button')) {
    go(card.dataset.goto);
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key !== 'Enter' && e.key !== ' ') return;
  const card = e.target.closest?.('.svc-card');
  if (card && e.target === card) {
    e.preventDefault();
    go(card.dataset.goto);
  }
});

/* -------------------------------------------------------------------------
   15. Boot
   ------------------------------------------------------------------------- */
/* Boot: index.html fetches content.json (and any local draft) and then calls
   SOULD_BOOT(mergedContent). If nothing calls it we still render the defaults. */
window.SOULD_BOOT = function (content) {
  if (content) CONTENT = content;
  renderRoute();
};
window.addEventListener('hashchange', renderRoute);
if (!window.SOULD_DEFER) {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => window.SOULD_BOOT());
  else window.SOULD_BOOT();
}
