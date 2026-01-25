# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server at localhost:4321
npm run build    # Build production site to ./dist/
npm run preview  # Preview production build locally
npm run deploy   # Build and deploy to Cloudflare Workers
```

## Architecture

This is an Astro 5 static site for MellSnap Photography, deployed to Cloudflare Workers.

### Tech Stack
- **Astro 5** with static output (`output: 'static'`)
- **Tailwind CSS 4** via Vite plugin (not PostCSS)
- **Cloudflare Workers** for hosting (via Wrangler)

### Content Collections

Two collections defined in `src/content.config.ts`:

**Blog** (`src/content/blog/*.md`):
- Frontmatter: title, date (Date), excerpt, image, published (bool)
- Rendered via `src/pages/blog/[slug].astro`

**Portfolio** (`src/content/portfolio/*.md`):
- Frontmatter: title, category (family|maternity|love|children|events), description, image, featured, order

### Design System

Defined in `src/styles/global.css` using Tailwind's `@theme`:

**Colors**: `beige` (#e9e1d9), `pink` (#995d7c), `primary-text`, `secondary-text`, `section-bg`

**Fonts**:
- `font-cormorant` - body text, headings
- `font-playfair` - navigation (uppercase)
- `font-ephesis` - script/decorative
- `font-raleway` - labels, buttons

**Utility classes**: `.label`, `.nav-link`, `.btn`, `.btn-primary`, `.btn-secondary`, `.container`, `.img-hover`

### Layout Structure

`BaseLayout.astro` wraps all pages with:
- Maternity leave banner (top)
- Header with navigation
- Main content slot
- Footer

### Key Routes

- `/` - Homepage
- `/services/` - Package overview
- `/quick-photoshoot/`, `/full-photoshoot/`, `/event-photography/` - Individual service pages
- `/portfolio/` - Gallery index with category links
- `/portfolio/{category}/` - Category galleries (family, maternity, love, children, events)
- `/blog/` - Blog listing
- `/blog/{slug}/` - Individual posts from content collection

### Configuration

- `trailingSlash: 'always'` - all URLs end with `/`
- Site URL: `https://mellsnap.co.uk`
- Sitemap auto-generated via `@astrojs/sitemap`
