// ------------------------------------------------------------
// Helpers
// ------------------------------------------------------------
const $ = id => document.getElementById(id);

function esc(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function profShort(p) { return p.short || String(p.name || '?').trim().split(/\s+/)[0]; }
function profInitials(p) {
  if (p.initials) return p.initials;
  const w = String(p.name || '?').trim().split(/\s+/).filter(Boolean);
  return (w[0][0] + (w.length > 1 ? w[w.length - 1][0] : '')).toUpperCase();
}

// ------------------------------------------------------------
// TIME MACHINE (2000s <-> Today) + EXHIBIT WINGS
// ------------------------------------------------------------
const ERA_STORAGE_KEY = 'ppc-era';
let currentEra = document.documentElement.classList.contains('era-now') ? 'now' : 'then';
let currentTopic = 'all';
let warpTimers = [];

const ERA_INFO = {
  then: { name: 'The 2000s Wing', theme: '#fff4fa',
          desc: '2000–2010: texting clans, Friendster, burned CDs, LAN shops, and the first online rescue calls.' },
  now:  { name: 'The Today Wing', theme: '#e9e6ff',
          desc: 'The 2020s: short videos, e-wallets, P-Pop, mobile esports, and real-time weather alerts.' }
};

// One exhibit, seen through one era. Missing fields fall back to safe blanks.
function eraData(ex, era) {
  if (era === 'now') {
    const t = ex.today || {};
    return {
      era: 'now', label: 'Today',
      title: t.title || ex.title || '', blurb: t.blurb || ex.blurb || '',
      badge: t.badge || ex.badge || '', tag: t.tag || ex.tag || '',
      icon: t.icon || ex.icon || '✨', image: t.image || '', alt: t.alt || t.badge || ex.badge || '',
      summary: ex.now || '', intro: t.intro || '', facts: t.facts || [], artifacts: t.artifacts || [],
      gallery: t.gallery || [], impact: t.impact || ex.impact || ''
    };
  }
  return {
    era: 'then', label: '2000–2010',
    title: ex.thenTitle || ex.title || '', blurb: ex.thenBlurb || ex.blurb || '',
    badge: ex.badge || '', tag: ex.tag || '',
    icon: ex.icon || '✨', image: ex.image || '', alt: ex.alt || ex.badge || '',
    summary: ex.then || '', intro: ex.intro || '', facts: ex.facts || [], artifacts: ex.artifacts || [],
    gallery: ex.gallery || [], impact: ex.impact || ''
  };
}

function setEra(era) {
  if (era !== 'then' && era !== 'now') return;
  if (era === currentEra) return;
  warpTimers.forEach(clearTimeout); warpTimers = [];
  const reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const warp = $('warp');
  if (warp && !reduce) {
    warp.className = 'warp warping to-' + era;
    warpTimers.push(setTimeout(() => applyEra(era), 260));   // swap while the screen is covered
    warpTimers.push(setTimeout(() => { warp.className = 'warp'; }, 760));
  } else {
    applyEra(era);
  }
}

function applyEra(era) {
  currentEra = era;
  const root = document.documentElement;
  root.classList.remove('era-then', 'era-now');
  root.classList.add('era-' + era);
  try { localStorage.setItem(ERA_STORAGE_KEY, era); } catch (e) { /* ignore */ }

  document.querySelectorAll('[data-era]').forEach(b => {
    const on = b.dataset.era === era;
    b.classList.toggle('active', on);
    b.setAttribute('aria-pressed', on ? 'true' : 'false');
  });
  const desc = $('wing-desc');
  if (desc) desc.textContent = ERA_INFO[era].desc;
  const currentWing = $('wing-current');
  if (currentWing) currentWing.textContent = `Now viewing: ${ERA_INFO[era].name}`;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', ERA_INFO[era].theme);

  renderGallery();
  switchWing(currentTopic);
  if (era === 'then') stopModernGame();
}

function renderWingTabs() {
  const wrap = $('wing-tabs');
  if (!wrap) return;
  wrap.innerHTML =
    `<button type="button" class="chip-btn tab-btn active" data-wing="all" onclick="switchWing('all')">All Topics</button>` +
    exhibits.map(ex =>
      `<button type="button" class="chip-btn tab-btn" data-wing="${esc(ex.id)}" onclick="switchWing('${esc(ex.id)}')">${esc(ex.icon)} ${esc(ex.wing)}</button>`
    ).join('');
}

function renderGallery() {
  const grid = $('gallery-grid');
  if (!grid) return;
  grid.innerHTML = exhibits.map((ex, i) => {
    const d = eraData(ex, currentEra);
    const then = eraData(ex, 'then');
    const now = eraData(ex, 'now');
    const visited = hasStamp(ex.id, currentEra);
    const eraCopy = (content, era, label, icon) => `
      <section class="card-era-copy card-era-copy-${era} ${currentEra === era ? 'is-current' : ''}" aria-label="${label} description">
        <span class="card-era-label"><span aria-hidden="true">${icon}</span>${label}</span>
        <h4>${esc(content.title)}</h4>
        <p class="card-era-subtitle">${esc(content.blurb)}</p>
        <p class="card-era-summary">${esc(content.summary)}</p>
      </section>`;
    return `
    <article class="exhibit-card reveal" tabindex="0" role="button" data-category="${esc(ex.id)}" data-index="${i}"
             style="--c:${esc(ex.color)}" aria-label="Enter the ${esc(ex.wing)} room (${esc(d.label)}): ${esc(d.title)}">
      <div>
        <div class="card-media">
          <span class="card-emoji" aria-hidden="true">${esc(d.icon)}</span>
          ${d.image ? `<img src="${esc(d.image)}" alt="${esc(d.alt)}" loading="lazy" decoding="async" onerror="this.remove()">` : ''}
          <span class="card-badge">${esc(d.badge)}</span>
          <span class="card-era">${esc(d.label)}</span>
        </div>
        <div class="card-body">
          <div class="flex items-center justify-between gap-2">
            <span class="domain">${esc(ex.domain)}</span>
            <span class="retro-tag">${esc(d.tag)}</span>
          </div>
          <div class="card-era-comparison" aria-label="Compare this exhibit across eras">
            ${eraCopy(then, 'then', '2000–2010', '🕹️')}
            ${eraCopy(now, 'now', 'Today · 2020s', '📱')}
          </div>
        </div>
      </div>
      <div class="card-foot">
        <span>${currentEra === 'then' ? 'Impact' : 'Why it matters'}: <em>${esc(d.impact)}</em></span>
        <span class="enter">${visited ? '✓ ' : ''}Enter room →</span>
      </div>
    </article>`;
  }).join('');

  const cards = grid.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { threshold: 0.1 });
    cards.forEach(c => io.observe(c));
  } else {
    cards.forEach(c => c.classList.add('in'));
  }
}

// Attached once (the cards themselves are re-built whenever the era changes)
function initGalleryEvents() {
  const grid = $('gallery-grid');
  if (!grid) return;
  grid.addEventListener('click', e => {
    const card = e.target.closest('.exhibit-card');
    if (card) openRoom(Number(card.dataset.index));
  });
  grid.addEventListener('keydown', e => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const card = e.target.closest('.exhibit-card');
    if (card) { e.preventDefault(); openRoom(Number(card.dataset.index)); }
  });
}

function switchWing(category) {
  currentTopic = category;
  document.querySelectorAll('.tab-btn').forEach(tab => {
    const isActive = tab.getAttribute('data-wing') === category;
    tab.classList.toggle('active', isActive);
    if (isActive && window.innerWidth < 640) {
      tab.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  });
  document.querySelectorAll('.exhibit-card').forEach(card =>
    card.classList.toggle('hidden', !(category === 'all' || card.getAttribute('data-category') === category))
  );
}

// ------------------------------------------------------------
// MODAL LAYERS
// ------------------------------------------------------------
let historyOK = true;
const lastFocus = { room: null, fs: null, lb: null, pp: null, map: null };

function histLevel() { return (history.state && history.state.lvl) || 0; }

function enterLevel(lvl, hash) {
  if (!historyOK) return;
  try {
    const base = location.pathname + location.search;
    const url = hash || (lvl > 1 ? base + location.hash : base);
    if (histLevel() >= lvl) history.replaceState({ lvl }, '', url);
    else history.pushState({ lvl }, '', url);
  } catch (e) { historyOK = false; }
}

function leaveLevel(lvl, hideFn) {
  if (historyOK && histLevel() >= lvl) {
    try { history.back(); } catch (e) { hideFn(); return; }
    setTimeout(() => { if (histLevel() >= lvl) hideFn(); }, 400);
  } else {
    hideFn();
  }
}

function roomIsOpen() { const m = $('room-modal'); return !!m && !m.classList.contains('hidden'); }
function fsIsOpen() { const m = $('friendster-modal'); return !!m && !m.classList.contains('hidden'); }
function lbIsOpen() { const m = $('lightbox'); return !!m && !m.classList.contains('hidden'); }
function passportIsOpen() { const m = $('passport-modal'); return !!m && !m.classList.contains('hidden'); }
function mapIsOpen() { const m = $('map-modal'); return !!m && !m.classList.contains('hidden'); }

function lockScroll() { document.body.style.overflow = 'hidden'; }
function unlockScrollIfIdle() {
  if (!roomIsOpen() && !fsIsOpen() && !lbIsOpen() && !passportIsOpen() && !mapIsOpen()) document.body.style.overflow = '';
}

function focusPanel(id) { const el = $(id); if (el && el.focus) el.focus({ preventScroll: true }); }
function restoreFocus(key) {
  const el = lastFocus[key];
  lastFocus[key] = null;
  if (el && el.focus && (!document.contains || document.contains(el))) el.focus({ preventScroll: true });
}

function trapTab(e, container) {
  if (!container) return;
  const items = [...container.querySelectorAll('button, a[href], textarea, input, [tabindex]:not([tabindex="-1"])')]
    .filter(el => !el.disabled && el.getClientRects().length > 0);
  if (!items.length) { e.preventDefault(); return; }
  const first = items[0], last = items[items.length - 1], active = document.activeElement;
  if (e.shiftKey && (active === first || active === container)) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && active === last) { e.preventDefault(); first.focus(); }
}

function addSwipe(el, onLeft, onRight) {
  if (!el) return;
  let x0 = 0, y0 = 0, t0 = 0, tracking = false;
  el.addEventListener('touchstart', e => {
    if (e.touches.length !== 1) { tracking = false; return; }
    x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; t0 = Date.now(); tracking = true;
  }, { passive: true });
  el.addEventListener('touchend', e => {
    if (!tracking) return;
    tracking = false;
    const t = e.changedTouches[0];
    const dx = t.clientX - x0, dy = t.clientY - y0;
    if (Date.now() - t0 < 700 && Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      (dx < 0 ? onLeft : onRight)();
    }
  }, { passive: true });
}

window.addEventListener('popstate', () => {
  const lvl = histLevel();
  if (lvl < 2 && lbIsOpen()) hideLightbox();
  if (lvl < 1) {
    if (roomIsOpen()) hideRoom();
    if (fsIsOpen()) hideFriendster();
    if (passportIsOpen()) hidePassport();
    if (mapIsOpen()) hideMap();
  }
});

// ---------- Lightbox ----------
let lbIndex = 0;
let lbEra = 'then';
function currentGallery() {
  const ex = exhibits[currentRoom];
  return ex ? eraData(ex, lbEra).gallery : [];
}

function showLightbox(i) {
  const items = currentGallery();
  if (!items.length) return;
  lbIndex = (i + items.length) % items.length;
  const g = items[lbIndex];
  const img = $('lb-img');
  img.classList.remove('lb-broken');
  img.alt = g.caption || '';
  img.src = g.src;
  $('lb-caption').textContent = (g.caption || '') + (g.year ? ` (${g.year})` : '');
  $('lb-credit').textContent = g.credit || '';$('lb-count').textContent = `${lbIndex + 1} / ${items.length}`;
  $('lb-full').href = g.src;
  document.querySelectorAll('.lb-nav').forEach(b => b.classList.toggle('hidden', items.length < 2));
}

function openLightbox(i, era) {
  lbEra = era === 'now' ? 'now' : 'then';
  lastFocus.lb = document.activeElement;
  enterLevel(2);
  showLightbox(i);
  $('lightbox').classList.remove('hidden');
  lockScroll();
  focusPanel('lightbox');
}
function hideLightbox() {
  $('lightbox').classList.add('hidden');$('lb-img').removeAttribute('src');
  unlockScrollIfIdle();
  restoreFocus('lb');
}
function closeLightbox() { leaveLevel(2, hideLightbox); }
function lightboxStep(d) { showLightbox(lbIndex + d); }

function galleryImgFailed(img) {
  const item = img.closest('.gallery-item');
  const grid = img.closest('.gallery-grid');
  const section = img.closest('.gallery-section');
  if (item) item.remove();
  if (grid && !grid.children.length && section) section.remove();
}

// ------------------------------------------------------------
// DETAIL ROOMS (every room has 2000s / Today / Compare tabs)
// ------------------------------------------------------------
let currentRoom = 0;
let roomEra = 'then'; // 'then' | 'now' | 'compare'

function roomHash(id, era) { return '#room-' + id + (era && era !== 'then' ? '/' + era : ''); }

function roomGalleryHtml(items, era, heading) {
  if (!items || !items.length) return '';
  return `
    <section class="gallery-section">
      <h3 class="room-h">${heading || '📸 Photo gallery'} <span class="room-h-sub">tap a photo to enlarge</span></h3>
      <div class="gallery-grid">
        ${items.map((g, i) => `
          <button type="button" class="gallery-item" onclick="openLightbox(${i}, '${era}')" aria-label="Enlarge photo: ${esc(g.caption || 'Photo ' + (i + 1))}">
            <span class="gallery-frame"><img src="${esc(g.src)}" alt="${esc(g.caption || '')}" loading="lazy" decoding="async" onerror="galleryImgFailed(this)"></span>
            <span class="gallery-cap">${esc(g.caption || '')}${g.year ? ` <em>(${esc(g.year)})</em>` : ''}</span>
          </button>`).join('')}
      </div>
    </section>`;
}

function srcLinkHtml(s) {
  const meta = [s.publisher, s.year].filter(Boolean).map(esc).join(', ');
  return `<a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.title)}</a>${meta ? ` <span class="src-pub">— ${meta}</span>` : ''}`;
}

function roomSourcesHtml(ex, era) {
  const list = (ex.sources || []).filter(s => era === 'compare' || s.era === 'both' || s.era === era);
  if (!list.length) return '';
  return `
    <details class="room-sources">
      <summary>📚 Sources for this room (${list.length})</summary>
      <ol>${list.map(s => `<li>${srcLinkHtml(s)}${s.note ? `<small>${esc(s.note)}</small>` : ''}</li>`).join('')}</ol>
    </details>`;
}

function roomFactsHtml(facts) {
  if (!facts || !facts.length) return '';
  return `<h3 class="room-h">💡 Did you know?</h3><ul class="fact-list">${facts.map(f => `<li>${esc(f)}</li>`).join('')}</ul>`;
}

function roomArtifactsHtml(items) {
  if (!items || !items.length) return '';
  return `
    <h3 class="room-h">🗂️ Artifacts in this room</h3>
    <div class="artifact-grid">
      ${items.map(a => `
        <div class="artifact">
          <span class="artifact-emoji">${esc(a.emoji)}</span>
          <div><b>${esc(a.name)}</b><p>${esc(a.note)}</p></div>
        </div>`).join('')}
    </div>`;
}

