// ------------------------------------------------------------
// Helpers
// ------------------------------------------------------------
const $ = id => document.getElementById(id);

// Escape text before putting it into HTML
function esc(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Profile helpers: fall back to the name if short/initials aren't set
function profShort(p) { return p.short || String(p.name || '?').trim().split(/\s+/)[0]; }
function profInitials(p) {
  if (p.initials) return p.initials;
  const w = String(p.name || '?').trim().split(/\s+/).filter(Boolean);
  return (w[0][0] + (w.length > 1 ? w[w.length - 1][0] : '')).toUpperCase();
}

// ------------------------------------------------------------
// GALLERY (cards are generated from `exhibits` in data.js)
// ------------------------------------------------------------
function renderWingTabs() {
  const wrap = $('wing-tabs');
  if (!wrap) return;
  wrap.innerHTML =
    `<button type="button" class="chip-btn tab-btn active" data-wing="all" onclick="switchWing('all')">All Wings</button>` +
    exhibits.map(ex =>
      `<button type="button" class="chip-btn tab-btn" data-wing="${esc(ex.id)}" onclick="switchWing('${esc(ex.id)}')">${esc(ex.icon)} ${esc(ex.wing)}</button>`
    ).join('');
}

function renderGallery() {
  const grid = $('gallery-grid');
  if (!grid) return;
  grid.innerHTML = exhibits.map((ex, i) => `
    <article class="exhibit-card reveal" tabindex="0" role="button" data-category="${esc(ex.id)}" data-index="${i}"
             style="--c:${esc(ex.color)}" aria-label="Enter the ${esc(ex.wing)} room: ${esc(ex.title)}">
      <div>
        <div class="card-media">
          <span class="card-emoji" aria-hidden="true">${esc(ex.icon)}</span>
          <img src="${esc(ex.image)}" alt="${esc(ex.alt || ex.badge)}" loading="lazy" onerror="this.remove()">
          <span class="card-badge">${esc(ex.badge)}</span>
        </div>
        <div class="card-body">
          <div class="flex items-center justify-between gap-2">
            <span class="domain">${esc(ex.domain)}</span>
            <span class="retro-tag">${esc(ex.tag)}</span>
          </div>
          <h4>${esc(ex.title)}</h4>
          <p class="blurb">${esc(ex.blurb)}</p>
          <div class="era-2000 era-block era-then"><span class="era-label">2000–2010 Decade</span>${esc(ex.then)}</div>
          <div class="era-now era-block era-present"><span class="era-label">Present Time</span>${esc(ex.now)}</div>
        </div>
      </div>
      <div class="card-foot">
        <span>Impact: <em>${esc(ex.impact)}</em></span>
        <span class="enter">Enter room →</span>
      </div>
    </article>`).join('');

  // Click / keyboard on a card opens its room
  grid.addEventListener('click', e => {
    const card = e.target.closest('.exhibit-card');
    if (card) openRoom(Number(card.dataset.index));
  });
  grid.addEventListener('keydown', e => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const card = e.target.closest('.exhibit-card');
    if (card) { e.preventDefault(); openRoom(Number(card.dataset.index)); }
  });

  // Fade cards in as they scroll into view
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

// Exhibition Wing Filtering
function switchWing(category) {
  document.querySelectorAll('.tab-btn').forEach(tab =>
    tab.classList.toggle('active', tab.getAttribute('data-wing') === category)
  );
  document.querySelectorAll('.exhibit-card').forEach(card =>
    card.classList.toggle('hidden', !(category === 'all' || card.getAttribute('data-category') === category))
  );
}

// Display Mode: Side-by-Side vs 2000s vs Present
function toggleEraView(mode) {
  const past = document.querySelectorAll('.exhibit-card .era-2000');
  const present = document.querySelectorAll('.exhibit-card .era-now');
  const btns = { split: $('view-split-btn'), '2000': $('view-2000-btn'), now: $('view-now-btn') };

  Object.keys(btns).forEach(key => btns[key].classList.toggle('active', key === mode));
  past.forEach(el => el.classList.toggle('hidden', mode === 'now'));
  present.forEach(el => el.classList.toggle('hidden', mode === '2000'));
}

// ------------------------------------------------------------
// DETAIL ROOMS
// ------------------------------------------------------------
let currentRoom = 0;

function roomIsOpen() {
  const m = $('room-modal');
  return m && !m.classList.contains('hidden');
}

function renderRoom(index) {
  const total = exhibits.length;
  currentRoom = (index + total) % total;
  const ex = exhibits[currentRoom];

  $('room-panel').style.setProperty('--c', ex.color);

  const curator = (typeof ex.curator === 'number' && friendsterProfiles[ex.curator]) ? friendsterProfiles[ex.curator] : null;

  const content = $('room-content');
  content.innerHTML = `
    <div class="room-hero">
      <span class="room-hero-emoji" aria-hidden="true">${esc(ex.icon)}</span>
      <img src="${esc(ex.image)}" alt="${esc(ex.alt || ex.badge)}" onerror="this.remove()">
      <div class="room-hero-shade"></div>
      <div class="room-hero-text">
        <span class="room-domain">${esc(ex.domain)}</span>
        <h2>${esc(ex.title)}</h2>
        <p>${esc(ex.blurb)}</p>
      </div>
    </div>
    <div class="room-body">
      <p class="room-intro">${esc(ex.intro)}</p>

      <div class="grid sm:grid-cols-2 gap-3">
        <div class="era-block era-then" style="margin:0"><span class="era-label">2000–2010 Decade</span>${esc(ex.then)}</div>
        <div class="era-block era-present" style="margin:0"><span class="era-label">Present Time</span>${esc(ex.now)}</div>
      </div>

      <h3 class="room-h">💡 Did you know?</h3>
      <ul class="fact-list">${ex.facts.map(f => `<li>${esc(f)}</li>`).join('')}</ul>

      <h3 class="room-h">🗂️ Artifacts in this room</h3>
      <div class="artifact-grid">
        ${ex.artifacts.map(a => `
          <div class="artifact">
            <span class="artifact-emoji">${esc(a.emoji)}</span>
            <div><b>${esc(a.name)}</b><p>${esc(a.note)}</p></div>
          </div>`).join('')}
      </div>

      <div class="impact-box">⭐ Impact: ${esc(ex.impact)}</div>

      ${curator ? `
        <div class="mt-5 text-center">
          <button type="button" class="btn btn-yellow" onclick="visitCurator(${ex.curator})">✨ Meet the curator: ${esc(profShort(curator))}</button>
        </div>` : ''}
    </div>`;
  content.scrollTop = 0;
  content.classList.remove('swap'); void content.offsetWidth; content.classList.add('swap');

  $('room-dots').innerHTML = exhibits.map((e, i) =>
    `<button type="button" class="room-dot ${i === currentRoom ? 'active' : ''}" onclick="renderRoom(${i})" title="${esc(e.wing)}" aria-label="Go to ${esc(e.wing)} room">${esc(e.icon)}</button>`
  ).join('');
  $('room-prev-label').textContent = exhibits[(currentRoom - 1 + total) % total].wing;
  $('room-next-label').textContent = exhibits[(currentRoom + 1) % total].wing;
  $('room-count').textContent = `Room ${currentRoom + 1} of ${total} • ${ex.wing}`;

  // Shareable link, e.g. .../#room-sports
  try { history.replaceState(null, '', '#room-' + ex.id); } catch (e) { /* ignore */ }
}

function openRoom(index) {
  renderRoom(typeof index === 'number' ? index : 0);
  $('room-modal').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeRoom() {
  $('room-modal').classList.add('hidden');
  document.body.style.overflow = '';
  try { history.replaceState(null, '', location.pathname + location.search); } catch (e) { /* ignore */ }
}

function nextRoom() { renderRoom(currentRoom + 1); }
function prevRoom() { renderRoom(currentRoom - 1); }

function visitCurator(profileIndex) {
  closeRoom();
  openFriendsterModal(profileIndex);
}

function openRoomFromHash() {
  const m = location.hash.match(/^#room-(.+)$/);
  if (!m) return;
  const i = exhibits.findIndex(e => e.id === m[1]);
  if (i >= 0) openRoom(i);
}

// ------------------------------------------------------------
// SMS SIMULATOR
// ------------------------------------------------------------
function setSmsText(text) {
  $('nokia-screen').textContent = text;
  $('sms-count').textContent = text.length;
}

function changeSms(key) {
  if (typeof smsData === 'undefined' || !smsData[key]) return;
  const text = smsData[key];
  $('sms-input').value = text.slice(0, 160);
  setSmsText(text);
}

function onSmsInput() {
  const text = $('sms-input').value;
  setSmsText(text || 'Type something…');
  $('sms-count').textContent = text.length;
}

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

  const friends = friendsterProfiles
    .map((f, i) => ({ f, i }))
    .filter(x => x.i !== currentProfile)
    .map(x => `
      <button type="button" class="fs-friend" onclick="showProfile(${x.i})" title="View ${esc(profShort(x.f))}'s profile">
        <span class="fs-avatar">${avatarHtml(x.f)}</span>
        <span>${esc(profShort(x.f))}</span>
      </button>`).join('');

  $('fs-body').innerHTML = `
    <div class="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
      <div class="fs-avatar">${avatarHtml(p)}</div>
      <div class="min-w-0 text-center sm:text-left">
        <h4 class="font-bold text-base text-blue-900 break-words">${esc(p.handle)}</h4>
        <p class="text-[11px] font-semibold text-slate-600">${esc(p.name)}</p>
        <p class="text-[11px] text-slate-500 italic mb-2">"${esc(p.quote)}"</p>
        <div class="text-[11px] space-y-0.5 text-slate-600">
          <p><strong>Status:</strong> ${esc(p.status)}</p>
          <p><strong>Member Since:</strong> ${esc(p.memberSince)}</p>
          <p><strong>Hometown:</strong> ${esc(p.hometown)}</p>
        </div>
      </div>
    </div>
    <div class="border border-blue-200 rounded p-3 bg-blue-50/50">
      <h5 class="font-bold text-blue-900 mb-1 border-b border-blue-200 pb-1">About Me</h5>
      <p class="text-[11px] text-slate-700 leading-relaxed mb-2">${esc(p.about)}</p>
      <div>${p.interests.map(t => `<span class="fs-chip">${esc(t)}</span>`).join('')}</div>
    </div>
    <div class="border border-blue-200 rounded p-3 bg-blue-50/50">
      <h5 class="font-bold text-blue-900 mb-2 border-b border-blue-200 pb-1">Testimonials (${p.testimonials.length})</h5>
      <div class="space-y-2">
        ${p.testimonials.map(t => `
          <div class="bg-white p-2 rounded border border-blue-100 text-[11px]">
            <span class="font-semibold text-blue-800">${esc(t.from)}:</span> "${esc(t.text)}"
          </div>`).join('')}
      </div>
    </div>
    <div class="border border-blue-200 rounded p-3 bg-blue-50/50">
      <h5 class="font-bold text-blue-900 mb-2 border-b border-blue-200 pb-1">Top Friends</h5>
      <div class="flex gap-3 flex-wrap">${friends}</div>
    </div>`;
  $('fs-body').scrollTop = 0;
  $('fs-counter').textContent = `Profile ${currentProfile + 1} of ${total}`;
}

function nextProfile() { showProfile(currentProfile + 1); }
function prevProfile() { showProfile(currentProfile - 1); }

function openFriendsterModal(index) {
  showProfile(typeof index === 'number' ? index : 0);
  $('friendster-modal').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeFriendsterModal() {
  $('friendster-modal').classList.add('hidden');
  document.body.style.overflow = '';
}

function renderCurators() {
  const grid = $('curator-grid');
  if (!grid) return;
  grid.innerHTML = friendsterProfiles.map((p, i) => `
    <div class="curator-card">
      <div class="fs-avatar">${avatarHtml(p)}</div>
      <h4 class="font-extrabold text-sm">${esc(p.name)}</h4>
      ${p.role ? `<p class="text-[11px] text-[var(--muted)] mt-1">${esc(p.role)}</p>` : ''}
      <button type="button" onclick="openFriendsterModal(${i})" class="btn btn-yellow btn-sm mt-3">✨ View Friendster Profile</button>
    </div>`).join('');
}

// Keyboard: Esc closes, arrow keys move between rooms / profiles
document.addEventListener('keydown', e => {
  const fsOpen = $('friendster-modal') && !$('friendster-modal').classList.contains('hidden');
  if (fsOpen) {
    if (e.key === 'Escape') closeFriendsterModal();
    if (e.key === 'ArrowRight') nextProfile();
    if (e.key === 'ArrowLeft') prevProfile();
    return;
  }
  if (roomIsOpen()) {
    if (e.key === 'Escape') closeRoom();
    if (e.key === 'ArrowRight') nextRoom();
    if (e.key === 'ArrowLeft') prevRoom();
  }
});

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
  $('ba-after').innerHTML = baLayerHtml(pair.after);
  $('ba-title').textContent = pair.title;
  $('ba-caption').textContent = pair.caption;
  document.querySelectorAll('#ba-tabs button').forEach((btn, i) => btn.classList.toggle('active', i === index));
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
// MINI PLAYER (stations come from `playlistStations` in data.js)
//   type "embed" -> plays inside the page
//   type "link"  -> opens in a new tab (YouTube Music)
// ------------------------------------------------------------
let currentStation = 1; // 1-based

// Pull the playlist ID out of any YouTube / YouTube Music link
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

    // Stop the embedded video while on a link station
    const iframe = $('yt-inpage-player');
    if (iframe) iframe.src = 'about:blank';

    $('ytm-open-link').href = hasId ? st.url : playlistSearch.music;
    $('ytm-note').textContent = hasId
      ? "YouTube Music can't be embedded, so it opens in a new tab."
      : 'No playlist link set yet. Paste yours into js/data.js (playlistStations).';
    return;
  }

  // type "embed"
  musicWrap.classList.add('hidden');
  embedWrap.classList.remove('hidden');
  const box = $('yt-video-box');

  if (!hasId) {
    setPlayerMissing('No playlist link yet. Paste a YouTube playlist link into js/data.js (playlistStations).');
    $('yt-open-link').href = playlistSearch.youtube;
    $('yt-open-link').textContent = 'Search YouTube for 2000s OPM ↗';
    return;
  }
  // Rebuild the iframe if the "missing" message replaced it
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

  // Load the player only when it's first opened (faster page load)
  if (opening) switchStation(currentStation);
}

// ------------------------------------------------------------
// Start everything
// ------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  renderWingTabs();
  renderGallery();
  renderCurators();
  initBeforeAfter();
  renderStationTabs();
  if (typeof smsDefault !== 'undefined') { $('sms-input').value = ''; setSmsText(smsDefault); }
  openRoomFromHash();
});
