'use strict';

// Custom DOM helper (NOT jQuery). jQuery is always called as jQuery(...) to avoid a conflict.
const $ = id => document.getElementById(id);
const fmt = n => 'Rs ' + n.toLocaleString('en-PK');

const API_BASE = 'http://localhost:5000';

// Fallbacks used only when a product in products.json is missing colours / variants
const DEFAULT_COLOR = { name: 'Default', code: '#2563eb', premium: false };
const DEFAULT_VARIANT = { name: 'Standard', additionalPrice: 0 };

let PRODUCTS = [];
let appInitialized = false;

// Colour helpers - the backend (product.colors) is the source of truth
const getFreeColors = p => (p && p.colors ? p.colors.filter(color => !color.premium) : []);
const getPremiumColors = p => (p && p.colors ? p.colors.filter(color => color.premium) : []);
const getDefaultColor = p => getFreeColors(p)[0] || DEFAULT_COLOR;

function showGalleryMessage(msg) {
  // jQuery DOM manipulation: .html()
  jQuery('#product-grid').html(`<p class="api-message" role="status">${msg}</p>`);
}

/* ---------- jQuery AJAX GET: products.json -> Express -> frontend ---------- */
function loadProducts() {
  jQuery.ajax({
    url: `${API_BASE}/api/products`,
    method: 'GET',
    dataType: 'json',

    success: function (response) {
      console.log('Products received from backend:');
      console.log(response);

      if (!response || !response.success || !Array.isArray(response.products)) {
        console.error('Invalid products response:', response);
        showGalleryMessage('The server returned an invalid product response.');
        return;
      }
      if (response.products.length === 0) {
        showGalleryMessage('No products are available right now.');
        return;
      }

      // Convert backend JSON names into the names used by the existing frontend
      PRODUCTS = response.products.map(product => ({
        ...product,
        imgs: product.remoteImages || product.images || [],
        localImgs: product.images || [],
        desc: product.description || '',
        colors: Array.isArray(product.colors) ? product.colors : [],
        variants: Array.isArray(product.variants) && product.variants.length ? product.variants : [DEFAULT_VARIANT]
      }));

      console.log('Products loaded:', PRODUCTS);

      renderGallery();

      // Wire global handlers exactly once (prevents duplicate event handlers)
      if (appInitialized) return;
      appInitialized = true;

      state.product = PRODUCTS[0];
      state.color = getDefaultColor(state.product);

      renderSwatches();
      wireConfigurator();
      wirePreview();
      wireCart();
      wirePlayer();
      setPremiumUI();
      wireAddProductForm();
    },

    error: function (xhr, status, error) {
      console.error('Failed to load products:', status, error);
      const reason = xhr.status === 0
        ? 'The backend is unavailable. Start it with <code>node server.js</code> in the backend folder.'
        : `Server error (${xhr.status}).`;
      showGalleryMessage(`Unable to load products from the server. ${reason}`);
      alert('Unable to load products from the server.');
    }
  });
}

