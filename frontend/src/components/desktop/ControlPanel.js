import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Wifi, Bluetooth, Volume2, Bell, Sun, Moon, LogOut } from "lucide-react";
import { Slider } from "@/components/ui/slider";

const LOGO_URL = "https://customer-assets.emergentagent.com/job_glow-workspace/artifacts/2wqrcvq7_AURA%20LOGO.png";

export default function ControlPanel({ onClose }) {
  const { user, logout } = useAuth();
  const [wifi, setWifi] = useState(true);
  const [bluetooth, setBluetooth] = useState(true);
  const [volume, setVolume] = useState(70);

  return (
    <div className="control-panel" data-testid="control-panel" onClick={(e) => e.stopPropagation()}>
      <div className="control-panel-grid">
        <div
          className={`control-toggle ${wifi ? "active" : ""}`}
          onClick={() => setWifi(!wifi)}
          data-testid="control-wifi"
        >
          <Wifi size={16} />
          <span>Wi-Fi</span>
        </div>
        <div
          className={`control-toggle ${bluetooth ? "active" : ""}`}
          onClick={() => setBluetooth(!bluetooth)}
          data-testid="control-bluetooth"
        >
          <Bluetooth size={16} />
          <span>Bluetooth</span>
        </div>
        <div className="control-toggle active" data-testid="control-volume-toggle">
          <Volume2 size={16} />
          <span>Sound</span>
        </div>
        <div className="control-toggle" data-testid="control-notifications">
          <Bell size={16} />
          <span>Alerts</span>
        </div>
      </div>

      <div style={{ padding: '0 4px', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <Sun size={14} style={{ color: 'rgba(255,255,255,0.4)' }} />
          <div style={{ flex: 1 }}>
            <Slider
              value={[volume]}
              max={100}
              step={1}
              onValueChange={([v]) => setVolume(v)}
              data-testid="control-brightness-slider"
            />
          </div>
          <Moon size={14} style={{ color: 'rgba(255,255,255,0.4)' }} />
        </div>
      </div>

      <div
        style={{
          display: 'flex', alignItems: 'center', gap: 10, padding: '12px',
          background: 'rgba(255,255,255,0.04)', borderRadius: 12, marginBottom: 12
        }}
      >
        <img src={LOGO_URL} alt="AuraOS" style={{ width: 28, height: 28, objectFit: 'contain' }} />
        <div>
          <div style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.9)' }}>AuraOS</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{user?.email}</div>
        </div>
      </div>

      <div
        style={{
          display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px',
          borderRadius: 10, cursor: 'pointer', color: 'rgba(255,255,255,0.5)',
          transition: 'all 0.15s ease', fontSize: 13
        }}
        onClick={logout}
        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,0,55,0.1)'; e.currentTarget.style.color = '#FF6B8A'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}
        data-testid="control-logout"
      >
        <LogOut size={15} />
        <span>Sign Out</span>
      </div>
    </div>
  );
}
