// Tailwind Configuration
tailwind.config = {
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
            },
            colors: {
                alpha: {
                    teal: '#00796B',
                    tealDark: '#005b4f',
                    cyanLight: '#E0F7FA',
                    cyanSoft: '#F2FBFB',
                    navy: '#023047',
                    pastelPink: '#FCE4EC',
                    pastelMint: '#E8F5E9',
                    pastelPeach: '#FFF3E0',
                    pastelLavender: '#EDE7F6',
                    pastelYellow: '#FFF8E1',
                    pastelBlue: '#E3F2FD',
                    pastelCoral: '#FFEBEE'
                }
            },
            boxShadow: {
                'card': '0 10px 35px -5px rgba(2, 48, 71, 0.06), 0 4px 15px -3px rgba(2, 48, 71, 0.03)',
                'service': '0 4px 12px rgba(0, 121, 107, 0.05)',
                'service-hover': '0 12px 24px -4px rgba(0, 121, 107, 0.14)',
            }
        }
    }
};

// Shop Catalog
const products = [
    {
        id: 1,
        name: "Royal Canin Maxi Adult Dog Food (4 kg)",
        category: "dogfood",
        badge: "15% Off",
        badgeBg: "bg-[#D4EFDF] text-[#1E8449]",
        price: 2890,
        oldPrice: 3400,
        image: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 2,
        name: "Simparica Trio Chewable Tick & Flea Tablet",
        category: "deworming",
        badge: "10% Off",
        badgeBg: "bg-[#EDE7F6] text-[#5E35B1]",
        price: 945,
        oldPrice: 1050,
        image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 3,
        name: "Alphatails Orthopedic Padded Dog Harness",
        category: "accessories",
        badge: "10% Off",
        badgeBg: "bg-[#F3E5F5] text-[#8E24AA]",
        price: 899,
        oldPrice: 999,
        image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 4,
        name: "Drontal Plus Broad-Spectrum Dewormer (Pack of 4)",
        category: "deworming",
        badge: "10% Off",
        badgeBg: "bg-[#EDE7F6] text-[#5E35B1]",
        price: 432,
        oldPrice: 480,
        image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 5,
        name: "Farmina N&D Ancestral Grain Puppy Chicken & Pomegranate",
        category: "dogfood",
        badge: "15% Off",
        badgeBg: "bg-[#D4EFDF] text-[#1E8449]",
        price: 2295,
        oldPrice: 2700,
        image: "https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 6,
        name: "Frontline Plus Spot-On Tick & Lice Drops (3 Pipettes)",
        category: "deworming",
        badge: "10% Off",
        badgeBg: "bg-[#EDE7F6] text-[#5E35B1]",
        price: 1170,
        oldPrice: 1300,
        image: "https://images.unsplash.com/photo-1583512603805-3cc6b41f3edb?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 7,
        name: "Engraved QR Smart Pet Collar & ID Shield Tag",
        category: "accessories",
        badge: "10% Off",
        badgeBg: "bg-[#F3E5F5] text-[#8E24AA]",
        price: 539,
        oldPrice: 599,
        image: "https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 8,
        name: "Alphatails Salmon Oil & Multivitamin Coat Chews",
        category: "dogfood",
        badge: "15% Off",
        badgeBg: "bg-[#D4EFDF] text-[#1E8449]",
        price: 679,
        oldPrice: 799,
        image: "https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?auto=format&fit=crop&w=600&q=80"
    }
];

// FIXED: Initialized as an empty array so no products appear in cart by default
let cart = [];

function renderProducts(category = 'all') {
    const grid = document.getElementById('productGrid');
    const filtered = category === 'all' ? products : products.filter(p => p.category === category);
    
    grid.innerHTML = filtered.map(product => `
        <div class="bg-white rounded-3xl p-4 border border-slate-100 shadow-card flex flex-col justify-between group hover:-translate-y-1 transition">
            <div>
                <div class="relative h-44 rounded-2xl overflow-hidden bg-slate-50 mb-4">
                    <img src="${product.image}" 
                         onerror="this.src='https://placehold.co/400x300/E0F7FA/023047?text=Alphatails+Shop'"
                         alt="${product.name}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
                    <span class="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-bold ${product.badgeBg}">
                        ${product.badge}
                    </span>
                </div>
                <h3 class="text-sm font-extrabold text-[#023047] line-clamp-2 mb-2">${product.name}</h3>
            </div>
            <div class="pt-2 flex items-center justify-between border-t border-slate-100">
                <div>
                    <span class="text-lg font-extrabold text-[#023047]">₹${product.price}</span>
                    <span class="text-xs text-slate-400 line-through ml-1">₹${product.oldPrice}</span>
                </div>
                <button onclick="addToCart(${product.id})" class="px-3.5 py-2 rounded-xl bg-[#E0F7FA] hover:bg-[#00796B] text-[#00796B] hover:text-white font-bold text-xs transition">
                    + Add
                </button>
            </div>
        </div>
    `).join('');
}

