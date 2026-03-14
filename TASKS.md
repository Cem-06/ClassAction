# TASKS.md — Lawsy MVP Build Plan

## Project
**Name:** Lawsy  
**Tagline:** Class Action Lawsuit Finder  
**Platform:** Mobile app only  
**Primary market:** United States  
**MVP scope:** Public class action discovery + eligibility check + redirect to official claim site  
**Backend:** Supabase  
**Frontend:** React Native + Expo + Expo Router + TypeScript  
**State:** Zustand  
**Storage:** MMKV  
**Auth:** Supabase Auth (email/password, Google, Apple)  
**DB:** PostgreSQL via Supabase  
**Notifications:** Expo Notifications (post-MVP or late MVP, optional)  

---

## Product Decisions Locked In

- Users **cannot submit their own lawsuits**.
- Users **cannot create their own public cases**.
- App shows **publicly available, verified class action / settlement opportunities**.
- App helps users:
  - discover cases
  - understand likely eligibility
  - save cases
  - open the official claim page
- MVP is **USA only**.
- MVP categories:
  - Consumer Products
  - Data Privacy / Data Breach
  - E-Commerce / Subscriptions
  - Tech / Electronics
- Only **verified cases** are visible in production.
- Eligibility is **rule-based**, not AI-based.
- UI tone: **clean, modern, serious, trustworthy**.
- Legal positioning: **information and discovery tool only**.
- Strong disclaimer required across the app.
- Launch target: **20 verified cases**.
- Onboarding can be minimal in MVP.
- Monetization is important later, but **not required for core MVP build**.

---

## Important Product Constraints

### Legal / Risk Constraints
- Do **not** present the app as a law firm.
- Do **not** present case results as legal advice.
- Do **not** guarantee eligibility.
- Do **not** guarantee payouts.
- Always show official source link and official claim link when available.
- Every case detail page must show:
  - verification status
  - source
  - last verified date
  - disclaimer
- Eligibility result labels must remain conservative:
  - `likely_eligible`
  - `unlikely`
  - `unclear`

### Content Constraints
- Only admin-managed content enters the database.
- Only verified cases become public.
- No user-generated legal content in MVP.
- No document uploads in MVP.
- No receipt uploads in MVP.
- No direct claim filing through the app in MVP.

---

## Recommended Repo Structure

```text
lawsy/
├── app/
│   ├── (auth)/
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   └── welcome.tsx
│   ├── (tabs)/
│   │   ├── _layout.tsx
│   │   ├── index.tsx                # Discover / Home
│   │   ├── saved.tsx                # Saved cases
│   │   └── settings.tsx
│   ├── case/
│   │   └── [slug].tsx               # Case detail
│   ├── eligibility/
│   │   └── [caseId].tsx             # Eligibility flow
│   ├── legal/
│   │   ├── disclaimer.tsx
│   │   └── privacy.tsx
│   └── _layout.tsx
│
├── components/
│   ├── ui/
│   ├── cases/
│   │   ├── CaseCard.tsx
│   │   ├── CaseList.tsx
│   │   ├── CategoryPill.tsx
│   │   ├── DeadlineBadge.tsx
│   │   ├── VerificationBadge.tsx
│   │   └── EligibilityResultCard.tsx
│   ├── eligibility/
│   │   ├── QuestionStep.tsx
│   │   ├── AnswerOption.tsx
│   │   └── EligibilityProgress.tsx
│   └── legal/
│       └── DisclaimerBanner.tsx
│
├── lib/
│   ├── supabase.ts
│   ├── auth.ts
│   ├── storage.ts
│   ├── validations.ts
│   ├── eligibility-engine.ts
│   ├── case-formatters.ts
│   ├── deep-links.ts
│   └── constants.ts
│
├── stores/
│   ├── auth-store.ts
│   ├── cases-store.ts
│   ├── saved-store.ts
│   ├── eligibility-store.ts
│   └── settings-store.ts
│
├── hooks/
│   ├── useAuth.ts
│   ├── useCases.ts
│   ├── useSavedCases.ts
│   └── useEligibility.ts
│
├── types/
│   ├── auth.ts
│   ├── case.ts
│   ├── eligibility.ts
│   └── index.ts
│
├── constants/
│   ├── colors.ts
│   ├── categories.ts
│   ├── copy.ts
│   └── routes.ts
│
├── supabase/
│   ├── migrations/
│   ├── seed/
│   └── functions/
│
├── assets/
├── app.json
├── package.json
├── tsconfig.json
├── .env
├── .env.example
└── README.md
```

---

## Database Schema (MVP)

