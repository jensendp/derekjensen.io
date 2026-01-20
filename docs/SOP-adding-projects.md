# SOP: Adding Projects to the Portfolio

This document outlines the standard process for adding projects to the portfolio on derekjensen.io.

---

## Overview

Projects are managed using Astro's Content Collections, stored as Markdown files in `src/content/projects/`. This approach provides type safety, easy content management, and consistent structure across all projects.

---

## Prerequisites

- Node.js installed
- Access to the project repository
- Text editor (VS Code recommended)
- Basic knowledge of Markdown and YAML frontmatter

---

## Step-by-Step Process

### Step 1: Create the Markdown File

1. Navigate to `src/content/projects/`
2. Create a new file with a URL-friendly filename:
   - Use lowercase letters
   - Use hyphens instead of spaces
   - Be descriptive but concise
   - Example: `my-awesome-project.md`

### Step 2: Add Frontmatter

Every project requires frontmatter at the top of the file. Copy this template:

```markdown
---
title: "Your Project Name"
description: "A brief description of what the project does (1-2 sentences)."
problem: "What problem does this project solve?"
solution: "How does your project solve the problem?"
technologies: ["Tech1", "Tech2", "Tech3"]
githubUrl: "https://github.com/username/repo"
liveUrl: "https://your-project.com"
image: "/images/projects/your-project.png"
featured: false
order: 10
---
```

### Step 3: Frontmatter Fields Reference

| Field | Required | Type | Description |
|-------|----------|------|-------------|
| `title` | Yes | String | Project name |
| `description` | Yes | String | Brief summary (1-2 sentences) |
| `problem` | No | String | The problem the project addresses |
| `solution` | No | String | How the project solves the problem |
| `technologies` | No | Array | List of technologies used (defaults to empty) |
| `githubUrl` | No | URL | Link to GitHub repository |
| `liveUrl` | No | URL | Link to live demo/production site |
| `image` | No | String | Path to project screenshot |
| `featured` | No | Boolean | Display as featured project (defaults to false) |
| `order` | No | Number | Sort order for display (defaults to 0, lower = first) |

### Step 4: Example Project Files

**Featured Project:**
```markdown
---
title: "Brew Loyalty"
description: "A mobile loyalty rewards app designed to help local coffee shops build lasting relationships with their customers."
problem: "Local coffee shops struggle to compete with big chains that have sophisticated loyalty programs."
solution: "A customizable mobile app that lets shops create their own branded loyalty experience."
technologies: ["React Native", "TypeScript", "Expo", "Node.js", "PostgreSQL"]
featured: true
order: 1
---
```

**Regular Project:**
```markdown
---
title: "Weather Dashboard"
description: "A beautiful weather app with detailed forecasts and severe weather alerts."
problem: "Weather apps are either too simple or overwhelmingly complex with ads everywhere."
solution: "A clean, ad-free interface that surfaces the most important information first."
technologies: ["React Native", "TypeScript", "Expo"]
liveUrl: "https://weather.example.com"
featured: false
order: 4
---
```

### Step 5: Preview Locally

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open `http://localhost:4321/projects` in your browser

3. Verify:
   - [ ] Project card displays correctly
   - [ ] Title and description are accurate
   - [ ] Problem/Solution sections appear (if provided)
   - [ ] Technology badges display correctly
   - [ ] Links work (GitHub, Live Demo)
   - [ ] Featured badge appears (if featured)
   - [ ] Order is correct relative to other projects
   - [ ] Responsive layout works on mobile
   - [ ] Dark mode displays correctly

### Step 6: Build and Deploy

1. Run the production build:
   ```bash
   npm run build
   ```

2. Verify no build errors

3. Commit your changes:
   ```bash
   git add src/content/projects/your-project.md
   git commit -m "Add project: Your Project Name"
   git push origin main
   ```

---

## Managing Featured Projects

Only one project should be featured at a time. To change the featured project:

1. Open the current featured project file
2. Change `featured: true` to `featured: false`
3. Open the new project to feature
4. Change `featured: false` to `featured: true`
5. Commit both changes together

---

## Project Ordering

Projects are sorted by the `order` field (ascending). To reorder:

1. Decide the desired order
2. Update `order` values in each project file
3. Use gaps (e.g., 10, 20, 30) to make future insertions easier

**Example ordering:**
- Brew Loyalty: `order: 10` (first)
- Portfolio: `order: 20` (second)
- Task Flow: `order: 30` (third)

---

## Technology Badge Guidelines

### Common Technologies

Use consistent naming for technologies:

| Category | Technologies |
|----------|-------------|
| Mobile | React Native, Expo, iOS, Android, Flutter |
| Frontend | React, TypeScript, JavaScript, Tailwind CSS, Next.js, Astro |
| Backend | Node.js, Express, PostgreSQL, MongoDB, GraphQL, REST APIs |
| Tools | Git, Docker, AWS, Firebase, Supabase |

### Tips
- List technologies in order of importance/relevance
- Aim for 3-6 technologies per project
- Be specific (e.g., "PostgreSQL" not just "SQL")
- Use exact capitalization for recognition

---

## Writing Guidelines

### Project Description
- Keep to 1-2 sentences
- Focus on what the project does and its value
- Write for a broad audience (avoid jargon)

### Problem Statement
- Start with the user's pain point
- Be specific about who has this problem
- **Good**: "Local coffee shops struggle to compete with chains that have sophisticated loyalty programs"
- **Bad**: "I wanted to learn React Native"

### Solution Statement
- Explain your approach clearly
- Highlight what makes it unique
- **Good**: "A customizable mobile app that lets shops create their own branded loyalty experience"
- **Bad**: "I built an app with React Native"

---

## Adding Project Images

1. Prepare your image:
   - Recommended dimensions: 1200x630 (16:9 aspect ratio)
   - Formats: PNG, JPG, or WebP
   - Keep file size under 500KB (optimize if needed)

2. Add to the public folder:
   ```
   public/images/projects/your-project.png
   ```

3. Reference in frontmatter:
   ```yaml
   image: "/images/projects/your-project.png"
   ```

---

## Content Collections Schema

For reference, here's the schema from `src/content.config.ts`:

```typescript
const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    problem: z.string().optional(),
    solution: z.string().optional(),
    image: z.string().optional(),
    technologies: z.array(z.string()).default([]),
    liveUrl: z.string().url().optional(),
    githubUrl: z.string().url().optional(),
    featured: z.boolean().default(false),
    order: z.number().default(0),
  }),
});
```

---

## Troubleshooting

### Project Not Displaying

1. Verify file is in `src/content/projects/` directory
2. Ensure filename ends with `.md`
3. Check frontmatter syntax (proper YAML formatting)
4. Verify required fields (`title`, `description`) are present
5. Run `npm run dev` and check console for errors

### Build Errors

Common issues:
- **Invalid URL**: `liveUrl` and `githubUrl` must be complete URLs (include `https://`)
- **Missing quotes**: Strings with special characters need quotes
- **Invalid YAML**: Check for proper indentation and syntax

### Links Not Working

1. Verify URLs are complete (include `https://`)
2. Test links in a browser before adding
3. For GitHub URLs, ensure the repository exists and is public (or accessible)

### Technologies Not Showing

1. Ensure `technologies` is an array: `["Tech1", "Tech2"]`
2. Check for typos in array syntax
3. Don't forget the quotes around each technology

---

## Checklist

Before adding a project, ensure:

- [ ] File created in `src/content/projects/` with `.md` extension
- [ ] Filename is URL-friendly (lowercase, hyphens)
- [ ] Required fields present (`title`, `description`)
- [ ] `problem` and `solution` clearly written
- [ ] Technologies list is accurate and properly formatted
- [ ] URLs are valid and working (if provided)
- [ ] `order` set appropriately for desired position
- [ ] `featured` set correctly (only one project should be featured)
- [ ] Displays correctly in both light and dark modes
- [ ] Responsive layout works on mobile
- [ ] Build completes without errors

---

## File Locations Reference

```
src/
├── content/
│   └── projects/           # Project markdown files go here
│       ├── brew-loyalty.md
│       ├── personal-portfolio.md
│       └── your-new-project.md
├── pages/
│   └── projects.astro      # Projects page (fetches from Content Collections)
├── components/
│   └── ProjectCard.astro   # Project display component
└── content.config.ts       # Content Collections schema
```

---

## Example: Complete Project File

```markdown
---
title: "Recipe Finder"
description: "A mobile app that suggests recipes based on ingredients you have at home, reducing food waste."
problem: "People often throw away food because they don't know what to make with leftover ingredients."
solution: "An AI-powered app that scans your fridge contents and suggests recipes with step-by-step instructions."
technologies: ["React Native", "TypeScript", "OpenAI API", "Supabase"]
liveUrl: "https://recipefinder.app"
githubUrl: "https://github.com/derekjensen/recipe-finder"
image: "/images/projects/recipe-finder.png"
featured: false
order: 25
---
```

---

*Last Updated: January 20, 2026*
