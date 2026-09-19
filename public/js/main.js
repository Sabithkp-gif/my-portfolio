/**
 * MAIN APP INITIALIZER & COORDINATOR
 */

import { initLenis } from './lenis-init.js';
import { initCustomCursor } from './cursor.js';
import { initNavigation } from './navigation.js';
import { initPreloader } from './preloader.js';
import { initAnimations } from './animations.js';
import { renderFeaturedProjects, initProjectsCatalog } from './projects.js';
import { initProjectDetailPage } from './project-detail.js';
import { renderSkillsMatrix } from './skills.js';
import { initContact } from './contact.js';

document.addEventListener('DOMContentLoaded', async () => {
  // 1. Navigation & Cursor
  initNavigation();
  initCustomCursor();

  // 2. Preloader & Motion
  initPreloader(() => {
    initLenis();
    initAnimations();
  });

  // 3. Page specific initializers
  const path = window.location.pathname.toLowerCase();

  // Home Page Initializers
  if (path.endsWith('/') || path.includes('index.html')) {
    await renderFeaturedProjects('#featured-track');
    await renderSkillsMatrix('#skills-grid-root');
    initContact();
  }

  // Projects Catalog Page
  if (path.includes('projects.html')) {
    await initProjectsCatalog();
  }

  // Project Detail Case Study Page
  if (path.includes('project.html')) {
    await initProjectDetailPage();
  }

  // Contact Page
  if (path.includes('contact.html')) {
    initContact();
  }

  // About Page
  if (path.includes('about.html')) {
    await renderSkillsMatrix('#about-skills-root');
  }
});
