# derekjensen.io Development Checklist

## Phase 1: Foundation Setup (Week 1)

### 1.1 Project Initialization
- [x] Initialize Astro project with TypeScript support
- [x] Install and configure Tailwind CSS
- [x] Set up ESLint and Prettier for code quality
- [x] Configure Git repository with .gitignore
- [x] Set up basic project structure (folders: components, layouts, pages, content, utils, styles)

### 1.2 Core Infrastructure
- [x] Create BaseLayout.astro with responsive structure
- [x] Create Header.astro component with navigation
- [x] Create Footer.astro component with social links
- [x] Set up Astro Content Collections for blog posts
- [x] Set up Content Collections for projects
- [x] Configure TypeScript paths for clean imports (@components, @layouts, etc.)
- [x] Add basic SEO configuration (meta tags helper)
- [x] Configure sitemap generation
- [x] Add robots.txt file
- [x] Set up syntax highlighting for code blocks (Shiki)

### 1.3 Design System
- [x] Define color palette in Tailwind config (include Brew Loyalty accent option)
- [x] Set up typography scale using Tailwind
- [x] Configure responsive breakpoints
- [x] Create utility classes for common patterns
- [x] Set up global CSS file with custom styles
- [x] Add font configuration (Google Fonts or system fonts)
- [ ] Create spacing/sizing conventions documentation

## Phase 2: Core Pages (Week 2)

### 2.1 Homepage (`/`)
- [x] Create index.astro page structure
- [x] Build Hero component with name, specialty, elevator pitch
- [x] Create FeaturedProject component for Brew Loyalty
- [x] Build BlogPostCard component
- [x] Add recent blog posts preview section (2-3 posts)
- [x] Create quick about snippet section
- [x] Add SocialLinks component with icons
- [x] Add contact CTAs
- [ ] Optimize images with lazy loading
- [x] Test mobile responsiveness

### 2.2 About Page (`/about`)
- [ ] Create about.astro page
- [ ] Write professional journey narrative section
- [ ] Add technical evolution story section
- [ ] Create current focus areas section with tech stack
- [ ] Add value proposition statement
- [ ] Include personal touches section
- [ ] Add link to projects/portfolio
- [ ] Optimize layout for readability
- [ ] Test mobile responsiveness

### 2.3 Projects Page (`/projects`)
- [ ] Create projects.astro page
- [ ] Build ProjectCard component (reusable)
- [ ] Create Brew Loyalty featured section (prominent placement)
- [ ] Add 2-4 additional portfolio projects
- [ ] Create TechBadge component for tech stack tags
- [ ] Add project descriptions with problem/solution format
- [ ] Include links to live demos where applicable
- [ ] Add GitHub links where applicable
- [ ] Add project images/screenshots
- [ ] Test grid layout responsiveness

### 2.4 Blog Setup (`/blog`)
- [ ] Create blog/index.astro for post listings
- [ ] Create blog/[slug].astro for individual posts
- [ ] Build BlogPost layout component
- [ ] Add reading time estimation utility
- [ ] Configure post metadata (date, tags, description, author)
- [ ] Create tag filtering system
- [ ] Add "Related Posts" suggestion logic
- [ ] Create social sharing buttons component
- [ ] Add prev/next post navigation
- [ ] Style markdown content (headings, lists, code blocks, quotes)
- [ ] Test blog post rendering

## Phase 3: Content & Features (Week 3)

### 3.1 Initial Content
- [ ] Write first blog post: "Why I'm Building Brew Loyalty"
- [ ] Write second blog post: Technical architecture decision
- [ ] Create Brew Loyalty project detailed description
- [ ] Write descriptions for 3-5 portfolio projects
- [ ] Draft complete about page content
- [ ] Create homepage hero copy
- [ ] Write meta descriptions for all pages
- [ ] Source/create project images and screenshots

### 3.2 Enhanced Features
- [ ] Set up RSS feed generation at /rss.xml
- [ ] Create Open Graph image generation for blog posts
- [ ] Implement tag/category system for blog filtering
- [ ] Add "Now" page (/now) with current focus
- [ ] Create dark mode toggle functionality
- [ ] Integrate analytics (Plausible/Fathom/Google Analytics)
- [ ] Add view transitions (Astro feature)
- [ ] Create custom 404 page

