export interface AiTool {
  name: string;
  description: string;
  verdict: string;
  url: string;
  category: 'building' | 'writing' | 'automating' | 'research';
  cost: 'free' | 'freemium' | 'paid';
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  scores: {
    easeOfUse: number;
    nonEngineerFriendly: number;
    capability: number;
    valueForMoney: number;
  };
  featured?: boolean;
}

export function overallScore(tool: AiTool): string {
  const s = tool.scores;
  const avg = (s.easeOfUse + s.nonEngineerFriendly + s.capability + s.valueForMoney) / 4;
  return avg.toFixed(1);
}

export const tools: AiTool[] = [
  // ── Building ────────────────────────────────────────────────
  {
    name: 'Lovable',
    description: 'Describe an app in plain English and get a working, deployable product.',
    verdict: 'The best starting point for non-engineers who want to ship a real product. Fast, polished output and native Supabase integration makes it genuinely production-ready.',
    url: 'https://lovable.dev',
    category: 'building',
    cost: 'freemium',
    skillLevel: 'beginner',
    scores: { easeOfUse: 5, nonEngineerFriendly: 5, capability: 4, valueForMoney: 4 },
    featured: true,
  },
  {
    name: 'Bolt',
    description: 'Build full-stack web apps from a single prompt, entirely in your browser.',
    verdict: 'A strong alternative to Lovable. Particularly good for React apps and gives you more direct access to the generated code when you want it.',
    url: 'https://bolt.new',
    category: 'building',
    cost: 'freemium',
    skillLevel: 'beginner',
    scores: { easeOfUse: 4, nonEngineerFriendly: 5, capability: 4, valueForMoney: 4 },
  },
  {
    name: 'Cursor',
    description: 'A code editor with AI built in — write and edit code by describing what you want.',
    verdict: 'The go-to tool once you\'re ready to level up. Steep for complete beginners but massively powerful — this is what I use every day for serious builds.',
    url: 'https://cursor.com',
    category: 'building',
    cost: 'freemium',
    skillLevel: 'intermediate',
    scores: { easeOfUse: 3, nonEngineerFriendly: 3, capability: 5, valueForMoney: 5 },
    featured: true,
  },
  {
    name: 'Replit',
    description: 'Build, run, and deploy apps in your browser with an AI agent that codes for you.',
    verdict: 'Great for beginners because there\'s zero setup. The agent mode can build surprisingly complete apps from a description — and you can share and deploy instantly.',
    url: 'https://replit.com',
    category: 'building',
    cost: 'freemium',
    skillLevel: 'beginner',
    scores: { easeOfUse: 4, nonEngineerFriendly: 4, capability: 3, valueForMoney: 4 },
  },
  {
    name: 'v0 by Vercel',
    description: 'Generate polished React UI components from a text description.',
    verdict: 'Best-in-class for generating clean interfaces fast. Not for full apps, but if you need a specific UI built quickly and correctly, nothing beats it.',
    url: 'https://v0.dev',
    category: 'building',
    cost: 'freemium',
    skillLevel: 'intermediate',
    scores: { easeOfUse: 3, nonEngineerFriendly: 3, capability: 4, valueForMoney: 4 },
  },
  {
    name: 'Google AI Studio',
    description: 'Free playground to experiment with Google\'s Gemini models via API.',
    verdict: 'Underrated free option. More technical than consumer tools but Google\'s models are genuinely competitive and the free access is hard to beat.',
    url: 'https://aistudio.google.com',
    category: 'building',
    cost: 'free',
    skillLevel: 'intermediate',
    scores: { easeOfUse: 3, nonEngineerFriendly: 2, capability: 5, valueForMoney: 5 },
  },

  // ── Writing ──────────────────────────────────────────────────
  {
    name: 'ChatGPT',
    description: 'The AI assistant that started it all — writing, planning, coding, and research.',
    verdict: 'Still the most accessible AI for beginners. The free tier is generous and the quality is excellent. If you haven\'t started anywhere else, start here.',
    url: 'https://chatgpt.com',
    category: 'writing',
    cost: 'freemium',
    skillLevel: 'beginner',
    scores: { easeOfUse: 5, nonEngineerFriendly: 5, capability: 4, valueForMoney: 4 },
    featured: true,
  },
  {
    name: 'Claude',
    description: 'Anthropic\'s AI assistant — exceptional at writing, reasoning, and longer documents.',
    verdict: 'My personal daily driver. Better than ChatGPT for nuanced writing and reasoning. The extended context window is a real advantage when working on longer projects.',
    url: 'https://claude.ai',
    category: 'writing',
    cost: 'freemium',
    skillLevel: 'beginner',
    scores: { easeOfUse: 5, nonEngineerFriendly: 5, capability: 5, valueForMoney: 4 },
    featured: true,
  },
  {
    name: 'Notion AI',
    description: 'AI built directly into Notion for drafting, editing, and summarizing your docs.',
    verdict: 'Convenient if you\'re already in Notion all day. The in-context experience is smooth, but writing quality doesn\'t match Claude. Worth it for the integration alone.',
    url: 'https://notion.so',
    category: 'writing',
    cost: 'paid',
    skillLevel: 'beginner',
    scores: { easeOfUse: 5, nonEngineerFriendly: 5, capability: 3, valueForMoney: 3 },
  },
  {
    name: 'Gemini',
    description: 'Google\'s AI assistant with deep integration into Google Workspace.',
    verdict: 'Best choice if you live in Docs, Sheets, and Gmail — the native integration is genuinely useful. As a standalone writing AI, Claude and ChatGPT are still stronger.',
    url: 'https://gemini.google.com',
    category: 'writing',
    cost: 'freemium',
    skillLevel: 'beginner',
    scores: { easeOfUse: 5, nonEngineerFriendly: 5, capability: 4, valueForMoney: 4 },
  },

  // ── Automating ───────────────────────────────────────────────
  {
    name: 'Make',
    description: 'Visual workflow builder that connects your apps and automates repetitive tasks.',
    verdict: 'The best balance of power and accessibility for non-engineers. If you\'re choosing between Make and Zapier, start here — more capability for less money.',
    url: 'https://make.com',
    category: 'automating',
    cost: 'freemium',
    skillLevel: 'beginner',
    scores: { easeOfUse: 4, nonEngineerFriendly: 4, capability: 4, valueForMoney: 5 },
    featured: true,
  },
  {
    name: 'Zapier',
    description: 'The original no-code automation tool — connects thousands of apps with no setup.',
    verdict: 'Great for simple automations but expensive once you scale. The free tier is limited and pricing jumps fast. Make gives you more for less if you\'re starting fresh.',
    url: 'https://zapier.com',
    category: 'automating',
    cost: 'paid',
    skillLevel: 'beginner',
    scores: { easeOfUse: 5, nonEngineerFriendly: 5, capability: 3, valueForMoney: 2 },
  },
  {
    name: 'n8n',
    description: 'Open-source workflow automation with full code access and self-hosting option.',
    verdict: 'The most powerful automation tool here — and what I use personally. More setup than Make, but self-hosting means no per-task fees and no ceiling on what you can build.',
    url: 'https://n8n.io',
    category: 'automating',
    cost: 'freemium',
    skillLevel: 'intermediate',
    scores: { easeOfUse: 3, nonEngineerFriendly: 2, capability: 5, valueForMoney: 5 },
  },
  {
    name: 'Relay',
    description: 'Human-in-the-loop workflow automation with AI steps built in.',
    verdict: 'Solid option for workflows where a human needs to approve or review steps. Cleaner UX than Make for mixed human-AI processes, and the free tier is generous.',
    url: 'https://relay.app',
    category: 'automating',
    cost: 'freemium',
    skillLevel: 'beginner',
    scores: { easeOfUse: 4, nonEngineerFriendly: 4, capability: 3, valueForMoney: 4 },
  },

  // ── Research ─────────────────────────────────────────────────
  {
    name: 'Perplexity',
    description: 'AI-powered search that gives cited, sourced answers instead of a list of links.',
    verdict: 'Replaced Google for most of my research. Cited sources make it trustworthy in a way ChatGPT isn\'t for factual lookups. The free tier covers most use cases.',
    url: 'https://perplexity.ai',
    category: 'research',
    cost: 'freemium',
    skillLevel: 'beginner',
    scores: { easeOfUse: 5, nonEngineerFriendly: 5, capability: 4, valueForMoney: 5 },
    featured: true,
  },
  {
    name: 'NotebookLM',
    description: 'Google\'s AI tool for uploading documents and asking questions across all of them.',
    verdict: 'Genuinely impressive and completely free. Upload PDFs, articles, or notes and get sourced answers from your own documents. One of the most underused AI tools out there.',
    url: 'https://notebooklm.google.com',
    category: 'research',
    cost: 'free',
    skillLevel: 'beginner',
    scores: { easeOfUse: 5, nonEngineerFriendly: 5, capability: 4, valueForMoney: 5 },
  },
];
