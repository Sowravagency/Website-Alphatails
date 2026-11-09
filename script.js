// Homepage Featured Pet Products Data
const homeProducts = [
  {
    id: 'p1',
    name: 'Royal Canin Maxi Adult Dry Dog Food (4 kg)',
    category: 'dogfood',
    categoryLabel: 'Dog Food',
    price: 2890,
    mrp: 3400,
    discount: '15% OFF',
    rating: '4.9',
    image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'p2',
    name: 'Bravecto Chewable Tick & Flea Tablet for Dogs',
    category: 'deworming',
    categoryLabel: 'Deworming & Tick',
    price: 1620,
    mrp: 1800,
    discount: '10% OFF',
    rating: '4.8',
    image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'p3',
    name: 'Pedigree Pro Expert Nutrition Chicken & Rice (3 kg)',
    category: 'dogfood',
    categoryLabel: 'Dog Food',
    price: 1105,
    mrp: 1300,
    discount: '15% OFF',
    rating: '4.7',
    image: 'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'p4',
    name: 'Drontal Plus Tasty Bone Deworming Tablets (Pack of 4)',
    category: 'deworming',
    categoryLabel: 'Deworming & Tick',
    price: 495,
    mrp: 550,
    discount: '10% OFF',
    rating: '4.9',
    image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=600&q=80'
  }
];

let cart = JSON.parse(localStorage.getItem('alphatails_cart') || '[]');

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Hamburger Menu Toggle
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileNav = document.getElementById('mobileNav');
  const hamburgerIcon = document.getElementById('hamburgerIcon');
  const closeIcon = document.getElementById('closeIcon');

  if (mobileMenuBtn && mobileNav) {
    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('open');
      mobileMenuBtn.setAttribute('aria-expanded', isOpen);
      hamburgerIcon.classList.toggle('hidden', isOpen);
      closeIcon.classList.toggle('hidden', !isOpen);
    });
  }

  // 2. Render Homepage Product Preview Grid & Update Cart UI
  renderHomeProducts('all');
  updateCartUI();
});

// Render Products in #productGrid
function renderHomeProducts(filterCat = 'all') {
  const grid = document.getElementById('productGrid');
  if (!grid) return;

  const filtered = filterCat === 'all'
    ? homeProducts
    : homeProducts.filter(item => item.category === filterCat);

  grid.innerHTML = filtered.map(product => `
    <div class="product-card">
      <div>
        <div class="product-image-wrap">
          <img src="${product.image}" alt="${product.name}" onerror="this.src='https://placehold.co/400x300/0f766e/ffffff?text=AlphaTails+Product'">
          <span class="badge-left">★ ${product.rating}</span>
          <span class="badge-right">${product.discount}</span>
        </div>
        <div class="product-info">
          <div class="product-meta">
            <span class="product-cat">${product.categoryLabel}</span>
            <span>In Stock</span>
          </div>
          <h3 class="product-title">${product.name}</h3>
        </div>
      </div>
      <div class="product-footer">
        <div>
          <span class="price-current">₹${product.price.toLocaleString('en-IN')}</span>
          <span class="price-mrp">₹${product.mrp.toLocaleString('en-IN')}</span>
        </div>
        <button onclick="addToCart('${product.id}')" class="add-cart-btn">+ Add</button>
      </div>
    </div>
  `).join('');
}

// Category Tab Filter on Homepage
function filterProducts(category) {
  const tabs = document.querySelectorAll('.shop-tab');
  tabs.forEach(tab => {
    if (tab.dataset.cat === category) {
      tab.className = 'shop-tab px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-[#0f766e] text-white transition';
    } else {
      tab.className = 'shop-tab px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-[#f0fdfa] text-[#023047] border border-[#ccfbf1] hover:bg-[#0f766e]/10 transition';
    }
  });
  renderHomeProducts(category);
}

// Add Item to Cart
function addToCart(productId) {
  const product = homeProducts.find(p => p.id === productId);
  if (!product) return;

  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  saveCart();
  updateCartUI();
  showToast(`${product.name} added to cart!`);
}

// Remove or Update Item Quantity
function changeQty(productId, delta) {
  const index = cart.findIndex(item => item.id === productId);
  if (index === -1) return;

  cart[index].qty += delta;
  if (cart[index].qty <= 0) {
    cart.splice(index, 1);
  }

  saveCart();
  updateCartUI();
}

function saveCart() {
  localStorage.setItem('alphatails_cart', JSON.stringify(cart));
  const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
  localStorage.setItem('alphatails_cart_count', totalCount);
}

function updateCartUI() {
  const cartCountBadge = document.getElementById('cartCount');
  const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);

  if (cartCountBadge) {
    cartCountBadge.textContent = totalCount;
  }

  const cartItemsList = document.getElementById('cartItemsList');
  const cartTotalPrice = document.getElementById('cartTotalPrice');
  if (!cartItemsList || !cartTotalPrice) return;

  if (cart.length === 0) {
    cartItemsList.innerHTML = `
      <div class="text-center py-12 text-slate-400">
        <p class="text-sm font-semibold">Your AlphaTails cart is empty.</p>
      </div>
    `;
    cartTotalPrice.textContent = '₹0';
    return;
  }

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  cartTotalPrice.textContent = `₹${totalAmount.toLocaleString('en-IN')}`;

  cartItemsList.innerHTML = cart.map(item => `
    <div class="flex items-center justify-between gap-3 p-3 rounded-2xl border border-slate-100 bg-slate-50/60">
      <img src="${item.image}" alt="${item.name}" class="w-14 h-14 rounded-xl object-cover shrink-0">
      <div class="flex-1 min-w-0">
        <h4 class="text-xs font-bold text-[#023047] truncate">${item.name}</h4>
        <p class="text-xs font-extrabold text-[#0f766e] mt-0.5">₹${(item.price * item.qty).toLocaleString('en-IN')}</p>
      </div>
      <div class="flex items-center gap-2">
        <button onclick="changeQty('${item.id}', -1)" class="w-7 h-7 rounded-lg bg-white border border-slate-200 font-bold text-xs">-</button>
        <span class="text-xs font-bold w-4 text-center">${item.qty}</span>
        <button onclick="changeQty('${item.id}', 1)" class="w-7 h-7 rounded-lg bg-white border border-slate-200 font-bold text-xs">+</button>
      </div>
    </div>
  `).join('');
}

// Slide-Over Cart Drawer Toggle
function toggleCartDrawer() {
  const drawer = document.getElementById('cartDrawer');
  const backdrop = document.getElementById('cartDrawerBackdrop');
  if (!drawer || !backdrop) return;

  const isClosed = drawer.classList.contains('translate-x-full');
  drawer.classList.toggle('translate-x-full', !isClosed);
  backdrop.classList.toggle('hidden', !isClosed);
}

function checkoutCart() {
  if (cart.length === 0) {
    showToast('Please add items to your cart first.');
    return;
  }
  window.location.href = 'shop.html';
}

// Booking Modal Controls
function closeBookingModal() {
  const modal = document.getElementById('bookingModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

function submitBookingForm(event) {
  event.preventDefault();
  closeBookingModal();
  showToast('Appointment request received! Our team will call you shortly.');
}

// Toast Notification Helper
function showToast(message) {
  const banner = document.getElementById('toastBanner');
  const text = document.getElementById('toastMessage');
  if (!banner || !text) return;

  text.textContent = message;
  banner.classList.remove('hidden');
  banner.classList.add('flex');

  setTimeout(() => {
    banner.classList.add('hidden');
    banner.classList.remove('flex');
  }, 3000);
}
