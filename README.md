# PortfolioSite (Vanilla HTML/CSS/JS)

Ultra-minimal, responsive personal portfolio. Static-only: no frameworks, no build step.

## Structure
- `index.html` — main page with sections: About, Portfolio, Collaborations, Contact
- `style.css` — minimalist theme, responsive grid, animations
- `script.js` — smooth scrolling UX, section reveal, mobile nav
- `assets/` — replace SVG placeholders with your images/logos

## Quick edit guide
Open `index.html` and search for these comments:
- "Replace with your concise bio" — update About text
- Portfolio grid: duplicate a `.card` and change `href`, `img`, title, tags
- Clients: swap `assets/client-*.svg` with your logos and update `alt`
- Contact: change email/link; update the form `action` if using Formspree/Netlify
- Footer: your name appears in multiple places — replace `[Your Name]`

Colors and spacing: adjust CSS variables in `style.css` under `:root` (e.g. `--accent`).

## Deploy to Koyeb (Docker - Recommended)
1. Push this folder to a Git repository (GitHub/GitLab).
2. In Koyeb, create a new App → choose your repo.
3. Select "Docker" as the build method.
4. Deploy! The Dockerfile is configured for port 8000.

## Deploy to Koyeb (Static Site)
1. Push this folder to a Git repository (GitHub/GitLab).
2. In Koyeb, create a new App → choose your repo.
3. Select a Static Site (no runtime).
4. Deploy! All files are served as-is.

## Debug Steps
If the site doesn't load:
1. Check Koyeb logs for errors
2. Verify all files are in the repository (index.html, testimonianze.html, assets/, etc.)
3. Check that the Dockerfile is in the root directory

## Accessibility & performance
- Semantic headings, skip link, reduced motion support
- System font stack, minimal JS, lazy images

## License
You own your content (text/images). Code is MIT.
