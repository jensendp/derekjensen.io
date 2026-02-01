# Demo Sites Guide

This guide explains how to add new demo sites to your portfolio.

## Structure

Each demo consists of two parts:

1. **Metadata file** in `src/content/demos/` - describes the demo
2. **Demo pages** in `src/pages/demo/[slug]/` - the actual demo site

## Adding a New Demo

### Step 1: Create Metadata File

Create a markdown file in `src/content/demos/` with frontmatter:

```markdown
---
title: Client Site Name
description: Brief description of the redesign project
clientName: Client Name (optional)
originalUrl: https://original-site.com (optional)
image: /demo-screenshots/client-site.png (optional)
technologies:
  - Astro
  - Tailwind CSS
  - TypeScript
featured: false
completedDate: 2026-01-29
order: 0
---

Extended description of the project goes here.
You can include:
- What was improved
- Key features
- Design decisions
- Technologies used
```

**Important:** The filename (without `.md`) becomes the demo's slug. For example, `client-site.md` creates the URL `/demo/client-site`.

### Step 2: Build the Demo Site

Create a directory in `src/pages/demo/` matching your slug:

```
src/pages/demo/client-site/
```

Inside, create `index.astro` for the main page:

```astro
---
import BaseLayout from '@layouts/BaseLayout.astro';
---

<BaseLayout
  title="Client Site - Demo"
  description="Demo redesign of client site"
>
  <!-- Your demo site content here -->
  <div class="min-h-screen">
    <!-- Build the demo using Astro components, HTML, and Tailwind -->
  </div>
</BaseLayout>
```

### Step 3: Add Multiple Pages (Optional)

You can create a multi-page demo:

```
src/pages/demo/client-site/
├── index.astro       # Homepage
├── about.astro       # About page
├── services.astro    # Services page
└── contact.astro     # Contact page
```

Each page is accessible at `/demo/client-site/about`, etc.

### Step 4: Add Screenshots (Optional)

1. Place screenshots in `public/demo-screenshots/`
2. Reference in metadata: `image: /demo-screenshots/client-site.png`

## Features You Can Use

### Astro Components

Import and use any components from your site:

```astro
---
import Hero from '@components/Hero.astro';
import ProjectCard from '@components/ProjectCard.astro';
---
```

### Tailwind CSS

All Tailwind utilities and custom classes from `src/styles/global.css` are available:

```html
<div class="card">
  <button class="btn btn-primary">Click Me</button>
</div>
```

### Path Aliases

Use configured aliases for clean imports:

```astro
---
import BaseLayout from '@layouts/BaseLayout.astro';
import utils from '@utils/helpers.ts';
---
```

### Static Assets

Place assets in `public/demo-assets/[slug]/`:

```
public/demo-assets/client-site/
├── logo.png
├── hero-bg.jpg
└── team-photo.jpg
```

Reference with: `<img src="/demo-assets/client-site/logo.png" />`

## Best Practices

1. **Keep demos self-contained** - Each demo should work independently
2. **Use semantic HTML** - Good accessibility and SEO
3. **Responsive design** - Test on mobile, tablet, and desktop
4. **Back link** - Include a link back to `/demo` gallery
5. **Performance** - Optimize images and minimize JavaScript
6. **Attribution** - If recreating a real site, clearly label it as a demo

## Example Demo Structure

```
src/
├── content/
│   └── demos/
│       └── acme-corp.md
└── pages/
    └── demo/
        └── acme-corp/
            ├── index.astro
            ├── about.astro
            └── services.astro

public/
├── demo-screenshots/
│   └── acme-corp.png
└── demo-assets/
    └── acme-corp/
        ├── logo.svg
        └── hero.jpg
```

## Viewing Demos

- **Gallery page**: `http://localhost:4321/demo`
- **Individual demo**: `http://localhost:4321/demo/acme-corp`
- **Demo subpage**: `http://localhost:4321/demo/acme-corp/about`

## Tips

- Start from the sample demo (`sample-site`) as a template
- Use your existing components to speed up development
- Consider creating reusable demo-specific components in `src/components/demo/`
- Test demos in production build with `npm run build && npm run preview`
