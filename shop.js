const defaultProducts = [
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
  },
  {
    id: 5,
    name: "One-Click Self-Cleaning Deshedding Slicker Brush",
    category: "Grooming",
    petType: "Dogs & Cats",
    price: 349,
    mrp: 499,
    badge: "Essential",
    image: "https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 6,
    name: "Heavy-Duty Natural Rubber Dental Chew Bone",
    category: "Toys",
    petType: "Dogs",
    price: 299,
    mrp: 399,
    badge: "Tough Chew",
    image: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 7,
    name: "AlphaTails Orthopedic Plush Bolster Pet Lounger Bed",
    category: "Bedding",
    petType: "Dogs & Cats",
    price: 1499,
    mrp: 1999,
    badge: "Comfort+",
    image: "https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 8,
    name: "Breakaway Velvet Cat Collar with Engraved ID Ring",
    category: "Accessories",
    petType: "Cats",
    price: 199,
    mrp: 299,
    badge: "New Arrival",
    image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80"
  }
];

let activeCategory = "all";
let searchQuery = "";
let sortMode = "featured";
let cartTotalItems = 0;

const grid = document.getElementById("productGrid");
const cartCountEl = document.getElementById("cartCount");

function renderProducts() {
  let filtered = defaultProducts.filter(product => {
    const matchesCategory = activeCategory === "all" || product.category === activeCategory;
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
      <div class="empty-state">
        <h3>No matching pet accessories found.</h3>
        <p>Try clearing your search filter or switching categories.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map(item => {
    const discount = Math.round(((item.mrp - item.price) / item.mrp) * 100);
    return `
      <div class="product-card">
        <div>
          <div class="product-image-wrap">
            <img src="${item.image}" alt="${item.name}">
            <span class="badge-left">${item.badge}</span>
            <span class="badge-right">${discount}% OFF</span>
          </div>
          <div class="product-info">
            <div class="product-meta">
              <span class="product-cat">${item.category}</span>
              <span>For ${item.petType}</span>
            </div>
            <h2 class="product-title">${item.name}</h2>
          </div>
        </div>

        <div class="product-footer">
          <div>
            <span class="price-current">₹${item.price}</span>
            <span class="price-mrp">₹${item.mrp}</span>
          </div>
          <button class="add-cart-btn" onclick="addToCart(${item.id})">
            + Add to Cart
          </button>
        </div>
      </div>
    `;
  }).join("");
}

function addToCart(productId) {
  cartTotalItems++;
  cartCountEl.textContent = cartTotalItems;
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
document.getElementById("searchInput").addEventListener("input", e => {
  searchQuery = e.target.value;
  renderProducts();
});

// Sort Listener
document.getElementById("sortSelect").addEventListener("change", e => {
  sortMode = e.target.value;
  renderProducts();
});

// Mobile Menu Toggle Logic
const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const mobileMenu = document.getElementById("mobileMenu");
const menuIconOpen = document.getElementById("menuIconOpen");
const menuIconClose = document.getElementById("menuIconClose");

if (mobileMenuBtn && mobileMenu) {
  mobileMenuBtn.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.toggle("open");
    mobileMenuBtn.setAttribute("aria-expanded", isOpen);
    menuIconOpen.classList.toggle("hidden", isOpen);
    menuIconClose.classList.toggle("hidden", !isOpen);
  });

  // Close mobile menu automatically when a link is clicked
  mobileMenu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("open");
      mobileMenuBtn.setAttribute("aria-expanded", "false");
      menuIconOpen.classList.remove("hidden");
      menuIconClose.classList.add("hidden");
    });
  });
}

// Initial Render
renderProducts();
