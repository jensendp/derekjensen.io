---
title: 'From Brand Brief to Working Website: How Claude Writes the Code'
description: "One prompt. One Claude call. A complete, production-quality HTML demo tailored to the specific business — different layout for a law firm than a bakery, different fonts for luxury than playful. Here's how the HTML generation step works."
pubDate: '2026-05-07T09:00:00'
author: 'Derek Jensen'
tags: ['automation', 'n8n', 'claude', 'build in public', 'curb appeal']
draft: false
series: 'curb-appeal'
seriesOrder: 3
heroImage: '/images/blog/curb-appeal-hero-part-4.png'
---

At the end of Step 3, we have a structured JSON brand profile.

Business name, services, contact info, tone, color palette, key differentiators, and one opinionated sentence describing exactly what the redesign should look and feel like.

Step 4 takes that profile and turns it into a complete, working HTML page.

One Claude call. One file. A demo the business owner can open in a browser.

> **This is Part 4 of the Building Curb Appeal in Public series.** Start at the beginning with [What Is Curb Appeal?](/blog/curb-appeal-build-in-public-introduction) or catch up on [Step 3](/blog/curb-appeal-brand-analysis-claude).

---

## The Core Idea: Start from a Brief, Not a Template

Earlier versions of this pipeline had a fixed 8-section template. Every demo got a hero, a services section, a testimonials section, an about section — whether or not any of those made sense for the business.

The problem: every output looked structurally identical. Different colors, different copy, same bones.

The fix was to treat the brand profile as an actual design brief and make Claude commit to a direction before writing a single line of code.

The prompt is structured in four steps:

1. **Commit to a direction** — read the brand profile, identify the one thing that will make this design specific to this business, and choose an aesthetic (luxury/refined, warm/artisanal, bold/energetic, etc.)
2. **Plan the sections** — choose 6-8 sections based on what this specific business actually needs
3. **Build a design system** — select fonts and colors from the brand profile
4. **Write the HTML** — produce a complete, production-grade page

That sequence matters. The commitment step forces a design decision before any code is written. It shapes everything that follows.

---

## Conditional Sections

Not every business needs the same sections. The prompt gives Claude a set of rules:

**Always include:**
- Sticky nav
- Hero (minimum 90vh)
- Contact / Booking CTA
- Footer

**Include based on business type:**
- Marquee strip — multi-service businesses, location callouts
- Why / Benefits — trust-building services with clear differentiators
- Services & Pricing — three or more distinct offerings worth showcasing
- Gallery — businesses where physical space or work quality matters
- Service Area — mobile businesses or multi-location operations
- About / Team — if key differentiators are credential or people-focused
- Testimonials — high-trust service businesses
- Process / How It Works — services that feel complex to buyers

**The rule:** do not add sections that don't fit. A law firm doesn't need a gallery. A single-service mobile groomer doesn't need a pricing comparison table.

This is what makes a pet spa demo look different from a law firm demo — not just the colors, but the structure.

---

## Three Real Examples

Here's how the same pipeline produced three different outputs for three different business types.

### Fairy Tails Mobile Pet Spa

Brand profile tone: **friendly**. Redesign direction: warm premium with deep teal and soft gold, trust signals first.

Sections chosen: nav, hero, marquee (services), why/benefits (certifications), service area (Illinois communities), testimonials, contact CTA, footer.

The marquee strip became a rotating list of grooming services. The service area section showed the specific Illinois communities served — a detail that only works because the brand profile captured it from the scraped content.

