# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server at localhost:4321
npm run build        # Production build to ./dist/
npm run preview      # Preview production build locally
npm run lint         # Run ESLint
npm run lint:fix     # Run ESLint with auto-fix
npm run format       # Format with Prettier
npm run format:check # Check formatting
```

## Architecture

This is a personal portfolio and blog site built with Astro, Tailwind CSS v4, and TypeScript.

### Path Aliases

Configured in `tsconfig.json`:
- `@components/*` → `src/components/*`
- `@layouts/*` → `src/layouts/*`
- `@content/*` → `src/content/*`
- `@utils/*` → `src/utils/*`
- `@styles/*` → `src/styles/*`

### Content Collections

Defined in `src/content.config.ts`:
- **blog**: Markdown posts in `src/content/blog/` with frontmatter (title, description, pubDate, tags, author, draft)
- **projects**: Markdown in `src/content/projects/` with frontmatter (title, description, technologies, liveUrl, githubUrl, featured)

### Design System

Tailwind v4 configuration lives in `src/styles/global.css` using `@theme` directive:
- **Colors**: `primary-*` (blue), `accent-*` (amber/coffee), `neutral-*` (slate)
- **Fonts**: Inter (body), JetBrains Mono (code) - loaded via Google Fonts in BaseLayout
- **Animations**: `animate-in`, `delay-1/2/3/4`, `hover-lift`, `link-underline`
- **Utilities**: `.card`, `.btn`, `.btn-primary`, `.btn-secondary`, `.prose`

Note: The `.card` class sets a white background. Don't combine it with dark backgrounds - apply styles directly instead.

### Layouts

- `BaseLayout.astro`: Main layout with Header, Footer, meta tags, and Google Fonts
- `BlogPost.astro`: Blog post layout with author info, reading time, share buttons, prev/next navigation

### Key Components

- `Hero.astro`: Configurable hero with title, subtitle, description, and CTAs
- `ProjectCard.astro`: Project display with problem/solution format and tech badges
- `BlogPostCard.astro`: Blog post preview with tags and reading time
- `SocialLinks.astro`: Reusable social icons (used in Footer and ContactCTA)
- `ShareButtons.astro`: Twitter, LinkedIn, and copy link sharing

### Blog Features

- Tag filtering via `/blog/tag/[tag]` routes
- Related posts based on shared tags
- Prev/next post navigation
- Reading time calculation in `src/utils/readingTime.ts`
