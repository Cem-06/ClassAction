# Class Action Lawsuit App — Architekturplan

Version: MVP v1  
Status: Ready for Codex / Build Start  
Sprache: Deutsch  

---

## 1. Ziel der App

Die App soll Nutzer:innen dabei helfen, **aktive Class Actions / Settlements** zu finden, schnell zu prüfen, ob sie **potenziell anspruchsberechtigt** sind, relevante Fristen im Blick zu behalten und sich zur **offiziellen Claim-Seite** weiterleiten zu lassen.

### Kernnutzen

- aktive Fälle entdecken
- Eligibility grob vorprüfen
- Deadlines nicht verpassen
- interessante Fälle speichern
- eigenen Claim-Status tracken

### Wichtiger Produktgrundsatz

Die App gibt **keine Rechtsberatung**. Sie ist ein **Discovery-, Qualification- und Tracking-Tool**.

Die Sprache in der App muss deshalb bewusst vorsichtig sein:

- „potenziell berechtigt“
- „wahrscheinlich relevant“
- „bitte finale Voraussetzungen auf der offiziellen Settlement-Seite prüfen“
- „keine rechtliche Beratung“

---

## 2. Produktpositionierung

### Fokus für v1

Die erste Version soll **kein vollständiges Filing-Produkt** sein, sondern:

1. Fälle anzeigen
2. Eligibility strukturiert vorprüfen
3. Nutzer zur offiziellen Claim-Seite weiterleiten
4. Deadlines und Claim-Status tracken

### Warum diese Entscheidung?

- deutlich weniger rechtliches Risiko
- weniger sensible personenbezogene Daten
- schnellerer MVP
- geringere technische Komplexität
- höhere Datenqualität im Verhältnis zum Build-Aufwand

### Jurisdiktion für MVP

**Empfehlung: USA first**

Begründung:

- klarer Markt für Class Actions / Settlements
- standardisierte Claim-Flows
- viele öffentliche Settlement-Seiten
- klar verständliche Deadlines und Anspruchslogik

### Kategorien für MVP

Die App startet nur mit wenigen Kategorien:

- Consumer Products
- Privacy / Data Breach
- E-Commerce / Subscription
- Tech / Electronics

---

## 3. MVP Scope

### Must-have Features

#### 3.1 Case Feed

- Liste aktiver Class Actions / Settlements
- Sortierung nach Deadline, Relevanz, Neuheit
- Filter nach:
  - Kategorie
  - Jurisdiktion
  - Status
  - Proof required
  - Deadline

#### 3.2 Case Detail Screen

Jeder Fall enthält:

- Titel
- kurze Zusammenfassung
- ausführliche Beschreibung
- wer potenziell betroffen ist
- relevanter Zeitraum
- Deadline
- geschätzter Auszahlungstyp
- Hinweis, ob Kaufnachweis nötig ist
- offizielle Quelle
- Link zur offiziellen Claim-Seite
- „Last verified“-Datum

#### 3.3 Eligibility Checker

Regelbasierter Fragebogen pro Case.

Beispiele:

- Hast du Produkt X gekauft?
- Wann hast du es gekauft?
- In welchem Land / Bundesstaat wohnst du?
- Bei welchem Händler wurde gekauft?
- Hast du einen Kaufnachweis?

Ergebnis:

- likely eligible
- unlikely eligible
- unclear

#### 3.4 Saved Cases / Watchlist

- Nutzer können Fälle speichern
- Fälle mit Deadline-Countdown anzeigen
- optional Updates aktivieren

#### 3.5 Deadline Notifications

- Reminder X Tage vor Deadline
- Reminder am letzten Tag
- optional Case Update Notifications

#### 3.6 Claim Tracker

Nutzer können den Status selbst markieren:

- not started
- checking
- submitted
- under review
- paid
- rejected

#### 3.7 Admin Backoffice

Interne Oberfläche für:

- Cases anlegen
- bearbeiten
- archivieren
- Eligibility-Regeln pflegen
- Quellen verifizieren
- Deadlines updaten

---

## 4. Nicht im MVP

Diese Punkte bewusst **nicht** in v1:

