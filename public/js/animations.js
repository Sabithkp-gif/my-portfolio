/**
 * GSAP & SCROLLTRIGGER ANIMATION & PARALLAX SYSTEM
 * 3D Multi-Layer Hero Parallax • Scroll-Driven Card Image Parallax • Horizontal Gallery • Magnetic Physics
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

  // 1. Interactive 3D Multi-Layer Mouse Parallax on Hero
  const stage = document.querySelector('#hero-parallax-stage');
  const layers = document.querySelectorAll('#hero-parallax-stage .parallax-layer');

  if (stage && window.innerWidth > 1024) {
    const rotXTo = gsap.quickTo(stage, 'rotationX', { duration: 0.7, ease: 'power2.out' });
    const rotYTo = gsap.quickTo(stage, 'rotationY', { duration: 0.7, ease: 'power2.out' });
    const stageXTo = gsap.quickTo(stage, 'x', { duration: 0.8, ease: 'power2.out' });
    const stageYTo = gsap.quickTo(stage, 'y', { duration: 0.8, ease: 'power2.out' });

    // Individual layer quickTo setters
    const layerSetters = Array.from(layers).map((layer) => ({
      el: layer,
      depth: parseFloat(layer.dataset.depth || '0.5'),
      xTo: gsap.quickTo(layer, 'x', { duration: 0.6, ease: 'power2.out' }),
      yTo: gsap.quickTo(layer, 'y', { duration: 0.6, ease: 'power2.out' })
    }));

    window.addEventListener('mousemove', (e) => {
      const { innerWidth, innerHeight } = window;
      const xNorm = (e.clientX / innerWidth - 0.5) * 2; // -1 to 1
      const yNorm = (e.clientY / innerHeight - 0.5) * 2;

      // 3D stage tilt
      rotYTo(xNorm * 12);
      rotXTo(-yNorm * 10);
      stageXTo(xNorm * 15);
      stageYTo(yNorm * 12);

      // Layer displacement by depth
      layerSetters.forEach(({ depth, xTo, yTo }) => {
        xTo(xNorm * depth * 28);
        yTo(yNorm * depth * 24);
      });
    });

    // Reset smoothly when leaving window
    document.addEventListener('mouseleave', () => {
      rotXTo(0);
      rotYTo(0);
      stageXTo(0);
      stageYTo(0);
      layerSetters.forEach(({ xTo, yTo }) => {
        xTo(0);
        yTo(0);
      });
    });
  }

  // 2. Scroll-Driven Parallax on Hero Section
  if (ScrollTrigger) {
    const heroSection = document.querySelector('.hero-section');
    const heroTitle = document.querySelector('.hero-giant-title');
    const heroVisual = document.querySelector('#hero-parallax-stage');

    if (heroSection && heroTitle) {
      gsap.to(heroTitle, {
        yPercent: -22,
        ease: 'none',
        scrollTrigger: {
          trigger: heroSection,
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      });
    }

    if (heroSection && heroVisual) {
      gsap.to(heroVisual, {
        yPercent: 18,
        ease: 'none',
        scrollTrigger: {
          trigger: heroSection,
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      });
    }

    // Scroll parallax on project card images (cinematic depth feel)
    const initCardImageParallax = () => {
      const cards = document.querySelectorAll('.horizontal-project-card, .project-grid-card');
      cards.forEach((card) => {
        const img = card.querySelector('.card-media-box img');
        if (img) {
          gsap.fromTo(
            img,
            { yPercent: -8, scale: 1.06 },
            {
              yPercent: 8,
              scale: 1.0,
              ease: 'none',
              scrollTrigger: {
                trigger: card,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 0.5
              }
            }
          );
        }
      });
    };

    // Run after project cards are injected
    setTimeout(initCardImageParallax, 400);

    // Editorial quote scroll parallax
    const quote = document.querySelector('.editorial-big-quote');
    if (quote) {
      gsap.to(quote, {
        yPercent: -12,
        ease: 'none',
        scrollTrigger: {
          trigger: quote,
          start: 'top 90%',
          end: 'bottom 10%',
          scrub: true
        }
      });
    }
  }

  // 3. Horizontal Featured Work Gallery (Desktop Only)
  const setupHorizontalScroll = () => {
    const section = document.querySelector('.horizontal-section-pin');
    const track = document.querySelector('.horizontal-track-container');

    if (!section || !track || !ScrollTrigger) return;

    if (window.innerWidth > 768) {
      const getScrollAmount = () => -(track.scrollWidth - window.innerWidth + 160);

      gsap.to(track, {
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

  // 4. Magnetic Buttons Interaction
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

  // 5. Staggered Section Reveals with ScrollTrigger
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
