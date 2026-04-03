# IslandFruitGuide — Hostinger Node.js Deployment Guide

## Quick Deploy Steps

### 1. Prerequisites
- Hostinger VPS or Node.js hosting plan
- MongoDB Atlas free cluster (or Hostinger MongoDB addon)
- Domain pointing to your Hostinger server

### 2. Set Up MongoDB Atlas (Free)
1. Go to https://cloud.mongodb.com
2. Create a free M0 cluster
3. Create a database user (username + password)
4. Whitelist `0.0.0.0/0` in Network Access (for Hostinger)
5. Copy the connection string: `mongodb+srv://USER:PASS@cluster.mongodb.net/islandfruitguide`

### 3. Upload to Hostinger
1. **Upload the entire `backend/` folder** to your Hostinger Node.js app directory
   - This includes `server.js`, `package.json`, `.env`, and the `public/` folder
   - The `public/` folder contains the built React frontend (served as static files)
2. In Hostinger control panel → Node.js → set **Application root** to your upload directory
3. Set **Entry point** to `server.js`
4. Set **Node.js version** to 18 or 20

### 4. Configure Environment
In Hostinger control panel → Environment Variables (or edit `.env` file):

```
PORT=3000
SUPABASE_URL=https://raguzwxnrdanynjnppze.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
MONGODB_URI=mongodb+srv://YOUR_USER:YOUR_PASS@cluster.mongodb.net/islandfruitguide
DB_NAME=islandfruitguide
JWT_SECRET=change-this-to-a-random-string-at-least-32-chars
JWT_EXPIRATION_HOURS=24
ADMIN_EMAIL=jonescople@gmail.com
ADMIN_PASSWORD_HASH=$2b$12$ZXzuekbIKDv5jem1dy98duX7kEORTfa2wwWPH3gm5W7EQ9LdQ5/0O
RESEND_API_KEY=re_RTN43XjM_L6YmcGeFQncDAru9YFHYvz4x
SENDER_EMAIL=onboarding@resend.dev
PAYPAL_MODE=LIVE
FRONTEND_URL=https://yourdomain.com
```

### 5. Install & Start
```bash
cd /path/to/your/app
npm install
npm start
```

### 6. First-Time Setup
After the server is running, sync your product catalog:

```bash
# Login
TOKEN=$(curl -s -X POST https://yourdomain.com/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"jonescople@gmail.com","password":"admin123"}' | jq -r '.access_token')

# Sync all 13 products to MongoDB
curl -X POST https://yourdomain.com/api/admin/sync-products \
  -H "Authorization: Bearer $TOKEN"
```

## Architecture

```
backend/
├── server.js         # Express backend (API + static file serving)
├── package.json      # Dependencies
├── .env              # Configuration
└── public/           # Built React frontend (Vite output)
    ├── index.html    # SPA entry point
    └── assets/       # JS, CSS, images
```

**Single process** — Express serves both the API (`/api/*`) and the React SPA (all other routes).
No reverse proxy, Docker, or separate frontend server needed.

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/health | Health check |
| GET | /api/products | All products |
| GET | /api/products/:slug | Single product |
| GET | /api/fruits | All fruits |
| GET | /api/recipes | All recipes |
| GET | /api/ebooks | All ebooks |
| GET | /api/bundles | All bundles |
| GET | /api/config | PayPal config |
| POST | /api/subscribe | Email signup (returns IFG20 code) |
| GET | /api/subscribe/check/:email | Check subscription |
| POST | /api/discount/validate | Validate discount code |
| POST | /api/checkout/create-order | Create order with discount |
| GET | /api/game/leaderboard | Global game scores |
| POST | /api/game/leaderboard | Submit game score |
| GET | /api/game/daily-challenge | Today's challenge |
| POST | /api/game/daily-challenge/complete | Complete challenge |
| POST | /api/admin/login | Admin login |
| POST | /api/admin/sync-products | Sync product catalog |

## Credentials
- **Admin**: jonescople@gmail.com / admin123
- **Discount codes**: IFG20 (20%), FRUIT10 (10%), CHALLENGE25 (25%)

## Custom Domain + Resend
To send emails from your own domain instead of `onboarding@resend.dev`:
1. Go to https://resend.com/domains
2. Add your domain and verify DNS records
3. Update `SENDER_EMAIL` in `.env` to `noreply@yourdomain.com`
