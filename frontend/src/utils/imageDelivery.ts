export type SupabaseImageTransform = {
  width: number;
  height?: number;
  quality?: number;
  resize?: "cover" | "contain" | "fill";
  format?: "webp" | "jpeg" | "png";
};

const OBJECT_PUBLIC_SEGMENT = "/storage/v1/object/public/";

export function isSupabasePublicObjectUrl(url: string) {
  try {
    return url.includes(OBJECT_PUBLIC_SEGMENT);
  } catch {
    return false;
  }
}

/**
 * Convert a Supabase Storage public object URL to an Image Transform URL.
 * Example:
 *  object: https://<ref>.supabase.co/storage/v1/object/public/fruit-images/fruit-mango.jpg
 *  render: https://<ref>.supabase.co/storage/v1/render/image/public/fruit-images/fruit-mango.jpg?width=600&quality=75&format=webp
 */
export function toSupabaseRenderImageUrl(objectPublicUrl: string, t: SupabaseImageTransform) {
  if (!isSupabasePublicObjectUrl(objectPublicUrl)) return objectPublicUrl;

  const [base, after] = objectPublicUrl.split(OBJECT_PUBLIC_SEGMENT);
  if (!base || !after) return objectPublicUrl;

  const params = new URLSearchParams();
  params.set("width", String(t.width));
  if (t.height) params.set("height", String(t.height));
  params.set("quality", String(t.quality ?? 75));
  params.set("resize", t.resize ?? "cover");
  params.set("format", t.format ?? "webp");

  return `${base}/storage/v1/render/image/public/${after}?${params.toString()}`;
}

export function buildSupabaseSrcSet(objectPublicUrl: string, base: { width: number; height?: number }) {
  if (!isSupabasePublicObjectUrl(objectPublicUrl)) return undefined;
  const w1 = base.width;
  const w2 = Math.round(base.width * 2);
  const h1 = base.height;
  const h2 = base.height ? Math.round(base.height * 2) : undefined;

  const s1 = toSupabaseRenderImageUrl(objectPublicUrl, { width: w1, height: h1, quality: 75, format: "webp" });
  const s2 = toSupabaseRenderImageUrl(objectPublicUrl, { width: w2, height: h2, quality: 70, format: "webp" });
  return `${s1} ${w1}w, ${s2} ${w2}w`;
}