### 3.3 SEO Optimization
- [ ] Write unique meta descriptions for all pages
- [ ] Add Schema.org structured data (Person, BlogPosting)
- [ ] Configure canonical URLs for all pages
- [ ] Generate and test XML sitemap
- [ ] Optimize all images (WebP format, proper sizing)
- [ ] Run Lighthouse audit (target 90+ performance)
- [ ] Add Open Graph tags for social sharing
- [ ] Add Twitter Card meta tags
- [ ] Test social share previews

## Phase 4: Polish & Launch (Week 4)

### 4.1 Final Touches
- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)
- [ ] Mobile responsiveness verification (iOS Safari, Chrome Mobile)
- [ ] Tablet responsiveness verification
- [ ] Run accessibility audit (WCAG AA compliance)
- [ ] Fix any accessibility issues found
- [ ] Performance optimization pass
- [ ] Add loading states and transitions
- [ ] Polish micro-interactions (hover states, focus states)
- [ ] Proofread all content
- [ ] Test all internal links
- [ ] Test all external links

### 4.2 Deployment
- [ ] Choose hosting platform (Vercel/Cloudflare Pages/Netlify)
- [ ] Create production build locally and test
- [ ] Set up deployment pipeline/repository connection
- [ ] Configure custom domain (derekjensen.io)
- [ ] Set up SSL certificate (auto through host)
- [ ] Configure environment variables if needed
- [ ] Deploy to production
- [ ] Test production site thoroughly
- [ ] Set up preview deployments for branches

### 4.3 Post-Launch
- [ ] Submit sitemap to Google Search Console
- [ ] Submit sitemap to Bing Webmaster Tools
- [ ] Set up uptime monitoring (UptimeRobot/Better Uptime)
- [ ] Configure analytics goals/events
- [ ] Create content calendar for next 4-8 blog posts
- [ ] Plan first social media announcement
- [ ] Share on LinkedIn
- [ ] Share in relevant communities (r/reactnative, dev.to, etc.)
- [ ] Add site to portfolio/resume

## Optional Enhancements (Future Phases)

### Nice-to-Have Features
- [ ] Newsletter signup form integration
- [ ] Blog post search functionality
- [ ] Table of contents for long blog posts
- [ ] Estimated reading progress bar
- [ ] Copy-to-clipboard for code blocks
- [ ] View count for blog posts
- [ ] Comment system (Giscus/utterances)
- [ ] "Uses" page (tools, software, gear)
- [ ] Speaking/appearances page (if applicable)
- [ ] Testimonials section

### Performance Enhancements
- [ ] Implement partial hydration for interactive components
- [ ] Add service worker for offline support
- [ ] Optimize web fonts loading
- [ ] Implement image CDN (Cloudinary/Imgix)
- [ ] Add prefetching for internal links

### Content Additions
- [ ] Create "Build in Public" series tag
- [ ] Add case studies for portfolio projects
- [ ] Create downloadable resume PDF
- [ ] Add photo/headshot to about page
- [ ] Create custom illustrations/graphics

---

## Development Notes

### Priority Order
1. Phase 1 (Foundation) - Must complete before anything else
2. Phase 2 (Core Pages) - Essential for MVP
3. Phase 3.1 (Initial Content) - Needed for launch
4. Phase 3.2-3.3 (Features & SEO) - Important but can iterate
5. Phase 4 (Polish & Launch) - Final steps before going live

### Quick Wins for MVP
- Get homepage, about, and one blog post live quickly
- Projects page can start with just Brew Loyalty
- Blog can launch with 1-2 posts and grow from there
- Dark mode and advanced features can be added post-launch

### Time Estimates
- Phase 1: 1-2 days
- Phase 2: 2-3 days
- Phase 3.1: 2-3 days (content writing takes time)
- Phase 3.2-3.3: 1-2 days
- Phase 4: 1-2 days

**Total MVP Timeline: 7-12 days of focused work**

---

## Resources & Links

- Astro Documentation: https://docs.astro.build
- Tailwind CSS Documentation: https://tailwindcss.com/docs
- Astro Content Collections: https://docs.astro.build/en/guides/content-collections/
- Web.dev Performance Guide: https://web.dev/performance/
- WCAG Accessibility Guidelines: https://www.w3.org/WAI/WCAG21/quickref/

---

**Last Updated:** January 17, 2026