// const PRODUCTS = [
//   {
//     id: 1,
//     name: 'Aurora Pro Headphones',
//     type: 'headphones',
//     price: 24999,
//     imgs: [
//       'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSofF4mxwbKQSXbLpSMnTgB1hTJkBpNB1awDTVY6ByHTQ&s',
//       'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbcY0hdQxcnqSzaeRbhD4n6Wb_cyRDRnZYl7OgS4ZQNyVyWt0J8njSwmM&s=10',
//       'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTK6Mj-snBO1fD100DqHA9cbZ8Om5OJBPiQ4EQT_lUJ_8uNZmb0bxZtkBut&s=10'
//     ],
//     localImgs: [
//       'images/aurora-1.jpg',
//       'images/aurora-2.jpg',
//       'images/aurora-3.jpg'
//     ],
//     desc: 'Active noise cancelling, 40-hour battery and studio-tuned drivers for all-day listening.'
//   },
//   {
//     id: 2,
//     name: 'Chrono Smartwatch',
//     type: 'watch',
//     price: 32999,
//     imgs: [
//       'https://www.greenlion.net/web/image/product.product/12014/image_1024/%5BGNCRNPSWBK%5D%20Green%20Lion%20Chrono%20Pro%20Smart%20Watch%20%28%E2%80%8BBlack%29?unique=8e68a83',
//       'https://png.pngtree.com/png-vector/20260529/ourmid/pngtree-smartwatch-blue-strap-digital-display-time-png-image_19435006.webp',
//       'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTT5D0VKiwboM4MyTabAQSEirzFAV_EE-OsipXNBWzGVvMIrWDf876GhG0&s=10'
//     ],
//     localImgs: [
//       'images/watch-1.webp',
//       'images/watch-2.webp',
//       'images/watch-3.jpg'
//     ],
//     desc: 'AMOLED display, heart-rate tracking, GPS and a sapphire-glass face in a slim aluminium case.'
//   },
//   {
//     id: 3,
//     name: 'Orbit Smart Speaker',
//     type: 'speaker',
//     price: 15999,
//     imgs: [
//       'https://m.media-amazon.com/images/I/61mQEw77sTS.jpg',
//       'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcTpJLgkagwAQ2IKccWCvs99-2ZIqKkmWw8puFNS0lRs5oZv1zoQ',
//       'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcToMB6EaOTwhT30uykOkjGJHhzhhY4oZD_2AvC-oaGZcfLWNqfA'
//     ],
//     localImgs: [
//       'images/speaker-2.jpg',
//       'images/speaker-3.jpg',
//       'images/speaker-1.jpg'
//     ],
//     desc: '360-degree room-filling sound with deep bass, voice assistant and 12-hour wireless playback.'
//   }
// ];
// Colours and variants now come from products.json (product.colors / product.variants).

const state = {
    premium: localStorage.getItem('techifyPremium') === '1',
    product: null,
    view: 0,
    color: null,
    premiumColor: null,
    variant: 0,
    engraving: '',
    foil: false,
    cart: []
};

