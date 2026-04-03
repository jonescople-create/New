import { navigate } from "../App";

interface BreadcrumbItem {
  label: string;
  path?: string;
  href?: string;
}

export function Breadcrumb({ items, dark }: { items: BreadcrumbItem[]; dark?: boolean }) {
  const baseColor = dark ? "text-white/70" : "text-charcoal-light";
  const activeColor = dark ? "text-white font-medium" : "text-charcoal font-medium";
  const hoverColor = dark ? "hover:text-white" : "hover:text-leaf";

  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className={`flex items-center gap-1 text-sm ${baseColor} flex-wrap`}>
        <li>
          <button onClick={() => navigate("/")} className={`${hoverColor} transition-colors`}>Home</button>
        </li>
        {items.map((item, i) => {
          const dest = item.href || item.path;
          return (
            <li key={i} className="flex items-center gap-1">
              <svg className="w-4 h-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              {dest ? (
                <button onClick={() => navigate(dest)} className={`${hoverColor} transition-colors`}>{item.label}</button>
              ) : (
                <span className={activeColor}>{item.label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
