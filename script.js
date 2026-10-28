/* ============================================================
   Alphatails — shop page script
   ------------------------------------------------------------
   Handles:
     • product catalogue rendering
     • filtering (pet, brand, price, rating, stock)
     • search, sorting, pagination
     • grid / list view toggle
     • cart panel (add, qty, remove, totals)
     • mobile filter drawer, search overlay, toasts
   Depends on: styles.css (design tokens + .product-card styles)
   ============================================================ */

(function () {
  'use strict';

  /* ----------------------------------------------------------
     1. PRODUCT CATALOGUE
     Replace the image URLs and product data with your own.
     Fields: pet, brand, price, oldPrice, rating, reviews,
             stock, badge, featured, added, image, desc
     ---------------------------------------------------------- */
  const PRODUCTS = [
    {
      id: 'p01',
      name: 'Grain-Free Adult Dog Food',
      brand: 'NutriPaw',
      pet: 'Dogs',
      price: 42.00,
      oldPrice: 49.00,
      rating: 4.8,
      reviews: 312,
      stock: 24,
      badge: 'Best seller',
      featured: 3,
      added: 5,
      image: 'https://picsum.photos/seed/alphatails-dogfood/600/600',
      desc: 'Salmon & sweet potato recipe for all breeds.'
    },
    {
      id: 'p02',
      name: 'Puppy Starter Kibble',
      brand: 'NutriPaw',
      pet: 'Dogs',
      price: 38.50,
      oldPrice: null,
      rating: 4.7,
      reviews: 188,
      stock: 16,
      badge: null,
      featured: 2,
      added: 8,
      image: 'https://picsum.photos/seed/alphatails-puppy/600/600',
      desc: 'Small-bite kibble with DHA for growing pups.'
    },
    {
      id: 'p03',
      name: 'Reflective Dog Collar',
      brand: 'TrailHound',
      pet: 'Dogs',
      price: 18.00,
      oldPrice: 22.00,
      rating: 4.5,
      reviews: 96,
      stock: 40,
      badge: 'Sale',
      featured: 0,
      added: 2,
      image: 'https://picsum.photos/seed/alphatails-collar/600/600',
      desc: 'Weatherproof webbing with 360° reflectivity.'
    },
    {
      id: 'p04',
      name: 'Chew Rope Toy',
      brand: 'TrailHound',
      pet: 'Dogs',
      price: 12.50,
      oldPrice: null,
      rating: 4.3,
      reviews: 141,
      stock: 0,
      badge: null,
      featured: 0,
      added: 1,
      image: 'https://picsum.photos/seed/alphatails-rope/600/600',
      desc: 'Tough cotton rope that flosses as they chew.'
    },
    {
      id: 'p05',
      name: 'Orthopedic Dog Bed',
      brand: 'CozyDen',
      pet: 'Dogs',
      price: 89.00,
      oldPrice: 110.00,
      rating: 4.9,
      reviews: 264,
      stock: 9,
      badge: 'Sale',
      featured: 3,
      added: 6,
      image: 'https://picsum.photos/seed/alphatails-dogbed/600/600',
      desc: 'Memory-foam base with a washable cover.'
    },
    {
      id: 'p06',
      name: 'Hip & Joint Chews',
      brand: 'VetriCare',
      pet: 'Dogs',
      price: 27.99,
      oldPrice: null,
      rating: 4.6,
      reviews: 402,
      stock: 55,
      badge: 'Vet pick',
      featured: 3,
      added: 7,
      image: 'https://picsum.photos/seed/alphatails-joint/600/600',
      desc: 'Glucosamine + green-lipped mussel soft chews.'
    },
    {
      id: 'p07',
      name: 'Squeaky Ball Pack (3)',
      brand: 'PlayPet',
      pet: 'Dogs',
      price: 9.99,
      oldPrice: null,
      rating: 4.2,
      reviews: 77,
      stock: 120,
      badge: null,
      featured: 0,
      added: 1,
      image: 'https://picsum.photos/seed/alphatails-ball/600/600',
      desc: 'Non-toxic rubber balls in three sizes.'
    },
    {
      id: 'p23',
      name: 'Cooling Mat for Dogs',
      brand: 'CozyDen',
      pet: 'Dogs',
      price: 34.00,
      oldPrice: 40.00,
      rating: 4.5,
      reviews: 87,
      stock: 21,
      badge: 'Sale',
      featured: 0,
      added: 10,
      image: 'https://picsum.photos/seed/alphatails-mat/600/600',
      desc: 'Pressure-activated gel keeps hotspots cool.'
    },

    {
      id: 'p08',
      name: 'Salmon Pâté (12 pack)',
      brand: 'WhiskerWell',
      pet: 'Cats',
      price: 24.00,
      oldPrice: 28.00,
      rating: 4.7,
      reviews: 356,
      stock: 32,
      badge: null,
      featured: 2,
      added: 4,
      image: 'https://picsum.photos/seed/alphatails-pate/600/600',
      desc: 'Grain-free wet food, no artificial colours.'
    },
    {
      id: 'p09',
      name: 'Clumping Cat Litter 10L',
      brand: 'WhiskerWell',
      pet: 'Cats',
      price: 16.50,
      oldPrice: null,
      rating: 4.4,
      reviews: 210,
      stock: 60,
      badge: null,
      featured: 0,
      added: 3,
      image: 'https://picsum.photos/seed/alphatails-litter/600/600',
      desc: 'Low-dust, fast-clumping and odour-locking.'
    },
    {
      id: 'p10',
      name: 'Cat Cave Bed',
      brand: 'CozyDen',
      pet: 'Cats',
      price: 54.00,
      oldPrice: null,
      rating: 4.8,
      reviews: 132,
      stock: 11,
      badge: null,
      featured: 2,
      added: 9,
      image: 'https://picsum.photos/seed/alphatails-catbed/600/600',
      desc: 'Felted wool hideaway that holds warmth.'
    },
    {
      id: 'p11',
      name: 'Feather Wand',
      brand: 'PlayPet',
      pet: 'Cats',
      price: 7.50,
      oldPrice: 9.00,
      rating: 4.1,
      reviews: 88,
      stock: 75,
      badge: 'Sale',
      featured: 0,
      added: 1,
      image: 'https://picsum.photos/seed/alphatails-wand/600/600',
      desc: 'Retractable wand with two swappable lures.'
    },
    {
      id: 'p12',
      name: 'Cat Dental Gel',
      brand: 'VetriCare',
      pet: 'Cats',
      price: 19.25,
      oldPrice: null,
      rating: 4.5,
      reviews: 64,
      stock: 0,
      badge: null,
      featured: 0,
      added: 2,
      image: 'https://picsum.photos/seed/alphatails-dental/600/600',
      desc: 'Enzymatic gel that fights plaque without brushing.'
    },
    {
      id: 'p13',
      name: 'Catnip Mice (5 pack)',
      brand: 'PlayPet',
      pet: 'Cats',
      price: 8.99,
      oldPrice: null,
      rating: 4.3,
      reviews: 121,
      stock: 90,
      badge: null,
      featured: 0,
      added: 4,
      image: 'https://picsum.photos/seed/alphatails-mice/600/600',
      desc: 'Organic catnip inside soft plush bodies.'
    },
    {
      id: 'p24',
      name: 'Flea & Tick Drops',
      brand: 'VetriCare',
      pet: 'Cats',
      price: 29.50,
      oldPrice: null,
      rating: 4.7,
      reviews: 231,
      stock: 47,
      badge: 'Vet pick',
      featured: 2,
      added: 8,
      image: 'https://picsum.photos/seed/alphatails-flea/600/600',
      desc: 'Spot-on treatment, protects for 3 months.'
    },

    {
      id: 'p14',
      name: 'Premium Seed Mix 1kg',
      brand: 'AviCare',
      pet: 'Birds',
      price: 14.00,
      oldPrice: null,
      rating: 4.6,
      reviews: 73,
      stock: 44,
      badge: null,
      featured: 0,
      added: 5,
      image: 'https://picsum.photos/seed/alphatails-seed/600/600',
      desc: 'Balanced blend of millet, canary and oat.'
    },
    {
      id: 'p15',
      name: 'Cage Perch Set (4)',
      brand: 'AviCare',
      pet: 'Birds',
      price: 21.00,
      oldPrice: 25.00,
      rating: 4.4,
      reviews: 41,
      stock: 18,
      badge: 'Sale',
      featured: 0,
      added: 2,
      image: 'https://picsum.photos/seed/alphatails-perch/600/600',
      desc: 'Natural wood perches in mixed diameters.'
    },
    {
      id: 'p16',
      name: 'Bird Swing',
      brand: 'PlayPet',
      pet: 'Birds',
      price: 11.00,
      oldPrice: null,
      rating: 4.2,
      reviews: 29,
      stock: 26,
      badge: null,
      featured: 0,
      added: 3,
      image: 'https://picsum.photos/seed/alphatails-swing/600/600',
      desc: 'Bell-tipped swing for small to medium birds.'
    },

    {
      id: 'p17',
      name: 'Water Conditioner 500ml',
      brand: 'AquaClear',
      pet: 'Fish',
      price: 13.75,
      oldPrice: null,
      rating: 4.8,
      reviews: 159,
      stock: 70,
      badge: null,
      featured: 1,
      added: 6,
      image: 'https://picsum.photos/seed/alphatails-water/600/600',
      desc: 'Neutralises chlorine and heavy metals instantly.'
    },
    {
      id: 'p18',
      name: 'Sponge Filter',
      brand: 'AquaClear',
      pet: 'Fish',
      price: 22.50,
      oldPrice: null,
      rating: 4.6,
      reviews: 97,
      stock: 23,
      badge: null,
      featured: 0,
      added: 4,
      image: 'https://picsum.photos/seed/alphatails-filter/600/600',
      desc: 'Quiet, shrimp-safe filtration for nano tanks.'
    },
    {
      id: 'p19',
      name: 'Tropical Flake Food',
      brand: 'AquaClear',
      pet: 'Fish',
      price: 10.25,
      oldPrice: null,
      rating: 4.5,
      reviews: 186,
      stock: 88,
      badge: null,
      featured: 0,
      added: 2,
      image: 'https://picsum.photos/seed/alphatails-flake/600/600',
      desc: 'Colour-enhancing flakes that sink slowly.'
    },

    {
      id: 'p20',
      name: 'Timothy Hay 2kg',
      brand: 'TinyPaws',
      pet: 'Small Pets',
      price: 17.99,
      oldPrice: null,
      rating: 4.9,
      reviews: 244,
      stock: 38,
      badge: 'Best seller',
      featured: 2,
      added: 7,
      image: 'https://picsum.photos/seed/alphatails-hay/600/600',
      desc: 'Fresh-cut, dust-extracted first-cut hay.'
    },
    {
      id: 'p21',
      name: 'Hideout Tunnel',
      brand: 'TinyPaws',
      pet: 'Small Pets',
      price: 15.50,
      oldPrice: null,
      rating: 4.4,
      reviews: 58,
      stock: 14,
      badge: null,
      featured: 0,
      added: 3,
      image: 'https://picsum.photos/seed/alphatails-tunnel/600/600',
      desc: 'Collapsible tunnel for rabbits and guinea pigs.'
    },
    {
      id: 'p22',
      name: 'Apple Chew Sticks',
      brand: 'TinyPaws',
      pet: 'Small Pets',
      price: 6.99,
      oldPrice: null,
      rating: 4.3,
      reviews: 112,
      stock: 130,
      badge: null,
      featured: 0,
      added: 1,
      image: 'https://picsum.photos/seed/alphatails-chew/600/600',
      desc: 'Natural apple-wood sticks that wear teeth down.'
    }
  ];

  /* ----------------------------------------------------------
     2. CONFIG + STATE
     ---------------------------------------------------------- */
  const PER_PAGE = 9;
  const MAX_PRICE = 150;

  const state = {
    pets: new Set(),
    brands: new Set(),
    maxPrice: MAX_PRICE,
    minRating: 0,
    inStockOnly: false,
    search: '',
    sort: 'featured',
    view: 'grid',
    page: 1
  };

  const cart = new Map(); // productId -> quantity

  /* ----------------------------------------------------------
     3. TINY HELPERS
     ---------------------------------------------------------- */
  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  const money = n => '$' + Number(n).toFixed(2);

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, c => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }

  function stars(rating) {
    const full = Math.round(rating);
    return '★'.repeat(full) + '☆'.repeat(5 - full);
  }

  let toastTimer;
  function toast(message) {
    const el = $('#toast');
    if (!el) return;
    el.textContent = message;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 2200);
  }

  /* ----------------------------------------------------------
     4. FILTER / SORT / SEARCH PIPELINE
     ---------------------------------------------------------- */
  function getFiltered() {
    const q = state.search.trim().toLowerCase();

    return PRODUCTS.filter(p => {
      if (state.pets.size && !state.pets.has(p.pet)) return false;
      if (state.brands.size && !state.brands.has(p.brand)) return false;
      if (p.price > state.maxPrice) return false;
      if (p.rating < state.minRating) return false;
      if (state.inStockOnly && p.stock <= 0) return false;

      if (q) {
        const haystack = [p.name, p.brand, p.pet, p.desc].join(' ').toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }

  function getSorted(list) {
    const out = list.slice();

    switch (state.sort) {
      case 'price-asc':
        out.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        out.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        out.sort((a, b) => (b.rating - a.rating) || (b.reviews - a.reviews));
        break;
      case 'newest':
        out.sort((a, b) => b.added - a.added);
        break;
      default: // featured
        out.sort((a, b) => ((b.featured || 0) - (a.featured || 0)) || (b.rating - a.rating));
    }
    return out;
  }

  /* ----------------------------------------------------------
     5. RENDER — PRODUCT CARDS
     Reuses .product-card styles from styles.css
     ---------------------------------------------------------- */
  function cardHTML(p) {
    const soldOut = p.stock <= 0;

    return `
      <article class="product-card" data-id="${p.id}">
        <div class="product-image">
          <img src="${p.image}" alt="${escapeHtml(p.name)}" loading="lazy">
          ${p.badge ? `<span class="badge">${escapeHtml(p.badge)}</span>` : ''}
          <button class="wishlist" data-wish="${p.id}"
                  aria-label="Save ${escapeHtml(p.name)}">♡</button>
        </div>
        <div class="product-info">
          <div class="product-brand">${escapeHtml(p.brand)} · ${escapeHtml(p.pet)}</div>
          <h3 class="product-name">${escapeHtml(p.name)}</h3>
          <div class="rating">${stars(p.rating)}
            <span>${p.rating.toFixed(1)} (${p.reviews})</span>
          </div>
          <div class="price-row">
            <div>
              <span class="price">${money(p.price)}</span>
              ${p.oldPrice ? `<span class="old-price">${money(p.oldPrice)}</span>` : ''}
            </div>
            <button class="add" data-add="${p.id}" ${soldOut ? 'disabled' : ''}
                    aria-label="${soldOut ? 'Out of stock' : 'Add ' + escapeHtml(p.name) + ' to cart'}">
              ${soldOut ? '✕' : '+'}
            </button>
          </div>
          ${soldOut ? '<p class="stock-out">Out of stock</p>' : ''}
        </div>
      </article>`;
  }

  /* ----------------------------------------------------------
     6. RENDER — GRID, COUNT, PAGER, CHIPS
     ---------------------------------------------------------- */
  function render() {
    const all = getSorted(getFiltered());
    const pages = Math.max(1, Math.ceil(all.length / PER_PAGE));

    if (state.page > pages) state.page = pages;

    const start = (state.page - 1) * PER_PAGE;
    const slice = all.slice(start, start + PER_PAGE);

    // Result count
    const countEl = $('#resultCount');
    if (countEl) {
      countEl.textContent = all.length
        ? `Showing ${start + 1}–${start + slice.length} of ${all.length} products`
        : 'No products found';
    }

    // Grid
    const grid = $('#shopGrid');
    if (grid) {
      grid.className = 'shop-grid' + (state.view === 'list' ? ' list-view' : '');
      grid.innerHTML = slice.map(cardHTML).join('');
    }

    const emptyEl = $('#shopEmpty');
    if (emptyEl) emptyEl.hidden = all.length > 0;

    renderPager(pages);
    renderActiveFilters();
  }

  function renderPager(pages) {
    const pager = $('#pager');
    if (!pager) return;

    if (pages <= 1) {
      pager.innerHTML = '';
      return;
    }

    let html = `<button class="page-btn" data-page="${state.page - 1}"
                 ${state.page === 1 ? 'disabled' : ''} aria-label="Previous page">‹</button>`;

    for (let i = 1; i <= pages; i++) {
      html += `<button class="page-btn${i === state.page ? ' active' : ''}"
                data-page="${i}" ${i === state.page ? 'aria-current="page"' : ''}>${i}</button>`;
    }

    html += `<button class="page-btn" data-page="${state.page + 1}"
              ${state.page === pages ? 'disabled' : ''} aria-label="Next page">›</button>`;

    pager.innerHTML = html;
  }

  function renderActiveFilters() {
    const wrap = $('#activeFilters');
    if (!wrap) return;

    const chips = [];

    state.pets.forEach(v   => chips.push({ label: v, type: 'pet', value: v }));
    state.brands.forEach(v => chips.push({ label: v, type: 'brand', value: v }));

    if (state.maxPrice < MAX_PRICE) {
      chips.push({ label: `Under ${money(state.maxPrice)}`, type: 'price', value: '' });
    }
    if (state.minRating > 0) {
      chips.push({ label: `${state.minRating}★ & up`, type: 'rating', value: '' });
    }
    if (state.inStockOnly) {
      chips.push({ label: 'In stock only', type: 'stock', value: '' });
    }
    if (state.search.trim()) {
      chips.push({ label: `“${state.search.trim()}”`, type: 'search', value: '' });
    }

    wrap.innerHTML = chips.map(c => `
      <button class="f-chip" data-clear="${c.type}" data-value="${escapeHtml(c.value)}">
        ${escapeHtml(c.label)} <span aria-hidden="true">✕</span>
      </button>`).join('');
  }

  /* ----------------------------------------------------------
     7. RENDER — CART
     ---------------------------------------------------------- */
  function renderCart() {
    const itemsEl = $('#cartItems');
    const totalEl = $('#cartTotal');
    const countEl = $('#cartCount');

    let subtotal = 0;
    let units = 0;

    const rows = [];

    cart.forEach((qty, id) => {
      const p = PRODUCTS.find(x => x.id === id);
      if (!p) return;

      subtotal += p.price * qty;
      units += qty;

      rows.push(`
        <div class="cart-item">
          <img src="${p.image}" alt="${escapeHtml(p.name)}" loading="lazy">
          <div class="cart-item-info">
            <h4>${escapeHtml(p.name)}</h4>
            <p>${money(p.price)}</p>
            <div class="qty">
              <button data-dec="${p.id}" aria-label="Decrease quantity">−</button>
              <span>${qty}</span>
              <button data-inc="${p.id}" aria-label="Increase quantity">+</button>
              <button class="link-danger" data-remove="${p.id}">Remove</button>
            </div>
          </div>
        </div>`);
    });

    if (itemsEl) {
      itemsEl.innerHTML = rows.length
        ? rows.join('')
        : '<div class="empty-cart">Your cart is empty.</div>';
    }
    if (totalEl) totalEl.textContent = money(subtotal);
    if (countEl) countEl.textContent = units;
  }

  function addToCart(id) {
    const p = PRODUCTS.find(x => x.id === id);
    if (!p || p.stock <= 0) return;

    cart.set(id, (cart.get(id) || 0) + 1);
    renderCart();
    toast(`${p.name} added to cart`);
  }

  function changeQty(id, delta) {
    if (!cart.has(id)) return;

    const next = cart.get(id) + delta;

    if (next <= 0) {
      cart.delete(id);
    } else {
      cart.set(id, next);
    }
    renderCart();
  }

  /* ----------------------------------------------------------
     8. VIEW HELPERS
     ---------------------------------------------------------- */
  function openFilters() {
    $('#filters')?.classList.add('open');
    $('#filterBackdrop')?.classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  function closeFilters() {
    $('#filters')?.classList.remove('open');
    $('#filterBackdrop')?.classList.remove('show');
    document.body.style.overflow = '';
  }

  function openCart()  { $('#cartPanel')?.classList.add('active'); }
  function closeCart() { $('#cartPanel')?.classList.remove('active'); }

  function openSearch() {
    $('#searchOverlay')?.classList.add('active');
    setTimeout(() => $('#overlaySearch')?.focus(), 50);
  }

  function closeSearch() { $('#searchOverlay')?.classList.remove('active'); }

  function resetAllFilters() {
    state.pets.clear();
    state.brands.clear();
    state.maxPrice = MAX_PRICE;
    state.minRating = 0;
    state.inStockOnly = false;
    state.search = '';
    state.page = 1;

    // Sync the filter UI
    $$('#filters input[type="checkbox"]').forEach(cb => { cb.checked = false; });
    $$('#filters input[name="rating"]').forEach(r => { r.checked = r.value === '0'; });

    const range = $('#priceRange');
    if (range) range.value = MAX_PRICE;
    const out = $('#priceOut');
    if (out) out.textContent = money(MAX_PRICE);

    const search = $('#shopSearch');
    if (search) search.value = '';

    render();
  }

  /* ----------------------------------------------------------
     9. EVENT WIRING
     ---------------------------------------------------------- */
  function bindEvents() {

    /* --- Filter checkboxes / radios --- */
    const filters = $('#filters');
    if (filters) {
      filters.addEventListener('change', e => {
        const el = e.target;

        if (el.dataset.filter === 'pet') {
          el.checked ? state.pets.add(el.value) : state.pets.delete(el.value);
        } else if (el.dataset.filter === 'brand') {
          el.checked ? state.brands.add(el.value) : state.brands.delete(el.value);
        } else if (el.name === 'rating') {
          state.minRating = parseFloat(el.value) || 0;
        } else if (el.id === 'inStockOnly') {
          state.inStockOnly = el.checked;
        } else {
          return;
        }

        state.page = 1;
        render();
      });
    }

    /* --- Price range --- */
    const range = $('#priceRange');
    if (range) {
      range.addEventListener('input', e => {
        state.maxPrice = Number(e.target.value);
        const out = $('#priceOut');
        if (out) out.textContent = money(state.maxPrice);
        state.page = 1;
        render();
      });
    }

    /* --- Clear all --- */
    $('#clearFilters')?.addEventListener('click', resetAllFilters);

    /* --- Search (with debounce) --- */
    const searchInput = $('#shopSearch');
    if (searchInput) {
      let t;
      searchInput.addEventListener('input', e => {
        const value = e.target.value;
        clearTimeout(t);
        t = setTimeout(() => {
          state.search = value;
          state.page = 1;
          render();
        }, 180);
      });
    }

    /* --- Sort --- */
    $('#sortSelect')?.addEventListener('change', e => {
      state.sort = e.target.value;
      state.page = 1;
      render();
    });

    /* --- View toggle --- */
    $$('.view-toggle button').forEach(btn => {
      btn.addEventListener('click', () => {
        state.view = btn.dataset.view;
        $$('.view-toggle button').forEach(b =>
          b.setAttribute('aria-pressed', String(b === btn))
        );
        render();
      });
    });

    /* --- Pagination --- */
    $('#pager')?.addEventListener('click', e => {
      const btn = e.target.closest('.page-btn');
      if (!btn || btn.disabled) return;

      state.page = Number(btn.dataset.page);
      render();

      const section = document.querySelector('.shop-section');
      if (section) {
        window.scrollTo({
          top: section.offsetTop - 90,
          behavior: 'smooth'
        });
      }
    });

    /* --- Product grid: add to cart + wishlist --- */
    $('#shopGrid')?.addEventListener('click', e => {
      const addBtn = e.target.closest('[data-add]');
      if (addBtn && !addBtn.disabled) {
        addToCart(addBtn.dataset.add);
        return;
      }

      const wishBtn = e.target.closest('[data-wish]');
      if (wishBtn) {
        const saved = wishBtn.textContent.trim() === '♥';
        wishBtn.textContent = saved ? '♡' : '♥';
        wishBtn.style.color = saved ? '' : '#e0574d';
        toast(saved ? 'Removed from saved items' : 'Saved for later');
      }
    });

    /* --- Active filter chips --- */
    $('#activeFilters')?.addEventListener('click', e => {
      const chip = e.target.closest('[data-clear]');
      if (!chip) return;

      const { clear, value } = chip.dataset;

      switch (clear) {
        case 'pet':
          state.pets.delete(value);
          $$('#filters input[data-filter="pet"]').forEach(cb => {
            if (cb.value === value) cb.checked = false;
          });
          break;
        case 'brand':
          state.brands.delete(value);
          $$('#filters input[data-filter="brand"]').forEach(cb => {
            if (cb.value === value) cb.checked = false;
          });
          break;
        case 'price':
          state.maxPrice = MAX_PRICE;
          if (range) range.value = MAX_PRICE;
          if ($('#priceOut')) $('#priceOut').textContent = money(MAX_PRICE);
          break;
        case 'rating':
          state.minRating = 0;
          $$('#filters input[name="rating"]').forEach(r => {
            r.checked = r.value === '0';
          });
          break;
        case 'stock':
          state.inStockOnly = false;
          const stockCb = $('#inStockOnly');
          if (stockCb) stockCb.checked = false;
          break;
        case 'search':
          state.search = '';
          if (searchInput) searchInput.value = '';
          break;
      }

      state.page = 1;
      render();
    });

    /* --- Cart panel --- */
    $('#cartOpen')?.addEventListener('click', openCart);
    $('#cartClose')?.addEventListener('click', closeCart);

    $('#cartItems')?.addEventListener('click', e => {
      const inc = e.target.closest('[data-inc]');
      const dec = e.target.closest('[data-dec]');
      const rm  = e.target.closest('[data-remove]');

      if (inc) changeQty(inc.dataset.inc, 1);
      else if (dec) changeQty(dec.dataset.dec, -1);
      else if (rm) { cart.delete(rm.dataset.remove); renderCart(); }
    });

    /* --- Search overlay --- */
    $('#searchOpen')?.addEventListener('click', openSearch);
    $('#searchClose')?.addEventListener('click', closeSearch);

    $('#searchOverlay')?.addEventListener('click', e => {
      if (e.target.id === 'searchOverlay') closeSearch();
    });

    $('#overlaySearch')?.addEventListener('keydown', e => {
      if (e.key !== 'Enter') return;

      const value = e.target.value;
      if (searchInput) searchInput.value = value;

      state.search = value;
      state.page = 1;
      render();
      closeSearch();

      const section = document.querySelector('.shop-section');
      if (section) window.scrollTo({ top: section.offsetTop - 90, behavior: 'smooth' });
    });

    /* --- Mobile filter drawer --- */
    $('#filtersOpen')?.addEventListener('click', openFilters);
    $('#filtersClose')?.addEventListener('click', closeFilters);
    $('#filterBackdrop')?.addEventListener('click', closeFilters);

    /* --- Mobile nav menu --- */
    $('#menuBtn')?.addEventListener('click', () => {
      $('#navLinks')?.classList.toggle('open');
    });

    /* --- Escape closes any open layer --- */
    document.addEventListener('keydown', e => {
      if (e.key !== 'Escape') return;
      closeSearch();
      closeCart();
      closeFilters();
    });

    /* --- Keep drawer/overlay state sane on resize --- */
    window.addEventListener('resize', () => {
      if (window.innerWidth > 1000) closeFilters();
    });
  }

  /* ----------------------------------------------------------
     10. INIT
     ---------------------------------------------------------- */
  function init() {
    bindEvents();
    render();
    renderCart();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
function toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    const icon = document.getElementById('mobileMenuIcon');
    
    if (menu) {
        menu.classList.toggle('hidden');
        
        // Optional: Toggle between hamburger bars and 'X' close icon
        if (icon) {
            if (menu.classList.contains('hidden')) {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            } else {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-xmark');
            }
        }
    }
}