### `profiles`
```sql
id uuid primary key references auth.users(id)
email text unique
display_name text null
country text default 'US'
created_at timestamptz default now()
updated_at timestamptz default now()
```

### `cases`
```sql
id uuid primary key default gen_random_uuid()
slug text unique not null
title text not null
short_description text not null
long_description text not null
category text not null
jurisdiction text not null default 'US'
status text not null check (status in ('active','upcoming','closed','archived'))
official_source_url text not null
claim_url text null
deadline_at timestamptz null
purchase_start_at timestamptz null
purchase_end_at timestamptz null
estimated_payout_text text null
proof_required boolean default false
verification_status text not null check (verification_status in ('draft','verified','archived'))
last_verified_at timestamptz null
featured boolean default false
created_at timestamptz default now()
updated_at timestamptz default now()
```

### `case_sources`
```sql
id uuid primary key default gen_random_uuid()
case_id uuid not null references cases(id) on delete cascade
source_type text not null check (source_type in ('official','administrator','law_firm','court','news'))
source_title text not null
source_url text not null
last_checked_at timestamptz null
created_at timestamptz default now()
```

### `case_eligibility_rules`
```sql
id uuid primary key default gen_random_uuid()
case_id uuid not null references cases(id) on delete cascade
rule_type text not null check (rule_type in ('country','state','product','merchant','purchase_date','proof_required','custom'))
rule_operator text not null check (rule_operator in ('eq','neq','in','not_in','between','exists'))
rule_value jsonb not null
priority int default 0
created_at timestamptz default now()
```

### `case_questions`
```sql
id uuid primary key default gen_random_uuid()
case_id uuid not null references cases(id) on delete cascade
question_key text not null
question_text text not null
question_type text not null check (question_type in ('single_select','multi_select','date','boolean','text'))
options jsonb null
order_index int not null
required boolean default true
created_at timestamptz default now()
```

### `saved_cases`
```sql
id uuid primary key default gen_random_uuid()
user_id uuid not null references auth.users(id) on delete cascade
case_id uuid not null references cases(id) on delete cascade
created_at timestamptz default now()
unique(user_id, case_id)
```

### `eligibility_checks`
```sql
id uuid primary key default gen_random_uuid()
user_id uuid null references auth.users(id) on delete set null
case_id uuid not null references cases(id) on delete cascade
answers jsonb not null
result text not null check (result in ('likely_eligible','unlikely','unclear'))
created_at timestamptz default now()
```

### `admin_users`
```sql
id uuid primary key references auth.users(id)
role text not null check (role in ('admin','editor','reviewer'))
created_at timestamptz default now()
```

---

## RLS Rules (Target)

### Public Access
- Anyone can read cases where:
  - `verification_status = 'verified'`
  - `status IN ('active', 'upcoming', 'closed')`
- Anyone can read related `case_sources`, `case_questions`, and public rule metadata if needed.

### Authenticated User Access
- Users can read and modify only their own:
  - `saved_cases`
  - `eligibility_checks`
  - `profiles`

### Admin Access
- Admins/editors/reviewers can manage content tables.
- Public users cannot insert/update/delete content tables.

---

## MVP Feature List

### In Scope
- Email/password auth
- Google auth
- Apple auth
- Public case feed
- Category filters
- Case detail page
- Rule-based eligibility checker
- Saved cases
- Legal disclaimer screens
- Verified content only
- Deep link to official claim site
- Seed with 20 verified cases

### Optional Late-MVP
- Search bar
- Featured cases carousel
- Deadline countdown badges
- Reminder notifications

### Out of Scope for MVP
- Direct claim filing inside app
- Document uploads
- Receipt scanning
- User-submitted lawsuits
- Community features
- Germany / EU adaptation
- Payments / subscriptions
- Referral monetization implementation
- Advanced analytics

---

## Admin Panel Clarification

You said you were unsure what an admin panel is.

For this product, an **admin panel** is a small internal interface where **you** can:
- add a new case
- edit case details
- paste official links
- set deadlines
- define eligibility questions
- mark a case as verified
- archive expired cases

For MVP, this does **not** need to be a polished separate product.

Recommended MVP admin options:
1. **Fastest:** manage content directly in Supabase tables
2. **Better:** build a hidden internal Expo web/admin or Next.js admin later

**Decision for MVP:** start with **Supabase table management**, not a full custom admin panel.

---

# Execution Plan for Codex

Each phase below contains:
- Goal
- Tasks
- Suggested files
- Acceptance criteria
- Dependencies

---

## Phase 0 — Final Setup Decisions
**Goal:** lock product and implementation assumptions before coding.

