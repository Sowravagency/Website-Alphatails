// Open Booking Modal with Selected Service & Price in INR
function openBookingModal(serviceName, price) {
    document.getElementById("selectedServiceInput").value = serviceName;
    document.getElementById("modalPriceSubtitle").textContent = `Selected Service Fee: ₹${price}/-`;
    
    const modal = document.getElementById("bookingModal");
    modal.classList.remove("hidden");
    modal.classList.add("flex");
}

// Close Booking Modal
function closeBookingModal() {
    const modal = document.getElementById("bookingModal");
    modal.classList.add("hidden");
    modal.classList.remove("flex");
}

// Handle Form Submission
// Open Booking Modal with Selected Service & Price in INR
function openBookingModal(serviceName, price) {
    document.getElementById("selectedServiceInput").value = serviceName;
    document.getElementById("modalPriceSubtitle").textContent = `Selected Service Fee: ₹${price}/-`;
    
    // Store price globally so the submit function can access it
    window.currentServicePrice = price;

    const modal = document.getElementById("bookingModal");
    modal.classList.remove("hidden");
    modal.classList.add("flex");
}

// Close Booking Modal
function closeBookingModal() {
    const modal = document.getElementById("bookingModal");
    modal.classList.add("hidden");
    modal.classList.remove("flex");
}

// Handle Form Submission & Trigger Payment Gateway
function submitBooking(event) {
    event.preventDefault();
    
    const serviceName = document.getElementById("selectedServiceInput").value;
    const parentName = document.getElementById("parentName").value;
    const phone = document.getElementById("parentPhone").value;
    const price = window.currentServicePrice || 299; // Default fallback fee

    closeBookingModal();

    
// Toast Notification Helper
function showToast(msg) {
    const toast = document.getElementById("toast");
    if (!toast) return;
    document.getElementById("toastMsg").textContent = msg;
    toast.classList.remove("opacity-0");
    setTimeout(() => toast.classList.add("opacity-0"), 3500);
}


// Toast Notification Helper
function showToast(msg) {
    const toast = document.getElementById("toast");
    document.getElementById("toastMsg").textContent = msg;
    toast.classList.remove("opacity-0");
    setTimeout(() => toast.classList.add("opacity-0"), 3500);
}
