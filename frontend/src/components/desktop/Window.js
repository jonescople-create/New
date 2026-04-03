import { useRef, useCallback, useEffect, useState } from "react";
import { motion, useDragControls, useMotionValue } from "framer-motion";
import { useWindows, APP_CONFIGS } from "@/contexts/WindowContext";
import { useDesktop } from "@/contexts/DesktopContext";
import { X, Minus, Maximize2 } from "lucide-react";
import SettingsApp from "@/components/apps/SettingsApp";
import FileExplorer from "@/components/apps/FileExplorer";
import TerminalApp from "@/components/apps/Terminal";
import TextEditor from "@/components/apps/TextEditor";
import SystemMonitor from "@/components/apps/SystemMonitor";
import EmailApp from "@/components/apps/EmailApp";

const APP_COMPONENTS = {
  settings: SettingsApp,
  files: FileExplorer,
  terminal: TerminalApp,
  editor: TextEditor,
  monitor: SystemMonitor,
  email: EmailApp,
};

export default function Window({ windowData }) {
  const { closeWindow, focusWindow, minimizeWindow, maximizeWindow, updateWindowPosition, updateWindowSize } = useWindows();
  const { settings } = useDesktop();
  const dragControls = useDragControls();
  const x = useMotionValue(windowData.x);
  const y = useMotionValue(windowData.y);
  const [isResizing, setIsResizing] = useState(false);
  const resizeRef = useRef({ x: 0, y: 0, w: 0, h: 0 });

  const accentColor = settings.accent_color || "#9D4CDD";
  const auraIntensity = settings.aura_intensity ?? 0.5;
  const systemWideAura = settings.system_wide_aura !== false;

  const config = APP_CONFIGS[windowData.appId] || { minWidth: 300, minHeight: 200 };

  useEffect(() => {
    if (windowData.maximized) {
      x.set(0);
      y.set(36);
    }
  }, [windowData.maximized, x, y]);

  const handleDragEnd = useCallback(() => {
    updateWindowPosition(windowData.id, x.get(), y.get());
  }, [windowData.id, updateWindowPosition, x, y]);

  // Resize logic
  const startResize = useCallback((e) => {
    e.stopPropagation();
    e.preventDefault();
    setIsResizing(true);
    resizeRef.current = { x: e.clientX, y: e.clientY, w: windowData.width, h: windowData.height };
  }, [windowData.width, windowData.height]);

  useEffect(() => {
    if (!isResizing) return;
    const handleMove = (e) => {
      const dx = e.clientX - resizeRef.current.x;
      const dy = e.clientY - resizeRef.current.y;
      const newW = Math.max(config.minWidth || 300, resizeRef.current.w + dx);
      const newH = Math.max(config.minHeight || 200, resizeRef.current.h + dy);
      updateWindowSize(windowData.id, newW, newH);
    };
    const handleUp = () => setIsResizing(false);
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };
  }, [isResizing, windowData.id, updateWindowSize, config.minWidth, config.minHeight]);

  const AppComponent = APP_COMPONENTS[windowData.appId];
  const auraColorRgba = hexToRgba(accentColor, auraIntensity * 0.3);

  return (
    <motion.div
      drag={!windowData.maximized && !isResizing}
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={true}
      dragTransition={{ bounceStiffness: 300, bounceDamping: 25 }}
      style={{
        x: windowData.maximized ? 0 : x,
        y: windowData.maximized ? 36 : y,
        width: windowData.maximized ? "100vw" : windowData.width,
        height: windowData.maximized ? "calc(100vh - 36px - 76px)" : windowData.height,
        zIndex: windowData.zIndex,
        position: "absolute",
        "--window-aura-color": auraColorRgba,
      }}
      initial={{ scale: 0.92, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.92, opacity: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      onDragEnd={handleDragEnd}
      onMouseDown={() => focusWindow(windowData.id)}
      className={`window-frame ${systemWideAura ? "aura-pulse" : ""} ${windowData.maximized ? "window-maximized" : ""}`}
      data-testid={`window-${windowData.appId}`}
    >
      <div
        className="window-titlebar"
        onPointerDown={(e) => { if (!windowData.maximized && !isResizing) dragControls.start(e); }}
        data-testid={`window-titlebar-${windowData.appId}`}
      >
        <div className="window-traffic-lights">
          <div className="window-traffic-light close" onClick={(e) => { e.stopPropagation(); closeWindow(windowData.id); }} data-testid={`window-close-${windowData.appId}`}><X size={8} /></div>
          <div className="window-traffic-light minimize" onClick={(e) => { e.stopPropagation(); minimizeWindow(windowData.id); }} data-testid={`window-minimize-${windowData.appId}`}><Minus size={8} /></div>
          <div className="window-traffic-light maximize" onClick={(e) => { e.stopPropagation(); maximizeWindow(windowData.id); }} data-testid={`window-maximize-${windowData.appId}`}><Maximize2 size={8} /></div>
        </div>
        <div className="window-title">{windowData.title}</div>
        <div style={{ width: 60 }} />
      </div>
      <div className="window-content">
        {AppComponent && <AppComponent />}
      </div>
      {/* Resize handle */}
      {!windowData.maximized && (
        <div className="window-resize-handle" onMouseDown={startResize} data-testid={`window-resize-${windowData.appId}`} />
      )}
    </motion.div>
  );
}

function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}
