/* ==========================================================================
   CELESTA | shared script (every page loads this file)

   1. SETTINGS ......... links, navigation, numbers. Edit these, nothing else.
   2. Layout ........... builds the header and footer so they are identical on
                         every page and only need changing once.
   3. Effects .......... star field, cursor, scrolling text, glass light.
   4. Pop-up cards ..... any element marked data-modal opens as a pop-up.
   ========================================================================== */


/* 1. SETTINGS ------------------------------------------------------------- */

const SITE = {
  name: "Celesta",
  tagline: "Astronomy, Technology and Access",
  founded: 2025,

  // Pages in the navigation. "id" must match <body data-page="..."> on that page.
  // An item with "children" becomes a dropdown on large screens.
  nav: [
    { id: "home", label: "Home", href: "index.html" },
    { id: "about", label: "About", href: "about.html", children: [
      { id: "about",   label: "About us", href: "about.html" },
      { id: "members", label: "Members",  href: "members.html" },
      // lock: shows a small padlock. footer: false keeps it out of the footer list.
      { id: "constitution", label: "Constitution", href: "constitution.html", lock: true, footer: false },
    ] },
    { id: "events",  label: "Events",  href: "events.html" },
    { id: "blog",    label: "Blog",    href: "blog.html" },
    { id: "magazine", label: "Magazine", href: "magazine.html" },
    { id: "contact", label: "Contact", href: "contact.html" },
  ],

  // Paste full web addresses between the quotes.
  // Anything left empty ("") is hidden everywhere it appears, so nothing breaks.
  links: {
    discord:    "https://disboard.org/server/1425502035800883304",
    instagram:  "https://www.instagram.com/celestaastronomy/",
    youtube:    "https://www.youtube.com/@CelestaAstronomyClub",
    linkedin:   "https://www.linkedin.com/company/celestaclub/",
    devpost:    "https://celesta-exoplanet-challenge.devpost.com/",  // swap in your Devpost profile if you have one
    celestagpt: "https://celestagpt.carrd.co",
    exoplanet:  "https://celesta-exoplanet-challenge.devpost.com/",  // "Know more" on the Events page
    blog:       "https://www.blogger.com",                           // "More blogs" button: your blog's address
    internship: "https://forms.google.com",                          // "Apply now" on the Members page: your form
    email:      "celestaclub@gmail.com",                             // address only, no mailto:
  },

  // Club IDs that open the Constitution page. One per line, in quotes, with a comma after each.
  // To add someone, add a line. To remove someone, delete their line.
  // Capital letters do not matter when a member types their ID.
  // Note: this keeps casual visitors out. It is not real security, because anyone who views the
  // page source can see this list. Do not put anything sensitive on the Constitution page.
  clubIds: [
    "AradhyaHaldikar123",
    "MrunalSayam456",
    "ArnavVenkatesh789",
  ],

  // Numbers used in the page text. Change them here and every page updates.
  discord: { members: "88", asOf: "August 2026" },

  // Effects. Set to false to switch one off.
  effects: { stars: true, cursor: true },
};


/* 2. Layout --------------------------------------------------------------- */

const ICON_CHEVRON = '<svg viewBox="0 0 8 14" fill="none" aria-hidden="true"><path d="M1 1l6 6-6 6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const ICON_DOWN = '<svg viewBox="0 0 9 6" fill="none" aria-hidden="true"><path d="M1 1l3.5 3.5L8 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';

const ICON_LOCK = '<svg class="lock-icon" viewBox="0 0 11 13" fill="none" aria-hidden="true"><rect x="1" y="5.5" width="9" height="7" rx="2" fill="currentColor"/><path d="M3 5.5V4a2.5 2.5 0 0 1 5 0v1.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg><span class="sr-only"> (members only)</span>';

// Every page in one flat list (dropdown children included). Used by the phone menu and the footer.
const flatNav = () => SITE.nav.flatMap((n) => (n.children ? n.children : [n]));

