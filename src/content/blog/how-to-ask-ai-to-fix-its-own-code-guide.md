---
title: "How to Ask AI to Fix Its Own Code (2026 Guide)"
description: "Learn how to ask AI to fix its own code with simple prompts and frameworks. No coding background needed — just clear steps that actually work in 2026."
pubDate: '2026-09-13T12:02:48'
tags: ["AI debugging","AI prompting frameworks","fixing AI-generated code","non-technical builders"]
author: "Derek Jensen"
draft: false
heroImage: "https://images.unsplash.com/photo-1762330470070-249e7c23c8c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MjQ4MjF8MHwxfHNlYXJjaHwxfHxIb3clMjB0byUyMEFzayUyMEFJJTIwdG8lMjBGaXglMjBJdHMlMjBPd24lMjBDb2RlJTIwJTI4MjAyNiUyMEd1aWRlJTI5fGVufDB8MHx8fDE3ODkzMDA5Njh8MA&ixlib=rb-4.1.0&q=80&w=1080"
---

You pasted the error back into ChatGPT. It "fixed" the code. Then you got a brand new error. Sound familiar?

Most people get stuck in this loop because they don't know *how* to ask. Not because they're bad at coding — they're not coders at all. And that's fine.

There's a simple framework that changes everything. Once you learn how to ask AI to fix its own code the right way, you stop spinning in circles and start actually shipping.

Let me show you exactly how I do it.

## Why AI Can't Just "See" What's Wrong (And Why Your Ask Matters)

Here's something that surprises most people: AI doesn't remember what it was trying to do. It doesn't look at broken code and think, "Oh right, I meant to do X." It only works with whatever you put in front of it right now.

Think of it like this. Imagine a student grading their own exam — but they've completely forgotten studying for it. They're just looking at the answers cold. Without context, they'll miss their own mistakes or "fix" things that weren't even broken.

That's exactly what happens when you paste an error into ChatGPT with no other details. The AI guesses. Sometimes it guesses right. Often it doesn't — and now you've got a new problem on top of the old one.

But here's the good news: this is totally solvable.

