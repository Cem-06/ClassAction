
# DATABASE_SCHEMA.md
Lawsy — Supabase Database Schema

Database: PostgreSQL (Supabase)

---

# Table: cases

id (uuid) PRIMARY KEY
title (text)
slug (text)
description (text)
category (text)
company (text)
deadline (timestamp)
payout_min (integer)
payout_max (integer)
official_url (text)
logo_url (text)
status (text)
created_at (timestamp)

Status values
active
closed
upcoming

---

# Table: eligibility_rules

id (uuid) PRIMARY KEY
case_id (uuid) REFERENCES cases(id)
rule_type (text)
rule_value (text)
created_at (timestamp)

Rule types example
product
purchase_date
country
merchant

---

# Table: eligibility_questions

id (uuid) PRIMARY KEY
case_id (uuid) REFERENCES cases(id)
question (text)
options (jsonb)
order_index (integer)

Example options
[
  {"label":"Yes","value":"yes"},
  {"label":"No","value":"no"},
  {"label":"Not sure","value":"unknown"}
]

---

# Table: saved_cases

id (uuid) PRIMARY KEY
user_id (uuid)
case_id (uuid) REFERENCES cases(id)
saved_at (timestamp)

---

# Table: tracker

id (uuid) PRIMARY KEY
user_id (uuid)
case_id (uuid)
status (text)
submitted_at (timestamp)
payout_received (integer)

Status values
saved
checking
submitted
paid
rejected

---

# Table: case_sources

id (uuid) PRIMARY KEY
case_id (uuid)
source_url (text)
source_name (text)
verified (boolean)

---

# Seed Data Strategy

Initial launch target
20 verified cases

Sources
- official settlement websites
- court filings
- law firm pages

Each case must include
title
description
deadline
official_url
payout range
