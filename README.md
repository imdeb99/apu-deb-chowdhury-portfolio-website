# Apu Deb Chowdhury — Portfolio Website

A modern, responsive multi-page portfolio site for **Apu Deb Chowdhury**, a Computer Science graduate and software engineer. Built with HTML, Tailwind CSS, and vanilla JavaScript — optimized for performance, accessibility, and a consistent design system across all pages.

## Preview

Open the live site locally, or deploy the static files to any hosting provider (Netlify, Vercel, GitHub Pages, etc.).

## Features

### Design system
- **Single primary accent color** (`#0284c7`) used consistently across every page for links, buttons, active states, icons, and badges — no per-card or per-category color rotations.
- **Uniform chip components** for skills and project tech stacks (`src/css/styles.css` → `.chip`).
- Consistent typography hierarchy, section spacing, and card-based layouts throughout.
- **Dark / light mode** with persisted preference via a toggle in the top navbar.

### Pages
- **Home** (`index.html`) — hero, about, experience & education timelines, skills, projects preview, blog preview, gallery preview, contact, footer.
- **Projects** (`pages/projects.html`) — the real portfolio projects.
- **Blog** (`pages/blog.html`) — technical articles and insights.
- **Gallery** (`pages/gallery.html`) — a photo grid with category filters and a click-to-preview lightbox.
- **Services** (`pages/services.html`) — service offerings, delivery process, and an inquiry form.

### Interactive elements
- Mobile-bottom navigation plus a hamburger menu (icon-only on small screens, no duplication).
- Scroll-spy active-state highlighting in the main navbar.
- Contact/inquiry form with validation (`src/js/app.js`).
- Back-to-top button, smooth scrolling, and scroll-reveal animations.
- Resume download.

### Technical
- Semantic HTML5, proper heading order, `alt`/`aria-label` on all images and icon-only controls.
- Tailwind CSS via CDN with a shared `primary` palette in each page's config.
- Responsive from 375px mobile up to desktop (single column → 2-column → full layout).
- SEO meta tags (Open Graph, Twitter Card).

## Project structure

```
apu-deb-chowdhury-portfolio/
├── index.html                  # Landing page
├── README.md
├── pages/
│   ├── projects.html           # Project showcase
│   ├── blog.html               # Blog listing
│   ├── gallery.html            # Photo grid + lightbox
│   └── services.html           # Services & contact
└── src/
    ├── css/
    │   └── styles.css          # Custom styles + design-system utilities
    ├── js/
    │   ├── app.js              # Theme, nav, forms, animations, lightbox
    │   └── config.js           # Global config
    └── assets/
        ├── images/             # Photos (project screenshots, blog covers, gallery)
        └── resume/             # CV/resume PDF
```

## Getting started

**Prerequisites:** a modern browser; a local static server (any of the options below).

```bash
# Option 1 — Python (no install required)
python3 -m http.server 8000

# Option 2 — Node http-server
npx http-server .

# Option 3 — VS Code "Live Server"
# Right-click index.html → Open with Live Server
```

Then open <http://localhost:8000>.

No build step or package install is required — the site runs as plain static files.

## Adding images

Real photos are added manually by the site owner. Each project, blog, and gallery card shows a **placeholder** with the filename it expects (e.g. `smart-med.jpg`, `deb-commerce.jpg`, `gallery-ceh-1.jpg`). Drop the matching file into `src/assets/images/…` (or the `gallery/` subfolder) and it appears with zero code changes.

## Customization

- **Colors / spacing / typography:** edit the `tailwind.config` `primary` palette in each page and the design-system utilities in `src/css/styles.css`.
- **Content:** edit the relevant section directly in each `*.html` file.
- **Nav behavior, forms, animations:** edit `src/js/app.js` (keep element IDs like `theme-toggle`, `mobile-menu`, `back-to-top`, `contact-form` intact).

## Deploying

Because it's pure static HTML, deploy by:

1. Building nothing — just upload the project folder, or
2. Pushing to GitHub and enabling Pages, or
3. Dragging the folder into Netlify/Vercel.

## Author

**Apu Deb Chowdhury**
- GitHub: [@imdeb99](https://github.com/imdeb99)
- LinkedIn: [Apu Deb Chowdhury](https://www.linkedin.com/in/apudebchowdhury)
- Location: Habiganj, Sylhet, Bangladesh 🇧🇩