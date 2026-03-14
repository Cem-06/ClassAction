# Lawsy Mobile MVP

React Native + Expo app for discovering verified US class action settlements.

## Current status
- Phase 0 decisions documented
- Phase 1 bootstrap complete (router, ui primitives, supabase client, storage)

## Stack
- Expo + React Native + TypeScript
- Expo Router
- Supabase
- Zustand
- MMKV

## Setup
1. Copy env values:
```bash
cp .env.example .env
```
2. Add Supabase values to `.env`
3. (Optional for paywall checkout) Add RevenueCat API keys to `.env`
4. Start app:
```bash
npm run start
```

## Notes
- App is an information and discovery tool only.
- No legal advice.
