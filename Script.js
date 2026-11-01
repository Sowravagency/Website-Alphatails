// Alphatails Pharmacy & Store Catalog Data
const catalog = [
    {
        id: 1,
        name: "Alphatails Salmon & Brown Rice Adult Dog Food (3kg)",
        category: "food",
        tag: "15% Off",
        price: 1299,
        mrp: 1529,
        bg: "bg-[#FFEFE5]",
        iconColor: "text-orange-600",
        icon: "fa-bone",
        desc: "Omega-3 & 6 enriched formula for sensitive skin and glossy coat."
    },
    {
        id: 2,
        name: "Grain-Free Kitten & Mother Cat Chicken Mousse (1.5kg)",
        category: "food",
        tag: "Bestseller",
        price: 899,
        mrp: 999,
        bg: "bg-[#FFF3E0]",
        iconColor: "text-amber-600",
        icon: "fa-fish",
        desc: "High-protein weaning & immunity formula fortified with taurine."
    },
    {
        id: 3,
        name: "Spot-On Tick & Flea Pipette for Dogs (3 Pipettes)",
        category: "health",
        tag: "10% Off",
        price: 549,
        mrp: 610,
        bg: "bg-[#EDE7F6]",
        iconColor: "text-purple-700",
        icon: "fa-shield-dog",
        desc: "30-day waterproof veterinary protection against ticks, fleas & lice."
    },
    {
        id: 4,
        name: "Broad-Spectrum Deworming Chewable Tablets (Pack of 4)",
        category: "health",
        tag: "Vet Choice",
        price: 299,
        mrp: 340,
        bg: "bg-[#E0F2F1]",
        iconColor: "text-[#00796B]",
        icon: "fa-capsules",
        desc: "Liver-flavored single-dose dewormer safe for dogs & puppies."
    },
    {
        id: 5,
        name: "Gut-Probiotic & Digestive Enzyme Powder (100g)",
        category: "health",
        tag: "New",
        price: 425,
        mrp: 499,
        bg: "bg-[#E1F5FE]",
        iconColor: "text-sky-700",
        icon: "fa-prescription-bottle-medical",
        desc: "Restores gut flora during antibiotic therapy or diet changes."
    },
    {
        id: 6,
        name: "Oatmeal & Tea Tree Anti-Itch Pet Shampoo (300ml)",
        category: "grooming",
        tag: "Spa Grade",
        price: 475,
        mrp: 550,
        bg: "bg-[#FCE4EC]",
        iconColor: "text-pink-600",
        icon: "fa-pump-soap",
        desc: "Soap-free pH-balanced calming wash used at Alphatails Grooming Studio."
    },
    {
        id: 7,
        name: "Self-Cleaning Slicker Deshedding Brush",
        category: "grooming",
        tag: "10% Off",
        price: 399,
        mrp: 449,
        bg: "bg-[#F3E5F5]",
        iconColor: "text-fuchsia-700",
        icon: "fa-brush",
        desc: "Gentle coated pins remove loose undercoat without scratching skin."
    },
    {
        id: 8,
        name: "Orthopedic Padded No-Pull Mesh Harness & Leash",
        category: "accessories",
        tag: "15% Off",
        price: 799,
        mrp: 949,
        bg: "bg-[#E0F7FA]",
        iconColor: "text-[#00796B]",
        icon: "fa-paw",
        desc: "Reflective chest strap with breathable air-mesh padding for daily walks."
    }
];

let activeCategory = "all";
let cart = [];

// Render filtered and sorted products
function renderCatalog() {
    const searchQuery = document.getElementById("searchInput").value.toLowerCase().trim();
    const sortType = document.getElementById("sortSelect").value;
    const grid = document.getElementById("productsGrid");
    const emptyState = document.getElementById("emptyState");

    let filtered = catalog.filter(item => {
        const matchesCategory = activeCategory === "all" || item.category === activeCategory;
        const matchesSearch =
            item.name.toLowerCase().includes(searchQuery) ||
            item.desc.toLowerCase().includes(searchQuery);
        return matchesCategory && matchesSearch;
    });

    if (sortType === "low-high") filtered.sort((a, b) => a.price - b.price);
    if (sortType === "high-low") filtered.sort((a, b) => b.price - a.price);

    if (filtered.length === 0) {
        grid.innerHTML = "";
        emptyState.classList.remove("hidden");
        return;
    }

    emptyState.classList.add("hidden");
    grid.innerHTML = filtered.map(item => `
        <div class="shop-product-card">
            <div>
                <div class="flex items-center justify-between mb-3">
                    <span class="px-3 py-1 rounded-full bg-[#E0F2F1] text-[#00796B] text-[11px] font-extrabold">${item.tag}</span>
                    <span class="text-[11px] font-bold uppercase text-slate-400">${item.category}</span>
                </div>
                <div class="h-36 rounded-2xl ${item.bg} ${item.iconColor} flex items-center justify-center text-5xl mb-4">
                    <i class="fa-solid ${item.icon}"></i>
                </div>
                <h3 class="font-extrabold text-[#023047] text-base leading-snug mb-1.5">${item.name}</h3>
                <p class="text-xs text-slate-500 leading-relaxed mb-4">${item.desc}</p>
            </div>
            <div class="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                    <span class="text-lg font-extrabold text-[#023047]">₹${item.price}</span>
                    <span class="text-xs text-slate-400 line-through ml-1">₹${item.mrp}</span>
                </div>
                <button onclick="addToCart(${item.id})" class="px-4 py-2.5 rounded-xl bg-[#00796B] hover:bg-[#005b4f] text-white text-xs font-extrabold transition flex items-center gap-1.5">
                    <i class="fa-solid fa-plus"></i> Add
                </button>
            </div>
        </div>
    `).join("");
}

