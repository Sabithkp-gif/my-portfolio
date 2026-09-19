/**
 * DYNAMIC PROJECT DETAIL & CASE STUDY LOADER
 * Parses URL query parameters and dynamically populates case study
 */

import { api } from './api.js';

export const initProjectDetailPage = async () => {
  const container = document.querySelector('#case-study-root');
  if (!container) return;

  const urlParams = new URLSearchParams(window.location.search);
  const projectId = urlParams.get('id') || 'michat'; // Default to first project if omitted

  try {
    const allProjects = await api.getProjects();
    const currentIndex = allProjects.findIndex(
      (p) => p.id.toLowerCase() === projectId.toLowerCase()
    );

    const project = currentIndex !== -1 ? allProjects[currentIndex] : null;

    if (!project) {
      container.innerHTML = `
        <div class="container section-padding" style="text-align: center;">
          <h1 class="section-headline">Project Not Found</h1>
          <p style="margin: 1.5rem 0;">The project identifier "${projectId}" does not exist in the catalog.</p>
          <a href="/projects.html" class="btn-pill btn-primary">Return to All Projects →</a>
        </div>
      `;
      return;
    }

    // Next Project in array (loops back to 0)
    const nextIndex = (currentIndex + 1) % allProjects.length;
    const nextProject = allProjects[nextIndex];

    // Update document title for SEO
    document.title = `${project.title} — Case Study | Sabith`;

    const cs = project.caseStudy || {};
    const techPills = (project.technologies || [])
      .map((tech) => `<span class="focus-chip" style="font-size: 0.85rem; padding: 0.4rem 0.9rem;">${tech}</span>`)
      .join('');

    const featuresList = (cs.features || [])
      .map((feat) => `<li class="case-feature-li">${feat}</li>`)
      .join('');

    const metricsList = (cs.metrics || [])
      .map(
        (m) => `
          <div class="metric-stat-card">
            <div class="metric-stat-val">${m.value}</div>
            <div class="metric-stat-lbl">${m.label}</div>
          </div>
        `
      )
      .join('');

    container.innerHTML = `
      <article class="case-study-article">
        <!-- Header -->
        <header class="case-hero-header container">
          <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.25rem;">
            <a href="/projects.html" class="view-case-link" style="color: var(--text-secondary); font-size: 0.85rem;">
              ← Back to Selected Works
            </a>
            <span style="color: var(--border-strong);">/</span>
            <span class="eyebrow-label" style="font-size: 0.75rem;">${project.category}</span>
          </div>

          <h1 class="hero-giant-title" style="font-size: clamp(3rem, 7.5vw, 6.5rem); margin-bottom: 1rem;">
            ${project.title}
          </h1>
          <p class="section-subhead" style="font-size: clamp(1.2rem, 1.8vw, 1.5rem);">
            ${project.tagline || project.description}
          </p>

          <!-- Meta Grid -->
          <div class="case-meta-grid">
            <div class="case-meta-item">
              <span class="case-meta-item-label">Category</span>
              <span class="case-meta-item-val">${project.category}</span>
            </div>
            <div class="case-meta-item">
              <span class="case-meta-item-label">Timeline / Year</span>
              <span class="case-meta-item-val">${cs.duration || project.year}</span>
            </div>
            <div class="case-meta-item">
              <span class="case-meta-item-label">Role</span>
              <span class="case-meta-item-val">${cs.role || 'Lead Engineer'}</span>
            </div>
            <div class="case-meta-item">
              <span class="case-meta-item-label">Deliverables</span>
              <div style="display: flex; gap: 0.75rem; margin-top: 0.2rem;">
                ${
                  project.links && project.links.live
                    ? `<a href="${project.links.live}" target="_blank" rel="noopener noreferrer" class="btn-pill btn-primary" style="padding: 0.35rem 0.9rem; font-size: 0.75rem;">Live Demo ↗</a>`
                    : ''
                }
                ${
                  project.links && project.links.github
                    ? `<a href="${project.links.github}" target="_blank" rel="noopener noreferrer" class="btn-pill btn-secondary" style="padding: 0.35rem 0.9rem; font-size: 0.75rem;">GitHub ↗</a>`
                    : ''
                }
              </div>
            </div>
          </div>
        </header>

        <!-- Project Hero Graphic -->
        <section class="container">
          <div class="case-cover-banner">
            <img src="${project.image}" alt="${project.title} High Resolution Preview" style="width: 100%; height: auto;" />
          </div>
        </section>

        <!-- Main Body: Overview & Challenge/Solution -->
        <section class="container">
          <div class="case-body-section">
            <div class="case-info-panel">
              <span class="eyebrow-label"><span class="eyebrow-dot"></span> 01 / Overview</span>
              <h2 style="font-size: 1.75rem;">Context &amp; Purpose</h2>
              <p>${cs.overview || project.description}</p>
              
              <div style="margin-top: 1rem;">
                <span class="eyebrow-label" style="margin-bottom: 0.75rem;">Technologies Employed</span>
                <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.5rem;">
                  ${techPills}
                </div>
              </div>
            </div>

            <div class="case-info-panel">
              <span class="eyebrow-label" style="color: var(--accent);"><span class="eyebrow-dot"></span> 02 / Engineering Execution</span>
              <h3 style="font-size: 1.35rem; margin-top: 0.5rem;">The Core Challenge</h3>
              <p style="font-size: 0.95rem;">${cs.challenge || 'Engineering high-concurrency real-time data flows without frame degradation.'}</p>
              
              <h3 style="font-size: 1.35rem; margin-top: 1rem; color: var(--accent);">The Architectural Solution</h3>
              <p style="font-size: 0.95rem;">${cs.solution || 'Implemented asynchronous event loops and optimized memory caching.'}</p>
            </div>
          </div>

          <!-- Key Features & Metrics -->
          <div class="case-info-panel" style="margin-bottom: var(--space-xl);">
            <span class="eyebrow-label"><span class="eyebrow-dot"></span> 03 / Key Capabilities &amp; Measured Metrics</span>
            <div class="grid-2col" style="align-items: start; margin-top: 1rem;">
              <div>
                <h3 style="font-size: 1.35rem; margin-bottom: 1rem;">Feature Highlights</h3>
                <ul class="case-feature-ul">
                  ${featuresList}
                </ul>
              </div>
              <div>
                <h3 style="font-size: 1.35rem; margin-bottom: 1rem;">Benchmarked Outcomes</h3>
                <div class="case-metrics-container">
                  ${metricsList}
                </div>
              </div>
            </div>
          </div>

          <!-- Next Project Navigation Teaser -->
          <div class="currently-building-wrapper" style="margin-bottom: var(--space-xl);">
            <div class="currently-building-grid">
              <div>
                <span class="eyebrow-label" style="color: var(--accent); margin-bottom: 0.75rem;">NEXT CASE STUDY</span>
                <h2 class="building-title">${nextProject.title}</h2>
                <p class="building-desc">${nextProject.tagline || nextProject.description}</p>
                <a href="/project.html?id=${encodeURIComponent(nextProject.id)}" class="btn-pill btn-accent">
                  View Next Project (${nextProject.title}) →
                </a>
              </div>
              <div style="max-width: 320px; border-radius: var(--radius-md); overflow: hidden; justify-self: end;">
                <img src="${nextProject.image}" alt="${nextProject.title}" style="width: 100%; height: auto; border-radius: var(--radius-md);" />
              </div>
            </div>
          </div>
        </section>
      </article>
    `;
  } catch (err) {
    console.error('Failed to render project detail page:', err);
    container.innerHTML = '<p class="container">Error loading case study.</p>';
  }
};
