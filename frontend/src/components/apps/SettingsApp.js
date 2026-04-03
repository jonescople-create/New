import { useState, useCallback } from "react";
import { useDesktop } from "@/contexts/DesktopContext";
import { Monitor, Palette, Globe, Shield, Info } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const LOGO_URL = "https://customer-assets.emergentagent.com/job_glow-workspace/artifacts/2wqrcvq7_AURA%20LOGO.png";

const ACCENT_COLORS = [
  "#6CB4EE", "#1B93A4", "#28c840", "#FFD700", "#FF8C00", "#FF0055", "#9D4CDD", "#8A2BE2", "#FF69B4"
];

const WALLPAPERS = [
  { url: "https://images.unsplash.com/photo-1680486481682-6828194ec366?w=1920&q=80", thumb: "https://images.unsplash.com/photo-1680486481682-6828194ec366?w=400&q=60", name: "Cosmic Nebula" },
  { url: "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=1920&q=80", thumb: "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=400&q=60", name: "Dark Galaxy" },
  { url: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1920&q=80", thumb: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=400&q=60", name: "Purple Nebula" },
  { url: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1920&q=80", thumb: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&q=60", name: "Starfield" },
];

const SIDEBAR_ITEMS = [
  { id: "aura", label: "Aura Effects & Colors", sub: "Visuals & Wallpaper", icon: Palette },
  { id: "system", label: "System", sub: "About AuraOS", icon: Monitor },
  { id: "network", label: "Network", sub: "Internet & Connections", icon: Globe },
  { id: "privacy", label: "Privacy", sub: "Security & Privacy", icon: Shield },
  { id: "about", label: "About", sub: "Info", icon: Info },
];

export default function SettingsApp() {
  const { settings, updateSetting, addNotification } = useDesktop();
  const [activeSection, setActiveSection] = useState("aura");

  const handleSettingChange = useCallback((key, value) => {
    updateSetting(key, value);
    addNotification(`Setting updated: ${key}`);
    toast.success("Settings updated");
  }, [updateSetting, addNotification]);

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
        {activeSection === "system" && <SystemSection />}
        {activeSection === "network" && <NetworkSection />}
        {activeSection === "privacy" && <PrivacySection />}
        {activeSection === "about" && <AboutSection />}
      </div>
    </div>
  );
}

function AuraEffectsSection({ settings, onChange }) {
  return (
    <div data-testid="settings-aura-section">
      <h3 className="settings-section-title">Aura Effects & Colors</h3>

      {/* Wallpaper Picker */}
      <div style={{ marginBottom: 20 }}>
        <span className="settings-control-label" style={{ display: 'block', marginBottom: 10 }}>Wallpaper</span>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }} data-testid="wallpaper-picker">
          {WALLPAPERS.map((wp, i) => (
            <div
              key={i}
              onClick={() => onChange("wallpaper_index", i)}
              style={{
                height: 80, borderRadius: 10, overflow: 'hidden',
                backgroundImage: `url(${wp.thumb})`, backgroundSize: 'cover', backgroundPosition: 'center',
                cursor: 'pointer', transition: 'all 0.2s ease',
                border: settings.wallpaper_index === i ? '2px solid #9D4CDD' : '2px solid rgba(255,255,255,0.08)',
                boxShadow: settings.wallpaper_index === i ? '0 0 15px rgba(157,76,221,0.3)' : 'none',
                position: 'relative'
              }}
              data-testid={`wallpaper-${i}`}
            >
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0, padding: '4px 8px',
                background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                fontSize: 10, color: 'rgba(255,255,255,0.8)'
              }}>
                {wp.name}
              </div>
            </div>
          ))}
        </div>
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

function SystemSection() {
  return (
    <div data-testid="settings-system-section">
      <h3 className="settings-section-title">System</h3>
      <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, lineHeight: 2 }}>
        <p>AuraOS v1.0.0</p>
        <p>Compositor: Obsidian Glass Engine</p>
        <p>Shell Manager: TypeScript-based lifecycle</p>
        <p>Rendering: CSS Compositor with Aura Effects</p>
        <p>Shortcuts: Ctrl+W (close), Ctrl+M (minimize), Esc (dismiss)</p>
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

function AboutSection() {
  return (
    <div data-testid="settings-about-section">
      <h3 className="settings-section-title">About AuraOS</h3>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
        <img src={LOGO_URL} alt="AuraOS" style={{ width: 64, height: 64, objectFit: 'contain' }} />
        <div>
          <div style={{ fontSize: 20, fontWeight: 500, fontFamily: 'Outfit, sans-serif' }}>AuraOS</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>Version 1.0.0 (Obsidian Glass)</div>
        </div>
      </div>
      <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', lineHeight: 1.8 }}>
        <p>A next-generation fluid-state OS shell.</p>
        <p>Built with the Obsidian Glass compositor engine.</p>
        <p style={{ marginTop: 12 }}>Keyboard Shortcuts:</p>
        <p>Ctrl+W &mdash; Close window</p>
        <p>Ctrl+M &mdash; Minimize window</p>
        <p>Esc &mdash; Dismiss overlays</p>
      </div>
    </div>
  );
}
