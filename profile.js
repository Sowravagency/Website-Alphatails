let currentUser = null;

document.addEventListener('DOMContentLoaded', async () => {
    // Redirect to login.html if not logged in
    currentUser = await requireCustomerLogin();
    if (!currentUser) return;

    // Populate header greeting
    const fullName = currentUser.user_metadata?.full_name || 'Pet Parent';
    document.getElementById('profileHeaderName').textContent = `Welcome, ${fullName}`;
    document.getElementById('profileHeaderEmail').textContent = currentUser.email;
    document.getElementById('avatarInitial').textContent = fullName.charAt(0).toUpperCase();

    // Load all customer data concurrently
    await Promise.all([
        loadCustomerProfile(),
        loadMyBookings(),
        loadMyConsultations(),
        loadMyOrders()
    ]);
});

function switchProfileTab(tabName) {
    const tabs = ['bookings', 'consultations', 'orders', 'details'];
    tabs.forEach(t => {
        document.getElementById(`tabContent-${t}`).classList.toggle('hidden', t !== tabName);
        const btn = document.getElementById(`tabBtn-${t}`);
        if (t === tabName) {
            btn.className = "profile-tab px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-[#0f766e] text-white transition";
        } else {
            btn.className = "profile-tab px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-white text-slate-600 border border-slate-200 hover:border-[#0f766e] transition";
        }
    });
}

// 1. Load Profile Info
async function loadCustomerProfile() {
    const { data, error } = await supabaseClient
        .from('customer_profiles')
        .select('*')
        .eq('id', currentUser.id)
        .single();

    if (data) {
        document.getElementById('profName').value = data.full_name || currentUser.user_metadata?.full_name || '';
        document.getElementById('profPhone').value = data.phone || '';
        document.getElementById('profPetName').value = data.pet_name || '';
        document.getElementById('profPetType').value = data.pet_type || 'Dog';
        document.getElementById('profAddress').value = data.address || '';
        document.getElementById('profCity').value = data.city || 'Tirupati';
        document.getElementById('profPincode').value = data.pincode || '';
    } else {
        document.getElementById('profName').value = currentUser.user_metadata?.full_name || '';
    }
}

// 2. Save Profile Info
async function saveProfileDetails(event) {
    event.preventDefault();
    const btn = document.getElementById('saveProfileBtn');
    const msg = document.getElementById('profileSaveMsg');
    btn.disabled = true;
    btn.textContent = 'Saving...';
    msg.textContent = '';

    const updates = {
        id: currentUser.id,
        full_name: document.getElementById('profName').value.trim(),
        phone: document.getElementById('profPhone').value.trim(),
        pet_name: document.getElementById('profPetName').value.trim(),
        pet_type: document.getElementById('profPetType').value,
        address: document.getElementById('profAddress').value.trim(),
        city: document.getElementById('profCity').value.trim(),
        pincode: document.getElementById('profPincode').value.trim(),
        updated_at: new Date().toISOString()
    };

    const { error } = await supabaseClient
        .from('customer_profiles')
        .upsert(updates);

    if (error) {
        msg.className = "text-xs font-semibold text-red-600";
        msg.textContent = "Failed to save profile: " + error.message;
    } else {
        msg.className = "text-xs font-semibold text-teal-700";
        msg.textContent = "Profile updated successfully!";
        document.getElementById('profileHeaderName').textContent = `Welcome, ${updates.full_name}`;
    }

    btn.disabled = false;
    btn.textContent = 'Save Changes';
}

