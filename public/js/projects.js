/**
 * DYNAMIC PROJECTS SYSTEM & CATALOG RENDERER
 * Reusable project architecture rendering horizontal stream and filtered grid
 */

import { api } from './api.js';

/**
 * Creates HTML for a project card in the horizontal showcase
 */
const createHorizontalProjectCardHTML = (project, index) => {
  const formattedIndex = String(index + 1).padStart(2, '0');
  const techBadges = (project.technologies || [])
    .slice(0, 4)
    .map((tech) => `<span class="tech-chip-dark">${tech}</span>`)
    .join('');

  return `
    <article class="horizontal-project-card" data-id="${project.id}">
      <div class="card-media-box">
        <span class="card-media-tag">${project.category.toUpperCase()}</span>
        <span class="card-year-tag">${project.year}</span>
        <img src="${project.image}" alt="${project.title} Preview" loading="lazy" />
      </div>
      <div class="card-content-box">
        <span class="card-index-label">PROJECT ${formattedIndex}</span>
        <h3 class="card-title">${project.title}</h3>
        <p class="card-description">${project.description}</p>
        <div class="card-tech-chips">
          ${techBadges}
        </div>
        <div class="card-footer-action">
          <a href="/project.html?id=${encodeURIComponent(project.id)}" class="view-case-link">
            Explore Case Study <span class="arrow-shift-hover">→</span>
          </a>
          ${
            project.links && project.links.github
              ? `<a href="${project.links.github}" target="_blank" rel="noopener noreferrer" class="view-case-link" aria-label="View ${project.title} on GitHub">
                  GitHub ↗
                </a>`
              : ''
          }
        </div>
      </div>
    </article>
  `;
};

/**
 * Creates HTML for a project card in the grid catalog
 */
const createGridProjectCardHTML = (project, index) => {
  const formattedIndex = String(index + 1).padStart(2, '0');
  const techBadges = (project.technologies || [])
    .map((tech) => `<span class="focus-chip">${tech}</span>`)
    .join('');

  return `
    <article class="project-grid-card reveal-fade-up" data-id="${project.id}" data-category="${project.category.toLowerCase()}">
      <div class="card-media-box">
        <span class="card-media-tag">${project.category.toUpperCase()}</span>
        <span class="card-year-tag">${project.year}</span>
        <img src="${project.image}" alt="${project.title} Project Screenshot" loading="lazy" />
      </div>
      <div class="card-content-box" style="background-color: var(--bg-surface-elevated); color: var(--text-primary);">
        <span class="card-index-label">PROJECT ${formattedIndex}</span>
        <h3 class="card-title" style="color: var(--text-primary);">${project.title}</h3>
        <p class="card-description" style="color: var(--text-secondary);">${project.description}</p>
        <div class="card-tech-chips">
          ${techBadges}
        </div>
        <div class="card-footer-action" style="border-color: var(--border-subtle);">
          <a href="/project.html?id=${encodeURIComponent(project.id)}" class="btn-pill btn-primary" style="padding: 0.5rem 1.1rem; font-size: 0.8rem;">
            View Project Case Study →
          </a>
          ${
            project.links && project.links.github
              ? `<a href="${project.links.github}" target="_blank" rel="noopener noreferrer" class="view-case-link" style="color: var(--text-secondary);">
                  Code ↗
                </a>`
              : ''
          }
        </div>
      </div>
    </article>
  `;
};

/**
 * Renders featured projects on the homepage
 */
export const renderFeaturedProjects = async (containerSelector = '#featured-track') => {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  try {
    const featuredProjects = await api.getFeaturedProjects();
    if (!featuredProjects || featuredProjects.length === 0) {
      container.innerHTML = '<p class="text-muted">No featured projects found.</p>';
      return;
    }

    container.innerHTML = featuredProjects
      .map((proj, idx) => createHorizontalProjectCardHTML(proj, idx))
      .join('');
  } catch (err) {
    console.error('Failed to render featured projects:', err);
    container.innerHTML = `
      <div class="card-content-box">
        <p>Could not load featured works. Please ensure the server is active.</p>
      </div>
    `;
  }
};

/**
 * Renders full project catalog on projects.html with live filtering
 */
export const initProjectsCatalog = async () => {
  const gridContainer = document.querySelector('#projects-grid');
  const filterTabsContainer = document.querySelector('#filter-tabs');
  const searchInput = document.querySelector('#project-search');

  if (!gridContainer) return;

  try {
    const allProjects = await api.getProjects();
    let currentFilter = 'all';
    let searchQuery = '';

    const filterAndRender = () => {
      let filtered = allProjects;

      if (currentFilter !== 'all') {
        filtered = filtered.filter(
          (p) => p.category.toLowerCase() === currentFilter.toLowerCase()
        );
      }

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        filtered = filtered.filter(
          (p) =>
            p.title.toLowerCase().includes(query) ||
            p.description.toLowerCase().includes(query) ||
            (p.technologies && p.technologies.some((t) => t.toLowerCase().includes(query)))
        );
      }

      if (filtered.length === 0) {
        gridContainer.innerHTML = `
          <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem;">
            <p style="font-size: 1.25rem; font-weight: 600; color: var(--text-primary);">No projects match your criteria.</p>
            <p style="font-size: 0.95rem; color: var(--text-muted); margin-top: 0.5rem;">Try selecting another category or clearing the search query.</p>
          </div>
        `;
        return;
      }

      gridContainer.innerHTML = filtered
        .map((proj, idx) => createGridProjectCardHTML(proj, idx))
        .join('');
    };

    // Initialize category filter buttons with project counts
    if (filterTabsContainer) {
      const categories = ['ALL', 'MOBILE', 'WEB', 'AI', 'IOT', 'SECURITY'];
      
      filterTabsContainer.innerHTML = categories
        .map((cat) => {
          const count =
            cat === 'ALL'
              ? allProjects.length
              : allProjects.filter((p) => p.category.toUpperCase() === cat).length;
          
          if (count === 0 && cat !== 'ALL') return '';

          return `
            <button class="filter-tab-btn ${cat === 'ALL' ? 'is-active' : ''}" data-cat="${cat.toLowerCase()}">
              ${cat} <span style="font-size: 0.75rem; opacity: 0.7;">(${count})</span>
            </button>
          `;
        })
        .join('');

      filterTabsContainer.addEventListener('click', (e) => {
        const btn = e.target.closest('.filter-tab-btn');
        if (!btn) return;

        filterTabsContainer.querySelectorAll('.filter-tab-btn').forEach((b) => b.classList.remove('is-active'));
        btn.classList.add('is-active');

        currentFilter = btn.dataset.cat;
        filterAndRender();
      });
    }

    // Search input listener
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        filterAndRender();
      });
    }

    // Initial render
    filterAndRender();
  } catch (err) {
    console.error('Failed to load project catalog:', err);
    gridContainer.innerHTML = '<p>Error loading projects. Please try refreshing.</p>';
  }
};
