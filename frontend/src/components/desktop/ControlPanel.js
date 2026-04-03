import { useState } from "react";
import { useDesktop } from "@/contexts/DesktopContext";
import { Wifi, Bluetooth, Volume2, Bell, Sun, Moon, Lock } from "lucide-react";
import { Slider } from "@/components/ui/slider";

const LOGO_URL = "https://customer-assets.emergentagent.com/job_glow-workspace/artifacts/2wqrcvq7_AURA%20LOGO.png";

export default function ControlPanel({ onClose }) {
  const { lock, notifications, clearNotifications } = useDesktop();
  const [wifi, setWifi] = useState(true);
  const [bluetooth, setBluetooth] = useState(true);
  const [volume, setVolume] = useState(70);
  const [showNotifications, setShowNotifications] = useState(false);

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
        <div
          className={`control-toggle ${showNotifications ? "active" : ""}`}
          onClick={() => setShowNotifications(!showNotifications)}
          data-testid="control-notifications"
        >
          <Bell size={16} />
          <span>Alerts {notifications.length > 0 ? `(${notifications.length})` : ""}</span>
        </div>
      </div>

      {/* Brightness slider */}
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

      {/* Notifications */}
      {showNotifications && (
        <div style={{ marginBottom: 12 }} data-testid="control-notification-list">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.7)' }}>Notifications</span>
            {notifications.length > 0 && (
              <span
                onClick={clearNotifications}
                style={{ fontSize: 11, cursor: 'pointer', color: '#6CB4EE' }}
                data-testid="control-clear-notifications"
              >
                Clear All
              </span>
            )}
          </div>
          <div style={{ maxHeight: 150, overflowY: 'auto' }}>
            {notifications.length === 0 ? (
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', textAlign: 'center', padding: 12 }}>
                No notifications
              </div>
            ) : notifications.slice(0, 8).map(n => (
              <div key={n.id} style={{
                padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: 12
              }}>
                <div style={{ color: 'rgba(255,255,255,0.65)' }}>{n.message}</div>
                <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: 10, marginTop: 2 }}>{n.time}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AuraOS branding */}
      <div
        style={{
          display: 'flex', alignItems: 'center', gap: 10, padding: '12px',
          background: 'rgba(255,255,255,0.04)', borderRadius: 12, marginBottom: 12
        }}
      >
        <img src={LOGO_URL} alt="AuraOS" style={{ width: 28, height: 28, objectFit: 'contain' }} />
        <div>
          <div style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.9)' }}>AuraOS</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>v1.0.0</div>
        </div>
      </div>

      {/* Lock button */}
      <button
        style={{
          display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px',
          borderRadius: 10, cursor: 'pointer', color: '#6CB4EE',
          fontSize: 13, background: 'rgba(100,180,238,0.08)', border: '1px solid rgba(100,180,238,0.15)',
          width: '100%', fontFamily: 'Manrope, sans-serif', transition: 'all 0.15s ease'
        }}
        onClick={lock}
        data-testid="control-lock"
      >
        <Lock size={15} />
        <span>Lock Screen</span>
      </button>
    </div>
  );
}
