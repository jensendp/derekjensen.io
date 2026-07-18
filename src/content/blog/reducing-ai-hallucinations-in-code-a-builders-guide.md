---
title: "Reducing AI Hallucinations in Code: A Builder's Guide"
description: "Learn practical techniques for reducing AI hallucinations in code. Real prompt strategies that save you hours of debugging made-up functions and fake APIs."
pubDate: '2026-07-18T12:03:12'
tags: ["AI hallucinations","prompt engineering","AI-assisted coding","vibe coding"]
author: "Derek Jensen"
draft: false
heroImage: "https://images.unsplash.com/photo-1585419908131-9640f2914d64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MjQ4MjF8MHwxfHNlYXJjaHwxfHxSZWR1Y2luZyUyMEFJJTIwSGFsbHVjaW5hdGlvbnMlMjBpbiUyMENvZGUlM0ElMjBBJTIwQnVpbGRlciUyN3MlMjBHdWlkZXxlbnwwfDB8fHwxNzg0Mzc2MTkzfDA&ixlib=rb-4.1.0&q=80&w=1080"
---

You asked AI to build a simple feature. The code looked perfect. Then you hit run — and nothing works because half the functions don't actually exist.

That's a hallucination. And if you're building with AI, it's probably costing you hours every single week.

I've tracked it across my own projects. A single hallucinated API call can burn an entire afternoon — and at $50-150/hour of your time, that's real money walking out the door.

Here's how to stop it.

## What AI Hallucinations in Code Actually Look Like (With Real Examples)

A code hallucination is when AI writes code that uses functions, libraries, or features that simply don't exist. It looks totally real. It reads like it should work. But it's completely made up.

Here's what this looks like in practice:

**Example 1:** You ask AI to add Stripe payments. It writes `stripe.customers.createSubscriptionPortal()`. That method sounds right. But it doesn't exist in Stripe's library. The real method is `stripe.billingPortal.sessions.create()`. You'd never know until your app crashes.

**Example 2:** You ask for help uploading files to Supabase Storage. AI gives you `supabase.storage.uploadFile('bucket', file)`. Looks clean. But the actual method is `supabase.storage.from('bucket').upload(path, file)`. Different structure entirely.

**Example 3:** AI imports a package called `react-easy-charts` for your dashboard. You run `npm install` and get an error. That package doesn't exist. Never did.

Here's why reducing AI hallucinations in code matters more than catching a wrong fact in an essay. When AI makes up a historical date, you can spot it quickly. When AI makes up a function name, your app either crashes with a confusing error — or worse, fails silently and you don't notice until your users do.

> **Warning:** Hallucinated package names aren't just annoying — they can be a security risk. Attackers sometimes publish malicious packages using names that AI commonly hallucinates. If you blindly `npm install` a package AI suggested without checking it first, you could be installing something dangerous. Always verify a package exists on the official registry before installing it. For more on this topic, see the guide on [security risks of AI-built software](https://derekjensen.io/blog/security-risks-of-ai-built-software-the-guide).

## The Real Cost of Not Reducing AI Hallucinations in Code

Let's talk numbers. Because this isn't just annoying — it's expensive.

Say you spend 3-5 hours a week chasing down fake functions and made-up methods. At $50/hour, that's $150-250 per week. At $100/hour? Up to $500. Over a month, you're looking at **$600-1,000 gone** — not on building, but on debugging code that was never real in the first place.

And that's just the direct cost. Here's what else piles up:

- **Delayed launches.** Every week lost to hallucination debugging is a week your product isn't live and earning.
- **Compounding frustration.** I've watched builders quit projects entirely — not because the idea was bad, but because they couldn't trust their AI's output anymore.
- **Lost momentum.** When you're a solo builder, momentum is everything. One bad afternoon can kill a whole week's motivation.

| Cost Factor | Without Hallucination Prevention | With Hallucination Prevention |
|---|---|---|
| Weekly debugging hours | 3–5 hours | 0.5–1 hour |
| Monthly cost (at $100/hr) | $1,200–$2,000 | $200–$400 |
| Typical time to MVP | 6–8 weeks | 3–4 weeks |
| Builder confidence | Low — constant second-guessing | High — trust the output |
| Project abandonment risk | High | Low |

