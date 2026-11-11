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
  if (cartCountBadge && savedCartCount) {
    cartCountBadge.textContent = savedCartCount;
  }
});

// Handle Contact Form Submission
function handleContactSubmit(e) {
  e.preventDefault();
  showToast('Thank you! Your message has been sent successfully.');
  e.target.reset();
}

// Toast Notification Helper
function showToast(message) {
  const banner = document.getElementById('toastBanner');
  const text = document.getElementById('toastMessage');
  if (!banner || !text) return;

  text.textContent = message;
  banner.classList.remove('hidden');
  banner.classList.add('flex');

  setTimeout(() => {
    banner.classList.add('hidden');
    banner.classList.remove('flex');
  }, 3000);
}