function roomHeroHtml(ex, era) {
  if (era === 'compare') {
    const half = (d, cls) => `
      <div class="hero-half ${cls}">
        <span class="hero-half-emoji" aria-hidden="true">${esc(d.icon)}</span>
        ${d.image ? `<img src="${esc(d.image)}" alt="${esc(d.alt)}" onerror="this.remove()">` : ''}
        <span class="hero-half-tag">${esc(d.label)}</span>
      </div>`;
    return `
      <div class="room-hero compare">
        ${half(eraData(ex, 'then'), 'then')}${half(eraData(ex, 'now'), 'now')}
        <div class="room-hero-shade"></div>
        <div class="room-hero-text">
          <span class="room-domain">${esc(ex.domain)} • Compare</span>
          <h2>${esc(ex.title)}</h2>
          <p>${esc(ex.blurb)}</p>
        </div>
      </div>`;
  }
  const d = eraData(ex, era);
  return `
    <div class="room-hero era-${era}">
      <span class="room-hero-emoji" aria-hidden="true">${esc(d.icon)}</span>
      ${d.image ? `<img src="${esc(d.image)}" alt="${esc(d.alt)}" onerror="this.remove()">` : ''}
      <div class="room-hero-shade"></div>
      <div class="room-hero-text">
        <span class="room-domain">${esc(ex.domain)} • ${esc(d.label)}</span>
        <h2>${esc(d.title)}</h2>
        <p>${esc(d.blurb)}</p>
      </div>
    </div>`;
}

function roomTabsHtml(ex) {
  const tabs = [['then', '🕹️', '2000s'], ['now', '📱', 'Today'], ['compare', '⚖️', 'Compare']];
  return `<div class="room-tabs" role="tablist" aria-label="Choose an era">` +
    tabs.map(([k, ic, label]) => {
      const stamped = k !== 'compare' && hasStamp(ex.id, k);
      return `<button type="button" role="tab" aria-selected="${roomEra === k}" class="room-tab tab-${k} ${roomEra === k ? 'active' : ''}" onclick="setRoomEra('${k}')">${ic} ${label}${stamped ? ' <span class="tab-stamp" title="Stamp collected">✓</span>' : ''}</button>`;
    }).join('') + `</div>`;
}

function roomActionsHtml(ex, era) {
  const curator = (typeof ex.curator === 'number' && friendsterProfiles[ex.curator]) ? friendsterProfiles[ex.curator] : null;
  const other = era === 'then' ? 'now' : 'then';
  return `
    <div class="room-actions">
      <button type="button" class="btn btn-pink" onclick="setRoomEra('${other}')">${other === 'now' ? 'See the Today version ⏩' : '⏪ Back to the 2000s'}</button>
      <button type="button" class="btn" onclick="setRoomEra('compare')">⚖️ Compare both</button>
      ${curator ? `<button type="button" class="btn btn-yellow" onclick="visitCurator(${ex.curator})">✨ Meet the curator: ${esc(profShort(curator))}</button>` : ''}
    </div>`;
}

function roomEraBodyHtml(ex, era) {
  const d = eraData(ex, era);
  return `
    ${d.intro ? `<p class="room-intro">${esc(d.intro)}</p>` : ''}
    <div class="era-block ${era === 'then' ? 'era-then' : 'era-present'}" style="margin:0">
      <span class="era-label">${era === 'then' ? '2000–2010 Decade' : 'Present Time'}</span>${esc(d.summary)}
    </div>
    ${roomGalleryHtml(d.gallery, era)}
    ${roomFactsHtml(d.facts)}
    ${roomArtifactsHtml(d.artifacts)}
    ${d.impact ? `<div class="impact-box">⭐ ${era === 'then' ? 'Impact' : 'Why it matters'}: ${esc(d.impact)}</div>` : ''}
    ${roomSourcesHtml(ex, era)}
    ${roomActionsHtml(ex, era)}`;
}

function roomCompareBodyHtml(ex) {
  const col = (d, cls) => `
    <div class="cmp-col ${cls}">
      <h4 class="cmp-head">${cls === 'then' ? '🕹️ 2000–2010' : '📱 Today'}</h4>
      <div class="era-block ${cls === 'then' ? 'era-then' : 'era-present'}" style="margin:0 0 .6rem">
        <span class="era-label">${esc(d.title)}</span>${esc(d.summary)}
      </div>
      ${d.facts.length ? `<ul class="cmp-facts">${d.facts.slice(0, 3).map(f => `<li>${esc(f)}</li>`).join('')}</ul>` : ''}
      <div class="cmp-chips">${d.artifacts.map(a => `<span class="cmp-chip" title="${esc(a.note)}">${esc(a.emoji)} ${esc(a.name)}</span>`).join('')}</div>
    </div>`;
  const a = eraData(ex, 'then'), b = eraData(ex, 'now');
  return `
    <div class="change-box">🔄 <b>The big shift:</b> ${esc(ex.change || ex.impact || '')}</div>
    <div class="cmp-grid">${col(a, 'then')}${col(b, 'now')}</div>
    ${roomGalleryHtml(a.gallery, 'then', '📸 2000s photos')}
    ${roomGalleryHtml(b.gallery, 'now', '📸 Today photos')}
    ${roomSourcesHtml(ex, 'compare')}
    <div class="room-actions">
      <button type="button" class="btn" onclick="setRoomEra('then')">🕹️ Enter the 2000s room</button>
      <button type="button" class="btn btn-pink" onclick="setRoomEra('now')">📱 Enter the Today room</button>
    </div>`;
}

function renderRoom(index, era) {
  const total = exhibits.length;
  currentRoom = ((index % total) + total) % total;
  if (era === 'then' || era === 'now' || era === 'compare') roomEra = era;
  const ex = exhibits[currentRoom];

  $('room-panel').style.setProperty('--c', ex.color);
  $('room-panel').dataset.era = roomEra;
  stampVisit(ex.id, roomEra);   // collect a passport stamp (before tabs are drawn so the ✓ shows)

  const content = $('room-content');
  content.innerHTML = `
    ${roomHeroHtml(ex, roomEra)}
    ${roomTabsHtml(ex)}
    <div class="room-body">
      ${roomEra === 'compare' ? roomCompareBodyHtml(ex) : roomEraBodyHtml(ex, roomEra)}
    </div>`;
  content.scrollTop = 0;
  content.classList.remove('swap'); void content.offsetWidth; content.classList.add('swap');

  $('room-dots').innerHTML = exhibits.map((e, i) =>
    `<button type="button" class="room-dot ${i === currentRoom ? 'active' : ''}" onclick="renderRoom(${i})" title="${esc(e.wing)}" aria-label="Go to ${esc(e.wing)} room">${esc(e.icon)}</button>`
  ).join('');
  if ($('room-prev-label')) $('room-prev-label').textContent = exhibits[(currentRoom - 1 + total) % total].wing;
  if ($('room-next-label')) $('room-next-label').textContent = exhibits[(currentRoom + 1) % total].wing;
  const eraName = roomEra === 'then' ? '2000s' : roomEra === 'now' ? 'Today' : 'Compare';
  $('room-count').textContent = `Room ${currentRoom + 1} of ${total} • ${ex.wing} • ${eraName}`;

  try { history.replaceState(history.state, '', roomHash(ex.id, roomEra)); } catch (e) { /* ignore */ }
}

function setRoomEra(era) { renderRoom(currentRoom, era); }

function openRoom(index, era) {
  const n = exhibits.length;
  const i = (((typeof index === 'number' ? index : 0) % n) + n) % n;
  roomEra = (era === 'then' || era === 'now' || era === 'compare') ? era : currentEra;
  lastFocus.room = document.activeElement;
  enterLevel(1, roomHash(exhibits[i].id, roomEra));
  renderRoom(i);
  $('room-modal').classList.remove('hidden');
  lockScroll();
  focusPanel('room-panel');
}

function hideRoom() {
  $('room-modal').classList.add('hidden');
  unlockScrollIfIdle();
  restoreFocus('room');
  if (location.hash.indexOf('#room-') === 0) {
    try { history.replaceState(history.state, '', location.pathname + location.search); } catch (e) { /* ignore */ }
  }
}

function closeRoom() { leaveLevel(1, hideRoom); }
function nextRoom() { renderRoom(currentRoom + 1); }
function prevRoom() { renderRoom(currentRoom - 1); }

function visitCurator(profileIndex) {
  hideRoom();
  openFriendsterModal(profileIndex);
}

function openRoomFromHash() {
  const m = location.hash.match(/^#room-([\w-]+?)(?:\/(then|now|compare))?$/);
  if (!m) return;
  const i = exhibits.findIndex(e => e.id === m[1]);
  if (i >= 0) openRoom(i, m[2] || 'then');
}

// ------------------------------------------------------------
// NOKIA 3310: AUDIO TONES & SIMULATOR ENGINE
// ------------------------------------------------------------
let nokiaMode = 'sms'; // 'sms' | 'snake'
let currentSmsText = typeof smsDefault !== 'undefined' ? smsDefault : '"D2 na me, wer na u? txt bck asap! <3"';
let lastKey = null;
let keyIndex = 0;
let keyTimer = null;

const nokiaKeyMap = {
  '1': ['.', ',', '?', '!', '1', '-', '@'],
  '2': ['a', 'b', 'c', '2'],
  '3': ['d', 'e', 'f', '3'],
  '4': ['g', 'h', 'i', '4'],
  '5': ['j', 'k', 'l', '5'],
  '6': ['m', 'n', 'o', '6'],
  '7': ['p', 'q', 'r', 's', '7'],
  '8': ['t', 'u', 'v', '8'],
  '9': ['w', 'x', 'y', 'z', '9'],
  '0': [' ', '0'],
  '*': ['*', '+', '<', '>', '#'],
  '#': ['#', '\n']
};

function playNokiaTone(freq = 900, duration = 0.05, type = 'square') {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) { /* audio disabled */ }
}

function setNokiaMode(mode) {
  nokiaMode = mode;
  const smsView = $('nokia-sms-view');
  const snakeView = $('nokia-snake-view');
  const smsBtn = $('nokia-mode-sms-btn');
  const snakeBtn = $('nokia-mode-snake-btn');

  if (mode === 'snake') {
    smsView.classList.add('hidden');
    snakeView.classList.remove('hidden');
    if (smsBtn) smsBtn.classList.remove('active');
    if (snakeBtn) snakeBtn.classList.add('active');
    initSnake();
    playNokiaTone(600, 0.08);
  } else {
    snakeView.classList.add('hidden');
    smsView.classList.remove('hidden');
    if (smsBtn) smsBtn.classList.add('active');
    if (snakeBtn) snakeBtn.classList.remove('active');
    stopSnake();
    playNokiaTone(850, 0.05);
  }
}

// SMS Display
function updateSmsDisplay(text) {
  currentSmsText = text.slice(0, 160);
  const screen = $('nokia-screen');
  const counter = $('sms-count');
  const input = $('sms-input');

  if (screen) screen.textContent = currentSmsText || ' ';
  if (counter) counter.textContent = currentSmsText.length;
  if (input && input.value !== currentSmsText) input.value = currentSmsText;
}

// Keypad handler (0-9, *, #)
function nokiaKeyPress(key) {
  if (nokiaMode === 'snake') {
    handleSnakeKey(key);
    return;
  }

  // SMS Multi-tap
  playNokiaTone(700 + (parseInt(key, 10) || 1) * 45);
  const chars = nokiaKeyMap[key];
  if (!chars) return;

  if (lastKey === key && keyTimer) {
    clearTimeout(keyTimer);
    keyIndex = (keyIndex + 1) % chars.length;
    currentSmsText = currentSmsText.slice(0, -1) + chars[keyIndex];
  } else {
    if (currentSmsText.length >= 160) return;
    keyIndex = 0;
    currentSmsText += chars[keyIndex];
  }

  lastKey = key;
  updateSmsDisplay(currentSmsText);

  keyTimer = setTimeout(() => {
    lastKey = null;
    keyTimer = null;
  }, 800);
}

// "C" Key: Backspace or Exit Snake
function nokiaBackspace() {
  if (nokiaMode === 'snake') {
    setNokiaMode('sms');
    return;
  }
  playNokiaTone(420);
  if (keyTimer) {
    clearTimeout(keyTimer);
    keyTimer = null;
    lastKey = null;
  }
  currentSmsText = currentSmsText.slice(0, -1);
  updateSmsDisplay(currentSmsText);
}

// Navi Key: Send SMS or Start Snake
function nokiaNaviPress() {
  if (nokiaMode === 'snake') {
    toggleSnakePlay();
    return;
  }
  playNokiaTone(1200);
  const screen = $('nokia-screen');
  if (!screen) return;
  const original = screen.textContent;
  screen.textContent = '📨 Message Sent!';
  setTimeout(() => { screen.textContent = original; }, 900);
}

// Scroll Rocker (▲ / ▼)
function nokiaScroll(dir) {
  if (nokiaMode === 'snake') {
    if (dir < 0) snakeChangeDir(0, -1);
    else snakeChangeDir(0, 1);
    return;
  }
  playNokiaTone(800);
  const screen = $('nokia-screen');
  if (screen) screen.scrollTop += dir * 25;
}

// Presets
function changeSms(key) {
  if (nokiaMode === 'snake') setNokiaMode('sms');
  if (typeof smsData === 'undefined' || !smsData[key]) return;
  playNokiaTone(980);
  updateSmsDisplay(smsData[key]);
}

function onSmsInput() {
  const input = $('sms-input');
  if (input) updateSmsDisplay(input.value);
}

function clearSms() {
  playNokiaTone(350);
  updateSmsDisplay('');
}

// ------------------------------------------------------------
// NOKIA 3310 SNAKE II ENGINE
// ------------------------------------------------------------
const SNAKE_COLS = 20;
const SNAKE_ROWS = 12;
const CELL_SIZE = 8; // 20 * 8 = 160w, 12 * 8 = 96h
let snakeCanvas, snakeCtx;
let snakeLoop = null;
let snakeRunning = false;
let snakeScore = 0;
let snakeHighScore = 0;
let snake = [];
let snakeDir = { x: 1, y: 0 };
let snakeNextDir = { x: 1, y: 0 };
let snakeFood = { x: 10, y: 5 };

function initSnake() {
  snakeCanvas = $('snake-canvas');
  if (!snakeCanvas) return;
  snakeCtx = snakeCanvas.getContext('2d');
  try {
    snakeHighScore = Number(window.localStorage.getItem('nokia_snake_hi') || 0);
  } catch (e) {
    snakeHighScore = 0;
  }
  $('snake-hi-display').textContent = `HI: ${snakeHighScore}`;
  resetSnakeGame();
  drawSnake();
}

function resetSnakeGame() {
  snake = [
    { x: 5, y: 6 },
    { x: 4, y: 6 },
    { x: 3, y: 6 }
  ];
  snakeDir = { x: 1, y: 0 };
  snakeNextDir = { x: 1, y: 0 };
  snakeScore = 0;
  $('snake-score-display').textContent = 'SCR: 0';
  spawnSnakeFood();
}

function spawnSnakeFood() {
  let valid = false;
  while (!valid) {
    const fx = Math.floor(Math.random() * SNAKE_COLS);
    const fy = Math.floor(Math.random() * SNAKE_ROWS);
    if (!snake.some(s => s.x === fx && s.y === fy)) {
      snakeFood = { x: fx, y: fy };
      valid = true;
    }
  }
}

function toggleSnakePlay() {
  if (snakeRunning) {
    pauseSnake();
  } else {
    startSnake();
  }
}

function startSnake() {
  if (snakeRunning) return;
  const overlay = $('snake-overlay');
  if (overlay) overlay.classList.add('hidden');
  $('snake-status-text').textContent = 'Playing';
  snakeRunning = true;
  playNokiaTone(900, 0.08);

  if (snakeLoop) clearInterval(snakeLoop);
  snakeLoop = setInterval(updateSnakeStep, 130);
}

