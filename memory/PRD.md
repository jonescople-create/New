# IslandFruitGuide PRD

## Problem Statement
Caribbean fruit e-commerce website with addictive fruit catcher game as a sales funnel. Needs Hostinger Node.js deployment, email delivery via Resend, discount code integration in PayPal checkout, and full product catalog sync.

## Architecture
- **Frontend**: Vite + React 19 + TypeScript + TailwindCSS v4
- **Backend (Emergent)**: FastAPI (Python) + Supabase + MongoDB
- **Backend (Hostinger)**: Express.js (Node.js) + Supabase + MongoDB
- **Email**: Resend API (transactional emails with IFG20 code)
- **Payments**: PayPal (sandbox + live) with server-side discount validation
- **Database**: Supabase PostgreSQL (fruits, recipes, ebooks) + MongoDB (products catalog, leaderboard, subscribers, orders)

## What's Been Implemented

### Session 1 — Bug Fixes
- server.py duplicate function, unreachable code, admin credentials
- GameCanvas pause bug, FruitCard button nesting, Vite HMR config

### Session 2 — Game Enhancement
- Sound effects (Web Audio API), fullscreen mode, 15 achievements
- Global leaderboard, social sharing, combo system, 4 power-ups, visual juice

### Session 3 — Monetization
- MongoDB leaderboard, email subscribe with IFG20, discount validation
- Daily challenge system with CHALLENGE25 reward

### Session 4 — Deployment + Full Integration (April 3, 2026)
1. **Resend Email Delivery** — Welcome email with IFG20 discount code sent on subscribe. HTML template with branded design, discount card, store CTA.
2. **Discount-Aware Checkout** — `POST /api/checkout/create-order` applies discount codes server-side (IFG20=20%, CHALLENGE25=25%, FRUIT10=10%). Creates order in MongoDB with full audit trail.
3. **Product Catalog Sync** — All 13 products synced to MongoDB. `/api/products` now returns full catalog (was 4 from Supabase, now 13 from MongoDB).
4. **Hostinger Node.js Backend** — Complete Express.js port of all Python FastAPI endpoints:
   - Products, Fruits, Recipes, Ebooks, Bundles, Config
   - Game: Leaderboard, Daily Challenge, Challenge Completion
   - Email: Subscribe, Check, Discount Validate
   - Checkout: Create Order with discount
   - Admin: Login, Sync Products, Subscribers, Orders
   - SPA fallback (serves React build from /public)
5. **Deployment Package** — `/app/hostinger-deploy.zip` (518KB) containing:
   - `backend/server.js` — Production Node.js server
   - `backend/public/` — Built React frontend (Vite output)
   - `backend/.env` — Configuration template
   - `DEPLOYMENT_GUIDE.md` — Step-by-step Hostinger setup guide

### Testing Results
- Iteration 1: 85% | Iteration 2: 95% | Iteration 3: 95% | Iteration 4: 96.8% backend, 85% frontend

## Discount Codes
| Code | Discount | Trigger | Active |
|------|----------|---------|--------|
| IFG20 | 20% off first ebook | Email signup | Yes |
| FRUIT10 | 10% off recipe pack | Future promo | Yes |
| CHALLENGE25 | 25% off any ebook | Daily challenge completion | Yes |

## API Summary (31 endpoints)
Products (3), Fruits (2), Recipes (2), Ebooks (2), Bundles (1), Config (1), Game (5), Subscribe (3), Checkout (1), Admin (5), Health (1)

## Prioritized Backlog
### P0 — ALL DONE
- [x] All bug fixes + game addictiveness
- [x] Sound, fullscreen, achievements, leaderboard, sharing
- [x] IFG20 discount flow + Resend email delivery
- [x] Daily Challenge with CHALLENGE25 reward
- [x] Product catalog sync (13 products)
- [x] Discount-aware checkout
- [x] Hostinger Node.js deployment package

### P1
- [ ] Custom Resend domain (yourdomain.com instead of resend.dev)
- [ ] MongoDB Atlas setup for Hostinger production
- [ ] PayPal webhook for order confirmation emails
- [ ] PDF generation for the free Caribbean Fruit Guide

### P2
- [ ] Seasonal game themes
- [ ] Multiplayer challenge mode
- [ ] Referral system with FRIEND15 code
- [ ] A/B test discount amounts
