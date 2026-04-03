import { useMemo, useState } from "react";
import { buildSupabaseSrcSet, isSupabasePublicObjectUrl, toSupabaseRenderImageUrl } from "../utils/imageDelivery";

type Props = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  /** If true, loads eagerly and sets fetchPriority=high. */
  priority?: boolean;
  sizes?: string;
  /** Emoji fallback (used if the image fails to load). */
  fallbackEmoji?: string;
  /** If true, hides the image entirely on error instead of showing fallback. */
  hideOnError?: boolean;
};

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  priority,
  sizes,
  fallbackEmoji,
  hideOnError,
}: Props) {
  const [failed, setFailed] = useState(false);
  const [tryOriginal, setTryOriginal] = useState(false);

  const optimizedSrc = useMemo(() => {
    if (tryOriginal) return src;
    // If Supabase public object URL, deliver an appropriately sized WebP.
    if (isSupabasePublicObjectUrl(src)) {
      return toSupabaseRenderImageUrl(src, {
        width: width ?? 400,
        height: height ?? 400,
        quality: priority ? 80 : 75,
        format: "webp",
        resize: "cover",
      });
    }
    return src;
  }, [src, width, height, priority, tryOriginal]);

  const srcSet = useMemo(() => {
    if (tryOriginal) return undefined;
    if (!isSupabasePublicObjectUrl(src)) return undefined;
    return buildSupabaseSrcSet(src, { width: width ?? 400, height: height ?? 400 });
  }, [src, width, height, tryOriginal]);

  if (failed) {
    if (hideOnError) return null;
    if (fallbackEmoji) {
      return (
        <span
          aria-label={alt}
          role="img"
          className={className}
          style={{ display: "inline-flex", alignItems: "center", justifyContent: "center" }}
        >
          {fallbackEmoji}
        </span>
      );
    }
    return null;
  }

  return (
    <img
      src={optimizedSrc}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt}
      width={width}
      height={height}
      className={className}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={priority ? "high" : "auto"}
      onError={() => {
        // If the transformed render URL fails, retry the original object URL once.
        if (!tryOriginal && optimizedSrc !== src) {
          setTryOriginal(true);
          return;
        }
        setFailed(true);
      }}
    />
  );
}
