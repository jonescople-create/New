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

## What's Been Implemented (April 3, 2026)

### Bugs Fixed
1. **server.py duplicate function** — Removed dead `admin_delete_product` duplicate (was unreachable code after line 913)
2. **server.py unreachable code** — Removed dead code after `return []` in `read_fruits_from_file` exception handler
3. **GameCanvas pause bug** — RAF loop now keeps running during pause (was stopping completely and never resuming)
4. **FruitGame dependency array** — Removed `trackBehaviour` from useCallback dependency (was causing potential re-render issues)
5. **Button nesting in FruitCard** — Changed outer `<button>` to `<div>` to fix HTML validation error (button inside button)
6. **Vite HMR config** — Set `clientPort: 443` for Emergent platform compatibility
7. **Admin credentials** — Fixed admin password hash so login works (admin123)

### Game Enhancements (Addictive + Revenue)
1. **Combo System** — Chain catches within 1.2s for escalating combos (3x/5x/10x/20x) with score multipliers (2x/3x/5x)
2. **Power-Ups** — Four collectible power-ups during gameplay:
   - Shield (absorbs 1 hit)
   - Magnet (attracts fruits toward basket)
   - Double (2x base points)
   - Frenzy (fruit rain mode — rapid spawns)
3. **Visual Juice** — Particle effects on catch, screen shake on damage/power-ups, flash overlays, floating score text
4. **Level Progression** — Auto-leveling every 150 pts with announcement, increasing difficulty (faster spawn, more pests)
5. **Sales Integration** — Store tips on game over, personalised deal buttons after 2+ games, milestone rewards linking to specific ebook products
6. **Milestone Rewards** — 5 tiers (50/100/200/300/500) each linking to a specific store product with contextual messaging

## Prioritized Backlog
### P0 (Critical)
- [x] Fix all backend bugs
- [x] Fix game pause/resume
- [x] Enhance game addictiveness

### P1 (Important)
- [ ] Add sound effects to game (catch/miss/combo/level-up)
- [ ] Add leaderboard persistence to Supabase
- [ ] Add game achievement badges
- [ ] Fix 400 console errors (Supabase session refresh)

### P2 (Nice to Have)
- [ ] Add social sharing for high scores
- [ ] Add seasonal game themes (Christmas, Summer)
- [ ] Add multiplayer/challenge mode
- [ ] Push notifications for daily streak reminders

## Next Tasks
1. Add sound effects (catch, miss, power-up, combo milestone, level up)
2. Persist leaderboard to Supabase for global competition
3. Add achievement/badge system (e.g., "First 500 Points", "10x Combo King")
4. Implement referral tracking for game shares