- Claims direkt in der App einreichen
- Dokumentenuploads / Receipt Upload
- automatische OCR von Belegen
- AI-basierte Rechtsbewertung
- komplexe Multi-jurisdiction-Logik
- Kanzlei-Matching
- Payment / Auszahlungsabwicklung
- offene User-generated Case Submissions ohne Moderation

---

## 5. Architekturprinzipien

### 5.1 Trust First

Die wichtigste Produktqualität ist **Vertrauen**.

Das bedeutet:

- jeder Case braucht offizielle Quelle
- jede Deadline braucht Verifizierungsstatus
- jede Eligibility-Logik muss nachvollziehbar sein
- keine „magischen“ KI-Antworten bei Rechtsfragen
- Änderungsdatum und Prüfstatus sichtbar machen

### 5.2 Structured Data First

Cases werden strukturiert modelliert, nicht nur als Freitext.

Warum:

- bessere Filterbarkeit
- Eligibility Engine wird testbar
- Push-Reminder werden zuverlässig
- spätere Empfehlungssysteme werden möglich

### 5.3 Minimal Sensitive Data

Im MVP so wenig sensible Daten wie möglich speichern.

### 5.4 Admin-curated Content First

In v1 sind alle sichtbaren Cases **manuell kuratiert und geprüft**.

---

## 6. Empfohlener Tech Stack

### Frontend

| Technologie | Zweck | Begründung |
|------------|-------|------------|
| React Native + Expo | Mobile App | schnelle Cross-Platform-Entwicklung |
| Expo Router | Navigation | file-based Routing, sauber für Feature-Struktur |
| Zustand | State Management | leichtgewichtig, schnell, verständlich |
| react-native-mmkv | lokaler Speicher | performant für Session, Flags, Caching |
| Nativewind | Styling | schnelle UI-Iteration |
| React Hook Form + Zod | Formulare & Validierung | ideal für Eligibility Flows |
| date-fns | Datumslogik | Deadlines, Reminder, Case-Zeiträume |

### Backend

| Technologie | Zweck | Begründung |
|------------|-------|------------|
| Supabase | Backend-as-a-Service | Postgres, Auth, Storage, Functions, RLS |
| PostgreSQL | Datenbank | relationales Modell für Cases, Rules, Sources |
| Supabase Auth | Auth | Email, Magic Link, OAuth optional |
| Supabase Edge Functions | Serverlogik | Reminder Scheduling, Admin-Jobs, Verification-Jobs |
| Supabase Storage | Assets | Logos, PDFs, interne Import-Dateien |

### Monitoring / Ops

| Technologie | Zweck |
|------------|-------|
| Sentry | Error Tracking |
| PostHog oder alternatives Analytics-Tool | Produktanalyse nur mit Consent |
| Uptime Monitoring | Health Checks für Functions / Cron Jobs |

---

## 7. High-Level Systemarchitektur

```text
┌─────────────────────────────────────────────────────────────┐
│                        MOBILE APP                           │
│                                                             │
│  ┌────────────┐  ┌────────────┐  ┌───────────────────────┐ │
│  │ Auth Flow  │  │ Case Feed  │  │ Eligibility Checker   │ │
│  └────────────┘  └────────────┘  └───────────────────────┘ │
│  ┌────────────┐  ┌────────────┐  ┌───────────────────────┐ │
│  │ Watchlist  │  │ Tracker    │  │ Notification Settings │ │
│  └────────────┘  └────────────┘  └───────────────────────┘ │
└───────────────────────┬─────────────────────────────────────┘
                        │ HTTPS / TLS
                        │
┌───────────────────────┴─────────────────────────────────────┐
│                        SUPABASE                             │
│                                                             │
│  ┌──────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │ Auth     │  │ PostgreSQL   │  │ Edge Functions       │  │
│  └──────────┘  └──────────────┘  └──────────────────────┘  │
│                                                             │
│  ┌──────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │ Storage  │  │ Cron Jobs    │  │ Row Level Security   │  │
│  └──────────┘  └──────────────┘  └──────────────────────┘  │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        │ Internal Admin Access
                        │
┌───────────────────────┴─────────────────────────────────────┐
│                      ADMIN / OPS                             │
│                                                             │
│  Case CRUD • Rule Builder • Source Review • Audit Logs      │
└─────────────────────────────────────────────────────────────┘
```

