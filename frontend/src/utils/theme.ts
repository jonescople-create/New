export type ThemeMode = "light" | "dark";

const STORAGE_KEY = "ifg_theme_mode";

const getSystemPreference = (): ThemeMode => {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

export const getInitialTheme = (): ThemeMode => {
  if (typeof window === "undefined") return "light";
  const stored = window.localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
  return stored ?? getSystemPreference();
};

export const applyTheme = (theme: ThemeMode) => {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", theme === "dark");
  document.documentElement.setAttribute("data-theme", theme);
  document.body.classList.toggle("dark", theme === "dark");
  window.localStorage.setItem(STORAGE_KEY, theme);
};

export const toggleTheme = (current: ThemeMode): ThemeMode => (current === "dark" ? "light" : "dark");
