require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { createClient } = require('@supabase/supabase-js');
const { Resend } = require('resend');
const rateLimit = require('express-rate-limit');
const crypto = require('crypto');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ── Config ─────────────────────────────────────────────────────────────────────
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
const JWT_SECRET = process.env.JWT_SECRET || 'islandfruitguide-super-secret-key-2024-v2';
const JWT_EXPIRY = process.env.JWT_EXPIRATION_HOURS || '24';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'jonescople@gmail.com';
const ADMIN_HASH = process.env.ADMIN_PASSWORD_HASH || '';
const RESEND_KEY = process.env.RESEND_API_KEY || '';
const SENDER_EMAIL = process.env.SENDER_EMAIL || 'onboarding@resend.dev';
const FRONTEND_URL = process.env.FRONTEND_URL || '';

// ── Supabase ───────────────────────────────────────────────────────────────────
const supabase = (SUPABASE_URL && SUPABASE_KEY)
  ? createClient(SUPABASE_URL, SUPABASE_KEY) : null;

// ── Resend ─────────────────────────────────────────────────────────────────────
const resend = RESEND_KEY ? new Resend(RESEND_KEY) : null;

// ── Middleware ──────────────────────────────────────────────────────────────────
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

const limiter = rateLimit({ windowMs: 60000, max: 100, standardHeaders: true });
app.use('/api/', limiter);

// ── Auth middleware ─────────────────────────────────────────────────────────────
function verifyToken(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ detail: 'Not authenticated' });
  try {
    const payload = jwt.verify(auth.slice(7), JWT_SECRET);
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ detail: 'Invalid token' });
  }
}

// ── Supabase helpers ────────────────────────────────────────────────────────────
async function supaSelect(table, query = {}) {
  if (!supabase) return [];
  try {
    let q = supabase.from(table).select(query.select || '*');
    if (query.eq) for (const [k, v] of Object.entries(query.eq)) q = q.eq(k, v);
    if (query.order) q = q.order(query.order.col, { ascending: query.order.asc ?? true });
    if (query.limit) q = q.limit(query.limit);
    const { data, error } = await q;
    if (error) { console.error(`Supabase ${table}:`, error.message); return []; }
    return data || [];
  } catch (e) { console.error(`Supabase ${table}:`, e.message); return []; }
}

async function supaInsert(table, data) {
  if (!supabase) return null;
  try {
    const { data: result, error } = await supabase.from(table).insert(data).select().single();
    if (error) { console.error(`Supabase insert ${table}:`, error.message); return null; }
    return result;
  } catch (e) { console.error(`Supabase insert ${table}:`, e.message); return null; }
}

async function supaUpsert(table, data, onConflict) {
  if (!supabase) return null;
  try {
    const opts = onConflict ? { onConflict } : {};
    const { data: result, error } = await supabase.from(table).upsert(data, opts).select().single();
    if (error) { console.error(`Supabase upsert ${table}:`, error.message); return null; }
    return result;
  } catch (e) { console.error(`Supabase upsert ${table}:`, e.message); return null; }
}

// ── Product lookup ────────────────────────────────────────────────────────────
async function findProduct(slug) {
  const rows = await supaSelect('products', { eq: { slug }, limit: 1 });
  return rows[0] || null;
}

// ── Discount codes ──────────────────────────────────────────────────────────────
const DISCOUNT_CODES = {
  IFG20: { discount_pct: 20, description: '20% off your first ebook', active: true },
  FRUIT10: { discount_pct: 10, description: '10% off any recipe pack', active: true },
  CHALLENGE25: { discount_pct: 25, description: '25% off — Daily Challenge reward', active: true },
};

// ══════════════════════════════════════════════════════════════════════════════
// PUBLIC ROUTES
// ══════════════════════════════════════════════════════════════════════════════

