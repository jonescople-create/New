import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Missing Supabase env vars — check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: false },
  global: {
    headers: { 'x-application-name': 'islandfruitguide' }
  }
});

// ── Storage bucket helpers ──────────────────────────────────────────────────
const STORAGE_BASE = `${SUPABASE_URL}/storage/v1/object/public`;

export const storageUrl = (bucket: string, path: string) =>
  `${STORAGE_BASE}/${bucket}/${path}`;

export const BUCKETS = {
  FRUIT_IMAGES: 'fruit-images',
  BRAND_ASSETS: 'brand-assets',
  RECIPE_IMAGES: 'recipe-images',
  EBOOK_COVERS: 'ebook-covers',
  EBOOK_FILES: 'ebook-files',
  LEAF_IMAGES: 'leaf-images',
  USER_UPLOADS: 'user-uploads',
} as const;

// ── Database table names ────────────────────────────────────────────────────
export const TABLES = {
  FRUITS: 'fruits',
  RECIPES: 'recipes',
  PRODUCTS: 'products',
  MEDICINAL_LEAVES: 'medicinal_leaves',
  ORDERS: 'orders',
  LEADS: 'email_leads',
  PAGE_VIEWS: 'page_views',
  WISHLIST: 'wishlists',
  QUIZ_RESULTS: 'quiz_results',
  BLOG_POSTS: 'blog_posts',
} as const;

export type Tables = typeof TABLES[keyof typeof TABLES];
