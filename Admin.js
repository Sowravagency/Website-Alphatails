const SUPABASE_URL = "https://xukjlwsidurvtxqouqvd.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1a2psd3NpZHVydnR4cW91cXZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMzODg2MjMsImV4cCI6MjEwODk2NDYyM30.QQXkTVzouEci79c5DRNTLIREfReSmCDhiVQCl8et-us";
const db = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const CATEGORY_RULES = {
  "Dry Food": ["Cat", "Dog", "Puppy", "Kitten"],
  "Medicines": ["Cat", "Dog"],
  "Gravy": ["Cat", "Dog", "Puppy", "Kitten"],
  "Gravies": ["Cat", "Dog", "Puppy", "Kitten"]
};

let bookings = [];
let inventory = [];

document.addEventListener("DOMContentLoaded", () => {
  fetchBookings();
  fetchInventory();
  subscribeToRealtimeAdmin();
});

function switchAdminTab(tabName) {
  document.querySelectorAll(".panel").forEach(p => p.classList.remove("active"));
  document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));

  document.getElementById(`${tabName}-section`).classList.add("active");
  const buttons = document.querySelectorAll(".tab-btn");
  if (tabName === "bookings") buttons[0].classList.add("active");
  if (tabName === "inventory") buttons[1].classList.add("active");
}

function subscribeToRealtimeAdmin() {
  db.channel("admin-sync")
    .on("postgres_changes", { event: "*", schema: "public", table: "clinic_bookings" }, () => fetchBookings())
    .on("postgres_changes", { event: "*", schema: "public", table: "clinic_inventory" }, () => fetchInventory())
    .subscribe();
}

/* BOOKINGS CRUD */
async function fetchBookings() {
  const { data, error } = await db.from("clinic_bookings").select("*").order("created_at", { ascending: false });
  if (!error && data) {
    bookings = data;
    renderBookings();
  }
}

function toggleNewBookingForm() {
  document.getElementById("new-booking-form").classList.toggle("hidden");
}

async function addBooking(e) {
  e.preventDefault();
  const newBooking = {
    booking_code: "BK-" + Math.floor(100 + Math.random() * 900),
    owner: document.getElementById("b-owner").value.trim(),
    pet: document.getElementById("b-pet").value.trim(),
    service: document.getElementById("b-service").value,
    appointment_date: document.getElementById("b-date").value,
    appointment_time: document.getElementById("b-time").value,
    status: "Pending"
  };

  const { error } = await db.from("clinic_bookings").insert([newBooking]);
  if (!error) {
    e.target.reset();
    toggleNewBookingForm();
    fetchBookings();
  }
}

async function updateBookingStatus(id, newStatus) {
  const { error } = await db.from("clinic_bookings").update({ status: newStatus }).eq("id", id);
  if (!error) fetchBookings();
}

function openPostponeCalendar(id) {
  const box = document.getElementById(`postpone-box-${id}`);
  if (box) box.classList.toggle("hidden");
}

async function confirmPostponeDate(id) {
  const dateInput = document.getElementById(`new-date-${id}`);
  if (!dateInput.value) {
    alert("Please select a new date.");
    return;
  }
  const { error } = await db.from("clinic_bookings").update({
    appointment_date: dateInput.value,
    status: "Postponed"
  }).eq("id", id);
  if (!error) fetchBookings();
}

function renderBookings() {
  const tbody = document.getElementById("bookings-list");
  tbody.innerHTML = "";
  bookings.forEach(b => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>${b.booking_code}</strong></td>
      <td>
        <div><strong>${b.owner}</strong></div>
        <div style="font-size:12px; color:#64748b;">${b.pet}</div>
      </td>
      <td>${b.service}</td>
      <td>
        <div><strong>${b.appointment_date}</strong></div>
        <div style="font-size:12px; color:#64748b;">${b.appointment_time}</div>
      </td>
      <td><span class="status-pill status-${b.status}">${b.status}</span></td>
      <td>
        <div class="action-group">
          <button class="btn-sm btn-confirm" onclick="updateBookingStatus(${b.id}, 'Confirmed')">Confirm</button>
          <button class="btn-sm btn-reject" onclick="updateBookingStatus(${b.id}, 'Rejected')">Reject</button>
          <button class="btn-sm btn-postpone" onclick="openPostponeCalendar(${b.id})">Postpone</button>
        </div>
        <div id="postpone-box-${b.id}" class="postpone-box hidden">
          <input type="date" id="new-date-${b.id}" value="${b.appointment_date}">
          <button class="btn-sm btn-confirm" onclick="confirmPostponeDate(${b.id})">Save Date</button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

/* INVENTORY CRUD & RULES */
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

async function fetchInventory() {
  const { data, error } = await db.from("clinic_inventory").select("*").order("created_at", { ascending: false });
  if (!error && data) {
    inventory = data;
    renderInventory();
  }
}

async function handleAddProduct(e) {
  e.preventDefault();
  const sizeVal = document.getElementById("p-size-val").value;
  const sizeUnit = document.getElementById("p-size-unit").value;

  const newProduct = {
    name: document.getElementById("p-name").value.trim(),
    sku: document.getElementById("p-sku").value.trim().toUpperCase(),
    company: document.getElementById("p-company").value.trim(),
    category: document.getElementById("p-category").value,
    sub_category: document.getElementById("p-subcategory").value,
    breed: document.getElementById("p-breed").value || "",
    size: `${sizeVal} ${sizeUnit}`,
    expiry: document.getElementById("p-expiry").value,
    price: Number(document.getElementById("p-price").value),
    stock: Number(document.getElementById("p-stock").value)
  };

  const { error } = await db.from("clinic_inventory").insert([newProduct]);
  if (error) {
    alert("Upload failed: " + error.message);
    return;
  }

  e.target.reset();
  document.getElementById("breed-container").classList.add("hidden");
  const toast = document.getElementById("upload-toast");
  toast.classList.remove("hidden");
  setTimeout(() => toast.classList.add("hidden"), 3000);
  fetchInventory();
}

async function deleteProduct(id) {
  const { error } = await db.from("clinic_inventory").delete().eq("id", id);
  if (!error) fetchInventory();
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
        <div style="font-size:12px; margin-top:4px;">${item.sub_category}${breedInfo}</div>
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