### Tasks
- [ ] Confirm Expo + React Native + TypeScript
- [ ] Confirm Supabase project creation
- [ ] Confirm iOS + Android target for Expo
- [ ] Confirm legal copy placeholder is acceptable for MVP
- [ ] Confirm using Supabase dashboard instead of custom admin panel in MVP
- [ ] Confirm launch seed target is 20 cases

### Suggested files
- `README.md`
- `docs/decisions.md` (optional)

### Acceptance criteria
- All major product assumptions are written down
- No architecture ambiguity remains for MVP build

### Dependencies
- None

---

## Phase 1 — Project Bootstrap
**Goal:** create a working mobile app shell with navigation, typing, theming, and Supabase plumbing.

### Tasks
- [ ] Initialize Expo app with TypeScript
- [ ] Install Expo Router and set root layout
- [ ] Install and configure Zustand
- [ ] Install and configure MMKV
- [ ] Install Supabase JS client
- [ ] Install auth dependencies for Google and Apple sign-in
- [ ] Configure ESLint / Prettier if desired
- [ ] Create `.env.example`
- [ ] Set up route groups: auth, tabs, case, eligibility, legal
- [ ] Build base UI primitives: Button, Card, Text, Screen, Input
- [ ] Add color system for clean legal/trust style

### Suggested files
- `app/_layout.tsx`
- `app/(tabs)/_layout.tsx`
- `lib/supabase.ts`
- `lib/storage.ts`
- `constants/colors.ts`
- `components/ui/*`
- `.env.example`

### Acceptance criteria
- App boots locally without crashing
- Tab navigation works
- Supabase client initializes from env vars
- Theme tokens exist and are reusable

### Dependencies
- Phase 0

---

## Phase 2 — Auth Foundation
**Goal:** allow users to create accounts and log in.

### Tasks
- [ ] Configure Supabase Auth providers:
  - [ ] email/password
  - [ ] Google
  - [ ] Apple
- [ ] Create auth store
- [ ] Build login screen
- [ ] Build register screen
- [ ] Build session persistence
- [ ] Build auth guard / protected routes for saved content
- [ ] Create profile bootstrap on first sign-in
- [ ] Handle logout
- [ ] Handle auth loading state
- [ ] Handle common auth errors cleanly

### Suggested files
- `app/(auth)/login.tsx`
- `app/(auth)/register.tsx`
- `lib/auth.ts`
- `stores/auth-store.ts`
- `hooks/useAuth.ts`
- `types/auth.ts`

### Acceptance criteria
- User can sign up with email/password
- User can log in and remain signed in after app restart
- Protected screens require auth
- User profile row is created automatically

### Dependencies
- Phase 1

---

## Phase 3 — Database + Schema + RLS
**Goal:** create secure content and user-data foundation in Supabase.

### Tasks
- [ ] Create migration for `profiles`
- [ ] Create migration for `cases`
- [ ] Create migration for `case_sources`
- [ ] Create migration for `case_eligibility_rules`
- [ ] Create migration for `case_questions`
- [ ] Create migration for `saved_cases`
- [ ] Create migration for `eligibility_checks`
- [ ] Create migration for `admin_users`
- [ ] Create updated_at trigger if desired
- [ ] Implement RLS policies for each table
- [ ] Add indexes for slug, status, category, verification status, deadline
- [ ] Write seed SQL or JSON import plan for first 20 cases

### Suggested files
- `supabase/migrations/*.sql`
- `supabase/seed/cases.sql` or `supabase/seed/cases.json`

### Acceptance criteria
- Migrations run without errors
- Public case reads work only for verified content
- User data is isolated by RLS
- No public write access exists on content tables

### Dependencies
- Phase 1
- Phase 2

---

## Phase 4 — Type System + Data Layer
**Goal:** define all core app models and fetching utilities.

### Tasks
- [ ] Define TypeScript types for case domain
- [ ] Define types for eligibility questions and results
- [ ] Build case queries service
- [ ] Build saved case service
- [ ] Build eligibility check write service
- [ ] Build common data mapping helpers
- [ ] Normalize deadline formatting and status labels
- [ ] Add zod or equivalent validation if desired

### Suggested files
- `types/case.ts`
- `types/eligibility.ts`
- `lib/case-formatters.ts`
- `lib/validations.ts`
- `lib/constants.ts`
- `hooks/useCases.ts`

### Acceptance criteria
- Frontend can query typed case data
- No `any`-heavy case domain code
- Date and category labels are normalized consistently

### Dependencies
- Phase 3

---

## Phase 5 — Discover Feed
**Goal:** show the list of live cases in a clean and trustworthy way.