function pauseSnake() {
  snakeRunning = false;
  if (snakeLoop) clearInterval(snakeLoop);
  $('snake-status-text').textContent = 'Paused';
  const overlay = $('snake-overlay');$('snake-msg').textContent = 'PAUSED';
  if (overlay) overlay.classList.remove('hidden');
}

function stopSnake() {
  snakeRunning = false;
  if (snakeLoop) clearInterval(snakeLoop);
}

function snakeDie() {
  stopSnake();
  playNokiaTone(200, 0.25, 'sawtooth');
  setTimeout(() => playNokiaTone(140, 0.35, 'sawtooth'), 120);

  if (snakeScore > snakeHighScore) {
    snakeHighScore = snakeScore;
    try { localStorage.setItem('nokia_snake_hi', snakeHighScore); } catch (e) {}
    $('snake-hi-display').textContent = `HI: ${snakeHighScore}`;
  }

  $('snake-status-text').textContent = 'Game Over';$('snake-msg').textContent = `GAME OVER! (${snakeScore})`;
  $('snake-overlay').classList.remove('hidden');
  resetSnakeGame();
}

function updateSnakeStep() {
  snakeDir = snakeNextDir;
  const head = { x: snake[0].x + snakeDir.x, y: snake[0].y + snakeDir.y };

  // Wall collision (classic solid borders)
  if (head.x < 0 || head.x >= SNAKE_COLS || head.y < 0 || head.y >= SNAKE_ROWS) {
    snakeDie();
    return;
  }

  // Self collision
  if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
    snakeDie();
    return;
  }

  snake.unshift(head);

  // Check food
  if (head.x === snakeFood.x && head.y === snakeFood.y) {
    snakeScore += 10;
    $('snake-score-display').textContent = `SCR: ${snakeScore}`;
    playNokiaTone(1250, 0.04);
    spawnSnakeFood();
  } else {
    snake.pop();
  }

  drawSnake();
}

function drawSnake() {
  if (!snakeCtx) return;
  // LCD background
  snakeCtx.fillStyle = '#9cad57';
  snakeCtx.fillRect(0, 0, 160, 96);

  // Pixel Matrix Snake
  snakeCtx.fillStyle = '#172207';
  snake.forEach((pt, idx) => {
    // 1px inner gap for authentic dot-matrix look
    snakeCtx.fillRect(pt.x * CELL_SIZE + 0.5, pt.y * CELL_SIZE + 0.5, CELL_SIZE - 1, CELL_SIZE - 1);
  });

  // Food (small centered block)
  snakeCtx.fillRect(snakeFood.x * CELL_SIZE + 1.5, snakeFood.y * CELL_SIZE + 1.5, CELL_SIZE - 3, CELL_SIZE - 3);
}

function snakeChangeDir(dx, dy) {
  // Prevent reverse direction
  if (snakeDir.x === -dx && snakeDir.y === -dy) return;
  snakeNextDir = { x: dx, y: dy };
  playNokiaTone(750, 0.02);
}

function handleSnakeKey(key) {
  if (!snakeRunning && key !== '5') {
    startSnake();
  }
  if (key === '2') snakeChangeDir(0, -1); // Up
  else if (key === '8') snakeChangeDir(0, 1); // Down
  else if (key === '4') snakeChangeDir(-1, 0); // Left
  else if (key === '6') snakeChangeDir(1, 0); // Right
  else if (key === '5') toggleSnakePlay(); // Pause / Play
}

let modernGameInterval = null;
let modernGameScore = 0;
let modernGameBest = 0;

function setModernMode(mode) {
  if (mode !== 'chat' && mode !== 'game') return;
  const isGame = mode === 'game';
  const chatView = $('modern-chat-view');
  const gameView = $('modern-game-view');
  const chatButton = $('modern-mode-chat-btn');
  const gameButton = $('modern-mode-game-btn');
  if (!chatView || !gameView) return;

  chatView.hidden = isGame;
  gameView.hidden = !isGame;
  chatView.classList.toggle('is-active', !isGame);
  gameView.classList.toggle('is-active', isGame);
  chatButton?.classList.toggle('active', !isGame);
  gameButton?.classList.toggle('active', isGame);
  chatButton?.setAttribute('aria-pressed', String(!isGame));
  gameButton?.setAttribute('aria-pressed', String(isGame));
  if (!isGame) {
    stopModernGame();
    $('modern-game-score').textContent = '00';
    $('modern-game-time').textContent = '15';
    $('modern-game-message').textContent = 'Glow Rush';
    $('modern-game-instructions').textContent = 'Tap the light. Chase your high score.';
    $('modern-game-start').textContent = 'Play 15 seconds';
  }
}

function appendModernMessage(text) {
  const feed = $('modern-chat-feed');
  if (!feed) return;
  const message = document.createElement('div');
  message.className = 'modern-message modern-message-out';
  message.textContent = text;
  const typing = feed.querySelector('.modern-typing');
  feed.insertBefore(message, typing || null);
  feed.scrollTop = feed.scrollHeight;
}

function modernSendMessage(event) {
  event.preventDefault();
  const input = $('modern-message-input');
  const text = input?.value.trim();
  if (!text) return;
  appendModernMessage(text);
  input.value = '';
  input.focus();
}

function modernUsePreset(text) {
  appendModernMessage(text);
  setModernMode('chat');
}

function moveModernGameTarget() {
  const target = $('modern-game-target');
  if (!target) return;
  target.style.left = `${18 + Math.random() * 64}%`;
  target.style.top = `${18 + Math.random() * 64}%`;
}

function startModernGame() {
  stopModernGame();
  modernGameScore = 0;
  $('modern-game-score').textContent = '00';
  $('modern-game-time').textContent = '15';
  $('modern-game-message').textContent = 'Glow Rush';
  $('modern-game-instructions').textContent = 'Tap the light. Chase your high score.';
  $('modern-game-start').textContent = 'Play 15 seconds';
  $('modern-game-overlay').hidden = true;
  $('modern-game-target').hidden = false;
  moveModernGameTarget();

  let secondsLeft = 15;
  modernGameInterval = setInterval(() => {
    secondsLeft -= 1;
    $('modern-game-time').textContent = String(secondsLeft).padStart(2, '0');
    if (secondsLeft <= 0) finishModernGame();
  }, 1000);
}

function modernGameTap() {
  if (!modernGameInterval) return;
  modernGameScore += 1;
  $('modern-game-score').textContent = String(modernGameScore).padStart(2, '0');
  if (modernGameScore > modernGameBest) {
    modernGameBest = modernGameScore;
    $('modern-game-best').textContent = String(modernGameBest);
  }
  moveModernGameTarget();
}

function finishModernGame() {
  stopModernGame();
  $('modern-game-message').textContent = 'Round complete!';
  $('modern-game-instructions').textContent = `You caught ${modernGameScore} lights. Want another go?`;
  $('modern-game-start').textContent = 'Play again';
  $('modern-game-overlay').hidden = false;
}

function stopModernGame() {
  if (modernGameInterval) clearInterval(modernGameInterval);
  modernGameInterval = null;
  const target = $('modern-game-target');
  const overlay = $('modern-game-overlay');
  if (target) target.hidden = true;
  if (overlay) overlay.hidden = false;
}

// Keyboard controls
document.addEventListener('keydown', e => {
  if (nokiaMode === 'snake') {
    if (['ArrowUp', 'KeyW'].includes(e.code)) { snakeChangeDir(0, -1); e.preventDefault(); }
    else if (['ArrowDown', 'KeyS'].includes(e.code)) { snakeChangeDir(0, 1); e.preventDefault(); }
    else if (['ArrowLeft', 'KeyA'].includes(e.code)) { snakeChangeDir(-1, 0); e.preventDefault(); }
    else if (['ArrowRight', 'KeyD'].includes(e.code)) { snakeChangeDir(1, 0); e.preventDefault(); }
    else if (['Space', 'Enter'].includes(e.code)) { toggleSnakePlay(); e.preventDefault(); }
    else if (e.key === 'Escape') { setNokiaMode('sms'); }
    return;
  }

  if (lbIsOpen()) {
    if (e.key === 'Escape') closeLightbox();
    else if (e.key === 'ArrowRight') lightboxStep(1);
    else if (e.key === 'ArrowLeft') lightboxStep(-1);
    else if (e.key === 'Tab') trapTab(e, $('lightbox'));
    return;
  }
  if (fsIsOpen()) {
    if (e.key === 'Escape') closeFriendsterModal();
    else if (e.key === 'ArrowRight') nextProfile();
    else if (e.key === 'ArrowLeft') prevProfile();
    else if (e.key === 'Tab') trapTab(e, $('fs-window'));
    return;
  }
  if (passportIsOpen()) {
    if (e.key === 'Escape') closePassport();
    else if (e.key === 'Tab') trapTab(e, $('passport-panel'));
    return;
  }
  if (mapIsOpen()) {
    if (e.key === 'Escape') closeMap();
    else if (e.key === 'Tab') trapTab(e, $('map-panel'));
    return;
  }
  if (roomIsOpen()) {
    if (e.key === 'Escape') closeRoom();
    else if (e.key === 'ArrowRight') nextRoom();
    else if (e.key === 'ArrowLeft') prevRoom();
    else if (e.key === 'Tab') trapTab(e, $('room-panel'));
  }
});

// ------------------------------------------------------------
// FRIENDSTER PROFILES
// ------------------------------------------------------------
let currentProfile = 0;

function avatarHtml(p) {
  const img = p.avatar
    ? `<img src="${esc(p.avatar)}" alt="${esc(profShort(p))}'s profile photo" onerror="this.remove()">`
    : '';
  return `<span>${esc(profInitials(p))}</span>${img}`;
}

function showProfile(index) {
  if (typeof friendsterProfiles === 'undefined' || !friendsterProfiles.length) return;
  const total = friendsterProfiles.length;
  currentProfile = (index + total) % total;
  const p = friendsterProfiles[currentProfile];

  $('fs-tabs').innerHTML = friendsterProfiles.map((f, i) =>
    `<button type="button" class="fs-tab ${i === currentProfile ? 'active' : ''}" onclick="showProfile(${i})">${esc(profShort(f))}</button>`
  ).join('');

  const activeTab = $('fs-tabs').querySelector('.fs-tab.active');
  if (activeTab && window.innerWidth < 640) {
    activeTab.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }

  const friends = friendsterProfiles
    .map((f, i) => ({ f, i }))
    .filter(x => x.i !== currentProfile)
    .map(x => `
      <button type="button" class="fs-friend" onclick="showProfile(${x.i})" title="View ${esc(profShort(x.f))}'s profile">
        <span class="fs-avatar">${avatarHtml(x.f)}</span>
        <span>${esc(profShort(x.f))}</span>
      </button>`).join('');

  $('fs-body').innerHTML = `
    <div class="flex flex-row gap-3 items-center sm:items-start">
      <div class="fs-avatar">${avatarHtml(p)}</div>
      <div class="min-w-0 text-left flex-1">
        <h4 class="font-bold text-sm sm:text-base text-blue-900 break-words leading-tight">${esc(p.handle)}</h4>
        <p class="text-[10px] sm:text-[11px] font-semibold text-slate-600">${esc(p.name)}</p>
        <p class="text-[10px] sm:text-[11px] text-slate-500 italic mb-1 truncate">"${esc(p.quote)}"</p>
        <div class="text-[10px] sm:text-[11px] space-y-0.5 text-slate-600">
          <p><strong>Status:</strong> ${esc(p.status)}</p>
          <p><strong>Since:</strong> ${esc(p.memberSince)}</p>
          <p><strong>From:</strong> ${esc(p.hometown)}</p>
        </div>
      </div>
    </div>
    <div class="border border-blue-200 rounded p-2.5 sm:p-3 bg-blue-50/50">
      <h5 class="font-bold text-blue-900 mb-1 border-b border-blue-200 pb-1">About Me</h5>
      <p class="text-[11px] text-slate-700 leading-relaxed mb-2">${esc(p.about)}</p>
      <div>${p.interests.map(t => `<span class="fs-chip">${esc(t)}</span>`).join('')}</div>
    </div>
    <div class="border border-blue-200 rounded p-2.5 sm:p-3 bg-blue-50/50">
      <h5 class="font-bold text-blue-900 mb-2 border-b border-blue-200 pb-1">Testimonials (${p.testimonials.length})</h5>
      <div class="space-y-1.5">
        ${p.testimonials.map(t => `
          <div class="bg-white p-2 rounded border border-blue-100 text-[10px] sm:text-[11px]">
            <span class="font-semibold text-blue-800">${esc(t.from)}:</span> "${esc(t.text)}"
          </div>`).join('')}
      </div>
    </div>
    <div class="border border-blue-200 rounded p-2.5 sm:p-3 bg-blue-50/50">
      <h5 class="font-bold text-blue-900 mb-2 border-b border-blue-200 pb-1">Top Friends</h5>
      <div class="flex gap-2.5 flex-wrap">${friends}</div>
    </div>`;
  $('fs-body').scrollTop = 0;
  $('fs-counter').textContent = `Profile ${currentProfile + 1} of ${total}`;
}

function nextProfile() { showProfile(currentProfile + 1); }
function prevProfile() { showProfile(currentProfile - 1); }

function openFriendsterModal(index) {
  lastFocus.fs = document.activeElement;
  enterLevel(1);
  showProfile(typeof index === 'number' ? index : 0);
  $('friendster-modal').classList.remove('hidden');
  lockScroll();
  focusPanel('fs-window');
}

function hideFriendster() {
  $('friendster-modal').classList.add('hidden');
  unlockScrollIfIdle();
  restoreFocus('fs');
}

function closeFriendsterModal() { leaveLevel(1, hideFriendster); }

function renderCurators() {
  const grid = $('curator-grid');
  if (!grid) return;
  grid.innerHTML = friendsterProfiles.map((p, i) => `
    <div class="curator-card">
      <div class="fs-avatar">${avatarHtml(p)}</div>
      <h4 class="font-extrabold text-sm">${esc(p.name)}</h4>
      ${p.role ? `<p class="text-[11px] text-[var(--muted)] mt-1">${esc(p.role)}</p>` : ''}
      <button type="button" onclick="openFriendsterModal(${i})" class="btn btn-yellow btn-sm mt-3">✨ View Friendster</button>
    </div>`).join('');
}

// ------------------------------------------------------------
// BEFORE / AFTER SLIDER
// ------------------------------------------------------------
function baLayerHtml(side) {
  const photo = side.img
    ? `<img src="${esc(side.img)}" alt="${esc(side.label)}" draggable="false" onerror="this.remove()">`
    : '';
  return `<div class="ba-ph"><span class="ba-emoji">${esc(side.emoji)}</span><span class="ba-ph-label">${esc(side.label)}</span></div>${photo}`;
}

function setBaPosition(percent) {
  const slider = $('ba-slider');
  const p = Math.max(0, Math.min(100, percent));
  slider.style.setProperty('--pos', p + '%');
  slider.setAttribute('aria-valuenow', Math.round(p));
}

