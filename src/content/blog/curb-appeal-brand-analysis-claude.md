---
title: 'Teaching AI to Read a Brand: Color, Tone, and Purpose from a Single URL'
description: "After scraping the site, one Claude call reads everything — including a screenshot — and outputs a structured brand profile with colors, tone, audience, and an opinionated redesign direction. Here's how it works."
pubDate: '2026-05-05T09:00:00'
author: 'Derek Jensen'
tags: ['automation', 'n8n', 'claude', 'build in public', 'curb appeal']
draft: false
series: 'curb-appeal'
seriesOrder: 2
---

At the end of Step 2, we have clean scraped content from 4-8 pages of a business website.

Good markdown. A homepage screenshot. A list of real image URLs.

But a pile of scraped text isn't useful on its own. We need to understand what the business actually is, what it looks like, and what direction a redesign should take.

That's what Step 3 does.

One Claude call. One structured JSON output. Everything the HTML generator needs to build a demo that looks like it belongs to this specific business.

> **This is Part 3 of the Building Curb Appeal in Public series.** Start at the beginning with [What Is Curb Appeal?](/blog/curb-appeal-build-in-public-introduction) or catch up on [Steps 1 & 2](/blog/curb-appeal-scraping-with-firecrawl-n8n).

---

## What You'll Need for This Step

- **Claude API** — this is the first step that actually spends AI tokens
- The output from Steps 1 & 2 (scraped content + screenshot + image URLs)
- n8n to wire it together

---

## Why One Call Instead of Two

An earlier version of this pipeline split Step 3 into two separate Claude calls: one to extract the brand data, and one to synthesize it into a redesign brief.

The problem with that approach: it's twice the cost and adds latency for no real benefit. The analysis and synthesis happen in the same context anyway. Claude can read the scraped content, form a view, and write an opinionated direction in a single pass.

So we combined them.

One call. Two outputs in one JSON object.

> **Tip:** This is the "Trigger → AI Decision → Action" pattern from [AI-Powered Automation for Workflows](/blog/ai-powered-automation-for-workflows-the-complete-guide) — the AI decision step is doing real work here, not just reformatting data.

---

## Using Vision to Extract Colors

Scraped markdown doesn't contain CSS.

That means we can't pull hex color values from the page content alone. But we do have a screenshot of the homepage — and Claude can see it.

When the homepage screenshot is available, the request is structured as a multimodal message: the image comes first, then the text prompt. Claude looks at both simultaneously.

```json
{
  "role": "user",
  "content": [
    {
      "type": "image",
      "source": { "type": "url", "url": "https://..." }
    },
    {
      "type": "text",
      "text": "Analyze this business website..."
    }
  ]
}
```

When there's no screenshot available, it falls back to a standard text-only message. The rest of the pipeline handles both cases.

This is what makes color extraction actually work. Without vision, Claude is guessing. With the screenshot, it's reading the real palette off the page.

---

## What the Brand Profile Looks Like

Here's the prompt structure. We ask Claude to return a specific JSON object — no markdown, no explanation, just the data.

The schema includes everything the HTML generator needs:

```json
{
  "business_name": "exact name",
  "tagline": "slogan or null",
  "business_type": "specific — e.g. 'mobile pet grooming spa'",
  "services": ["list", "of", "services"],
  "contact": {
    "phone": "...",
    "email": "...",
    "address": "..."
  },
  "hours": "...",
  "target_audience": "specific description",
  "tone": "friendly | professional | playful | luxury | ...",
  "colors": {
    "primary": "#hexcode",
    "accent": "#hexcode",
    "background": "#hexcode"
  },
  "font_style": "describe the typography style",
  "aesthetic_notes": "honest assessment of current site weaknesses",
  "key_differentiators": "credentials, awards, years in business",
  "redesign_direction": "one opinionated sentence"
}
```

The `redesign_direction` field is the most important one. It's not just a description — it's a brief. The HTML generator reads it and commits to a design direction before writing a single line of code.

---

## A Real Example

Here's what Claude returned for Fairy Tails Mobile Pet Spa:

```json
{
  "business_name": "Fairy Tails Mobile Pet Spa",
  "tagline": "Fairy Tail groomings brought to you!",
  "business_type": "mobile pet grooming spa",
  "tone": "friendly",
  "colors": {
    "primary": "#2E86AB",
    "accent": "#3DAA5C",
    "background": "#5ECFC1"
  },
  "font_style": "mixed playful display with handwritten script elements and bold sans-serif for contact info",
  "aesthetic_notes": "The site relies heavily on image-based text (phone number, slogan, logo rendered as PNGs) which is inaccessible and unscalable. The teal gradient hero background feels generic and dated. Layout is basic single-column WordPress with no visual hierarchy.",
  "key_differentiators": "Award-winning groomer, 15+ years of experience, CPR and First Aid certified, AKC breed knowledge, fully equipped climate-controlled mobile spa, no cages",
  "redesign_direction": "Redesign with a warm premium tone using deep teal and soft gold accents, clean modern sans-serif typography, and a card-based layout that leads with trust signals — certifications, experience, and testimonials — to convert suburban pet owners who want luxury convenience."
}
```

