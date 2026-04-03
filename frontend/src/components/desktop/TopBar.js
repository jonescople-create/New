import { useState, useEffect } from "react";
import { useDesktop } from "@/contexts/DesktopContext";
import { Wifi, Bluetooth, Volume2, Bell, ChevronDown } from "lucide-react";

const LOGO_URL = "https://customer-assets.emergentagent.com/job_glow-workspace/artifacts/2wqrcvq7_AURA%20LOGO.png";

export default function TopBar({ onToggleControlPanel }) {
  const { notifications } = useDesktop();
  const [time, setTime] = useState(new Date());

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 30000);
    return () => clearInterval(interval);
  }, []);

  const timeStr = time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const dateStr = time.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" });

  return (
    <div className="top-bar" data-testid="top-bar">
      <div className="top-bar-left">
        <img src={LOGO_URL} alt="AuraOS" className="top-bar-logo" data-testid="top-bar-logo" />
        <span style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.8)', fontFamily: 'Outfit, sans-serif' }}>
          AuraOS
        </span>
      </div>
      <div className="top-bar-right">
        <span className="top-bar-time" data-testid="top-bar-date">{dateStr}</span>
        <span className="top-bar-time" data-testid="top-bar-time">{timeStr}</span>
        <div className="top-bar-icon" data-testid="top-bar-wifi"><Wifi size={15} /></div>
        <div className="top-bar-icon" data-testid="top-bar-bluetooth"><Bluetooth size={15} /></div>
        <div className="top-bar-icon" data-testid="top-bar-volume"><Volume2 size={15} /></div>
        <div
          className="top-bar-icon"
          onClick={onToggleControlPanel}
          data-testid="top-bar-control-panel-toggle"
          style={{ position: 'relative' }}
        >
          <Bell size={15} />
          {unreadCount > 0 && (
            <span style={{
              position: 'absolute', top: 2, right: 2, width: 8, height: 8,
              borderRadius: '50%', background: '#FF0055'
            }} data-testid="top-bar-notification-badge" />
          )}
        </div>
        <div
          className="top-bar-icon"
          style={{
            display: 'flex', alignItems: 'center', gap: 4, padding: '4px 8px',
            background: 'rgba(255,255,255,0.06)', borderRadius: 8
          }}
          onClick={onToggleControlPanel}
          data-testid="top-bar-user"
        >
          <ChevronDown size={12} />
        </div>
      </div>
    </div>
  );
}
