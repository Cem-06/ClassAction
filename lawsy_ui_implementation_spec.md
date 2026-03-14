
# Lawsy — UI Implementation Specification
Class Action Lawsuit Finder (Mobile App)

## Design Goals
- Clean
- Modern
- Trustworthy
- Fintech-style UI
- iOS-first design language
- Minimal friction

---

# 1. Global Design System

## Primary Color
Blue 600  
#2563EB

Usage:
- Primary buttons
- Links
- Active icons
- Progress bars

## Background
#F8FAFC

## Card Background
#FFFFFF

## Text Colors

Primary  
#0F172A

Secondary  
#64748B

Muted  
#94A3B8

## Success
#22C55E

## Warning
#F59E0B

---

# 2. Typography

Font: Inter  
Fallback: System font

Sizes

Title XL — 28px (700)  
Title — 22px (600)  
Section Title — 18px (600)  
Body — 16px (400)  
Caption — 13px (400)

---

# 3. Spacing System

Base Unit: 8px

Spacing Scale

4  
8  
12  
16  
20  
24  
32  
40

Card Padding: 16px  
Screen Padding: 20px

---

# 4. Border Radius

Cards: 16px  
Buttons: 12px  
Input Fields: 12px  
Badges: 10px

---

# 5. Shadows

shadowColor: #000  
shadowOpacity: 0.05  
shadowRadius: 10  
shadowOffset: {width:0,height:4}

---

# 6. Bottom Navigation

Tabs

Home  
Saved  
Tracker  
Profile

Icons

home  
heart  
clipboard  
user

Icon Library: lucide-react-native

Icon Size: 22px

Active Color: #2563EB  
Inactive: #94A3B8

---

# 7. Screen: Home (Discover)

Layout

Header  
SearchBar  
Category Chips  
Case List  
Bottom Tabs

Header

Title: Lawsy  
Subtitle: Class Action Lawsuit Finder

Right side icon: Notifications

Search Bar

Placeholder: Search companies, products, cases

Height: 44px

Rounded input with icon on the left

---

# 8. Category Chips

Horizontal scroll

Categories

All  
Consumer  
Tech  
Privacy  
Subscriptions

Inactive Style

background #E2E8F0  
text #334155

Active Style

background #2563EB  
text white

Padding

10px horizontal  
6px vertical

---

# 9. Case Card

Layout

Logo  
Title  
Category  
Description  
Deadline  
Estimated payout  
Button

Example

Title: Apple iPhone Battery Settlement

Description: iPhone 6 & 7 users may qualify.

Deadline Badge: Deadline May 20 2026

Payout: $25 – $500

Button: Check Eligibility

Button Style

height 44  
radius 12  
background #2563EB  
text white

---

# 10. Screen: Case Detail

Layout

Header  
Case Info Card  
Eligibility Section  
CTA Buttons  
Sources

Header

Back button  
Bookmark icon

Case Info Card

Case logo  
Case title  
Category tag  
Status tag

Who May Qualify

✓ Owned iPhone 6 or 7  
✓ Purchased before Dec 2017  
✓ Device slowed down

Important Dates

Purchase Window: Sep 2014 — Dec 2017  
Claim Deadline: May 20 2026

Estimated Payout

$25 – $500

---

# 11. Primary CTA

Button: Check Eligibility

Style

full width  
height 48  
blue background  
radius 12

Secondary Button

Visit Official Website

Border style

---

# 12. Eligibility Flow

Layout

Progress bar  
Question text  
Answer options  
Continue button

Progress Example

Question 2 of 4

Question Example

When did you purchase the product?

Answer Cards

Before 2018  
2018 — 2019  
Not sure

Selected State

border blue  
background light blue

---

# 13. Eligibility Result Screen

Icon: Green check

Title: You may qualify

Description

Based on your answers you may be eligible for this settlement.

Info Card

Estimated payout: $25 – $500  
Deadline: May 20 2026

Buttons

Primary: Go to Claim Website  
Secondary: Save Case

---

# 14. Saved Screen

List of saved cases

Card content

Case title  
Deadline countdown  
Estimated payout

Example

Deadline in 35 days

---

# 15. Tracker Screen

Status Types

Saved  
Checking  
Submitted  
Paid  
Rejected

Status Colors

Saved — gray  
Submitted — blue  
Paid — green  
Rejected — red

---

# 16. Profile Screen

Sections

Account  
Notifications  
Language  
Legal

Legal

Disclaimer  
Privacy Policy  
Terms

Danger Button

Delete Account

Color

#EF4444

---

# 17. Disclaimer

Lawsy is an informational tool that helps users discover public class action settlements.

Lawsy does not provide legal advice and does not file claims on behalf of users.

Always verify eligibility on official settlement websites.

---

# 18. Loading States

Skeleton cards

logo skeleton  
title skeleton  
description skeleton  
button skeleton

---

# 19. Empty States

No saved cases yet.

Explore settlements and save interesting ones.

---

# 20. Error State

Failed to load cases.

Button: Retry

---

# 21. Animations

Button press: scale 0.97  
Page transition: slide  
Success animation: checkmark pop

---

# 22. Icons

Library: lucide-react-native

Examples

home  
heart  
bookmark  
check  
clock  
user  
bell  
external-link

---

# 23. Recommended Tech Stack

React Native  
Expo  
Supabase

Libraries

react-native-reanimated  
react-native-gesture-handler  
lucide-react-native
