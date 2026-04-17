---
title: "AI Reasoning Effort Explained: Control How Deep AI Thinks"
description: "Learn what AI reasoning effort is, why it changes your output quality, and how builders can control thinking depth in tools like Claude Opus and GPT models."
pubDate: 2026-04-17
tags: ["AI reasoning effort","Claude Opus","AI prompting tips","building with AI"]
author: "Derek Jensen"
draft: false
heroImage: "https://images.unsplash.com/photo-1526378722484-bd91ca387e72?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5MjQ4MjF8MHwxfHNlYXJjaHwxfHxBSSUyMFJlYXNvbmluZyUyMEVmZm9ydCUyMEV4cGxhaW5lZCUzQSUyMENvbnRyb2wlMjBIb3clMjBEZWVwJTIwQUklMjBUaGlua3N8ZW58MHwwfHx8MTc3NjQyOTM5Nnww&ixlib=rb-4.1.0&q=80&w=1080"
---

A few weeks ago, people on Reddit noticed something strange. Claude's Opus model — one of the most powerful AI tools available — seemed to suddenly get lazier. Answers were shorter. Reasoning felt thinner. The community quickly figured out the culprit: something had changed with the model's "reasoning effort." If you've never heard that term before, you're not alone. Most people building with AI have no idea that these models have an adjustable thinking dial — and that it dramatically changes the quality of what you get back. This post breaks down what AI reasoning effort actually is, why it matters so much when you're building tools and workflows, and how you can take control of it starting today.

## What Is AI Reasoning Effort? (The Simple Version)

Think of it this way. If someone asks you "what's 2 + 2," you don't sit down with a pencil and paper. You just answer. But if someone asks you to plan a weekly budget across three income sources, you slow down. You think it through. You check your work.

AI reasoning effort works the same way. It's the amount of thinking work a model does before it gives you an answer.

Here's the important part: this isn't just a metaphor. There are actual settings — real dials you can turn — that control how much internal processing the AI does on your request. When AI reasoning effort is set high, the model takes more time, works through problems step by step, and considers different angles before responding. When it's set low, the model fires off a quick answer and moves on.

You can picture it like a dimmer switch on a light. All the way up, the room is bright and you can see every detail. Turned down low, you get just enough light to find the door.

Why does this matter for you? Because the quality of what your AI builds, writes, and solves depends heavily on where that dial is set. And in many cases, you can control it.

## What Happened With Claude Opus — And Why Everyone Noticed

A few weeks ago, Reddit lit up with complaints. Users of Claude's Opus model — specifically version 4.6 — noticed something felt off. Answers that used to be detailed and thoughtful were coming back shorter. Thinner. Almost lazy.

People started comparing outputs side by side. The difference was real. The model wasn't broken — it just wasn't thinking as hard.

What happened? Anthropic (the company behind Claude) had apparently adjusted the AI reasoning effort settings behind the scenes. No announcement. No changelog. Just quieter thinking.

This is the part that matters if you're building anything with AI: **model providers can change how hard your AI thinks without telling you.**

Think about that for a second. You build a tool that works great on Monday. By Wednesday, the AI powering it is putting in less effort — and your tool starts giving worse results. You didn't change anything. They did.

This is exactly what happened to builders relying on Opus for complex tasks like code generation and multi-step analysis. Their workflows broke overnight, and they had no idea why until the community pieced it together.

> **Warning:** If your AI-powered tool suddenly starts producing worse results and you haven't changed anything, don't assume it's your fault. Model providers can quietly adjust reasoning effort settings at any time. Make a habit of testing your most important prompts weekly so you catch these silent changes before they break your workflows.

The lesson here is simple. If you're building with AI, you can't just set it and forget it. You need to understand AI reasoning effort — and you need to watch for when it shifts.

## How AI Reasoning Effort Actually Works Under the Hood

So what's actually happening inside the model when it "thinks harder"?

Here's the key idea. Before giving you a final answer, some AI models can essentially talk to themselves first. This is called chain-of-thought reasoning, and it's a lot like how you might scribble notes on scratch paper before writing your final answer on a test.

When AI reasoning effort is turned up, the model gets more room to do this internal scribbling. It can break a problem into pieces, consider different angles, catch its own mistakes, and build toward a stronger answer.

The amount of internal thinking a model is allowed to do is controlled by something called a **token budget**. Tokens are the basic units AI models read and write in — roughly a word or part of a word each. A higher token budget means the model can "think" longer before it has to respond. A lower budget means it has to cut its thinking short and just give you whatever it's got.

Here's why this matters practically: more thinking takes more computing power. And more computing power costs real money. That's exactly why providers sometimes quietly dial back AI reasoning effort — they're managing their costs.

So when Claude Opus suddenly felt lazier, it wasn't your imagination. The model likely had less room to think. Same brain, shorter leash.

## Not All AI Models Handle Reasoning Effort the Same Way

