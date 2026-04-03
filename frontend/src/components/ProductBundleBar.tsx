import { useState } from "react";
import { navigate } from "../App";

const EMAIL_STORAGE_KEY = "ifg_subscriber_email";

interface Props {
  context?: string; // name of the physical product or page section
}

export function ProductBundleBar({ context = "your order" }: Props) {
  const [dismissed, setDismissed] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const [email, setEmail] = useState("");
  const [showInput, setShowInput] = useState(false);

  const isSubscribed = !!window.localStorage.getItem(EMAIL_STORAGE_KEY);

  if (dismissed) return null;

  const handleClaim = () => {
    if (isSubscribed) {
      setClaimed(true);
      return;
    }
    if (!showInput) {
      setShowInput(true);
      return;
    }
    if (!email || !email.includes("@")) return;
    window.localStorage.setItem(EMAIL_STORAGE_KEY, email);
    setClaimed(true);
  };

  if (claimed) {
    return (
      <div className="bg-gradient-to-r from-leaf/10 to-mango/10 border border-leaf/20 rounded-2xl p-5 mb-6 animate-fade-in">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🎁</span>
            <div>
              <p className="font-heading font-bold text-charcoal text-sm">
                Free Ebook Unlocked!
              </p>
              <p className="text-xs text-charcoal-light">
                Download your free Caribbean Superfruits Guide below.
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <a
              href="https://image2url.com/r2/default/documents/1771979481368-df16b0ee-9819-4667-a8f2-4b3727d0f4b4.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-leaf text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-leaf-dark transition-colors"
            >
              📥 Download
            </a>
            <button
              onClick={() => navigate("/store")}
              className="bg-mango text-charcoal px-4 py-2 rounded-xl text-sm font-semibold hover:brightness-110 transition-all"
            >
              📚 More Ebooks
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-mango/10 to-coral/10 border border-mango/20 rounded-2xl p-5 mb-6 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🎁</span>
          <div>
            <p className="font-heading font-bold text-charcoal text-sm">
              Free Gift with {context}!
            </p>
            <p className="text-xs text-charcoal-light">
              Get our <strong>Caribbean Superfruits Ebook</strong> (value $14.99) — FREE when you add any product.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {showInput && !isSubscribed && (
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="px-3 py-2 rounded-lg border border-gray-200 text-sm w-48 focus:border-leaf focus:ring-1 focus:ring-leaf/20 outline-none"
            />
          )}
          <button
            onClick={handleClaim}
            className="bg-mango text-charcoal px-4 py-2 rounded-xl text-sm font-semibold hover:brightness-110 transition-all whitespace-nowrap"
          >
            {showInput ? "Claim Free Ebook" : "🎁 Claim Now"}
          </button>
          <button
            onClick={() => setDismissed(true)}
            className="text-charcoal-light hover:text-charcoal text-lg px-1"
            aria-label="Dismiss"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
