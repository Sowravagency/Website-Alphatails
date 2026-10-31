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

    // Razorpay Integration Options
    var options = {
        "key": "rzp_test_TuXiCwoQmHcq2ND", // Replace with your live or test Key ID from Razorpay Dashboard
        "amount": price * 100, // Amount is in currency subunits (Paise). Hence, ₹299 = 29900
        "currency": "INR",
        "name": "Alphatails Pet Clinic",
        "description": `Payment for ${serviceName}`,
        "image": "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=150&q=80",
        "handler": function (response) {
            // This function runs AFTER successful payment
            console.log("Payment Successful ID: " + response.razorpay_payment_id);
            
            // Optional: Save appointment + payment ID to Supabase here
            
            event.target.reset();
            showToast(`Payment successful! Appointment confirmed for ${serviceName}.`);
        },
        "prefill": {
            "name": parentName,
            "contact": phone,
            "email": "alphatails.clinic@gmail.com"
        },
        "theme": {
            "color": "#00796B" // Matches your Alphatails teal palette
        }
    };

    var rzp1 = new Razorpay(options);
    
    rzp1.on('payment.failed', function (response){
        alert("Payment failed: " + response.error.description);
    });

    // Open Razorpay Checkout Window
    rzp1.open();
}

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