Learning how to ask AI to fix its own code is really about learning how to give it the right context. When you guide the conversation with clear details — what went wrong, what you expected, and what you're building — AI gets dramatically better at finding the real fix. If you're new to this whole idea, my guide on [what AI-assisted development actually means](https://derekjensen.io/blog/what-is-ai-assisted-development-a-plain-english-guide) breaks it down in plain English.

The AI is capable. It just needs you to point it in the right direction. And that's a skill you can pick up fast.

## The 3-Part Prompt Framework for Asking AI to Fix Its Own Code

Here's the framework I use every single time something breaks. It has three parts:

1. **The error message** — Copy and paste the exact error. Every word.
2. **What you expected to happen** — Describe the behavior you wanted in plain English.
3. **What actually happened** — Describe what you saw instead.

That's it. Let me show you the difference.

**Vague prompt:** "This code isn't working. Can you fix it?"

**Structured prompt:** "I'm getting this error: `TypeError: Cannot read properties of undefined (reading 'map')`. I expected the app to display a list of blog posts on the homepage. Instead, the page is blank and this error shows up in the console. Here's the code block where it breaks: [paste code]."

Here's a prompt template you can copy and reuse every time something breaks:

```
I need you to fix a bug in code you previously generated.

**Original goal:** [Describe what you asked AI to build]

**Error message:**
[Paste the exact error message here]

**What I expected:** [Describe the behavior you wanted]

**What actually happened:** [Describe what you saw instead]

**Code that's breaking:**
[Paste only the relevant code section]

Fix only this specific issue. Do not change anything else in the code. Explain what you changed and why.
```

See how much more the AI has to work with in the structured version?

The reason most people get stuck learning how to ask AI to fix its own code is they skip parts two and three. They paste the error and say "fix it." But without knowing what you *wanted*, the AI is just guessing.

> **Tip:** You don't need to understand the error message yourself. Just copy and paste the whole thing — even the parts that look like gibberish. The AI knows what those technical details mean, and they often contain the exact clue it needs to find the fix.

Context is everything. The AI wasn't sitting next to you when things went wrong. You have to paint the picture. Three sentences is usually all it takes. For a deeper dive into writing prompts that actually produce working results, check out the guide on [writing prompts that generate working code](https://derekjensen.io/blog/writing-prompts-that-generate-working-code-guide).

## Stop Pasting Just the Error — Give AI the Full Picture

Here's what most people do when code breaks: they copy the error message, paste it into ChatGPT, and type "fix this." That's like calling a mechanic and saying "my car makes a noise" without telling them which car you drive.

When you're learning how to ask AI to fix its own code, the biggest upgrade you can make is giving it the full picture. I use what I call the "sandwich" method.

**Top layer: your original instructions.** Paste the prompt you first used to generate the code. This reminds the AI what it was trying to build.

**Middle layer: the broken code block.** Not your entire project — just the specific piece that's failing. If you have 200 lines of code but the error points to lines 40–55, paste that section plus a few lines above and below for context.

**Bottom layer: the exact error message.** Copy the whole thing, even the parts that look like gibberish. Those details matter to the AI even if they mean nothing to you.

Here's what the sandwich method looks like in practice:

```
**My original prompt to you was:**
"Build a JavaScript function that fetches blog posts from my API
at /api/posts and displays them as a bulleted list on the page."

**Here's the code that's failing (lines 38-52):**
async function displayPosts() {
  const response = await fetch('/api/posts');
  const posts = response.json();
  const list = posts.map(post => `<li>${post.title}</li>`);
  document.getElementById('post-list').innerHTML = list.join('');
}

**Here's the exact error I'm getting:**
TypeError: posts.map is not a function
    at displayPosts (app.js:41:24)

Fix only this specific issue. Do not refactor or rename anything else.
```

> **Warning:** Don't paste your entire codebase into the chat. This actually confuses the AI — it's like handing someone a whole book and asking them to find one typo. Isolate the broken piece. The smaller and more focused your paste, the better the fix you'll get back.

The most common mistake I see? People paste their entire codebase. This actually confuses the AI. It's like handing someone a whole book and asking them to find the one typo. Instead, isolate the broken piece. The smaller and more focused your paste, the better the fix you'll get back. If you're not sure how to read error messages to find the right section, [this guide on reading code errors without coding experience](https://derekjensen.io/blog/how-to-read-code-errors-without-coding-experience) will help.

## How to Ask AI to Fix Its Own Code Without Creating New Bugs

Here's where most people run into trouble. AI fixes one thing and breaks two others. That's because you didn't tell it to stay focused.

Try adding this line to your prompt: **"Fix only this specific issue. Do not change anything else in the code."**

That single constraint changes everything. Without it, AI loves to "improve" things you didn't ask about. It renames variables. It restructures functions. It refactors stuff that was working fine. Then you've got new problems on top of old ones.

Once you learn how to ask AI to fix its own code this way — with clear boundaries — you'll see fewer surprise bugs. For more on why this happens, take a look at [why AI-generated code breaks and how to fix it](https://derekjensen.io/blog/why-ai-generated-code-breaks-and-how-to-fix-it).

But don't stop there. Before you accept any fix, ask this:

**"Explain exactly what you changed and why."**

If the AI can't give you a clear, simple explanation, that's a red flag. A good fix should be easy to explain.

And here's one more habit that'll save you headaches. After the AI explains its fix, follow up with:

**"List any potential side effects this change might cause in the rest of the code."**

This forces the AI to think about what its fix might break. It won't catch everything, but it catches a lot. You're basically giving the AI a checklist before you hit paste.

Here's a quick reference for all three follow-up prompts you should use after every fix:

| Step | Prompt to Use | What It Does |
|------|--------------|--------------|
| 1. Constrain the fix | "Fix only this specific issue. Do not change anything else in the code." | Prevents AI from refactoring working code |
| 2. Demand an explanation | "Explain exactly what you changed and why." | Confirms the AI actually understands the problem |
| 3. Check for side effects | "List any potential side effects this change might cause in the rest of the code." | Catches downstream bugs before they happen |

Three prompts. One fix. Zero surprises. That's the goal.

## When to Reset the Conversation and Start Fresh

Here's a rule I live by: if AI hasn't fixed the problem in three attempts, stop asking in that same chat.

I call it the "3-attempt rule." After three rounds of back-and-forth fixes, the conversation is polluted. The AI is juggling too many conflicting instructions. Each new reply builds on confused context, and the fixes start making things worse instead of better.

When this happens, don't keep pushing. Open a brand new chat.

But here's the key — don't just paste the error again. Write a clean, structured prompt that summarizes everything from scratch. Use the framework from earlier: what you're building, what went wrong, the error message, and what you expected. Pretend the AI has never seen your project before, because in a fresh chat, it hasn't.

> **Tip:** When you start a fresh chat, include one extra line: *"Previous attempts to fix this introduced new errors by changing unrelated code. Please make the most minimal change possible."* This primes the AI to be conservative, which is exactly what you want after a frustrating loop.

This one move alone has saved me hours. It's a core part of knowing how to ask AI to fix its own code effectively. If you want to learn more about breaking out of that frustrating fix-break-fix cycle, I wrote a whole piece on [how to iterate on broken AI outputs step by step](https://derekjensen.io/blog/how-to-iterate-on-broken-ai-outputs-step-by-step).

One more trick: if a fresh chat still doesn't solve it, try switching tools entirely. I'll move from ChatGPT to Claude, or vice versa. Different models think differently. I've had Claude crack a bug in one shot that ChatGPT struggled with for five rounds — and the opposite has happened too.

The tool isn't broken. The conversation just needs a reset.

## Use AI to Review Its Fix Before You Run It

Here's something wild: if you ask AI to rate its own code, it almost always gives itself a 10 out of 10. Not super helpful, right?

But you can get around this. The trick is to make AI put on a different hat. This is a technique called [role-based prompting](https://derekjensen.io/blog/role-based-prompting-techniques-ai-a-builders-guide), and it's incredibly useful beyond just debugging.

After AI gives you a fix, don't run it yet. Instead, paste this follow-up prompt:

```
Now act as a senior code reviewer. Review the fix you just gave me
against these criteria:

1. Does it actually solve the error I described?
2. Does it change anything beyond the specific fix?
3. Are there any edge cases that could break this later?
4. Is the fix the most minimal change possible?

Be critical — don't just say it looks good. If you find issues,
suggest a revised fix.
```

This forces the AI to slow down and think through its own work with a critical eye. Without those specific criteria, it just pats itself on the back. With them, it often catches things it missed the first time.

This is a key part of learning how to ask AI to fix its own code. You're adding a built-in safety net before anything goes live.

Think of it like asking a friend to proofread an email — except the friend also wrote the email. They need clear instructions on what to look for, or they'll just skim it and say "looks great."

Copy that review prompt. Save it somewhere handy. Use it every single time before you accept a fix.

## Real Example: How I Asked AI to Fix Its Own Code in a Live Project

Let me walk you through something that happened while I was building Herald, a tool that sends daily email digests.

I asked Claude to create a function that pulls blog posts and formats them into an email. The code looked great. Then I ran it and got this error:

`TypeError: Cannot read properties of undefined (reading 'map')`

**Round 1 — the wrong way.** I pasted just the error back into Claude. It rewrote the whole function. New error.

**Round 2 — the framework.** I tried my structured approach:

*"Here's the original prompt I gave you: [pasted it]. Here's the code you wrote: [pasted the function]. Here's the error I'm getting: [pasted the full error]. The email should display a list of three blog posts, but instead it crashes on load. Fix only the part that's broken and explain what you changed."*

Claude spotted it immediately. The API response wrapped posts inside a `data` object. The code was trying to map over the whole response instead of `response.data`. A one-line fix.

**Round 3 — the review.** I asked Claude to act as a code reviewer and check its own fix. It flagged that I should add a fallback in case `data` comes back empty. Smart catch.

Total time: 8 minutes. Without the framework, I'd been stuck in the error loop for an hour — I know because that used to be me.

Learning how to ask AI to fix its own code turned a frustrating morning into a quick win. The fix wasn't complicated. The *asking* was the hard part.

## Conclusion

Learning how to ask AI to fix its own code is a skill. Not a talent. Not something you need a computer science degree for. It's a skill — and you can pick it up in an afternoon.

Here's what it comes down to. Give AI the full picture. Be specific about what broke. Tell it what you expected. Constrain it so it doesn't break other things while fixing one thing. And if the conversation goes sideways, start fresh.

That's it. That's the framework.

The loop of broken code — where every fix creates a new error — stops when your prompts get sharper. You don't need to understand the code. You just need to guide the conversation.

If you want to go deeper, check out the [complete guide to debugging AI-generated code](https://derekjensen.io/blog/debugging-ai-generated-code-the-complete-guide-2025). It covers everything from reading error messages to knowing when a project needs a different approach entirely.

You're closer than you think. The next time something breaks, don't panic. Pull up your prompt framework, give AI what it needs, and watch it actually solve the problem. You've got this.

## FAQ

### Can AI modify its own code?

Yes, but not on its own. AI modifies code when you tell it to. It doesn't "see" errors by itself — you have to show it what broke and ask it to fix the specific problem. The quality of the fix depends almost entirely on how you ask. That's why learning how to ask AI to fix its own code is such a valuable skill. A clear, structured prompt gets you a working fix. A vague one gets you more broken code.

### What is the 30% rule in AI?

The 30% rule suggests that AI-generated code needs about 30% human oversight and editing before it's ready to use. For non-technical builders, this means you should expect to review, test, and iterate on what AI gives you. Don't just accept the first output and hope for the best. Think of AI as a fast first draft — you're still the editor. If you're curious about the common mistakes that eat up that editing time, check out [beginner mistakes when using AI to code and how to fix them](https://derekjensen.io/blog/beginner-mistakes-using-ai-to-code-and-how-to-fix-them).

### Is there an AI that can code itself?

In 2026, several AI tools can generate and revise code in back-and-forth conversations — tools like Claude, ChatGPT, and Cursor. But none of them truly "code themselves." They respond to your instructions. The better your instructions, the closer the result gets to working on the first try. You're always the one driving. To explore what's actually possible (and what isn't) with today's AI tools, see [what AI can and cannot build today](https://derekjensen.io/blog/what-ai-can-and-cannot-build-today-guide).