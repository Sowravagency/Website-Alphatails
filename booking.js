let toastTimeout;

document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Hamburger Menu Toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileNav = document.getElementById('mobileNav');
    const hamburgerIcon = document.getElementById('hamburgerIcon');
    const closeIcon = document.getElementById('closeIcon');

    if (mobileMenuBtn && mobileNav) {
        mobileMenuBtn.addEventListener('click', () => {
            const isOpen = mobileNav.classList.toggle('open');
            mobileMenuBtn.setAttribute('aria-expanded', isOpen);
            if (hamburgerIcon) hamburgerIcon.classList.toggle('hidden', isOpen);
            if (closeIcon) closeIcon.classList.toggle('hidden', !isOpen);
        });
    }

    // Close mobile menu when clicking a link inside it
    const mobileLinks = document.querySelectorAll('#mobileNav a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileNav && mobileNav.classList.contains('open')) {
                mobileNav.classList.remove('open');
                if (mobileMenuBtn) mobileMenuBtn.setAttribute('aria-expanded', 'false');
                if (hamburgerIcon) hamburgerIcon.classList.remove('hidden');
                if (closeIcon) closeIcon.classList.add('hidden');
            }
        });
    });

    // 2. Sync Cart Count Badge from LocalStorage
    const cartCountBadge = document.getElementById('cartCount');
    const savedCartCount = localStorage.getItem('alphatails_cart_count');
    if (cartCountBadge && savedCartCount !== null) {
        cartCountBadge.textContent = savedCartCount;
    }
});

// Package Database
const packageData = {
    'Deworming': {
        hasSubCats: true,
        subCategories: {
            'Dog Deworming': [
                { name: 'Puppy Deworming', price: 149 },
                { name: 'Adult Dog Deworming', price: 199 }
            ],
            'Cat Deworming': [
                { name: 'Kitten Deworming', price: 149 },
                { name: 'Adult Cat Deworming', price: 199 }
            ]
        }
    },
    'Tick Treatment': {
        hasSubCats: true,
        subCategories: {
            'Dog Tick Treatment': [
                { name: 'Anti-Tick Bath & Spray (Small/Medium)', price: 350 },
                { name: 'Anti-Tick Bath & Spot-On (Large)', price: 650 }
            ],
            'Cat Tick Treatment': [
                { name: 'Anti-Tick Safe Bath & Spray', price: 350 }
            ]
        }
    },
    'Vaccination': {
        hasSubCats: true,
        subCategories: {
            'Dog Vaccination': [
                { name: 'Anti-Rabies (ARV)', price: 499 },
                { name: '7-in-1 (Dog Essential)', price: 1299 },
                { name: '9-in-1 (Advanced Dog)', price: 1499 },
                { name: 'Kennel Cough Vaccine', price: 899 }
            ],
            'Cat Vaccination': [
                { name: 'Anti-Rabies (ARV)', price: 499 },
                { name: 'Tricat / FVRCP (Cat)', price: 1199 }
            ]
        }
    },
    'Grooming': {
        hasBreedSizes: true,
        sizes: {
            'Small Breed': [
                { name: 'Zero cut + bathing', price: 2000 },
                { name: 'Only haircut', price: 1500 },
                { name: 'Premium cut & Bathing', price: 2500 },
                { name: 'Puppy haircut (4MM) + Bathing', price: 1500 },
                { name: 'Summer haircut + Bathing', price: 2000 },
                { name: 'Teddy Bear haircut + Bathing', price: 2500 }
            ],
            'Medium Breed': [
                { name: 'Zero cut + bathing', price: 2200 },
                { name: 'Only haircut', price: 1700 },
                { name: 'Premium cut & Bathing', price: 2700 },
                { name: 'Puppy haircut (4MM) + Bathing', price: 1700 },
                { name: 'Summer haircut + Bathing', price: 2200 },
                { name: 'Teddy Bear haircut + Bathing', price: 2700 }
            ],
            'Large Breed': [
                { name: 'Zero cut + bathing', price: 2300 },
                { name: 'Only haircut', price: 1800 },
                { name: 'Premium cut & Bathing', price: 2800 },
                { name: 'Puppy haircut (4MM) + Bathing', price: 1800 },
                { name: 'Summer haircut + Bathing', price: 2300 },
                { name: 'Teddy Bear haircut + Bathing', price: 2800 }
            ]
        }
    },
    'Bathing & Drying': [
        { name: 'Small (>10 kg)', price: 499 },
        { name: 'Medium (10-20 kg)', price: 599 },
        { name: 'Large (20-40 kg)', price: 699 },
        { name: 'Xtra Large (>40 kg)', price: 799 }
    ],
    'Premium & Medicated Bathing': {
        hasSubCats: true,
        subCategories: {
            'Premium Bathing': [
                { name: 'Small', price: 699 },
                { name: 'Medium', price: 799 },
                { name: 'Large', price: 899 },
                { name: 'Extra Large', price: 999 }
            ],
            'Medicated Bathing': [
                { name: 'Small', price: 699 },
                { name: 'Medium', price: 799 },
                { name: 'Large', price: 899 },
                { name: 'Extra Large', price: 999 }
            ]
        }
    },
    'Spa': [
        { name: 'Nail cutting & Filling', price: 300 },
        { name: 'Ear Cleaning', price: 200 },
        { name: 'Sanitary Cuts', price: 300 },
        { name: 'Sanitary cut & Face cut', price: 500 }
    ],
    'Hygiene': [
        { name: 'Anal Gland Expression (Standard)', price: 300 }
    ]
};

