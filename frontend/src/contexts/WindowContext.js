import { createContext, useContext, useState, useCallback, useRef } from "react";

const WindowContext = createContext(null);

export const APP_CONFIGS = {
  settings: { title: "AuraOS Settings", defaultWidth: 780, defaultHeight: 520, minWidth: 600, minHeight: 400 },
  files: { title: "File Explorer", defaultWidth: 680, defaultHeight: 480, minWidth: 400, minHeight: 300 },
  terminal: { title: "Terminal", defaultWidth: 620, defaultHeight: 400, minWidth: 350, minHeight: 250 },
  editor: { title: "Text Editor", defaultWidth: 660, defaultHeight: 480, minWidth: 400, minHeight: 300 },
  monitor: { title: "System Monitor", defaultWidth: 720, defaultHeight: 500, minWidth: 500, minHeight: 350 },
  email: { title: "Email", defaultWidth: 760, defaultHeight: 520, minWidth: 500, minHeight: 350 },
};

export function WindowProvider({ children }) {
  const [windows, setWindows] = useState([]);
  const zCounter = useRef(100);

  const openWindow = useCallback((appId) => {
    const config = APP_CONFIGS[appId];
    if (!config) return;

    setWindows(prev => {
      const existing = prev.find(w => w.appId === appId);
      if (existing) {
        zCounter.current += 1;
        return prev.map(w => w.id === existing.id ? { ...w, minimized: false, zIndex: zCounter.current } : w);
      }
      const offset = (prev.length % 6) * 35;
      zCounter.current += 1;
      return [...prev, {
        id: `${appId}-${Date.now()}`,
        appId,
        title: config.title,
        x: 120 + offset,
        y: 60 + offset,
        width: config.defaultWidth,
        height: config.defaultHeight,
        zIndex: zCounter.current,
        minimized: false,
        maximized: false,
      }];
    });
  }, []);

  const closeWindow = useCallback((id) => {
    setWindows(prev => prev.filter(w => w.id !== id));
  }, []);

  const focusWindow = useCallback((id) => {
    zCounter.current += 1;
    const z = zCounter.current;
    setWindows(prev => prev.map(w => w.id === id ? { ...w, zIndex: z, minimized: false } : w));
  }, []);

  const minimizeWindow = useCallback((id) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, minimized: true } : w));
  }, []);

  const maximizeWindow = useCallback((id) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, maximized: !w.maximized } : w));
  }, []);

  const updateWindowPosition = useCallback((id, x, y) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, x, y } : w));
  }, []);

  const updateWindowSize = useCallback((id, width, height) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, width, height } : w));
  }, []);

  return (
    <WindowContext.Provider value={{ windows, openWindow, closeWindow, focusWindow, minimizeWindow, maximizeWindow, updateWindowPosition, updateWindowSize }}>
      {children}
    </WindowContext.Provider>
  );
}

export function useWindows() {
  const ctx = useContext(WindowContext);
  if (!ctx) throw new Error("useWindows must be inside WindowProvider");
  return ctx;
}
