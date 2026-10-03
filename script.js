'use strict';
const $ = id => document.getElementById(id);
const fmt = n => 'Rs ' + n.toLocaleString('en-PK');

const PRODUCTS = [
  {
    id: 1,
    name: 'Aurora Pro Headphones',
    type: 'headphones',
    price: 24999,
    imgs: [
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSofF4mxwbKQSXbLpSMnTgB1hTJkBpNB1awDTVY6ByHTQ&s',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbcY0hdQxcnqSzaeRbhD4n6Wb_cyRDRnZYl7OgS4ZQNyVyWt0J8njSwmM&s=10',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTK6Mj-snBO1fD100DqHA9cbZ8Om5OJBPiQ4EQT_lUJ_8uNZmb0bxZtkBut&s=10'
    ],
    localImgs: [
      'images/aurora-1.jpg',
      'images/aurora-2.jpg',
      'images/aurora-3.jpg'
    ],
    desc: 'Active noise cancelling, 40-hour battery and studio-tuned drivers for all-day listening.'
  },
  {
    id: 2,
    name: 'Chrono Smartwatch',
    type: 'watch',
    price: 32999,
    imgs: [
      'https://www.greenlion.net/web/image/product.product/12014/image_1024/%5BGNCRNPSWBK%5D%20Green%20Lion%20Chrono%20Pro%20Smart%20Watch%20%28%E2%80%8BBlack%29?unique=8e68a83',
      'https://png.pngtree.com/png-vector/20260529/ourmid/pngtree-smartwatch-blue-strap-digital-display-time-png-image_19435006.webp',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTT5D0VKiwboM4MyTabAQSEirzFAV_EE-OsipXNBWzGVvMIrWDf876GhG0&s=10'
    ],
    localImgs: [
      'images/watch-1.webp',
      'images/watch-2.webp',
      'images/watch-3.jpg'
    ],
    desc: 'AMOLED display, heart-rate tracking, GPS and a sapphire-glass face in a slim aluminium case.'
  },
  {
    id: 3,
    name: 'Orbit Smart Speaker',
    type: 'speaker',
    price: 15999,
    imgs: [
      'https://m.media-amazon.com/images/I/61mQEw77sTS.jpg',
      'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcTpJLgkagwAQ2IKccWCvs99-2ZIqKkmWw8puFNS0lRs5oZv1zoQ',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcToMB6EaOTwhT30uykOkjGJHhzhhY4oZD_2AvC-oaGZcfLWNqfA'
    ],
    localImgs: [
      'images/speaker-2.jpg',
      'images/speaker-3.jpg',
      'images/speaker-1.jpg'
    ],
    desc: '360-degree room-filling sound with deep bass, voice assistant and 12-hour wireless playback.'
  }
];
const FREE_COLORS = [{n:'Midnight',c:'#1e293b'},{n:'Ocean',c:'#2563eb'},{n:'Coral',c:'#f43f5e'}];
const PREMIUM_COLORS = [{n:'Gold',c:'#d4a017'},{n:'Rose Gold',c:'#e0a899'},{n:'Aurora',c:'#8b5cf6'}];
const VARIANTS = [{n:'Standard',add:0},{n:'Pro (+Rs 5,000)',add:5000},{n:'Max (+Rs 10,000)',add:10000}];

const state = {premium:localStorage.getItem('techifyPremium')==='1', product:null, view:0, color:FREE_COLORS[0], premiumColor:null, variant:0, engraving:'', foil:false, cart:[]};

function handleImgError(img, p, idx) {
  if (p && p.localImgs && p.localImgs[idx] && !img.dataset.failedLocal) {
    img.dataset.failedLocal = '1';
    img.src = p.localImgs[idx];
    return;
  }
  if (p) {
    const parent = img.parentElement;
    if (parent && parent.classList.contains('card-img-wrapper')) {
      img.replaceWith(Object.assign(document.createElement('div'),{innerHTML:productSVG(p.type,'#2563eb',false),style:'padding:2rem;height:100%'}));
    }
  }
}