A few things worth noting here.

The colors came from the screenshot. `#2E86AB` is the blue-teal that dominates the real site. Claude saw it, identified it, and returned a hex value.

The `aesthetic_notes` are honest. _"Relies heavily on image-based text"_ and _"basic single-column WordPress with no visual hierarchy"_ — this isn't flattery. It's a real critique. That honesty is what makes the redesign meaningful.

The `redesign_direction` is a brief, not a description. It tells the HTML generator exactly what to do: warm premium tone, deep teal and soft gold, trust signals first. That one sentence shapes the entire output.

---

## Token Count

Input: **3,153 tokens**

That's after the cleanup we added in Step 2 — stripping data URI lines and map tiles from the scraped markdown. Before that fix, the same site returned over 16,000 input tokens.

Output: **451 tokens**

Total cost for this call on a typical site: **~$0.016**

That's less than two cents.

> **This is the "match reasoning effort to the task" principle from [AI Reasoning Effort Explained](/blog/ai-reasoning-effort-explained-control-how-deep-ai-thinks).** Brand analysis is the one step where you want Claude thinking carefully — it shapes everything downstream. The model and token budget reflect that.

---

## How I Used AI to Build This Step

A few decisions in this step came out of conversations with Claude Code, not from the docs.

**The combined call.** My first instinct was to use two separate calls — analysis then synthesis. Claude Code pushed back: same context, no benefit to splitting, just double the cost and latency. That was the right call.

**The vision format.** The multimodal message format (image first, text second) isn't obvious if you haven't used it before. When the screenshot was coming back null, we traced it back to how Split Out handles extra fields — it strips them. The fix was referencing the upstream node directly instead of relying on `$json.homepage`.

**The token cleanup.** After the first real run, input tokens came back at 16,982 for a simple WordPress site. Claude Code identified the cause immediately: Google Maps SVG data URIs embedded in the markdown. Three lines of filter code later, tokens dropped to 3,153.

---

## What Comes Out

After Step 3, we have a structured JSON object that describes the business, its real visual palette, its tone, its differentiators, and exactly what the redesign should look and feel like.

That object is the input to Step 4.

The HTML generator doesn't start from scratch. It starts from a brief.

---

## Download the Workflow

This file includes all three steps — site discovery, selective scrape, and brand analysis — in one importable workflow.

- [Steps 1-3 — Brand Profile Pipeline](/downloads/curb-appeal-step-1-3-brand-profile.json) — 10 nodes, outputs a structured brand profile JSON from any URL

Replace `YOUR_FIRECRAWL_API_KEY` in the Firecrawl Map and Firecrawl Scrape nodes, and `YOUR_ANTHROPIC_API_KEY` in the Claude - Extract Brand Profile node.

---

## What's Next

Step 4 takes the brand profile and builds a complete, production-quality HTML demo from it.

The brief from `redesign_direction` drives everything: section selection, fonts, colors, layout. A mobile pet spa gets different sections than a law firm. A playful brand gets different typography than a luxury one.

[Step 4 is coming soon →](/projects/curb-appeal)

---

## Frequently Asked Questions

**What if the screenshot is unavailable?**
The pipeline falls back to text-only analysis. Colors will be inferred from the content rather than extracted visually. The output is still useful, just less precise on the palette.

**Why not extract colors from the CSS directly?**
Firecrawl's markdown output doesn't include CSS. We'd need to scrape the raw HTML and parse stylesheets separately — more complexity for similar results. Vision is simpler and often more accurate since it sees what the user actually sees.

**Does this work on sites without much text content?**
Yes, but with less to work with. A very sparse homepage might produce a thinner brand profile. The screenshot and image URLs compensate somewhat — visual evidence where text is thin.

**How consistent is the output?**
Very consistent across runs on the same site. The JSON structure never varies and the values are stable. Running it twice on Fairy Tails produced nearly identical profiles.

**What model should I use for this step?**
We use `claude-sonnet-4-6`. A cheaper model like Haiku might struggle with the combined analysis-and-synthesis task. At ~$0.016 per job, Sonnet is worth it here.