function showBeforeAfter(index) {
  const pair = beforeAfterPairs[index];
  if (!pair) return;
  $('ba-before').innerHTML = baLayerHtml(pair.before);
  $('ba-after').innerHTML = baLayerHtml(pair.after);$('ba-title').textContent = pair.title;
  $('ba-caption').textContent = pair.caption;
  document.querySelectorAll('#ba-tabs button').forEach((btn, i) => {
    const isActive = i === index;
    btn.classList.toggle('active', isActive);
    if (isActive && window.innerWidth < 640) {
      btn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  });
  setBaPosition(50);
}

function initBeforeAfter() {
  const slider = $('ba-slider');
  if (!slider || typeof beforeAfterPairs === 'undefined' || !beforeAfterPairs.length) return;

  $('ba-tabs').innerHTML = beforeAfterPairs.map((pair, i) =>
    `<button type="button" class="chip-btn" onclick="showBeforeAfter(${i})">${esc(String(pair.tab).trim())}</button>`
  ).join('');

  let dragging = false;
  const moveTo = clientX => {
    const rect = slider.getBoundingClientRect();
    setBaPosition(((clientX - rect.left) / rect.width) * 100);
  };
  slider.addEventListener('pointerdown', e => { dragging = true; slider.setPointerCapture(e.pointerId); moveTo(e.clientX); });
  slider.addEventListener('pointermove', e => { if (dragging) moveTo(e.clientX); });
  ['pointerup', 'pointercancel'].forEach(evt => slider.addEventListener(evt, () => { dragging = false; }));

  slider.addEventListener('keydown', e => {
    const now = Number(slider.getAttribute('aria-valuenow')) || 50;
    if (e.key === 'ArrowLeft') { setBaPosition(now - 5); e.preventDefault(); }
    if (e.key === 'ArrowRight') { setBaPosition(now + 5); e.preventDefault(); }
    if (e.key === 'Home') { setBaPosition(0); e.preventDefault(); }
    if (e.key === 'End') { setBaPosition(100); e.preventDefault(); }
  });

  showBeforeAfter(0);
}

// ------------------------------------------------------------
// MINI PLAYER
// ------------------------------------------------------------
let currentStation = 1;

function getPlaylistId(url) {
  if (!url) return null;
  try { return new URL(url).searchParams.get('list') || null; } catch (e) { return null; }
}

function renderStationTabs() {
  const wrap = $('station-tabs');
  if (!wrap || typeof playlistStations === 'undefined') return;
  wrap.style.gridTemplateColumns = `repeat(${playlistStations.length}, minmax(0, 1fr))`;
  wrap.innerHTML = playlistStations.map((s, i) =>
    `<button type="button" class="station-btn" onclick="switchStation(${i + 1})">${esc(s.tab)}</button>`
  ).join('');
}

function setPlayerMissing(message) {
  const box = $('yt-video-box');
  box.classList.add('missing');
  box.innerHTML = `<div>${esc(message)}<br><br><a class="btn btn-pink btn-sm" href="${esc(playlistSearch.youtube)}" target="_blank" rel="noopener noreferrer">🔎 Search YouTube ↗</a></div>`;
}

function switchStation(stationNum) {
  const st = playlistStations[stationNum - 1];
  if (!st) return;
  currentStation = stationNum;

  document.querySelectorAll('.station-btn').forEach((b, i) => b.classList.toggle('active', i === stationNum - 1));
  $('station-badge').textContent = `STATION ${stationNum}`;
  $('playlist-title').textContent = st.title;

  const embedWrap = $('yt-embed-wrap');
  const musicWrap = $('yt-music-wrap');
  const hasId = !!getPlaylistId(st.url);

  if (st.type === 'link') {
    embedWrap.classList.add('hidden');
    musicWrap.classList.remove('hidden');

    const iframe = $('yt-inpage-player');
    if (iframe) iframe.src = 'about:blank';

    $('ytm-open-link').href = hasId ? st.url : playlistSearch.music;
    $('ytm-note').textContent = hasId
      ? "YouTube Music opens in a new tab."
      : 'No playlist link set yet. Paste yours into js/data.js (playlistStations).';
    return;
  }

  musicWrap.classList.add('hidden');
  embedWrap.classList.remove('hidden');
  const box = $('yt-video-box');

  if (!hasId) {
    setPlayerMissing('No playlist link yet. Paste a YouTube playlist link into js/data.js (playlistStations).');
    $('yt-open-link').href = playlistSearch.youtube;
    $('yt-open-link').textContent = 'Search YouTube for 2000s OPM ↗';
    return;
  }
  if (!$('yt-inpage-player')) {
    box.classList.remove('missing');
    box.innerHTML = '<iframe id="yt-inpage-player" class="w-full h-full" title="2000s soundtrack playlist" frameborder="0" referrerpolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>';
  }
  const embedUrl = `https://www.youtube.com/embed/videoseries?list=${encodeURIComponent(getPlaylistId(st.url))}`;
  const iframe = $('yt-inpage-player');
  if (iframe.getAttribute('src') !== embedUrl) iframe.src = embedUrl;
  $('yt-open-link').href = st.url;
  $('yt-open-link').textContent = 'Not playing? Open on YouTube ↗';
}

function togglePlayerPopup() {
  const pill = $('player-pill');
  const popup = $('player-popup');
  const opening = popup.classList.contains('hidden');

  popup.classList.toggle('hidden', !opening);
  pill.classList.toggle('hidden', opening);

  if (opening) switchStation(currentStation);
}

// ------------------------------------------------------------
// SOURCES SECTION (built from `sources` + `imageCredits` in data.js)
// ------------------------------------------------------------
function renderSources() {
  const wrap = $('sources-list');
  if (!wrap) return;
  const tag = era => era === 'both' ? '<span class="src-tag both">2000s + Today</span>'
    : `<span class="src-tag ${era === 'now' ? 'now' : 'then'}">${era === 'now' ? 'Today' : '2000s'}</span>`;
  wrap.innerHTML = exhibits.map(ex => `
    <article class="src-card" style="--c:${esc(ex.color)}">
      <div class="src-body">
        <h4><span aria-hidden="true">${esc(ex.icon)}</span> ${esc(ex.wing)}</h4>
        ${(ex.sources && ex.sources.length)
          ? `<ol>${ex.sources.map(s => `<li>${tag(s.era)} ${srcLinkHtml(s)}${s.note ? `<small>${esc(s.note)}</small>` : ''}</li>`).join('')}</ol>`
          : '<p class="src-empty">No sources added yet.</p>'}
      </div>
    </article>`).join('');

  const credits = (typeof imageCredits !== 'undefined' && Array.isArray(imageCredits)) ? imageCredits : [];
  const box = $('credits-wrap');
  if (box && credits.length) {
    $('credits-list').innerHTML = credits.map(c =>
      `<li>${esc(c.item || '')}${c.credit ? ' — ' + esc(c.credit) : ''}${c.url ? ` (<a href="${esc(c.url)}" target="_blank" rel="noopener noreferrer">link</a>)` : ''}</li>`).join('');
    box.classList.remove('hidden');
  }
}

// ------------------------------------------------------------
// MUSEUM PASSPORT (a stamp for every room, in both eras)
// ------------------------------------------------------------
const PASSPORT_KEY = 'ppc-passport-v1';

function loadPassport() {
  try {
    const raw = localStorage.getItem(PASSPORT_KEY);
    const d = raw && JSON.parse(raw);
    return (d && typeof d.stamps === 'object' && d.stamps) ? d.stamps : {};
  } catch (e) { return {}; }
}
let passportStamps = loadPassport();

function savePassport() {
  try { localStorage.setItem(PASSPORT_KEY, JSON.stringify({ stamps: passportStamps })); } catch (e) { /* ignore */ }
}
function hasStamp(id, era) { return !!passportStamps[id + ':' + era]; }
function passportTotal() { return exhibits.length * 2; }
function passportCount() {
  let n = 0;
  exhibits.forEach(ex => { ['then', 'now'].forEach(era => { if (hasStamp(ex.id, era)) n++; }); });
  return n;
}
function updatePassportBadge() {
  document.querySelectorAll('.pp-count').forEach(el => { el.textContent = passportCount() + '/' + passportTotal(); });
}

function stampVisit(id, era) {
  const eras = era === 'compare' ? ['then', 'now'] : [era];
  const fresh = eras.filter(e => !hasStamp(id, e));
  if (!fresh.length) return;
  const stamp = Date.now();
  fresh.forEach(e => { passportStamps[id + ':' + e] = stamp; });
  savePassport();
  updatePassportBadge();

  const ex = exhibits.find(x => x.id === id);
  const label = fresh.map(e => e === 'then' ? '2000s' : 'Today').join(' + ');
  const n = passportCount(), total = passportTotal();
  showToast(`🛂 New stamp: ${ex ? ex.wing : id} • ${label} (${n}/${total})`);
  if (n === total) {
    setTimeout(() => { showToast('🏅 Museum complete! You collected every stamp.', 4500); burstConfetti(); }, 2000);
  }
  if (passportIsOpen()) renderPassport();
}

function renderPassport() {
  const total = passportTotal(), n = passportCount();
  const pct = total ? Math.round((n / total) * 100) : 0;
  const slot = (ex, i, era) => {
    const got = passportStamps[ex.id + ':' + era];
    const when = got ? new Date(got).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : '';
    return `
      <button type="button" class="pp-stamp era-${era} ${got ? 'got' : ''}" onclick="passportGo(${i}, '${era}')"
              aria-label="${esc(ex.wing)}, ${era === 'then' ? '2000s' : 'Today'}: ${got ? 'stamp collected' : 'not visited yet'}">
        <span class="pp-ring">${got ? '✓' : '?'}</span>
        <small>${era === 'then' ? '2000s' : 'Today'}</small>
        ${got ? `<em>${esc(when)}</em>` : ''}
      </button>`;
  };
  $('passport-body').innerHTML = `
    <div class="pp-progress">
      <div class="pp-bar" role="progressbar" aria-valuemin="0" aria-valuemax="${total}" aria-valuenow="${n}"><i style="width:${pct}%"></i></div>
      <b>${n} / ${total} stamps</b>
    </div>
    ${n === total
      ? `<div class="pp-complete">🏅 Museum complete! You explored every room in both eras.</div>`
      : `<p class="pp-hint">Open each room in the <b>2000s</b> and <b>Today</b> tabs to collect stamps. The <b>Compare</b> tab gives you both at once. Tap a stamp to go there.</p>`}
    <div class="pp-grid">
      ${exhibits.map((ex, i) => `
        <div class="pp-room" style="--c:${esc(ex.color)}">
          <div class="pp-room-head"><span>${esc(ex.icon)}</span><b>${esc(ex.wing)}</b></div>
          <div class="pp-stamps">${slot(ex, i, 'then')}${slot(ex, i, 'now')}</div>
        </div>`).join('')}
    </div>
    <div class="pp-foot">
      <button type="button" class="btn btn-sm" onclick="resetPassport()">Reset passport</button>
      <span>Saved on this device only.</span>
    </div>`;
}

function openPassport() {
  lastFocus.pp = document.activeElement;
  enterLevel(1);
  renderPassport();
  $('passport-modal').classList.remove('hidden');
  lockScroll();
  focusPanel('passport-panel');
}
function hidePassport() {
  $('passport-modal').classList.add('hidden');
  unlockScrollIfIdle();
  restoreFocus('pp');
}
function closePassport() { leaveLevel(1, hidePassport); }

function passportGo(i, era) { hidePassport(); openRoom(i, era); }

function resetPassport() {
  if (window.confirm && !window.confirm('Reset your passport? All stamps will be removed.')) return;
  passportStamps = {};
  savePassport();
  updatePassportBadge();
  renderPassport();
  renderGallery();
  switchWing(currentTopic);
}

// ---------- Toast + confetti ----------
let toastTimer = null;
function showToast(message, ms) {
  const t = $('toast');
  if (!t) return;
  t.textContent = message;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), ms || 2800);
}

function burstConfetti() {
  if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const bits = ['🎉', '✨', '🏅', '⭐', '🎊', '💖'];
  for (let i = 0; i < 28; i++) {
    const s = document.createElement('span');
    s.className = 'confetti';
    s.textContent = bits[i % bits.length];
    s.style.left = (Math.random() * 100) + 'vw';
    s.style.animationDelay = (Math.random() * 0.6) + 's';
    s.style.fontSize = (1 + Math.random() * 1.2) + 'rem';
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 3600);
  }
}

// ------------------------------------------------------------
// MUSEUM FLOOR MAP (2000s Wing | Grand Lobby | Today Wing)
// ------------------------------------------------------------
let mapHere = null; // {id, era} when the map was opened from inside a room

function renderMap() {
  const doors = era => exhibits.map((ex, i) => {
    const got = hasStamp(ex.id, era);
    const here = mapHere && mapHere.id === ex.id && (mapHere.era === era || mapHere.era === 'compare');
    return `
      <button type="button" class="door door-${era} ${got ? 'visited' : ''} ${here ? 'here' : ''}" style="--c:${esc(ex.color)}"
              onclick="mapEnter(${i}, '${era}')"
              aria-label="Enter the ${esc(ex.wing)} room, ${era === 'then' ? '2000s' : 'Today'} wing${got ? ' (visited)' : ''}${here ? ' (you are here)' : ''}">
        ${here ? '<span class="you-are-here">📍 You are here</span>' : ''}
        <span class="door-icon">${esc(ex.icon)}</span>
        <span class="door-name">${esc(ex.wing)}</span>
        ${got ? '<span class="door-check">✓</span>' : ''}
      </button>`;
  }).join('');

  $('map-body').innerHTML = `
    <div class="floor">
      <section class="floor-wing fw-then" aria-label="The 2000s Wing">
        <h4>🕹️ The 2000s Wing <small>2000–2010</small></h4>
        <div class="floor-rooms">${doors('then')}</div>
      </section>

      <section class="floor-lobby ${mapHere ? '' : 'here'}" aria-label="Grand Lobby">
        ${mapHere ? '' : '<span class="you-are-here">📍 You are here</span>'}
        <div class="lobby-title">🏛️ Grand Lobby</div>
        <div class="lobby-links">
          <button type="button" class="btn btn-sm" onclick="mapOpenPassport()">🛂 Passport</button>
          <button type="button" class="btn btn-sm" onclick="mapGo('then-now')">↔ Then vs. Now</button>
          <button type="button" class="btn btn-sm" onclick="mapGo('sms')">📱 Nokia relic</button>
          <button type="button" class="btn btn-sm" onclick="mapGo('curators')">✨ Curators</button>
        </div>
      </section>

      <section class="floor-wing fw-now" aria-label="The Today Wing">
        <h4>📱 The Today Wing <small>2020s</small></h4>
        <div class="floor-rooms">${doors('now')}</div>
      </section>
    </div>
    <p class="map-legend">✓ visited &nbsp;•&nbsp; 📍 you are here &nbsp;•&nbsp; tap any door to walk in</p>`;
}

function openMap(here) {
  mapHere = (here && typeof here === 'object' && here.id) ? here : null;
  lastFocus.map = document.activeElement;
  enterLevel(1);
  renderMap();
  $('map-modal').classList.remove('hidden');
  lockScroll();
  focusPanel('map-panel');
}
function openMapFromRoom() {
  const here = { id: exhibits[currentRoom].id, era: roomEra };
  hideRoom();
  openMap(here);
}
function hideMap() {
  $('map-modal').classList.add('hidden');
  unlockScrollIfIdle();
  restoreFocus('map');
}
function closeMap() { leaveLevel(1, hideMap); }

function mapEnter(i, era) { hideMap(); openRoom(i, era); }
function mapOpenPassport() { hideMap(); openPassport(); }
function mapGo(sectionId) {
  closeMap();
  setTimeout(() => { const el = $(sectionId); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 160);
}

// ------------------------------------------------------------
// Start everything
// ------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  renderWingTabs();
  initGalleryEvents();
  applyEra(currentEra);
  setModernMode('chat');
  updatePassportBadge();
  renderCurators();
  renderSources();
  initBeforeAfter();
  renderStationTabs();
  addSwipe($('room-content'), nextRoom, prevRoom);
  addSwipe($('lightbox'), () => lightboxStep(1), () => lightboxStep(-1));
  addSwipe($('fs-window'), nextProfile, prevProfile);
  if (typeof smsDefault !== 'undefined') { $('sms-input').value = ''; updateSmsDisplay(smsDefault); }
  openRoomFromHash();
});// ------------------------------------------------------------
// Helpers
// ------------------------------------------------------------
const $ = id => document.getElementById(id);