function renderHeader() {
  const host = document.querySelector('[data-layout="header"]');
  if (!host) return;
  const page = document.body.dataset.page;
  const link = (n) => `<a href="${n.href}"${n.id === page ? ' aria-current="page"' : ""}>${n.label}${n.lock ? ICON_LOCK : ""}</a>`;

  const desktopItem = (n) => {
    if (!n.children) return `<li>${link(n)}</li>`;
    const current = n.children.some((c) => c.id === page);
    return `
      <li class="has-sub${current ? " is-current" : ""}">
        <a href="${n.href}">${n.label}${ICON_DOWN}</a>
        <ul class="subnav glass">${n.children.map((c) => `<li>${link(c)}</li>`).join("")}</ul>
      </li>`;
  };

  host.className = "site-header";
  host.innerHTML = `
    <nav class="nav glass" aria-label="Main">
      <a class="nav-brand" href="index.html" aria-label="${SITE.name} home">
        <img src="assets/img/bannerlogo_transparent.png" alt="${SITE.name}" width="124" height="30">
      </a>
      <ul class="nav-links">${SITE.nav.map(desktopItem).join("")}</ul>
      <a class="btn btn-primary btn-sm nav-cta" data-link="discord" href="#">Join the Discord</a>
      <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="nav-sheet">
        <span class="sr-only">Menu</span><i></i><i></i>
      </button>
    </nav>
    <div class="nav-sheet glass" id="nav-sheet">
      <ul>${flatNav().map((n) => `<li>${link(n)}</li>`).join("")}</ul>
      <a class="btn btn-primary" data-link="discord" href="#">Join the Discord</a>
    </div>`;
}

function renderFooter() {
  const host = document.querySelector('[data-layout="footer"]');
  if (!host) return;
  const social = [
    ["discord", "Discord"], ["youtube", "YouTube"], ["instagram", "Instagram"],
    ["linkedin", "LinkedIn"], ["devpost", "Devpost"],
  ];

  host.className = "site-footer";
  host.innerHTML = `
    <div class="wrap footer-grid">
      <div class="footer-brand">
        <img src="assets/img/bannerlogo_transparent.png" alt="${SITE.name}" width="141" height="34">
        <p>${SITE.tagline}</p>
      </div>
      <nav aria-label="Pages">
        <h2>Pages</h2>
        <ul>${flatNav().filter((n) => n.footer !== false).map((n) => `<li><a href="${n.href}">${n.label}</a></li>`).join("")}</ul>
      </nav>
      <nav aria-label="Community">
        <h2>Community</h2>
        <ul>${social.map(([key, label]) => `<li><a data-link="${key}" href="#">${label}</a></li>`).join("")}</ul>
      </nav>
    </div>
    <div class="wrap footer-base">
      <p>&copy; ${new Date().getFullYear()} ${SITE.name}. Founded in ${SITE.founded}.</p>
    </div>`;
}

// Fills in every [data-link="name"] with the address from SETTINGS, and every
// [data-site="members"] style placeholder with its number.
function bindContent() {
  document.querySelectorAll("[data-link]").forEach((el) => {
    const key = el.dataset.link;
    const value = (SITE.links[key] || "").trim();
    if (!value) { (el.closest("li") || el).hidden = true; return; }
    el.href = key === "email" ? "mailto:" + value : value;
    if (/^https?:/i.test(value)) { el.target = "_blank"; el.rel = "noopener"; }
  });

  document.querySelectorAll("[data-site]").forEach((el) => {
    const map = { members: SITE.discord.members, membersDate: SITE.discord.asOf };
    if (map[el.dataset.site] != null) el.textContent = map[el.dataset.site];
  });
}

function initNav() {
  const header = document.querySelector(".site-header");
  if (!header) return;
  const toggle = header.querySelector(".nav-toggle");
  const setOpen = (open) => {
    header.dataset.open = open ? "true" : "false";
    toggle.setAttribute("aria-expanded", String(open));
  };

  toggle.addEventListener("click", () => setOpen(header.dataset.open !== "true"));
  header.querySelectorAll(".nav-sheet a").forEach((a) => a.addEventListener("click", () => setOpen(false)));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setOpen(false); });
  document.addEventListener("click", (e) => { if (!header.contains(e.target)) setOpen(false); });

  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 24);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}


/* 3. Effects -------------------------------------------------------------- */

const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
let cursorEl = null; // the custom pointer, once it exists

