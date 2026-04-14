---
title: "Build a Simple Notification System That Tells You When Your AI Is Done Working"
description: "Build a Simple Notification System That Tells You When Your AI Is Done Working — a practical guide for non-engineers building with AI tools like ChatGPT, Claude, and Cursor."
pubDate: 2026-04-14
tags: ["AI", "Vibe Coding", "ChatGPT", "Productivity"]
author: "Derek Jensen"
draft: false
---

## Introduction

Imagine you ask an AI tool like Claude or ChatGPT to write something long — a full blog post, a research summary, or a chunk of code. You hit enter… and then what? You sit there. You stare at the screen. You wait. Maybe you check your phone, but then you keep glancing back because you don't want to miss when it's done. Sound familiar? Recently, someone on Reddit shared a clever little project: they built a USB device that lights up and grabs their attention the moment Claude Code finishes a response. It's a fun, creative hack — but you don't need to build hardware or know how to code to solve this problem. In this guide, we'll walk through simple, beginner-friendly ways to build a notification system that tells you when your AI is done working. That way, you can kick off a task, walk away, and get a ping when your result is ready. No screen-staring required.

## Introduction

Imagine you ask an AI tool like Claude or ChatGPT to write something long — a full blog post, a research summary, or a big chunk of code. You hit enter… and then what?

You sit there. You stare at the screen. You wait.

Maybe you pick up your phone, but you keep glancing back because you don't want to miss when it's done. Sound familiar?

Recently, someone on Reddit shared a clever little project. They built a USB device that lights up the moment Claude Code finishes a response. It's a fun, creative hack. But here's the good news — you don't need to build hardware or know how to code to solve this problem.

In this guide, we'll walk through simple, beginner-friendly ways to build a notification system that tells you when your AI is done working. Browser extensions. Free automation tools. Copy-paste scripts. Phone alerts. All of it.

The goal is simple. Kick off a task, walk away, and get a ping when your result is ready.

No screen-staring required.