---

## 8. Datenmodell

### 8.1 profiles

```sql
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  display_name text,
  country text,
  state_region text,
  language text default 'en',
  notifications_enabled boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

### 8.2 cases

```sql
create table cases (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  short_description text not null,
  long_description text,
  category text not null,
  jurisdiction text not null,
  status text not null check (status in ('draft', 'active', 'upcoming', 'closed', 'archived')),
  official_source_url text not null,
  claim_url text,
  deadline_at timestamptz,
  purchase_start_at timestamptz,
  purchase_end_at timestamptz,
  estimated_payout_text text,
  proof_required boolean default false,
  verification_status text not null default 'draft' check (verification_status in ('draft', 'verified', 'needs_review', 'archived')),
  cover_image_url text,
  last_verified_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

### 8.3 case_sources

```sql
create table case_sources (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references cases(id) on delete cascade,
  source_type text not null check (source_type in ('official', 'law_firm', 'administrator', 'court', 'news')),
  source_title text,
  source_url text not null,
  last_verified_at timestamptz,
  created_at timestamptz default now()
);
```

### 8.4 case_eligibility_rules

```sql
create table case_eligibility_rules (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references cases(id) on delete cascade,
  rule_type text not null,
  operator text not null,
  field_name text not null,
  rule_config_json jsonb not null,
  priority integer default 0,
  created_at timestamptz default now()
);
```

### 8.5 saved_cases

```sql
create table saved_cases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  case_id uuid not null references cases(id) on delete cascade,
  notify_deadline boolean default true,
  notify_updates boolean default true,
  saved_at timestamptz default now(),
  unique(user_id, case_id)
);
```

### 8.6 eligibility_checks

```sql
create table eligibility_checks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete set null,
  case_id uuid not null references cases(id) on delete cascade,
  answers_json jsonb not null,
  result text not null check (result in ('likely_eligible', 'unlikely', 'unclear')),
  created_at timestamptz default now()
);
```

### 8.7 claim_tracking

```sql
create table claim_tracking (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  case_id uuid not null references cases(id) on delete cascade,
  status text not null check (status in ('not_started', 'checking', 'submitted', 'under_review', 'paid', 'rejected')),
  submitted_at timestamptz,
  amount_received numeric,
  notes text,
  updated_at timestamptz default now(),
  unique(user_id, case_id)
);
```

### 8.8 notifications

```sql
create table notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  case_id uuid references cases(id) on delete cascade,
  type text not null check (type in ('deadline', 'update', 'recommendation', 'system')),
  title text not null,
  body text not null,
  scheduled_for timestamptz,
  sent_at timestamptz,
  created_at timestamptz default now()
);
```

### 8.9 admin_roles

```sql
create table admin_roles (
  user_id uuid primary key references profiles(id) on delete cascade,
  role text not null check (role in ('admin', 'editor', 'reviewer')),
  created_at timestamptz default now()
);
```

### 8.10 audit_logs

```sql
create table audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid references profiles(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  metadata jsonb,
  created_at timestamptz default now()
);
```

---

## 9. Eligibility Engine

### Ziel

Die Eligibility Engine soll **transparent, testbar und regelbasiert** sein.

Keine freie LLM-Entscheidungslogik im MVP.

### Beispiele für Rule Types

- country
- state_region
- purchase_date_range
- purchase_channel
- product_name
- subscription_status
- proof_required
- exclusion_rule

### Beispiel-Regeln

```json
[
  {
    "rule_type": "country",
    "operator": "in",
    "field_name": "country",
    "value": ["US"]
  },
  {
    "rule_type": "purchase_date_range",
    "operator": "between",
    "field_name": "purchase_date",
    "value": {
      "from": "2021-01-01",
      "to": "2022-12-31"
    }
  },
  {
    "rule_type": "product_name",
    "operator": "contains_any",
    "field_name": "product_name",
    "value": ["Product A", "Product B"]
  }
]
```

### Ergebnislogik

- alle Kernregeln erfüllt → `likely_eligible`
- klare Ausschlussregel verletzt → `unlikely`
- unvollständige oder widersprüchliche Antworten → `unclear`

### Vorteile

- auditierbar
- juristisch vorsichtiger
- leicht testbar
- später einfach um neue Regeln erweiterbar

---

## 10. Datenfluss

### 10.1 Public User Flow

1. Nutzer öffnet App
2. Feed lädt aktive, verifizierte Cases
3. Nutzer öffnet Case Detail
4. Nutzer startet Eligibility Check
5. Antworten werden lokal verarbeitet und optional gespeichert
6. Ergebnis wird angezeigt
7. Nutzer kann Case speichern oder zur offiziellen Claim-Seite wechseln

### 10.2 Admin Content Flow

1. Editor legt neuen Case an
2. Quellen werden hinterlegt
3. Reviewer prüft Fakten, Frist, URLs und Anspruchslogik
4. Verification Status wird auf `verified` gesetzt
5. Case wird veröffentlicht
6. Reminder-Jobs und Feed berücksichtigen den Case automatisch

### 10.3 Notification Flow

1. Nutzer speichert Fall oder aktiviert Reminder
2. Cron Job sucht kommende Deadlines
3. passende Notifications werden geplant
4. Push-Service versendet Nachricht
5. `sent_at` wird gespeichert

---

## 11. Rollen- und Rechtekonzept

### Öffentliche Nutzer

Dürfen:

- Cases ansehen
- Eligibility prüfen
- Cases speichern
- Reminder verwalten
- Claim-Status tracken

Dürfen nicht:

- Cases bearbeiten
- Admin-Daten sehen
- unverifizierte Inhalte sehen

### Editor

Darf:

- Cases erstellen und bearbeiten
- Quellen hinzufügen
- Eligibility-Regeln pflegen

### Reviewer

Darf zusätzlich:

- Cases verifizieren
- Status ändern
- Inhalte archivieren

### Admin

Darf zusätzlich:

- Rollen verwalten
- Audit Logs einsehen
- Systemkonfiguration ändern

---

## 12. Security & Compliance

### 12.1 Technische Sicherheit

- TLS für alle Requests
- Supabase Auth
- Row Level Security auf allen userbezogenen Tabellen
- keine Service Keys im Client
- Admin-Aktionen mit Audit Logs
- Input Validation mit Zod
- sichere URL-Validierung für externe Quellen

### 12.2 Datenschutzprinzipien

Im MVP nur minimale Daten speichern:

- Login-Daten
- Saved Cases
- Reminder-Einstellungen
- Claim-Tracker-Einträge
- optionale Eligibility-Antworten

### 12.3 Nicht im MVP speichern

- Ausweisdaten
- SSN / Steuerdaten
- Zahlungsdaten
- sensible juristische Dokumente
- vollständige Belegarchive

### 12.4 Rechtlich wichtige UI-Hinweise

Jeder Case Detail Screen braucht:

- Disclaimer „keine Rechtsberatung"
- Link zur offiziellen Claim-Seite
- Quelle(n)
- Last verified
- Jurisdiktion
- Status

---

## 13. Content-Qualität und Verifikation

### Content-Regeln

Ein Case darf nur live gehen, wenn:

- offizielle Quelle hinterlegt ist
- Claim-Link geprüft wurde
- Deadline verifiziert wurde
- Status gesetzt wurde
- Eligibility-Text klar formuliert ist
- irreführende Aussagen entfernt sind

### Case Verification Status

- draft
- needs_review
- verified
- archived

### Trust UI

Im Frontend sichtbar machen:

- Verified Badge
- Last Verified Date
- Official Source Link
- Claim Deadline
- Proof Required Badge

---

## 14. Screens / UX-Struktur

### 14.1 Onboarding

- kurze Erklärung des Produktnutzens
- Hinweis: keine Rechtsberatung
- Jurisdiktion / Land wählen
- Notification Opt-in

### 14.2 Home / Discover

- Suchfeld
- Case Cards
- Kategorien
- Filter
- „Ending soon“ Bereich

### 14.3 Case Detail

- Titel
- Zusammenfassung
- Wer könnte betroffen sein?
- Deadline
- Period of purchase / usage
- Proof required?
- Eligibility CTA
- Official Claim CTA
- Save CTA

### 14.4 Eligibility Flow

- 3–8 Fragen
- progress indicator
- klare Antwortoptionen
- Ergebnis-Screen mit vorsichtiger Sprache

### 14.5 Saved / Watchlist

- gespeicherte Cases
- Deadline Countdown
- Status / Reminder Tags

### 14.6 Claim Tracker

- manuelle Statuspflege
- Notizen
- optional Betrag dokumentieren

### 14.7 Settings

- Sprache
- Land / Region
- Notifications
- Datenschutz
- Disclaimer
- Account löschen

---

## 15. API / Service Layer

### Read APIs

- `GET /cases?status=active`
- `GET /cases/:slug`
- `GET /cases/:id/sources`
- `GET /me/saved-cases`
- `GET /me/claim-tracker`

### Write APIs

- `POST /eligibility-checks`
- `POST /saved-cases`
- `DELETE /saved-cases/:id`
- `POST /claim-tracker`
- `PATCH /claim-tracker/:id`
- `PATCH /notification-settings`

### Admin APIs

- `POST /admin/cases`
- `PATCH /admin/cases/:id`
- `POST /admin/cases/:id/sources`
- `POST /admin/cases/:id/rules`
- `POST /admin/cases/:id/verify`
- `POST /admin/cases/:id/archive`

Hinweis: In Supabase können diese Flows über Tables, RLS und Edge Functions umgesetzt werden, statt eine klassische REST-API separat zu hosten.

---

## 16. Projektstruktur (Expo / React Native)

```text
class-action-app/
├── app/
│   ├── (auth)/
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   └── forgot-password.tsx
│   ├── (tabs)/
│   │   ├── index.tsx                 # Discover
│   │   ├── saved.tsx                 # Watchlist
│   │   ├── tracker.tsx               # Claim Tracker
│   │   └── settings.tsx
│   ├── case/
│   │   └── [slug].tsx                # Case Detail
│   ├── eligibility/
│   │   └── [caseId].tsx              # Eligibility Flow
│   ├── onboarding.tsx
│   └── _layout.tsx
│
├── components/
│   ├── ui/
│   ├── cases/
│   │   ├── CaseCard.tsx
│   │   ├── CaseList.tsx
│   │   ├── CaseFilters.tsx
│   │   ├── DeadlineBadge.tsx
│   │   └── VerificationBadge.tsx
│   ├── eligibility/
│   │   ├── QuestionCard.tsx
│   │   └── EligibilityResult.tsx
│   ├── tracker/
│   └── settings/
│
├── features/
│   ├── auth/
│   ├── cases/
│   ├── eligibility/
│   ├── saved/
│   ├── tracker/
│   ├── notifications/
│   └── admin-shared/
│
├── lib/
│   ├── supabase.ts
│   ├── eligibility-engine.ts
│   ├── notifications.ts
│   ├── validation.ts
│   ├── dates.ts
│   └── external-links.ts
│
├── stores/
│   ├── auth-store.ts
│   ├── cases-store.ts
│   ├── saved-store.ts
│   ├── eligibility-store.ts
│   ├── tracker-store.ts
│   └── settings-store.ts
│
├── hooks/
├── types/
├── constants/
├── assets/
├── supabase/
│   ├── migrations/
│   ├── seed/
│   └── functions/
│       ├── schedule-deadline-reminders/
│       ├── send-push-notifications/
│       ├── verify-case-sources/
│       └── sync-case-status/
│
├── scripts/
│   ├── seed-cases.ts
│   └── import-cases.ts
│
└── docs/
    ├── ARCHITECTURE.md
    ├── DATA_MODEL.md
    ├── SECURITY.md
    └── CONTENT_GUIDELINES.md
```

---

## 17. State Management Plan

### auth-store

Verantwortlich für:

- Session
- User Profile
- Login / Logout Status

### cases-store

Verantwortlich für:

- Feed-Daten
- Case Filters
- Selected Case
- Loading / Error States

### eligibility-store

Verantwortlich für:

- aktuelle Antworten
- Fragefortschritt
- Ergebnis
- Persistenz optional bis Abschluss

### saved-store

Verantwortlich für:

- Watchlist
- Reminder Flags

### tracker-store

Verantwortlich für:

- Claim-Status pro Fall
- Notizen
- Received Amount

### settings-store

Verantwortlich für:

- Sprache
- Region
- Notifications
- Theme

---

## 18. Notification-Strategie

### Reminder-Typen

- 14 Tage vor Deadline
- 7 Tage vor Deadline
- 1 Tag vor Deadline
- optional am letzten Tag

### Trigger

- Nutzer speichert Case
- Nutzer aktiviert Reminder
- Deadline ändert sich
- wichtiger Status-Change eines Cases

### Push Payload Beispiel

```json
{
  "type": "deadline",
  "title": "Claim deadline approaching",
  "body": "The deadline for Example Settlement ends in 7 days.",
  "caseId": "uuid"
}
```

---

## 19. Admin Backoffice Anforderungen

### Case Management

- Case erstellen
- bearbeiten
- duplizieren
- archivieren
- Status ändern

### Source Management

- mehrere Quellen pro Case
- Link-Validation
- Last Verified pflegen

### Rule Management

- Fragebogen definieren
- Regeltyp auswählen
- Priorität setzen
- Ausschlussregeln markieren

### Review Queue

- neue Draft Cases
- Cases mit abgelaufener Verifikation
- Cases mit ungültigen Links
- Cases mit naher Deadline

### Audit / Moderation

- wer hat welchen Case geändert?
- wann wurde Deadline geändert?
- wann wurde Verification Status gesetzt?

---

## 20. Seed Content für Launch

Für den Start sollten mindestens **50–100 verifizierte Fälle** vorhanden sein.

### Mindestanforderung pro Seed-Case

- Titel
- Kurzbeschreibung
- Kategorie
- Jurisdiktion
- Status
- Deadline
- offizielle Quelle
- Claim Link
- 3–8 Eligibility-Fragen
- Last Verified

### Qualitätsziel

Lieber 50 sehr gute Cases als 500 unklare Cases.

---

## 21. Skalierungsstrategie

### Phase 1: MVP (0 – 10.000 Nutzer)

| Komponente | Lösung |
|-----------|--------|
| App | Expo |
| Backend | Supabase Free / Pro |
| Datenbank | Shared PostgreSQL |
| Push | Expo Push API |
| Admin | einfache interne Web-Oberfläche |
| Kosten | niedrig |

### Phase 2: Growth (10.000 – 100.000 Nutzer)

| Komponente | Lösung |
|-----------|--------|
| Backend | Supabase Pro |
| Datenbank | Connection Pooling |
| Push | Batching + Retry Queue |
| Admin | dediziertes Ops Dashboard |
| Monitoring | Sentry + Analytics |

### Phase 3: Scale (100.000+ Nutzer)

| Komponente | Lösung |
|-----------|--------|
| Datenbank | Dedicated Postgres / Read Replicas |
| Search | optionale externe Search-Lösung |
| Queue | Job Queue für Reminder / Imports |
| Caching | Edge Cache / CDN |
| Moderation | erweiterte Review Tools |

---

## 22. Risiken und Gegenmaßnahmen

### Risiko 1: Falsche oder veraltete Cases

**Gegenmaßnahme:**
- nur verifizierte Cases live
- Last Verified sichtbar
- Review Queue für alte Cases

### Risiko 2: Nutzer verstehen App als Rechtsberatung

**Gegenmaßnahme:**
- klare Disclaimer
- vorsichtige Sprache
- immer auf offizielle Quellen verweisen

### Risiko 3: Zu hoher Pflegeaufwand für Content

**Gegenmaßnahme:**
- strukturierte Admin-Flows
- Templates für Cases
- später halbautomatische Ingestion

### Risiko 4: Zu frühe Komplexität

**Gegenmaßnahme:**
- nur eine Jurisdiktion
- nur wenige Kategorien
- keine direkte Einreichung im MVP

---

## 23. Roadmap in Phasen

### Phase 1 — Foundation

- Repo aufsetzen
- Expo App initialisieren
- Supabase Projekt anlegen
- Auth integrieren
- Basismigrationen erstellen

### Phase 2 — Data Model & Admin Core

- Cases Tabelle
- Sources Tabelle
- Eligibility Rules Tabelle
- Saved Cases Tabelle
- Claim Tracker Tabelle
- Admin Role System

### Phase 3 — User Experience MVP

- Home / Discover
- Case Detail
- Save / Unsave
- Claim Tracker v1
- Settings

### Phase 4 — Eligibility Engine

- Q&A UI bauen
- Rule Engine implementieren
- Ergebnis-Screen bauen
- Tests für Entscheidungslogik

### Phase 5 — Notifications

- Push Token Handling
- Reminder Settings
- Cron / Function Jobs
- Versandlogik

### Phase 6 — Content Operations

- Admin CRUD
- Review Queue
- Verification Workflow
- Audit Logs

### Phase 7 — QA & Hardening

- RLS Tests
- Input Validation
- Deep Link Tests
- Deadline-Tests
- Offline / Error States

### Phase 8 — Launch Prep

- 50–100 Seed Cases importieren
- Disclaimer finalisieren
- Datenschutzseiten ergänzen
- Store Assets vorbereiten

### Phase 9 — Beta Launch

- geschlossene Beta
- Feedback sammeln
- Datenqualität prüfen
- Tracking auf UX-Probleme

### Phase 10 — Post-MVP

- Web Companion
- bessere Recommendations
- Receipt Upload
- halbautomatische Case-Ingestion
- Mehrsprachigkeit

---

## 24. Konkrete Build-Reihenfolge für Codex

Diese Reihenfolge ist die beste Startreihenfolge:

1. Expo App Scaffold
2. Supabase Setup + Env Handling
3. Auth Screens + Session Store
4. DB Migrationen
5. RLS Policies
6. Case Feed + Case Detail
7. Save / Watchlist
8. Eligibility Engine + Question Flow
9. Claim Tracker
10. Notification Settings + Push Setup
11. Admin Core
12. Seed Scripts + Initial Content
13. QA + Launch Cleanup

---

## 25. Definition of Done für MVP

Das MVP ist fertig, wenn:

- Nutzer sich registrieren und einloggen können
- aktive verifizierte Cases im Feed sichtbar sind
- jeder Case eine Detailseite mit Quelle und Deadline hat
- Eligibility Check pro Case funktioniert
- Fälle gespeichert werden können
- Reminder konfiguriert werden können
- Claim Tracker nutzbar ist
- Admin neue Cases pflegen und verifizieren kann
- alle userbezogenen Tabellen per RLS abgesichert sind
- App klar kommuniziert, dass sie keine Rechtsberatung gibt

---

## 26. Finale Empfehlung

Für v1 soll das Produkt bewusst **ein vertrauenswürdiges Discovery- und Tracking-Tool** sein.

### Nicht bauen in v1

- automatische juristische Bewertung per AI
- Einreichung von Claims in der App
- Dokumentenprüfung
- komplexe internationale Expansion

### Unbedingt bauen in v1

- sauberes Datenmodell
- verifizierte Cases
- transparente Eligibility-Logik
- starke Disclaimer
- gutes Admin-System
- Reminder und Tracking

---

## 27. Direktes Arbeitsbriefing für Codex

Baue eine mobile App mit **React Native + Expo + Supabase** für aktive US-Class-Action-Settlements.

### Ziel:
Nutzer sollen aktive Fälle entdecken, Eligibility mit einem regelbasierten Fragebogen prüfen, Fälle speichern, Deadlines per Push-Reminder erhalten und ihren Claim-Status manuell tracken.

### Wichtige Produktregeln:
- keine Rechtsberatung
- nur verifizierte Cases anzeigen
- immer offizielle Quelle und Claim-Link anzeigen
- Eligibility Engine ist regelbasiert, nicht frei-generativ
- minimale PII speichern

### Kernfeatures:
- Auth
- Case Feed
- Case Detail
- Eligibility Checker
- Saved Cases
- Claim Tracker
- Notification Settings
- Admin CRUD für Cases, Sources und Eligibility Rules

### Stack:
- Expo Router
- Zustand
- Nativewind
- react-native-mmkv
- Supabase Auth
- Supabase Postgres
- Supabase Edge Functions
- Sentry

### Architekturprioritäten:
1. Trust first
2. Data quality first
3. Security first
4. Speed of MVP second