/* Star field. Positions are seeded, so the sky looks the same on every page. */
function initStars() {
  if (!SITE.effects.stars) return;

  const canvas = document.createElement("canvas");
  canvas.className = "sky";
  canvas.setAttribute("aria-hidden", "true");
  document.body.prepend(canvas);
  const ctx = canvas.getContext("2d");

  const seeded = (seed) => () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  let W = 0, H = 0, stars = [], mx = 0, my = 0;

  function build() {
    const rnd = seeded(2025);
    const count = Math.min(240, Math.round((W * H) / 8200));
    stars = Array.from({ length: count }, () => {
      const z = rnd();                 // 0 = far away, 1 = close
      const bright = rnd() > 0.94;
      const tint = rnd();
      return {
        x: rnd() * W, y: rnd() * H, z,
        r: bright ? 1.15 + z * 0.8 : 0.4 + z * 0.75,
        a: bright ? 0.95 : 0.26 + z * 0.5,
        c: tint < 0.12 ? "185,203,239" : tint > 0.92 ? "242,217,180" : "234,230,218",
        glow: bright,
        phase: rnd() * 6.283, speed: 0.35 + rnd() * 0.9,
      };
    });
  }

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth; H = window.innerHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    mx = W / 2; my = H / 2;
    build();
    draw(0);
  }

  function draw(t) {
    ctx.clearRect(0, 0, W, H);
    const sy = REDUCED ? 0 : window.scrollY;
    for (const s of stars) {
      // Nearer stars drift further as the page scrolls and the pointer moves.
      const y = (((s.y - sy * (0.015 + s.z * 0.085)) % H) + H) % H;
      const x = s.x + (REDUCED ? 0 : (mx - W / 2) * s.z * 0.012);
      const twinkle = REDUCED ? 1 : 0.8 + 0.2 * Math.sin(t * 0.001 * s.speed + s.phase);
      const a = s.a * twinkle;
      if (s.glow) {
        const g = ctx.createRadialGradient(x, y, 0, x, y, s.r * 7);
        g.addColorStop(0, `rgba(${s.c},${a * 0.32})`);
        g.addColorStop(1, `rgba(${s.c},0)`);
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(x, y, s.r * 7, 0, 6.283); ctx.fill();
      }
      ctx.fillStyle = `rgba(${s.c},${a})`;
      ctx.beginPath(); ctx.arc(x, y, s.r, 0, 6.283); ctx.fill();
    }
  }

  let running = false;
  function loop(t) {
    if (document.hidden) { running = false; return; }
    draw(t);
    requestAnimationFrame(loop);
  }
  function start() { if (!running && !REDUCED) { running = true; requestAnimationFrame(loop); } }

  resize();
  let resizeTimer;
  window.addEventListener("resize", () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(resize, 120); });
  window.addEventListener("pointermove", (e) => { mx = e.clientX; my = e.clientY; }, { passive: true });
  document.addEventListener("visibilitychange", start);
  if (REDUCED) window.addEventListener("scroll", () => draw(0), { passive: true });
  start();
}

/* Pointer. A small dot that wraps itself around buttons and links, like the
   pointer on an iPad. Over a large card it becomes a ring. Mouse and trackpad only. */