/* ---------- SVG product illustrations (recolour with state) ---------- */
function productSVG(type, color, premium) {
  const dark = 'rgba(0,0,0,.28)', shine = premium ? '<path d="M30 40 L60 20" stroke="#fff" stroke-opacity=".7" stroke-width="3" stroke-linecap="round"/>' : '';
  const art = {
    headphones: `<path d="M40 120 C40 40 160 40 160 120" fill="none" stroke="${color}" stroke-width="12" stroke-linecap="round"/>
      <rect x="26" y="108" width="36" height="64" rx="16" fill="${color}"/><rect x="138" y="108" width="36" height="64" rx="16" fill="${color}"/>
      <rect x="26" y="108" width="36" height="64" rx="16" fill="${dark}" transform="translate(8 0) scale(.6 1)"/><rect x="138" y="108" width="36" height="64" rx="16" fill="${dark}" transform="translate(56 0) scale(.6 1)"/>`,
    watch: `<rect x="72" y="10" width="56" height="50" rx="10" fill="${dark}"/><rect x="72" y="140" width="56" height="50" rx="10" fill="${dark}"/>
      <rect x="52" y="52" width="96" height="96" rx="26" fill="${color}"/><rect x="62" y="62" width="76" height="76" rx="18" fill="#0b1220"/>
      <circle cx="100" cy="100" r="3" fill="#fff"/><path d="M100 100V78M100 100l16 8" stroke="#fff" stroke-width="3" stroke-linecap="round"/><rect x="148" y="86" width="6" height="22" rx="3" fill="${color}"/>`,
    speaker: `<rect x="50" y="30" width="100" height="140" rx="30" fill="${color}"/><circle cx="100" cy="72" r="16" fill="${dark}"/>
      <circle cx="100" cy="125" r="30" fill="${dark}"/><circle cx="100" cy="125" r="18" fill="#0b1220"/><circle cx="100" cy="125" r="6" fill="${color}"/>`
  };
  return `<svg viewBox="0 0 200 200" role="img" aria-label="${type} preview">${art[type]}${shine}</svg>`;
}

/* ---------- Product Videos (Local with Online Fallback) ---------- */
const VIDEOS = {
  headphones: {
    src: 'videos/headphones.mp4',
    remoteSrc: 'https://archive.org/download/gstvilv-Airpods_Commercial/Airpods_Commercial.mp4',
    title: 'Aurora Pro Acoustic Showcase',
    chapters: [
      {at:0, t:'Acoustic Engineering', d:'Studio-tuned 40mm dynamic drivers.'},
      {at:0.25, t:'Adaptive ANC', d:'Noise cancellation tailored to your surroundings.'},
      {at:0.55, t:'Ergonomic Comfort', d:'Memory foam ear cushions and lightweight headband.'},
      {at:0.80, t:'Battery & Fast Charge', d:'Up to 40 hours of playback with USB-C quick charge.'}
    ]
  },
  watch: {
    src: 'videos/smartwatch.mp4',
    remoteSrc: 'https://archive.org/download/youtube-mg3r72bjI10/mg3r72bjI10.mp4',
    title: 'Chrono Pro Smartwatch Showcase',
    chapters: [
      {at:0, t:'Precision Craftsmanship', d:'Sleek aluminium case with sapphire crystal.'},
      {at:0.25, t:'AMOLED Display', d:'Always-on vibrant display with custom watch faces.'},
      {at:0.55, t:'Quick-Swap Straps', d:'Effortlessly change bands to match your style.'},
      {at:0.80, t:'Health & Fitness Suite', d:'Continuous heart-rate, sleep, and GPS tracking.'}
    ]
  },
  speaker: {
    src: 'videos/speaker.mp4',
    remoteSrc: 'https://archive.org/download/youtube-jNBxMA8iD5Y/jNBxMA8iD5Y.mp4',
    title: 'Orbit 360° Sound Showcase',
    chapters: [
      {at:0, t:'360° Omnidirectional Audio', d:'Fills any room with balanced, immersive sound.'},
      {at:0.25, t:'Deep Resonance Bass', d:'Custom passive radiators for punchy low ends.'},
      {at:0.55, t:'Ambient Atmosphere', d:'Mood lighting and multi-room wireless synchronization.'},
      {at:0.80, t:'All-Day Battery', d:'12-hour portable playback with IPX4 splash resistance.'}
    ]
  }
};