// 3. Load Grooming & Boarding Bookings
async function loadMyBookings() {
    const container = document.getElementById('bookingsList');
    const { data, error } = await supabaseClient
        .from('bookings')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
        container.innerHTML = `<div class="col-span-full bg-white p-6 rounded-2xl border border-slate-200 text-center text-sm text-slate-500">No bookings yet. <a href="booking.html" class="text-[#0f766e] font-bold underline">Book your first appointment</a></div>`;
        return;
    }

    container.innerHTML = data.map(b => `
        <div class="bg-white p-5 rounded-2xl border border-[#ccfbf1] shadow-sm space-y-2">
            <div class="flex justify-between items-start">
                <span class="text-xs font-extrabold text-[#0f766e] bg-[#f0fdfa] px-2.5 py-1 rounded-lg">${b.booking_ref || 'BOOKING'}</span>
                <span class="text-xs font-bold px-2.5 py-1 rounded-full ${b.status === 'Confirmed' ? 'bg-teal-100 text-teal-800' : 'bg-amber-100 text-amber-800'}">${b.status}</span>
            </div>
            <h3 class="font-extrabold text-[#023047] text-sm">${b.service_type}</h3>
            <p class="text-xs text-slate-500"><i class="fa-regular fa-calendar mr-1"></i> ${b.appointment_date} at ${b.appointment_time}</p>
            <p class="text-xs text-slate-500"><i class="fa-solid fa-paw mr-1"></i> Pet: ${b.pet_name}</p>
        </div>
    `).join('');
}

// 4. Load Doctor Consultations
async function loadMyConsultations() {
    const container = document.getElementById('consultationsList');
    const { data, error } = await supabaseClient
        .from('doctor_consultations')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
        container.innerHTML = `<div class="col-span-full bg-white p-6 rounded-2xl border border-slate-200 text-center text-sm text-slate-500">No doctor consultations yet. <a href="consultation.html" class="text-[#0f766e] font-bold underline">Book a vet visit</a></div>`;
        return;
    }

    container.innerHTML = data.map(c => `
        <div class="bg-white p-5 rounded-2xl border border-[#ccfbf1] shadow-sm space-y-2">
            <div class="flex justify-between items-start">
                <span class="text-xs font-extrabold text-[#0f766e] bg-[#f0fdfa] px-2.5 py-1 rounded-lg">${c.consultation_ref || 'CONSULT'}</span>
                <span class="text-xs font-bold px-2.5 py-1 rounded-full bg-teal-100 text-teal-800">${c.status}</span>
            </div>
            <h3 class="font-extrabold text-[#023047] text-sm">${c.doctor_name} (${c.consultation_mode})</h3>
            <p class="text-xs text-slate-500"><i class="fa-regular fa-calendar mr-1"></i> ${c.preferred_date} • ${c.preferred_time}</p>
            <p class="text-xs text-slate-600">Symptoms: ${c.symptoms}</p>
        </div>
    `).join('');
}

// 5. Load Shop Orders
async function loadMyOrders() {
    const container = document.getElementById('ordersList');
    const { data, error } = await supabaseClient
        .from('shop_orders')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
        container.innerHTML = `<div class="bg-white p-6 rounded-2xl border border-slate-200 text-center text-sm text-slate-500">No shop orders yet. <a href="shop.html" class="text-[#0f766e] font-bold underline">Explore AlphaTails Shop</a></div>`;
        return;
    }

    container.innerHTML = data.map(o => {
        const itemSummary = Array.isArray(o.items)
            ? o.items.map(i => `${i.name} (x${i.qty})`).join(', ')
            : 'Pet Accessories';
        return `
            <div class="bg-white p-5 rounded-2xl border border-[#ccfbf1] shadow-sm flex flex-col sm:flex-row justify-between gap-4">
                <div class="space-y-1.5">
                    <div class="flex items-center gap-2">
                        <span class="text-xs font-extrabold text-[#0f766e] bg-[#f0fdfa] px-2.5 py-1 rounded-lg">${o.order_ref}</span>
                        <span class="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-100 text-blue-800">${o.order_status}</span>
                    </div>
                    <p class="text-sm font-bold text-[#023047]">${itemSummary}</p>
                    <p class="text-xs text-slate-500">Deliver to: ${o.delivery_address}, ${o.city || ''}</p>
                </div>
                <div class="sm:text-right shrink-0">
                    <p class="text-lg font-extrabold text-[#023047]">₹${o.total_amount}</p>
                    <p class="text-xs text-slate-400">${o.payment_method} (${o.payment_status})</p>
                </div>
            </div>
        `;
    }).join('');
}
