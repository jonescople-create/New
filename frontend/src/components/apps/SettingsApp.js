import { useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { User, Monitor, Palette, Globe, Shield } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const LOGO_URL = "https://customer-assets.emergentagent.com/job_glow-workspace/artifacts/2wqrcvq7_AURA%20LOGO.png";

const ACCENT_COLORS = [
  "#6CB4EE", "#1B93A4", "#28c840", "#FFD700", "#FF8C00", "#FF0055", "#9D4CDD", "#8A2BE2", "#FF69B4"
];

const SIDEBAR_ITEMS = [
  { id: "profile", label: "Aura", sub: "User Profile", icon: User },
  { id: "system", label: "System", sub: "System", icon: Monitor },
  { id: "aura", label: "Aura Effects & Colors", sub: "Aura Effects & Colors", icon: Palette },
  { id: "network", label: "Network", sub: "Internet & Connections", icon: Globe },
  { id: "privacy", label: "Privacy", sub: "Security & Privacy", icon: Shield },
];

export default function SettingsApp() {
  const { user, updateSettings, logout } = useAuth();
  const [activeSection, setActiveSection] = useState("aura");
  const settings = user?.settings || {};

  const handleSettingChange = useCallback(async (key, value) => {
    const result = await updateSettings({ [key]: value });
    if (result) toast.success("Settings updated");
  }, [updateSettings]);

  return (
    <div className="settings-layout" data-testid="settings-app">
      <div className="settings-sidebar" data-testid="settings-sidebar">
        {SIDEBAR_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className={`settings-sidebar-item ${activeSection === item.id ? "active" : ""}`}
              onClick={() => setActiveSection(item.id)}
              data-testid={`settings-nav-${item.id}`}
            >
              <Icon size={18} color={activeSection === item.id ? "#9D4CDD" : "rgba(255,255,255,0.5)"} />
              <div className="settings-sidebar-label">
                <h4>{item.label}</h4>
                <p>{item.sub}</p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="settings-content" data-testid="settings-content">
        {activeSection === "aura" && (
          <AuraEffectsSection settings={settings} onChange={handleSettingChange} />
        )}
        {activeSection === "profile" && (
          <ProfileSection user={user} onLogout={logout} />
        )}
        {activeSection === "system" && <SystemSection />}
        {activeSection === "network" && <NetworkSection />}
        {activeSection === "privacy" && <PrivacySection />}
      </div>
    </div>
  );
}

function AuraEffectsSection({ settings, onChange }) {
  return (
    <div data-testid="settings-aura-section">
      <h3 className="settings-section-title">Aura Effects & Colors</h3>

      {/* Wallpaper Preview */}
      <div style={{
        width: '100%', height: 140, borderRadius: 12, overflow: 'hidden',
        background: 'linear-gradient(135deg, #0a0a2e, #1a1a4e)', marginBottom: 20,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        border: '1px solid rgba(255,255,255,0.08)'
      }}>
        <img src={LOGO_URL} alt="AuraOS" style={{ width: 80, height: 80, objectFit: 'contain' }} />
      </div>

      {/* Aura Intensity */}
      <div className="settings-control">
        <span className="settings-control-label">Aura Intensity</span>
        <div style={{ width: 200 }} className="rainbow-slider">
          <Slider
            value={[Math.round((settings.aura_intensity ?? 0.5) * 100)]}
            max={100}
            step={1}
            onValueChange={([v]) => onChange("aura_intensity", v / 100)}
            data-testid="settings-aura-intensity"
          />
        </div>
      </div>

      {/* Color Shift Mode */}
      <div className="settings-control">
        <span className="settings-control-label">Color Shift Mode</span>
        <Select
          value={settings.color_shift_mode || "static"}
          onValueChange={(v) => onChange("color_shift_mode", v)}
        >
          <SelectTrigger
            style={{ width: 160, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
            data-testid="settings-color-shift-mode"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="static">Static</SelectItem>
            <SelectItem value="cycle_slow">Cycle (Slow)</SelectItem>
            <SelectItem value="cycle_fast">Cycle (Fast)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Accent Palette */}
      <div className="settings-control" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 10 }}>
        <span className="settings-control-label">Accent Palette</span>
        <div className="accent-palette" data-testid="settings-accent-palette">
          {ACCENT_COLORS.map((color) => (
            <div
              key={color}
              className={`accent-dot ${settings.accent_color === color ? "selected" : ""}`}
              style={{ background: color }}
              onClick={() => onChange("accent_color", color)}
              data-testid={`accent-color-${color.replace('#', '')}`}
            />
          ))}
        </div>
      </div>

      {/* Interface Transparency */}
      <div className="settings-control">
        <span className="settings-control-label">Interface Transparency</span>
        <div style={{ width: 200 }} className="rainbow-slider">
          <Slider
            value={[Math.round((settings.transparency ?? 0.8) * 100)]}
            max={100}
            step={1}
            onValueChange={([v]) => onChange("transparency", v / 100)}
            data-testid="settings-transparency"
          />
        </div>
      </div>

      {/* Toggles */}
      <div className="settings-control">
        <span className="settings-control-label">Apply system-wide aura</span>
        <Switch
          checked={settings.system_wide_aura !== false}
          onCheckedChange={(v) => onChange("system_wide_aura", v)}
          data-testid="settings-system-wide-aura"
        />
      </div>

      <div className="settings-control">
        <span className="settings-control-label">Aura color matches current wallpaper</span>
        <Switch
          checked={settings.wallpaper_color_match === true}
          onCheckedChange={(v) => onChange("wallpaper_color_match", v)}
          data-testid="settings-wallpaper-color-match"
        />
      </div>
    </div>
  );
}

function ProfileSection({ user, onLogout }) {
  return (
    <div data-testid="settings-profile-section">
      <h3 className="settings-section-title">User Profile</h3>
      <div style={{
        padding: 20, borderRadius: 12, background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.06)', marginBottom: 16
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%',
            background: 'linear-gradient(135deg, #6CB4EE, #9D4CDD)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22, fontWeight: 600
          }}>
            {(user?.name || "U")[0].toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 500 }}>{user?.name}</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>{user?.email}</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              {user?.role}
            </div>
          </div>
        </div>
      </div>
      <button
        onClick={onLogout}
        style={{
          padding: '10px 20px', borderRadius: 10, border: '1px solid rgba(255,0,55,0.3)',
          background: 'rgba(255,0,55,0.1)', color: '#FF6B8A', cursor: 'pointer',
          fontSize: 13, fontFamily: 'Manrope, sans-serif'
        }}
        data-testid="settings-logout-button"
      >
        Sign Out
      </button>
    </div>
  );
}

