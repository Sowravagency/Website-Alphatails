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
      hamburgerIcon.classList.toggle('hidden', isOpen);
      closeIcon.classList.toggle('hidden', !isOpen);
    });
  }

  // 2. Sync Cart Count Badge from LocalStorage (if present)
  const cartCountBadge = document.getElementById('cartCount');
  const savedCartCount = localStorage.getItem('alphatails_cart_count');
  if (cartCountBadge && savedCartCount) {
    cartCountBadge.textContent = savedCartCount;
  }
});
