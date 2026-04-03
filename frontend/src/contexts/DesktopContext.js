import { createContext, useContext, useState, useCallback } from "react";

const DesktopContext = createContext(null);

const DEFAULT_SETTINGS = {
  aura_intensity: 0.5,
  color_shift_mode: "static",
  accent_color: "#9D4CDD",
  transparency: 0.8,
  system_wide_aura: true,
  wallpaper_color_match: false,
  wallpaper_index: 0,
};

function loadSettings() {
  try {
    const saved = localStorage.getItem("auraos_settings");
    return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : { ...DEFAULT_SETTINGS };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function DesktopProvider({ children }) {
  const [unlocked, setUnlocked] = useState(false);
  const [settings, setSettings] = useState(loadSettings);
  const [notifications, setNotifications] = useState([
    { id: 1, message: "Welcome to AuraOS", time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), read: false },
  ]);

  const unlock = useCallback(() => setUnlocked(true), []);
  const lock = useCallback(() => setUnlocked(false), []);

  const updateSetting = useCallback((key, value) => {
    setSettings(prev => {
      const next = { ...prev, [key]: value };
      localStorage.setItem("auraos_settings", JSON.stringify(next));
      return next;
    });
  }, []);

  const addNotification = useCallback((message) => {
    setNotifications(prev => [
      { id: Date.now(), message, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), read: false },
      ...prev,
    ].slice(0, 30));
  }, []);

  const clearNotifications = useCallback(() => setNotifications([]), []);

  const markRead = useCallback((id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  return (
    <DesktopContext.Provider value={{
      unlocked, settings, notifications,
      unlock, lock, updateSetting, addNotification, clearNotifications, markRead,
    }}>
      {children}
    </DesktopContext.Provider>
  );
}

export function useDesktop() {
  const ctx = useContext(DesktopContext);
  if (!ctx) throw new Error("useDesktop must be inside DesktopProvider");
  return ctx;
}
