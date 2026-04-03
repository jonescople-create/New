import { useState, useEffect, useCallback } from "react";
import { SuperfruitsBookCover } from "./SuperfruitsBookCover";

const STORAGE_KEY = "ifg_lead_popup_dismissed";
const EMAIL_STORAGE_KEY = "ifg_subscriber_email";
const COOLDOWN_DAYS = 14; // Don't show again for 14 days after dismissal

export function LeadMagnetPopup() {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const dismiss = useCallback(() => {
    setVisible(false);
    window.localStorage.setItem(STORAGE_KEY, Date.now().toString());
  }, []);

  // Check if dismissed within cooldown period (14 days)
  const wasDismissedRecently = useCallback(() => {
    const ts = window.localStorage.getItem(STORAGE_KEY);
    if (!ts) return false;
    const diff = Date.now() - parseInt(ts, 10);
    return diff < COOLDOWN_DAYS * 24 * 60 * 60 * 1000;
  }, []);

  // Already subscribed?
  const isSubscribed = useCallback(() => {
    return !!window.localStorage.getItem(EMAIL_STORAGE_KEY);
  }, []);

  // Exit-intent only trigger (desktop) — no timed pop-up = annoyance-free
  useEffect(() => {
    if (wasDismissedRecently() || isSubscribed()) return;

    let fired = false;
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 5 && !fired) {
        fired = true;
        setVisible(true);
      }
    };
    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, [wasDismissedRecently, isSubscribed]);

  // ESC to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };
    if (visible) document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [visible, dismiss]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");

    // Store the subscriber email locally
    window.localStorage.setItem(EMAIL_STORAGE_KEY, email);
    window.localStorage.setItem(STORAGE_KEY, Date.now().toString());

    // In production, this would POST to your email API (Mailchimp, ConvertKit, Supabase Edge Function, etc.)
    // For now, we trigger the welcome email content and show success
    console.log("[IslandFruitGuide] New subscriber:", email);
    console.log("[IslandFruitGuide] Trigger welcome email automation for:", email);

    setSubmitted(true);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-charcoal/60 backdrop-blur-sm" onClick={dismiss} />

      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden animate-fade-in">
        {/* Close button */}
        <button
          onClick={dismiss}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors text-charcoal-light"
          aria-label="Close popup"
        >
          ✕
        </button>

        {submitted ? (
          /* ===== SUCCESS STATE ===== */
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-leaf/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">🎉</span>
            </div>
            <h2 className="font-heading text-2xl font-bold text-charcoal">
              Welcome to the Family!
            </h2>
            <p className="text-charcoal-light mt-3 text-sm leading-relaxed">
              Your free copy of <strong>"The Complete Guide to Caribbean Superfruits"</strong> is ready!
            </p>

            {/* Download button */}
            <a
              href="https://image2url.com/r2/default/documents/1771979481368-df16b0ee-9819-4667-a8f2-4b3727d0f4b4.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex items-center gap-2 mt-6 text-base"
            >
              📥 Download Your Free Ebook
            </a>

            {/* Discount code */}
            <div className="mt-6 bg-mango/10 rounded-xl p-4 border border-mango/20">
              <p className="text-sm text-charcoal-light">
                As a special thank you, enjoy <strong className="text-charcoal">10% off</strong> your first order:
              </p>
              <div className="mt-2 bg-white rounded-lg px-4 py-2 border-2 border-dashed border-mango font-heading font-bold text-xl text-mango tracking-wide">
                TROPICAL10
              </div>
            </div>

            <button
              onClick={dismiss}
              className="mt-6 text-sm text-charcoal-light hover:text-charcoal transition-colors"
            >
              Continue browsing →
            </button>
          </div>
        ) : (
          /* ===== CAPTURE STATE ===== */
          <>
            {/* Top gradient */}
            <div className="bg-gradient-to-br from-leaf to-leaf-light px-8 pt-8 pb-6 text-white text-center">
              <div className="flex justify-center mb-4">
                <SuperfruitsBookCover size="sm" />
              </div>
              <h2 className="font-heading text-2xl font-bold leading-tight">
                🌴 Unlock the Secrets of Caribbean Superfruits!
              </h2>
              <p className="text-white/80 text-sm mt-2">
                Get your <strong>FREE</strong> copy of our premium ebook — packed with real nutrition data, recipes, and a 7-day meal plan.
              </p>
            </div>

            {/* Form */}
            <div className="px-8 py-6">
              <div className="space-y-3 mb-5 text-sm text-charcoal-light">
                <div className="flex items-center gap-2">
                  <span className="text-leaf">✓</span> Soursop health benefits (fact vs. fiction)
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-leaf">✓</span> 7-day tropical superfruit meal plan
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-leaf">✓</span> Essential Caribbean fruit recipes
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-leaf">✓</span> Safety warnings most sources miss
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  placeholder="Enter your email address..."
                  className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-leaf focus:ring-2 focus:ring-leaf/20 outline-none transition-all text-base"
                  autoFocus
                />
                {error && <p className="text-red-500 text-xs">{error}</p>}
                <button
                  type="submit"
                  className="w-full bg-mango text-charcoal py-3.5 rounded-xl font-bold text-base hover:brightness-110 transition-all shadow-lg"
                >
                  📥 Get My Free Ebook
                </button>
              </form>

              <p className="text-xs text-charcoal-light text-center mt-4">
                No spam, ever. Unsubscribe anytime. We respect your privacy.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
