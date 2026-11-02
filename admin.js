// Global inventory array loaded from local storage for Alpha Tails instant sync
let inventoryList = JSON.parse(localStorage.getItem('alphatails_inventory')) || [];
let activeTargetBookingRow = null;

// Initialization on page load
document.addEventListener('DOMContentLoaded', () => {
    renderInventory();
    renderLiveShop('all');
    updateDashboardStats();
});

// Navigation Tab Switching Function
function switchTab(tabId, event) {
    if (event) event.preventDefault();
    
    document.querySelectorAll('.tab-section').forEach(section => {
        section.classList.remove('active');
    });
    document.querySelectorAll('.sidebar .nav-links a').forEach(link => {
        link.classList.remove('active');
    });

    document.getElementById(tabId).classList.add('active');
    if (event) {
        event.currentTarget.classList.add('active');
        document.getElementById('page-title').innerText = event.currentTarget.innerText.trim();
    }
}

// --- BOOKING MANAGEMENT LOGIC ---
function updateBooking(button, statusText) {
    const row = button.closest('tr');
    const badgeCell = row.querySelector('td:nth-child(5)');
    
    let badgeClass = 'pending';
    if (statusText === 'Confirmed') badgeClass = 'confirmed';
    if (statusText === 'Rejected') badgeClass = 'rejected';
    if (statusText === 'Postponed') badgeClass = 'postponed';

    badgeCell.innerHTML = `<span class="badge ${badgeClass}">${statusText}</span>`;
    updateDashboardStats();
}

// Postpone Modal Triggers
function openPostponeModal(button) {
    activeTargetBookingRow = button.closest('tr');
    document.getElementById('postpone-modal').style.display = 'flex';
}

function closePostponeModal() {
    document.getElementById('postpone-modal').style.display = 'none';
    activeTargetBookingRow = null;
}

function confirmPostpone() {
    const newDateVal = document.getElementById('new-postpone-date').value;
    if (!newDateVal) {
        alert('Please choose a valid postpone date and time.');
        return;
    }
    
    if (activeTargetBookingRow) {
        const dateCell = activeTargetBookingRow.querySelector('td:nth-child(4)');
        const formattedDate = new Date(newDateVal).toLocaleString('en-IN', { 
            day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' 
        });
        dateCell.innerText = formattedDate;
        updateBooking(activeTargetBookingRow.querySelector('.btn-confirm') || activeTargetBookingRow.querySelector('.btn-postpone'), 'Postponed');
    }
    closePostponeModal();
}

// --- DYNAMIC INVENTORY SUBCATEGORY LOGIC ---
function handleMainCategoryChange() {
    const mainCat = document.getElementById('main-category').value;
    const sub1Container = document.getElementById('sub-cat-container-1');
    const sub2Container = document.getElementById('sub-cat-container-2');
    const sub1Select = document.getElementById('sub-category-1');
    
    sub1Select.innerHTML = '<option value="">--Select Sub Category--</option>';
    sub2Container.style.display = 'none'; // Reset breed selector

    if (mainCat === 'Dry food') {
        sub1Container.style.display = 'flex';
        ['cat', 'dog', 'puppy', 'kitten'].forEach(sub => {
            sub1Select.innerHTML += `<option value="${sub}">${sub.charAt(0).toUpperCase() + sub.slice(1)}</option>`;
        });
    } else if (mainCat === 'medicines') {
        sub1Container.style.display = 'flex';
        ['cat', 'dog'].forEach(sub => {
            sub1Select.innerHTML += `<option value="${sub}">${sub.charAt(0).toUpperCase() + sub.slice(1)}</option>`;
        });
    } else if (mainCat === 'Gravy' || mainCat === 'Gravies') {
        sub1Container.style.display = 'flex';
        ['cat', 'dog', 'puppy', 'kitten'].forEach(sub => {
            sub1Select.innerHTML += `<option value="${sub}">${sub.charAt(0).toUpperCase() + sub.slice(1)}</option>`;
        });
    } else {
        sub1Container.style.display = 'none';
    }
}

function handleSubCategory1Change() {
    const mainCat = document.getElementById('main-category').value;
    const sub1Val = document.getElementById('sub-category-1').value;
    const sub2Container = document.getElementById('sub-cat-container-2');

    if (mainCat === 'Dry food' && sub1Val === 'dog') {
        sub2Container.style.display = 'flex';
    } else {
        sub2Container.style.display = 'none';
    }
}

