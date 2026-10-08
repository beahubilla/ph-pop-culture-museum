// ------------------------------------------------------------
// Small helper: escape text before putting it into HTML
// ------------------------------------------------------------
function esc(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Exhibition Wing Filtering
function switchWing(category) {
  const cards = document.querySelectorAll('.exhibit-card');
  const tabs = document.querySelectorAll('.tab-btn');

  tabs.forEach(tab => {
    if (tab.getAttribute('data-wing') === category) {
      tab.classList.add('bg-museum-accent', 'text-black');
      tab.classList.remove('bg-slate-800', 'text-slate-300');
    } else {
      tab.classList.remove('bg-museum-accent', 'text-black');
      tab.classList.add('bg-slate-800', 'text-slate-300');
    }
  });

  cards.forEach(card => {
    if (category === 'all' || card.getAttribute('data-category') === category) {
      card.classList.remove('hidden');
    } else {
      card.classList.add('hidden');
    }
  });
}

// Display Mode: Side-by-Side vs 2000s vs Present
function toggleEraView(mode) {
  const pastBlocks = document.querySelectorAll('.era-2000');
  const presentBlocks = document.querySelectorAll('.era-now');
  const btns = {
    split: document.getElementById('view-split-btn'),
    '2000': document.getElementById('view-2000-btn'),
    now: document.getElementById('view-now-btn')
  };

  Object.keys(btns).forEach(key => {
    btns[key].className = 'px-3 py-1 rounded-lg text-slate-400 hover:text-white';
  });
  btns[mode].className = 'px-3 py-1 rounded-lg bg-slate-800 text-white font-semibold';

  if (mode === 'split') {
    pastBlocks.forEach(el => el.classList.remove('hidden'));
    presentBlocks.forEach(el => el.classList.remove('hidden'));
  } else if (mode === '2000') {
    pastBlocks.forEach(el => el.classList.remove('hidden'));
    presentBlocks.forEach(el => el.classList.add('hidden'));
  } else if (mode === 'now') {
    pastBlocks.forEach(el => el.classList.add('hidden'));
    presentBlocks.forEach(el => el.classList.remove('hidden'));
  }
}

// Nokia SMS Screen Display
function changeSms(key) {
  if (typeof smsData !== 'undefined' && smsData[key]) {
    document.getElementById('nokia-screen').innerText = smsData[key];
  }
}

// ------------------------------------------------------------
// FRIENDSTER PROFILES (multi-profile modal with navigation)
// ------------------------------------------------------------
let currentProfile = 0;

function avatarHtml(p) {
  // Initials always render; the photo sits on top if the file exists.
  const img = p.avatar
    ? `<img src="${esc(p.avatar)}" alt="${esc(p.short)}'s profile photo" onerror="this.remove()">`
    : '';
  return `<span>${esc(p.initials)}</span>${img}`;
}

function showProfile(index) {
  if (typeof friendsterProfiles === 'undefined' || !friendsterProfiles.length) return;
  const total = friendsterProfiles.length;
  currentProfile = (index + total) % total; // wraps around
  const p = friendsterProfiles[currentProfile];

  // Tabs
  document.getElementById('fs-tabs').innerHTML = friendsterProfiles.map((f, i) =>
    `<button type="button" class="fs-tab ${i === currentProfile ? 'active' : ''}" onclick="showProfile(${i})">${esc(f.short)}</button>`
  ).join('');

  // Top friends = the other curators (click to jump to their profile)
  const friends = friendsterProfiles
    .map((f, i) => ({ f, i }))
    .filter(x => x.i !== currentProfile)
    .map(x => `
      <button type="button" class="fs-friend" onclick="showProfile(${x.i})" title="View ${esc(x.f.short)}'s profile">
        <span class="fs-avatar">${avatarHtml(x.f)}</span>
        <span>${esc(x.f.short)}</span>
      </button>`).join('');

  // Profile body
  document.getElementById('fs-body').innerHTML = `
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
    </div>
  `;
  document.getElementById('fs-body').scrollTop = 0;
  document.getElementById('fs-counter').textContent = `Profile ${currentProfile + 1} of ${total}`;
}

function nextProfile() { showProfile(currentProfile + 1); }
function prevProfile() { showProfile(currentProfile - 1); }

function openFriendsterModal(index) {
  showProfile(typeof index === 'number' ? index : 0);
  document.getElementById('friendster-modal').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeFriendsterModal() {
  document.getElementById('friendster-modal').classList.add('hidden');
  document.body.style.overflow = '';
}

// Keyboard: Esc closes, arrow keys move between profiles
document.addEventListener('keydown', e => {
  const modal = document.getElementById('friendster-modal');
  if (!modal || modal.classList.contains('hidden')) return;
  if (e.key === 'Escape') closeFriendsterModal();
  if (e.key === 'ArrowRight') nextProfile();
  if (e.key === 'ArrowLeft') prevProfile();
});

// "Meet the Curators" cards
function renderCurators() {
  const grid = document.getElementById('curator-grid');
  if (!grid || typeof friendsterProfiles === 'undefined') return;
  grid.innerHTML = friendsterProfiles.map((p, i) => `
    <div class="curator-card">
      <div class="fs-avatar">${avatarHtml(p)}</div>
      <h4 class="font-bold text-white text-sm">${esc(p.name)}</h4>
      <p class="text-[11px] text-slate-400 mt-1 mb-3">${esc(p.role)}</p>
      <button type="button" onclick="openFriendsterModal(${i})"
        class="px-3 py-1.5 rounded-lg bg-orange-500/10 border border-orange-500/30 text-orange-400 hover:bg-orange-500/20 transition text-xs font-semibold">
        ✨ View Friendster Profile
      </button>
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
  const slider = document.getElementById('ba-slider');
  const p = Math.max(0, Math.min(100, percent));
  slider.style.setProperty('--pos', p + '%');
  slider.setAttribute('aria-valuenow', Math.round(p));
}

function showBeforeAfter(index) {
  const pair = beforeAfterPairs[index];
  if (!pair) return;

  document.getElementById('ba-before').innerHTML = baLayerHtml(pair.before);
  document.getElementById('ba-after').innerHTML = baLayerHtml(pair.after);
  document.getElementById('ba-title').textContent = pair.title;
  document.getElementById('ba-caption').textContent = pair.caption;

  document.querySelectorAll('#ba-tabs button').forEach((btn, i) => {
    btn.className = i === index
      ? 'px-4 py-2 rounded-lg text-xs font-semibold bg-museum-accent text-black transition'
      : 'px-4 py-2 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700 transition';
  });
  setBaPosition(50);
}

function initBeforeAfter() {
  const slider = document.getElementById('ba-slider');
  const tabs = document.getElementById('ba-tabs');
  if (!slider || typeof beforeAfterPairs === 'undefined' || !beforeAfterPairs.length) return;

  tabs.innerHTML = beforeAfterPairs.map((pair, i) =>
    `<button type="button" onclick="showBeforeAfter(${i})">${esc(pair.tab)}</button>`
  ).join('');

  // Drag with mouse / finger
  let dragging = false;
  const moveTo = clientX => {
    const rect = slider.getBoundingClientRect();
    setBaPosition(((clientX - rect.left) / rect.width) * 100);
  };
  slider.addEventListener('pointerdown', e => {
    dragging = true;
    slider.setPointerCapture(e.pointerId);
    moveTo(e.clientX);
  });
  slider.addEventListener('pointermove', e => { if (dragging) moveTo(e.clientX); });
  ['pointerup', 'pointercancel'].forEach(evt =>
    slider.addEventListener(evt, () => { dragging = false; })
  );

  // Keyboard accessibility
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
// Winamp Mini Pill / Popup Toggle
// ------------------------------------------------------------
function togglePlayerPopup() {
  const pill = document.getElementById('player-pill');
  const popup = document.getElementById('player-popup');

  if (popup.classList.contains('hidden')) {
    popup.classList.remove('hidden');
    pill.classList.add('hidden');
  } else {
    popup.classList.add('hidden');
    pill.classList.remove('hidden');
  }
}

// YouTube Music Station Switcher
function switchStation(stationNum) {
  if (typeof museumStations === 'undefined' || !museumStations[stationNum]) return;
  const station = museumStations[stationNum];

  const iframe = document.getElementById('yt-inpage-player');
  const badge = document.getElementById('station-badge');
  const title = document.getElementById('playlist-title');
  const btn1 = document.getElementById('btn-station-1');
  const btn2 = document.getElementById('btn-station-2');

  iframe.src = station.embedUrl;
  badge.innerText = `STATION ${stationNum}`;
  title.innerText = station.title;

  if (stationNum === 1) {
    btn1.className = 'py-1 px-1.5 rounded-lg bg-slate-800 text-white font-semibold border border-slate-600 transition text-center truncate';
    btn2.className = 'py-1 px-1.5 rounded-lg bg-slate-900 text-slate-400 font-semibold border border-slate-800 hover:bg-slate-800 transition text-center truncate';
  } else {
    btn2.className = 'py-1 px-1.5 rounded-lg bg-slate-800 text-white font-semibold border border-slate-600 transition text-center truncate';
    btn1.className = 'py-1 px-1.5 rounded-lg bg-slate-900 text-slate-400 font-semibold border border-slate-800 hover:bg-slate-800 transition text-center truncate';
  }
}

// ------------------------------------------------------------
// Start everything once the page is ready
// ------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  renderCurators();
  initBeforeAfter();
});