// ── Health ──────────────────────────────────────────────────────────────────────
app.get('/api/health', (_, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

// ── Products ────────────────────────────────────────────────────────────────────
app.get('/api/products', async (_, res) => {
  try {
    const data = await supaSelect('products', { order: { col: 'title', asc: true } });
    res.json(data);
  } catch (e) { res.status(500).json({ detail: e.message }); }
});

app.get('/api/products/category/:category', async (req, res) => {
  try {
    const data = await supaSelect('products', { eq: { category: req.params.category } });
    res.json(data);
  } catch (e) { res.status(500).json({ detail: e.message }); }
});

app.get('/api/products/:slug', async (req, res) => {
  try {
    const product = await findProduct(req.params.slug);
    if (!product) return res.status(404).json({ detail: 'Product not found' });
    res.json(product);
  } catch (e) { res.status(500).json({ detail: e.message }); }
});

// ── Fruits ──────────────────────────────────────────────────────────────────────
app.get('/api/fruits', async (_, res) => {
  try { res.json(await supaSelect('fruits')); } catch (e) { res.json([]); }
});
app.get('/api/fruits/:slug', async (req, res) => {
  try {
    const rows = await supaSelect('fruits', { eq: { slug: req.params.slug }, limit: 1 });
    if (!rows.length) return res.status(404).json({ detail: 'Fruit not found' });
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ detail: e.message }); }
});

// ── Recipes ─────────────────────────────────────────────────────────────────────
app.get('/api/recipes', async (_, res) => {
  try { res.json(await supaSelect('recipes')); } catch (e) { res.json([]); }
});
app.get('/api/recipes/:slug', async (req, res) => {
  try {
    const rows = await supaSelect('recipes', { eq: { slug: req.params.slug }, limit: 1 });
    if (!rows.length) return res.status(404).json({ detail: 'Recipe not found' });
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ detail: e.message }); }
});

// ── Ebooks ──────────────────────────────────────────────────────────────────────
app.get('/api/ebooks', async (_, res) => {
  try { res.json(await supaSelect('ebooks')); } catch (e) { res.json([]); }
});
app.get('/api/ebooks/:id', async (req, res) => {
  try {
    const rows = await supaSelect('ebooks', { eq: { ebook_id: req.params.id }, limit: 1 });
    if (!rows.length) return res.status(404).json({ detail: 'Ebook not found' });
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ detail: e.message }); }
});

// ── Bundles ─────────────────────────────────────────────────────────────────────
app.get('/api/bundles', async (_, res) => {
  try { res.json(await supaSelect('bundles')); } catch (e) { res.json([]); }
});

// ── Config ──────────────────────────────────────────────────────────────────────
app.get('/api/config', (_, res) => res.json({ paypal_mode: process.env.PAYPAL_MODE || 'sandbox', currency: 'USD' }));

// ══════════════════════════════════════════════════════════════════════════════
// GAME API
// ══════════════════════════════════════════════════════════════════════════════

// ── Leaderboard ─────────────────────────────────────────────────────────────────
app.get('/api/game/leaderboard', async (req, res) => {
  try {
    if (!supabase) return res.json([]);
    const limit = Math.min(parseInt(req.query.limit) || 20, 50);
    const { data, error } = await supabase.from('leaderboard')
      .select('*').order('best_score', { ascending: false }).limit(limit);
    if (error || !data) return res.json([]);
    const entries = data.map((e, i) => {
      const emailVal = e.email || '';
      const playerName = emailVal.includes('@')
        ? emailVal.split('@')[0].replace(/\./g, ' ').replace(/\b\w/g, c => c.toUpperCase())
        : `Player ${i + 1}`;
      return { player_name: playerName, score: e.best_score, level: e.best_level, achievements: e.total_xp, games_played: e.games_played };
    });
    res.json(entries);
  } catch (e) { res.json([]); }
});

