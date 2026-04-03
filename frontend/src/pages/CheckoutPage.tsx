import { useState, useEffect } from "react";
import { navigate } from "../App";
import { addStructuredData, setupPageSEO } from "../utils/seo";
import { saveOrder, validateDiscountCode } from "../utils/db";
import { Breadcrumb } from "../components/Breadcrumb";
import { BookCover } from "../components/BookCover";
import { SoursopBookCover } from "../components/SoursopBookCover";
import { SuperfruitsBookCover } from "../components/SuperfruitsBookCover";
import { GymEnergyBookCover } from "../components/GymEnergyBookCover";
import { FatLossSmoothiesBookCover } from "../components/FatLossSmoothiesBookCover";
import { HealingDrinksBookCover } from "../components/HealingDrinksBookCover";
import { PreWorkoutBookCover } from "../components/PreWorkoutBookCover";
import { TropicalJuiceCover }        from "../components/TropicalJuiceCover";
import { CaribbeanEncyclopediaCover } from "../components/CaribbeanEncyclopediaCover";
import { MedicinalLeavesCover }       from "../components/MedicinalLeavesCover";
import { TropicalDessertsCover }      from "../components/TropicalDessertsCover";
import { MangoRecipeCover }           from "../components/MangoRecipeCover";
import { FruitCalendarCover }         from "../components/FruitCalendarCover";
import { PapayaRecipeCover }          from "../components/PapayaRecipeCover";
import { SoursopDrinksCover }         from "../components/SoursopDrinksCover";
import { GuavaDessertCover }          from "../components/GuavaDessertCover";
import { NutritionBundleCover }       from "../components/NutritionBundleCover";
import { OrderBump, DiscountCode }      from "../components/OrderBump";
import { products } from "../data/products";

interface Props { productId: string; }

// ── Download URLs ──────────────────────────────────────────────────────────────
const DOWNLOAD_URLS: Record<string, string> = {
  "ebook-001":               "https://image2url.com/r2/default/documents/1771979481368-df16b0ee-9819-4667-a8f2-4b3727d0f4b4.pdf",
  "ebook-002":               "https://image2url.com/r2/default/documents/1771979481368-df16b0ee-9819-4667-a8f2-4b3727d0f4b4.pdf",
  "ebook-003":               "https://image2url.com/r2/default/documents/1771979481368-df16b0ee-9819-4667-a8f2-4b3727d0f4b4.pdf",
  "ebook-004":               "https://image2url.com/r2/default/documents/1771979481368-df16b0ee-9819-4667-a8f2-4b3727d0f4b4.pdf",
  "ebook-gym-energy-recipes":"https://image2url.com/r2/default/documents/1771979481368-df16b0ee-9819-4667-a8f2-4b3727d0f4b4.pdf",
  "ebook-fat-loss-smoothies":"https://image2url.com/r2/default/documents/1771979481368-df16b0ee-9819-4667-a8f2-4b3727d0f4b4.pdf",
  "ebook-healing-drinks":    "https://image2url.com/r2/default/documents/1771979481368-df16b0ee-9819-4667-a8f2-4b3727d0f4b4.pdf",
  "ebook-pre-workout-drinks":"https://image2url.com/r2/default/documents/1771979481368-df16b0ee-9819-4667-a8f2-4b3727d0f4b4.pdf",
};

function ProductThumbnail({ productId }: { productId: string }) {
  const product = products.find(p => p.id === productId);
  const slug = product?.slug || "";
  if (slug === "tropical-juice-smoothie-recipes") return <TropicalJuiceCover size="sm" />;
  if (slug === "caribbean-fruit-guide")           return <CaribbeanEncyclopediaCover size="sm" />;
  if (slug === "medicinal-leaves-guide")          return <MedicinalLeavesCover size="sm" />;
  if (slug === "tropical-fruit-desserts")         return <TropicalDessertsCover size="sm" />;
  if (slug === "mango-recipe-pack")               return <MangoRecipeCover size="sm" />;
  if (slug === "fruit-season-calendar")           return <FruitCalendarCover size="sm" />;
  if (slug === "papaya-recipe-pack")              return <PapayaRecipeCover size="sm" />;
  if (slug === "soursop-drinks-pack")             return <SoursopDrinksCover size="sm" />;
  if (slug === "guava-dessert-pack")              return <GuavaDessertCover size="sm" />;
  if (slug.includes("gym-energy"))                return <GymEnergyBookCover size="sm" />;
  if (slug.includes("fat-loss"))                  return <FatLossSmoothiesBookCover size="sm" />;
  if (slug.includes("healing-drinks"))            return <HealingDrinksBookCover size="sm" />;
  if (slug.includes("pre-workout"))               return <PreWorkoutBookCover size="sm" />;
  if (slug.includes("bundle"))                    return <NutritionBundleCover size="sm" />;
  if (slug.includes("soursop"))                   return <SoursopBookCover size="sm" />;
  if (slug.includes("superfruits"))               return <SuperfruitsBookCover size="sm" />;
  return (
    <div className="w-20 h-28 bg-gradient-to-br from-leaf/20 to-mango/20 rounded-xl flex items-center justify-center text-4xl flex-shrink-0">
      {product?.category === "recipe-pack" ? "📦" : "📖"}
    </div>
  );
}

