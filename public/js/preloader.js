/**
 * EDITORIAL PRELOADER SEQUENCE
 * Fast, elegant 0 → 100% counter with smooth page reveal
 */

export const initPreloader = (onComplete) => {
  const preloader = document.querySelector('.preloader-overlay');
  const counter = document.querySelector('.preloader-counter');
  const barFill = document.querySelector('.preloader-bar-fill');

  if (!preloader) {
    if (onComplete) onComplete();
    return;
  }

  // Respect reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    preloader.style.display = 'none';
    if (onComplete) onComplete();
    return;
  }

  let progress = 0;
  const duration = 900; // Fast and snappy (0.9s total)
  const intervalTime = 18;
  const step = 100 / (duration / intervalTime);

  const timer = setInterval(() => {
    progress = Math.min(100, Math.round(progress + step + (Math.random() * 2)));

    if (counter) {
      counter.textContent = String(progress).padStart(2, '0');
    }

    if (barFill) {
      barFill.style.width = `${progress}%`;
    }

    if (progress >= 100) {
      clearInterval(timer);
      setTimeout(() => {
        preloader.classList.add('is-loaded');
        document.body.classList.add('page-ready');
        if (onComplete) onComplete();
      }, 150);
    }
  }, intervalTime);
};
