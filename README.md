# AI News Navigator

AI News Navigator is a modern, mobile-first news experience that curates the latest developments across AI research, policy, safety, and tooling. The app blends automated news ingestion, smart AI summaries, rich filtering, collections, and an in-app copilot to keep practitioners ahead of the curve.

## ✨ Feature highlights

- **Ranked AI news feed** – Deduplicated clusters from leading sources with freshness, authority, and engagement scoring.
- **Smart AI summaries** – Beginner/expert toggles with "Why it matters" bullets, optimized for mobile and desktop.
- **Powerful discovery controls** – Full-text search, topic chips, source filters, and time windows with skeleton loading and optimistic UI.
- **Collections & exports** – Save stories into custom collections, manage them locally, and export curated briefings.
- **AI Navigator copilot** – Context-aware chat assistant that cites sources, compares stories, and suggests next steps.
- **Accessible & responsive** – Keyboard-friendly, WCAG AA informed color contrast, and layouts tailored for phones, tablets, and large screens.

## 🧱 Architecture

```text
app/
├── api/             # Feed, chat, and save stubs (Next.js Route Handlers)
├── layout.tsx      # Root layout with providers (themes, React Query, contexts)
└── page.tsx        # Hydrated client experience
components/
├── chat/           # Chat panel + UX primitives
├── feed/           # News cards, skeletons, list renderer
├── home/           # Page-level layout, top bar, filters, collections drawer
├── providers.tsx   # Global provider composition
└── ui/             # Shared UI atoms (chips, etc.)
context/            # Summary + collection state (localStorage-backed)
data/articles.ts    # Mocked ingestion dataset with summaries + scoring
lib/                # Feed filtering, chat orchestration, type definitions
public/             # Static assets (placeholder for logos)
tests/              # Vitest unit/UI coverage for feed, chat, and cards
```

![Architecture Diagram](https://dummyimage.com/800x300/0f172a/ffffff&text=Client+(Next.js)+%E2%86%92+API+Routes+%E2%86%92+Mock+Data)

## 🧠 AI usage strategy

- **Summaries** – Pre-generated via structured prompts (beginner/expert) stored in `data/articles.ts`. The UI enforces 280-character targets and 3 "Why it matters" bullets.
- **Ranking** – Composite score blends freshness, engagement, and authority to surface timely, high-quality stories.
- **Chat** – `lib/chat.ts` simulates an AI assistant that grounds responses in available articles, always returning citations and recommended actions. Swap in a real LLM by replacing the generator.

## 🚀 Getting started

```bash
# Install dependencies
npm install

# Run the development server
npm run dev

# Visit the app
open http://localhost:3000
```

Environment configuration lives in `.env.example`. Copy it to `.env.local` and adjust as needed.

```bash
cp .env.example .env.local
```

## 🧪 Testing & quality

Critical flows are covered with Vitest:

```bash
# Run the test suite
npm test
```

Coverage includes:
- Feed ranking and filtering (load, search, freshness, policy sort)
- Chat grounding & citation responses
- News card summary toggling (AI summary UX)

## 🧰 Available scripts

| Command         | Description                                   |
|-----------------|-----------------------------------------------|
| `npm run dev`   | Launch Next.js in development mode             |
| `npm run build` | Production build                               |
| `npm run start` | Run the built application                      |
| `npm run lint`  | ESLint via `next lint`                         |
| `npm test`      | Vitest suite with jsdom environment            |

## 📦 Data ingestion stubs

The repository ships with a curated dataset (`data/articles.ts`) emulating a normalized ingestion pipeline. In production, replace this with a scheduled fetcher that:

1. Pulls RSS/Atom feeds and APIs from vetted AI sources.
2. Normalizes metadata (source, topics, tags, published time).
3. Clusters near-duplicate stories via hash fingerprints.
4. Scores each article by freshness, authority, and engagement metrics.
5. Persists into Postgres/Prisma plus Redis caching for the feed API.

## 🔐 Privacy & guardrails

- Client-only collections avoid storing PII; future integrations can connect to authenticated backends.
- Chat assistant enforces citation-first responses and exposes confidence levels; unsafe or speculative queries should funnel through stricter prompts when wired to a real model.
- Notification flags exist for future email/WhatsApp integrations (disabled by default).

## 📈 Success metrics to track next

- Largest Contentful Paint (LCP) under 2.5s on 4G (leverage Next.js Image, CDN caching).
- Feed interaction rate (search/filter usage, CTR).
- Summary expansion rate and mode preference (beginner vs expert).
- Copilot helpfulness (thumbs up/down) and follow-up actions (save, alert).

## 🛣️ Roadmap ideas

- Real ingestion + background jobs (Next.js API or dedicated worker).
- Topic timelines and glossary overlays.
- Scheduled AI digest emails with citation bundles.
- Alert delivery via email/SMS and webhook integrations.
- Observability hooks (structured logging, metrics dashboards).

Enjoy navigating the AI landscape! 🚀