/* ---------- Gallery with Embedded Videos in Each Listing ---------- */
function renderGallery() {
  $('product-grid').innerHTML = PRODUCTS.map(p => {
    const vcfg = VIDEOS[p.type] || {};
    return `
    <article class="product-card" data-id="${p.id}" tabindex="0">
      <div class="card-media-wrapper">
        <div class="media-tabs" onclick="event.stopPropagation()">
          <button type="button" class="media-tab active" data-target="photo" title="View product photos">📷 Photo</button>
          <button type="button" class="media-tab" data-target="video" title="Watch product video">🎬 Video</button>
        </div>
        <div class="card-img-wrapper media-view" data-view="photo">
          <img src="${p.imgs[0]}" alt="${p.name}" loading="lazy" onerror="handleImgError(this, PRODUCTS.find(x => x.id === ${p.id}), 0)">
        </div>
        <div class="card-video-wrapper media-view hidden" data-view="video">
          <video class="listing-video" src="${vcfg.src}" poster="${p.imgs[0]}" preload="metadata" playsinline loop muted></video>
          <button type="button" class="listing-video-play-btn" aria-label="Play video">▶</button>
          <div class="listing-video-controls" onclick="event.stopPropagation()">
            <button type="button" class="listing-mute-btn" title="Toggle sound" aria-label="Toggle mute">🔇</button>
            <span class="listing-video-tag">Showcase</span>
          </div>
        </div>
      </div>
      <div class="card-content">
        <h3>${p.name}</h3>
        <div class="price">${fmt(p.price)}</div>
        <p>${p.desc}</p>
        <div class="card-actions" onclick="event.stopPropagation()">
          <button class="btn-primary" type="button" onclick="openConfigurator(${p.id})">Customize</button>
          <button class="btn-secondary btn-watch-video" type="button" data-id="${p.id}">🎬 Watch Video</button>
        </div>
      </div>
    </article>`;
  }).join('');

  document.querySelectorAll('.product-card').forEach(card => {
    const id = +card.dataset.id;
    card.addEventListener('click', e => {
      if (e.target.closest('.media-tabs') || e.target.closest('.card-actions') || e.target.closest('.listing-video-controls') || e.target.closest('.listing-video-play-btn')) return;
      openConfigurator(id);
    });
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.target.closest('button')) openConfigurator(id);
    });

    const photoView = card.querySelector('.media-view[data-view="photo"]');
    const videoView = card.querySelector('.media-view[data-view="video"]');
    const video = card.querySelector('.listing-video');
    const playBtn = card.querySelector('.listing-video-play-btn');
    const muteBtn = card.querySelector('.listing-mute-btn');
    const tabs = card.querySelectorAll('.media-tab');
    const watchBtn = card.querySelector('.btn-watch-video');

    const p = PRODUCTS.find(x => x.id === id);
    const vcfg = VIDEOS[p?.type];
    if (video && vcfg) {
      video.onerror = () => {
        if (video.src !== vcfg.remoteSrc) {
          video.src = vcfg.remoteSrc;
          video.load();
        }
      };
    }

    const switchTo = target => {
      tabs.forEach(tab => tab.classList.toggle('active', tab.dataset.target === target));
      if (target === 'video') {
        photoView.classList.add('hidden');
        videoView.classList.remove('hidden');
        video.play().then(() => {
          videoView.classList.add('playing');
        }).catch(() => {});
      } else {
        video.pause();
        videoView.classList.remove('playing');
        videoView.classList.add('hidden');
        photoView.classList.remove('hidden');
      }
    };

    tabs.forEach(tab => {
      tab.addEventListener('click', e => {
        e.stopPropagation();
        switchTo(tab.dataset.target);
      });
    });

    if (watchBtn) {
      watchBtn.addEventListener('click', e => {
        e.stopPropagation();
        switchTo('video');
      });
    }

    if (playBtn) {
      playBtn.addEventListener('click', e => {
        e.stopPropagation();
        if (video.paused) {
          video.play();
          videoView.classList.add('playing');
        } else {
          video.pause();
          videoView.classList.remove('playing');
        }
      });
    }

    if (video) {
      video.addEventListener('click', e => {
        e.stopPropagation();
        if (video.paused) {
          video.play();
          videoView.classList.add('playing');
        } else {
          video.pause();
          videoView.classList.remove('playing');
        }
      });
      video.addEventListener('play', () => videoView.classList.add('playing'));
      video.addEventListener('pause', () => videoView.classList.remove('playing'));
    }

    if (muteBtn) {
      muteBtn.addEventListener('click', e => {
        e.stopPropagation();
        video.muted = !video.muted;
        muteBtn.textContent = video.muted ? '🔇' : '🔊';
      });
    }
  });
}
function showView(id) {
  document.querySelectorAll('video').forEach(v => {
    if (v.id !== 'pv' || id !== 'configurator-view') v.pause();
  });
  document.querySelectorAll('.view-section').forEach(v => v.classList.toggle('active', v.id === id));
  window.scrollTo({top:0, behavior:'smooth'});
}