function handleImgError(img, p, idx) {
  if (p && p.localImgs && p.localImgs[idx] && !img.dataset.failedLocal) {
    img.dataset.failedLocal = '1';
    img.src = p.localImgs[idx];
    return;
  }
  if (p) {
    const parent = img.parentElement;
    if (parent && parent.classList.contains('card-img-wrapper')) {
      img.replaceWith(Object.assign(document.createElement('div'), { innerHTML: productSVG(p.type, '#2563eb', false), style: 'padding:2rem;height:100%' }));
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
      { at: 0, t: 'Acoustic Engineering', d: 'Studio-tuned 40mm dynamic drivers.' },
      { at: 0.25, t: 'Adaptive ANC', d: 'Noise cancellation tailored to your surroundings.' },
      { at: 0.55, t: 'Ergonomic Comfort', d: 'Memory foam ear cushions and lightweight headband.' },
      { at: 0.80, t: 'Battery & Fast Charge', d: 'Up to 40 hours of playback with USB-C quick charge.' }
    ]
  },
  watch: {
    src: 'videos/smartwatch.mp4',
    remoteSrc: 'https://archive.org/download/youtube-mg3r72bjI10/mg3r72bjI10.mp4',
    title: 'Chrono Pro Smartwatch Showcase',
    chapters: [
      { at: 0, t: 'Precision Craftsmanship', d: 'Sleek aluminium case with sapphire crystal.' },
      { at: 0.25, t: 'AMOLED Display', d: 'Always-on vibrant display with custom watch faces.' },
      { at: 0.55, t: 'Quick-Swap Straps', d: 'Effortlessly change bands to match your style.' },
      { at: 0.80, t: 'Health & Fitness Suite', d: 'Continuous heart-rate, sleep, and GPS tracking.' }
    ]
  },
  speaker: {
    src: 'videos/speaker.mp4',
    remoteSrc: 'https://archive.org/download/youtube-jNBxMA8iD5Y/jNBxMA8iD5Y.mp4',
    title: 'Orbit 360° Sound Showcase',
    chapters: [
      { at: 0, t: '360° Omnidirectional Audio', d: 'Fills any room with balanced, immersive sound.' },
      { at: 0.25, t: 'Deep Resonance Bass', d: 'Custom passive radiators for punchy low ends.' },
      { at: 0.55, t: 'Ambient Atmosphere', d: 'Mood lighting and multi-room wireless synchronization.' },
      { at: 0.80, t: 'All-Day Battery', d: '12-hour portable playback with IPX4 splash resistance.' }
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
          <video class="listing-video" src="${p.video || vcfg.src}" poster="${p.imgs[0]}" preload="metadata" playsinline loop muted></video>
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
        }).catch(() => { });
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
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ---------- Configurator ---------- */
function openConfigurator(id) {
  const product = PRODUCTS.find(p => p.id === Number(id));
  if (!product) {
    console.error('Product not found / invalid product ID:', id);
    alert('Sorry, that product could not be found.');
    return;
  }
  state.product = product;

  // jQuery DOM manipulation: .text() / .removeClass()
  jQuery('#config-product-name').text(product.name);
  jQuery('#config-product-desc').text(product.desc);
  jQuery('#favorite-btn').removeClass('active');

  state.view = 0;
  state.color = getDefaultColor(product);
  state.premiumColor = null;
  buildThumbs();
  setupPlayer(product);
  resetCustomization();
  showView('configurator-view');
}
function buildThumbs() {
  const p = state.product;
  const freeColors = getFreeColors(p);
  $('thumbs').innerHTML = p.imgs.map((u, i) => {
    const label = freeColors[i]?.name || `View ${i + 1}`;
    return `
    <button type="button" class="thumb" data-v="${i}" aria-label="${p.name} - ${label}">
      <img src="${u}" alt="${label}" onerror="handleImgError(this, PRODUCTS.find(x => x.id === ${p.id}), ${i})">
      <span class="thumb-badge">${label}</span>
    </button>`;
  }).join('') + `
    <button type="button" class="thumb thumb-vector" data-v="svg" aria-label="3D Vector customizer view">
      ${productSVG(p.type, (state.color || DEFAULT_COLOR).code, false)}
      <span class="thumb-badge">Vector</span>
    </button>`;
}

function renderSwatches() {
  if (!state.product) return;

  const freeColors = getFreeColors(state.product);
  const premiumColors = getPremiumColors(state.product);

  const make = (list, premium) => list.map((color, index) => `
    <button
      type="button"
      class="color-btn ${premium && !state.premium ? 'locked' : ''}"
      data-premium="${premium}"
      data-i="${index}"
      title="${color.name}"
      aria-label="${color.name}${premium ? ' (premium)' : ''}"
      style="background:${color.code}">
    </button>`).join('');

  // jQuery DOM manipulation: .html()
  jQuery('#color-options-container').html(make(freeColors, false));
  jQuery('#premium-options-container').html(make(premiumColors, true));
  jQuery('#variant-select').html(
    state.product.variants.map((variant, index) =>
      `<option value="${index}">${variant.name}${variant.additionalPrice > 0 ? ` (+${fmt(variant.additionalPrice)})` : ''}</option>`
    ).join('')
  );
}

function updatePreview() {
  const p = state.product; if (!p) return;
  const freeColors = getFreeColors(p);
  const premiumColors = getPremiumColors(p);
  if (!state.color) state.color = getDefaultColor(p);
  const variant = p.variants[state.variant] || p.variants[0];
  const active = state.premiumColor || state.color;
  $('preview-art').innerHTML = productSVG(p.type, active.code, !!state.premiumColor);
  $('preview-art').classList.toggle('shimmer', !!state.premiumColor);
  const isSvg = state.view === 'svg', ph = $('preview-photo');
  $('preview-art').classList.toggle('hidden', !isSvg);
  ph.classList.toggle('hidden', isSvg);
  if (!isSvg) {
    const idx = typeof state.view === 'number' ? state.view : 0;
    ph.alt = `${p.name} in ${freeColors[idx]?.name || 'color'}`;
    ph.onerror = () => handleImgError(ph, p, idx);
    ph.src = p.imgs[idx];
  }
  $('seal').style.color = active.code;
  document.querySelectorAll('.thumb').forEach(t => t.classList.toggle('on', t.dataset.v === String(state.view)));
  const st = document.querySelector('.thumb[data-v="svg"]');
  if (st) st.innerHTML = productSVG(p.type, active.code, !!state.premiumColor) + '<span class="thumb-badge">Vector</span>';
  jQuery('#color-label').text(state.premiumColor ? 'None' : state.color.name);
  jQuery('#premium-color-label').text(state.premiumColor ? state.premiumColor.name : 'None');
  jQuery('#engraving-overlay').text(state.engraving).toggleClass('foil', state.foil && state.premium);
  jQuery('#config-product-price').text(fmt(p.price + variant.additionalPrice));
  document.querySelectorAll('.color-btn').forEach(button => {
    const isPremium = button.dataset.premium === 'true';
    const colors = isPremium ? premiumColors : freeColors;
    const selected = isPremium ? state.premiumColor : (state.premiumColor ? null : state.color);
    // jQuery DOM manipulation: .toggleClass()
    jQuery(button)
      .toggleClass('selected', selected === colors[Number(button.dataset.i)])
      .toggleClass('locked', isPremium && !state.premium);
  });
}
function showLock() {
  jQuery('#premium-lock-msg').removeClass('hidden');
  const m = $('premium-lock-msg');
  m.style.animation = 'none'; void m.offsetWidth; m.style.animation = '';
}
function resetCustomization() {
  if (!state.product) return;
  Object.assign(state, {
    color: getDefaultColor(state.product),
    premiumColor: null,
    view: 0,
    variant: 0,
    engraving: '',
    foil: false
  });
  renderSwatches();
  // jQuery DOM manipulation: .val() / .prop() / .text() / .removeClass() / .addClass()
  jQuery('#engraving-input').val('');
  jQuery('#foil-toggle').prop('checked', false);
  jQuery('#variant-select').val('0');
  jQuery('#char-count').text(0);
  jQuery('#char-counter').removeClass('warning');
  jQuery('#premium-lock-msg').addClass('hidden');
  jQuery('#last-added').text('');
  updatePreview();
}
function wireConfigurator() {
  // jQuery event delegation: colour buttons are generated dynamically by renderSwatches().
  // Namespaced + .off() first so the handler can never be attached twice.
  jQuery(document).off('click.configurator').on('click.configurator', '.color-btn', function () {
    if (!state.product) return;
    const button = this;
    const index = Number(button.dataset.i);
    const isPremium = button.dataset.premium === 'true';

    if (isPremium) {
      if (!state.premium) {
        showLock();
        return;
      }
      const premiumColors = getPremiumColors(state.product);
      state.premiumColor = premiumColors[index] || null;
      state.view = 'svg';
    } else {
      const freeColors = getFreeColors(state.product);
      state.color = freeColors[index] || getDefaultColor(state.product);
      state.premiumColor = null;
      state.view = index;
    }
    updatePreview();
  });

  // Thumbnails are also generated dynamically -> delegated jQuery handler
  jQuery('#thumbs').on('click', '.thumb', function () {
    if (this.dataset.v === 'svg') {
      state.view = 'svg';
    } else {
      const idx = Number(this.dataset.v);
      state.view = idx;
      state.color = getFreeColors(state.product)[idx] || state.color;
      state.premiumColor = null;
    }
    updatePreview();
  });

  jQuery('#variant-select').on('change', function () {
    state.variant = Number(this.value);
    updatePreview();
  });

  jQuery('#engraving-input').on('input', function () {
    state.engraving = this.value;
    jQuery('#char-count').text(this.value.length);
    jQuery('#char-counter').toggleClass('warning', this.value.length >= 18);
    updatePreview();
  });

  jQuery('#foil-toggle').on('change', function () {
    if (!state.premium) {
      this.checked = false;
      showLock();
      return;
    }
    state.foil = this.checked;
    updatePreview();
  });

  jQuery('#btn-reset').on('click', resetCustomization);

  // Pressing Enter inside the form (e.g. in the engraving box) sends the configuration via POST
  jQuery('#customization-form').on('submit', function (e) {
    e.preventDefault();
    saveConfiguration();
  });

  jQuery('#back-to-gallery').on('click', function () {
    $('pv').pause();
    showView('gallery-view');
  });
  jQuery('#logo').on('click', function (e) { e.preventDefault(); showView('gallery-view'); });

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
  const toggleFav = () => {
    jQuery(fav).toggleClass('active');
    fav.setAttribute('aria-pressed', fav.classList.contains('active'));
  };
  jQuery('#favorite-btn').on('click', toggleFav);
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
  if (!state.product) return;
  const variant = state.product.variants[state.variant] || state.product.variants[0];
  const price = state.product.price + variant.additionalPrice;
  const finish = state.premiumColor || state.color || DEFAULT_COLOR;
  state.cart.push({ name: state.product.name, finish: finish.name, variant: variant.name, price, engraving: state.engraving });
  const total = state.cart.reduce((s, i) => s + i.price, 0);
  jQuery('#cart-count, #cart-count-header').text(state.cart.length);
  jQuery('#cart-total').text(fmt(total));
  jQuery('#last-added').text(`✓ Added ${state.product.name} (${finish.name}${state.engraving ? ', "' + state.engraving + '"' : ''}) to your cart`);
  $('cart-list').innerHTML = state.cart.map(i => `<li><span>${i.name} · ${i.finish}</span><b>${fmt(i.price)}</b></li>`).join('');
  const z = $('drop-zone'); z.classList.remove('added'); void z.offsetWidth; z.classList.add('added');

  // Send the selected configuration to Express (jQuery AJAX POST)
  saveConfiguration();
}

/* ---------- jQuery AJAX POST: frontend -> Express (req.body) -> JSON response ---------- */
function saveConfiguration() {
  if (!state.product) return;

  const finish = state.premiumColor || state.color;
  const variant = state.product.variants[state.variant] || state.product.variants[0];

  const configuration = {
    productId: state.product.id,
    productName: state.product.name,
    color: finish ? finish.name : null,
    premiumFinish: !!state.premiumColor,
    variant: variant.name,
    price: state.product.price + variant.additionalPrice,
    engraving: state.engraving,
    foil: state.foil
  };

  jQuery.ajax({
    url: `${API_BASE}/api/configurations`,
    method: 'POST',
    contentType: 'application/json',
    dataType: 'json',
    data: JSON.stringify(configuration),

    success: function (response) {
      console.log('Configuration saved:', response);
      const current = jQuery('#last-added').text();
      jQuery('#last-added').text(
        current ? `${current} · ✓ Configuration sent to server` : '✓ Configuration sent successfully'
      );
    },

    error: function (xhr, status, error) {
      console.error('Configuration request failed:', status, error, xhr.responseJSON);
      const msg = xhr.responseJSON && xhr.responseJSON.message ? `\n${xhr.responseJSON.message}` : '';
      alert('Unable to send configuration to the server.' + msg);
    }
  });
}

function wireCart() {
  const zone = $('drop-zone');
  zone.addEventListener('dragenter', e => { e.preventDefault(); zone.classList.add('drag-over'); });
  zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('drag-over'); });
  zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
  zone.addEventListener('drop', e => { e.preventDefault(); zone.classList.remove('drag-over'); addToCart(); });
  jQuery('#btn-add-cart').on('click', addToCart);
}

