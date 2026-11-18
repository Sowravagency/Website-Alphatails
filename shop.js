let activeCategory = "all";
let searchQuery = "";
let sortMode = "featured";
let cartItems = []; // Stores current cart items for Supabase checkout

const grid = document.getElementById("productGrid");
const cartCountEl = document.getElementById("cartCount");

// Fetch products from Supabase on page load
let dynamicProducts = [];

document.addEventListener("DOMContentLoaded", async () => {
  await fetchProductsFromSupabase();
  updateCartBadge();
});

async function fetchProductsFromSupabase() {
  try {
    if (typeof supabaseClient !== 'undefined') {
      const { data, error } = await supabaseClient
        .from('products')
        .select('*')
        .eq('is_active', true);

      if (error) {
        console.error('Error fetching products from Supabase:', error);
      } else if (data && data.length > 0) {
        // Map database columns to match frontend properties
        dynamicProducts = data.map(item => ({
          id: item.id,
          name: item.name,
          category: item.category,
          petType: item.pet_category || 'All',
          price: Number(item.price),
          mrp: Number(item.mrp || item.price * 1.2),
          badge: item.badge || 'Bestseller',
          image: item.image_url || 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=600&q=80',
          stock: item.stock
        }));
      }
    }
  } catch (err) {
    console.error('Supabase connection error:', err);
  }

  // Fallback to default products if Supabase table is empty or offline
  if (dynamicProducts.length === 0) {
    dynamicProducts = [
      {
        id: 1,
        name: "AlphaTails Tactical No-Pull Reflective Dog Harness",
        category: "Accessories",
        petType: "Dogs",
        price: 699,
        mrp: 999,
        badge: "Bestseller",
        image: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: 2,
        name: "Natural Neem & Oatmeal Anti-Tick Pet Shampoo (500ml)",
        category: "Grooming",
        petType: "Dogs & Cats",
        price: 380,
        mrp: 475,
        badge: "Top Rated",
        image: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: 3,
        name: "Anti-Skid Double Stainless Steel Pet Feeder Station",
        category: "Bedding",
        petType: "All Pets",
        price: 499,
        mrp: 650,
        badge: "Durable",
        image: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: 4,
        name: "Interactive Feather Teaser Wand with Catnip Bell",
        category: "Toys",
        petType: "Cats",
        price: 249,
        mrp: 349,
        badge: "Popular",
        image: "https://images.unsplash.com/photo-1545249390-6bdfa286032f?auto=format&fit=crop&w=600&q=80"
      }
    ];
  }

  renderProducts();
}

function renderProducts() {
  let filtered = dynamicProducts.filter(product => {
    const matchesCategory = activeCategory === "all" || product.category.toLowerCase() === activeCategory.toLowerCase();
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.petType.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (sortMode === "low-high") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortMode === "high-low") {
    filtered.sort((a, b) => b.price - a.price);
  }

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="empty-state col-span-full text-center py-12">
        <h3 class="text-lg font-bold text-[#023047]">No matching pet accessories found.</h3>
        <p class="text-sm text-slate-500 mt-1">Try clearing your search filter or switching categories.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map(item => {
    const discount = item.mrp > item.price ? Math.round(((item.mrp - item.price) / item.mrp) * 100) : 0;
    return `
      <div class="product-card flex flex-col justify-between bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition">
        <div>
          <div class="product-image-wrap relative bg-slate-100 h-48 overflow-hidden">
            <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover">
            <span class="badge-left absolute top-3 left-3 bg-[#0f766e] text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">${item.badge}</span>
            ${discount > 0 ? `<span class="badge-right absolute top-3 right-3 bg-[#D81B60] text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">${discount}% OFF</span>` : ''}
          </div>
          <div class="product-info p-4">
            <div class="product-meta flex justify-between text-xs text-slate-400 font-semibold mb-1">
              <span class="product-cat text-[#0f766e]">${item.category}</span>
              <span>For ${item.petType}</span>
            </div>
            <h2 class="product-title font-bold text-[#023047] text-sm line-clamp-2">${item.name}</h2>
          </div>
        </div>

        <div class="product-footer p-4 pt-0 flex items-center justify-between mt-auto">
          <div>
            <span class="price-current font-extrabold text-[#023047] text-base">₹${item.price}</span>
            ${item.mrp ? `<span class="price-mrp text-xs text-slate-400 line-through ml-1.5">₹${item.mrp}</span>` : ''}
          </div>
          <button class="add-cart-btn bg-[#0f766e] hover:bg-[#0b5b54] text-white text-xs font-bold px-3 py-2 rounded-xl transition shadow-sm" onclick="addToCart('${item.id}')">
            + Add to Cart
          </button>
        </div>
      </div>
    `;
  }).join("");
}

function addToCart(productId) {
  const product = dynamicProducts.find(p => p.id == productId);
  if (!product) return;

  cartItems = JSON.parse(localStorage.getItem('alphatails_cart') || '[]');
  
  const existingIndex = cartItems.findIndex(item => item.id == productId);
  if (existingIndex > -1) {
    cartItems[existingIndex].qty += 1;
  } else {
    cartItems.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      qty: 1
    });
  }

  localStorage.setItem('alphatails_cart', JSON.stringify(cartItems));
  updateCartBadge();
  
  // Optional toast notification
  alert(`Added "${product.name}" to your cart!`);
}

