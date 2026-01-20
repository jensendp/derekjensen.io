# SOP: Creating and Publishing Blog Posts

This document outlines the standard process for creating and publishing blog posts on derekjensen.io.

---

## Overview

Blog posts are stored as Markdown files in `src/content/blog/` and use Astro's Content Collections for type-safe content management. Posts are automatically added to the blog listing, RSS feed, and sitemap.

---

## Prerequisites

- Node.js installed
- Access to the project repository
- Text editor (VS Code recommended)
- Basic knowledge of Markdown

---

## Step-by-Step Process

### Step 1: Create the Markdown File

1. Navigate to `src/content/blog/`
2. Create a new file with a URL-friendly filename:
   - Use lowercase letters
   - Use hyphens instead of spaces
   - Be descriptive but concise
   - Example: `my-new-blog-post.md`

### Step 2: Add Frontmatter

Every blog post requires frontmatter at the top of the file. Copy this template:

```markdown
---
title: "Your Post Title Here"
description: "A brief description of the post (appears in previews and SEO)."
pubDate: 2026-01-20
tags: ["Tag1", "Tag2", "Tag3"]
author: "Derek Jensen"
draft: false
---
```

#### Frontmatter Fields Explained

| Field | Required | Description |
|-------|----------|-------------|
| `title` | Yes | The post title (displayed on the page and in listings) |
| `description` | Yes | Brief summary for SEO and post previews (aim for 150-160 characters) |
| `pubDate` | Yes | Publication date in `YYYY-MM-DD` format |
| `tags` | No | Array of tags for categorization (creates tag filter pages) |
| `author` | No | Author name (defaults to "Derek Jensen") |
| `draft` | No | Set to `true` to hide from production (defaults to `false`) |
| `updatedDate` | No | Date of last update in `YYYY-MM-DD` format |

### Step 3: Write the Content

Below the frontmatter, write your post content using Markdown:

```markdown
---
title: "My New Post"
description: "Description here"
pubDate: 2026-01-20
tags: ["React Native"]
---

Your introduction paragraph goes here. Hook the reader!

## First Section Heading

Content for the first section...

### Subsection

More detailed content...

## Code Examples

Use fenced code blocks with language hints:

```typescript
const greeting = "Hello, World!";
console.log(greeting);
```

## Lists

- Bullet point 1
- Bullet point 2

1. Numbered item 1
2. Numbered item 2

## Links and Images

[Link text](https://example.com)

![Alt text for image](/images/my-image.png)

## Blockquotes

> This is a blockquote for highlighting important information.
```

### Step 4: Preview Locally

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open `http://localhost:4321/blog` in your browser

3. Find your post in the list and click to view it

4. Check:
   - [ ] Title displays correctly
   - [ ] Description appears in the post header
   - [ ] Tags are clickable and link to tag pages
   - [ ] Reading time is calculated
   - [ ] Code blocks have syntax highlighting
   - [ ] Images load properly
   - [ ] Post appears in "Related Posts" if tags match other posts

### Step 5: Test in Both Themes

1. Toggle dark mode using the sun/moon icon in the header
2. Verify the post is readable in both light and dark modes

### Step 6: Build and Verify

1. Run the production build:
   ```bash
   npm run build
   ```

2. Preview the production build:
   ```bash
   npm run preview
   ```

3. Verify the post appears correctly

### Step 7: Publish

1. Commit your changes:
   ```bash
   git add src/content/blog/your-post-filename.md
   git commit -m "Add blog post: Your Post Title"
   ```

2. Push to the repository:
   ```bash
   git push origin main
   ```

3. The site will automatically rebuild and deploy (if CI/CD is configured)

---

## Working with Drafts

To save a work-in-progress without publishing:

1. Set `draft: true` in the frontmatter
2. The post will be visible in development but excluded from production builds
3. When ready to publish, change to `draft: false`

---

## Tag Guidelines

### Existing Tags
Check `src/content/blog/` for existing posts to see commonly used tags. Current tags include:
- React Native
- TypeScript
- Architecture
- Startup
- Product

### Creating New Tags
- Use title case (e.g., "React Native" not "react native")
- Keep tags concise (1-3 words)
- Prefer existing tags when applicable for better categorization

---

## SEO Best Practices

1. **Title**: Keep under 60 characters for full display in search results
2. **Description**: Aim for 150-160 characters; include primary keywords
3. **Content**: Use descriptive headings (H2, H3) that include relevant keywords
4. **Images**: Always include descriptive alt text
5. **Links**: Link to other posts on the site when relevant (helps with internal linking)

---

## Troubleshooting

### Post Not Appearing

1. Check that `draft` is set to `false` (or removed)
2. Verify the file is saved in `src/content/blog/`
3. Ensure the filename ends with `.md`
4. Check for frontmatter syntax errors (missing quotes, invalid dates)

### Build Errors

1. Run `npm run build` and check error messages
2. Common issues:
   - Missing required frontmatter fields (`title`, `description`, `pubDate`)
   - Invalid date format (must be `YYYY-MM-DD`)
   - Syntax errors in Markdown

### Styling Issues

1. Ensure you're using standard Markdown syntax
2. Check that code blocks have language identifiers for syntax highlighting
3. Verify images are in the correct location

---

## File Checklist

Before publishing, ensure:

- [ ] Filename is URL-friendly (lowercase, hyphens, no special characters)
- [ ] All required frontmatter fields are present
- [ ] `draft` is set to `false`
- [ ] Content is proofread for typos and grammar
- [ ] All links work correctly
- [ ] Images have alt text
- [ ] Post displays correctly in both light and dark modes
- [ ] Build completes without errors

---

## Example Post

See existing posts for reference:
- `src/content/blog/why-im-building-brew-loyalty.md`
- `src/content/blog/react-native-architecture-decisions.md`

---

*Last Updated: January 20, 2026*
