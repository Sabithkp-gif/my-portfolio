/**
 * SKILLS & CAPABILITIES MATRIX CONTROLLER
 * Real engineering capabilities and contextual highlights (no fake percentage bars)
 */

import { api } from './api.js';

export const renderSkillsMatrix = async (containerSelector = '#skills-grid-root') => {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  try {
    const categories = await api.getSkills();
    if (!categories || categories.length === 0) return;

    container.innerHTML = categories
      .map((cat, idx) => {
        const skillsListHTML = cat.skills
          .map(
            (skill) => `
              <div class="skill-item-row">
                <div class="skill-item-top">
                  <span class="skill-name">${skill.name}</span>
                  <span class="skill-level-badge">${skill.level}</span>
                </div>
                <p class="skill-highlight-text">${skill.highlight}</p>
              </div>
            `
          )
          .join('');

        return `
          <div class="skill-category-card reveal-fade-up">
            <div class="skill-category-header">
              <h3 class="skill-cat-title">${cat.category}</h3>
              <span class="skill-cat-icon">0${idx + 1}</span>
            </div>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.5rem;">${cat.description}</p>
            <div class="skill-items-list">
              ${skillsListHTML}
            </div>
          </div>
        `;
      })
      .join('');
  } catch (err) {
    console.error('Failed to render skills:', err);
  }
};
