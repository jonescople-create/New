/**
 * IslandFruitGuide — Supabase Data Layer
 * All database operations go through this file
 */
import { supabase, TABLES, BUCKETS, storageUrl } from './supabase';

// ── Types ────────────────────────────────────────────────────────────────────
export interface DBFruit {
  id: string; name: string; slug: string; description: string;
  scientific_name: string; emoji: string; image_url: string;
  health_benefits: string[]; category: string[]; seasonality: string;
  nutrition: string; how_to_eat: string; storage: string;
  related_fruit_ids: string[]; views: number;
}

export interface DBRecipe {
  id: string; title: string; slug: string; description: string;
  main_fruit: string; ingredients: string[]; instructions: string[];
  prep_time: string; cook_time: string; servings: number;
  difficulty: string; image_url: string; category: string[]; tips: string[];
}

export interface DBProduct {
  id: string; title: string; name: string; slug: string;
  description: string; short_description: string; price: number;
  original_price: number | null; category: string; cover_image: string;
  is_featured: boolean; download_count: number;
}

export interface DBOrder {
  paypal_order_id: string; paypal_capture_id: string;
  product_id: string; product_title: string;
  buyer_email: string; buyer_name: string; amount: number;
  discount_code?: string; discount_pct?: number;
}

// ── Analytics — Page Views ───────────────────────────────────────────────────
export async function trackPageView(path: string, pageType?: string, itemId?: string) {
  // Use sessionStorage to prevent counting same page multiple times
  const key = `pv_${path}`;
  try {
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, '1');
  } catch {}

  // Non-blocking — fire and forget
  supabase.from(TABLES.PAGE_VIEWS).insert({
    path,
    page_type: pageType,
    item_id: itemId,
    session_id: getSessionId(),
    device: getDevice(),
  }).then(() => {});
}

// ── Analytics — Increment Views ──────────────────────────────────────────────
export async function incrementFruitViews(id: string) {
  await supabase.rpc('increment_views', { table_name: 'fruits', record_id: id });
}

export async function incrementRecipeViews(id: string) {
  await supabase.rpc('increment_views', { table_name: 'recipes', record_id: id });
}

// ── Email Leads ──────────────────────────────────────────────────────────────
export async function captureEmailLead(
  email: string,
  name: string,
  source: string,
  offer = 'free_fruit_guide'
) {
  const { error } = await supabase.from(TABLES.LEADS).upsert(
    { email, name, source, offer, discount_code: 'IFG20' },
    { onConflict: 'email', ignoreDuplicates: true }
  );
  return !error;
}

// ── Orders ───────────────────────────────────────────────────────────────────
export async function saveOrder(order: DBOrder): Promise<string | null> {
  const { data, error } = await supabase.rpc('complete_order', {
    p_paypal_order_id: order.paypal_order_id,
    p_paypal_capture_id: order.paypal_capture_id,
    p_product_id: order.product_id,
    p_product_title: order.product_title,
    p_buyer_email: order.buyer_email,
    p_buyer_name: order.buyer_name,
    p_amount: order.amount,
  });
  if (error) { console.error('Order save error:', error); return null; }
  return data as string;
}

export async function getOrderByEmail(email: string) {
  const { data } = await supabase.from(TABLES.ORDERS)
    .select('*').eq('buyer_email', email).eq('status','completed')
    .order('completed_at', { ascending: false });
  return data || [];
}

// ── Wishlist (Supabase-backed, cross-device) ─────────────────────────────────
export async function addToWishlist(itemType: string, itemId: string, itemName: string) {
  const { error } = await supabase.from(TABLES.WISHLIST).upsert(
    { session_id: getSessionId(), item_type: itemType, item_id: itemId, item_name: itemName },
    { onConflict: 'session_id,item_type,item_id', ignoreDuplicates: true }
  );
  return !error;
}

export async function removeFromWishlist(itemType: string, itemId: string) {
  const { error } = await supabase.from(TABLES.WISHLIST)
    .delete().eq('session_id', getSessionId()).eq('item_type', itemType).eq('item_id', itemId);
  return !error;
}

export async function getWishlist() {
  const { data } = await supabase.from(TABLES.WISHLIST)
    .select('*').eq('session_id', getSessionId());
  return data || [];
}

// ── Discount Code Validation ─────────────────────────────────────────────────
export async function validateDiscountCode(code: string): Promise<{ valid: boolean; pct: number; message: string }> {
  const { data, error } = await supabase.from('discount_codes')
    .select('discount_pct, is_active, max_uses, use_count, expires_at')
    .eq('code', code.toUpperCase())
    .single();

  if (error || !data) return { valid: false, pct: 0, message: 'Invalid code' };
  if (!data.is_active) return { valid: false, pct: 0, message: 'Code is no longer active' };
  if (data.expires_at && new Date(data.expires_at) < new Date()) return { valid: false, pct: 0, message: 'Code has expired' };
  if (data.max_uses && data.use_count >= data.max_uses) return { valid: false, pct: 0, message: 'Code has reached its usage limit' };
  return { valid: true, pct: data.discount_pct, message: `${data.discount_pct}% off applied!` };
}

// ── Product Reviews ──────────────────────────────────────────────────────────
export async function getProductReviews(productId: string) {
  const { data } = await supabase.from('product_reviews')
    .select('*').eq('product_id', productId).eq('is_approved', true)
    .order('created_at', { ascending: false });
  return data || [];
}

export async function submitReview(review: {
  product_id: string; reviewer_name: string; reviewer_location: string;
  rating: number; review_text: string;
}) {
  const { error } = await supabase.from('product_reviews').insert(review);
  return !error;
}

// ── Quiz Results ──────────────────────────────────────────────────────────────
export async function saveQuizResult(score: number, total: number, answers: object[]) {
  await supabase.from(TABLES.QUIZ_RESULTS).insert({
    session_id: getSessionId(),
    score, total_questions: total,
    percentage: Math.round(score / total * 100),
    answers,
  });
}

// ── Storage Helpers ───────────────────────────────────────────────────────────
export function getFruitImageUrl(filename: string): string {
  return storageUrl(BUCKETS.FRUIT_IMAGES, filename);
}

export function getEbookCoverUrl(filename: string): string {
  return storageUrl(BUCKETS.EBOOK_COVERS, filename);
}

export async function uploadFruitImage(file: File, filename: string): Promise<string | null> {
  const { data, error } = await supabase.storage
    .from(BUCKETS.FRUIT_IMAGES).upload(filename, file, { upsert: true });
  if (error) return null;
  return storageUrl(BUCKETS.FRUIT_IMAGES, data.path);
}

// ── Utilities ─────────────────────────────────────────────────────────────────
function getSessionId(): string {
  try {
    let id = localStorage.getItem('ifg_session_id');
    if (!id) {
      id = `s_${Date.now()}_${Math.random().toString(36).substring(2)}`;
      localStorage.setItem('ifg_session_id', id);
    }
    return id;
  } catch {
    return `temp_${Date.now()}`;
  }
}

function getDevice(): string {
  const ua = navigator.userAgent;
  if (/mobile/i.test(ua)) return 'mobile';
  if (/tablet|ipad/i.test(ua)) return 'tablet';
  return 'desktop';
}