Here's something important to know: every major AI model handles thinking differently. And once you understand this, you'll make much better choices about which tool to use for which job.

**Claude** (from Anthropic) gives you pretty direct control. If you're using the API, you can set AI reasoning effort to "low," "medium," or "high." That's like choosing between a quick glance, a solid look, and a deep study. You pick the level that matches your task.

**OpenAI's o1 and o3 models** were literally built for deep reasoning. Thinking hard isn't a bonus feature — it's the whole point. These models spend extra time working through problems internally before they respond. They're great for logic-heavy tasks, but they're also slower and more expensive to run.

**GPT-4o and Gemini** take a different approach. They don't give you the same kind of explicit reasoning dial. Instead, they decide how much effort to put in based on your prompt. You can nudge them with the right instructions, but you're not setting a specific level. If you're new to shaping how AI responds to your instructions, [this guide to prompting mistakes](https://derekjensen.io/blog/be-smart-with-chatgpt-5-prompting-mistakes-that-are-costing-you-hours-of-build-time) is a great place to start.

| Feature | Claude (API) | OpenAI o1/o3 | GPT-4o | Gemini |
|---|---|---|---|---|
| **Direct reasoning control** | Yes — low / medium / high | Yes — reasoning_effort parameter | No | No |
| **Token budget for thinking** | Yes (`budget_tokens`) | Set internally by model | N/A | N/A |
| **Prompt-based nudging** | Works well | Works well | Primary method | Primary method |
| **Best for deep reasoning** | ✅ (on high) | ✅ (built for it) | Moderate | Moderate |
| **Cost at high effort** | Higher | Highest | Standard | Standard |
| **Speed at high effort** | Slower | Slowest | Standard | Standard |

The big takeaway? Some models let you directly adjust AI reasoning effort. Others make you influence it indirectly. Knowing which is which helps you pick the right tool — and avoid wondering why one model gives you a brilliant answer while another phones it in.

## When AI Reasoning Effort Matters Most (And When It Doesn't)

Here's a simple rule: match the thinking to the task.

Some jobs need your AI to really sit down and work through the problem. If you're building a multi-step workflow, writing complex code, analyzing a spreadsheet full of data, or asking the AI to make a judgment call with lots of factors — you want high AI reasoning effort. These are the moments where shallow thinking leads to broken tools and wrong answers.

But not everything needs deep thought. Asking the AI to reformat a list? Summarize a short paragraph? Fix a typo in your prompt? Convert Fahrenheit to Celsius? Low reasoning effort is totally fine. Cranking up the thinking dial for simple tasks just wastes time and money without improving the result.

Think of it like this. You wouldn't spend an hour carefully researching which brand of paper towels to buy. But you would spend that time researching which car to buy. The stakes and complexity tell you how much thinking the job deserves.

Before you send a prompt, ask yourself: "Is this a paper towel question or a car question?"

> **Tip:** A quick mental checklist before every prompt: Does this task have multiple steps? Could edge cases cause problems? Are there tradeoffs to weigh? If you answered "yes" to any of these, crank the reasoning effort up. If it's a straightforward, single-step task, keep it low and save your time and money.

That one habit will help you get better results from every AI tool you use — and stop overpaying for thinking you don't need.

## How to Control AI Reasoning Effort in Your Prompts and Settings

The good news? You don't have to just hope your AI decides to think hard. You can nudge it — or outright tell it — to go deeper.

**Start with your prompts.** These simple phrases can make a real difference:

- "Think step by step before answering."
- "Consider multiple approaches and pick the best one."
- "Explain your reasoning before giving me a final answer."

These aren't magic words. They work because they signal to the model that you expect a thorough response, not a quick guess. I use some version of these in almost every prompt when the task actually matters.

Here's a prompt template you can copy and customize for any complex task:

```
Role: You are a [specific role, e.g., "senior workflow designer"].

Task: [Describe what you need built or solved]

Instructions:
1. Think step by step before responding.
2. Consider at least 2 different approaches and briefly explain the tradeoffs.
3. Identify potential edge cases or failure points.
4. Then give me your recommended solution with clear reasoning.

Context: [Add any relevant details, constraints, or background]

Output format: [Describe how you want the answer structured]
```

**Next, look at API settings.** If you're using Claude through the API (which tools like Cursor and Replit can connect to), you can set AI reasoning effort directly. Claude offers a `budget_tokens` parameter inside its extended thinking feature. You give it a number — say 5,000 tokens for light thinking or 50,000 for deep analysis — and the model adjusts how much internal work it does. OpenAI's o-series models have a similar `reasoning_effort` parameter with simple options like "low," "medium," and "high."

Here's what setting reasoning effort looks like in actual API calls:

