---
title: 'How to Scrape a Website the Smart Way with Firecrawl and n8n'
description: "Most scraping tutorials tell you to list the URLs yourself. That breaks on every new site. Here's how to build a pipeline that discovers the right pages automatically — and only scrapes what matters."
pubDate: '2026-05-04'
author: 'Derek Jensen'
tags: ['automation', 'n8n', 'firecrawl', 'build in public', 'curb appeal']
draft: false
series: 'curb-appeal'
seriesOrder: 1
---

Most scraping setups start the same way.

You open a new workflow, add a scrape node, and hardcode a list of URLs.

```
https://example.com
https://example.com/about
https://example.com/services
```

It works. Until you run it on a different site. Then you're back to manually figuring out which pages exist, what they're called, and which ones are worth scraping.

That doesn't scale.

This post is about building the first two steps of the Curb Appeal pipeline — the part that takes a single homepage URL and figures out the rest automatically. No URL lists. No manual research. Just paste in a domain and let it run.

> **This is Part 2 of the Building Curb Appeal in Public series.** If you missed the intro, start with [What Is Curb Appeal?](/blog/curb-appeal-build-in-public-introduction)

---

## What You'll Need for This Step

- **n8n** — free to self-host, or n8n.cloud
- **Firecrawl** — free tier works fine for this step
- A business URL to test against

Zero Claude tokens. Zero GitHub. Just Firecrawl and n8n.

---

## The Problem with Manual URL Lists

When you're building a pipeline that needs to run on hundreds of different websites, hardcoding URLs is a non-starter.

Every site is different. Some use `/about`. Some use `/about-us`. Some put their services under `/what-we-do`. You can't predict the structure ahead of time.

And even if you could — you shouldn't have to. The site already knows which pages exist. We just need to ask it.

That's what Step 1 does.

---

## Step 1 — Let Firecrawl Map the Site

Firecrawl has two main endpoints. Most people use `/scrape`, which fetches one URL at a time. But there's also `/map`, which does something more useful for us: it crawls the site and returns a list of every URL it finds.

One API call. Full URL list. Done.

Here's the n8n setup:

**Node: Firecrawl Map**

- Method: `POST`
- URL: `https://api.firecrawl.dev/v1/map`
- Body:

```json
{
  "url": "{{ $json.url }}",
  "limit": 20
}
```

The `limit: 20` keeps costs low. Most small business sites have fewer than 20 pages anyway. If they have more, the 20 most important ones are almost certainly in the first 20.

The output is a `links` array — every URL the crawler found.

---

## Step 2 — Filter Down to the Pages That Matter

Raw Firecrawl map output is noisy.

When I ran it against a local business site, it returned everything — including a sitemap XML file, PDF downloads, and links to third-party booking forms.

None of that helps us understand the brand.

The next node — Filter Key Pages — trims the list down to what actually matters for a redesign: the homepage, about page, services, contact, and a few others. Everything else gets dropped.

Here's the logic:

**Always keep:** the homepage (it's always first in the list)

**Skip if the URL contains:**

- `blog`, `post`, `article`, `news` — content pages, not brand pages
- `sitemap`, `legal`, `privacy`, `terms` — utility pages
- `admin`, `login`, `wp-` — backend URLs
- `.xml`, `.pdf` — file downloads

**Keep if the URL contains:**

- `about`, `service`, `contact`, `menu`, `pricing`, `gallery`, `team`, `location`
- OR if the path is shallow (one level deep like `/our-story`)

**Cap at 8 pages.** That's enough content for brand analysis without wasting scrape credits on thin pages.

The node also auto-generates a slug from the domain name. `fairytailsmobilepetspa.com` becomes `fairytails-mobile-pet-spa`. No manual naming.

> **One thing I learned the hard way:** n8n's Code node runs in a sandboxed environment that doesn't have access to the browser's `URL` constructor. Use regex to parse URLs instead. The workflow file handles this for you — but worth knowing if you ever customize the filter logic.

---

## What the Output Looks Like

Here's what came back when I ran this against Fairy Tails Mobile Pet Spa:

```json
{
  "filtered_urls": [
    "https://fairytailsmobilepetspa.com",
    "https://fairytailsmobilepetspa.com/about",
    "https://fairytailsmobilepetspa.com/services",
    "https://fairytailsmobilepetspa.com/contact"
  ],
  "homepage": "https://fairytailsmobilepetspa.com",
  "slug": "fairytails-mobile-pet-spa"
}
```

Clean list. Right pages. Auto-generated slug. That's what Step 1 produces.

---

## Step 3 — Scrape Each Page (Selectively)

Now that we have the right URLs, we scrape each one.

The Split URLs node breaks the list into individual items — one per URL. Each one flows through a Firecrawl Scrape node.

Here's the key decision: **not every page gets the same treatment.**

Most pages only need `markdown` format. That gives us the text content, headings, and links — everything Claude needs for brand analysis.

The homepage gets something extra: `screenshot`.

Why only the homepage? Because visual style lives on the homepage. That's where the color palette, hero imagery, and layout choices are most prominent. Scraping screenshots of every page would cost more credits without adding much signal.

The scrape node checks whether the current URL is the homepage and adjusts the format request automatically:

```
formats: url === homepage ? ['markdown', 'screenshot'] : ['markdown']
```

---

## What the Scraped Output Looks Like

Here's a sample from the Fairy Tails Mobile Pet Spa homepage:

```
--- PAGE: Fairy Tails Mobile Pet Spa | URL: https://fairytailsmobilepetspa.com ---

# Fairy Tails Mobile Pet Spa

An important part of caring for our pets is proper and consistent pet grooming.

- We groom all sizes of dogs and cats.
- We offer luxury mobile grooming services to Illinois communities including
  Plainfield, Bolingbrook, Joliet, Orland Park, Naperville and Lemont.
- Award-Winning Groomer.
- 15+ Years of Experience.
- CPR and First Aid Certified.
```

Clean markdown. Real content. No JavaScript soup.

The homepage item also includes a `screenshot` URL — a hosted image Firecrawl takes of the page. That gets passed forward to the brand analysis step, where Claude uses it to extract the existing color palette.

> **Another thing I learned:** Google Maps tile images (`maps.googleapis.com`) show up as image URLs in the scraped markdown. They're not useful for a redesign. Add them to the image filter or you'll end up with 20 map tile URLs in your image list and none of the actual brand photos.

---

## How I Used AI to Build and Debug This

I want to be transparent about something. This pipeline wasn't built in isolation. I built it with Claude Code — Anthropic's CLI tool — running alongside n8n the whole time.

Here's what that actually looked like in practice.

**Planning the architecture.** Before writing a single node, I described what I wanted to build and worked through the design with Claude. How many API calls should this take? Where do tokens get spent? What's the right split between Steps 1 and 2? Most of those decisions came out of a conversation, not a document.

**Debugging the URL error.** When the Filter Key Pages node threw a `ReferenceError: URL is not defined` error, I pasted the error into Claude and got the fix in about 30 seconds. The `URL` constructor isn't available in n8n's sandboxed Code node environment — you have to use regex instead. I wouldn't have known that without hitting the error, and finding it in docs would have taken much longer.

**Cleaning up the image list.** After the first scrape run, the `image_urls` array was full of Google Maps tile URLs. I described what I was seeing, Claude identified the pattern, and we added a filter to block `maps.googleapis.com` URLs. Three lines of code. Two minutes.

The point isn't that AI wrote everything. I still designed the workflow, made the architectural decisions, and did the testing. But having something that can look at an error message and tell you exactly what's wrong — or talk through a design tradeoff — changes how fast you can move.

That's part of what this series is showing. Not just the finished thing, but how it gets built.

You can follow along by importing these into n8n. Each file is self-contained — just swap in your Firecrawl API key.

- [Step 1 — Site Discovery](/downloads/curb-appeal-step-1-site-discovery.json) — 4 nodes, outputs the filtered URL list
- [Step 2 — Selective Scrape](/downloads/curb-appeal-step-2-selective-scrape.json) — 7 nodes, outputs scraped markdown + screenshot per page

Both files use `YOUR_FIRECRAWL_API_KEY` as a placeholder. Replace it in the Firecrawl Map and Firecrawl Scrape nodes before running.

---

## What We Know at This Point

After these two steps, we have:

- A clean list of 4-8 key pages
- Markdown content from every page
- A screenshot of the homepage
- Real image URLs from the existing site
- An auto-generated slug for the business
- Zero AI tokens spent

That's the input to Step 3 — where Claude reads all of this and produces a structured brand profile.

---

## What's Next

In the next post, we feed everything from these two steps into a single Claude call.

The input: scraped content + homepage screenshot + image URLs.

The output: a JSON brand profile — business type, audience, color palette, tone of voice, and an opinionated redesign direction.

That profile is what makes the generated demo look like it belongs to the specific business instead of every business.

[Step 3 is coming soon →](/projects/curb-appeal)

---

## Frequently Asked Questions

**Does Firecrawl's free tier cover this?**
Yes. The map endpoint and a handful of scrape calls fall well within the free tier limits for testing. At scale you'll want to check Firecrawl's pricing — each scrape call uses one credit.

**What if the site blocks scraping?**
Some sites do. Firecrawl handles most JavaScript-heavy sites well (Wix, Squarespace, WordPress), but heavily protected sites may return thin content or errors. In that case, the brand analysis step will just have less to work with.

**Can I use a different scraping tool?**
Yes — any tool that returns markdown output would work in place of Firecrawl. The rest of the pipeline doesn't care where the markdown came from.

**Why not just use the full crawl endpoint instead of map + scrape?**
Firecrawl's crawl endpoint is asynchronous — it returns a job ID and you have to poll for results. That adds complexity to the n8n workflow. The map + scrape approach is synchronous and simpler to follow in a tutorial context.
