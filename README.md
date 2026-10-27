# Intelligent Expense Tracker 💰

An AI-powered personal finance app for tracking daily expenses with voice logging, receipt scanning, and intelligent spending insights.

## Tech Stack

| Layer | Technology |
|---|---|
| **Mobile** | React Native (Expo SDK 58) |
| **Language** | TypeScript |
| **Navigation** | Expo Router (file-based) |
| **Database** | Supabase (PostgreSQL) |
| **Auth** | Supabase Auth |
| **Storage** | Supabase Storage |
| **Backend** | Supabase Edge Functions (Deno/TypeScript) |
| **AI** | Google Gemini API |
| **State** | Zustand + TanStack Query |
| **Charts** | Victory Native |

## Features

- 📝 **Manual Expense Logging** — Quick-add with smart defaults
- 🎤 **Voice Logging** — Speak naturally, Gemini parses the expense
- 📸 **Receipt Scanner** — Snap a photo, fields auto-fill
- 🤖 **AI Insights** — Weekly/monthly natural language spending summaries
- 📊 **Visual Dashboard** — Donut charts, trend lines, category breakdowns
- 💰 **Budget Alerts** — Push notifications when approaching limits
- 🌐 **Offline First** — SQLite local cache, syncs when connected

## Project Structure

```
├── app/                  # Expo Router screens
│   ├── (auth)/           # Login, Signup
│   ├── (tabs)/           # Main tab navigator
│   └── modals/           # Add expense, voice log
├── components/           # Reusable UI components
├── lib/                  # Core business logic
│   ├── supabase/         # Supabase client & queries
│   ├── ai/               # Gemini integration
│   ├── validations/      # Zod schemas
│   └── utils/            # Helpers
├── hooks/                # Custom React hooks
├── stores/               # Zustand state stores
├── supabase/             # Edge Functions & DB migrations
│   ├── functions/        # Serverless functions
│   └── migrations/       # SQL migration files
└── types/                # Global TypeScript types
```

## Getting Started

### Prerequisites
- Node.js 18+
- pnpm
- Expo Go app (iOS/Android)

### Setup

1. **Clone the repo**
   ```bash
   git clone https://github.com/your-username/intelligent-expense-tracker.git
   cd intelligent-expense-tracker
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Fill in your Supabase and Gemini API keys
   ```

4. **Run the app**
   ```bash
   pnpm start       # Start Expo dev server
   pnpm ios         # Run on iOS simulator
   pnpm android     # Run on Android emulator
   ```

## Environment Variables

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key   # Server-side only (Edge Functions)
```

## Git Workflow

We follow **trunk-based development** with feature branches:

```
main          → production-ready code
develop       → integration branch
feature/*     → individual features
fix/*         → bug fixes
chore/*       → maintenance tasks
```

**Commit message format** (Conventional Commits):
```
feat: add voice expense logging
fix: correct category icon mapping
chore: update dependencies
docs: update README setup steps
refactor: extract AI parsing logic to service
```

## Contributing

1. Branch off `develop`: `git checkout -b feature/your-feature`
2. Make changes with focused, atomic commits
3. Push and open a PR → `develop`
4. Squash merge after review

## License

MIT