function esc(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function profShort(p) { return p.short || String(p.name || '?').trim().split(/\s+/)[0]; }
function profInitials(p) {
  if (p.initials) return p.initials;
  const w = String(p.name || '?').trim().split(/\s+/).filter(Boolean);
  return (w[0][0] + (w.length > 1 ? w[w.length - 1][0] : '')).toUpperCase();
}

// ------------------------------------------------------------
// TIME MACHINE (2000s <-> Today) + EXHIBIT WINGS
// ------------------------------------------------------------
const ERA_STORAGE_KEY = 'ppc-era';
let currentEra = document.documentElement.classList.contains('era-now') ? 'now' : 'then';
let currentTopic = 'all';
let warpTimers = [];

const ERA_INFO = {
  then: { name: 'The 2000s Wing', theme: '#fff4fa',
          desc: '2000–2010: texting clans, Friendster, burned CDs, LAN shops, and the first online rescue calls.' },
  now:  { name: 'The Today Wing', theme: '#e9e6ff',
          desc: 'The 2020s: short videos, e-wallets, P-Pop, mobile esports, and real-time weather alerts.' }
};

// One exhibit, seen through one era. Missing fields fall back to safe blanks.
function eraData(ex, era) {
  if (era === 'now') {
    const t = ex.today || {};
    return {
      era: 'now', label: 'Today',
      title: t.title || ex.title || '', blurb: t.blurb || ex.blurb || '',
      badge: t.badge || ex.badge || '', tag: t.tag || ex.tag || '',
      icon: t.icon || ex.icon || '✨', image: t.image || '', alt: t.alt || t.badge || ex.badge || '',
      summary: ex.now || '', intro: t.intro || '', facts: t.facts || [], artifacts: t.artifacts || [],
      gallery: t.gallery || [], impact: t.impact || ex.impact || ''
    };
  }
  return {
    era: 'then', label: '2000–2010',
    title: ex.thenTitle || ex.title || '', blurb: ex.thenBlurb || ex.blurb || '',
    badge: ex.badge || '', tag: ex.tag || '',
    icon: ex.icon || '✨', image: ex.image || '', alt: ex.alt || ex.badge || '',
    summary: ex.then || '', intro: ex.intro || '', facts: ex.facts || [], artifacts: ex.artifacts || [],
    gallery: ex.gallery || [], impact: ex.impact || ''
  };
}

function setEra(era) {
  if (era !== 'then' && era !== 'now') return;
  if (era === currentEra) return;
  warpTimers.forEach(clearTimeout); warpTimers = [];
  const reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const warp = $('warp');
  if (warp && !reduce) {
    warp.className = 'warp warping to-' + era;
    warpTimers.push(setTimeout(() => applyEra(era), 260));   // swap while the screen is covered
    warpTimers.push(setTimeout(() => { warp.className = 'warp'; }, 760));
  } else {
    applyEra(era);
  }
}

function applyEra(era) {
  currentEra = era;
  const root = document.documentElement;
  root.classList.remove('era-then', 'era-now');
  root.classList.add('era-' + era);
  try { localStorage.setItem(ERA_STORAGE_KEY, era); } catch (e) { /* ignore */ }

  document.querySelectorAll('[data-era]').forEach(b => {
    const on = b.dataset.era === era;
    b.classList.toggle('active', on);
    b.setAttribute('aria-pressed', on ? 'true' : 'false');
  });
  const desc = $('wing-desc');
  if (desc) desc.textContent = ERA_INFO[era].desc;
  const currentWing = $('wing-current');
  if (currentWing) currentWing.textContent = `Now viewing: ${ERA_INFO[era].name}`;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', ERA_INFO[era].theme);

  renderGallery();
  switchWing(currentTopic);
  if (era === 'then') stopModernGame();
}

function renderWingTabs() {
  const wrap = $('wing-tabs');
  if (!wrap) return;
  wrap.innerHTML =
    `<button type="button" class="chip-btn tab-btn active" data-wing="all" onclick="switchWing('all')">All Topics</button>` +
    exhibits.map(ex =>
      `<button type="button" class="chip-btn tab-btn" data-wing="${esc(ex.id)}" onclick="switchWing('${esc(ex.id)}')">${esc(ex.icon)} ${esc(ex.wing)}</button>`
    ).join('');
}

function renderGallery() {
  const grid = $('gallery-grid');
  if (!grid) return;
  grid.innerHTML = exhibits.map((ex, i) => {
    const d = eraData(ex, currentEra);
    const then = eraData(ex, 'then');
    const now = eraData(ex, 'now');
    const visited = hasStamp(ex.id, currentEra);
    const eraCopy = (content, era, label, icon) => `
      <section class="card-era-copy card-era-copy-${era} ${currentEra === era ? 'is-current' : ''}" aria-label="${label} description">
        <span class="card-era-label"><span aria-hidden="true">${icon}</span>${label}</span>
        <h4>${esc(content.title)}</h4>
        <p class="card-era-subtitle">${esc(content.blurb)}</p>
        <p class="card-era-summary">${esc(content.summary)}</p>
      </section>`;
    return `
    <article class="exhibit-card reveal" tabindex="0" role="button" data-category="${esc(ex.id)}" data-index="${i}"
             style="--c:${esc(ex.color)}" aria-label="Enter the ${esc(ex.wing)} room (${esc(d.label)}): ${esc(d.title)}">
      <div>
        <div class="card-media">
          <span class="card-emoji" aria-hidden="true">${esc(d.icon)}</span>
          ${d.image ? `<img src="${esc(d.image)}" alt="${esc(d.alt)}" loading="lazy" decoding="async" onerror="this.remove()">` : ''}
          <span class="card-badge">${esc(d.badge)}</span>
          <span class="card-era">${esc(d.label)}</span>
        </div>
        <div class="card-body">
          <div class="flex items-center justify-between gap-2">
            <span class="domain">${esc(ex.domain)}</span>
            <span class="retro-tag">${esc(d.tag)}</span>
          </div>
          <div class="card-era-comparison" aria-label="Compare this exhibit across eras">
            ${eraCopy(then, 'then', '2000–2010', '🕹️')}
            ${eraCopy(now, 'now', 'Today · 2020s', '📱')}
          </div>
        </div>
      </div>
      <div class="card-foot">
        <span>${currentEra === 'then' ? 'Impact' : 'Why it matters'}: <em>${esc(d.impact)}</em></span>
        <span class="enter">${visited ? '✓ ' : ''}Enter room →</span>
      </div>
    </article>`;
  }).join('');

  const cards = grid.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { threshold: 0.1 });
    cards.forEach(c => io.observe(c));
  } else {
    cards.forEach(c => c.classList.add('in'));
  }
}

// Attached once (the cards themselves are re-built whenever the era changes)
function initGalleryEvents() {
  const grid = $('gallery-grid');
  if (!grid) return;
  grid.addEventListener('click', e => {
    const card = e.target.closest('.exhibit-card');
    if (card) openRoom(Number(card.dataset.index));
  });
  grid.addEventListener('keydown', e => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const card = e.target.closest('.exhibit-card');
    if (card) { e.preventDefault(); openRoom(Number(card.dataset.index)); }
  });
}

function switchWing(category) {
  currentTopic = category;
  document.querySelectorAll('.tab-btn').forEach(tab => {
    const isActive = tab.getAttribute('data-wing') === category;
    tab.classList.toggle('active', isActive);
    if (isActive && window.innerWidth < 640) {
      tab.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  });
  document.querySelectorAll('.exhibit-card').forEach(card =>
    card.classList.toggle('hidden', !(category === 'all' || card.getAttribute('data-category') === category))
  );
}

// ------------------------------------------------------------
// MODAL LAYERS
// ------------------------------------------------------------
let historyOK = true;
const lastFocus = { room: null, fs: null, lb: null, pp: null, map: null };

function histLevel() { return (history.state && history.state.lvl) || 0; }

function enterLevel(lvl, hash) {
  if (!historyOK) return;
  try {
    const base = location.pathname + location.search;
    const url = hash || (lvl > 1 ? base + location.hash : base);
    if (histLevel() >= lvl) history.replaceState({ lvl }, '', url);
    else history.pushState({ lvl }, '', url);
  } catch (e) { historyOK = false; }
}

function leaveLevel(lvl, hideFn) {
  if (historyOK && histLevel() >= lvl) {
    try { history.back(); } catch (e) { hideFn(); return; }
    setTimeout(() => { if (histLevel() >= lvl) hideFn(); }, 400);
  } else {
    hideFn();
  }
}

function roomIsOpen() { const m = $('room-modal'); return !!m && !m.classList.contains('hidden'); }
function fsIsOpen() { const m = $('friendster-modal'); return !!m && !m.classList.contains('hidden'); }
function lbIsOpen() { const m = $('lightbox'); return !!m && !m.classList.contains('hidden'); }
function passportIsOpen() { const m = $('passport-modal'); return !!m && !m.classList.contains('hidden'); }
function mapIsOpen() { const m = $('map-modal'); return !!m && !m.classList.contains('hidden'); }

function lockScroll() { document.body.style.overflow = 'hidden'; }
function unlockScrollIfIdle() {
  if (!roomIsOpen() && !fsIsOpen() && !lbIsOpen() && !passportIsOpen() && !mapIsOpen()) document.body.style.overflow = '';
}

function focusPanel(id) { const el = $(id); if (el && el.focus) el.focus({ preventScroll: true }); }
function restoreFocus(key) {
  const el = lastFocus[key];
  lastFocus[key] = null;
  if (el && el.focus && (!document.contains || document.contains(el))) el.focus({ preventScroll: true });
}

function trapTab(e, container) {
  if (!container) return;
  const items = [...container.querySelectorAll('button, a[href], textarea, input, [tabindex]:not([tabindex="-1"])')]
    .filter(el => !el.disabled && el.getClientRects().length > 0);
  if (!items.length) { e.preventDefault(); return; }
  const first = items[0], last = items[items.length - 1], active = document.activeElement;
  if (e.shiftKey && (active === first || active === container)) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && active === last) { e.preventDefault(); first.focus(); }
}

function addSwipe(el, onLeft, onRight) {
  if (!el) return;
  let x0 = 0, y0 = 0, t0 = 0, tracking = false;
  el.addEventListener('touchstart', e => {
    if (e.touches.length !== 1) { tracking = false; return; }
    x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; t0 = Date.now(); tracking = true;
  }, { passive: true });
  el.addEventListener('touchend', e => {
    if (!tracking) return;
    tracking = false;
    const t = e.changedTouches[0];
    const dx = t.clientX - x0, dy = t.clientY - y0;
    if (Date.now() - t0 < 700 && Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      (dx < 0 ? onLeft : onRight)();
    }
  }, { passive: true });
}

window.addEventListener('popstate', () => {
  const lvl = histLevel();
  if (lvl < 2 && lbIsOpen()) hideLightbox();
  if (lvl < 1) {
    if (roomIsOpen()) hideRoom();
    if (fsIsOpen()) hideFriendster();
    if (passportIsOpen()) hidePassport();
    if (mapIsOpen()) hideMap();
  }
});

// ---------- Lightbox ----------
let lbIndex = 0;
let lbEra = 'then';
function currentGallery() {
  const ex = exhibits[currentRoom];
  return ex ? eraData(ex, lbEra).gallery : [];
}

function showLightbox(i) {
  const items = currentGallery();
  if (!items.length) return;
  lbIndex = (i + items.length) % items.length;
  const g = items[lbIndex];
  const img = $('lb-img');
  img.classList.remove('lb-broken');
  img.alt = g.caption || '';
  img.src = g.src;
  $('lb-caption').textContent = (g.caption || '') + (g.year ? ` (${g.year})` : '');
  $('lb-credit').textContent = g.credit || '';$('lb-count').textContent = `${lbIndex + 1} / ${items.length}`;
  $('lb-full').href = g.src;
  document.querySelectorAll('.lb-nav').forEach(b => b.classList.toggle('hidden', items.length < 2));
}

function openLightbox(i, era) {
  lbEra = era === 'now' ? 'now' : 'then';
  lastFocus.lb = document.activeElement;
  enterLevel(2);
  showLightbox(i);
  $('lightbox').classList.remove('hidden');
  lockScroll();
  focusPanel('lightbox');
}
function hideLightbox() {
  $('lightbox').classList.add('hidden');$('lb-img').removeAttribute('src');
  unlockScrollIfIdle();
  restoreFocus('lb');
}
function closeLightbox() { leaveLevel(2, hideLightbox); }
function lightboxStep(d) { showLightbox(lbIndex + d); }

function galleryImgFailed(img) {
  const item = img.closest('.gallery-item');
  const grid = img.closest('.gallery-grid');
  const section = img.closest('.gallery-section');
  if (item) item.remove();
  if (grid && !grid.children.length && section) section.remove();
}

// ------------------------------------------------------------
// DETAIL ROOMS (every room has 2000s / Today / Compare tabs)
// ------------------------------------------------------------
let currentRoom = 0;
let roomEra = 'then'; // 'then' | 'now' | 'compare'

function roomHash(id, era) { return '#room-' + id + (era && era !== 'then' ? '/' + era : ''); }

function roomGalleryHtml(items, era, heading) {
  if (!items || !items.length) return '';
  return `
    <section class="gallery-section">
      <h3 class="room-h">${heading || '📸 Photo gallery'} <span class="room-h-sub">tap a photo to enlarge</span></h3>
      <div class="gallery-grid">
        ${items.map((g, i) => `
          <button type="button" class="gallery-item" onclick="openLightbox(${i}, '${era}')" aria-label="Enlarge photo: ${esc(g.caption || 'Photo ' + (i + 1))}">
            <span class="gallery-frame"><img src="${esc(g.src)}" alt="${esc(g.caption || '')}" loading="lazy" decoding="async" onerror="galleryImgFailed(this)"></span>
            <span class="gallery-cap">${esc(g.caption || '')}${g.year ? ` <em>(${esc(g.year)})</em>` : ''}</span>
          </button>`).join('')}
      </div>
    </section>`;
}

function srcLinkHtml(s) {
  const meta = [s.publisher, s.year].filter(Boolean).map(esc).join(', ');
  return `<a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.title)}</a>${meta ? ` <span class="src-pub">— ${meta}</span>` : ''}`;
}

function roomSourcesHtml(ex, era) {
  const list = (ex.sources || []).filter(s => era === 'compare' || s.era === 'both' || s.era === era);
  if (!list.length) return '';
  return `
    <details class="room-sources">
      <summary>📚 Sources for this room (${list.length})</summary>
      <ol>${list.map(s => `<li>${srcLinkHtml(s)}${s.note ? `<small>${esc(s.note)}</small>` : ''}</li>`).join('')}</ol>
    </details>`;
}

function roomFactsHtml(facts) {
  if (!facts || !facts.length) return '';
  return `<h3 class="room-h">💡 Did you know?</h3><ul class="fact-list">${facts.map(f => `<li>${esc(f)}</li>`).join('')}</ul>`;
}

function roomArtifactsHtml(items) {
  if (!items || !items.length) return '';
  return `
    <h3 class="room-h">🗂️ Artifacts in this room</h3>
    <div class="artifact-grid">
      ${items.map(a => `
        <div class="artifact">
          <span class="artifact-emoji">${esc(a.emoji)}</span>
          <div><b>${esc(a.name)}</b><p>${esc(a.note)}</p></div>
        </div>`).join('')}
    </div>`;
}

