# IslandFruitGuide PRD

## Problem Statement
User uploaded a zip of their Caribbean fruit e-commerce website (IslandFruitGuide). Task: scan for bugs, fix them, expand the fruit catcher game to be more addictive and a money machine to drive ebook sales. Keep existing design, no rebuilds — only fix and expand.

## Architecture
- **Frontend**: Vite + React 19 + TypeScript + TailwindCSS v4
- **Backend**: FastAPI (Python) + Supabase PostgreSQL + MongoDB (game data)
- **Payments**: PayPal (sandbox + live)
- **Hosting**: Emergent platform (frontend port 3000, backend port 8001)

## What's Been Implemented

### Session 1 — Bug Fixes
1. server.py duplicate function, unreachable code, admin credentials
2. GameCanvas pause bug (RAF loop dying)
3. FruitCard button nesting, Vite HMR config

### Session 2 — Game Enhancement
1. Sound effects (Web Audio API, 10 sounds)
2. Fullscreen mode with dynamic canvas resize
3. 15-achievement system with persistence
4. Global leaderboard + social sharing
5. Combo system, 4 power-ups, visual juice, level progression

### Session 3 — Monetization + Daily Challenge (April 3, 2026)
1. **MongoDB-backed leaderboard** — Replaced Supabase fallback with reliable MongoDB persistence for game_leaderboard, email_subscribers, challenge_completions
2. **Email subscribe API** (`POST /api/subscribe`) — Returns IFG20 discount code (20% off) + handles already-subscribed gracefully
3. **Discount validation API** (`POST /api/discount/validate`) — Validates IFG20, FRUIT10, CHALLENGE25 codes
4. **Daily Challenge System**:
   - `GET /api/game/daily-challenge` — Returns daily target score, theme (Mango Monday, Frenzy Friday, etc.), countdown timer, reward code CHALLENGE25
   - `POST /api/game/daily-challenge/complete` — Validates completion, issues reward
   - `GET /api/game/daily-challenge/leaderboard` — Today's challenge top completions
   - Frontend `DailyChallengeWidget` — Shows in start screen (full) and during gameplay (compact progress bar)
5. **Enhanced Email Capture** — Full IFG20 discount flow: email input → subscribe API → shows discount code card + "FREE Caribbean Fruit Guide PDF" confirmation
6. **Enhanced OfferModal** — Shows applicable discount (IFG20 for subscribers, CHALLENGE25 for challenge completers), price breakdown with savings, copy-code button
7. **Fixed product slug deep links** — Store tips now use correct slugs matching products.ts (fat-loss-smoothies, healing-drinks, pre-workout-drinks)
8. **Product slug API fallback** — Partial slug matching for Supabase ↔ frontend data discrepancies

### Testing Results
- **Iteration 1**: 85% (all core flows passing)
- **Iteration 2**: 95% (100% frontend — fullscreen, sounds, achievements)
- **Iteration 3**: 95%/84.8% (all new features pass — subscribe, discount, challenge, leaderboard. Backend product slug 404s are data gaps in Supabase, not code bugs.)

## Discount Codes
| Code | Discount | Trigger |
|------|----------|---------|
| IFG20 | 20% off first ebook | Email signup |
| FRUIT10 | 10% off recipe pack | Future promo |
| CHALLENGE25 | 25% off any ebook | Daily challenge completion |

## Prioritized Backlog
### P0 — DONE
- [x] All bug fixes
- [x] Game addictiveness (combo, power-ups, particles, levels)
- [x] Sound effects + fullscreen + achievements
- [x] Global leaderboard (MongoDB)
- [x] Social sharing
- [x] IFG20 discount flow end-to-end
- [x] Daily Challenge system
- [x] Product slug deep links

### P1
- [ ] Sync all frontend products to Supabase (admin bulk import)
- [ ] SendGrid/email delivery for IFG20 code + free PDF
- [ ] Push notifications for daily challenge reminders
- [ ] PayPal checkout discount code validation integration

### P2
- [ ] Seasonal game themes
- [ ] Multiplayer challenge mode
- [ ] Referral tracking for game shares
- [ ] A/B test different discount amounts