function selectCategory(category) {
    const container = document.getElementById('packageContainer');
    const grid = document.getElementById('packageListGrid');
    const header = document.getElementById('packageHeaderTitle');
    
    grid.innerHTML = '';
    container.classList.remove('hidden');
    document.getElementById('appointmentFormSection').classList.add('hidden');

    document.getElementById('step2Badge').className = "w-8 h-8 mx-auto rounded-full bg-[#0f766e] text-white font-bold flex items-center justify-center text-sm shadow-sm";
    document.getElementById('step2Text').className = "text-xs font-bold text-[#023047] uppercase tracking-wider";

    if (category === 'Grooming') {
        header.innerText = `Step 2: Select Breed Size for Grooming`;
        const sizes = Object.keys(packageData['Grooming'].sizes);
        const breedIcons = { 'Small Breed': 'fa-dog text-pink-500', 'Medium Breed': 'fa-shield-dog text-pink-600', 'Large Breed': 'fa-paw text-pink-700' };
        
        sizes.forEach(size => {
            const btn = document.createElement('div');
            btn.className = "sub-item p-4 rounded-xl border border-slate-200 hover:border-[#0f766e] hover:bg-slate-50 cursor-pointer flex items-center justify-between transition bg-pink-50/40";
            btn.innerHTML = `<span class="font-extrabold text-sm text-[#D81B60]"><i class="fa-solid ${breedIcons[size] || 'fa-paw'} mr-2 text-base"></i>${size}</span><span class="text-xs font-bold text-slate-500">View Packages <i class="fa-solid fa-chevron-right ml-1"></i></span>`;
            btn.onclick = () => showGroomingPackages(size);
            grid.appendChild(btn);
        });
    } else if (packageData[category].hasSubCats) {
        header.innerText = `Step 2: Select Bathing Type for ${category}`;
        const subCats = Object.keys(packageData[category].subCategories);

        subCats.forEach(subCat => {
            const btn = document.createElement('div');
            btn.className = "sub-item p-4 rounded-xl border border-slate-200 hover:border-[#0f766e] hover:bg-slate-50 cursor-pointer flex items-center justify-between transition bg-teal-50/30";
            btn.innerHTML = `<span class="font-extrabold text-sm text-[#023047]"><i class="fa-solid fa-shower text-teal-600 mr-2 text-base"></i>${subCat}</span><span class="text-xs font-bold text-slate-500">View Sizes <i class="fa-solid fa-chevron-right ml-1"></i></span>`;
            btn.onclick = () => showSubCategoryPackages(category, subCat);
            grid.appendChild(btn);
        });
    } else {
        header.innerText = `Step 2: Select ${category} Package`;
        packageData[category].forEach(item => {
            const btn = document.createElement('div');
            btn.className = "sub-item p-4 rounded-xl border border-slate-200 hover:border-[#0f766e] hover:bg-slate-50 cursor-pointer flex items-center justify-between transition";
            btn.innerHTML = `<span class="font-semibold text-sm text-slate-700">${item.name}</span><span class="price-tag font-bold text-[#0f766e]">₹${item.price}/-</span>`;
            btn.onclick = () => selectPackage(`${category} - ${item.name}`, item.price);
            grid.appendChild(btn);
        });
    }
}