function roomHeroHtml(ex, era) {
  if (era === 'compare') {
    const half = (d, cls) => `
      <div class="hero-half ${cls}">
        <span class="hero-half-emoji" aria-hidden="true">${esc(d.icon)}</span>
        ${d.image ? `<img src="${esc(d.image)}" alt="${esc(d.alt)}" onerror="this.remove()">` : ''}
        <span class="hero-half-tag">${esc(d.label)}</span>
      </div>`;
    return `
      <div class="room-hero compare">
        ${half(eraData(ex, 'then'), 'then')}${half(eraData(ex, 'now'), 'now')}
        <div class="room-hero-shade"></div>
        <div class="room-hero-text">
          <span class="room-domain">${esc(ex.domain)} • Compare</span>
          <h2>${esc(ex.title)}</h2>
          <p>${esc(ex.blurb)}</p>
        </div>
      </div>`;
  }
  const d = eraData(ex, era);
  return `
    <div class="room-hero era-${era}">
      <span class="room-hero-emoji" aria-hidden="true">${esc(d.icon)}</span>
      ${d.image ? `<img src="${esc(d.image)}" alt="${esc(d.alt)}" onerror="this.remove()">` : ''}
      <div class="room-hero-shade"></div>
      <div class="room-hero-text">
        <span class="room-domain">${esc(ex.domain)} • ${esc(d.label)}</span>
        <h2>${esc(d.title)}</h2>
        <p>${esc(d.blurb)}</p>
      </div>
    </div>`;
}

function roomTabsHtml(ex) {
  const tabs = [['then', '🕹️', '2000s'], ['now', '📱', 'Today'], ['compare', '⚖️', 'Compare']];
  return `<div class="room-tabs" role="tablist" aria-label="Choose an era">` +
    tabs.map(([k, ic, label]) => {
      const stamped = k !== 'compare' && hasStamp(ex.id, k);
      return `<button type="button" role="tab" aria-selected="${roomEra === k}" class="room-tab tab-${k} ${roomEra === k ? 'active' : ''}" onclick="setRoomEra('${k}')">${ic} ${label}${stamped ? ' <span class="tab-stamp" title="Stamp collected">✓</span>' : ''}</button>`;
    }).join('') + `</div>`;
}

function roomActionsHtml(ex, era) {
  const curator = (typeof ex.curator === 'number' && friendsterProfiles[ex.curator]) ? friendsterProfiles[ex.curator] : null;
  const other = era === 'then' ? 'now' : 'then';
  return `
    <div class="room-actions">
      <button type="button" class="btn btn-pink" onclick="setRoomEra('${other}')">${other === 'now' ? 'See the Today version ⏩' : '⏪ Back to the 2000s'}</button>
      <button type="button" class="btn" onclick="setRoomEra('compare')">⚖️ Compare both</button>
      ${curator ? `<button type="button" class="btn btn-yellow" onclick="visitCurator(${ex.curator})">✨ Meet the curator: ${esc(profShort(curator))}</button>` : ''}
    </div>`;
}

function roomEraBodyHtml(ex, era) {
  const d = eraData(ex, era);
  return `
    ${d.intro ? `<p class="room-intro">${esc(d.intro)}</p>` : ''}
    <div class="era-block ${era === 'then' ? 'era-then' : 'era-present'}" style="margin:0">
      <span class="era-label">${era === 'then' ? '2000–2010 Decade' : 'Present Time'}</span>${esc(d.summary)}
    </div>
    ${roomGalleryHtml(d.gallery, era)}
    ${roomFactsHtml(d.facts)}
    ${roomArtifactsHtml(d.artifacts)}
    ${d.impact ? `<div class="impact-box">⭐ ${era === 'then' ? 'Impact' : 'Why it matters'}: ${esc(d.impact)}</div>` : ''}
    ${roomSourcesHtml(ex, era)}
    ${roomActionsHtml(ex, era)}`;
}

function roomCompareBodyHtml(ex) {
  const col = (d, cls) => `
    <div class="cmp-col ${cls}">
      <h4 class="cmp-head">${cls === 'then' ? '🕹️ 2000–2010' : '📱 Today'}</h4>
      <div class="era-block ${cls === 'then' ? 'era-then' : 'era-present'}" style="margin:0 0 .6rem">
        <span class="era-label">${esc(d.title)}</span>${esc(d.summary)}
      </div>
      ${d.facts.length ? `<ul class="cmp-facts">${d.facts.slice(0, 3).map(f => `<li>${esc(f)}</li>`).join('')}</ul>` : ''}
      <div class="cmp-chips">${d.artifacts.map(a => `<span class="cmp-chip" title="${esc(a.note)}">${esc(a.emoji)} ${esc(a.name)}</span>`).join('')}</div>
    </div>`;
  const a = eraData(ex, 'then'), b = eraData(ex, 'now');
  return `
    <div class="change-box">🔄 <b>The big shift:</b> ${esc(ex.change || ex.impact || '')}</div>
    <div class="cmp-grid">${col(a, 'then')}${col(b, 'now')}</div>
    ${roomGalleryHtml(a.gallery, 'then', '📸 2000s photos')}
    ${roomGalleryHtml(b.gallery, 'now', '📸 Today photos')}
    ${roomSourcesHtml(ex, 'compare')}
    <div class="room-actions">
      <button type="button" class="btn" onclick="setRoomEra('then')">🕹️ Enter the 2000s room</button>
      <button type="button" class="btn btn-pink" onclick="setRoomEra('now')">📱 Enter the Today room</button>
    </div>`;
}

function renderRoom(index, era) {
  const total = exhibits.length;
  currentRoom = ((index % total) + total) % total;
  if (era === 'then' || era === 'now' || era === 'compare') roomEra = era;
  const ex = exhibits[currentRoom];

  $('room-panel').style.setProperty('--c', ex.color);
  $('room-panel').dataset.era = roomEra;
  stampVisit(ex.id, roomEra);   // collect a passport stamp (before tabs are drawn so the ✓ shows)

  const content = $('room-content');
  content.innerHTML = `
    ${roomHeroHtml(ex, roomEra)}
    ${roomTabsHtml(ex)}
    <div class="room-body">
      ${roomEra === 'compare' ? roomCompareBodyHtml(ex) : roomEraBodyHtml(ex, roomEra)}
    </div>`;
  content.scrollTop = 0;
  content.classList.remove('swap'); void content.offsetWidth; content.classList.add('swap');

  $('room-dots').innerHTML = exhibits.map((e, i) =>
    `<button type="button" class="room-dot ${i === currentRoom ? 'active' : ''}" onclick="renderRoom(${i})" title="${esc(e.wing)}" aria-label="Go to ${esc(e.wing)} room">${esc(e.icon)}</button>`
  ).join('');
  if ($('room-prev-label')) $('room-prev-label').textContent = exhibits[(currentRoom - 1 + total) % total].wing;
  if ($('room-next-label')) $('room-next-label').textContent = exhibits[(currentRoom + 1) % total].wing;
  const eraName = roomEra === 'then' ? '2000s' : roomEra === 'now' ? 'Today' : 'Compare';
  $('room-count').textContent = `Room ${currentRoom + 1} of ${total} • ${ex.wing} • ${eraName}`;

  try { history.replaceState(history.state, '', roomHash(ex.id, roomEra)); } catch (e) { /* ignore */ }
}

function setRoomEra(era) { renderRoom(currentRoom, era); }

function openRoom(index, era) {
  const n = exhibits.length;
  const i = (((typeof index === 'number' ? index : 0) % n) + n) % n;
  roomEra = (era === 'then' || era === 'now' || era === 'compare') ? era : currentEra;
  lastFocus.room = document.activeElement;
  enterLevel(1, roomHash(exhibits[i].id, roomEra));
  renderRoom(i);
  $('room-modal').classList.remove('hidden');
  lockScroll();
  focusPanel('room-panel');
}

function hideRoom() {
  $('room-modal').classList.add('hidden');
  unlockScrollIfIdle();
  restoreFocus('room');
  if (location.hash.indexOf('#room-') === 0) {
    try { history.replaceState(history.state, '', location.pathname + location.search); } catch (e) { /* ignore */ }
  }
}

function closeRoom() { leaveLevel(1, hideRoom); }
function nextRoom() { renderRoom(currentRoom + 1); }
function prevRoom() { renderRoom(currentRoom - 1); }

function visitCurator(profileIndex) {
  hideRoom();
  openFriendsterModal(profileIndex);
}

function openRoomFromHash() {
  const m = location.hash.match(/^#room-([\w-]+?)(?:\/(then|now|compare))?$/);
  if (!m) return;
  const i = exhibits.findIndex(e => e.id === m[1]);
  if (i >= 0) openRoom(i, m[2] || 'then');
}

// ------------------------------------------------------------
// NOKIA 3310: AUDIO TONES & SIMULATOR ENGINE
// ------------------------------------------------------------
let nokiaMode = 'sms'; // 'sms' | 'snake'
let currentSmsText = typeof smsDefault !== 'undefined' ? smsDefault : '"D2 na me, wer na u? txt bck asap! <3"';
let lastKey = null;
let keyIndex = 0;
let keyTimer = null;

const nokiaKeyMap = {
  '1': ['.', ',', '?', '!', '1', '-', '@'],
  '2': ['a', 'b', 'c', '2'],
  '3': ['d', 'e', 'f', '3'],
  '4': ['g', 'h', 'i', '4'],
  '5': ['j', 'k', 'l', '5'],
  '6': ['m', 'n', 'o', '6'],
  '7': ['p', 'q', 'r', 's', '7'],
  '8': ['t', 'u', 'v', '8'],
  '9': ['w', 'x', 'y', 'z', '9'],
  '0': [' ', '0'],
  '*': ['*', '+', '<', '>', '#'],
  '#': ['#', '\n']
};

function playNokiaTone(freq = 900, duration = 0.05, type = 'square') {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) { /* audio disabled */ }
}

function setNokiaMode(mode) {
  nokiaMode = mode;
  const smsView = $('nokia-sms-view');
  const snakeView = $('nokia-snake-view');
  const smsBtn = $('nokia-mode-sms-btn');
  const snakeBtn = $('nokia-mode-snake-btn');

  if (mode === 'snake') {
    smsView.classList.add('hidden');
    snakeView.classList.remove('hidden');
    if (smsBtn) smsBtn.classList.remove('active');
    if (snakeBtn) snakeBtn.classList.add('active');
    initSnake();
    playNokiaTone(600, 0.08);
  } else {
    snakeView.classList.add('hidden');
    smsView.classList.remove('hidden');
    if (smsBtn) smsBtn.classList.add('active');
    if (snakeBtn) snakeBtn.classList.remove('active');
    stopSnake();
    playNokiaTone(850, 0.05);
  }
}

// SMS Display
function updateSmsDisplay(text) {
  currentSmsText = text.slice(0, 160);
  const screen = $('nokia-screen');
  const counter = $('sms-count');
  const input = $('sms-input');

  if (screen) screen.textContent = currentSmsText || ' ';
  if (counter) counter.textContent = currentSmsText.length;
  if (input && input.value !== currentSmsText) input.value = currentSmsText;
}

// Keypad handler (0-9, *, #)
function nokiaKeyPress(key) {
  if (nokiaMode === 'snake') {
    handleSnakeKey(key);
    return;
  }

  // SMS Multi-tap
  playNokiaTone(700 + (parseInt(key, 10) || 1) * 45);
  const chars = nokiaKeyMap[key];
  if (!chars) return;

  if (lastKey === key && keyTimer) {
    clearTimeout(keyTimer);
    keyIndex = (keyIndex + 1) % chars.length;
    currentSmsText = currentSmsText.slice(0, -1) + chars[keyIndex];
  } else {
    if (currentSmsText.length >= 160) return;
    keyIndex = 0;
    currentSmsText += chars[keyIndex];
  }

  lastKey = key;
  updateSmsDisplay(currentSmsText);

  keyTimer = setTimeout(() => {
    lastKey = null;
    keyTimer = null;
  }, 800);
}

// "C" Key: Backspace or Exit Snake
function nokiaBackspace() {
  if (nokiaMode === 'snake') {
    setNokiaMode('sms');
    return;
  }
  playNokiaTone(420);
  if (keyTimer) {
    clearTimeout(keyTimer);
    keyTimer = null;
    lastKey = null;
  }
  currentSmsText = currentSmsText.slice(0, -1);
  updateSmsDisplay(currentSmsText);
}

// Navi Key: Send SMS or Start Snake
function nokiaNaviPress() {
  if (nokiaMode === 'snake') {
    toggleSnakePlay();
    return;
  }
  playNokiaTone(1200);
  const screen = $('nokia-screen');
  if (!screen) return;
  const original = screen.textContent;
  screen.textContent = '📨 Message Sent!';
  setTimeout(() => { screen.textContent = original; }, 900);
}

// Scroll Rocker (▲ / ▼)
function nokiaScroll(dir) {
  if (nokiaMode === 'snake') {
    if (dir < 0) snakeChangeDir(0, -1);
    else snakeChangeDir(0, 1);
    return;
  }
  playNokiaTone(800);
  const screen = $('nokia-screen');
  if (screen) screen.scrollTop += dir * 25;
}

// Presets
function changeSms(key) {
  if (nokiaMode === 'snake') setNokiaMode('sms');
  if (typeof smsData === 'undefined' || !smsData[key]) return;
  playNokiaTone(980);
  updateSmsDisplay(smsData[key]);
}

function onSmsInput() {
  const input = $('sms-input');
  if (input) updateSmsDisplay(input.value);
}

function clearSms() {
  playNokiaTone(350);
  updateSmsDisplay('');
}

// ------------------------------------------------------------
// NOKIA 3310 SNAKE II ENGINE
// ------------------------------------------------------------
const SNAKE_COLS = 20;
const SNAKE_ROWS = 12;
const CELL_SIZE = 8; // 20 * 8 = 160w, 12 * 8 = 96h
let snakeCanvas, snakeCtx;
let snakeLoop = null;
let snakeRunning = false;
let snakeScore = 0;
let snakeHighScore = 0;
let snake = [];
let snakeDir = { x: 1, y: 0 };
let snakeNextDir = { x: 1, y: 0 };
let snakeFood = { x: 10, y: 5 };

function initSnake() {
  snakeCanvas = $('snake-canvas');
  if (!snakeCanvas) return;
  snakeCtx = snakeCanvas.getContext('2d');
  try {
    snakeHighScore = Number(window.localStorage.getItem('nokia_snake_hi') || 0);
  } catch (e) {
    snakeHighScore = 0;
  }
  $('snake-hi-display').textContent = `HI: ${snakeHighScore}`;
  resetSnakeGame();
  drawSnake();
}

function resetSnakeGame() {
  snake = [
    { x: 5, y: 6 },
    { x: 4, y: 6 },
    { x: 3, y: 6 }
  ];
  snakeDir = { x: 1, y: 0 };
  snakeNextDir = { x: 1, y: 0 };
  snakeScore = 0;
  $('snake-score-display').textContent = 'SCR: 0';
  spawnSnakeFood();
}

function spawnSnakeFood() {
  let valid = false;
  while (!valid) {
    const fx = Math.floor(Math.random() * SNAKE_COLS);
    const fy = Math.floor(Math.random() * SNAKE_ROWS);
    if (!snake.some(s => s.x === fx && s.y === fy)) {
      snakeFood = { x: fx, y: fy };
      valid = true;
    }
  }
}

function toggleSnakePlay() {
  if (snakeRunning) {
    pauseSnake();
  } else {
    startSnake();
  }
}

function startSnake() {
  if (snakeRunning) return;
  const overlay = $('snake-overlay');
  if (overlay) overlay.classList.add('hidden');
  $('snake-status-text').textContent = 'Playing';
  snakeRunning = true;
  playNokiaTone(900, 0.08);

  if (snakeLoop) clearInterval(snakeLoop);
  snakeLoop = setInterval(updateSnakeStep, 130);
}