**Claude API (with extended thinking):**
```json
{
  "model": "claude-sonnet-4-20250514",
  "max_tokens": 16000,
  "thinking": {
    "type": "enabled",
    "budget_tokens": 10000
  },
  "messages": [
    {
      "role": "user",
      "content": "Design a pricing calculator that handles monthly and annual billing, team discounts, and proration for mid-cycle upgrades."
    }
  ]
}
```

**OpenAI API (o-series models):**
```json
{
  "model": "o3",
  "reasoning_effort": "high",
  "messages": [
    {
      "role": "user",
      "content": "Design a pricing calculator that handles monthly and annual billing, team discounts, and proration for mid-cycle upgrades."
    }
  ]
}
```

If you're working with Claude's desktop app and want to get the most from it even without direct API access, check out [this guide to getting the most out of Claude's desktop version](https://derekjensen.io/blog/getting-the-most-out-of-claude-s-desktop-version-b0zm).

**Finally, remember that your prompt structure matters too.** A vague one-liner invites a shallow answer. A detailed prompt with clear context, specific constraints, and a well-defined goal naturally pushes the model to work harder. You're essentially telling the AI, "This is a serious question — treat it like one." If you want to make sure your outputs come back in a consistent, usable format every time, [this post on formatting outputs with Claude](https://derekjensen.io/blog/formatting-outputs-consistently-with-claude-75hy) walks through exactly how to do that.

You control more than you think.

## Why This Matters for Anyone Building Tools With AI

Here's the thing most people miss. An AI response can *look* perfectly fine on the surface — but completely fall apart when you plug it into a real workflow or product.

Say you ask AI to write logic for a simple pricing calculator. With low reasoning effort, it might give you something that works for the obvious cases. But it skips the edge cases. It doesn't think about what happens when a user enters zero, or picks a weird combination of options. You ship it, and things break.

That's the difference AI reasoning effort makes in practice. It's not about getting fancier words. It's about getting answers that actually hold up under pressure.

This is genuinely a builder's superpower. Most people using AI accept whatever comes back on the first try. They don't realize they can push the model to think harder — or that they should. Once you understand this one concept, you'll start getting dramatically better results from every tool you build. If you're just getting started on this journey, [this beginner's guide to building with AI](https://derekjensen.io/blog/how-to-build-with-ai-a-beginners-guide-for-non-engineers) covers the foundational concepts you'll need.

> **Tip:** Here's a quick test you can run right now. Take your most important prompt — the one powering a real tool or workflow — and add this line to the end: *"Before answering, think through at least 3 ways this could fail and address each one."* Compare the old output to the new one. That gap is the reasoning effort difference in action.

Here's what I'd encourage you to do today. Take a prompt you've used recently — something real, not a toy example. Run it with a quick, casual ask. Then run it again using the techniques from the previous section. Compare the two outputs carefully.

You'll see the gap immediately. And once you see it, you can't unsee it.

## Conclusion

AI reasoning effort is one of the most important levers you have when building with AI. It's also one of the most overlooked. Now you know it exists — and that puts you ahead of most people.

Here's what I want you to take away from this. You don't need to be an engineer to understand this stuff. You don't need to read research papers or write code. You just need to pay attention. When your AI gives you a shallow answer, that's not random. Something is driving that behavior. And now you know what it is.

So start noticing. When does your AI feel lazy? When does it feel sharp? Is it giving you a quick surface-level response when you need deep thinking? Try the prompting techniques we covered. Experiment with different reasoning effort settings if you're using the API. Test the same prompt at different levels and compare what you get back.

The people who build the best tools with AI aren't the ones with the fanciest tech skills. They're the ones who understand how to get the most out of the model sitting in front of them. AI reasoning effort is a big part of that.

Now go test it. You'll see the difference immediately.

## FAQ

### Can I control AI reasoning effort if I'm just using ChatGPT or Claude through the regular chat interface?

Sort of. The direct settings — where you pick "low," "medium," or "high" — are mostly available through the API. If you're just using the regular chat window, you won't find a thinking dial to turn up. But here's the good news: your prompts still matter a lot. Asking the AI to "think step by step" or "consider a few different approaches before answering" genuinely pushes the model to do more thinking work. You can't set an exact level, but you can nudge it in the right direction.

### Does higher AI reasoning effort always mean better answers?

Nope. More thinking isn't always better. If you ask the AI to reformat a list or summarize a short paragraph, cranking up the AI reasoning effort can actually slow things down and overcomplicate what should be a simple response. It also costs more to run — more thinking means more compute, which means higher bills if you're using the API. Match the effort to the task. Save the deep thinking for problems that actually need it.

### How do I know if a model's reasoning effort has been changed or reduced?

Watch for the signs. If your AI suddenly gives shorter answers, skips steps in its logic, or feels less thoughtful than usual — and you haven't changed anything on your end — something may have shifted behind the scenes. This is exactly what happened with the Claude Opus situation. Your best move is to follow community forums like Reddit, check provider changelogs, and test your important prompts regularly so you catch changes before they break your workflows.