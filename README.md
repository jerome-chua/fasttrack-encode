# FastTrack

A Telegram bot for fasting and nutrition tracking, built with Next.js and Supabase.

## Prerequisites

- Node.js 18+
- [Supabase CLI](https://supabase.com/docs/guides/cli)
- A Telegram Bot Token (from [@BotFather](https://t.me/botfather))

## Environment Variables

Create a `.env.local` and fill in:

```bash
# Supabase (from Supabase Dashboard → Project Settings → API)
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your-supabase-publishable-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Telegram (from @BotFather)
TELEGRAM_BOT_TOKEN=your-telegram-bot-token
NEXT_PUBLIC_TELEGRAM_BOT_NAME=YourBotName  # without @

# Google AI
GEMINI_API_KEY=your-gemini-key
```

| Variable | Description | Where to find |
|----------|-------------|---------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Supabase → Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` | Public/anon key (safe for client) | Supabase → Settings → API → `anon` `public` |
| `SUPABASE_SERVICE_ROLE_KEY` | Secret key (server-side only) | Supabase → Settings → API → `service_role` |
| `TELEGRAM_BOT_TOKEN` | Bot authentication token | @BotFather → /mybots → API Token |
| `NEXT_PUBLIC_TELEGRAM_BOT_NAME` | Bot username for login widget | Your bot's username (without @) |
| `GEMINI_API_KEY` | Google AI API key | Google AI Studio |

## Database Setup

### Option 1: Remote Supabase (Recommended for production)

```bash
# Link to existing project (find ref in Supabase → Settings → General)
supabase link --project-ref <your-project-ref>

# Push migrations to remote database
supabase db push
```

### Option 2: Local Supabase (For development)

```bash
# Start local Supabase (requires Docker)
supabase start

# Apply migrations to local database
supabase db reset
```

### Supabase CLI Commands Reference

```bash
# Check Supabase CLI version
supabase --version

# Login to Supabase
supabase login

# Link project (required before push)
supabase link --project-ref <project-ref>

# Push migrations to remote
supabase db push

# Reset local database (reruns all migrations)
supabase db reset

# Create a new migration
supabase migration new <migration-name>

# Check migration status
supabase migration list

# Pull remote schema changes
supabase db pull

# Generate TypeScript types from schema
supabase gen types typescript --linked > lib/database.types.ts
```

## Running the App

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the web app.

## Database Schema

| Table | Description |
|-------|-------------|
| `users` | User profiles and onboarding state |
| `weight_logs` | Daily weight tracking |
| `fasting_periods` | Fasting start/end times |
| `food_logs` | Meals with nutrition data |
| `daily_summaries` | AI-generated daily insights |
| `sessions` | Web authentication sessions (Telegram Login) |

Migrations are in `supabase/migrations/`.

## Telegram Bot Setup

1. Create a bot with [@BotFather](https://t.me/BotFather)
2. Get the bot token and add to `.env.local`
3. For Telegram Login Widget, set your domain:
   ```
   /setdomain
   ```
   Then enter your domain (e.g., `localhost` for dev or `your-app.vercel.app` for production)
