import { createClient } from "@supabase/supabase-js";

const supabaseUrl = (import.meta as ImportMeta & { env: Record<string, string> }).env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = (import.meta as ImportMeta & { env: Record<string, string> }).env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!supabaseUrl || !supabaseAnonKey) {
  // eslint-disable-next-line no-console
  console.warn("Supabase environment variables are missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.");
}

export const supabase = createClient(
  supabaseUrl ?? "https://your-project.supabase.co",
  supabaseAnonKey ?? "public-anon-key"
);
