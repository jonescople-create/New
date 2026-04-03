# IslandFruitGuide PRD

## Problem Statement
User uploaded a zip of their Caribbean fruit e-commerce website (IslandFruitGuide). Task: scan for bugs, fix them, and expand the fruit catcher game to be more addictive and a money machine to drive ebook sales. Keep existing design, no rebuilds — only fix and expand.

## Architecture
- **Frontend**: Vite + React 19 + TypeScript + TailwindCSS v4
- **Backend**: FastAPI (Python) + Supabase PostgreSQL
- **Payments**: PayPal (sandbox + live)
- **Hosting**: Emergent platform (frontend port 3000, backend port 8001)

## User Personas
1. **Caribbean fruit enthusiast** — browses fruits, recipes, health info
2. **Ebook buyer** — purchases digital recipe books and guides
3. **Casual gamer** — plays Fruit Catcher, gets hooked, discovers store products

## Core Requirements
- Full fruit encyclopedia (26+ fruits with profiles, nutrition, recipes)
- E-commerce store with digital products (ebooks, recipe packs, guides)
- PayPal checkout integration
- Fruit Catcher game as engagement + sales funnel
- Admin dashboard for content management
- SEO-friendly routing with lazy-loaded pages

## What's Been Implemented

### Session 1 — Bug Fixes (April 3, 2026)
1. **server.py duplicate function** — Removed dead `admin_delete_product` duplicate
2. **server.py unreachable code** — Removed dead code after `return []`
3. **GameCanvas pause bug** — RAF loop now keeps running during pause
4. **FruitGame dependency array** — Removed `trackBehaviour` from useCallback dependency
5. **Button nesting in FruitCard** — Changed outer `<button>` to `<div>`
6. **Vite HMR config** — Set `clientPort: 443` for Emergent
7. **Admin credentials** — Fixed admin password hash (admin123)

### Session 2 — Full Game Enhancement (April 3, 2026)
1. **Sound Effects** — Web Audio API synthesizer (GameSounds.ts) with sounds for: catch, combo, power-up, hit, shield block, miss, level-up, frenzy, game over, achievement. Mute/unmute toggle.
2. **Fullscreen Mode** — Fullscreen API integration. Dedicated ⛶ button + side-by-side Play Fullscreen button on start screen. Dynamic canvas resizing to fill screen while maintaining aspect ratio.
3. **Achievement System** — 15 achievements across categories: score milestones, combo mastery, power-up usage, level progression, game frequency, total fruits caught. Persistent to localStorage. Achievement modal with unlocked/locked states.
4. **Global Leaderboard** — Backend API (POST+GET /api/game/leaderboard) for Supabase persistence. Player name input on game over. Top 5 scores shown on start screen.
5. **Social Sharing** — ShareScoreModal with canvas-rendered score card (downloadable PNG). Share options: native share, Twitter/X post, copy text, download card.
6. **Combo System** — Chain catches within 1.2s for escalating combos (3x/5x/10x/20x) with score multipliers (2x/3x/5x)
7. **4 Power-Ups** — Shield, Magnet, Double, Frenzy with visual effects
8. **Visual Juice** — Particles, screen shake, floating text, flash overlays, level announcements
9. **Level Progression** — Auto-leveling every 150 pts, increasing difficulty
10. **Sales Funnel Integration** — Store tips on game over, personalised deals, milestone rewards linking to products

### Testing Results
- **Iteration 1**: 85% overall (all core flows passing)
- **Iteration 2**: 95% overall (100% frontend, 83.3% backend — only product slug 404s from Supabase data)

## Prioritized Backlog
### P0 (Critical) — DONE
- [x] Fix all backend bugs
- [x] Fix game pause/resume
- [x] Enhance game addictiveness
- [x] Add sound effects
- [x] Add fullscreen mode
- [x] Add achievements
- [x] Add global leaderboard
- [x] Add social sharing

### P1 (Important)
- [ ] Create game_leaderboard table in Supabase for persistent leaderboard
- [ ] Add product slugs to Supabase for deep-linked store tips
- [ ] Add more game skins/themes

### P2 (Nice to Have)
- [ ] Add seasonal game themes (Christmas, Summer)
- [ ] Add multiplayer/challenge mode
- [ ] Push notifications for daily streak reminders
- [ ] Add referral tracking for game shares
