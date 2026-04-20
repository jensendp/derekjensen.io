---
title: "How to Track AI Costs: Token Counting Guide for Beginners"
description: "Learn what tokens are, why they affect your AI budget, and how to use token-counting tools to control costs before your AI side project becomes a money pit."
pubDate: 2026-04-20
tags: ["AI costs","token counting","Claude token counter","building with AI on a budget"]
author: "Derek Jensen"
draft: false
heroImage: "https://images.unsplash.com/photo-1634586720876-a7c6cb7cedfd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MjQ4MjF8MHwxfHNlYXJjaHwxfHxIb3clMjB0byUyMFRyYWNrJTIwQUklMjBDb3N0cyUzQSUyMFRva2VuJTIwQ291bnRpbmclMjBHdWlkZSUyMGZvciUyMEJlZ2lubmVyc3xlbnwwfDB8fHwxNzc2NjkzNzY2fDA&ixlib=rb-4.1.0&q=80&w=1080"
---

You had a great idea for an AI-powered tool. You started building. Then you checked your bill — and your stomach dropped. This happens more often than you'd think, and it's almost never because someone did something wrong. It's because no one explained how AI pricing actually works. The secret? It all comes down to tiny units called tokens. In this guide, we'll break down what tokens are in plain language, show you exactly how to track AI costs before and during your build, and walk you through free tools — like Claude's updated token counter — so you can stay in control of your budget from day one.

## What Are Tokens (And Why Should You Care About Them)?

Think of tokens as tiny word pieces. When you send a message to an AI, it doesn't read whole sentences the way you do. It breaks everything down into small chunks — usually a few characters each. Some short words like "the" or "cat" are one token. Longer words get split up. "Unbelievable" might become three or four tokens.

Here's a quick example. The sentence:

**"I want to build an app"** → roughly 6 tokens

Each word here is common enough to be its own token. But a sentence with bigger or unusual words would use more tokens — even if it's the same length.

So why do AI companies charge by the token instead of by the message? Because not all messages are equal. A two-word question costs them way less computing power than a 500-word essay. Tokens let them charge based on actual usage, kind of like how your electric bill is based on kilowatt-hours — not just "you turned on the lights."

