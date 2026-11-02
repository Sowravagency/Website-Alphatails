// Sub-category rules based on Main Category
const CATEGORY_RULES = {
  "Dry Food": ["Cat", "Dog", "Puppy", "Kitten"],
  "Medicines": ["Cat", "Dog"],
  "Gravy": ["Cat", "Dog", "Puppy", "Kitten"],
  "Gravies": ["Cat", "Dog", "Puppy", "Kitten"]
};

// Default Sample Data
let bookings = JSON.parse(localStorage.getItem("clinic_bookings")) || [
  {
    id: "BK-101",
    owner: "Karthik Rao",
    pet: "Max (Golden Retriever)",
    service: "Full Grooming & Bath",
    date: "2026-11-05",
    time: "11:00",
    status: "Pending"
  },
  {
    id: "BK-102",
    owner: "Ananya Sharma",
    pet: "Milo (Persian Cat)",
    service: "Vaccination",
    date: "2026-11-06",
    time: "16:30",
    status: "Confirmed"
  }
];

let inventory = JSON.parse(localStorage.getItem("clinic_inventory")) || [
  {
    id: 1,
    sku: "DR-DOG-101",
    name: "Adult Chicken & Egg Maintenance",
    company: "Drools",
    category: "Dry Food",
    subCategory: "Dog",
    breed: "Medium Breed",
    size: "3 kg",
    expiry: "2027-08-15",
    price: 750,
    stock: 15
  },
  {
    id: 2,
    sku: "MED-CAT-204",
    name: "Spot-On Tick & Flea Solution",
    company: "Hatvet Pharma",
    category: "Medicines",
    subCategory: "Cat",
    breed: "",
    size: "15 ml",
    expiry: "2027-05-01",
    price: 320,
    stock: 25
  }
];

// Initialize App
document.addEventListener("DOMContentLoaded", () => {
  renderBookings();
  renderInventory();
  renderShop();
});

// Navigation Tab Switcher
function switchTab(tabName) {
  document.querySelectorAll(".panel").forEach(p => p.classList.remove("active"));
  document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));

  document.getElementById(`${tabName}-section`).classList.add("active");
  const buttons = document.querySelectorAll(".tab-btn");
  if (tabName === "bookings") buttons[0].classList.add("active");
  if (tabName === "inventory") buttons[1].classList.add("active");
  if (tabName === "shop") buttons[2].classList.add("active");
}

/* ==========================================
   BOOKINGS LOGIC
   ========================================== */
function toggleNewBookingForm() {
  document.getElementById("new-booking-form").classList.toggle("hidden");
}

function addBooking(e) {
  e.preventDefault();
  const newBk = {
    id: "BK-" + Math.floor(100 + Math.random() * 900),
    owner: document.getElementById("b-owner").value,
    pet: document.getElementById("b-pet").value,
    service: document.getElementById("b-service").value,
    date: document.getElementById("b-date").value,
    time: document.getElementById("b-time").value,
    status: "Pending"
  };

  bookings.unshift(newBk);
  saveAndRenderBookings();
  e.target.reset();
  toggleNewBookingForm();
}

function updateBookingStatus(id, newStatus) {
  const bk = bookings.find(b => b.id === id);
  if (bk) {
    bk.status = newStatus;
    saveAndRenderBookings();
  }
}

// Show Calendar when clicking Postpone
function openPostponeCalendar(id) {
  const box = document.getElementById(`postpone-box-${id}`);
  if (box) {
    box.classList.toggle("hidden");
  }
}

function confirmPostponeDate(id) {
  const dateInput = document.getElementById(`new-date-${id}`);
  if (!dateInput.value) {
    alert("Please select a new date from the calendar.");
    return;
  }

  const bk = bookings.find(b => b.id === id);
  if (bk) {
    bk.date = dateInput.value;
    bk.status = "Postponed";
    saveAndRenderBookings();
  }
}

function saveAndRenderBookings() {
  localStorage.setItem("clinic_bookings", JSON.stringify(bookings));
  renderBookings();
}