function initCursor() {
  if (!SITE.effects.cursor) return;
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

  const root = document.documentElement;
  const dot = document.createElement("div");
  dot.className = "cursor";
  dot.setAttribute("aria-hidden", "true");
  document.body.appendChild(dot);
  cursorEl = dot;

  const HOVER = 'a[href], button, summary, [role="button"], [data-cursor]';
  const TEXT = 'input, textarea, select, [contenteditable="true"]';
  const MAGNET = ".btn, .nav-links a";

  let px = -100, py = -100;                 // where the pointer really is
  let x = px, y = py, w = 10, h = 10, r = 5; // what is drawn
  let target = null, targetRadius = 0, shown = false;
  let tx = 0, ty = 0;                        // current magnet offset of the target

  function setTarget(next) {
    if (next === target) return;
    if (target) { target.style.translate = ""; }
    target = next; tx = 0; ty = 0;
    if (target) targetRadius = parseFloat(getComputedStyle(target).borderTopLeftRadius) || 0;
  }

  function onMove(e) {
    px = e.clientX; py = e.clientY;
    if (!shown) { shown = true; x = px; y = py; root.classList.add("cursor-on"); dot.classList.add("on"); }
    const el = e.target instanceof Element ? e.target : null;
    const typing = !!(el && el.closest(TEXT));
    dot.classList.toggle("hide", typing);

    let hit = !typing && el ? el.closest(HOVER) : null;
    if (hit) hit = hit.closest("[data-cursor-area]") || hit; // cards count as one target
    setTarget(hit);

    if (target && target.matches(MAGNET) && !REDUCED) {
      const b = target.getBoundingClientRect();
      const cx = b.left - tx + b.width / 2, cy = b.top - ty + b.height / 2;
      tx = clamp((px - cx) * 0.12, -6, 6);
      ty = clamp((py - cy) * 0.2, -5, 5);
      target.style.translate = `${tx}px ${ty}px`;
    }
  }

  function frame() {
    let gx = px, gy = py, gw = 10, gh = 10, gr = 5, morph = false, ring = false;

    if (target && target.isConnected) {
      const b = target.getBoundingClientRect();
      if (b.width < 720 && b.height < 120) {
        const pad = 7;
        gw = b.width + pad * 2; gh = b.height + pad * 2;
        gx = b.left + b.width / 2 + (px - (b.left + b.width / 2)) * 0.08;
        gy = b.top + b.height / 2 + (py - (b.top + b.height / 2)) * 0.14;
        gr = Math.min(gh / 2, targetRadius + pad);
        morph = true;
      } else { gw = gh = 34; gr = 17; ring = true; }
    }

    const k = REDUCED ? 1 : 0.24;
    x += (gx - x) * k; y += (gy - y) * k;
    w += (gw - w) * k; h += (gh - h) * k; r += (gr - r) * k;

    dot.style.width = w + "px"; dot.style.height = h + "px";
    dot.style.borderRadius = r + "px";
    dot.style.transform = `translate3d(${x - w / 2}px, ${y - h / 2}px, 0)`;
    dot.classList.toggle("morph", morph);
    dot.classList.toggle("ring", ring);
    requestAnimationFrame(frame);
  }

  window.addEventListener("pointermove", onMove, { passive: true });
  window.addEventListener("pointerdown", () => dot.classList.add("down"));
  window.addEventListener("pointerup", () => dot.classList.remove("down"));
  document.documentElement.addEventListener("mouseleave", () => { dot.classList.remove("on"); setTarget(null); });
  document.documentElement.addEventListener("mouseenter", () => { if (shown) dot.classList.add("on"); });
  requestAnimationFrame(frame);
}

/* Statement text. Words light up one by one as the paragraph scrolls through
   the screen. Add data-scrub to any paragraph to use it. */
function initScrub() {
  document.querySelectorAll("[data-scrub]").forEach((el) => {
    const words = el.textContent.trim().split(/\s+/);
    el.textContent = "";
    const spans = words.map((word) => {
      const s = document.createElement("span");
      s.className = "w";
      s.textContent = word + " ";
      el.appendChild(s);
      return s;
    });
    if (REDUCED) { spans.forEach((s) => (s.style.opacity = 1)); return; }

    const n = spans.length, spread = 7;
    let ticking = false;
    const update = () => {
      ticking = false;
      const rect = el.getBoundingClientRect();
      const start = window.innerHeight * 0.86, end = window.innerHeight * 0.42;
      const p = clamp((start - rect.top) / (rect.height + (start - end)), 0, 1);
      spans.forEach((s, i) => {
        const t = clamp((p * (n + spread) - i) / spread, 0, 1);
        s.style.opacity = (0.2 + 0.8 * t).toFixed(3);
      });
    };
    const request = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    update();
  });
}

/* Glass light. Elements with class "glass spot" get a soft highlight that
   follows the pointer. */
function initGlassLight() {
  document.addEventListener("pointermove", (e) => {
    const el = e.target instanceof Element ? e.target.closest(".spot") : null;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", e.clientX - r.left + "px");
    el.style.setProperty("--my", e.clientY - r.top + "px");
  }, { passive: true });
}