/* ---------- Configurator ---------- */
function openConfigurator(id) {
  state.product = PRODUCTS.find(p => p.id === id);
  $('config-product-name').textContent = state.product.name;
  $('config-product-desc').textContent = state.product.desc;
  $('favorite-btn').classList.remove('active');
  state.view = 0;
  state.color = FREE_COLORS[0];
  state.premiumColor = null;
  buildThumbs();
  setupPlayer(state.product);
  resetCustomization();
  showView('configurator-view');
}
function buildThumbs() {
  const p = state.product;
  const labels = ['Midnight', 'Ocean', 'Coral'];
  $('thumbs').innerHTML = p.imgs.map((u, i) => `
    <button type="button" class="thumb" data-v="${i}" aria-label="${p.name} - ${labels[i]}">
      <img src="${u}" alt="${labels[i]}" onerror="handleImgError(this, PRODUCTS.find(x => x.id === ${p.id}), ${i})">
      <span class="thumb-badge">${labels[i]}</span>
    </button>`).join('') + `
    <button type="button" class="thumb thumb-vector" data-v="svg" aria-label="3D Vector customizer view">
      ${productSVG(p.type, state.color.c, false)}
      <span class="thumb-badge">Vector</span>
    </button>`;
}
function renderSwatches() {
  const make = (list, premium) => list.map((o, i) =>
    `<button type="button" class="color-btn ${premium && !state.premium ? 'locked' : ''}" data-premium="${premium}" data-i="${i}" title="${o.n}" aria-label="${o.n}${premium ? ' (premium)' : ''}" style="background:${o.c}"></button>`).join('');
  $('color-options-container').innerHTML = make(FREE_COLORS, false);
  $('premium-options-container').innerHTML = make(PREMIUM_COLORS, true);
  $('variant-select').innerHTML = VARIANTS.map((v, i) => `<option value="${i}">${v.n}</option>`).join('');
}
function updatePreview() {
  const p = state.product; if (!p) return;
  const active = state.premiumColor || state.color;
  $('preview-art').innerHTML = productSVG(p.type, active.c, !!state.premiumColor);
  $('preview-art').classList.toggle('shimmer', !!state.premiumColor);
  const isSvg = state.view === 'svg', ph = $('preview-photo');
  $('preview-art').classList.toggle('hidden', !isSvg);
  ph.classList.toggle('hidden', isSvg);
  if (!isSvg) {
    const idx = typeof state.view === 'number' ? state.view : 0;
    ph.alt = `${p.name} in ${FREE_COLORS[idx]?.n || 'color'}`;
    ph.onerror = () => handleImgError(ph, p, idx);
    ph.src = p.imgs[idx];
  }
  $('seal').style.color = active.c;
  document.querySelectorAll('.thumb').forEach(t => t.classList.toggle('on', t.dataset.v === String(state.view)));
  const st = document.querySelector('.thumb[data-v="svg"]');
  if (st) st.innerHTML = productSVG(p.type, active.c, !!state.premiumColor) + '<span class="thumb-badge">Vector</span>';
  $('color-label').textContent = state.premiumColor ? 'None' : state.color.n;
  $('premium-color-label').textContent = state.premiumColor ? state.premiumColor.n : 'None';
  $('engraving-overlay').textContent = state.engraving;
  $('engraving-overlay').classList.toggle('foil', state.foil && state.premium);
  $('config-product-price').textContent = fmt(p.price + VARIANTS[state.variant].add);
  document.querySelectorAll('.color-btn').forEach(b => {
    const isPrem = b.dataset.premium === 'true';
    const list = isPrem ? PREMIUM_COLORS : FREE_COLORS;
    const sel = isPrem ? state.premiumColor : (state.premiumColor ? null : state.color);
    b.classList.toggle('selected', sel === list[b.dataset.i]);
    b.classList.toggle('locked', isPrem && !state.premium);
  });
}
function showLock() {
  const m = $('premium-lock-msg'); m.classList.remove('hidden');
  m.style.animation = 'none'; void m.offsetWidth; m.style.animation = '';
}
function resetCustomization() {
  Object.assign(state, {color:FREE_COLORS[0], premiumColor:null, view:0, variant:0, engraving:'', foil:false});
  renderSwatches();
  $('engraving-input').value = ''; $('foil-toggle').checked = false;
  $('variant-select').value = 0; $('char-count').textContent = 0;
  $('char-counter').classList.remove('warning'); $('premium-lock-msg').classList.add('hidden');
  $('last-added').textContent = '';
  updatePreview();
}
function wireConfigurator() {
  document.addEventListener('click', e => {
    const b = e.target.closest('.color-btn'); if (!b) return;
    if (b.dataset.premium === 'true') {
      if (!state.premium) return showLock();
      state.premiumColor = PREMIUM_COLORS[b.dataset.i];
      state.view = 'svg';
    } else {
      const idx = +b.dataset.i;
      state.color = FREE_COLORS[idx];
      state.premiumColor = null;
      state.view = idx;
    }
    updatePreview();
  });
  $('thumbs').addEventListener('click', e => {
    const t = e.target.closest('.thumb'); if (!t) return;
    if (t.dataset.v === 'svg') {
      state.view = 'svg';
    } else {
      const idx = +t.dataset.v;
      state.view = idx;
      state.color = FREE_COLORS[idx];
      state.premiumColor = null;
    }
    updatePreview();
  });
  $('variant-select').addEventListener('change', e => { state.variant = +e.target.value; updatePreview(); });
  $('engraving-input').addEventListener('input', e => {
    state.engraving = e.target.value;
    $('char-count').textContent = e.target.value.length;
    $('char-counter').classList.toggle('warning', e.target.value.length >= 18);
    updatePreview();
  });
  $('foil-toggle').addEventListener('change', e => {
    if (!state.premium) { e.target.checked = false; return showLock(); }
    state.foil = e.target.checked; updatePreview();
  });
  $('btn-reset').addEventListener('click', resetCustomization);
  $('customization-form').addEventListener('submit', e => e.preventDefault());
  $('back-to-gallery').addEventListener('click', () => { $('pv').pause(); showView('gallery-view'); });
  $('logo').addEventListener('click', e => { e.preventDefault(); showView('gallery-view'); });

  // Copy / cut protection
  const desc = $('config-product-desc');
  ['copy', 'cut', 'contextmenu'].forEach(ev => desc.addEventListener(ev, e => {
    e.preventDefault();
    const t = $('protection-toast');
    t.textContent = ev === 'cut' ? 'Cutting is disabled for product descriptions.' : 'Copying is disabled for product descriptions.';
    t.classList.remove('hidden'); clearTimeout(t._h); t._h = setTimeout(() => t.classList.add('hidden'), 2500);
  }));

  // Favorite SVG
  const fav = $('favorite-btn');
  const toggleFav = () => { fav.classList.toggle('active'); fav.setAttribute('aria-pressed', fav.classList.contains('active')); };
  fav.addEventListener('click', toggleFav);
  fav.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleFav(); } });
}