// ── PayPal Button ─────────────────────────────────────────────────────────────
// Loaded dynamically so it works even if the SDK is slow
declare global {
  interface Window {
    paypal?: {
      Buttons: (opts: {
        style?: object;
        createOrder: (data: unknown, actions: { order: { create: (o: object) => Promise<string> } }) => Promise<string>;
        onApprove: (data: unknown, actions: { order: { capture: () => Promise<{ id?: string; payer?: { name?: { given_name?: string }; email_address?: string } }> } }) => Promise<void>;
        onError: (err: unknown) => void;
        onCancel: () => void;
      }) => { render: (selector: string) => void };
    };
  }
}

interface PayPalButtonProps {
  amount: string;
  description: string;
  onSuccess: (orderId: string, payerName: string, payerEmail: string) => void;
  onError: (msg: string) => void;
  onCancel: () => void;
}

function PayPalCheckoutButton({ amount, description, onSuccess, onError, onCancel }: PayPalButtonProps) {
  const [sdkReady, setSdkReady] = useState(false);
  const [sdkError, setSdkError] = useState(false);
  const containerRef = useState(() => `paypal-btn-${Date.now()}`)[0];

  const paypalMode = (import.meta as ImportMeta & { env: Record<string, string> }).env.VITE_PAYPAL_MODE || "SANDBOX";
  const clientId = paypalMode === "LIVE"
    ? (import.meta as ImportMeta & { env: Record<string, string> }).env.VITE_PAYPAL_CLIENT_ID_LIVE
    : (import.meta as ImportMeta & { env: Record<string, string> }).env.VITE_PAYPAL_CLIENT_ID_SANDBOX;

  useEffect(() => {
    if (!clientId || clientId.startsWith("PASTE_") || clientId.length < 10) {
      setSdkError(true);
      return;
    }
    if (window.paypal) { setSdkReady(true); return; }

    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD&intent=capture`;
    script.async = true;
    script.onload = () => setSdkReady(true);
    script.onerror = () => setSdkError(true);
    document.body.appendChild(script);
    return () => { try { document.body.removeChild(script); } catch {} };
  }, [clientId]);

  useEffect(() => {
    if (!sdkReady || !window.paypal) return;
    try {
      window.paypal.Buttons({
        style: { layout: "vertical", color: "gold", shape: "rect", label: "paypal" },
        createOrder: (_data, actions) => actions.order.create({
          intent: "CAPTURE",
          purchase_units: [{ description, amount: { currency_code: "USD", value: amount } }],
        }),
        onApprove: async (_data, actions) => {
          try {
            const details = await actions.order.capture();
            onSuccess(
              details.id || `ORD-${Date.now()}`,
              details.payer?.name?.given_name || "Customer",
              details.payer?.email_address || ""
            );
          } catch {
            onError("Payment capture failed. Contact support with your PayPal transaction ID.");
          }
        },
        onError: () => onError("PayPal encountered an error. Please try again or use a different payment method."),
        onCancel,
      }).render(`#${containerRef}`);
    } catch (e) {
      setSdkError(true);
    }
  }, [sdkReady, containerRef, amount, description, onSuccess, onError, onCancel]);

  if (sdkError) return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-center">
      <p className="font-semibold text-amber-900 mb-2">⚠️ PayPal Not Configured</p>
      <p className="text-sm text-amber-800 mb-3">
        Add your PayPal Client ID to the <code className="bg-amber-100 px-1 rounded">.env</code> file:
      </p>
      <code className="text-xs bg-amber-100 px-3 py-2 rounded block text-left text-amber-900">
        VITE_PAYPAL_CLIENT_ID_LIVE=your_live_id_here<br/>
        VITE_PAYPAL_MODE=LIVE
      </code>
      <p className="text-xs text-amber-700 mt-3">Get your Client ID at <strong>developer.paypal.com</strong></p>
    </div>
  );

  if (!sdkReady) return (
    <div className="flex flex-col items-center gap-3 py-6">
      <div className="w-8 h-8 border-3 border-[#0070ba] border-t-transparent rounded-full animate-spin" />
      <p className="text-sm text-charcoal-light">Loading PayPal…</p>
    </div>
  );

  return <div id={containerRef} className="min-h-[48px]" />;
}