function renderBookings() {
  const tbody = document.getElementById("bookings-list");
  tbody.innerHTML = "";

  bookings.forEach(b => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>${b.id}</strong></td>
      <td>
        <div><strong>${b.owner}</strong></div>
        <div style="font-size:12px; color:#64748b;">${b.pet}</div>
      </td>
      <td>${b.service}</td>
      <td>
        <div><strong>${b.date}</strong></div>
        <div style="font-size:12px; color:#64748b;">${b.time}</div>
      </td>
      <td><span class="status-pill status-${b.status}">${b.status}</span></td>
      <td>
        <div class="action-group">
          <button class="btn-sm btn-confirm" onclick="updateBookingStatus('${b.id}', 'Confirmed')">Confirm</button>
          <button class="btn-sm btn-reject" onclick="updateBookingStatus('${b.id}', 'Rejected')">Reject</button>
          <button class="btn-sm btn-postpone" onclick="openPostponeCalendar('${b.id}')">Postpone</button>
        </div>
        <!-- Inline Calendar Picker for Postpone -->
        <div id="postpone-box-${b.id}" class="postpone-box hidden">
          <input type="date" id="new-date-${b.id}" value="${b.date}">
          <button class="btn-sm btn-confirm" onclick="confirmPostponeDate('${b.id}')">Save Date</button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

/* ==========================================
   INVENTORY & DYNAMIC SUB-CATEGORIES LOGIC
   ========================================== */
function updateSubCategories() {
  const mainCat = document.getElementById("p-category").value;
  const subCatSelect = document.getElementById("p-subcategory");
  subCatSelect.innerHTML = '<option value="">-- Select Sub Category --</option>';

  if (mainCat && CATEGORY_RULES[mainCat]) {
    CATEGORY_RULES[mainCat].forEach(sub => {
      const opt = document.createElement("option");
      opt.value = sub;
      opt.textContent = sub;
      subCatSelect.appendChild(opt);
    });
  }
  checkBreedRequirement();
}

function checkBreedRequirement() {
  const mainCat = document.getElementById("p-category").value;
  const subCat = document.getElementById("p-subcategory").value;
  const breedContainer = document.getElementById("breed-container");
  const breedSelect = document.getElementById("p-breed");

  // Show Breed selector if Dry Food -> Dog or Puppy is chosen
  if (mainCat === "Dry Food" && (subCat === "Dog" || subCat === "Puppy")) {
    breedContainer.classList.remove("hidden");
    breedSelect.setAttribute("required", "true");
  } else {
    breedContainer.classList.add("hidden");
    breedSelect.removeAttribute("required");
    breedSelect.value = "";
  }
}

function handleAddProduct(e) {
  e.preventDefault();

  const sizeVal = document.getElementById("p-size-val").value;
  const sizeUnit = document.getElementById("p-size-unit").value;

  const newProduct = {
    id: Date.now(),
    name: document.getElementById("p-name").value.trim(),
    sku: document.getElementById("p-sku").value.trim().toUpperCase(),
    company: document.getElementById("p-company").value.trim(),
    category: document.getElementById("p-category").value,
    subCategory: document.getElementById("p-subcategory").value,
    breed: document.getElementById("p-breed").value || "",
    size: `${sizeVal} ${sizeUnit}`,
    expiry: document.getElementById("p-expiry").value,
    price: Number(document.getElementById("p-price").value),
    stock: Number(document.getElementById("p-stock").value)
  };

  inventory.unshift(newProduct);
  syncInventoryAndShop();

  e.target.reset();
  document.getElementById("breed-container").classList.add("hidden");
}

function deleteProduct(id) {
  inventory = inventory.filter(item => item.id !== id);
  syncInventoryAndShop();
}

function syncInventoryAndShop() {
  localStorage.setItem("clinic_inventory", JSON.stringify(inventory));
  renderInventory();
  renderShop();
}

function renderInventory() {
  const tbody = document.getElementById("inventory-table-body");
  tbody.innerHTML = "";

  inventory.forEach(item => {
    const breedBadge = item.breed ? ` • ${item.breed}` : "";
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>${item.sku}</strong></td>
      <td>
        <div><strong>${item.name}</strong></div>
        <div style="font-size:12px; color:#64748b;">${item.company}</div>
      </td>
      <td>
        <span class="tag tag-cat">${item.category}</span>
        <div style="font-size:12px; margin-top:3px;">${item.subCategory}${breedBadge}</div>
      </td>
      <td>${item.size}</td>
      <td>${item.expiry}</td>
      <td><strong>₹${item.price}</strong></td>
      <td>
        <button class="btn-sm btn-delete" onclick="deleteProduct(${item.id})">Remove</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

/* ==========================================
   LIVE SHOP PAGE RENDERING
   ========================================== */
function renderShop() {
  const shopGrid = document.getElementById("shop-grid");
  const countBadge = document.getElementById("shop-count");
  const catFilter = document.getElementById("filter-category").value;
  const petFilter = document.getElementById("filter-pet").value;

  countBadge.textContent = inventory.length;
  shopGrid.innerHTML = "";

  const filtered = inventory.filter(item => {
    const matchCat = catFilter === "ALL" || item.category === catFilter;
    const matchPet = petFilter === "ALL" || item.subCategory === petFilter;
    return matchCat && matchPet;
  });

  if (filtered.length === 0) {
    shopGrid.innerHTML = `<p style="color:#64748b;">No products found in this category.</p>`;
    return;
  }

  filtered.forEach(item => {
    const card = document.createElement("div");
    card.className = "shop-card";
    card.innerHTML = `
      <div>
        <div class="shop-tags">
          <span class="tag tag-cat">${item.category}</span>
          <span class="tag">${item.subCategory}</span>
          ${item.breed ? `<span class="tag tag-breed">${item.breed}</span>` : ""}
        </div>
        <h4>${item.name}</h4>
        <div class="shop-brand">By ${item.company} | SKU: ${item.sku}</div>
        <div class="shop-meta">
          <div><strong>Pack Size:</strong> ${item.size}</div>
          <div><strong>Expiry:</strong> ${item.expiry}</div>
        </div>
      </div>
      <div class="shop-footer">
        <span class="price">₹${item.price}</span>
        <span style="font-size:12px; color:#15803d; font-weight:600;">In Stock (${item.stock})</span>
      </div>
    `;
    shopGrid.appendChild(card);
  });
}