/* ---------- Interactive preview: pointer tilt ---------- */
function wirePreview() {
  const box = $('product-preview'), stage = $('tilt-stage'), glare = $('glare');
  box.addEventListener('pointerenter', () => box.classList.add('active-hover'));
  box.addEventListener('pointermove', e => {
    const r = box.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    stage.style.transform = `rotateY(${(x - .5) * 30}deg) rotateX(${(.5 - y) * 30}deg) scale(1.04)`;
    glare.style.background = `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(255,255,255,.55), transparent 45%)`;
  });
  box.addEventListener('pointerleave', () => { box.classList.remove('active-hover'); stage.style.transform = ''; });
  box.addEventListener('dragstart', e => { e.dataTransfer.setData('text/plain', 'product'); e.dataTransfer.effectAllowed = 'copy'; box.classList.add('dragging'); });
  box.addEventListener('dragend', () => box.classList.remove('dragging'));
}

/* ---------- Cart (drag & drop) ---------- */
function addToCart() {
  const price = state.product.price + VARIANTS[state.variant].add;
  const finish = state.premiumColor || state.color;
  state.cart.push({name:state.product.name, finish:finish.n, price, engraving:state.engraving});
  const total = state.cart.reduce((s, i) => s + i.price, 0);
  $('cart-count').textContent = $('cart-count-header').textContent = state.cart.length;
  $('cart-total').textContent = fmt(total);
  $('last-added').textContent = `✓ Added ${state.product.name} (${finish.n}${state.engraving ? ', "' + state.engraving + '"' : ''}) to your cart`;
  $('cart-list').innerHTML = state.cart.map(i => `<li><span>${i.name} · ${i.finish}</span><b>${fmt(i.price)}</b></li>`).join('');
  const z = $('drop-zone'); z.classList.remove('added'); void z.offsetWidth; z.classList.add('added');
}
function wireCart() {
  const zone = $('drop-zone');
  zone.addEventListener('dragenter', e => { e.preventDefault(); zone.classList.add('drag-over'); });
  zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('drag-over'); });
  zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
  zone.addEventListener('drop', e => { e.preventDefault(); zone.classList.remove('drag-over'); addToCart(); });
  $('btn-add-cart').addEventListener('click', addToCart);
}

