/**
 * LENIS SMOOTH SCROLL INITIALIZATION & GSAP SCROLLTRIGGER SYNC
 */

let lenisInstance = null;

export const initLenis = () => {
  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    console.log('Reduced motion enabled: Skipping Lenis momentum scroll.');
    return null;
  }

  // Check if Lenis is loaded in global scope
  if (typeof window.Lenis === 'undefined') {
    console.warn('Lenis CDN not loaded, falling back to native scroll.');
    return null;
  }

  try {
    lenisInstance = new window.Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false
    });

    // Synchronize with GSAP ScrollTrigger if present
    if (typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined') {
      lenisInstance.on('scroll', window.ScrollTrigger.update);

      window.gsap.ticker.add((time) => {
        lenisInstance.raf(time * 1000);
      });

      window.gsap.ticker.lagSmoothing(0);
    } else {
      const raf = (time) => {
        lenisInstance.raf(time);
        requestAnimationFrame(raf);
      };
      requestAnimationFrame(raf);
    }

    // Scroll to top listener for internal anchor links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href && href !== '#' && document.querySelector(href)) {
          e.preventDefault();
          lenisInstance.scrollTo(href, { offset: -80 });
        }
      });
    });

    return lenisInstance;
  } catch (err) {
    console.error('Error initializing Lenis:', err);
    return null;
  }
};

export const getLenis = () => lenisInstance;
