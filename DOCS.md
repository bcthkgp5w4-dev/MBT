# MBT – Mind, Behavior & Therapy
## Complete Platform Documentation
<!-- Last updated: 2026-06-29 -->

### Overview
MBT is a production-ready AI-powered autism support SaaS platform built with Next.js 15, Supabase, and OpenAI.

---

## Quick Start

1. Clone the repository
2. Copy `.env.local.example` to `.env.local` and fill in all values
3. Run `npm install`
4. Set up Supabase project and run the migration in `supabase/migrations/001_initial_schema.sql`
5. Run `npm run dev`

---

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=         # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=    # Supabase anon key
SUPABASE_SERVICE_ROLE_KEY=        # Supabase service role key (server-only)
OPENAI_API_KEY=                   # OpenAI API key (GPT-4o)
ANTHROPIC_API_KEY=                # Anthropic API key (Claude)
STRIPE_SECRET_KEY=                # Stripe secret key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY= # Stripe publishable key
STRIPE_WEBHOOK_SECRET=            # Stripe webhook signing secret
STRIPE_BASIC_PRICE_ID=            # Stripe Price ID for Basic plan
STRIPE_PRO_PRICE_ID=              # Stripe Price ID for Pro plan
STRIPE_CLINIC_PRICE_ID=           # Stripe Price ID for Clinic plan
NEXT_PUBLIC_POSTHOG_KEY=          # PostHog analytics key
NEXT_PUBLIC_APP_URL=              # Application URL
```

---

## Architecture

### Tech Stack
- **Frontend**: Next.js 15 App Router, React 19, TypeScript
- **Styling**: Tailwind CSS v4, shadcn/ui components
- **Backend**: Next.js API Routes (serverless)
- **Database**: PostgreSQL via Supabase
- **Auth**: Supabase Auth (email + Google OAuth)
- **Storage**: Supabase Storage
- **AI**: OpenAI GPT-4o (primary), Anthropic Claude (optional)
- **Payments**: Stripe
- **Analytics**: PostHog
- **Hosting**: Vercel (recommended)

### Directory Structure
```
src/
├── app/
│   ├── (auth)/          # Login, register, password reset
│   ├── (dashboard)/     # All authenticated app pages
│   ├── (public)/        # Marketing pages
│   └── api/             # API routes
├── components/
│   ├── layout/          # Sidebar, header
│   ├── ui/              # shadcn/ui components
│   └── [feature]/       # Feature-specific components
├── lib/
│   ├── supabase/        # Client, server, middleware
│   ├── ai/              # AI prompts and OpenAI client
│   ├── constants/       # App constants
│   └── utils.ts         # Utility functions
└── types/               # TypeScript type definitions
```

---

## Modules

| Module | Route | Description |
|--------|-------|-------------|
| Dashboard | `/dashboard` | Overview and quick actions |
| Children | `/children` | Child profile management |
| Screening | `/screening` | M-CHAT-R and other screenings |
| Goals | `/goals` | AI-generated SMART goals |
| Therapy | `/therapy` | Daily therapy planning |
| AI Coach | `/coach` | GPT-4o powered coaching |
| Journal | `/journal` | Daily journaling with AI analysis |
| Behavior | `/behavior` | ABC behavior tracking |
| Progress | `/progress` | Progress dashboards and charts |
| Roadmap | `/roadmap` | Developmental milestone roadmap |
| Diet | `/diet` | Nutrition tracking |
| Sleep | `/sleep` | Sleep monitoring |
| Training | `/training` | Parent Training Academy |
| Knowledge | `/knowledge` | Evidence-based articles |
| Marketplace | `/marketplace` | Find therapists |
| Passport | `/passport` | Digital Autism Passport (printable) |
| Admin | `/admin` | Platform management (admin only) |
| Settings | `/settings` | Account and preferences |

---

## Database Schema

Key tables:
- `profiles` — User accounts with roles and subscription info
- `children` — Child profiles with developmental data
- `screening_results` — Screening assessments with AI interpretation
- `goals` — Therapy goals with SMART criteria
- `therapy_activities` — 1000+ structured therapy activities
- `daily_plans` — AI-generated daily therapy plans
- `journal_entries` — Parent journal with AI analysis
- `behavior_entries` — ABC behavior records
- `progress_data` — Goal progress tracking
- `diet_entries` — Nutrition tracking
- `sleep_entries` — Sleep monitoring
- `training_courses` — Parent education courses
- `knowledge_articles` — Content management
- `therapist_profiles` — Professional marketplace
- `coach_sessions` — AI coach conversation history
- `audit_logs` — Security audit trail

All tables have Row Level Security (RLS) enabled.

---

## Security

- Row Level Security on all user data tables
- GDPR-compliant data handling
- COPPA considerations for child data
- Encrypted data transmission (HTTPS)
- Supabase Auth with JWT tokens
- Server-side session validation
- Audit logging for sensitive actions
- No client-side exposure of service role key

---

## AI Integration

### AI Coach (Module 9)
- Streaming GPT-4o responses
- Context-aware with child profile
- Conversation history (last 8 messages)
- Safe messaging around diagnosis

### Goal Generation (Module 6)
- GPT-4o generates SMART goals
- Personalized to child's profile
- Domain-specific (7 domains)
- Saved directly to database

### Journal Analysis (Module 10)
- Async background analysis
- Pattern detection across entries
- Recommendations based on trends

### Behavior Analysis (Module 11)
- ABC pattern analysis
- Behavioral function identification
- Evidence-based interventions

### Therapy Plan Generation (Module 7)
- Daily plans based on child profile + goals
- Activity scheduling
- AI-generated activity instructions

### Developmental Snapshot (Module 4)
- Comprehensive AI-generated summary
- Used in Digital Autism Passport
- Based on assessments + profile

---

## Deployment (Vercel)

1. Connect GitHub repository to Vercel
2. Set all environment variables in Vercel dashboard
3. Configure Supabase Auth redirect URLs
4. Set up Stripe webhook endpoint: `https://your-domain.com/api/stripe/webhook`
5. Deploy

### Supabase Setup
1. Create new Supabase project
2. Run `supabase/migrations/001_initial_schema.sql` in SQL editor
3. Enable Google OAuth in Authentication settings
4. Add your domain to allowed redirect URLs

---

## Clinical Disclaimer

MBT is not a substitute for professional diagnosis, treatment, or medical advice.

- The platform screens and identifies risk indicators only
- All AI recommendations are educational, not clinical
- The platform never claims to diagnose autism
- Professional evaluation is always recommended
- Evidence-based practices (ABA, ESDM, PECS) are referenced

---

## Subscription Tiers

| Tier | Price | Children | AI Coach | Features |
|------|-------|----------|----------|----------|
| Free | $0 | 1 | 5 msg/mo | Basic |
| Basic | $19/mo | 2 | 50 msg/mo | + Goals, Progress |
| Pro | $49/mo | Unlimited | Unlimited | All features |
| Clinic | $199/mo | Unlimited | Unlimited | + Multi-therapist |

---

## 12-Month Roadmap

**Q1**: Core platform (current)
**Q2**: Mobile app (React Native), offline support, video activities
**Q3**: Therapist portal, school integration, telehealth booking
**Q4**: Advanced analytics, AI improvements, insurance integrations

---

*Built with ❤️ for autism families everywhere*