
# COMPONENT_ARCHITECTURE.md
Lawsy — Component Architecture

Tech Stack
- React Native
- Expo
- TypeScript
- Supabase
- lucide-react-native Icons

Design Principles
- Atomic component architecture
- Reusable UI components
- No business logic inside UI components
- Screens orchestrate components and hooks

---

# Folder Structure

app/
 ├ (tabs)/
 │   ├ home.tsx
 │   ├ saved.tsx
 │   ├ tracker.tsx
 │   └ profile.tsx
 │
 ├ case/
 │   └ [caseId].tsx
 │
 ├ eligibility/
 │   ├ question.tsx
 │   └ result.tsx
 │
 └ _layout.tsx

components/
 ├ ui/
 │   ├ Button.tsx
 │   ├ Card.tsx
 │   ├ Badge.tsx
 │   ├ Input.tsx
 │   ├ Skeleton.tsx
 │
 ├ cases/
 │   ├ CaseCard.tsx
 │   ├ CaseList.tsx
 │   ├ CaseHeader.tsx
 │   ├ CaseInfoSection.tsx
 │   ├ DeadlineBadge.tsx
 │
 ├ eligibility/
 │   ├ EligibilityQuestion.tsx
 │   ├ EligibilityOption.tsx
 │   ├ EligibilityProgress.tsx
 │   └ EligibilityResultCard.tsx
 │
 ├ tracker/
 │   ├ TrackerCard.tsx
 │   └ StatusBadge.tsx
 │
 ├ navigation/
 │   └ BottomTabs.tsx
 │
 └ layout/
     ├ ScreenContainer.tsx
     └ Section.tsx

---

# Core UI Components

## Button.tsx

Props
label: string
onPress: () => void
variant?: "primary" | "secondary" | "ghost"
loading?: boolean
disabled?: boolean

Primary Style
background: #2563EB
text: white
height: 48
borderRadius: 12

---

## Card.tsx

Props
children: ReactNode
padding?: number
onPress?: () => void

Style
background: white
borderRadius: 16
padding: 16

---

## Badge.tsx

Props
label: string
variant?: "success" | "warning" | "neutral"

---

## Input.tsx

Props
placeholder: string
value: string
onChange: (value:string) => void
icon?: ReactNode

Height: 44px

---

## Skeleton.tsx

Props
width
height
borderRadius

---

# Case Components

## CaseCard.tsx

Props
id: string
title: string
description: string
deadline: string
payout: string
category: string
logo?: string
onPress: () => void

---

## CaseList.tsx

Props
cases: Case[]
loading?: boolean

Behavior
- Skeleton while loading
- Empty state when no data

---

## DeadlineBadge.tsx

Props
deadline: string

Display
Deadline in X days

---

# Eligibility Components

## EligibilityProgress.tsx

Props
current: number
total: number

---

## EligibilityQuestion.tsx

Props
question: string
options: Option[]
onSelect(option)

---

## EligibilityOption.tsx

Props
label: string
selected: boolean
onPress

---

## EligibilityResultCard.tsx

Props
result: "eligible" | "unclear" | "not_eligible"
payout: string
deadline: string

---

# Tracker Components

## TrackerCard.tsx

Props
caseTitle
status
submittedDate?
payout?

---

## StatusBadge.tsx

Props
status:
"saved"
"checking"
"submitted"
"paid"
"rejected"

---

# Layout Components

## ScreenContainer.tsx

Props
children
scroll?: boolean

Adds
safe area
padding
background

---

## Section.tsx

Props
title
children

---

# Icons

Library
lucide-react-native

Common Icons
home
heart
bookmark
check
clock
user
bell
external-link