Now picture two builders starting the same [30-day project](https://derekjensen.io/blog/30-day-ai-builder-plan-a-realistic-guide). Builder A uses techniques for reducing AI hallucinations in code. Builder B just prompts and prays. By day 30, Builder A has a working product. Builder B is still stuck on week two's bugs, buried under fake API calls.

The gap isn't small. It's the difference between shipping and stalling.

## Why AI Makes Up Code (And Why It's Not Random)

Here's the thing most people don't realize: AI doesn't "know" anything. It predicts what words should come next based on patterns it learned during training.

Think of it like autocomplete on your phone — but way more advanced. When you ask for code, the AI isn't looking up a real function in real documentation. It's guessing what a function *probably* looks like based on millions of code examples it's seen before. If you want a deeper dive into how this actually works, check out the plain-English explanation of [how AI writes code](https://derekjensen.io/blog/how-ai-writes-code-a-plain-english-guide).

That's why reducing AI hallucinations in code gets harder with certain tools. When you're using a newer library, a less popular framework, or an API that recently changed, the AI has less training data to draw from. So its guesses get worse. It starts mixing up version syntax, inventing method names that *sound* right, or combining patterns from different libraries into something that doesn't actually exist anywhere.

And here's the most dangerous part — the confidence trap. AI delivers made-up code with the exact same tone and formatting as correct code. There's no hesitation. No "I'm not sure about this." It hands you a fake Stripe method with the same confidence as a real one.

You literally cannot tell the difference just by reading it. That's not a bug. That's how these models work. And once you understand that, you can start building habits that protect you.

## 5 Prompt Techniques for Reducing AI Hallucinations in Code

These five techniques have saved me more time than almost anything else I've learned as a builder. Each one is simple. And they work even better when you combine them. (For the broader framework these fit into, see the full [prompt engineering for builders guide](https://derekjensen.io/blog/prompt-engineering-for-builders-the-complete-guide).)

**1. Pin your versions and stack.**
Don't just say "build me a login page." Say "Use Next.js 14.1, Supabase JS v2, and Tailwind 3.4." When AI knows exactly what versions you're using, it's far less likely to invent functions from the wrong version — or from no version at all.

**2. Add the "If you're unsure, say so" instruction.**
Put this line in your prompt: *"If you're not sure a function or method exists, tell me instead of guessing."* It sounds almost too simple. But it works. It gives the AI permission to flag uncertainty instead of faking confidence.

> **Tip:** This technique pairs perfectly with [controlling AI reasoning effort](https://derekjensen.io/blog/ai-reasoning-effort-explained-control-how-deep-ai-thinks). When you tell the AI to think more carefully *and* admit uncertainty, you get dramatically fewer hallucinations — especially on complex, multi-step builds.

**3. Ask AI to cite its sources first.**
Before writing any code, ask: *"Show me where in the official documentation this method is described."* This forces the AI to slow down and check its own work.

**4. Break requests into small, verifiable steps.**
Instead of "build me a full checkout flow," ask for one piece at a time. Smaller chunks are easier to verify — and hallucinations have fewer places to hide. This is the same principle behind [multi-step prompt workflows](https://derekjensen.io/blog/multi-step-prompt-workflows-ai-build-more-prompt-less).

**5. Use a "verify then build" two-prompt workflow.**
First prompt: *"Does Stripe's Node SDK have a method called X?"* Second prompt: *"Great — now write the implementation."* This two-step approach is one of the most reliable methods for reducing AI hallucinations in code because you catch fake functions before they ever reach your project.

Here's what that two-step workflow looks like in practice:

```
# Step 1: Verify
"I need to create a Stripe checkout session using the Stripe Node SDK v14.11.
Before writing any code, list the exact method name I should use and
confirm it exists in v14.11. Include the expected parameters."

# Step 2: Build (only after verification)
"Confirmed — now write the implementation for stripe.checkout.sessions.create()
using Next.js 14.1 App Router with the following requirements:
- One-time payment of $49
- Success and cancel redirect URLs
- Include the customer's email"
```

Start with even one of these. You'll notice the difference immediately.

## The Stack Recipe: A Hallucination-Proof Prompt Template You Can Steal

Here's a ready-to-use prompt template that combines all five techniques into one block. Copy it, paste it, and edit the bracketed parts for your project:

```
You are helping me build [FEATURE DESCRIPTION].

My stack:
- [Tool/framework + exact version]
- [Tool/framework + exact version]
- [Tool/framework + exact version]

Rules:
1. Only use functions and methods that exist in the versions listed above.
2. If you're not sure a function exists, tell me instead of guessing.
3. Before writing any implementation code, show me the function names you plan to use and where they come from in the official docs.
4. Break your solution into small steps. Wait for my approval after each step before moving on.
```

Let's walk through why each line matters:

- **The stack block** pins your versions so the AI stops guessing which API you're using.
- **Rule 1** gives the AI a boundary it can follow.
- **Rule 2** is your "escape valve" — it gives the AI permission to say "I don't know."
- **Rule 3** forces citation before action. This alone catches most hallucinated functions.
- **Rule 4** keeps responses small and verifiable.

Now here's the difference in practice. Say you're building a Stripe checkout page.

**Naive prompt:** *"Build me a Stripe checkout page in Next.js with Supabase."*

That prompt got one of my students a response using `stripe.checkout.createSession()` — a method that doesn't exist. They spent two hours debugging it.

**Using the template:**

```
You are helping me build a one-time payment checkout page.

My stack:
- Next.js 14.1 (App Router)
- Stripe Node SDK v14.11
- Supabase JS v2.39

Rules:
1. Only use functions and methods that exist in the versions listed above.
2. If you're not sure a function exists, tell me instead of guessing.
3. Before writing any implementation code, show me the function names you plan to use and where they come from in the official docs.
4. Break your solution into small steps. Wait for my approval after each step before moving on.
```

With this prompt, the AI first listed `stripe.checkout.sessions.create()` — the real method — and cited the Stripe docs before writing a single line of code. Total build time: 20 minutes, zero hallucinations.

This template is one of the simplest ways to start reducing AI hallucinations in code right now. Save it somewhere you'll actually find it — a notes app, a pinned doc, wherever. You'll use it more than you think. For more ready-to-use templates like this, check out the [prompt templates for app building](https://derekjensen.io/blog/prompt-templates-for-app-building-copy-paste-kit) copy-paste kit.

## What the Top-Ranking Guides Miss About Reducing AI Hallucinations in Code

If you've Googled this topic, you've probably found guides that talk about hallucinations in a general sense. They cover things like AI making up facts, inventing fake quotes, or citing studies that don't exist.

That's helpful — but it's not your problem.

Your problem is that AI just invented a function called `stripe.subscriptions.createPortal()` and you spent two hours figuring out it doesn't exist. Code hallucinations are a different beast, and most guides don't treat them that way.

You'll also see enterprise-level solutions thrown around — things like RAG (Retrieval-Augmented Generation) and Graph-RAG. These are powerful tools. But if you're a solo builder shipping projects with Cursor or Replit, setting up a vector database is overkill. The prompt techniques from the previous sections will get you 80% of the way there. That's a massive win for zero infrastructure.

Now here's the piece almost nobody talks about when it comes to reducing AI hallucinations in code: **feed your actual project files into the conversation.**

When AI can see your real codebase — your actual file structure, your existing functions, your installed packages — it hallucinates far less. It stops guessing and starts working with what's really there.

Most hallucinations happen because AI is filling in blanks. Give it fewer blanks to fill.

> **Tip:** If you're using a tool like Cursor, Claude, or Windsurf, you can often attach or reference your project files directly in the conversation. Before your next build session, try pasting your `package.json` (or equivalent) into the chat. This tells the AI exactly which packages and versions you have installed — and it dramatically reduces hallucinated imports. For more on setting up your workspace this way, see the guide on [beginner-friendly AI dev environments](https://derekjensen.io/blog/beginner-friendly-ai-dev-environments-guide).

## When Hallucinations Still Slip Through: Your Safety Net

Even with great prompts, some hallucinations will sneak past. That's okay. You just need a quick way to catch them before they cost you hours. (If you want a deeper system for handling these situations, the guide on [debugging AI-generated code](https://derekjensen.io/blog/debugging-ai-generated-code-the-complete-guide-2025) covers it end to end.)

**The 60-second check.** When AI gives you a function you haven't seen before, do one of these:

1. **Search the function name.** Copy it, paste it into Google with the library name. If nothing comes up, it's probably fake.
2. **Check the official docs.** Go straight to the documentation site. Use Ctrl+F to search for the method. Real functions have doc pages.
3. **Ask a second AI.** Paste the function into a different tool and ask, "Does this method actually exist in this library?" A second opinion catches a lot.

**Use AI as its own hallucination checker.** After getting code, follow up with what I call an "adversarial review" prompt:

```
Review the code you just wrote. For every function, method, and imported
package you used, do the following:

1. State the exact function/method name.
2. State which library and version it belongs to.
3. Rate your confidence (0-100%) that it exists in that version.
4. Flag anything below 95% confidence with ⚠️ and suggest a verified alternative.

Be brutally honest. I would rather rewrite a section than debug a
hallucinated function.
```

You'd be surprised how often it catches its own mistakes when you ask directly.

**Build a "known good" prompt library.** Every time you confirm a working solution, save the prompt and the output. Over time, you'll build a personal reference that keeps reducing AI hallucinations in code on autopilot. You stop Googling the same things. You stop falling for the same fake functions. Your builds get faster every single week.

## Conclusion

Here's the truth: reducing AI hallucinations in code isn't about luck. It's not about picking the "right" AI tool. It's a skill. And like any skill, it gets better with practice.

The good news? You don't need to practice for years. You can start today. Pin your versions. Break big requests into small steps. Ask the AI to verify before it builds. These simple habits will save you hours this week — not someday, but right now.

And here's what makes this exciting. Out of all the things you could learn as a non-technical builder, this might be the highest-ROI skill on the list. We're talking about saving 3-5 hours a week. Launching faster. Actually trusting the code your AI gives you instead of crossing your fingers every time you hit run.

You don't need to become an engineer. You just need to become a smarter prompter.

If you want the full framework — not just for hallucinations, but for every part of working with AI — check out my [Prompt Engineering for Builders](https://derekjensen.io/blog/prompt-engineering-for-builders-the-complete-guide) guide. It covers everything from writing your first prompt to building complete projects with confidence.

Now go build something. And this time, it'll actually work.

## FAQ

### How do I reduce hallucinations when using AI to write code?

Start with three habits. First, pin your versions — tell the AI exactly what tools and versions you're using so it doesn't guess. Second, keep your requests small. Ask for one function at a time instead of an entire feature. Third, use a "verify then build" workflow. Before asking AI to write code with a specific method, ask it: "Does this method actually exist in this version of the library?" Once it confirms, then ask for the implementation. These three steps alone will eliminate most of the hallucinated code you're running into. For a broader look at prompting fundamentals, see the [complete guide to prompt engineering for builders](https://derekjensen.io/blog/prompt-engineering-for-builders-the-complete-guide).

### What is the best prompt engineering technique to reduce AI hallucinations?

The single most effective move for reducing AI hallucinations in code is combining two instructions in your prompt: "If you're not sure a function or method exists, say so instead of guessing" plus "Cite the documentation or source for every function you use." This one-two punch forces the AI to slow down and flag anything it's uncertain about. You'll notice it starts saying things like "I'm not 100% sure this method is available in v3" — and that honesty saves you hours of debugging.

### Why does AI make up functions and libraries that don't exist?

AI doesn't actually "know" code. It predicts what words (or tokens) are most likely to come next based on patterns it learned during training. If a function name *sounds* like it should exist — like `stripe.customers.createCheckout()` — the AI might confidently write it, even though the real method is called something different. This gets worse with newer libraries, recent API updates, and less popular frameworks, because the AI has less training data to draw from. It's not lying on purpose. It's just guessing — and it guesses with the same confident tone whether it's right or wrong.