function SystemSection() {
  return (
    <div data-testid="settings-system-section">
      <h3 className="settings-section-title">System</h3>
      <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>
        <p style={{ marginBottom: 12 }}>AuraOS v1.0.0</p>
        <p style={{ marginBottom: 8 }}>Compositor: Obsidian Glass Engine</p>
        <p style={{ marginBottom: 8 }}>Shell Manager: TypeScript-based lifecycle</p>
        <p style={{ marginBottom: 8 }}>Rendering: CSS Compositor with Aura Effects</p>
      </div>
    </div>
  );
}

function NetworkSection() {
  return (
    <div data-testid="settings-network-section">
      <h3 className="settings-section-title">Network</h3>
      <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>
        <div className="settings-control"><span className="settings-control-label">Wi-Fi</span><span style={{ color: '#28c840' }}>Connected</span></div>
        <div className="settings-control"><span className="settings-control-label">Network</span><span>AuraOS-Network</span></div>
        <div className="settings-control"><span className="settings-control-label">IP Address</span><span>192.168.1.42</span></div>
      </div>
    </div>
  );
}

function PrivacySection() {
  return (
    <div data-testid="settings-privacy-section">
      <h3 className="settings-section-title">Privacy & Security</h3>
      <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>
        <div className="settings-control"><span className="settings-control-label">Firewall</span><span style={{ color: '#28c840' }}>Active</span></div>
        <div className="settings-control"><span className="settings-control-label">Encryption</span><span>AES-256</span></div>
        <div className="settings-control"><span className="settings-control-label">Last Security Scan</span><span>Today</span></div>
      </div>
    </div>
  );
}