app.post('/api/game/leaderboard', async (req, res) => {
  try {
    const { player_name, score, level, achievements, email } = req.body;
    const sessionData = {
      score: Math.max(0, Math.min(Number(score) || 0, 99999)),
      level: Math.max(1, Math.min(Number(level) || 1, 99)),
      xp: Math.max(0, Number(achievements) || 0),
    };
    if (email && email.includes('@')) sessionData.email = email.trim().toLowerCase();
    if (supabase) await supabase.from('game_sessions').insert(sessionData);
    res.json({
      player_name: String(player_name || 'Anonymous').slice(0, 20),
      score: sessionData.score, level: sessionData.level, achievements: sessionData.xp,
      created_at: new Date().toISOString(),
    });
  } catch (e) { res.status(500).json({ detail: e.message }); }
});

// ── Daily Challenge ─────────────────────────────────────────────────────────────
function getDailyChallenge() {
  const today = new Date().toISOString().split('T')[0];
  const seed = parseInt(crypto.createHash('md5').update(today).digest('hex').slice(0, 8), 16);
  const dow = new Date().getDay();
  const targets = [175, 150, 200, 250, 300, 350, 200];
  const themes = [
    ['Soursop Sunday', 'Chill vibes, big scores!'],
    ['Mango Monday', 'Catch mangoes like a pro!'],
    ['Tropical Tuesday', 'Show off your island skills!'],
    ['Wildcard Wednesday', 'Anything goes — go wild!'],
    ['Throwback Thursday', 'Old school fruit catching!'],
    ['Frenzy Friday', 'Frenzy mode activated!'],
    ['Smoothie Saturday', 'Blend those scores up!'],
  ];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return {
    target_score: targets[dow] + (seed % 50),
    reward_code: 'CHALLENGE25',
    reward_description: '25% off any ebook — earned by completing the Daily Challenge!',
    expires_at: tomorrow.toISOString(),
    theme: themes[dow][0],
    theme_description: themes[dow][1],
    date: today,
  };
}

app.get('/api/game/daily-challenge', (_, res) => res.json(getDailyChallenge()));

app.post('/api/game/daily-challenge/complete', async (req, res) => {
  try {
    const { score, player_name, email } = req.body;
    const challenge = getDailyChallenge();
    if (score >= challenge.target_score) {
      if (supabase) {
        const sessionData = { score, level: Math.ceil(challenge.target_score / 50), xp: score };
        if (email && email.includes('@')) sessionData.email = email.trim().toLowerCase();
        await supabase.from('game_sessions').insert(sessionData);
      }
      res.json({ completed: true, reward_code: 'CHALLENGE25', reward_description: '25% off any ebook!',
        message: `You crushed it with ${score} pts! Use code CHALLENGE25 at checkout for 25% off.` });
    } else {
      res.json({ completed: false, score, target: challenge.target_score,
        remaining: challenge.target_score - score, message: `So close! You need ${challenge.target_score - score} more points. Play again!` });
    }
  } catch (e) { res.status(500).json({ detail: e.message }); }
});

app.get('/api/game/daily-challenge/leaderboard', async (req, res) => {
  try {
    if (!supabase) return res.json([]);
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase.from('game_sessions')
      .select('*').gte('played_at', `${today}T00:00:00`).lte('played_at', `${today}T23:59:59`)
      .order('score', { ascending: false }).limit(10);
    if (error || !data) return res.json([]);
    const entries = data.map((e, i) => {
      const emailVal = e.email || '';
      const playerName = emailVal.includes('@') ? emailVal.split('@')[0].replace(/\b\w/g, c => c.toUpperCase()) : `Player ${i + 1}`;
      return { player_name: playerName, score: e.score, level: e.level, date: today };
    });
    res.json(entries);
  } catch (e) { res.json([]); }
});

// ══════════════════════════════════════════════════════════════════════════════
// EMAIL + DISCOUNT
// ══════════════════════════════════════════════════════════════════════════════

