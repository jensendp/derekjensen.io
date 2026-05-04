---
title: "I Built an AI Tool That Redesigns Websites. Now I'm Building It Into a Real Product in Public."
description: "Introducing Curb Appeal — an AI pipeline that scrapes a local business website, builds a redesigned demo, and deploys it live before you ever talk to the owner. Here's what it is, why I built it, and what I'm doing next."
pubDate: '2026-05-04'
author: 'Derek Jensen'
tags: ['automation', 'n8n', 'build in public', 'AI tools', 'curb appeal']
draft: false
heroImage: '/images/blog/curb-appeal-hero-part-1.png'
---

Most local business websites are bad.

Not broken. Not offensive. Just... outdated. A 2009 color scheme. A phone number that's hard to find. A homepage that doesn't say what the business actually does.

The owners know it. They just haven't fixed it.

And if you're a web designer or developer trying to help them, you've probably run into this problem: by the time you put together a proposal and a mockup, the owner has moved on. The moment is gone.

So I asked myself a different question.

**What if the demo already existed before you made the call?**

---

## That's the Idea Behind Curb Appeal

Curb Appeal is an AI pipeline I built to solve exactly that problem.

You give it a URL. It does the rest.

It scrapes the business's website. It figures out what the business does, who it serves, and what the brand looks and feels like. Then it builds a complete, redesigned demo page and deploys it to a live URL — automatically.

No manual work. No back and forth. One input, one live demo.

The whole process takes a few minutes. You could show up to a conversation with the demo already ready. Before they ask. Before they even know you exist.

I've been testing it on real local businesses. It works. And now I want to turn it into a real product.

---

## Why I'm Doing This in Public

Here's the honest reason.

I've been writing on this blog about how to build things with AI. How automation works. How to prompt well. How to turn an idea into software without being an engineer.

But writing about it and _doing_ it are two different things.

Building Curb Appeal in public is my way of showing you that the stuff I write about actually works. Every post in this series will use a concept I've already covered — and show it applied to a real project, with real results.

Not theory. Not a tutorial with fake data. The actual thing, built step by step.

> **Tip:** If you want to follow along and build something similar yourself, every step in this series comes with a downloadable n8n workflow file. You don't need to start from scratch.

---

## What I've Written About That Applies Here

If you've been reading this blog, you'll recognize a lot of what's coming.

The automation pattern I use — **Trigger → AI Decision → Action** — is the same one I wrote about in [AI-Powered Automation for Workflows](/blog/ai-powered-automation-for-workflows-the-complete-guide).

The way I control costs by matching model and reasoning effort to each task comes from [AI Reasoning Effort Explained](/blog/ai-reasoning-effort-explained-control-how-deep-ai-thinks).

The two-prompt chain that extracts the brand profile and then generates the HTML is a live example of what I described in [Prompt Engineering for Builders](/blog/prompt-engineering-for-builders-the-complete-guide).

And the whole approach — validate the idea fast, build a scrappy version, test it on real data — is straight out of [Turning Ideas into Software with AI](/blog/turning-ideas-into-software-with-ai-the-complete-guide).

Curb Appeal is what it looks like when you actually follow those frameworks.

---

## What You'll Need

You don't need everything set up before you start reading. But if you want to build along, here's the full list.

- **n8n** — the automation platform that connects everything. Free to self-host, or around $20/month on n8n.cloud.
- **Firecrawl** — scrapes websites and returns clean, readable content. Free tier available.
- **Claude API** — Anthropic's API for brand analysis and HTML generation. Pay per use, roughly $0.01–$0.03 per job.
- **GitHub** — stores the generated demo files and triggers deployment. Free.
- **Vercel** — hosts the live demos automatically on every GitHub push. Free tier is more than enough.

Each step post will call out exactly which tools it uses and what you need to have ready.

---

## What This Series Covers

Here's the plan. Each step gets its own post. Each post includes the workflow file so you can follow along.

**Step 1 & 2 — Scrape the Right Pages**
How to point the pipeline at any URL and automatically discover and scrape only the pages that matter. No manual URL lists. Zero AI tokens at this stage.

**Step 3 — Teach AI to Read a Brand**
One Claude call that reads the scraped content and screenshot, then outputs a full brand profile: colors, tone, audience, and an opinionated redesign direction.

**Step 4 — Generate the Demo**
How the brand profile drives a second Claude call that builds the HTML. Why the brief does the heavy lifting, not the model.

**Step 5 — Deploy It Automatically**
Push to GitHub, auto-deploy on Vercel, return a live URL. The part that makes this feel like magic.

**Step 6 — Real Numbers**
What it actually costs to run this per job. Token counts, Firecrawl credits, the whole thing. This is where we figure out how to price it.

---

## Where It Stands Right Now

Steps 1 and 2 are built and tested. The scraping layer works. I've run it on real sites and the output is clean.

You can see the full project — what it is, how it works, what it's built with — on the [Curb Appeal project page](/projects/curb-appeal).

If you want to be notified when early access opens, [send me a message](/contact).

---

## A Note on Token Cost

One thing I'm focused on as I build this: keeping the cost per job low.

Every step that doesn't need AI doesn't use AI. The scraping layer costs zero Claude tokens. The brand analysis step uses one Claude call with high reasoning effort — because that's the step where quality actually matters. The HTML generation uses a lighter setting because the brief does the work, not the model.

I'm targeting under $0.10 per demo at scale. I'll share the real numbers when I get there.

---

## Follow Along

I'll be publishing each step as I build it. If you want to follow the series, [subscribe to the blog](/blog) or check back here.

And if you have a local business in mind that could use a free demo — send me the URL. I'm always looking for real examples to test against.

---

## Frequently Asked Questions

**Do I need to know how to code to follow along?**
No. The workflows are visual, node-based automation in n8n. If you can drag and drop, you can follow along.

**What tools does this use?**
n8n for the automation pipeline, Firecrawl for scraping, Claude API for brand analysis and HTML generation, GitHub and Vercel for deployment.

**Is Curb Appeal available to use?**
Not yet publicly. It's in private testing. Follow the series and you'll know when it opens.

**Can I build my own version?**
Yes. That's the whole point of this series. Every step comes with a downloadable workflow file.