// Switch active category tab
function setCategory(category, btnEl) {
    activeCategory = category;
    document.querySelectorAll(".cat-btn").forEach(btn => btn.classList.remove("active"));
    if (btnEl) {
        btnEl.classList.add("active");
    }
    renderCatalog();
}

// Trigger search or sort update
function applyFilters() {
    renderCatalog();
}

// Reset all filters to default
function resetFilters() {
    document.getElementById("searchInput").value = "";
    document.getElementById("sortSelect").value = "featured";
    setCategory("all", document.querySelectorAll(".cat-btn")[0]);
}

// Add product to shopping bag
function addToCart(productId) {
    const product = catalog.find(p => p.id === productId);
    const existing = cart.find(item => item.id === productId);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ ...product, qty: 1 });
    }
    updateCartUI();
    showToast(`Added "${product.name}" to bag!`);
}

// Increment or decrement item quantity
function changeQty(productId, delta) {
    const item = cart.find(i => i.id === productId);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) {
        cart = cart.filter(i => i.id !== productId);
    }
    updateCartUI();
}

// Refresh cart badge, drawer items, and total price
function updateCartUI() {
    const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

    document.getElementById("cartCountBadge").textContent = totalCount;
    document.getElementById("cartTotalAmount").textContent = `₹${totalPrice}`;
    document.getElementById("modalOrderTotal").textContent = `₹${totalPrice}`;
    document.getElementById("checkoutBtn").disabled = cart.length === 0;

    const container = document.getElementById("cartItemsContainer");
    if (cart.length === 0) {
        container.innerHTML = `
            <div class="text-center py-16 text-slate-400">
                <i class="fa-solid fa-bag-shopping text-4xl mb-3 text-slate-300"></i>
                <p class="text-sm font-bold text-[#023047]">Your Alphatails bag is empty</p>
                <p class="text-xs mt-1">Add vet-approved food, tick care, or accessories.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = cart.map(item => `
        <div class="flex items-center justify-between gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <div class="w-12 h-12 rounded-xl ${item.bg} ${item.iconColor} flex items-center justify-center text-xl flex-shrink-0">
                <i class="fa-solid ${item.icon}"></i>
            </div>
            <div class="flex-1 min-w-0">
                <h4 class="text-xs font-extrabold text-[#023047] truncate">${item.name}</h4>
                <p class="text-xs font-bold text-[#00796B]">₹${item.price} × ${item.qty} = ₹${item.price * item.qty}</p>
            </div>
            <div class="flex items-center gap-2">
                <button onclick="changeQty(${item.id}, -1)" class="w-7 h-7 rounded-lg bg-white border border-slate-200 font-bold text-xs">-</button>
                <span class="text-xs font-extrabold w-4 text-center">${item.qty}</span>
                <button onclick="changeQty(${item.id}, 1)" class="w-7 h-7 rounded-lg bg-white border border-slate-200 font-bold text-xs">+</button>
            </div>
        </div>
    `).join("");
}

// Open or close slide-out cart drawer
function toggleCartDrawer(open) {
    const drawer = document.getElementById("cartDrawer");
    const backdrop = document.getElementById("cartDrawerBackdrop");
    if (open) {
        backdrop.classList.remove("hidden");
        drawer.classList.remove("translate-x-full");
    } else {
        backdrop.classList.add("hidden");
        drawer.classList.add("translate-x-full");
    }
}

// Open checkout modal
function openCheckoutModal() {
    toggleCartDrawer(false);
    const modal = document.getElementById("checkoutModal");
    modal.classList.remove("hidden");
    modal.classList.add("flex");
}

// Close checkout modal
function closeCheckoutModal() {
    const modal = document.getElementById("checkoutModal");
    modal.classList.add("hidden");
    modal.classList.remove("flex");
}

// Handle order form submission
function submitShopOrder(event) {
    event.preventDefault();
    const name = document.getElementById("custName").value;
    closeCheckoutModal();
    cart = [];
    updateCartUI();
    event.target.reset();
    showToast(`Thank you ${name}! Your Alphatails order is confirmed.`);
}

// Display toast notification
function showToast(msg) {
    const toast = document.getElementById("toast");
    document.getElementById("toastMsg").textContent = msg;
    toast.classList.remove("opacity-0");
    setTimeout(() => toast.classList.add("opacity-0"), 3000);
}

// Initialize shop on page load
document.addEventListener("DOMContentLoaded", () => {
    renderCatalog();
    updateCartUI();
});
