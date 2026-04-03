import { useState, useEffect, useCallback } from "react";
import { useDesktop } from "@/contexts/DesktopContext";
import { Delete } from "lucide-react";

const LOGO_URL = "https://customer-assets.emergentagent.com/job_glow-workspace/artifacts/2wqrcvq7_AURA%20LOGO.png";

const WALLPAPERS = [
  "https://images.unsplash.com/photo-1680486481682-6828194ec366?w=1920&q=80",
  "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=1920&q=80",
  "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1920&q=80",
  "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1920&q=80",
];

export default function LockScreen() {
  const { unlock, settings } = useDesktop();
  const [pin, setPin] = useState("");
  const [shake, setShake] = useState(false);
  const [unlocking, setUnlocking] = useState(false);
  const [time, setTime] = useState(new Date());

  const wallpaperUrl = WALLPAPERS[settings.wallpaper_index] || WALLPAPERS[0];

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleDigit = useCallback((d) => {
    if (pin.length >= 4 || unlocking) return;
    const newPin = pin + d;
    setPin(newPin);
    if (newPin.length === 4) {
      setUnlocking(true);
      setTimeout(() => unlock(), 600);
    }
  }, [pin, unlocking, unlock]);

  const handleDelete = useCallback(() => {
    if (unlocking) return;
    setPin(p => p.slice(0, -1));
  }, [unlocking]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (unlocking) return;
      if (e.key >= "0" && e.key <= "9") handleDigit(e.key);
      else if (e.key === "Backspace") handleDelete();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleDigit, handleDelete, unlocking]);

  const timeStr = time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const dateStr = time.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" });

  const KEYS = [1, 2, 3, 4, 5, 6, 7, 8, 9, "empty", 0, "del"];

  return (
    <div className={`lockscreen ${unlocking ? "lockscreen-unlocking" : ""}`} data-testid="lockscreen">
      {/* Background */}
      <div className="lockscreen-bg">
        <div className="cosmic-bg-image" style={{ backgroundImage: `url(${wallpaperUrl})` }} />
        <div className="lockscreen-bg-overlay" />
      </div>

      {/* Stars */}
      <div className="lockscreen-stars" />

      {/* Floating orbs */}
      <div className="cosmic-orb cosmic-orb-1" style={{ opacity: 0.15 }} />
      <div className="cosmic-orb cosmic-orb-2" style={{ opacity: 0.12 }} />
      <div className="cosmic-orb cosmic-orb-3" style={{ opacity: 0.1 }} />

      {/* Content */}
      <div className={`lockscreen-content ${unlocking ? "lockscreen-content-unlock" : ""}`} data-testid="lockscreen-content">
        {/* Clock */}
        <div className="lockscreen-time" data-testid="lockscreen-time">{timeStr}</div>
        <div className="lockscreen-date" data-testid="lockscreen-date">{dateStr}</div>

        {/* Logo */}
        <img src={LOGO_URL} alt="AuraOS" className="lockscreen-logo" data-testid="lockscreen-logo" />

        {/* PIN Hint */}
        <div className="lockscreen-hint" data-testid="lockscreen-hint">Enter any 4 digits to unlock</div>

        {/* PIN Dots */}
        <div className={`lockscreen-pin-dots ${shake ? "lockscreen-shake" : ""}`} data-testid="lockscreen-pin-dots">
          {[0, 1, 2, 3].map(i => (
            <div
              key={i}
              className={`pin-dot ${pin.length > i ? "pin-dot-filled" : ""} ${unlocking && pin.length > i ? "pin-dot-success" : ""}`}
              data-testid={`pin-dot-${i}`}
            />
          ))}
        </div>

        {/* Keypad */}
        <div className="lockscreen-keypad" data-testid="lockscreen-keypad">
          {KEYS.map((key, i) => {
            if (key === "empty") return <div key={i} className="keypad-spacer" />;
            if (key === "del") {
              return (
                <button
                  key={i}
                  className="keypad-btn keypad-btn-action"
                  onClick={handleDelete}
                  data-testid="lockscreen-delete"
                >
                  <Delete size={20} />
                </button>
              );
            }
            return (
              <button
                key={i}
                className="keypad-btn"
                onClick={() => handleDigit(String(key))}
                data-testid={`lockscreen-key-${key}`}
              >
                {key}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