If you're just getting started with AI tools in general, you might want to check out [How to Build with AI: A Beginner's Guide for Non-Engineers](https://derekjensen.io/blog/how-to-build-with-ai-a-beginners-guide-for-non-engineers) first — it covers the fundamentals that make projects like this one feel approachable.

## Why You Need a Notification System for Your AI Tasks

Here's the thing — most AI tools don't tell you when they're done. There's no chime. No pop-up. Nothing. They just quietly finish and sit there waiting for you to notice.

That's fine when a response takes five seconds. But AI tasks are getting longer. Maybe you asked Claude to write a full business plan. Or you kicked off a code project in Cursor that takes a few minutes to run. The longer the task, the more awkward the waiting gets.

You've got two bad options. You can stare at the screen like you're watching a pot of water boil. Or you can walk away and risk missing the result — then forget what you were even working on.

A simple notification fixes this entirely.

Think about it like a kitchen timer. You don't stand in front of the oven watching your pizza cook. You set a timer, go do something else, and come back when it beeps. That's what a notification system does for your AI work.

With even a basic alert — a sound, a text, a little pop-up — you can start a task, switch to something else, and come back the moment your result is ready. AI becomes a true background assistant instead of something that holds you hostage at your desk.

## What Inspired This: The USB Device That Alerts You When Claude Is Done

A few weeks ago, a Reddit user in the r/ClaudeAI community shared something cool. They built a small USB light that plugs into their computer. When Claude Code finishes a response, the light turns on. That's it. Simple idea, clever execution.

The post blew up. Thousands of upvotes. Tons of comments. Why? Because it hit a nerve. Everyone who uses AI tools knows the feeling of sitting there, waiting, wondering if the response is done yet. This person decided to fix that problem — with a physical gadget on their desk.

Here's the thing, though. You don't need to solder wires or buy special hardware to get the same result. The USB light is fun and creative, but it's just one way to solve the problem. There are much simpler approaches that work just as well.

Think of that Reddit project as inspiration, not a blueprint. It proved that people genuinely want this. A little alert that says, "Hey, your AI is done. Come check the results."

The good news? You can build your own version in minutes using free tools you already have. No hardware required. No engineering degree needed. Let's look at how.

## The Easiest Way to Build a Notification System: Browser Extensions

Here's the good news: you can set this up in about two minutes. No coding. No downloads beyond a single browser extension.

The tool I'd start with is **Distill Web Monitor**. It's a free Chrome or Firefox extension that watches any webpage for changes. When something new appears — like an AI response finishing — it pings you.

Here's exactly what to do:

1. **Install Distill Web Monitor** from the Chrome Web Store or Firefox Add-ons
2. **Open your AI tool** (ChatGPT, Claude, Gemini — whatever you use)
3. **Click the Distill icon** in your browser toolbar and select "Monitor parts of this page"
4. **Highlight the area** where AI responses appear — usually the main chat window
5. **Set your alert type** — pick a sound, a desktop pop-up, or both
6. **Set the check interval** to something short, like every 5 or 10 seconds

That's it. Now you can switch to another tab, check email, or grab coffee. When the AI finishes its response, you'll hear a chime or see a notification pop up on your screen.

> **Tip:** When selecting the area to monitor in Distill, try to highlight just the *last message area* rather than the entire chat window. Monitoring the whole page can trigger false alerts from UI changes like loading spinners or sidebar updates. The more specific you are, the more reliable your alerts will be.

**Page Monitor** is another solid option if you want something even simpler, though it has fewer customization features.

Start here. If this solves your problem, you don't need anything fancier.

## Use Simple Scripts to Build a Notification System (Even If You've Never Coded)

Here's something that might surprise you: a script that sends you a notification can be as short as three lines of code. You don't need to understand how it works — you just need to copy, paste, and run it. Think of it like following a recipe.

For example, here's a simple Python script that plays a sound when it runs:

```python
import os
os.system("say 'Your AI task is done'")  # Mac
```

On Windows, swap that line for:

```python
import winsound
winsound.Beep(1000, 500)
```

You paste this at the end of whatever task you're running, and your computer literally tells you when it's finished.

But maybe Python feels like too much. Totally fair. If you're on a Mac, open the **Shortcuts** app and create a one-step automation that sends you a notification. On Windows, **Power Automate** can do the same thing — no coding required.

The real trick? Ask your AI tool to write the script for you. Seriously. Tell ChatGPT or Claude: *"Write me a simple script that plays a sound when my task is done."* It'll hand you something ready to go.

Here's a prompt template you can copy and paste directly into your AI tool to get a ready-made notification script:

```
I'm a beginner and I don't write code. I need a simple script that sends me 
a desktop notification when it runs. 

Here's what I need:
- Operating system: [Mac / Windows / Linux]
- Notification type: [sound alert / pop-up notification / both]
- Custom message: [e.g., "Your blog draft is ready!"]

Please give me the complete script with step-by-step instructions for how 
to save and run it. Assume I've never used a terminal or command line before.
```

If you want to go beyond a basic sound and actually send a notification to your phone using the free tool Ntfy, here's a copy-paste script that does exactly that:

```python
import requests

# Replace 'my-ai-alerts' with any topic name you choose
# Subscribe to the same topic in the Ntfy app on your phone
requests.post(
    "https://ntfy.sh/my-ai-alerts",
    data="Your AI task is finished! Come check the results.",
    headers={"Title": "AI Task Complete"}
)
```

> **Warning:** If you're using the Ntfy script above, pick a unique topic name (like `derek-ai-alerts-2025`) instead of something generic like `test` or `notifications`. Ntfy topics are public by default — anyone who knows the topic name can send messages to it. A unique name keeps your alerts private in practice.

For more on getting better results when you ask AI to write things for you — including scripts like these — check out [5 Prompting Mistakes That Are Costing You Hours of Build Time](https://derekjensen.io/blog/be-smart-with-chatgpt-5-prompting-mistakes-that-are-costing-you-hours-of-build-time).

Start small. Copy one script. Run it once. You'll feel like a wizard.

## Build a Notification System with Webhooks and Free Automation Tools

Think of a webhook like a digital doorbell. When something happens — like an AI finishing a task — it "rings" another app and says, "Hey, the job's done!" That other app then does something useful, like sending you an email or a Slack message.

Here's where it gets fun. Free tools like **Zapier**, **Make** (formerly Integromat), or **IFTTT** let you connect that doorbell to almost anything. You can set it up so that when the webhook fires, you get a text message, a Slack ping, an email, or even a phone call.

So how does this work in practice?

If you're using an AI tool through an **API** — which is basically a way for software to talk to other software — many APIs let you set up a webhook as part of the request. You're telling the AI, "When you're done, ring this doorbell."

You don't need to understand APIs deeply to try this. Here's a simple path to start:

1. Create a free account on **Make** or **Zapier**
2. Set up a "webhook trigger" — these tools generate a URL for you
3. Connect that trigger to an action, like "send me an email"
4. Paste that webhook URL into your AI tool's settings or script

That's it. Now when your AI finishes, it hits that URL, and your chosen notification fires automatically.

This approach is especially great if you're running longer AI tasks and want to fully walk away.

If you run into issues getting your automation tools to behave, the troubleshooting mindset in [Mastering n8n Debugging Techniques](https://derekjensen.io/blog/mastering-n8n-debugging-techniques-r2m0) applies to Make and Zapier workflows too.

## How to Get Phone or Desktop Alerts When Your AI Is Done Working

Let's break down your options so you can pick the right one.

**If you're staying near your computer**, desktop notifications are the simplest choice. A tool called [Ntfy](https://ntfy.sh) (pronounced "notify") is free, open source, and easy to set up. You subscribe to a topic, and when a message gets sent to that topic, a notification pops up on your screen. [Pushover](https://pushover.net) is another solid option — it costs a one-time $5 fee but gives you cleaner controls and works on both desktop and phone.

**If you want to walk away entirely**, phone notifications are the way to go. Pushover and [Pushbullet](https://www.pushbullet.com) both have mobile apps that ping your phone instantly. For text messages specifically, Twilio offers a free trial that lets you send yourself an SMS when a task finishes.

**Here's a quick comparison:**

| Tool | Cost | Desktop | Phone | SMS | Setup Difficulty | Best For |
|------|------|---------|-------|-----|-----------------|----------|
| **Ntfy** | Free | ✅ | ✅ | ❌ | Very Easy | Beginners who want a free, fast setup |
| **Pushover** | $5 one-time | ✅ | ✅ | ❌ | Easy | A polished, reliable experience |
| **Pushbullet** | Free tier | ✅ | ✅ | ❌ | Easy | Android users |
| **Twilio SMS** | Free trial | ❌ | ❌ | ✅ | Moderate | Actual text message alerts |
| **Distill Extension** | Free tier | ✅ | ❌ | ❌ | Very Easy | Browser-only monitoring |

My recommendation? Start with Ntfy. It's free, works in minutes, and you can always upgrade later if you want more features.

## Tips for Making Your AI Notification System Reliable and Useful

Once your notification system is running, a few small tweaks will make it way more helpful.

**Avoid false alerts.** This is the biggest one. Some AI tools show text as it streams in, word by word. If your monitor triggers on *any* page change, you'll get pinged the second the AI starts typing — not when it's actually done. Fix this by adding a short delay in your browser extension settings. Something like "wait 5 seconds after the last change before alerting" works well. You want the notification to fire when the response is complete, not when it begins.

**Label your notifications.** If you're running two or three AI tasks at once — maybe one in ChatGPT and another in Claude — a generic "page updated" alert isn't very useful. Name each one. "Blog draft finished" or "Code review done" takes two extra seconds to set up and saves you real confusion later.

> **Tip:** If you use Claude's desktop app, you can pair these notification techniques with the workflows in [Getting the Most Out of Claude's Desktop Version](https://derekjensen.io/blog/getting-the-most-out-of-claude-s-desktop-version-b0zm) — for example, using a Mac Shortcut that fires a notification after a desktop-based Claude task completes.

**Start simple.** It's tempting to build a fancy multi-step automation right away. Don't. Begin with a browser extension or a basic sound alert. Use it for a week. See what bugs you. *Then* upgrade if you need to. The best notification system isn't the most complex one — it's the one you'll actually keep using. Build small, improve later.

## Conclusion

Here's the big takeaway: you don't need to be an engineer to solve this problem. You don't need to solder a USB device or write complex code. You just need to pick one simple method and try it.

Whether it's a browser extension that watches for changes, a copy-paste script that plays a sound, or a free automation tool that sends a text to your phone — any of these gets you the same result. You kick off an AI task, walk away, and get a ping when it's done.

That's a small win. But it's also something bigger.

When you build a little notification system like this, you're doing the same thing engineers do every day. You're seeing a problem, finding a tool, and wiring up a solution. You're not just *using* AI — you're building *with* it. And that's a skill that compounds over time.

So here's my challenge: pick one method from this guide. Just one. Set it up today. It might take five minutes. It might take twenty. Either way, you'll free yourself from staring at a screen — and you'll prove to yourself that you can build things.

That's how it starts. One simple project at a time.

If this was your first build project and you're hungry for more, [How to Build with AI Even If You're Not a Developer](https://derekjensen.io/blog/how-to-build-with-ai-even-if-youre-not-a-developer) is a great next step.

## FAQ

**Do I need to know how to code to build a notification system for AI tools?**
Not at all. Browser extensions and no-code automation tools like Zapier or IFTTT let you set up notifications without writing a single line of code. If you want to try a script, there are copy-paste templates that work right out of the box.

**Will a notification system work with any AI tool, or only specific ones?**
Most methods described here work with any AI tool you use in a web browser, including ChatGPT, Claude, and Gemini. For API-based workflows, webhook notifications are the best fit. The key is matching the right notification method to how you use your AI tool.

**Is it free to build a simple notification system that tells me when my AI is done?**
Yes — many options are completely free. Browser extensions like Distill Web Monitor have free tiers, Ntfy is free and open source, and automation tools like IFTTT and Zapier offer free plans that cover basic notification setups. You can get started without spending a dollar.