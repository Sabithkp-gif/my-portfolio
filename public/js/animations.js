/**
 * GSAP & SCROLLTRIGGER ANIMATION SYSTEM
 * Hero Parallax • Horizontal Gallery Pinned Scroll • Magnetic Buttons • Scroll Reveals
 */

export const initAnimations = () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    document.querySelectorAll('.reveal-fade-up, .reveal-fade-in').forEach((el) => {
      el.classList.add('is-inview');
    });
    return;
  }

  // Ensure GSAP and ScrollTrigger are loaded
  if (typeof window.gsap === 'undefined') {
    console.warn('GSAP not detected, skipping advanced timeline choreography.');
    return;
  }

  const { gsap } = window;
  const ScrollTrigger = window.ScrollTrigger;
  if (ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
  }

  // 1. Hero Mouse Parallax (Desktop Only)
  const heroVisual = document.querySelector('.hero-composition-stage');
  if (heroVisual && window.innerWidth > 1024) {
    const xTo = gsap.quickTo(heroVisual, 'x', { duration: 0.8, ease: 'power2.out' });
    const yTo = gsap.quickTo(heroVisual, 'y', { duration: 0.8, ease: 'power2.out' });
    const rotTo = gsap.quickTo(heroVisual, 'rotationY', { duration: 0.8, ease: 'power2.out' });

    window.addEventListener('mousemove', (e) => {
      const { innerWidth, innerHeight } = window;
      const xNorm = (e.clientX / innerWidth - 0.5) * 2; // -1 to 1
      const yNorm = (e.clientY / innerHeight - 0.5) * 2;

      xTo(xNorm * 22);
      yTo(yNorm * 18);
      rotTo(xNorm * 6);
    });
  }

  // 2. Horizontal Featured Work Gallery (Desktop Only)
  const setupHorizontalScroll = () => {
    const section = document.querySelector('.horizontal-section-pin');
    const track = document.querySelector('.horizontal-track-container');

    if (!section || !track || !ScrollTrigger) return;

    if (window.innerWidth > 768) {
      const getScrollAmount = () => -(track.scrollWidth - window.innerWidth + 160);

      const tween = gsap.to(track, {
        x: getScrollAmount,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          pin: true,
          scrub: 1,
          start: 'top top',
          end: () => `+=${track.scrollWidth - window.innerWidth + 400}`,
          invalidateOnRefresh: true
        }
      });
    }
  };

  setupHorizontalScroll();

  // 3. Magnetic Buttons Interaction
  const setupMagneticButtons = () => {
    if (window.innerWidth <= 1024) return;

    const magneticBtns = document.querySelectorAll('.btn-magnetic, .btn-pill');
    magneticBtns.forEach((btn) => {
      const xTo = gsap.quickTo(btn, 'x', { duration: 0.4, ease: 'power2.out' });
      const yTo = gsap.quickTo(btn, 'y', { duration: 0.4, ease: 'power2.out' });

      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const relX = e.clientX - (rect.left + rect.width / 2);
        const relY = e.clientY - (rect.top + rect.height / 2);

        xTo(relX * 0.35);
        yTo(relY * 0.35);
      });

      btn.addEventListener('mouseleave', () => {
        xTo(0);
        yTo(0);
      });
    });
  };

  setupMagneticButtons();

  // 4. Staggered Section Reveals with ScrollTrigger
  if (ScrollTrigger) {
    const revealElements = document.querySelectorAll('.reveal-fade-up');
    revealElements.forEach((el) => {
      ScrollTrigger.create({
        trigger: el,
        start: 'top 88%',
        onEnter: () => el.classList.add('is-inview'),
        once: true
      });
    });
  } else {
    // Fallback Intersection Observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-inview');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    document.querySelectorAll('.reveal-fade-up').forEach((el) => observer.observe(el));
  }
};