function filterProducts(category) {
    document.querySelectorAll('.shop-tab').forEach(btn => {
        if (btn.dataset.cat === category) {
            btn.className = "shop-tab px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-[#00796B] text-white transition";
        } else {
            btn.className = "shop-tab px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-[#E0F7FA] text-[#023047] hover:bg-[#00796B]/10 transition";
        }
    });
    renderProducts(category);
}

function scrollToShopCategory(category) {
    filterProducts(category);
    document.getElementById('shop').scrollIntoView({ behavior: 'smooth' });
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    const existing = cart.find(item => item.id === productId);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ id: product.id, name: product.name, price: product.price, image: product.image qty: 1 });
    }
    updateCartUI();
    showToast(`Added "${product.name}" to your Alphatails cart!`);
}

function changeQty(id, delta) {
    const item = cart.find(i => i.id === id);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) {
        cart = cart.filter(i => i.id !== id);
    }
    updateCartUI();
}

function updateCartUI() {
    const countBadge = document.getElementById('cartCountBadge');
    const listEl = document.getElementById('cartItemsList');
    const totalEl = document.getElementById('cartTotalPrice');

    const totalItems = cart.reduce((sum, i) => sum + i.qty, 0);
    const totalPrice = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

    countBadge.textContent = totalItems;
    
    if (totalItems === 0) {
        countBadge.classList.add('hidden');
        countBadge.classList.remove('flex');
    } else {
        countBadge.classList.remove('hidden');
        countBadge.classList.add('flex');
    }

    totalEl.textContent = `₹${totalPrice.toLocaleString('en-IN')}`;

    if (cart.length === 0) {
        listEl.innerHTML = `
            <div class="text-center py-12 text-slate-400">
                <p class="text-sm font-semibold">Your Alphatails cart is empty.</p>
                <p class="text-xs mt-1">Add Dog Food, Deworming tablets, or Accessories!</p>
            </div>
        `;
        return;
    }

    // Added the image tag layout here
    listEl.innerHTML = cart.map(item => `
        <div class="flex items-center justify-between gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
            <img src="${item.image}" alt="${item.name}" class="w-12 h-12 rounded-xl object-cover shrink-0">
            <div class="flex-1 min-w-0">
                <h4 class="text-xs font-extrabold text-[#023047] truncate">${item.name}</h4>
                <p class="text-xs font-bold text-[#00796B] mt-0.5">₹${item.price} each</p>
            </div>
            <div class="flex items-center gap-2 shrink-0">
                <button onclick="changeQty(${item.id}, -1)" class="w-7 h-7 rounded-lg bg-white border border-slate-200 font-bold text-xs">-</button>
                <span class="text-xs font-extrabold w-4 text-center">${item.qty}</span>
                <button onclick="changeQty(${item.id}, 1)" class="w-7 h-7 rounded-lg bg-white border border-slate-200 font-bold text-xs">+</button>
            </div>
        </div>
    `).join('');
}
    listEl.innerHTML = cart.map(item => `
        <div class="flex items-center justify-between gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
            <div class="flex-1">
                <h4 class="text-xs font-extrabold text-[#023047]">${item.name}</h4>
                <p class="text-xs font-bold text-[#00796B] mt-0.5">₹${item.price} each</p>
            </div>
            <div class="flex items-center gap-2">
                <button onclick="changeQty(${item.id}, -1)" class="w-7 h-7 rounded-lg bg-white border border-slate-200 font-bold text-xs">-</button>
                <span class="text-xs font-extrabold w-4 text-center">${item.qty}</span>
                <button onclick="changeQty(${item.id}, 1)" class="w-7 h-7 rounded-lg bg-white border border-slate-200 font-bold text-xs">+</button>
            </div>
        </div>
    `).join('');
}

function toggleCartDrawer() {
    const drawer = document.getElementById('cartDrawer');
    const backdrop = document.getElementById('cartDrawerBackdrop');
    const isHidden = drawer.classList.contains('translate-x-full');
    if (isHidden) {
        drawer.classList.remove('translate-x-full');
        backdrop.classList.remove('hidden');
    } else {
        drawer.classList.add('translate-x-full');
        backdrop.classList.add('hidden');
    }
}