/* Orbit animations pause for people who ask for less motion. */
function initOrbits() {
  if (!REDUCED) return;
  document.querySelectorAll("svg.orbits").forEach((svg) => svg.pauseAnimations && svg.pauseAnimations());
}


/* 4. Pop-up cards ---------------------------------------------------------- */

/* Any element with data-modal opens as a pop-up when it is clicked. Inside it:
     [data-modal-title]  required. The pop-up heading, usually the card's own button.
     [data-modal-kind]   optional. A small line above the heading.
     [data-modal-media]  optional. A picture or graphic, copied to the top of the pop-up.
     [data-modal-more]   optional. Hidden extra content shown in the pop-up.
   Close with the cross, the Esc key, or a click outside the pop-up. */
function initModals() {
  const cards = document.querySelectorAll("[data-modal]");
  if (!cards.length) return;

  const dialog = document.createElement("dialog");
  dialog.className = "modal";
  dialog.setAttribute("aria-labelledby", "modal-title");
  dialog.innerHTML = `
    <div class="modal-panel glass">
      <button class="modal-close" type="button" aria-label="Close">
        <svg viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M2 2l10 10M12 2L2 12" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>
      </button>
      <div class="modal-scroll">
        <div class="modal-media"></div>
        <div class="modal-text">
          <p class="modal-kind"></p>
          <h2 class="modal-title" id="modal-title"></h2>
          <div class="modal-body"></div>
        </div>
      </div>
    </div>`;
  document.body.appendChild(dialog);

  const root = document.documentElement;
  const panel = dialog.querySelector(".modal-panel");
  const scroller = dialog.querySelector(".modal-scroll");
  const mediaEl = dialog.querySelector(".modal-media");
  const kindEl = dialog.querySelector(".modal-kind");
  const titleEl = dialog.querySelector(".modal-title");
  const bodyEl = dialog.querySelector(".modal-body");
  let closing = false;

  function fill(card) {
    const find = (selector) => card.querySelector(selector);
    const title = find("[data-modal-title]"), kind = find("[data-modal-kind]");
    const media = find("[data-modal-media]"), more = find("[data-modal-more]");

    dialog.dataset.variant = card.dataset.modal || "";
    titleEl.textContent = title ? title.textContent.trim() : "";
    kindEl.textContent = kind ? kind.textContent.trim() : "";
    kindEl.hidden = !kind;

    mediaEl.replaceChildren();
    if (media) {
      const copy = media.cloneNode(true);
      copy.removeAttribute("data-modal-media");
      mediaEl.appendChild(copy);
    }
    mediaEl.hidden = !media;

    bodyEl.replaceChildren();
    if (more) more.childNodes.forEach((node) => bodyEl.appendChild(node.cloneNode(true)));
  }

  function open(card) {
    fill(card);
    const box = card.getBoundingClientRect();
    dialog.showModal();
    root.classList.add("modal-open");
    scroller.scrollTop = 0;
    // The pop-up grows out of the card that was clicked.
    panel.style.transformOrigin =
      `${box.left + box.width / 2 - panel.offsetLeft}px ${box.top + box.height / 2 - panel.offsetTop}px`;
    if (cursorEl) dialog.appendChild(cursorEl); // keep the custom pointer above the pop-up
  }

  function close() {
    if (closing || !dialog.open) return;
    closing = true;
    dialog.classList.add("is-closing");
    setTimeout(() => {
      dialog.close();
      dialog.classList.remove("is-closing");
      root.classList.remove("modal-open");
      if (cursorEl) document.body.appendChild(cursorEl);
      closing = false;
    }, REDUCED ? 0 : 230);
  }

  cards.forEach((card) => {
    card.addEventListener("click", (e) => { if (!e.target.closest("a")) open(card); });
  });
  dialog.querySelector(".modal-close").addEventListener("click", close);
  dialog.addEventListener("click", (e) => { if (e.target === dialog) close(); });
  dialog.addEventListener("cancel", (e) => { e.preventDefault(); close(); });
}


/* Start ------------------------------------------------------------------- */

renderHeader();
renderFooter();
bindContent();
initNav();
initScrub();
initGlassLight();
initOrbits();
initStars();
initCursor();
initModals();