function updateCartBadge() {
  cartItems = JSON.parse(localStorage.getItem('alphatails_cart') || '[]');
  const totalCount = cartItems.reduce((sum, item) => sum + item.qty, 0);
  if (cartCountEl) {
    cartCountEl.textContent = totalCount;
  }
  localStorage.setItem('alphatails_cart_count', totalCount);
}

// Function to handle Checkout & save order directly to Supabase shop_orders table
async function checkoutOrder(customerDetails) {
  cartItems = JSON.parse(localStorage.getItem('alphatails_cart') || '[]');
  if (cartItems.length === 0) {
    alert('Your cart is empty!');
    return false;
  }

  const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const orderRef = 'ORD-' + Math.floor(100000 + Math.random() * 900000);

  const orderPayload = {
    order_ref: orderRef,
    customer_name: customerDetails.name,
    phone: customerDetails.phone,
    email: customerDetails.email || null,
    delivery_address: customerDetails.address,
    city: customerDetails.city || 'Tirupati',
    pincode: customerDetails.pincode || '',
    items: cartItems,
    total_amount: totalAmount,
    payment_method: customerDetails.paymentMethod || 'COD',
    payment_status: customerDetails.paymentMethod === 'Online' ? 'Paid' : 'Pending',
    order_status: 'Processing'
  };

  try {
    if (typeof supabaseClient !== 'undefined') {
      const { data, error } = await supabaseClient
        .from('shop_orders')
        .insert([orderPayload]);

      if (error) {
        console.error('Supabase Order Insert Error:', error);
        throw error;
      }
    }

    // Save backup to LocalStorage for Admin Dashboard
    const localOrders = JSON.parse(localStorage.getItem('alphatails_orders') || '[]');
    localOrders.unshift(orderPayload);
    localStorage.setItem('alphatails_orders', JSON.stringify(localOrders));

    // Clear Cart
    localStorage.removeItem('alphatails_cart');
    localStorage.setItem('alphatails_cart_count', '0');
    updateCartBadge();

    return orderRef;
  } catch (err) {
    console.error('Checkout failed:', err);
    alert('Order submission failed. Please try again.');
    return false;
  }
}

// Category Filter Listeners
document.querySelectorAll(".filter-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    activeCategory = btn.getAttribute("data-cat");
    renderProducts();
  });
});

// Search Listener
const searchInput = document.getElementById("searchInput");
if (searchInput) {
  searchInput.addEventListener("input", e => {
    searchQuery = e.target.value;
    renderProducts();
  });
}

// Sort Listener
const sortSelect = document.getElementById("sortSelect");
if (sortSelect) {
  sortSelect.addEventListener("change", e => {
    sortMode = e.target.value;
    renderProducts();
  });
}

// Mobile Menu Toggle Logic
const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const mobileMenu = document.getElementById("mobileMenu");
const menuIconOpen = document.getElementById("menuIconOpen");
const menuIconClose = document.getElementById("menuIconClose");

if (mobileMenuBtn && mobileMenu) {
  mobileMenuBtn.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.toggle("open");
    mobileMenuBtn.setAttribute("aria-expanded", isOpen);
    if (menuIconOpen) menuIconOpen.classList.toggle("hidden", isOpen);
    if (menuIconClose) menuIconClose.classList.toggle("hidden", !isOpen);
  });

  mobileMenu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("open");
      mobileMenuBtn.setAttribute("aria-expanded", "false");
      if (menuIconOpen) menuIconOpen.classList.remove("hidden");
      if (menuIconClose) menuIconClose.classList.add("hidden");
    });
  });
}
