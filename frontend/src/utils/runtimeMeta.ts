type RobotsMode = "index,follow" | "noindex,follow" | "noindex,nofollow";

function ensureMeta(name: string): HTMLMetaElement {
  let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("name", name);
    document.head.appendChild(el);
  }
  return el;
}

function ensureCanonical(): HTMLLinkElement {
  let el = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  return el;
}

export function setRuntimeRobots(content: RobotsMode) {
  const meta = ensureMeta("robots");
  meta.setAttribute("content", content);
}

export function setRuntimeCanonical(href: string) {
  const link = ensureCanonical();
  link.setAttribute("href", href);
}

export function setRuntimeTitle(title: string) {
  document.title = title;
}

export function withRuntimeMeta<T extends { title?: string; canonical?: string; robots?: RobotsMode }>(
  meta: T,
  fn: () => void
) {
  const originalTitle = document.title;
  const originalRobots = (document.querySelector('meta[name="robots"]') as HTMLMetaElement | null)?.content;
  const originalCanonical = (document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null)?.href;

  if (meta.title) setRuntimeTitle(meta.title);
  if (meta.robots) setRuntimeRobots(meta.robots);
  if (meta.canonical) setRuntimeCanonical(meta.canonical);

  fn();

  return () => {
    setRuntimeTitle(originalTitle);
    if (originalRobots) setRuntimeRobots(originalRobots as RobotsMode);
    if (originalCanonical) setRuntimeCanonical(originalCanonical);
  };
}