This is exactly why learning to track AI costs starts with understanding tokens. They're the basic unit on your bill. Once you see how they work, everything about AI pricing starts to make sense. And you can make smarter choices about every prompt you write. If you're just getting started with AI building in general, my [beginner's guide for non-engineers](https://derekjensen.io/blog/how-to-build-with-ai-a-beginners-guide-for-non-engineers) covers the foundations.

## Why Tokens Are the Hidden Driver of Your AI Budget

Here's something that surprises most people: you pay tokens twice in every AI interaction. Once for what you *send* (input tokens), and again for what the AI *writes back* (output tokens). And output tokens usually cost 3 to 5 times more than input tokens. That matters a lot.

Let's do some quick math. Say you build a simple chatbot. A user asks a question (about 50 tokens). Your system prompt — the behind-the-scenes instructions telling the AI how to behave — adds another 200 tokens. The AI responds with a couple of paragraphs (around 300 tokens). That's 550 tokens for one exchange. Depending on the model, that might cost a fraction of a cent. Sounds tiny, right?

Now here's where it gets sneaky.

Most AI tools resend the *entire conversation history* with every new message. So by the fifth message in a chat, you're not sending 50 tokens of input — you're sending all five previous messages plus your system prompt. Every. Single. Time.

That's the compounding effect, and it's the number one reason people get blindsided by costs. If you want to track AI costs accurately, you can't just count one message. You have to count the full payload that gets sent behind the scenes.

> **⚠️ Warning:** The compounding effect of conversation history is the #1 budget killer for new builders. A 5-message chat doesn't cost 5x a single message — it can cost 15x or more, because the entire history gets resent each time. Always factor this in when estimating costs.

## How to Estimate Your AI Costs Before You Build a Thing

Here's a trick that will save you real money: do the math *before* you start building.

It's simpler than you think. Start with one question: **What does a single interaction look like?**

Let's say you're building a tool that summarizes customer emails. One email might be 400 tokens going in. The summary coming back might be 150 tokens. That's roughly 550 tokens per interaction.

Now multiply it out:

- **Per interaction:** 550 tokens
- **Per user per day:** Maybe 20 emails = 11,000 tokens
- **Per user per month:** About 330,000 tokens
- **10 users per month:** 3.3 million tokens

With those numbers, you can check any model's pricing page and get a real dollar estimate. For many models, 3.3 million tokens might cost just a few dollars — or it could cost much more depending on which model you pick.

**Here's a simple framework you can copy into a spreadsheet:**

| Item | Estimate |
|------|----------|
| Tokens per interaction (in + out) | ___ |
| Interactions per user per day | ___ |
| Number of users | ___ |
| Monthly total tokens | ___ |
| Cost per 1M tokens (from pricing page) | ___ |
| **Estimated monthly spend** | ___ |

This is how smart builders track AI costs before spending a dime. Five minutes with this spreadsheet beats a surprise bill every time.

## Claude's Token Counter: A Free Tool to Compare Model Costs

Anthropic built a free tool that takes the guesswork out of token math. It's called the Claude Token Counter, and you can find it right inside the Anthropic Console at [console.anthropic.com](https://console.anthropic.com).

Here's how it works. You paste your prompt — the actual text you plan to send to Claude — into the tool. It instantly tells you how many tokens that text contains. No code required. Just copy, paste, and read the number.

But the really useful part is the model comparison feature. Once you enter your prompt, the tool shows you estimated costs across different Claude models side by side. So you can see what that same prompt would cost using Claude Opus versus Sonnet versus Haiku.

Here's a quick comparison of how the same prompt might cost across different popular models to give you a sense of the range:

| Model | Input Cost (per 1M tokens) | Output Cost (per 1M tokens) | Best For |
|-------|---------------------------|----------------------------|----------|
| Claude 3.5 Haiku | ~$0.80 | ~$4.00 | Simple tasks, high volume |
| Claude 3.5 Sonnet | ~$3.00 | ~$15.00 | Balanced quality & cost |
| Claude 3 Opus | ~$15.00 | ~$75.00 | Complex reasoning tasks |
| GPT-4o | ~$2.50 | ~$10.00 | General purpose |
| GPT-4o Mini | ~$0.15 | ~$0.60 | Budget-friendly, simple tasks |

*Note: Pricing changes frequently. Always check the provider's current pricing page before committing.*

This is where it gets practical. Say you're building a simple Q&A tool. You paste in your system prompt plus a sample user question. The counter might show you that Haiku costs a fraction of what Opus does — and for your use case, Haiku's answers are perfectly fine.

That one comparison could save you real money every single month.

> **Tip:** Start with the cheapest model that gives acceptable results, then upgrade only if quality isn't good enough. Most builders are surprised by how capable the smaller, cheaper models are for everyday tasks. You can also [control how deeply the AI thinks through problems](https://derekjensen.io/blog/ai-reasoning-effort-explained-control-how-deep-ai-thinks) to further optimize costs.

This is the easiest way to track AI costs before you commit to a model. Try it with your actual prompts. Pick the model that gives you good-enough quality at the lowest price. You can always upgrade later if you need to.

## Five Practical Ways to Cut Your Token Usage Right Now

Here's the good news: you don't need to touch any code to spend less on AI. These five tricks work whether you're using Cursor, Replit, or just the API directly.

**1. Write shorter prompts.** Say what you need in fewer words. Instead of "I would really like you to please write me a short summary of this article," try "Summarize this article in 3 sentences." Same result, fewer tokens, lower cost.

Here's a before-and-after example to show the difference:

```
❌ EXPENSIVE PROMPT (68 tokens):
"Hello! I would really appreciate it if you could please take
a look at the following customer email and write me a nice,
concise summary of what the customer is asking about. Please
make sure to include the main issue and what they want us to
do about it. Thank you so much!"

✅ CHEAPER PROMPT (19 tokens):
"Summarize this customer email in 2-3 sentences. Include the
main issue and requested action."
```

Same result. Roughly 70% fewer tokens. And since this system prompt gets sent with *every single call*, those savings multiply fast.

**2. Trim your system prompts.** It's tempting to stuff every instruction into your system prompt — tone, format, examples, edge cases. But that "kitchen sink" prompt gets sent with *every single call*. Cut it to only what's essential. You'll notice the difference fast when you track AI costs. For more on writing effective prompts that don't waste tokens, check out [5 prompting mistakes that are costing you hours of build time](https://derekjensen.io/blog/be-smart-with-chatgpt-5-prompting-mistakes-that-are-costing-you-hours-of-build-time).

**3. Summarize conversation history.** Instead of sending the entire chat back to the model each time, summarize older messages into a short recap. This keeps context without ballooning your token count.

Here's a prompt template you can use to compress conversation history before sending it back to the AI:

```
CONVERSATION SUMMARY PROMPT:
---
Summarize the following conversation in under 100 words.
Keep: key decisions, user preferences, and unresolved questions.
Drop: greetings, small talk, and repeated information.

[Paste conversation here]
---

Then use the summary as context for the next message instead
of the full chat history. This can cut your input tokens by
50-80% in longer conversations.
```

**4. Use smaller models for simple tasks.** Not every job needs the most powerful model. Sorting a list? Reformatting text? A lighter model handles that just fine — at a fraction of the price.

**5. Ask for shorter responses.** Add "Be concise" or "Reply in under 100 words" to your prompt. The AI listens, and you pay for fewer output tokens — which are the expensive ones.

Start with even one of these today. Small changes add up quickly.

## How to Set Up Guardrails So You Never Get a Surprise Bill

Here's the good news: every major AI provider *wants* you to set spending limits. They make it easy.

Start with hard caps. In your Anthropic or OpenAI dashboard, look for "Usage" or "Billing" settings. You can set a maximum monthly spend — say, $20. Once you hit that number, the API stops working. No exceptions. No surprise charges. This is the single most important thing you can do to track AI costs safely.

Next, turn on usage alerts. Most providers let you set email notifications at custom thresholds. I recommend setting alerts at 50% and 80% of your budget. That gives you time to react before you hit your ceiling.

Now build a simple weekly habit. Every Monday, spend two minutes checking your usage dashboard. Look at how many tokens you used last week. Look at the dollar amount. Write it down somewhere — even a sticky note works. Patterns show up fast when you actually look.

> **Tip:** Set up your spending cap and alerts *before* you make your first API call — not after. It takes two minutes and protects you from day one. If you want to go a step further, you can even [build a simple notification system](https://derekjensen.io/blog/build-a-simple-notification-system-that-tells-you-when-your-ai-is-done-working) to stay on top of what your AI is doing.

Finally, here's a practical decision framework. If you're consistently hitting your cap and your tool is working well, that's a good sign — consider upgrading your plan. But if you're hitting your cap and the results feel *meh*, don't spend more. Go back and optimize your prompts first.

Guardrails aren't about restricting yourself. They're about building with confidence.

## What Changes as Your AI Project Grows

Here's something that catches a lot of builders off guard. Your AI costs don't grow in a straight line.

When it's just you testing your tool, the bill feels like nothing. Maybe a dollar or two. But when 10 people start using it, you don't just pay 10x more. You might pay 20x or 30x more — because each user brings conversation history, repeated system prompts, and longer sessions you didn't plan for.

The tipping points to watch for? Around 100 users, your monthly costs will tell you a clear story. If your bill is climbing fast, that's your signal to act. You might switch to a smaller, cheaper model for simple tasks (like answering FAQs) while keeping a powerful model for complex ones. You might batch multiple requests together instead of sending them one at a time. Or you might rewrite your prompts to be shorter and tighter.

The biggest mindset shift is this: AI costs are an ongoing line item, like rent or a software subscription. They don't stop after you build the thing.

Make it a habit to track AI costs monthly, just like you'd check any other recurring expense. That's how a fun side project stays sustainable instead of slowly eating your budget when you're not looking. And if you've got a project that stalled out partly due to cost concerns, here's how to [revive dead projects with AI](https://derekjensen.io/blog/revive-dead-projects-with-ai-step-by-step-guide) — this time with a smarter budget.

## Conclusion

Here's the big takeaway: tokens are how AI companies measure — and charge for — every interaction. They're not complicated. They're just small pieces of text. And once you understand them, you can track AI costs with confidence, no engineering degree required.

You don't need to memorize pricing tables or build complex dashboards. You just need a few simple habits. Start by opening the Claude Token Counter today. Paste in a prompt you've been using (or one you're planning to use). Look at the token count. Look at the cost estimate. That single step will teach you more about AI pricing than most blog posts ever could.

From there, estimate the costs for one simple use case. Maybe it's a chatbot that answers customer questions. Maybe it's a writing assistant for your newsletter. Run the numbers for a month of usage. Write them down.

That's it. That's the foundation.

The builders who keep their AI projects running long-term aren't the ones with the biggest budgets. They're the ones who check their numbers early, set spending limits, and make small adjustments along the way. Smart budgeting is what separates AI projects that thrive from the ones that quietly drain your bank account.

You've got this. Start counting today.

## FAQ

**How many tokens does a typical AI conversation use?**

A short back-and-forth — say a one-paragraph question and a two-paragraph answer — might use around 300 to 500 tokens total. But conversations with long system prompts or multi-turn history can easily hit thousands of tokens per exchange. That's why it's so important to track AI costs from the start. Those tokens add up fast, especially once real users start chatting with your tool.

**Is there a free way to count tokens before I spend money?**

Yes. Claude's Token Counter lets you paste in your prompt and see the exact token count for free. It now includes model comparisons so you can see estimated costs across different Claude models side by side. This is one of the easiest ways to get a feel for pricing before you commit a single dollar.

**What is a good monthly AI budget for a side project?**

Many solo builders start with $5 to $20 per month during testing and prototyping. The key is to estimate your per-interaction cost first, then multiply by expected usage. Set a hard spending cap with your provider so you never go over without knowing. You can always increase your budget later — but you can't un-spend money you weren't watching.