function pauseSnake() {
  snakeRunning = false;
  if (snakeLoop) clearInterval(snakeLoop);
  $('snake-status-text').textContent = 'Paused';
  const overlay = $('snake-overlay');$('snake-msg').textContent = 'PAUSED';
  if (overlay) overlay.classList.remove('hidden');
}

function stopSnake() {
  snakeRunning = false;
  if (snakeLoop) clearInterval(snakeLoop);
}

function snakeDie() {
  stopSnake();
  playNokiaTone(200, 0.25, 'sawtooth');
  setTimeout(() => playNokiaTone(140, 0.35, 'sawtooth'), 120);

  if (snakeScore > snakeHighScore) {
    snakeHighScore = snakeScore;
    try { localStorage.setItem('nokia_snake_hi', snakeHighScore); } catch (e) {}
    $('snake-hi-display').textContent = `HI: ${snakeHighScore}`;
  }

  $('snake-status-text').textContent = 'Game Over';$('snake-msg').textContent = `GAME OVER! (${snakeScore})`;
  $('snake-overlay').classList.remove('hidden');
  resetSnakeGame();
}

function updateSnakeStep() {
  snakeDir = snakeNextDir;
  const head = { x: snake[0].x + snakeDir.x, y: snake[0].y + snakeDir.y };

  // Wall collision (classic solid borders)
  if (head.x < 0 || head.x >= SNAKE_COLS || head.y < 0 || head.y >= SNAKE_ROWS) {
    snakeDie();
    return;
  }

  // Self collision
  if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
    snakeDie();
    return;
  }

  snake.unshift(head);

  // Check food
  if (head.x === snakeFood.x && head.y === snakeFood.y) {
    snakeScore += 10;
    $('snake-score-display').textContent = `SCR: ${snakeScore}`;
    playNokiaTone(1250, 0.04);
    spawnSnakeFood();
  } else {
    snake.pop();
  }

  drawSnake();
}

function drawSnake() {
  if (!snakeCtx) return;
  // LCD background
  snakeCtx.fillStyle = '#9cad57';
  snakeCtx.fillRect(0, 0, 160, 96);

  // Pixel Matrix Snake
  snakeCtx.fillStyle = '#172207';
  snake.forEach((pt, idx) => {
    // 1px inner gap for authentic dot-matrix look
    snakeCtx.fillRect(pt.x * CELL_SIZE + 0.5, pt.y * CELL_SIZE + 0.5, CELL_SIZE - 1, CELL_SIZE - 1);
  });

  // Food (small centered block)
  snakeCtx.fillRect(snakeFood.x * CELL_SIZE + 1.5, snakeFood.y * CELL_SIZE + 1.5, CELL_SIZE - 3, CELL_SIZE - 3);
}

function snakeChangeDir(dx, dy) {
  // Prevent reverse direction
  if (snakeDir.x === -dx && snakeDir.y === -dy) return;
  snakeNextDir = { x: dx, y: dy };
  playNokiaTone(750, 0.02);
}

function handleSnakeKey(key) {
  if (!snakeRunning && key !== '5') {
    startSnake();
  }
  if (key === '2') snakeChangeDir(0, -1); // Up
  else if (key === '8') snakeChangeDir(0, 1); // Down
  else if (key === '4') snakeChangeDir(-1, 0); // Left
  else if (key === '6') snakeChangeDir(1, 0); // Right
  else if (key === '5') toggleSnakePlay(); // Pause / Play
}

let modernGameInterval = null;
let modernGameScore = 0;
let modernGameBest = 0;

function setModernMode(mode) {
  if (mode !== 'chat' && mode !== 'game') return;
  const isGame = mode === 'game';
  const chatView = $('modern-chat-view');
  const gameView = $('modern-game-view');
  const chatButton = $('modern-mode-chat-btn');
  const gameButton = $('modern-mode-game-btn');
  if (!chatView || !gameView) return;

  chatView.hidden = isGame;
  gameView.hidden = !isGame;
  chatView.classList.toggle('is-active', !isGame);
  gameView.classList.toggle('is-active', isGame);
  chatButton?.classList.toggle('active', !isGame);
  gameButton?.classList.toggle('active', isGame);
  chatButton?.setAttribute('aria-pressed', String(!isGame));
  gameButton?.setAttribute('aria-pressed', String(isGame));
  if (!isGame) {
    stopModernGame();
    $('modern-game-score').textContent = '00';
    $('modern-game-time').textContent = '15';
    $('modern-game-message').textContent = 'Glow Rush';
    $('modern-game-instructions').textContent = 'Tap the light. Chase your high score.';
    $('modern-game-start').textContent = 'Play 15 seconds';
  }
}

function appendModernMessage(text) {
  const feed = $('modern-chat-feed');
  if (!feed) return;
  const message = document.createElement('div');
  message.className = 'modern-message modern-message-out';
  message.textContent = text;
  const typing = feed.querySelector('.modern-typing');
  feed.insertBefore(message, typing || null);
  feed.scrollTop = feed.scrollHeight;
}

function modernSendMessage(event) {
  event.preventDefault();
  const input = $('modern-message-input');
  const text = input?.value.trim();
  if (!text) return;
  appendModernMessage(text);
  input.value = '';
  input.focus();
}

function modernUsePreset(text) {
  appendModernMessage(text);
  setModernMode('chat');
}

function moveModernGameTarget() {
  const target = $('modern-game-target');
  if (!target) return;
  target.style.left = `${18 + Math.random() * 64}%`;
  target.style.top = `${18 + Math.random() * 64}%`;
}

function startModernGame() {
  stopModernGame();
  modernGameScore = 0;
  $('modern-game-score').textContent = '00';
  $('modern-game-time').textContent = '15';
  $('modern-game-message').textContent = 'Glow Rush';
  $('modern-game-instructions').textContent = 'Tap the light. Chase your high score.';
  $('modern-game-start').textContent = 'Play 15 seconds';
  $('modern-game-overlay').hidden = true;
  $('modern-game-target').hidden = false;
  moveModernGameTarget();

  let secondsLeft = 15;
  modernGameInterval = setInterval(() => {
    secondsLeft -= 1;
    $('modern-game-time').textContent = String(secondsLeft).padStart(2, '0');
    if (secondsLeft <= 0) finishModernGame();
  }, 1000);
}

function modernGameTap() {
  if (!modernGameInterval) return;
  modernGameScore += 1;
  $('modern-game-score').textContent = String(modernGameScore).padStart(2, '0');
  if (modernGameScore > modernGameBest) {
    modernGameBest = modernGameScore;
    $('modern-game-best').textContent = String(modernGameBest);
  }
  moveModernGameTarget();
}

function finishModernGame() {
  stopModernGame();
  $('modern-game-message').textContent = 'Round complete!';
  $('modern-game-instructions').textContent = `You caught ${modernGameScore} lights. Want another go?`;
  $('modern-game-start').textContent = 'Play again';
  $('modern-game-overlay').hidden = false;
}

function stopModernGame() {
  if (modernGameInterval) clearInterval(modernGameInterval);
  modernGameInterval = null;
  const target = $('modern-game-target');
  const overlay = $('modern-game-overlay');
  if (target) target.hidden = true;
  if (overlay) overlay.hidden = false;
}

// Keyboard controls
document.addEventListener('keydown', e => {
  if (nokiaMode === 'snake') {
    if (['ArrowUp', 'KeyW'].includes(e.code)) { snakeChangeDir(0, -1); e.preventDefault(); }
    else if (['ArrowDown', 'KeyS'].includes(e.code)) { snakeChangeDir(0, 1); e.preventDefault(); }
    else if (['ArrowLeft', 'KeyA'].includes(e.code)) { snakeChangeDir(-1, 0); e.preventDefault(); }
    else if (['ArrowRight', 'KeyD'].includes(e.code)) { snakeChangeDir(1, 0); e.preventDefault(); }
    else if (['Space', 'Enter'].includes(e.code)) { toggleSnakePlay(); e.preventDefault(); }
    else if (e.key === 'Escape') { setNokiaMode('sms'); }
    return;
  }

  if (lbIsOpen()) {
    if (e.key === 'Escape') closeLightbox();
    else if (e.key === 'ArrowRight') lightboxStep(1);
    else if (e.key === 'ArrowLeft') lightboxStep(-1);
    else if (e.key === 'Tab') trapTab(e, $('lightbox'));
    return;
  }
  if (fsIsOpen()) {
    if (e.key === 'Escape') closeFriendsterModal();
    else if (e.key === 'ArrowRight') nextProfile();
    else if (e.key === 'ArrowLeft') prevProfile();
    else if (e.key === 'Tab') trapTab(e, $('fs-window'));
    return;
  }
  if (passportIsOpen()) {
    if (e.key === 'Escape') closePassport();
    else if (e.key === 'Tab') trapTab(e, $('passport-panel'));
    return;
  }
  if (mapIsOpen()) {
    if (e.key === 'Escape') closeMap();
    else if (e.key === 'Tab') trapTab(e, $('map-panel'));
    return;
  }
  if (roomIsOpen()) {
    if (e.key === 'Escape') closeRoom();
    else if (e.key === 'ArrowRight') nextRoom();
    else if (e.key === 'ArrowLeft') prevRoom();
    else if (e.key === 'Tab') trapTab(e, $('room-panel'));
  }
});

// ------------------------------------------------------------
// FRIENDSTER PROFILES
// ------------------------------------------------------------
let currentProfile = 0;

function avatarHtml(p) {
  const img = p.avatar
    ? `<img src="${esc(p.avatar)}" alt="${esc(profShort(p))}'s profile photo" onerror="this.remove()">`
    : '';
  return `<span>${esc(profInitials(p))}</span>${img}`;
}

function showProfile(index) {
  if (typeof friendsterProfiles === 'undefined' || !friendsterProfiles.length) return;
  const total = friendsterProfiles.length;
  currentProfile = (index + total) % total;
  const p = friendsterProfiles[currentProfile];

  $('fs-tabs').innerHTML = friendsterProfiles.map((f, i) =>
    `<button type="button" class="fs-tab ${i === currentProfile ? 'active' : ''}" onclick="showProfile(${i})">${esc(profShort(f))}</button>`
  ).join('');

  const activeTab = $('fs-tabs').querySelector('.fs-tab.active');
  if (activeTab && window.innerWidth < 640) {
    activeTab.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }

  const friends = friendsterProfiles
    .map((f, i) => ({ f, i }))
    .filter(x => x.i !== currentProfile)
    .map(x => `
      <button type="button" class="fs-friend" onclick="showProfile(${x.i})" title="View ${esc(profShort(x.f))}'s profile">
        <span class="fs-avatar">${avatarHtml(x.f)}</span>
        <span>${esc(profShort(x.f))}</span>
      </button>`).join('');

  $('fs-body').innerHTML = `
    <div class="flex flex-row gap-3 items-center sm:items-start">
      <div class="fs-avatar">${avatarHtml(p)}</div>
      <div class="min-w-0 text-left flex-1">
        <h4 class="font-bold text-sm sm:text-base text-blue-900 break-words leading-tight">${esc(p.handle)}</h4>
        <p class="text-[10px] sm:text-[11px] font-semibold text-slate-600">${esc(p.name)}</p>
        <p class="text-[10px] sm:text-[11px] text-slate-500 italic mb-1 truncate">"${esc(p.quote)}"</p>
        <div class="text-[10px] sm:text-[11px] space-y-0.5 text-slate-600">
          <p><strong>Status:</strong> ${esc(p.status)}</p>
          <p><strong>Since:</strong> ${esc(p.memberSince)}</p>
          <p><strong>From:</strong> ${esc(p.hometown)}</p>
        </div>
      </div>
    </div>
    <div class="border border-blue-200 rounded p-2.5 sm:p-3 bg-blue-50/50">
      <h5 class="font-bold text-blue-900 mb-1 border-b border-blue-200 pb-1">About Me</h5>
      <p class="text-[11px] text-slate-700 leading-relaxed mb-2">${esc(p.about)}</p>
      <div>${p.interests.map(t => `<span class="fs-chip">${esc(t)}</span>`).join('')}</div>
    </div>
    <div class="border border-blue-200 rounded p-2.5 sm:p-3 bg-blue-50/50">
      <h5 class="font-bold text-blue-900 mb-2 border-b border-blue-200 pb-1">Testimonials (${p.testimonials.length})</h5>
      <div class="space-y-1.5">
        ${p.testimonials.map(t => `
          <div class="bg-white p-2 rounded border border-blue-100 text-[10px] sm:text-[11px]">
            <span class="font-semibold text-blue-800">${esc(t.from)}:</span> "${esc(t.text)}"
          </div>`).join('')}
      </div>
    </div>
    <div class="border border-blue-200 rounded p-2.5 sm:p-3 bg-blue-50/50">
      <h5 class="font-bold text-blue-900 mb-2 border-b border-blue-200 pb-1">Top Friends</h5>
      <div class="flex gap-2.5 flex-wrap">${friends}</div>
    </div>`;
  $('fs-body').scrollTop = 0;
  $('fs-counter').textContent = `Profile ${currentProfile + 1} of ${total}`;
}

function nextProfile() { showProfile(currentProfile + 1); }
function prevProfile() { showProfile(currentProfile - 1); }

function openFriendsterModal(index) {
  lastFocus.fs = document.activeElement;
  enterLevel(1);
  showProfile(typeof index === 'number' ? index : 0);
  $('friendster-modal').classList.remove('hidden');
  lockScroll();
  focusPanel('fs-window');
}

function hideFriendster() {
  $('friendster-modal').classList.add('hidden');
  unlockScrollIfIdle();
  restoreFocus('fs');
}

function closeFriendsterModal() { leaveLevel(1, hideFriendster); }

function renderCurators() {
  const grid = $('curator-grid');
  if (!grid) return;
  grid.innerHTML = friendsterProfiles.map((p, i) => `
    <div class="curator-card">
      <div class="fs-avatar">${avatarHtml(p)}</div>
      <h4 class="font-extrabold text-sm">${esc(p.name)}</h4>
      ${p.role ? `<p class="text-[11px] text-[var(--muted)] mt-1">${esc(p.role)}</p>` : ''}
      <button type="button" onclick="openFriendsterModal(${i})" class="btn btn-yellow btn-sm mt-3">✨ View Friendster</button>
    </div>`).join('');
}

// ------------------------------------------------------------
// BEFORE / AFTER SLIDER
// ------------------------------------------------------------
function baLayerHtml(side) {
  const photo = side.img
    ? `<img src="${esc(side.img)}" alt="${esc(side.label)}" draggable="false" onerror="this.remove()">`
    : '';
  return `<div class="ba-ph"><span class="ba-emoji">${esc(side.emoji)}</span><span class="ba-ph-label">${esc(side.label)}</span></div>${photo}`;
}

function setBaPosition(percent) {
  const slider = $('ba-slider');
  const p = Math.max(0, Math.min(100, percent));
  slider.style.setProperty('--pos', p + '%');
  slider.setAttribute('aria-valuenow', Math.round(p));
}

