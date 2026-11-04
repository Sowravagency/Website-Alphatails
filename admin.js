let inventoryList = JSON.parse(localStorage.getItem('alphatails_inventory')) || [];
let activeTargetBookingRow = null;

document.addEventListener('DOMContentLoaded', () => {
    renderInventory();
    renderLiveShop('all');
    updateDashboardStats();
});

function switchTab(tabId, event) {
    if (event) event.preventDefault();
    document.querySelectorAll('.tab-section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.sidebar .nav-links a').forEach(l => l.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    if (event) {
        event.currentTarget.classList.add('active');
        document.getElementById('page-title').innerText = event.currentTarget.innerText.trim();
    }
}

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
    if (!newDateVal) { alert('Please choose a valid date.'); return; }
    if (activeTargetBookingRow) {
        const dateCell = activeTargetBookingRow.querySelector('td:nth-child(4)');
        const formattedDate = new Date(newDateVal).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
        dateCell.innerText = formattedDate;
        updateBooking(activeTargetBookingRow.querySelector('.btn-confirm') || activeTargetBookingRow.querySelector('.btn-postpone'), 'Postponed');
    }
    closePostponeModal();
}

function handleMainCategoryChange() {
    const mainCat = document.getElementById('main-category').value;
    const sub1Container = document.getElementById('sub-cat-container-1');
    const sub2Container = document.getElementById('sub-cat-container-2');
    const sub1Select = document.getElementById('sub-category-1');
    sub1Select.innerHTML = '<option value="">--Select Sub Category--</option>';
    sub2Container.style.display = 'none';

    if (mainCat) {
        sub1Container.style.display = 'flex';
        const options = (mainCat === 'medicines') ? ['cat', 'dog'] : ['cat', 'dog', 'puppy', 'kitten'];
        options.forEach(sub => {
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

function handleInventorySubmit(event) {
    event.preventDefault();
    const newItem = {
        id: Date.now(),
        name: document.getElementById('prod-name').value,
        sku: document.getElementById('prod-sku').value,
        company: document.getElementById('prod-company').value,
        expiry: document.getElementById('prod-expiry').value,
        size: `${document.getElementById('prod-size-num').value} ${document.getElementById('prod-size-unit').value}`,
        quantity: parseInt(document.getElementById('prod-qty').value) || 0,
        price: parseFloat(document.getElementById('prod-price').value),
        mainCat: document.getElementById('main-category').value,
        subCat1: document.getElementById('sub-category-1').value,
        subCat2: document.getElementById('sub-category-2').value,
        image: document.getElementById('prod-image').value || ''
    };

    inventoryList.unshift(newItem);
    localStorage.setItem('alphatails_inventory', JSON.stringify(inventoryList));
    document.getElementById('inventory-form').reset();
    document.getElementById('sub-cat-container-2').style.display = 'none';
    renderInventory();
    renderLiveShop('all');
    updateDashboardStats();
    alert('Product successfully added and published to the shop!');
}

function handleCsvUpload() {
    const fileInput = document.getElementById('csv-file-input');
    const file = fileInput.files[0];
    if (!file) { alert('Please select a CSV file.'); return; }

    const reader = new FileReader();
    reader.onload = function(e) {
        const lines = e.target.result.split('\n');
        let count = 0;
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;
            const cols = line.split(',').map(v => v.trim());
            if (cols.length >= 9) {
                inventoryList.unshift({
                    id: Date.now() + i,
                    name: cols[0],
                    sku: cols[1],
                    company: cols[2],
                    expiry: cols[3],
                    size: `${cols[4]} ${cols[5]}`,
                    price: parseFloat(cols[6]) || 0,
                    quantity: parseInt(cols[7]) || 0,
                    mainCat: cols[8],
                    subCat1: cols[9] || '',
                    subCat2: cols[10] || '',
                    image: cols[11] || ''
                });
                count++;
            }
        }
        localStorage.setItem('alphatails_inventory', JSON.stringify(inventoryList));
        fileInput.value = '';
        renderInventory();
        renderLiveShop('all');
        updateDashboardStats();
        alert(`Successfully imported ${count} items from CSV!`);
    };
    reader.readAsText(file);
}

function renderInventory() {
    const tbody = document.getElementById('inventory-table-body');
    tbody.innerHTML = '';
    if (inventoryList.length === 0) {
        tbody.innerHTML = `<tr><td colspan="9" style="text-align: center; color: var(--text-muted);">No inventory items uploaded yet.</td></tr>`;
        return;
    }
    inventoryList.forEach(item => {
        let cat = `${item.mainCat} > ${item.subCat1}`;
        if (item.subCat2) cat += ` > ${item.subCat2}`;
        tbody.innerHTML += `
            <tr>
                <td><code>${item.sku}</code></td>
                <td><strong>${item.name}</strong></td>
                <td>${item.company}</td>
                <td><span class="badge confirmed">${cat}</span></td>
                <td>${item.size}</td>
                <td><strong>${item.quantity}</strong></td>
                <td>${item.expiry}</td>
                <td>₹${item.price.toFixed(2)}</td>
                <td><button class="btn-delete" onclick="deleteInventoryItem(${item.id})"><i class="fa-solid fa-trash"></i></button></td>
            </tr>
        `;
    });
}

function deleteInventoryItem(id) {
    if (confirm('Delete this item?')) {
        inventoryList = inventoryList.filter(i => i.id !== id);
        localStorage.setItem('alphatails_inventory', JSON.stringify(inventoryList));
        renderInventory();
        renderLiveShop('all');
        updateDashboardStats();
    }
}

function renderLiveShop(filterCategory) {
    const shopGrid = document.getElementById('live-shop-grid');
    shopGrid.innerHTML = '';
    const items = filterCategory === 'all' ? inventoryList : inventoryList.filter(i => i.mainCat === filterCategory);

    if (items.length === 0) {
        shopGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 40px;">No items available right now.</p>`;
        return;
    }

    items.forEach(item => {
        shopGrid.innerHTML += `
            <div class="product-card">
                <div class="product-thumb">
                    ${item.image ? `<img src="${item.image}" alt="${item.name}">` : '<i class="fa-solid fa-box-open"></i>'}
                </div>
                <div class="product-body">
                    <span class="product-category-tag">${item.mainCat}</span>
                    <h3 class="product-title">${item.name}</h3>
                    <p class="product-meta">By: ${item.company} | Size: ${item.size}</p>
                    <p class="product-meta">Stock: <strong>${item.quantity} units available</strong></p>
                    <div class="product-price">₹${item.price.toFixed(2)}</div>
                </div>
            </div>
        `;
    });
}

function filterShop(category, btn) {
    document.querySelectorAll('.shop-filter-bar .filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderLiveShop(category);
}

function updateDashboardStats() {
    document.getElementById('stat-inventory').innerText = inventoryList.length;
    document.getElementById('stat-pending').innerText = document.querySelectorAll('#bookings-table-body .badge.pending').length;
}