function showGroomingPackages(breedSize) {
    const grid = document.getElementById('packageListGrid');
    const header = document.getElementById('packageHeaderTitle');
    
    grid.innerHTML = '';
    header.innerText = `Step 2: Grooming Packages (${breedSize})`;

    const backBtn = document.createElement('div');
    backBtn.className = "col-span-full mb-1 text-xs font-bold text-[#0f766e] cursor-pointer hover:underline flex items-center gap-1";
    backBtn.innerHTML = `<i class="fa-solid fa-arrow-left"></i> Change Breed Size`;
    backBtn.onclick = () => selectCategory('Grooming');
    grid.appendChild(backBtn);

    packageData['Grooming'].sizes[breedSize].forEach(item => {
        const btn = document.createElement('div');
        btn.className = "sub-item p-4 rounded-xl border border-slate-200 hover:border-[#0f766e] hover:bg-slate-50 cursor-pointer flex items-center justify-between transition";
        btn.innerHTML = `<span class="font-semibold text-sm text-slate-700"><i class="fa-solid fa-scissors text-[#D81B60] mr-2"></i>${breedSize} - ${item.name}</span><span class="price-tag font-bold text-[#0f766e]">₹${item.price}/-</span>`;
        btn.onclick = () => selectPackage(`Grooming (${breedSize} - ${item.name})`, item.price);
        grid.appendChild(btn);
    });
}

function showSubCategoryPackages(category, subCat) {
    const grid = document.getElementById('packageListGrid');
    const header = document.getElementById('packageHeaderTitle');
    
    grid.innerHTML = '';
    header.innerText = `Step 2: ${subCat} Sizes`;

    const backBtn = document.createElement('div');
    backBtn.className = "col-span-full mb-1 text-xs font-bold text-[#0f766e] cursor-pointer hover:underline flex items-center gap-1";
    backBtn.innerHTML = `<i class="fa-solid fa-arrow-left"></i> Change Bathing Type`;
    backBtn.onclick = () => selectCategory(category);
    grid.appendChild(backBtn);

    packageData[category].subCategories[subCat].forEach(item => {
        const btn = document.createElement('div');
        btn.className = "sub-item p-4 rounded-xl border border-slate-200 hover:border-[#0f766e] hover:bg-slate-50 cursor-pointer flex items-center justify-between transition";
        btn.innerHTML = `<span class="font-semibold text-sm text-slate-700">${subCat} - ${item.name}</span><span class="price-tag font-bold text-[#0f766e]">₹${item.price}/-</span>`;
        btn.onclick = () => selectPackage(`${subCat} (${item.name})`, item.price);
        grid.appendChild(btn);
    });
}

function selectPackage(serviceName, price) {
    document.getElementById('finalSelectedService').value = serviceName;
    document.getElementById('finalSelectedPrice').innerText = `₹${price}/-`;
    document.getElementById('appointmentFormSection').classList.remove('hidden');

    document.getElementById('step3Badge').className = "w-8 h-8 mx-auto rounded-full bg-[#0f766e] text-white font-bold flex items-center justify-center text-sm shadow-sm";
    document.getElementById('step3Text').className = "text-xs font-bold text-[#023047] uppercase tracking-wider";

    document.getElementById('appointmentFormSection').scrollIntoView({ behavior: 'smooth' });
}

// EmailJS Submission Handler
async function handleFinalBooking(event) {
    event.preventDefault();
    
    const form = document.getElementById('bookingForm');
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;

    submitBtn.innerHTML = 'Sending Email...';
    submitBtn.disabled = true;

    const customerName = document.getElementById('customerName').value;
    const customerPhone = document.getElementById('customerPhone').value;
    const customerEmail = document.getElementById('customerEmail').value;
    const bookingDate = document.getElementById('bookingDate').value;
    const selectedService = document.getElementById('finalSelectedService').value;

    try {
        const emailParams = {
            to_name: customerName,
            to_email: customerEmail,
            service_name: selectedService,
            booking_date: bookingDate,
            clinic_phone: "+91 86392 15804[span_6](start_span)"[span_6](end_span)
        };

        await emailjs.send('service_5mvte4b', 'template_88bxqk2', emailParams);

        showToast("Appointment booked successfully! Confirmation email sent.");
        form.reset();
        
        setTimeout(() => {
            location.reload();
        }, 3000);

    } catch (error) {
        console.error('EmailJS Error:', error);
        showToast("Booking recorded, but email failed. Please call us directly.");
    } finally {
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
    }
}

// Toast Notification Helper
function showToast(message) {
    const toast = document.getElementById('toastNotification');
    const toastMsg = document.getElementById('toastMessage');
    if (!toast || !toastMsg) return;

    toastMsg.textContent = message;
    toast.classList.remove('hidden');

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toast.classList.add('hidden');
    }, 4000);
}