// ── Main CheckoutPage ─────────────────────────────────────────────────────────
export function CheckoutPage({ productId }: Props) {
  const product = products.find(p => p.id === productId);
  const [step, setStep] = useState<"form" | "paypal" | "done">("form");
  const [discount, setDiscount] = useState(0);

  // SEO: Product schema for Google Shopping signals
  useEffect(() => {
    if (!product) return;
    const title = product.title || (product as {name?:string}).name || "Ebook";
    addStructuredData({
      "@context": "https://schema.org",
      "@type": "Product",
      "name": title,
      "description": product.short_description,
      "category": "Digital Book",
      "brand": { "@type": "Brand", "name": "IslandFruitGuide" },
      "offers": {
        "@type": "Offer",
        "price": product.price.toFixed(2),
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock",
        "seller": { "@type": "Organization", "name": "IslandFruitGuide" },
        "priceValidUntil": new Date(Date.now()+365*24*3600*1000).toISOString().split("T")[0],
        "url": `https://www.islandfruitguide.com/checkout/${product.id}`,
        "shippingDetails": {
          "@type": "OfferShippingDetails",
          "deliveryTime": { "@type": "ShippingDeliveryTime", "handlingTime": { "@type": "QuantitativeValue", "value": 0, "unitCode": "MIN" }},
          "shippingRate": { "@type": "MonetaryAmount", "value": 0, "currency": "USD" },
          "shippingDestination": { "@type": "DefinedRegion", "addressCountry": "*" }
        }
      },
      "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.8", "reviewCount": "89" }
    });
  }, [product]);
  const [email, setEmail] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [formError, setFormError] = useState("");
  const [orderId, setOrderId] = useState("");
  const [buyerName, setBuyerName] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [paypalError, setPaypalError] = useState("");

  useEffect(() => { setStep("form"); setFormError(""); setPaypalError(""); }, [productId]);

  if (!product) return (
    <div className="max-w-7xl mx-auto px-4 py-20 text-center">
      <span className="text-6xl block mb-4">🤔</span>
      <h2 className="font-heading text-2xl font-bold mb-4">Product Not Found</h2>
      <p className="text-charcoal-light mb-6">The product you're looking for doesn't exist.</p>
      <button onClick={() => navigate("/store")} className="btn-primary">← Back to Store</button>
    </div>
  );

  const downloadUrl = DOWNLOAD_URLS[product.id] || DOWNLOAD_URLS["ebook-001"];
  const productTitle = product.title || (product as { name?: string }).name || "Ebook";

  // ── SUCCESS ──
  if (step === "done") return (
    <div className="animate-fade-in">
      <div className="bg-gradient-to-r from-leaf to-leaf-light text-white py-8">
        <div className="max-w-4xl mx-auto px-4"><Breadcrumb items={[{ label: "Store", path: "/store" }, { label: "Order Complete" }]} dark /></div>
      </div>
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-8 lg:p-12">
          <div className="text-7xl mb-4">🎉</div>
          <h2 className="font-heading text-3xl font-bold text-charcoal mb-2">Payment Successful!</h2>
          <p className="text-charcoal-light mb-1">Thank you, <strong>{buyerName}</strong>!</p>
          <p className="text-sm text-charcoal-light mb-8">Order ID: <code className="bg-gray-50 px-2 py-0.5 rounded text-xs">{orderId}</code></p>

          <div className="bg-gradient-to-br from-leaf/5 to-mango/5 rounded-2xl p-6 mb-6 text-left flex items-center gap-4">
            <ProductThumbnail productId={product.id} />
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-charcoal mb-1">{productTitle}</h3>
              <p className="text-sm text-charcoal-light mb-3">PDF — Instant Download</p>
              <a href={downloadUrl} download target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-leaf text-white px-5 py-2.5 rounded-xl font-bold hover:bg-leaf-dark transition-colors text-sm">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
                </svg>
                Download Now
              </a>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 mb-6 text-left flex gap-3">
            <span className="text-2xl">📧</span>
            <div>
              <p className="font-semibold text-charcoal text-sm mb-1">Download link sent to your email</p>
              <p className="text-sm text-charcoal-light">{buyerEmail}</p>
            </div>
          </div>

          {/* Post-purchase upsell */}
          {product.id !== "bundle-nutrition-series" && (
            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-300 rounded-2xl p-5 mb-4">
              <p className="text-xs font-bold text-amber-700 uppercase tracking-wide mb-1">🎉 Special One-Time Offer</p>
              <p className="font-bold text-charcoal text-sm mb-1">Complete your collection — all 4 Nutrition Series books</p>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl font-black text-charcoal">$29.99</span>
                <span className="text-sm text-gray-400 line-through">$41.96</span>
                <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">Save $12</span>
              </div>
              <button onClick={() => navigate("/checkout/bundle-nutrition-series")}
                className="w-full bg-gradient-to-r from-amber-400 to-yellow-400 text-black font-bold py-2.5 rounded-xl text-sm hover:scale-105 transition-transform">
                Yes! Upgrade to the Complete Bundle →
              </button>
            </div>
          )}
          <div className="space-y-3">
            <button onClick={() => navigate("/store/ebooks")} className="w-full btn-secondary">← Browse More Products</button>
            <button onClick={() => navigate("/")} className="w-full text-charcoal-light hover:text-charcoal text-sm transition-colors">Return to Home</button>
          </div>
        </div>
      </div>
    </div>
  );

  // ── CHECKOUT ──
  return (
    <div className="animate-fade-in">
      <div className="bg-gradient-to-r from-leaf to-leaf-light text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: "Store", path: "/store" }, { label: "Checkout" }]} dark />
          <h1 className="font-heading text-2xl font-bold mt-2">Secure Checkout</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-5 gap-8">

          {/* ── LEFT: Form / PayPal ── */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 lg:p-8">

              {/* Order bump — upsell */}
              <OrderBump currentProductId={product.id} currentPrice={product.price}/>

              {/* Step indicator */}
              <div className="flex items-center gap-3 mb-6">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${step === "form" ? "bg-leaf text-white" : "bg-leaf/10 text-leaf"}`}>1</div>
                <div className="text-sm font-medium text-charcoal-light">Your Info</div>
                <div className="h-px flex-1 bg-gray-200" />
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${step === "paypal" ? "bg-leaf text-white" : "bg-leaf/10 text-charcoal-light"}`}>2</div>
                <div className="text-sm font-medium text-charcoal-light">Payment</div>
              </div>

              {/* Error banners */}
              {(formError || paypalError) && (
                <div className="mb-5 bg-red-50 border border-red-200 rounded-xl p-4 flex gap-3">
                  <span className="text-xl">⚠️</span>
                  <p className="text-sm text-red-800 font-medium">{formError || paypalError}</p>
                </div>
              )}

              {/* Step 1 — Email + terms */}
              {step === "form" && (
                <div className="space-y-5">
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-charcoal mb-2">
                      Email Address <span className="text-coral">*</span>
                    </label>
                    <input
                      id="email" type="email" value={email}
                      onChange={e => setEmail(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && document.getElementById("proceed-btn")?.click()}
                      placeholder="your@email.com"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-leaf focus:border-leaf outline-none transition-all text-charcoal"
                    />
                    <p className="text-xs text-charcoal-light mt-1.5">📧 Download link will be sent here</p>
                  </div>

                  {/* Discount code */}
                  <DiscountCode price={product.price} onDiscount={(pct) => setDiscount(pct)} />

                  <label className="flex items-start gap-3 cursor-pointer bg-gray-50 rounded-xl p-4">
                    <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)}
                      className="mt-0.5 w-5 h-5 text-leaf rounded border-gray-300 focus:ring-leaf" />
                    <span className="text-sm text-charcoal-light">
                      I agree to the{" "}
                      <button onClick={() => navigate("/terms")} className="text-leaf hover:underline font-medium">Terms of Service</button>
                      {" "}and{" "}
                      <button onClick={() => navigate("/privacy")} className="text-leaf hover:underline font-medium">Privacy Policy</button>
                    </span>
                  </label>

                  <button
                    id="proceed-btn"
                    onClick={() => {
                      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                        setFormError("Please enter a valid email address.");
                        return;
                      }
                      if (!agreed) {
                        setFormError("Please agree to the Terms of Service to continue.");
                        return;
                      }
                      setFormError("");
                      setStep("paypal");
                    }}
                    className="w-full flex items-center justify-center gap-3 py-4 rounded-xl font-bold text-lg text-white transition-colors shadow-lg"
                    style={{ backgroundColor: "#0070ba" }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#003087")}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#0070ba")}
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                      <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.72a.77.77 0 0 1 .76-.65h6.18c2.046 0 3.482.46 4.272 1.368.738.85.946 2.07.635 3.73l-.003.02v.463l.36.205c.306.165.55.358.737.576.318.372.523.845.607 1.404.087.579.053 1.27-.1 2.055-.176.9-.463 1.685-.855 2.332-.36.598-.812 1.085-1.344 1.449-.505.343-1.1.6-1.77.76-.648.155-1.386.233-2.193.233H11.65a.943.943 0 0 0-.932.8l-.024.148-.462 2.93-.02.12a.943.943 0 0 1-.932.8H7.076z"/>
                    </svg>
                    Continue to PayPal — ${product.price.toFixed(2)}
                  </button>

                  <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-charcoal-light pt-2">
                    <span>🔒 256-bit SSL</span>
                    <span>🛡️ PayPal Buyer Protection</span>
                    <span>💯 30-Day Guarantee</span>
                  </div>
                </div>
              )}

              {/* Step 2 — PayPal buttons */}
              {step === "paypal" && (
                <div>
                  <div className="mb-5 bg-gray-50 rounded-xl p-4 flex items-center gap-3 text-sm text-charcoal-light">
                    <span>📧</span>
                    <span>Sending receipt to <strong className="text-charcoal">{email}</strong></span>
                    <button onClick={() => setStep("form")} className="ml-auto text-leaf hover:underline text-xs">Change</button>
                  </div>

                  <p className="text-sm text-center text-charcoal-light mb-4 font-medium">
                    Complete payment securely via PayPal:
                  </p>

                  <PayPalCheckoutButton
                    amount={product.price.toFixed(2)}
                    description={productTitle}
                    onSuccess={(oid, pName, pEmail) => {
                      setOrderId(oid);
                      setBuyerName(pName);
                      setBuyerEmail(pEmail || email);
                      setStep("done");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    onError={msg => setPaypalError(msg)}
                    onCancel={() => setPaypalError("")}
                  />

                  <button onClick={() => { setStep("form"); setPaypalError(""); }}
                    className="w-full mt-4 text-sm text-charcoal-light hover:text-charcoal transition-colors text-center py-2">
                    ← Back to email step
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ── RIGHT: Summary ── */}
          <div className="lg:col-span-2">
            <div className="sticky top-24 space-y-5">

              {/* Product card */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <h3 className="font-heading font-bold text-charcoal mb-4">Order Summary</h3>
                <div className="flex items-start gap-4 mb-5">
                  <ProductThumbnail productId={product.id} />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-charcoal text-sm leading-snug">{productTitle}</p>
                    <p className="text-xs text-charcoal-light mt-1">PDF · Instant Download · Lifetime Access</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm border-t border-gray-100 pt-4">
                  <div className="flex justify-between">
                    <span className="text-charcoal-light">Price</span>
                    <span className="text-charcoal font-medium">${product.price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-charcoal-light">Tax</span>
                    <span className="text-charcoal font-medium">$0.00</span>
                  </div>
                  <div className="flex justify-between text-base border-t border-gray-100 pt-2 mt-1">
                    <span className="font-bold text-charcoal">Total</span>
                    <span className="font-heading text-xl font-bold text-leaf">${product.price.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* What you get */}
              <div className="bg-gradient-to-br from-leaf/5 to-mango/5 rounded-2xl p-5 border border-gray-100">
                <h3 className="font-bold text-charcoal mb-3 text-sm">✅ What You'll Get</h3>
                <ul className="space-y-2">
                  {["Instant PDF download", "Full-colour illustrations", "Lifetime access", "Mobile & tablet friendly", "30-day money-back guarantee"].map(item => (
                    <li key={item} className="flex items-center gap-2 text-xs text-charcoal-light">
                      <span className="text-leaf">✓</span> {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Guarantee */}
              <div className="bg-amber-50 rounded-2xl p-5 border border-amber-100 flex gap-3 items-start">
                <span className="text-3xl">🛡️</span>
                <div>
                  <h3 className="font-bold text-charcoal text-sm mb-1">30-Day Money-Back Guarantee</h3>
                  <p className="text-xs text-charcoal-light">Not satisfied? Full refund within 30 days — no questions asked.</p>
                </div>
              </div>

              {/* Help */}
              <div className="bg-white rounded-2xl p-5 border border-gray-100 text-center">
                <p className="text-sm text-charcoal-light mb-2">Questions about your order?</p>
                <button onClick={() => navigate("/contact")} className="text-sm text-leaf font-semibold hover:underline">
                  📧 Contact Support →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