/* ---------- Premium status ---------- */
function setPremiumUI() {
  jQuery('#userBadge')
    .text(state.premium ? 'Premium User 👑' : 'Free User')
    .attr('class', 'badge ' + (state.premium ? 'premium' : 'free'));
  jQuery('#btn-upgrade-top').toggleClass('hidden', state.premium);
  if (state.premium) jQuery('#premium-lock-msg').addClass('hidden');
  updatePreview();
}

/* ---------- Custom product video player in Configurator ---------- */
const vp = { cfg: null, chap: -1, idle: 0, cap: 0 };
const clock = s => isFinite(s) ? Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0') : '0:00';

function setupPlayer(p) {
  const v = $('pv');
  vp.cfg = VIDEOS[p.type] || { src: p.video, remoteSrc: p.video, title: p.name, chapters: [{ at: 0, t: p.name, d: p.desc }] };
  vp.chap = -1;
  $('video-title').textContent = (vp.cfg.title || p.name) + ' showcase';
  v.pause();
  v.poster = p.imgs[0];
  v.onerror = () => {
    if (v.src !== vp.cfg.remoteSrc) {
      v.src = vp.cfg.remoteSrc;
      v.load();
    }
  };
  v.src = p.video || vp.cfg.src;
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
function togglePlay() { const v = $('pv'); v.paused ? v.play().catch(() => { }) : v.pause(); }
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
    v.currentTime = vp.cfg.chapters[b.dataset.i].at * v.duration + 0.01; vp.chap = -1; v.play().catch(() => { });
  });
  ['mousemove', 'touchstart', 'focusin'].forEach(ev => pl.addEventListener(ev, wakeControls));
  pl.addEventListener('keydown', e => {
    if (e.target.matches('input,select')) return;
    const k = e.key.toLowerCase(), map = {
      ' ': togglePlay, k: togglePlay, j: () => seekBy(-10), l: () => seekBy(10), arrowleft: () => seekBy(-5), arrowright: () => seekBy(5),
      arrowup: () => setVol(v.volume + .1), arrowdown: () => setVol(v.volume - .1), m: () => { v.muted = !v.muted; }, f: toggleFs
    };
    if (map[k]) { e.preventDefault(); map[k](); wakeControls(); }
  });
}