[View original site →](https://fairytailsmobilepetspa.com) · [View redesign demo →](https://derekjensen.io/demos/fairytailsmobilepetspa.html)

### Stancati Law PC

Brand profile tone: **professional**. Redesign direction: confident navy and warm gold, credentials above the fold, clear CTA hierarchy.

Sections chosen: nav, hero, why/benefits (attorney credentials), services, about/team, testimonials, contact CTA, footer.

No gallery. No marquee. A law firm earns trust through credentials and clarity, not visual flair. The attorney names and the 2022 Kalamazoo divorce attorney award appeared in the hero — trust signals first, exactly as the brief specified.

[View original site →](https://www.stancatilawpc.com) · [View redesign demo →](https://derekjensen.io/demos/stancatilawpc.html)

### Pollen & Pastry

Brand profile tone: **luxury**. Redesign direction: deep burgundy and warm cream, editorial full-bleed photography, refined serif typography.

Sections chosen: nav, hero (full-bleed), press/"As Seen In", services, gallery, about, contact CTA, footer.

The press section listed eight publication features — Wedding Chicks, Aisle Perfect, Bridal Guide, and others — pulled directly from the `key_differentiators` field in the brand profile.

[View original site →](https://www.pollenandpastry.com) · [View redesign demo →](https://derekjensen.io/demos/pollenandpastry.html)

---

## What It Actually Costs

| Site | Type | Output Tokens | Generation Time |
|---|---|---|---|
| Fairy Tails Mobile Pet Spa | Pet grooming | ~22,000 | ~3 min |
| Stancati Law PC | Law firm | ~24,000 | 4.5 min |
| Pollen & Pastry | Wedding/floral bakery | ~22,000 | 3.5 min |

At Claude Sonnet pricing, 24,000 output tokens runs about $0.36. Add the ~$0.016 from Step 3 and the Firecrawl credits, and the total cost per demo is well under $0.50.

The generation time is the honest caveat here. Four and a half minutes is a long time to wait for a result. This pipeline is designed as a batch operation — submit a URL, come back to a finished demo — not a real-time tool. That framing matters when thinking about how to present it to a user.

> **This is the "match reasoning effort to the task" principle from [AI Reasoning Effort Explained](/blog/ai-reasoning-effort-explained-control-how-deep-ai-thinks) applied at scale.** HTML generation is the most complex step in the pipeline — it's doing design, layout, and code simultaneously. The token budget and model reflect that.

---

## The Extended Output Header

By default, Claude Sonnet is capped at 8,096 output tokens. A production-quality HTML page with inline CSS, a full design system, and 7-8 sections runs 20,000+ tokens.

Without the extended output header, every demo gets cut off mid-page.

The fix is one additional header on the Claude API call:

```
anthropic-beta: output-128k-2025-02-19
```

With that header, max_tokens can be set to 32,000 — enough headroom for any demo the pipeline produces without truncation.

---

## Bugs Found Along the Way

### Images Blocked by Hotlink Protection

The pipeline passes real image URLs from the scraped site into the prompt. In early runs, Claude used these as `<img>` tags in the generated HTML — attorney headshots, gallery photos, product images.

The problem: most business sites (Squarespace, Wix, WordPress) protect their media CDN from external requests. The images exist and load fine if you paste the URL directly into a browser, but when loaded from `derekjensen.io`, the source server checks the `Referer` header and blocks the request. The result is a broken image icon.

The fix: all real images from the existing site must be used as CSS `background-image` only, never as `<img>` tags, with a fallback `background-color` on the same element so if the image is blocked, the section still looks intentional.

### Press Logos Also Blocked

The Pollen & Pastry demo had an "As Seen In" section with eight press features. Claude tried to load logos for The Knot, Wedding Chicks, and others — all blocked.

The fix: an explicit rule in the prompt that press/award sections must render as styled text only. Publication names in uppercase with letter-spacing and a muted color, separated by dividers. No `<img>` tags for logos.

### Forms on Demo Pages

The law firm and bakery demos both included contact forms. The demos are publicly accessible URLs — anyone who finds them could fill out a form thinking it's real. The business owner never sees the submission, and someone might genuinely think they've contacted a lawyer or placed an order.

The fix: a prompt rule requiring all forms to render with `disabled` attributes on every input and button, plus a visible note inside the form: *"This is a redesign demo — form submissions are disabled."* The form still looks like a real form (which is the point of the demo), but no one can accidentally submit it.

### Blog-Heavy Sites Miss Key Pages

The Firecrawl Map endpoint was capped at 20 URLs. Squarespace sites with active blogs often surface blog posts before other pages in their sitemap. For Pollen & Pastry, the map returned 1 homepage and 19 blog posts — leaving the filter with nothing to work with except the homepage.

The fix: bump the map limit from 20 to 50. The map endpoint is cheap, and 50 URLs gives the filter enough signal to find the right pages even on blog-heavy sites.

---

## How I Used AI to Build This Step

The HTML generation prompt went through several iterations, and most of the meaningful changes came out of looking at real outputs and identifying what was wrong.

**The template problem.** The first version of the prompt was a rigid 8-section list. Every demo had the same structure. Claude Code's observation: if you give the model a fixed template, it fills the template. If you want different outputs for different businesses, you have to give it a decision framework, not a template. That became the conditional sections approach.

**The extended output discovery.** The first few runs cut off at 8,096 tokens — always mid-page, always at the worst possible point. Claude Code identified the cause immediately: the default output cap. The `anthropic-beta` header was the fix. Without it, this step doesn't work.

**The hotlink issue.** This one came from looking at real demo output in a browser. The broken image icons were obvious, but the cause wasn't. Pasting the URLs directly into a browser confirmed they were valid — so the issue was the domain they were loading from, not the URLs themselves. The background-image + fallback approach was Claude Code's suggestion.

---

## What Comes Out

After Step 4, we have a complete HTML file — inline CSS, Google Fonts, responsive layout, working mobile nav, real business content, and a design that reflects this specific business and no other.

That file is the input to Step 5.

Step 5 takes the HTML and deploys it to a live URL automatically — no manual file uploads, no copying and pasting. A URL goes in at Step 1 and a live demo link comes out at the end.

---

## Download the Workflow

This file includes all four steps — site discovery, selective scrape, brand analysis, and HTML generation — in one importable workflow.

- [Steps 1-4 — Full Demo Pipeline](/downloads/curb-appeal-step-1-4-demo-pipeline.json) — 13 nodes, outputs a complete HTML demo from any URL

Replace `YOUR_FIRECRAWL_API_KEY` in the Firecrawl nodes and `YOUR_ANTHROPIC_API_KEY` in the Claude nodes before running.

---

## Frequently Asked Questions

**Why does generation take 3-5 minutes?**
Claude is generating 20,000+ tokens of HTML, CSS, and JavaScript in a single pass. The extended output beta header allows for longer responses, but longer responses take longer to generate. This is expected behavior — design the product flow around it.

**What if the output gets cut off?**
Make sure the `anthropic-beta: output-128k-2025-02-19` header is set on the Claude - Generate HTML node and that max_tokens is set to at least 32000. Without the beta header, the cap is 8,096 regardless of what max_tokens says.

**Why not use streaming to show progress during generation?**
n8n's HTTP Request node doesn't support streaming responses out of the box. For the current pipeline, polling or a webhook-based approach would be needed to surface progress. Worth solving in a future iteration.

**Are the demos mobile responsive?**
Yes. The prompt requires Tailwind CSS via CDN and a functional mobile hamburger menu. All demos are responsive by default.

**Can I use a different model for this step?**
You could try Haiku for cost, but it will produce noticeably worse HTML — less design sophistication, more generic layouts, weaker copy. At ~$0.36 per demo, Sonnet is worth it for a step where quality is the entire point.
