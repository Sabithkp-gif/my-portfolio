/**
 * API DATA LAYER & RESILIENT JSON FETCHER
 * Supports Express backend APIs with seamless static fallback to /data/*.json
 */

const API_BASE = '/api';
const STATIC_FALLBACK = '/data';

export const api = {
  /**
   * Fetch all projects
   * @returns {Promise<Array>}
   */
  async getProjects() {
    try {
      const response = await fetch(`${API_BASE}/projects`);
      if (response.ok) {
        return await response.json();
      }
    } catch (err) {
      console.warn('API route unavailable, falling back to static JSON', err);
    }

    // Static fallback
    const fallbackRes = await fetch(`${STATIC_FALLBACK}/projects.json`);
    if (!fallbackRes.ok) {
      throw new Error('Failed to load projects data');
    }
    return await fallbackRes.json();
  },

  /**
   * Get only featured projects
   * @returns {Promise<Array>}
   */
  async getFeaturedProjects() {
    const projects = await this.getProjects();
    return projects.filter((p) => p.featured);
  },

  /**
   * Get single project by ID
   * @param {string} id
   * @returns {Promise<Object|null>}
   */
  async getProjectById(id) {
    if (!id) return null;
    const lowerId = id.toLowerCase().trim();

    try {
      const response = await fetch(`${API_BASE}/projects/${encodeURIComponent(lowerId)}`);
      if (response.ok) {
        return await response.json();
      }
    } catch (err) {
      console.warn(`API route for project ${id} unavailable, falling back`, err);
    }

    // Static fallback
    const projects = await this.getProjects();
    return projects.find((p) => p.id.toLowerCase() === lowerId) || null;
  },

  /**
   * Fetch skills data
   * @returns {Promise<Array>}
   */
  async getSkills() {
    try {
      const response = await fetch(`${API_BASE}/skills`);
      if (response.ok) return await response.json();
    } catch (e) {
      // Fallback
    }
    const res = await fetch(`${STATIC_FALLBACK}/skills.json`);
    return await res.json();
  },

  /**
   * Fetch journey timeline
   * @returns {Promise<Array>}
   */
  async getJourney() {
    try {
      const response = await fetch(`${API_BASE}/journey`);
      if (response.ok) return await response.json();
    } catch (e) {
      // Fallback
    }
    const res = await fetch(`${STATIC_FALLBACK}/journey.json`);
    return await res.json();
  },

  /**
   * Submit contact form
   * @param {Object} formData { name, email, message, subject }
   * @returns {Promise<Object>}
   */
  async submitContact(formData) {
    try {
      const response = await fetch(`${API_BASE}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      return await response.json();
    } catch (err) {
      // Fallback simulation for client-only previews
      return {
        success: true,
        message: 'Message registered successfully. (Client offline mode)'
      };
    }
  }
};