app.post('/api/subscribe', async (req, res) => {
  try {
    const email = String(req.body.email || '').trim().toLowerCase();
    if (!email || !email.includes('@')) return res.status(400).json({ detail: 'Invalid email' });

    if (supabase) {
      const { data: existing } = await supabase.from('email_captures').select('email').eq('email', email).single();
      if (existing) return res.json({
        status: 'already_subscribed', email, discount_code: 'IFG20', discount_pct: 20,
        message: "You're already subscribed! Your code IFG20 is still valid." });

      await supabase.from('email_captures').insert({
        email, source: req.body.source || 'game',
        captured_at: new Date().toISOString(), unsubscribed: false,
      });
    }

    // Send welcome email via Resend (non-blocking)
    if (resend) {
      resend.emails.send({
        from: SENDER_EMAIL, to: [email],
        subject: 'Welcome! Your 20% OFF Code: IFG20 + Free Fruit Guide',
        html: buildWelcomeHtml(),
      }).then(r => console.log('Email sent:', r)).catch(e => console.warn('Email error:', e));
    }

    res.json({ status: 'subscribed', email, discount_code: 'IFG20', discount_pct: 20,
      message: 'Welcome! Use code IFG20 for 20% off your first ebook. Your free Caribbean Fruit Guide PDF is on its way!' });
  } catch (e) { res.status(500).json({ detail: e.message }); }
});

app.get('/api/subscribe/check/:email', async (req, res) => {
  try {
    const email = req.params.email.trim().toLowerCase();
    if (supabase) {
      const { data } = await supabase.from('email_captures').select('*').eq('email', email).single();
      if (data) return res.json({ subscribed: true, discount_code: 'IFG20', discount_pct: 20, ...data });
    }
    res.json({ subscribed: false });
  } catch { res.json({ subscribed: false }); }
});

app.post('/api/discount/validate', async (req, res) => {
  try {
    const code = String(req.body.code || '').trim().toUpperCase();
    if (DISCOUNT_CODES[code] && DISCOUNT_CODES[code].active) {
      return res.json({ valid: true, code, discount_pct: DISCOUNT_CODES[code].discount_pct, description: DISCOUNT_CODES[code].description });
    }
    res.json({ valid: false, code, message: 'Invalid or expired discount code' });
  } catch (e) { res.status(500).json({ detail: e.message }); }
});

// ── Checkout with discount ──────────────────────────────────────────────────────
app.post('/api/checkout/create-order', async (req, res) => {
  try {
    const { productSlug, email, discountCode } = req.body;
    if (!productSlug || !email) return res.status(400).json({ detail: 'productSlug and email required' });

    const product = await findProduct(productSlug);
    if (!product) return res.status(404).json({ detail: 'Product not found' });

    const code = String(discountCode || '').trim().toUpperCase();
    const discount_pct = (code && DISCOUNT_CODES[code]?.active) ? DISCOUNT_CODES[code].discount_pct : 0;
    const original_price = Number(product.price);
    const final_price = Math.round(original_price * (1 - discount_pct / 100) * 100) / 100;

    let order_id = crypto.randomUUID();
    if (supabase) {
      const { data } = await supabase.from('purchases').insert({
        email: email.toLowerCase(), product_slug: productSlug,
        amount: final_price, status: 'pending',
      }).select().single();
      if (data) order_id = data.id;
    }

    res.json({ order_id, product: product.title, original_price, discount_code: code || null,
      discount_pct, final_price, savings: Math.round((original_price - final_price) * 100) / 100 });
  } catch (e) { res.status(500).json({ detail: e.message }); }
});

// ══════════════════════════════════════════════════════════════════════════════
// ADMIN ROUTES
// ══════════════════════════════════════════════════════════════════════════════

