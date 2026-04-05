# CLAUDE.md — Menu Engineer Project Briefing

> Read this first. Last updated: April 2026.

## What This Project Is
Menu Engineer is a solo 48-hour hackathon build. Independent restaurant owners paste their menu with rough food cost estimates and get back a Stars / Puzzles / Plowhorses / Dogs analysis in 60 seconds — no sign-up, no POS, no consultant.

Output: visual matrix, price adjustment map, plain-English actions per item, downloadable PDF.

Research complete. Build not started. Next step: Solution Design (doc 02).

## Owner
- GitHub: Wei-power3 | Name: Weiche Lin
- Limited technical background. Needs code explained, not assumed.
- Devices: Windows laptop (no admin rights), iPad (primary), iPhone
- Browser-only workflow — no terminal, no local installs

## Confirmed Stack
- Frontend: React
- Deployment: Vercel (auto-deploys on push to main)
- AI engine: Claude API, model claude-sonnet-4-6
- API key: stored in Vercel environment variables, never in code
- Repo: Wei-power3/menu-engineer

## Agent Workflow
- Claude (this Project) = PM + architect + coder + committer
- Claude Artifacts = code sandbox (test in chat, approve, then commit)
- Perplexity = fact-check only, on demand
- ChatGPT/Gemini excluded to avoid context fragmentation

## Markets
- Primary v1: US — 412K independent restaurants, 9.5K closed in 2025, ~5% margin
- Secondary v1 toggle: UK — DMCCA 2024 forces service charges into displayed prices from April 2025, CMA fines up to 10% global turnover
- Germany: dropped for v1

## Monetisation
Free to use, no sign-up. Pay-per-report to save/download. Goal: $100/month.

## Key Decisions
- React + Vercel: fancier output, zero manual deployment steps
- Claude API: owner's primary tool
- Owner-provided food cost % (no live ingredient API)
- No POS integration in v1
- US primary, UK day-2 toggle

## Repo Structure
menu-engineer/
├── CLAUDE.md
├── README.md
└── docs/
    ├── 00-meta.md ✅
    ├── 01-problem-research.md ✅
    ├── 02-solution-design.md 🔄 next
    └── 03-build-plan.md ⏳ pending

## Next Session
1. Write docs/02-solution-design.md
2. Write docs/03-build-plan.md
3. Set up Vercel connected to this repo
4. Start building the React app

## Definition of Done
- Tool live at a public Vercel URL
- At least 1 real user has used it
- At least 1 post in a hospitality community
- Works on mobile browser (iPad/iPhone)