// --- INVENTORY SUBMISSION & STORAGE SYNC ---
function handleInventorySubmit(event) {
    event.preventDefault();

    const name = document.getElementById('prod-name').value;
    const sku = document.getElementById('prod-sku').value;
    const company = document.getElementById('prod-company').value;
    const expiry = document.getElementById('prod-expiry').value;
    const sizeNum = document.getElementById('prod-size-num').value;
    const sizeUnit = document.getElementById('prod-size-unit').value;
    const price = document.getElementById('prod-price').value;
    const mainCat = document.getElementById('main-category').value;
    const subCat1 = document.getElementById('sub-category-1').value;
    const subCat2 = document.getElementById('sub-category-2').value;
    const image = document.getElementById('prod-image').value || '';

    const newItem = {
        id: Date.now(),
        name,
        sku,
        company,
        expiry,
        size: `${sizeNum} ${sizeUnit}`,
        price: parseFloat(price),
        mainCat,
        subCat1,
        subCat2: (mainCat === 'Dry food' && sub1Val === 'dog') ? subCat2 : '',
        image
    };

    inventoryList.unshift(newItem);
    localStorage.setItem('alphatails_inventory', JSON.stringify(inventoryList));

    document.getElementById('inventory-form').reset();
    document.getElementById('sub-cat-container-2').style.display = 'none';
    
    renderInventory();
    renderLiveShop('all');
    updateDashboardStats();

    alert('Product successfully added and instantly published to the Alpha Tails shop!');
}

// Render Table in Admin Inventory Panel
function renderInventory() {
    const tbody = document.getElementById('inventory-table-body');
    tbody.innerHTML = '';

    if (inventoryList.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: var(--text-muted);">No inventory items uploaded yet.</td></tr>`;
        return;
    }

    inventoryList.forEach(item => {
        let categoryDisplay = `${item.mainCat} > ${item.subCat1}`;
        if (item.subCat2) categoryDisplay += ` > ${item.subCat2}`;

        tbody.innerHTML += `
            <tr>
                <td><code>${item.sku}</code></td>
                <td><strong>${item.name}</strong></td>
                <td>${item.company}</td>
                <td><span class="badge confirmed">${categoryDisplay}</span></td>
                <td>${item.size}</td>
                <td>${item.expiry}</td>
                <td>₹${item.price.toFixed(2)}</td>
                <td><button class="btn-delete" onclick="deleteInventoryItem(${item.id})"><i class="fa-solid fa-trash"></i></button></td>
            </tr>
        `;
    });
}

function deleteInventoryItem(id) {
    if (confirm('Are you sure you want to remove this item from inventory and the shop?')) {
        inventoryList = inventoryList.filter(item => item.id !== id);
        localStorage.setItem('alphatails_inventory', JSON.stringify(inventoryList));
        renderInventory();
        renderLiveShop('all');
        updateDashboardStats();
    }
}

// --- LIVE SHOP RENDERING & FILTERING ---
function renderLiveShop(filterCategory) {
    const shopGrid = document.getElementById('live-shop-grid');
    shopGrid.innerHTML = '';

    const filteredItems = filterCategory === 'all' 
        ? inventoryList 
        : inventoryList.filter(item => item.mainCat === filterCategory);

    if (filteredItems.length === 0) {
        shopGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 40px;">No shop items available under this selection right now.</p>`;
        return;
    }

    filteredItems.forEach(item => {
        let badgeSubText = `${item.subCat1.toUpperCase()}`;
        if (item.subCat2) badgeSubText += ` (${item.subCat2})`;

        shopGrid.innerHTML += `
            <div class="product-card">
                <div class="product-thumb">
                    ${item.image ? `<img src="${item.image}" alt="${item.name}">` : '<i class="fa-solid fa-box-open"></i>'}
                </div>
                <div class="product-body">
                    <span class="product-category-tag">${item.mainCat} • ${badgeSubText}</span>
                    <h3 class="product-title">${item.name}</h3>
                    <p class="product-meta">By: ${item.company} | Size: ${item.size}</p>
                    <p class="product-meta">Exp: ${item.expiry}</p>
                    <div class="product-price">₹${item.price.toFixed(2)}</div>
                </div>
            </div>
        `;
    });
}

function filterShop(category, btnElement) {
    document.querySelectorAll('.shop-filter-bar .filter-btn').forEach(b => b.classList.remove('active'));
    btnElement.classList.add('active');
    renderLiveShop(category);
}

function updateDashboardStats() {
    document.getElementById('stat-inventory').innerText = inventoryList.length;
    const pendingCount = document.querySelectorAll('#bookings-table-body .badge.pending').length;
    document.getElementById('stat-pending').innerText = pendingCount;
}