app.post('/api/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ detail: 'Email and password required' });
    if (email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) return res.status(401).json({ detail: 'Invalid credentials' });

    const valid = ADMIN_HASH ? await bcrypt.compare(password, ADMIN_HASH) : password === 'admin123';
    if (!valid) return res.status(401).json({ detail: 'Invalid credentials' });

    const token = jwt.sign({ sub: email, email, role: 'admin' }, JWT_SECRET, { expiresIn: `${JWT_EXPIRY}h` });
    res.json({ access_token: token, token_type: 'bearer', email, role: 'admin' });
  } catch (e) { res.status(500).json({ detail: e.message }); }
});

app.post('/api/admin/sync-products', verifyToken, async (req, res) => {
  if (!supabase) return res.status(500).json({ detail: 'Supabase not configured' });
  const PRODUCTS = [
    { id: '11111111-1111-5111-a111-111111111101', slug: 'tropical-juice-smoothie-recipes', title: 'Tropical Juice & Smoothie Recipes', price: 9.99, category: 'recipe-pack', short_description: '50 Caribbean-inspired smoothie and juice recipes.', cover_image: 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=400', is_featured: false },
    { id: '11111111-1111-5111-a111-111111111102', slug: 'caribbean-fruit-guide', title: 'Caribbean Fruit Encyclopedia', price: 14.99, category: 'ebook', short_description: 'Complete guide to 100+ Caribbean fruits.', cover_image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400', is_featured: true },
    { id: '11111111-1111-5111-a111-111111111103', slug: 'fat-loss-smoothies', title: 'Caribbean Smoothies for Fat Loss', price: 12.99, category: 'recipe-pack', short_description: '30 calorie-counted tropical smoothie recipes.', cover_image: 'https://images.unsplash.com/photo-1638176066666-ffb2f013c7dd?w=400', is_featured: true },
    { id: '11111111-1111-5111-a111-111111111104', slug: 'healing-drinks', title: 'Tropical Superfruit Healing Drinks', price: 11.99, category: 'recipe-pack', short_description: '40 traditional Caribbean healing tonics.', cover_image: 'https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=400', is_featured: false },
    { id: '11111111-1111-5111-a111-111111111105', slug: 'pre-workout-drinks', title: 'Island Pre-Workout Natural Fuel', price: 10.99, category: 'recipe-pack', short_description: '25 fruit-based pre-workout energy drinks.', cover_image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400', is_featured: false },
    { id: '11111111-1111-5111-a111-111111111106', slug: 'mango-recipe-pack', title: 'Mango Recipe Collection', price: 7.99, category: 'recipe-pack', short_description: '15 creative mango recipes.', cover_image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=400', is_featured: false },
    { id: '11111111-1111-5111-a111-111111111107', slug: 'coconut-recipe-pack', title: 'Coconut Recipe Collection', price: 7.99, category: 'recipe-pack', short_description: '20 versatile coconut recipes.', cover_image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400', is_featured: false },
    { id: '11111111-1111-5111-a111-111111111108', slug: 'medicinal-leaves-guide', title: 'Caribbean Medicinal Leaves Guide', price: 13.99, category: 'ebook', short_description: '50 medicinal plants of the Caribbean.', cover_image: 'https://images.unsplash.com/photo-1515694346937-94d85e39f29a?w=400', is_featured: true },
    { id: '11111111-1111-5111-a111-111111111109', slug: 'papaya-recipe-pack', title: 'Papaya Recipe Collection', price: 6.99, category: 'recipe-pack', short_description: '12 refreshing papaya recipes.', cover_image: 'https://images.unsplash.com/photo-1517282009859-f000ec3b26fe?w=400', is_featured: false },
    { id: '11111111-1111-5111-a111-111111111110', slug: 'pineapple-recipe-pack', title: 'Pineapple Recipe Collection', price: 7.99, category: 'recipe-pack', short_description: '18 tropical pineapple recipes.', cover_image: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=400', is_featured: false },
    { id: '11111111-1111-5111-a111-111111111111', slug: 'soursop-recipe-pack', title: 'Soursop Recipe Collection', price: 7.99, category: 'recipe-pack', short_description: '10 soursop recipes.', cover_image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400', is_featured: false },
    { id: '11111111-1111-5111-a111-111111111112', slug: 'gym-energy', title: 'Tropical Gym Energy Recipes', price: 14.99, category: 'recipe-pack', short_description: '50+ gym-focused energy recipes.', cover_image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400', is_featured: true },
    { id: '11111111-1111-5111-a111-111111111113', slug: 'smoothie-recipes', title: 'Island Smoothie Collection', price: 8.99, category: 'recipe-pack', short_description: '30 island-inspired smoothie recipes.', cover_image: 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=400', is_featured: false },
  ];
  let synced = 0;
  for (const p of PRODUCTS) {
    const { error } = await supabase.from('products').upsert(p, { onConflict: 'slug' });
    if (!error) synced++;
    else console.error(`Sync failed for ${p.slug}:`, error.message);
  }
  res.json({ synced, total: PRODUCTS.length, source: 'supabase' });
});

// ── Admin CRUD ──────────────────────────────────────────────────────────────────
app.get('/api/admin/subscribers', verifyToken, async (req, res) => {
  try {
    const rows = await supaSelect('email_captures', { order: { col: 'captured_at', asc: false }, limit: 100 });
    res.json(rows);
  } catch { res.json([]); }
});

app.get('/api/admin/orders', verifyToken, async (req, res) => {
  try {
    const rows = await supaSelect('purchases', { order: { col: 'created_at', asc: false }, limit: 100 });
    res.json(rows);
  } catch { res.json([]); }
});

// ── Email HTML builder ──────────────────────────────────────────────────────────
function buildWelcomeHtml() {
  return `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f9f9f9;padding:0;">
    <div style="background:linear-gradient(135deg,#1F7A4D,#0A2010);padding:32px 24px;text-align:center;">
      <h1 style="color:#F9A825;font-size:28px;margin:0;">Welcome to IslandFruitGuide!</h1>
      <p style="color:#ffffffcc;font-size:14px;margin-top:8px;">Your Caribbean fruit journey starts here</p>
    </div>
    <div style="background:#ffffff;padding:32px 24px;">
      <p style="color:#333;font-size:16px;line-height:1.6;">Thank you for joining! Here's your exclusive discount:</p>
      <div style="background:#FFF8E1;border:2px dashed #F9A825;border-radius:12px;padding:24px;text-align:center;margin:24px 0;">
        <p style="color:#666;font-size:12px;text-transform:uppercase;letter-spacing:2px;margin:0 0 8px;">Your Discount Code</p>
        <p style="color:#1F7A4D;font-size:36px;font-weight:900;letter-spacing:4px;margin:0;">IFG20</p>
        <p style="color:#333;font-size:14px;margin-top:8px;font-weight:bold;">20% off your first ebook purchase</p>
      </div>
      <p style="color:#333;font-size:14px;line-height:1.6;">
        <strong>Your FREE Caribbean Fruit Guide</strong> covers 10 tropical fruits with health benefits and quick recipes.
      </p>
      <div style="text-align:center;margin:24px 0;">
        <a href="${FRONTEND_URL || 'https://islandfruitguide.com'}/store" style="display:inline-block;background:#1F7A4D;color:#fff;font-weight:bold;text-decoration:none;padding:14px 32px;border-radius:8px;font-size:16px;">
          Browse Our Store &rarr;
        </a>
      </div>
      <hr style="border:none;border-top:1px solid #eee;margin:24px 0;">
      <p style="color:#999;font-size:11px;text-align:center;">IslandFruitGuide.com &bull; Unsubscribe anytime</p>
    </div>
  </div>`;
}

// ── SPA fallback ────────────────────────────────────────────────────────────────
app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) return res.status(404).json({ detail: 'Not found' });
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ── Start ───────────────────────────────────────────────────────────────────────
async function start() {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`IslandFruitGuide backend running on port ${PORT} (Supabase-only)`);
  });
}
start();