/* ---------- Premium status ---------- */
function setPremiumUI() {
  const b = $('userBadge');
  b.textContent = state.premium ? 'Premium User 👑' : 'Free User';
  b.className = 'badge ' + (state.premium ? 'premium' : 'free');
  $('btn-upgrade-top').classList.toggle('hidden', state.premium);
  if (state.premium) $('premium-lock-msg').classList.add('hidden');
  updatePreview();
}

/* ---------- Custom product video player in Configurator ---------- */
const vp = {cfg:null, chap:-1, idle:0, cap:0};
const clock = s => isFinite(s) ? Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0') : '0:00';

function setupPlayer(p) {
  const v = $('pv'); vp.cfg = VIDEOS[p.type]; vp.chap = -1;
  $('video-title').textContent = (vp.cfg.title || p.name) + ' showcase';
  v.pause();
  v.poster = p.imgs[0];
  v.onerror = () => {
    if (v.src !== vp.cfg.remoteSrc) {
      v.src = vp.cfg.remoteSrc;
      v.load();
    }
  };
  v.src = vp.cfg.src;
  v.load();
  $('vp-chapters').innerHTML = vp.cfg.chapters.map((c, i) => `<li><button type="button" data-i="${i}"><b>${c.t}</b><small>${c.d}</small></button></li>`).join('');
  $('vp-marks').innerHTML = vp.cfg.chapters.slice(1).map(c => `<i style="left:${c.at * 100}%"></i>`).join('');
  $('vp-caption').classList.remove('show'); syncPlayer();
}
function syncPlayer() {
  const v = $('pv'), d = v.duration || 0, pct = d ? v.currentTime / d : 0;
  $('vp-range').value = pct * 1000; $('vp-range').style.setProperty('--p', pct * 100 + '%');
  $('vp-time').textContent = clock(v.currentTime) + ' / ' + clock(d);
  $('player').classList.toggle('playing', !v.paused);
  $('vp-play').textContent = v.paused ? '▶' : '❚❚';
  const cs = vp.cfg.chapters; let i = 0; cs.forEach((c, k) => { if (pct >= c.at - 0.001) i = k; });
  if (i !== vp.chap) {
    vp.chap = i; const c = cs[i], cap = $('vp-caption');
    cap.innerHTML = `<b>${c.t}</b><span>${c.d}</span>`;
    if (!v.paused) { cap.classList.add('show'); clearTimeout(vp.cap); vp.cap = setTimeout(() => cap.classList.remove('show'), 3500); }
    document.querySelectorAll('#vp-chapters li').forEach((li, k) => li.classList.toggle('on', k === i));
  }
}
function wakeControls() {
  const pl = $('player'); pl.classList.remove('idle'); clearTimeout(vp.idle);
  vp.idle = setTimeout(() => pl.classList.add('idle'), 2500);
}
function seekBy(sec) { const v = $('pv'); v.currentTime = Math.max(0, Math.min(v.duration || 0, v.currentTime + sec)); }
function togglePlay() { const v = $('pv'); v.paused ? v.play().catch(() => {}) : v.pause(); }
function toggleFs() { document.fullscreenElement ? document.exitFullscreen() : $('player').requestFullscreen?.(); }
function setVol(x) { const v = $('pv'); v.volume = Math.max(0, Math.min(1, x)); v.muted = v.volume === 0; }