function showBeforeAfter(index) {
  const pair = beforeAfterPairs[index];
  if (!pair) return;
  $('ba-before').innerHTML = baLayerHtml(pair.before);
  $('ba-after').innerHTML = baLayerHtml(pair.after);$('ba-title').textContent = pair.title;
  $('ba-caption').textContent = pair.caption;
  document.querySelectorAll('#ba-tabs button').forEach((btn, i) => {
    const isActive = i === index;
    btn.classList.toggle('active', isActive);
    if (isActive && window.innerWidth < 640) {
      btn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  });
  setBaPosition(50);
}

function initBeforeAfter() {
  const slider = $('ba-slider');
  if (!slider || typeof beforeAfterPairs === 'undefined' || !beforeAfterPairs.length) return;

  $('ba-tabs').innerHTML = beforeAfterPairs.map((pair, i) =>
    `<button type="button" class="chip-btn" onclick="showBeforeAfter(${i})">${esc(String(pair.tab).trim())}</button>`
  ).join('');

  let dragging = false;
  const moveTo = clientX => {
    const rect = slider.getBoundingClientRect();
    setBaPosition(((clientX - rect.left) / rect.width) * 100);
  };
  slider.addEventListener('pointerdown', e => { dragging = true; slider.setPointerCapture(e.pointerId); moveTo(e.clientX); });
  slider.addEventListener('pointermove', e => { if (dragging) moveTo(e.clientX); });
  ['pointerup', 'pointercancel'].forEach(evt => slider.addEventListener(evt, () => { dragging = false; }));

  slider.addEventListener('keydown', e => {
    const now = Number(slider.getAttribute('aria-valuenow')) || 50;
    if (e.key === 'ArrowLeft') { setBaPosition(now - 5); e.preventDefault(); }
    if (e.key === 'ArrowRight') { setBaPosition(now + 5); e.preventDefault(); }
    if (e.key === 'Home') { setBaPosition(0); e.preventDefault(); }
    if (e.key === 'End') { setBaPosition(100); e.preventDefault(); }
  });

  showBeforeAfter(0);
}

// ------------------------------------------------------------
// MINI PLAYER
// ------------------------------------------------------------
let currentStation = 1;

function getPlaylistId(url) {
  if (!url) return null;
  try { return new URL(url).searchParams.get('list') || null; } catch (e) { return null; }
}

function renderStationTabs() {
  const wrap = $('station-tabs');
  if (!wrap || typeof playlistStations === 'undefined') return;
  wrap.style.gridTemplateColumns = `repeat(${playlistStations.length}, minmax(0, 1fr))`;
  wrap.innerHTML = playlistStations.map((s, i) =>
    `<button type="button" class="station-btn" onclick="switchStation(${i + 1})">${esc(s.tab)}</button>`
  ).join('');
}

function setPlayerMissing(message) {
  const box = $('yt-video-box');
  box.classList.add('missing');
  box.innerHTML = `<div>${esc(message)}<br><br><a class="btn btn-pink btn-sm" href="${esc(playlistSearch.youtube)}" target="_blank" rel="noopener noreferrer">🔎 Search YouTube ↗</a></div>`;
}

function switchStation(stationNum) {
  const st = playlistStations[stationNum - 1];
  if (!st) return;
  currentStation = stationNum;

  document.querySelectorAll('.station-btn').forEach((b, i) => b.classList.toggle('active', i === stationNum - 1));
  $('station-badge').textContent = `STATION ${stationNum}`;
  $('playlist-title').textContent = st.title;

  const embedWrap = $('yt-embed-wrap');
  const musicWrap = $('yt-music-wrap');
  const hasId = !!getPlaylistId(st.url);

  if (st.type === 'link') {
    embedWrap.classList.add('hidden');
    musicWrap.classList.remove('hidden');

    const iframe = $('yt-inpage-player');
    if (iframe) iframe.src = 'about:blank';

    $('ytm-open-link').href = hasId ? st.url : playlistSearch.music;
    $('ytm-note').textContent = hasId
      ? "YouTube Music opens in a new tab."
      : 'No playlist link set yet. Paste yours into js/data.js (playlistStations).';
    return;
  }

  musicWrap.classList.add('hidden');
  embedWrap.classList.remove('hidden');
  const box = $('yt-video-box');

  if (!hasId) {
    setPlayerMissing('No playlist link yet. Paste a YouTube playlist link into js/data.js (playlistStations).');
    $('yt-open-link').href = playlistSearch.youtube;
    $('yt-open-link').textContent = 'Search YouTube for 2000s OPM ↗';
    return;
  }
  if (!$('yt-inpage-player')) {
    box.classList.remove('missing');
    box.innerHTML = '<iframe id="yt-inpage-player" class="w-full h-full" title="2000s soundtrack playlist" frameborder="0" referrerpolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>';
  }
  const embedUrl = `https://www.youtube.com/embed/videoseries?list=${encodeURIComponent(getPlaylistId(st.url))}`;
  const iframe = $('yt-inpage-player');
  if (iframe.getAttribute('src') !== embedUrl) iframe.src = embedUrl;
  $('yt-open-link').href = st.url;
  $('yt-open-link').textContent = 'Not playing? Open on YouTube ↗';
}

function togglePlayerPopup() {
  const pill = $('player-pill');
  const popup = $('player-popup');
  const opening = popup.classList.contains('hidden');

  popup.classList.toggle('hidden', !opening);
  pill.classList.toggle('hidden', opening);

  if (opening) switchStation(currentStation);
}

// ------------------------------------------------------------
// SOURCES SECTION (built from `sources` + `imageCredits` in data.js)
// ------------------------------------------------------------
function renderSources() {
  const wrap = $('sources-list');
  if (!wrap) return;
  const tag = era => era === 'both' ? '<span class="src-tag both">2000s + Today</span>'
    : `<span class="src-tag ${era === 'now' ? 'now' : 'then'}">${era === 'now' ? 'Today' : '2000s'}</span>`;
  wrap.innerHTML = exhibits.map(ex => `
    <article class="src-card" style="--c:${esc(ex.color)}">
      <div class="src-body">
        <h4><span aria-hidden="true">${esc(ex.icon)}</span> ${esc(ex.wing)}</h4>
        ${(ex.sources && ex.sources.length)
          ? `<ol>${ex.sources.map(s => `<li>${tag(s.era)} ${srcLinkHtml(s)}${s.note ? `<small>${esc(s.note)}</small>` : ''}</li>`).join('')}</ol>`
          : '<p class="src-empty">No sources added yet.</p>'}
      </div>
    </article>`).join('');

  const credits = (typeof imageCredits !== 'undefined' && Array.isArray(imageCredits)) ? imageCredits : [];
  const box = $('credits-wrap');
  if (box && credits.length) {
    $('credits-list').innerHTML = credits.map(c =>
      `<li>${esc(c.item || '')}${c.credit ? ' — ' + esc(c.credit) : ''}${c.url ? ` (<a href="${esc(c.url)}" target="_blank" rel="noopener noreferrer">link</a>)` : ''}</li>`).join('');
    box.classList.remove('hidden');
  }
}

// ------------------------------------------------------------
// MUSEUM PASSPORT (a stamp for every room, in both eras)
// ------------------------------------------------------------
const PASSPORT_KEY = 'ppc-passport-v1';

function loadPassport() {
  try {
    const raw = localStorage.getItem(PASSPORT_KEY);
    const d = raw && JSON.parse(raw);
    return (d && typeof d.stamps === 'object' && d.stamps) ? d.stamps : {};
  } catch (e) { return {}; }
}
let passportStamps = loadPassport();

function savePassport() {
  try { localStorage.setItem(PASSPORT_KEY, JSON.stringify({ stamps: passportStamps })); } catch (e) { /* ignore */ }
}
function hasStamp(id, era) { return !!passportStamps[id + ':' + era]; }
function passportTotal() { return exhibits.length * 2; }
function passportCount() {
  let n = 0;
  exhibits.forEach(ex => { ['then', 'now'].forEach(era => { if (hasStamp(ex.id, era)) n++; }); });
  return n;
}
function updatePassportBadge() {
  document.querySelectorAll('.pp-count').forEach(el => { el.textContent = passportCount() + '/' + passportTotal(); });
}

function stampVisit(id, era) {
  const eras = era === 'compare' ? ['then', 'now'] : [era];
  const fresh = eras.filter(e => !hasStamp(id, e));
  if (!fresh.length) return;
  const stamp = Date.now();
  fresh.forEach(e => { passportStamps[id + ':' + e] = stamp; });
  savePassport();
  updatePassportBadge();

  const ex = exhibits.find(x => x.id === id);
  const label = fresh.map(e => e === 'then' ? '2000s' : 'Today').join(' + ');
  const n = passportCount(), total = passportTotal();
  showToast(`🛂 New stamp: ${ex ? ex.wing : id} • ${label} (${n}/${total})`);
  if (n === total) {
    setTimeout(() => { showToast('🏅 Museum complete! You collected every stamp.', 4500); burstConfetti(); }, 2000);
  }
  if (passportIsOpen()) renderPassport();
}

function renderPassport() {
  const total = passportTotal(), n = passportCount();
  const pct = total ? Math.round((n / total) * 100) : 0;
  const slot = (ex, i, era) => {
    const got = passportStamps[ex.id + ':' + era];
    const when = got ? new Date(got).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : '';
    return `
      <button type="button" class="pp-stamp era-${era} ${got ? 'got' : ''}" onclick="passportGo(${i}, '${era}')"
              aria-label="${esc(ex.wing)}, ${era === 'then' ? '2000s' : 'Today'}: ${got ? 'stamp collected' : 'not visited yet'}">
        <span class="pp-ring">${got ? '✓' : '?'}</span>
        <small>${era === 'then' ? '2000s' : 'Today'}</small>
        ${got ? `<em>${esc(when)}</em>` : ''}
      </button>`;
  };
  $('passport-body').innerHTML = `
    <div class="pp-progress">
      <div class="pp-bar" role="progressbar" aria-valuemin="0" aria-valuemax="${total}" aria-valuenow="${n}"><i style="width:${pct}%"></i></div>
      <b>${n} / ${total} stamps</b>
    </div>
    ${n === total
      ? `<div class="pp-complete">🏅 Museum complete! You explored every room in both eras.</div>`
      : `<p class="pp-hint">Open each room in the <b>2000s</b> and <b>Today</b> tabs to collect stamps. The <b>Compare</b> tab gives you both at once. Tap a stamp to go there.</p>`}
    <div class="pp-grid">
      ${exhibits.map((ex, i) => `
        <div class="pp-room" style="--c:${esc(ex.color)}">
          <div class="pp-room-head"><span>${esc(ex.icon)}</span><b>${esc(ex.wing)}</b></div>
          <div class="pp-stamps">${slot(ex, i, 'then')}${slot(ex, i, 'now')}</div>
        </div>`).join('')}
    </div>
    <div class="pp-foot">
      <button type="button" class="btn btn-sm" onclick="resetPassport()">Reset passport</button>
      <span>Saved on this device only.</span>
    </div>`;
}

function openPassport() {
  lastFocus.pp = document.activeElement;
  enterLevel(1);
  renderPassport();
  $('passport-modal').classList.remove('hidden');
  lockScroll();
  focusPanel('passport-panel');
}
function hidePassport() {
  $('passport-modal').classList.add('hidden');
  unlockScrollIfIdle();
  restoreFocus('pp');
}
function closePassport() { leaveLevel(1, hidePassport); }

function passportGo(i, era) { hidePassport(); openRoom(i, era); }

function resetPassport() {
  if (window.confirm && !window.confirm('Reset your passport? All stamps will be removed.')) return;
  passportStamps = {};
  savePassport();
  updatePassportBadge();
  renderPassport();
  renderGallery();
  switchWing(currentTopic);
}

// ---------- Toast + confetti ----------
let toastTimer = null;
function showToast(message, ms) {
  const t = $('toast');
  if (!t) return;
  t.textContent = message;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), ms || 2800);
}

function burstConfetti() {
  if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const bits = ['🎉', '✨', '🏅', '⭐', '🎊', '💖'];
  for (let i = 0; i < 28; i++) {
    const s = document.createElement('span');
    s.className = 'confetti';
    s.textContent = bits[i % bits.length];
    s.style.left = (Math.random() * 100) + 'vw';
    s.style.animationDelay = (Math.random() * 0.6) + 's';
    s.style.fontSize = (1 + Math.random() * 1.2) + 'rem';
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 3600);
  }
}

// ------------------------------------------------------------
// MUSEUM FLOOR MAP (2000s Wing | Grand Lobby | Today Wing)
// ------------------------------------------------------------
let mapHere = null; // {id, era} when the map was opened from inside a room

function renderMap() {
  const doors = era => exhibits.map((ex, i) => {
    const got = hasStamp(ex.id, era);
    const here = mapHere && mapHere.id === ex.id && (mapHere.era === era || mapHere.era === 'compare');
    return `
      <button type="button" class="door door-${era} ${got ? 'visited' : ''} ${here ? 'here' : ''}" style="--c:${esc(ex.color)}"
              onclick="mapEnter(${i}, '${era}')"
              aria-label="Enter the ${esc(ex.wing)} room, ${era === 'then' ? '2000s' : 'Today'} wing${got ? ' (visited)' : ''}${here ? ' (you are here)' : ''}">
        ${here ? '<span class="you-are-here">📍 You are here</span>' : ''}
        <span class="door-icon">${esc(ex.icon)}</span>
        <span class="door-name">${esc(ex.wing)}</span>
        ${got ? '<span class="door-check">✓</span>' : ''}
      </button>`;
  }).join('');

  $('map-body').innerHTML = `
    <div class="floor">
      <section class="floor-wing fw-then" aria-label="The 2000s Wing">
        <h4>🕹️ The 2000s Wing <small>2000–2010</small></h4>
        <div class="floor-rooms">${doors('then')}</div>
      </section>

      <section class="floor-lobby ${mapHere ? '' : 'here'}" aria-label="Grand Lobby">
        ${mapHere ? '' : '<span class="you-are-here">📍 You are here</span>'}
        <div class="lobby-title">🏛️ Grand Lobby</div>
        <div class="lobby-links">
          <button type="button" class="btn btn-sm" onclick="mapOpenPassport()">🛂 Passport</button>
          <button type="button" class="btn btn-sm" onclick="mapGo('then-now')">↔ Then vs. Now</button>
          <button type="button" class="btn btn-sm" onclick="mapGo('sms')">📱 Nokia relic</button>
          <button type="button" class="btn btn-sm" onclick="mapGo('curators')">✨ Curators</button>
        </div>
      </section>

      <section class="floor-wing fw-now" aria-label="The Today Wing">
        <h4>📱 The Today Wing <small>2020s</small></h4>
        <div class="floor-rooms">${doors('now')}</div>
      </section>
    </div>
    <p class="map-legend">✓ visited &nbsp;•&nbsp; 📍 you are here &nbsp;•&nbsp; tap any door to walk in</p>`;
}

function openMap(here) {
  mapHere = (here && typeof here === 'object' && here.id) ? here : null;
  lastFocus.map = document.activeElement;
  enterLevel(1);
  renderMap();
  $('map-modal').classList.remove('hidden');
  lockScroll();
  focusPanel('map-panel');
}
function openMapFromRoom() {
  const here = { id: exhibits[currentRoom].id, era: roomEra };
  hideRoom();
  openMap(here);
}
function hideMap() {
  $('map-modal').classList.add('hidden');
  unlockScrollIfIdle();
  restoreFocus('map');
}
function closeMap() { leaveLevel(1, hideMap); }

function mapEnter(i, era) { hideMap(); openRoom(i, era); }
function mapOpenPassport() { hideMap(); openPassport(); }
function mapGo(sectionId) {
  closeMap();
  setTimeout(() => { const el = $(sectionId); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 160);
}

// ------------------------------------------------------------
// Start everything
// ------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  renderWingTabs();
  initGalleryEvents();
  applyEra(currentEra);
  setModernMode('chat');
  updatePassportBadge();
  renderCurators();
  renderSources();
  initBeforeAfter();
  renderStationTabs();
  addSwipe($('room-content'), nextRoom, prevRoom);
  addSwipe($('lightbox'), () => lightboxStep(1), () => lightboxStep(-1));
  addSwipe($('fs-window'), nextProfile, prevProfile);
  if (typeof smsDefault !== 'undefined') { $('sms-input').value = ''; updateSmsDisplay(smsDefault); }
  openRoomFromHash();
});
