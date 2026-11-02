const SUPABASE_URL = "https://xukjlwsidurvtxqouqvd.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1a2psd3NpZHVydnR4cW91cXZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMzODg2MjMsImV4cCI6MjEwODk2NDYyM30.QQXkTVzouEci79c5DRNTLIREfReSmCDhiVQCl8et-us";
const db = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let shopInventory = [];

document.addEventListener("DOMContentLoaded", () => {
  fetchShopInventory();

  db.channel("public-shop-sync")
    .on("postgres_changes", { event: "*", schema: "public", table: "clinic_inventory" }, () => {
      fetchShopInventory();
    })
    .subscribe();
});

function switchShopTab(tabName) {
  document.querySelectorAll(".section").forEach(s => s.classList.remove("active"));
  document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));

  document.getElementById(`${tabName}-section`).classList.add("active");
  event.target.classList.add("active");
}

async function fetchShopInventory() {
  const { data, error } = await db.from("clinic_inventory").select("*").order("created_at", { ascending: false });
  if (!error && data) {
    shopInventory = data;
    renderCustomerShop();
  }
}

function renderCustomerShop() {
  const grid = document.getElementById("shop-grid");
  const catFilter = document.getElementById("filter-category").value;
  const petFilter = document.getElementById("filter-pet").value;

  grid.innerHTML = "";

  const filtered = shopInventory.filter(item => {
    const matchCat = catFilter === "ALL" || item.category === catFilter;
    const matchPet = petFilter === "ALL" || item.sub_category === petFilter;
    return matchCat && matchPet;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `<p style="color:#64748b;">No products available in this category right now.</p>`;
    return;
  }

  filtered.forEach(item => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <div>
        <div class="tags">
          <span class="tag tag-cat">${item.category}</span>
          <span class="tag">${item.sub_category}</span>
          ${item.breed ? `<span class="tag tag-breed">${item.breed} Breed</span>` : ""}
        </div>
        <h3>${item.name}</h3>
        <div class="company">By ${item.company} • SKU: ${item.sku}</div>
        <div class="meta">
          <div><strong>Pack Size:</strong> ${item.size}</div>
          <div><strong>Best Before:</strong> ${item.expiry}</div>
        </div>
      </div>
      <div class="card-footer">
        <span class="price">₹${item.price}</span>
        <button class="buy-btn">Add to Cart</button>
      </div>
    `;
    grid.appendChild(card);
  });
}

async function submitCustomerBooking(e) {
  e.preventDefault();
  const newBooking = {
    booking_code: "BK-" + Math.floor(100 + Math.random() * 900),
    owner: document.getElementById("c-owner").value.trim(),
    pet: document.getElementById("c-pet").value.trim(),
    service: document.getElementById("c-service").value,
    appointment_date: document.getElementById("c-date").value,
    appointment_time: document.getElementById("c-time").value,
    status: "Pending"
  };

  const { error } = await db.from("clinic_bookings").insert([newBooking]);
  if (!error) {
    const successMsg = document.getElementById("booking-success");
    successMsg.classList.remove("hidden");
    e.target.reset();
    setTimeout(() => successMsg.classList.add("hidden"), 4000);
  } else {
    alert("Booking failed: " + error.message);
  }
}
