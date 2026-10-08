```
// Tab filtering across exhibition wings
function switchWing(category) {
  const cards = document.querySelectorAll('.exhibit-card');
  const tabs = document.querySelectorAll('.tab-btn');
  
  tabs.forEach(tab =&gt; {
    if (tab.getAttribute('data-wing') === category) {
      tab.classList.add('bg-museum-accent', 'text-black');
      tab.classList.remove('bg-slate-800', 'text-slate-300');
    } else {
      tab.classList.remove('bg-museum-accent', 'text-black');
      tab.classList.add('bg-slate-800', 'text-slate-300');
    }
  });

  cards.forEach(card =&gt; {
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

  Object.keys(btns).forEach(key =&gt; {
    btns[key].className = 'px-3 py-1 rounded-lg text-slate-400 hover:text-white';
  });
  btns[mode].className = 'px-3 py-1 rounded-lg bg-slate-800 text-white font-semibold';

  if (mode === 'split') {
    pastBlocks.forEach(el =&gt; el.classList.remove('hidden'));
    presentBlocks.forEach(el =&gt; el.classList.remove('hidden'));
  } else if (mode === '2000') {
    pastBlocks.forEach(el =&gt; el.classList.remove('hidden'));
    presentBlocks.forEach(el =&gt; el.classList.add('hidden'));
  } else if (mode === 'now') {
    pastBlocks.forEach(el =&gt; el.classList.add('hidden'));
    presentBlocks.forEach(el =&gt; el.classList.remove('hidden'));
  }
}

// Nokia SMS Screen Update
function changeSms(key) {
  if (smsData[key]) {
    document.getElementById('nokia-screen').innerText = smsData[key];
  }
}

// Friendster Modal Controls
function openFriendsterModal() {
  document.getElementById('friendster-modal').classList.remove('hidden');
}

function closeFriendsterModal() {
  document.getElementById('friendster-modal').classList.add('hidden');
}

// Music Player Popup Launcher Toggle
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
  const station = museumStations[stationNum];
  if (!station) return;

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

```
