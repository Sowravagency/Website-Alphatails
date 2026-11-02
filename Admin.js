const CATEGORY_RULES = {
  "Dry Food": ["Cat", "Dog", "Puppy", "Kitten"],
  "Medicines": ["Cat", "Dog"],
  "Gravy": ["Cat", "Dog", "Puppy", "Kitten"],
  "Gravies": ["Cat", "Dog", "Puppy", "Kitten"]
};

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
    breed: "Medium",
    size: "3 kg",
    expiry: "2027-08-15",
    price: 750,
    stock: 15
  }
];

// Save initial defaults if empty
if (!localStorage.getItem("clinic_inventory")) {
  localStorage.setItem("clinic_inventory", JSON.stringify(inventory));
}

document.addEventListener("DOMContentLoaded", () => {
  renderBookings();
  renderInventory();
});

function switchAdminTab(tabName) {
  document.querySelectorAll(".panel").forEach(p => p.classList.remove("active"));
  document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));

  document.getElementById(`${tabName}-section`).classList.add("active");
  const buttons = document.querySelectorAll(".tab-btn");
  if (tabName === "bookings") buttons[0].classList.add("active");
  if (tabName === "inventory") buttons[1].classList.add("active");
}

/* BOOKINGS MANAGEMENT */
function toggleNewBookingForm() {
  document.getElementById("new-booking-form").classList.toggle("hidden");
}

function addBooking(e) {
  e.preventDefault();
  bookings.unshift({
    id: "BK-" + Math.floor(100 + Math.random() * 900),
    owner: document.getElementById("b-owner").value,
    pet: document.getElementById("b-pet").value,
    service: document.getElementById("b-service").value,
    date: document.getElementById("b-date").value,
    time: document.getElementById("b-time").value,
    status: "Pending"
  });
  saveBookings();
  e.target.reset();
  toggleNewBookingForm();
}

function updateBookingStatus(id, newStatus) {
  const bk = bookings.find(b => b.id === id);
  if (bk) {
    bk.status = newStatus;
    saveBookings();
  }
}

function openPostponeCalendar(id) {
  const box = document.getElementById(`postpone-box-${id}`);
  if (box) box.classList.toggle("hidden");
}

function confirmPostponeDate(id) {
  const dateInput = document.getElementById(`new-date-${id}`);
  if (!dateInput.value) {
    alert("Please select a new date.");
    return;
  }
  const bk = bookings.find(b => b.id === id);
  if (bk) {
    bk.date = dateInput.value;
    bk.status = "Postponed";
    saveBookings();
  }
}

function saveBookings() {
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
        <div id="postpone-box-${b.id}" class="postpone-box hidden">
          <input type="date" id="new-date-${b.id}" value="${b.date}">
          <button class="btn-sm btn-confirm" onclick="confirmPostponeDate('${b.id}')">Save Date</button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

/* INVENTORY MANAGEMENT */
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
  localStorage.setItem("clinic_inventory", JSON.stringify(inventory));
  renderInventory();

  e.target.reset();
  document.getElementById("breed-container").classList.add("hidden");

  const toast = document.getElementById("upload-toast");
  toast.classList.remove("hidden");
  setTimeout(() => toast.classList.add("hidden"), 3000);
}

function deleteProduct(id) {
  inventory = inventory.filter(item => item.id !== id);
  localStorage.setItem("clinic_inventory", JSON.stringify(inventory));
  renderInventory();
}

function renderInventory() {
  const tbody = document.getElementById("inventory-table-body");
  document.getElementById("inv-count").textContent = inventory.length;
  tbody.innerHTML = "";

  inventory.forEach(item => {
    const breedInfo = item.breed ? ` (${item.breed} Breed)` : "";
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>${item.sku}</strong></td>
      <td>
        <div><strong>${item.name}</strong></div>
        <div style="font-size:12px; color:#64748b;">${item.company}</div>
      </td>
      <td>
        <span class="tag">${item.category}</span>
        <div style="font-size:12px; margin-top:4px;">${item.subCategory}${breedInfo}</div>
      </td>
      <td>${item.size}</td>
      <td>${item.expiry}</td>
      <td><strong>₹${item.price}</strong></td>
      <td>
        <button class="btn-sm btn-delete" onclick="deleteProduct(${item.id})">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}
