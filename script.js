let count = 0;
const cartCountElement = document.getElementById('cart-count');

function updateCart() {
    count++;
    cartCountElement.innerText = count;
    
    // Simple visual feedback
    cartCountElement.style.transform = "scale(1.2)";
    setTimeout(() => {
        cartCountElement.style.transform = "scale(1)";
    }, 200);

    alert("Item added to your luxury collection!");
}

// Optional: Smooth scroll for nav links
document.querySelectorAll('.nav-links a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const section = document.querySelector('.shop-section');
        section.scrollIntoView({ behavior: 'smooth' });
    });
});
