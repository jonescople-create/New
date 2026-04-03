import { useState } from "react";
import { useWindows } from "@/contexts/WindowContext";
import { FolderOpen, PenTool, Terminal, Mail, Settings, Activity } from "lucide-react";

const LOGO_URL = "https://customer-assets.emergentagent.com/job_glow-workspace/artifacts/2wqrcvq7_AURA%20LOGO.png";

const DOCK_APPS = [
  { id: "files", label: "File Explorer", icon: FolderOpen, bg: "linear-gradient(135deg, #4A9BD9 0%, #2E6B9E 100%)" },
  { id: "editor", label: "Text Editor", icon: PenTool, bg: "linear-gradient(135deg, #FF6B6B 0%, #C44545 100%)" },
  { id: "terminal", label: "Terminal", icon: Terminal, bg: "linear-gradient(135deg, #1a1a2e 0%, #0a0a15 100%)" },
  { id: "aura", label: "AuraOS", icon: null, bg: "transparent", isLogo: true },
  { id: "monitor", label: "System Monitor", icon: Activity, bg: "linear-gradient(135deg, #9D4CDD 0%, #6B2FA0 100%)" },
  { id: "email", label: "Email", icon: Mail, bg: "linear-gradient(135deg, #00C3FF 0%, #0088B0 100%)" },
  { id: "settings", label: "Settings", icon: Settings, bg: "linear-gradient(135deg, #666 0%, #444 100%)" },
];

export default function Dock() {
  const { windows, openWindow } = useWindows();
  const [hoveredId, setHoveredId] = useState(null);

  const handleClick = (appId) => {
    if (appId === "aura") return;
    openWindow(appId);
  };

  return (
    <div className="dock-wrapper" data-testid="dock">
      <div className="dock-container">
        {DOCK_APPS.map((app) => {
          const isOpen = windows.some(w => w.appId === app.id);
          const Icon = app.icon;
          return (
            <div
              key={app.id}
              className="dock-icon-wrapper"
              onMouseEnter={() => setHoveredId(app.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => handleClick(app.id)}
              data-testid={`dock-icon-${app.id}`}
            >
              <div className="dock-tooltip">{app.label}</div>
              <div
                className={`dock-icon ${isOpen ? "dock-icon-active" : ""}`}
                style={{
                  background: app.bg,
                  border: app.isLogo ? 'none' : '1px solid rgba(255,255,255,0.1)',
                  transform: hoveredId === app.id ? 'scale(1.35) translateY(-12px)' : 'scale(1)',
                }}
              >
                {app.isLogo ? (
                  <img src={LOGO_URL} alt="AuraOS" style={{ width: 38, height: 38, objectFit: 'contain' }} />
                ) : (
                  <Icon size={24} color="#fff" strokeWidth={1.5} />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