### Tasks
- [ ] Build home/discover screen
- [ ] Fetch verified cases from Supabase
- [ ] Add category filter pills
- [ ] Add status/deadline badges
- [ ] Add empty state
- [ ] Add loading skeleton state
- [ ] Add pull-to-refresh
- [ ] Add featured case section if time permits
- [ ] Ensure all cards clearly show:
  - title
  - short summary
  - category
  - deadline
  - proof required yes/no
  - verification badge

### Suggested files
- `app/(tabs)/index.tsx`
- `components/cases/CaseCard.tsx`
- `components/cases/CaseList.tsx`
- `components/cases/CategoryPill.tsx`
- `components/cases/DeadlineBadge.tsx`
- `components/cases/VerificationBadge.tsx`
- `stores/cases-store.ts`

### Acceptance criteria
- User can open app and browse verified cases
- Category filtering works
- Cards are readable and serious-looking
- Only verified cases are displayed

### Dependencies
- Phase 4

---

## Phase 6 — Case Detail Screen
**Goal:** give users full case context and safe next actions.

### Tasks
- [ ] Build case detail screen by slug or id
- [ ] Display long description
- [ ] Display category, jurisdiction, deadline, proof requirement
- [ ] Display purchase period if applicable
- [ ] Display estimated payout text if available
- [ ] Display official source section
- [ ] Display official claim button
- [ ] Display legal disclaimer banner
- [ ] Display “last verified” date
- [ ] Handle missing claim URL gracefully

### Suggested files
- `app/case/[slug].tsx`
- `components/legal/DisclaimerBanner.tsx`
- `lib/deep-links.ts`

### Acceptance criteria
- User can open any case from feed
- Detail page shows trust information clearly
- Claim CTA opens official site
- No page implies legal advice

### Dependencies
- Phase 5

---

## Phase 7 — Eligibility Engine
**Goal:** build a deterministic rule-based eligibility experience.

### Tasks
- [ ] Define question schema mapping to rule schema
- [ ] Build question stepper UI
- [ ] Support question types:
  - [ ] single select
  - [ ] multi select
  - [ ] date
  - [ ] boolean
- [ ] Implement eligibility evaluation function
- [ ] Result states:
  - [ ] likely_eligible
  - [ ] unlikely
  - [ ] unclear
- [ ] Save completed eligibility checks optionally
- [ ] Show conservative result copy
- [ ] Add CTA to official claim page after result
- [ ] Add disclaimer under result

### Suggested files
- `app/eligibility/[caseId].tsx`
- `components/eligibility/QuestionStep.tsx`
- `components/eligibility/AnswerOption.tsx`
- `components/eligibility/EligibilityProgress.tsx`
- `components/cases/EligibilityResultCard.tsx`
- `lib/eligibility-engine.ts`
- `stores/eligibility-store.ts`

### Acceptance criteria
- User can answer a short question flow
- Engine returns deterministic result based on rules
- Result never over-promises
- Flow works for seeded sample cases

### Dependencies
- Phase 6

---

## Phase 8 — Saved Cases
**Goal:** allow logged-in users to bookmark and revisit relevant opportunities.

### Tasks
- [ ] Create save/unsave action on case cards and case detail page
- [ ] Build saved cases screen
- [ ] Require auth for save action
- [ ] Show helpful unauthenticated prompt when save is tapped without login
- [ ] Display saved cases in date-sorted order
- [ ] Show empty state for no saved cases

### Suggested files
- `app/(tabs)/saved.tsx`
- `stores/saved-store.ts`
- `hooks/useSavedCases.ts`

### Acceptance criteria
- Logged-in user can save and unsave cases
- Saved cases persist correctly
- User sees only their own saved cases

### Dependencies
- Phase 2
- Phase 5

---

## Phase 9 — Settings + Legal Screens
**Goal:** make the app feel trustworthy and reduce product/legal risk.

### Tasks
- [ ] Build settings screen
- [ ] Add logout action
- [ ] Add legal/disclaimer screen
- [ ] Add privacy placeholder screen
- [ ] Add support/contact placeholder section
- [ ] Add clear “information only, not legal advice” copy
- [ ] Add “delete account” placeholder or actual implementation if feasible

### Suggested files
- `app/(tabs)/settings.tsx`
- `app/legal/disclaimer.tsx`
- `app/legal/privacy.tsx`
- `constants/copy.ts`

### Acceptance criteria
- User can access legal information easily
- App communicates limitations clearly
- Settings page is functional and not empty

### Dependencies
- Phase 2

---

## Phase 10 — Seed Data + Content Operations
**Goal:** prepare launch-ready verified content.

