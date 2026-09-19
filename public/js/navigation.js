/**
 * NAVIGATION MODULE — STICKY HEADER & MOBILE DRAWER
 */

export const initNavigation = () => {
  const header = document.querySelector('.site-header');
  const mobileToggle = document.querySelector('.mobile-menu-btn');
  const mobileDrawer = document.querySelector('.mobile-drawer');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');
  const desktopLinks = document.querySelectorAll('.nav-item-link');

  // 1. Scroll State for Header Island
  const handleScroll = () => {
    if (!header) return;
    if (window.scrollY > 40) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // 2. Active Link Highlighting
  const currentPath = window.location.pathname.toLowerCase();
  
  const updateActiveState = () => {
    desktopLinks.forEach((link) => {
      const href = link.getAttribute('href');
      if (!href) return;
      
      if (
        (currentPath.endsWith('/') && href.includes('index.html')) ||
        (currentPath.includes('projects.html') && href.includes('projects.html')) ||
        (currentPath.includes('about.html') && href.includes('about.html')) ||
        (currentPath.includes('contact.html') && href.includes('contact.html'))
      ) {
        link.classList.add('is-active');
      }
    });

    mobileLinks.forEach((link) => {
      const href = link.getAttribute('href');
      if (!href) return;
      if (currentPath.includes(href)) {
        link.classList.add('is-active');
      }
    });
  };

  updateActiveState();

  // 3. Mobile Menu Toggle
  if (mobileToggle && mobileDrawer) {
    const toggleMenu = () => {
      const isOpen = mobileDrawer.classList.toggle('is-open');
      mobileToggle.classList.toggle('is-open', isOpen);
      mobileToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    mobileToggle.addEventListener('click', toggleMenu);

    mobileLinks.forEach((link) => {
      link.addEventListener('click', () => {
        if (mobileDrawer.classList.contains('is-open')) {
          toggleMenu();
        }
      });
    });

    // Close on Escape key
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileDrawer.classList.contains('is-open')) {
        toggleMenu();
      }
    });
  }
};
