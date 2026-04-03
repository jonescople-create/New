import { WindowProvider, useWindows } from "@/contexts/WindowContext";
import { useAuth } from "@/contexts/AuthContext";
import TopBar from "@/components/desktop/TopBar";
import Dock from "@/components/desktop/Dock";
import Window from "@/components/desktop/Window";
import ControlPanel from "@/components/desktop/ControlPanel";
import { useState, useEffect, useCallback } from "react";

const LOGO_URL = "https://customer-assets.emergentagent.com/job_glow-workspace/artifacts/2wqrcvq7_AURA%20LOGO.png";

const WALLPAPERS = [
  "https://images.unsplash.com/photo-1680486481682-6828194ec366?w=1920&q=80",
  "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=1920&q=80",
  "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1920&q=80",
  "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1920&q=80",
];

function DesktopShell() {
  const { windows, openWindow } = useWindows();
  const { user } = useAuth();
  const [showControlPanel, setShowControlPanel] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);

  const wallpaperIndex = user?.settings?.wallpaper_index || 0;
  const wallpaperUrl = WALLPAPERS[wallpaperIndex] || WALLPAPERS[0];

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (e.clientX <= 2 && e.clientY >= window.innerHeight - 2) {
        setShowDashboard(true);
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleDashboardAppClick = useCallback((appId) => {
    openWindow(appId);
    setShowDashboard(false);
  }, [openWindow]);

  const visibleWindows = windows.filter(w => !w.minimized);

  return (
    <div className="desktop-shell" data-testid="desktop-shell">
      {/* Cosmic Background */}
      <div className="cosmic-bg">
        <div
          className="cosmic-bg-image"
          style={{ backgroundImage: `url(${wallpaperUrl})` }}
          data-testid="desktop-wallpaper"
        />
        <div className="cosmic-bg-overlay" />
        <div className="cosmic-orb cosmic-orb-1" />
        <div className="cosmic-orb cosmic-orb-2" />
        <div className="cosmic-orb cosmic-orb-3" />
        <div className="cosmic-orb cosmic-orb-4" />
      </div>

      {/* Centered Logo */}
      <div className="desktop-logo-center" data-testid="desktop-logo">
        <img src={LOGO_URL} alt="AuraOS" />
        <span>AuraOS</span>
      </div>

      {/* Top Bar */}
      <TopBar onToggleControlPanel={() => setShowControlPanel(p => !p)} />

      {/* Windows */}
      {visibleWindows.map(win => (
        <Window key={win.id} windowData={win} />
      ))}

      {/* Dock */}
      <Dock />

      {/* Control Panel */}
      {showControlPanel && (
        <ControlPanel onClose={() => setShowControlPanel(false)} />
      )}

      {/* Dashboard Overlay */}
      {showDashboard && (
        <div
          className="dashboard-overlay"
          onClick={(e) => { if (e.target === e.currentTarget) setShowDashboard(false); }}
          data-testid="dashboard-overlay"
        >
          <div className="dashboard-grid">
            {[
              { id: "files", label: "File Explorer", icon: "folder" },
              { id: "editor", label: "Text Editor", icon: "edit" },
              { id: "terminal", label: "Terminal", icon: "terminal" },
              { id: "monitor", label: "System Monitor", icon: "activity" },
              { id: "email", label: "Email", icon: "mail" },
              { id: "settings", label: "Settings", icon: "settings" },
            ].map(app => (
              <div
                key={app.id}
                className="dashboard-app-card"
                onClick={() => handleDashboardAppClick(app.id)}
                data-testid={`dashboard-app-${app.id}`}
              >
                <DashboardIcon type={app.icon} />
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>{app.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function DashboardIcon({ type }) {
  const style = { width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' };
  const icons = {
    folder: <svg style={style} viewBox="0 0 24 24" fill="none" stroke="#6CB4EE" strokeWidth="1.5"><path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/></svg>,
    edit: <svg style={style} viewBox="0 0 24 24" fill="none" stroke="#FF0055" strokeWidth="1.5"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
    terminal: <svg style={style} viewBox="0 0 24 24" fill="none" stroke="#28c840" strokeWidth="1.5"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>,
    activity: <svg style={style} viewBox="0 0 24 24" fill="none" stroke="#9D4CDD" strokeWidth="1.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
    mail: <svg style={style} viewBox="0 0 24 24" fill="none" stroke="#00C3FF" strokeWidth="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
    settings: <svg style={style} viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
  };
  return icons[type] || null;
}

export default function Desktop() {
  return (
    <WindowProvider>
      <DesktopShell />
    </WindowProvider>
  );
}