### Tasks
- [ ] Define content template for each case
- [ ] Collect 20 public USA cases from trusted sources
- [ ] Normalize titles and summaries
- [ ] Add source URLs
- [ ] Add claim URLs
- [ ] Add deadlines
- [ ] Add purchase windows where relevant
- [ ] Add proof_required flag
- [ ] Add eligibility questions for each case
- [ ] Mark only reviewed rows as verified
- [ ] Import into Supabase seed data

### Suggested files
- `supabase/seed/cases.json`
- `supabase/seed/import.sql`
- `docs/content-guidelines.md` (optional)

### Acceptance criteria
- Database contains 20 verified cases
- Every case has source + disclaimer-ready metadata
- At least 5 cases are fully testable through eligibility flow

### Dependencies
- Phase 3
- Phase 7

---

## Phase 11 — QA / Hardening
**Goal:** ensure the MVP is safe, stable, and presentable.

### Tasks
- [ ] Test auth flows on iOS and Android
- [ ] Test public browsing without auth
- [ ] Test save flow with auth
- [ ] Test deep links to official claim pages
- [ ] Test 3 eligibility outcomes
- [ ] Test expired / missing deadline cases
- [ ] Test no-network behavior gracefully
- [ ] Test RLS boundaries manually
- [ ] Review all copy for legal safety
- [ ] Remove any wording that sounds like legal advice

### Suggested files
- `docs/qa-checklist.md`
- `README.md`

### Acceptance criteria
- No blocking navigation errors
- No broken auth flow
- No public write holes in DB
- Copy is legally conservative

### Dependencies
- Phases 1–10

---

## Phase 12 — Launch Prep
**Goal:** make the MVP ready for private beta or soft launch.

### Tasks
- [ ] Add app icon and splash assets
- [ ] Finalize app name usage (`Lawsy`)
- [ ] Review App Store / Play Store copy for safety
- [ ] Add support email
- [ ] Add privacy policy URL placeholder
- [ ] Add final production env vars
- [ ] Build internal launch checklist

### Suggested files
- `app.json`
- `assets/*`
- `README.md`

### Acceptance criteria
- App can be built for release
- Launch messaging matches product constraints
- Beta-ready package exists

### Dependencies
- Phase 11

---

# Task Order for Codex (Shortest Path)

If you want Codex to build in the fastest possible order, use this sequence:

1. Bootstrap Expo app
2. Add navigation + UI primitives
3. Add Supabase client
4. Add auth
5. Add DB schema + RLS
6. Add case feed
7. Add case detail page
8. Add eligibility engine + flow
9. Add saved cases
10. Add settings + legal screens
11. Import 20 verified cases
12. QA and polish

---

# Suggested First Prompt for Codex

Use this when you start implementation:

```md
Build a mobile MVP for “Lawsy”, a React Native + Expo app for discovering verified US class action lawsuits and settlements.

Core requirements:
- Mobile only
- Expo Router
- TypeScript
- Supabase backend
- Auth with email/password, Google, Apple
- Public verified case feed
- Case detail pages
- Rule-based eligibility checker
- Saved cases for logged-in users
- Legal disclaimer screens
- Strong trust-oriented UI
- No direct claim filing in MVP
- No document uploads
- No user-submitted lawsuits

Please follow this TASKS.md file phase by phase, starting with Phase 1.
Prefer clean architecture, reusable components, strict typing, and conservative legal copy.
```

---

# Open Questions (Non-Blocking)

These do not block MVP coding, but should be decided during build:

- Exact color palette / brand identity
- App icon direction
- Whether reminders belong in MVP or post-MVP
- Whether search bar belongs in MVP or late MVP
- Whether onboarding is just 1–2 screens or skipped entirely at first
- Future monetization model:
  - affiliate / referral
  - subscription
  - promoted placements
  - premium alerts

---

# Notes for Future Versions

## Post-MVP Candidates
- Push deadline reminders
- Search and sort improvements
- Personalized recommendations
- Claim tracker (`saved / submitted / paid`)
- Referral monetization
- Better internal admin dashboard
- Germany / EU adaptation for collective redress / Abhilfe procedures
- Localized languages
- Receipts or proof upload system
- Direct filing integrations

---

# Why This Structure

This plan follows the same strengths as your original architecture template: a clear phase-by-phase roadmap, explicit project structure, Supabase-centered backend, and implementation broken down into small buildable chunks. The reusable folder structure, state separation, migration-based backend setup, and phased rollout approach all match the patterns in your uploaded reference plan. fileciteturn5file0 fileciteturn5file4