function wirePlayer() {
  const v = $('pv'), pl = $('player');
  ['timeupdate', 'play', 'pause', 'loadedmetadata', 'ended'].forEach(ev => v.addEventListener(ev, syncPlayer));
  v.addEventListener('waiting', () => $('vp-loading').classList.remove('hidden'));
  ['playing', 'canplay'].forEach(ev => v.addEventListener(ev, () => $('vp-loading').classList.add('hidden')));
  v.addEventListener('error', () => { const c = $('vp-caption'); c.innerHTML = '<b>Video unavailable</b><span>Check your connection or replace the video source.</span>'; c.classList.add('show'); });
  v.addEventListener('volumechange', () => { $('vp-mute').textContent = v.muted || v.volume === 0 ? '🔇' : '🔊'; $('vp-vol').value = v.muted ? 0 : v.volume; });
  v.addEventListener('click', togglePlay);
  $('vp-big').addEventListener('click', togglePlay); $('vp-play').addEventListener('click', togglePlay);
  $('vp-back').addEventListener('click', () => seekBy(-10)); $('vp-fwd').addEventListener('click', () => seekBy(10));
  $('vp-mute').addEventListener('click', () => { v.muted = !v.muted; });
  $('vp-vol').addEventListener('input', e => setVol(+e.target.value));
  $('vp-range').addEventListener('input', e => { if (v.duration) v.currentTime = e.target.value / 1000 * v.duration; });
  $('vp-speed').addEventListener('change', e => { v.playbackRate = +e.target.value; });
  $('vp-loop').addEventListener('click', e => { v.loop = !v.loop; e.currentTarget.setAttribute('aria-pressed', v.loop); });
  $('vp-fs').addEventListener('click', toggleFs);
  if (document.pictureInPictureEnabled) $('vp-pip').addEventListener('click', () => document.pictureInPictureElement ? document.exitPictureInPicture() : v.requestPictureInPicture());
  else $('vp-pip').classList.add('hidden');
  $('vp-chapters').addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b || !v.duration) return;
    v.currentTime = vp.cfg.chapters[b.dataset.i].at * v.duration + 0.01; vp.chap = -1; v.play().catch(() => {});
  });
  ['mousemove', 'touchstart', 'focusin'].forEach(ev => pl.addEventListener(ev, wakeControls));
  pl.addEventListener('keydown', e => {
    if (e.target.matches('input,select')) return;
    const k = e.key.toLowerCase(), map = {' ':togglePlay, k:togglePlay, j:() => seekBy(-10), l:() => seekBy(10), arrowleft:() => seekBy(-5), arrowright:() => seekBy(5),
      arrowup:() => setVol(v.volume + .1), arrowdown:() => setVol(v.volume - .1), m:() => { v.muted = !v.muted; }, f:toggleFs};
    if (map[k]) { e.preventDefault(); map[k](); wakeControls(); }
  });
}

/* ---------- Init ---------- */
renderGallery(); renderSwatches(); wireConfigurator(); wirePreview(); wireCart(); wirePlayer(); setPremiumUI();