function checkoutCart() {
    if (cart.length === 0) {
        showToast("Please add at least one pet product first!");
        return;
    }
    cart = [];
    updateCartUI();
    toggleCartDrawer();
    showToast("Order confirmed! Your Alphatails pharmacy items will arrive in 90 mins.");
}

// Grooming & Boarding Tab Switcher
function switchSpaTab(tab) {
    const groomingPanel = document.getElementById('groomingPanel');
    const boardingPanel = document.getElementById('boardingPanel');
    const groomingBtn = document.getElementById('tabGroomingBtn');
    const boardingBtn = document.getElementById('tabBoardingBtn');

    if (tab === 'grooming') {
        groomingPanel.classList.remove('hidden');
        groomingPanel.classList.add('grid');
        boardingPanel.classList.add('hidden');
        boardingPanel.classList.remove('grid');
        groomingBtn.className = "px-5 py-2.5 rounded-xl text-sm font-bold bg-[#00796B] text-white shadow-sm transition";
        boardingBtn.className = "px-5 py-2.5 rounded-xl text-sm font-bold text-[#023047] hover:text-[#00796B] transition";
    } else {
        boardingPanel.classList.remove('hidden');
        boardingPanel.classList.add('grid');
        groomingPanel.classList.add('hidden');
        groomingPanel.classList.remove('grid');
        boardingBtn.className = "px-5 py-2.5 rounded-xl text-sm font-bold bg-[#00796B] text-white shadow-sm transition";
        groomingBtn.className = "px-5 py-2.5 rounded-xl text-sm font-bold text-[#023047] hover:text-[#00796B] transition";
    }
}

// Booking Modal Controls
function openBookingModal(serviceName) {
    const modal = document.getElementById('bookingModal');
    const select = document.getElementById('bookingServiceInput');
    const modeSelect = document.getElementById('visitModeInput');

    let found = false;
    for (let i = 0; i < select.options.length; i++) {
        if (select.options[i].value === serviceName) {
            select.selectedIndex = i;
            found = true;
            break;
        }
    }
    if (!found && serviceName) {
        const opt = document.createElement('option');
        opt.value = serviceName;
        opt.textContent = serviceName;
        select.appendChild(opt);
        select.value = serviceName;
    }

    if (serviceName && serviceName.toLowerCase().includes('home')) {
        modeSelect.value = "At-Home Doorstep Visit";
    } else {
        modeSelect.value = "Alphatails Clinic Visit";
    }

    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

function closeBookingModal() {
    const modal = document.getElementById('bookingModal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}

function submitBookingForm(e) {
    e.preventDefault();
    const service = document.getElementById('bookingServiceInput').value;
    const name = document.getElementById('parentNameInput').value;
    const mode = document.getElementById('visitModeInput').value;
    closeBookingModal();
    showToast(`Thank you, ${name}! Your ${service} (${mode}) is booked with Alphatails.`);
    e.target.reset();
}

// Article & Clinic Info Modal
function openArticleModal(title, author, content) {
    document.getElementById('infoModalTag').textContent = `BY ${author.toUpperCase()}`;
    document.getElementById('infoModalTitle').textContent = title;
    document.getElementById('infoModalBody').textContent = content;
    const modal = document.getElementById('infoModal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

function openClinicModal() {
    document.getElementById('infoModalTag').textContent = '15+ ALPHATAILS CLINICS OPEN 24/7';
    document.getElementById('infoModalTitle').textContent = 'Find Your Nearest Alphatails Pet Hospital';
    document.getElementById('infoModalBody').textContent = 'Our flagship 24/7 Veterinary Hospitals & Grooming Spas are equipped with digital X-ray, in-house pathology, and pastel cat/dog zones. Book online for 0-minute wait times or request a Vet at Home anywhere in the city for ₹399.';
    const modal = document.getElementById('infoModal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

function closeInfoModal() {
    const modal = document.getElementById('infoModal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}

function toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    menu.classList.toggle('hidden');
}

function showToast(message) {
    const banner = document.getElementById('toastBanner');
    const text = document.getElementById('toastMessage');
    text.textContent = message;
    banner.classList.remove('hidden');
    banner.classList.add('flex');
    setTimeout(() => {
        banner.classList.add('hidden');
        banner.classList.remove('flex');
    }, 4200);
}

// Set default date to today & initialize shop
window.onload = function () {
    const dateInput = document.getElementById('dateInput');
    if (dateInput) {
        dateInput.valueAsDate = new Date();
    }
    renderProducts('all');
    updateCartUI();
};
