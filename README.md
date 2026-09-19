# Sabith — Premium Creative Developer Portfolio

An editorial, minimal, and high-performance developer portfolio engineered with **HTML5**, **modular CSS3**, **ES6+ JavaScript**, **GSAP 3**, **Lenis Smooth Scroll**, and a lightweight **Node.js Express** backend.

---

## 🏛️ Architecture & Visual Philosophy

- **Visual Direction**: Editorial, Minimal, Technical, Cinematic, and Apple-like Restraint.
- **Palette**: Warm ivory canvas (`#F6F5F2`), deep charcoal (`#121212`), muted stone gray (`#848077`), and understated terracotta accent (`#C85A32`).
- **Typography**: `Space Grotesk`, `Instrument Serif`, `Syne`, `Plus Jakarta Sans`, and `JetBrains Mono`.
- **Motion & Interactivity**:
  - Pinned horizontal featured showcase powered by GSAP ScrollTrigger (desktop) with fallback vertical flow for mobile.
  - Multi-layer workspace hero parallax reacting smoothly to 60fps cursor movements.
  - Physics-based magnetic buttons & custom desktop cursor.
  - Momentum scrolling via `@studio-freight/lenis`.
  - Full `prefers-reduced-motion` accessibility support.

---

## 📁 Directory Structure

```
my-portfolio/
├── package.json
├── server/
│   └── server.js                  # Express static server & REST API
├── public/
│   ├── index.html                 # Cinematic Homepage (Hero, Parallax, Showcase, Matrix, Contact)
│   ├── projects.html              # Filterable Project Catalog (ALL, MOBILE, WEB, AI, IOT, SECURITY)
│   ├── project.html               # Dynamic Project Detail / Case Study Page (?id=...)
│   ├── about.html                 # Biography, Principles & Hardware/Software Lab Setup
│   ├── contact.html               # Direct Communication Hub with live time clock & validated form
│   │
│   ├── css/
│   │   ├── main.css               # Design tokens, typography hierarchy, reset, layout
│   │   ├── components.css         # Navigation island, cards, magnetic buttons, cursor, preloader
│   │   ├── animations.css         # Scroll reveals, keyframes, transitions, reduced motion
│   │   └── responsive.css         # Breakpoint rules (320px, 375px, 768px, 1024px, 1440px+)
│   │
│   ├── js/
│   │   ├── api.js                 # Resilient API fetcher with fallback JSON loader
│   │   ├── lenis-init.js          # Lenis smooth scroll coordinator
│   │   ├── cursor.js              # Desktop magnetic custom cursor
│   │   ├── navigation.js          # Floating sticky nav, active links, mobile drawer
│   │   ├── preloader.js           # Minimal 0→100% counter & page entrance
│   │   ├── animations.js          # GSAP ScrollTrigger parallax & horizontal track pinning
│   │   ├── projects.js            # Dynamic project stream & filter tab engine
│   │   ├── project-detail.js      # Dynamic case-study renderer from ?id= query param
│   │   ├── skills.js              # Interactive capabilities matrix renderer
│   │   ├── contact.js             # Form validation, live IST clock, clipboard email copy
│   │   └── main.js                # App bootstrap & event delegation
│   │
│   ├── data/
│   │   ├── projects.json          # Reusable project catalog & case studies
│   │   ├── skills.json            # Categorized engineering capabilities
│   │   └── journey.json           # Milestones & timeline
│   │
│   └── assets/
│       ├── images/                # Workspace composition graphics
│       ├── projects/              # High-res SVG mockups (MiChat, PulseOS, Lumina, Cerebro, etc.)
│       └── favicon/               # Brand SVG favicon
└── README.md
```

---

## 🚀 Running Locally

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the local server**:
   ```bash
   npm start
   # or for live reloading:
   npm run dev
   ```

3. **Open in browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 🛠️ Adding New Projects (Dynamic Architecture)

Projects are decoupled from the HTML structure and read from `/public/data/projects.json` (or `/api/projects`).

To add a new project, simply append an entry to `public/data/projects.json`:

```json
{
  "id": "new-project-slug",
  "title": "Project Title",
  "tagline": "One-line descriptive summary.",
  "description": "Comprehensive project description.",
  "category": "Mobile",
  "year": 2026,
  "featured": true,
  "image": "/assets/projects/new-project.svg",
  "technologies": ["Flutter", "Dart", "Backend"],
  "links": {
    "live": "https://...",
    "github": "https://github.com/..."
  },
  "caseStudy": {
    "role": "Lead Engineer",
    "duration": "3 Months",
    "overview": "Context and problem overview...",
    "challenge": "Core engineering hurdles...",
    "solution": "Architectural solution...",
    "features": ["Feature 1", "Feature 2"],
    "metrics": [
      { "label": "Latency", "value": "< 30ms" }
    ]
  }
}
```

The application will automatically:
- Render it in the Featured Works horizontal gallery on the homepage (if `featured: true`).
- Index it on the All Projects catalog page (`projects.html`) with category filters.
- Generate its dedicated interactive case study page (`/project.html?id=new-project-slug`).

---

## 🔮 Future Admin CMS Integration Guide

The system is prepared for seamless transition into a full CMS:
- **API Endpoint Mapping**:
  - `GET /api/projects` -> fetches all projects
  - `GET /api/projects/:id` -> fetches single project
  - `POST /api/projects` -> create new project (requires JWT auth)
  - `PUT /api/projects/:id` -> update project
  - `DELETE /api/projects/:id` -> remove project
- The client-side JavaScript calls `api.js`, which means zero frontend refactoring is needed when switching from static JSON to a database-backed API.
