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
function submitBooking(event) {
    event.preventDefault();
    const serviceName = document.getElementById("selectedServiceInput").value;
    const parentName = document.getElementById("parentName").value;

    closeBookingModal();
    event.target.reset();
    showToast(`Appointment confirmed for ${serviceName} under ${parentName}!`);
}

// Toast Notification Helper
function showToast(msg) {
    const toast = document.getElementById("toast");
    document.getElementById("toastMsg").textContent = msg;
    toast.classList.remove("opacity-0");
    setTimeout(() => toast.classList.add("opacity-0"), 3500);
}