/* ---------- Add Product Form (Lab 05 Demonstration) ---------- */
function parseColorsInput(rawText) {
  if (!rawText || !rawText.trim()) return [];
  const lines = rawText.split('\n');
  const colors = [];
  lines.forEach(line => {
    const trimmed = line.trim();
    if (!trimmed) return;
    const parts = trimmed.split(',').map(s => s.trim());
    if (parts.length > 0 && parts[0]) {
      colors.push({
        name: parts[0],
        code: parts[1] || '#1e293b',
        premium: parts[2] ? parts[2].toLowerCase() === 'true' : false
      });
    }
  });
  return colors;
}

function parseVariantsInput(rawText) {
  if (!rawText || !rawText.trim()) return [];
  const lines = rawText.split('\n');
  const variants = [];
  lines.forEach(line => {
    const trimmed = line.trim();
    if (!trimmed) return;
    const parts = trimmed.split(',').map(s => s.trim());
    if (parts.length > 0 && parts[0]) {
      const addPrice = parts[1] !== undefined ? Number(parts[1]) : 0;
      variants.push({
        name: parts[0],
        additionalPrice: isNaN(addPrice) ? 0 : addPrice
      });
    }
  });
  return variants;
}

const escapeHtml = str => String(str || '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

function showAddProductAlert(type, message) {
  const alertEl = jQuery('#add-product-alert');
  alertEl.removeClass('hidden success error').addClass(type).html(message);
}

function clearAddProductAlert() {
  jQuery('#add-product-alert').addClass('hidden').removeClass('success error').empty();
}

function displaySubmittedProduct(product) {
  const container = jQuery('#submitted-product-display');

  const colorsList = Array.isArray(product.colors) && product.colors.length > 0
    ? product.colors.map(c => `
        <span class="color-pill" style="border-left: 8px solid ${escapeHtml(c.code)}">
          ${escapeHtml(c.name)}${c.premium ? ' 👑 (Premium)' : ''}
        </span>
      `).join('')
    : '<span class="helper-text">None</span>';

  const variantsList = Array.isArray(product.variants) && product.variants.length > 0
    ? product.variants.map(v => `
        <li>${escapeHtml(v.name)}${v.additionalPrice > 0 ? ` (+${fmt(v.additionalPrice)})` : ''}</li>
      `).join('')
    : '<li>Standard</li>';

  const html = `
    <div class="result-card">
      <div class="result-header">
        <span class="result-badge">✓ Product Added Successfully</span>
        <span class="result-id">ID: #${product.id}</span>
      </div>
      <p class="result-message">✓ Product added successfully!<br>Product "<strong>${escapeHtml(product.name)}</strong>" was received by the backend.</p>

      <div class="result-details">
        <div class="result-row"><strong>Name:</strong> <span>${escapeHtml(product.name)}</span></div>
        <div class="result-row"><strong>Type:</strong> <span>${escapeHtml(product.type)}</span></div>
        <div class="result-row"><strong>Price:</strong> <span>${fmt(product.price)} (${escapeHtml(product.currency || 'PKR')})</span></div>
        <div class="result-row"><strong>Description:</strong> <span>${escapeHtml(product.description || '')}</span></div>

        <div class="result-block">
          <strong>Colors:</strong>
          <div class="result-pills">
            ${colorsList}
          </div>
        </div>

        <div class="result-block">
          <strong>Variants:</strong>
          <ul class="variant-list">
            ${variantsList}
          </ul>
        </div>
      </div>
      <p class="result-note">📡 <em>Check your backend terminal/console to verify the printed product object!</em></p>
    </div>
  `;

  container.html(html).removeClass('hidden');
}

function wireAddProductForm() {
  const form = jQuery('#add-product-form');
  if (!form.length) return;

  // Fill sample data helper
  jQuery('#btn-sample-product').off('click').on('click', function () {
    jQuery('#new-product-name').val('Nova Wireless Earbuds');
    jQuery('#new-product-type').val('earbuds');
    jQuery('#new-product-price').val(18999);
    jQuery('#new-product-currency').val('PKR');
    jQuery('#new-product-desc').val('Wireless earbuds with active noise cancellation.');
    jQuery('#new-product-image').val('images/earbuds-1.jpg');
    jQuery('#new-product-remote-image').val('https://example.com/earbuds.jpg');
    jQuery('#new-product-colors').val('Black,#111111,false\nGold,#d4a017,true');
    jQuery('#new-product-variants').val('Standard,0\nPro,3000');
    clearAddProductAlert();
  });

  // Clear button helper
  jQuery('#btn-clear-product').off('click').on('click', function () {
    clearAddProductAlert();
    jQuery('#submitted-product-display').addClass('hidden').empty();
  });

  // Quick jump / scroll to Add Product section
  const scrollToForm = function () {
    showView('gallery-view');
    const section = document.getElementById('add-product-section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => {
        jQuery('#new-product-name').focus();
      }, 350);
    }
  };
  jQuery('#btn-nav-add-product').off('click').on('click', scrollToForm);
  jQuery('#hero-add-product-btn').off('click').on('click', scrollToForm);

  // Form submit handler with validation and jQuery AJAX POST
  form.off('submit').on('submit', function (e) {
    e.preventDefault();
    clearAddProductAlert();

    const name = jQuery('#new-product-name').val().trim();
    const type = jQuery('#new-product-type').val().trim();
    const priceRaw = jQuery('#new-product-price').val().trim();
    const currency = jQuery('#new-product-currency').val().trim() || 'PKR';
    const desc = jQuery('#new-product-desc').val().trim();
    const img = jQuery('#new-product-image').val().trim();
    const remoteImg = jQuery('#new-product-remote-image').val().trim();
    const colorsRaw = jQuery('#new-product-colors').val().trim();
    const variantsRaw = jQuery('#new-product-variants').val().trim();

    // Frontend validation (Requirement 12)
    if (!name) {
      showAddProductAlert('error', '⚠️ Product name cannot be empty.');
      jQuery('#new-product-name').focus();
      return;
    }

    if (!type) {
      showAddProductAlert('error', '⚠️ Please select a product type.');
      jQuery('#new-product-type').focus();
      return;
    }

    const price = Number(priceRaw);
    if (!priceRaw || isNaN(price) || price <= 0) {
      showAddProductAlert('error', '⚠️ Price must be a valid positive number.');
      jQuery('#new-product-price').focus();
      return;
    }

    if (!desc) {
      showAddProductAlert('error', '⚠️ Description cannot be empty.');
      jQuery('#new-product-desc').focus();
      return;
    }

    if (!img) {
      showAddProductAlert('error', '⚠️ At least one local image path should be provided.');
      jQuery('#new-product-image').focus();
      return;
    }

    const colors = parseColorsInput(colorsRaw);
    if (colors.length === 0) {
      showAddProductAlert('error', '⚠️ At least one color should be provided (format: <code>Name,HexCode,isPremium</code>).');
      jQuery('#new-product-colors').focus();
      return;
    }

    const variants = parseVariantsInput(variantsRaw);
    if (variants.length === 0) {
      showAddProductAlert('error', '⚠️ At least one variant should be provided (format: <code>Name,AdditionalPrice</code>).');
      jQuery('#new-product-variants').focus();
      return;
    }

    const newProductPayload = {
      name,
      type,
      price,
      currency,
      description: desc,
      images: [img],
      remoteImages: remoteImg ? [remoteImg] : [img],
      colors,
      variants
    };

    // Loading state (Requirement 14)
    const submitBtn = jQuery('#btn-submit-product');
    const originalBtnText = submitBtn.text();
    submitBtn.prop('disabled', true).text('Adding Product...');

    // jQuery AJAX POST to backend (Requirement 4 & 5)
    jQuery.ajax({
      url: `${API_BASE}/api/products`,
      method: 'POST',
      contentType: 'application/json',
      dataType: 'json',
      data: JSON.stringify(newProductPayload),

      success: function (response) {
        console.log('Product added successfully:', response);
        submitBtn.prop('disabled', false).text(originalBtnText);

        if (response && response.success && response.product) {
          showAddProductAlert(
            'success',
            `✓ Product added successfully!<br>Product "<strong>${escapeHtml(response.product.name)}</strong>" was received by the backend.`
          );
          displaySubmittedProduct(response.product);

          // Reset the form ONLY on successful submission (Requirement 13)
          jQuery('#add-product-form')[0].reset();
          jQuery('#new-product-currency').val('PKR');
        } else {
          showAddProductAlert('success', '✓ Product received successfully by backend.');
        }
      },

      error: function (xhr, status, error) {
        console.error('Failed to add product:', status, error, xhr.responseJSON);
        submitBtn.prop('disabled', false).text(originalBtnText);

        let errorMsg = 'Unable to send product to the server.';
        if (xhr.status === 0) {
          errorMsg = 'Unable to connect to the backend.<br>Please make sure the Express server is running on port 5000.';
        } else if (xhr.responseJSON && xhr.responseJSON.message) {
          errorMsg = `Server validation error: ${xhr.responseJSON.message}`;
        } else if (xhr.statusText) {
          errorMsg = `Error (${xhr.status}): ${xhr.statusText}`;
        }

        showAddProductAlert('error', `⚠️ ${errorMsg}`);
        // Do NOT reset form on error
      }
    });
  });
}

/* ---------- Init ---------- */
// The app starts ONLY after the DOM is ready and the products arrive from the API.
// All render/wire functions are called once from inside loadProducts() -> success.
jQuery(document).ready(function () {
  loadProducts();
});