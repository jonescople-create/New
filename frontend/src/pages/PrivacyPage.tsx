import { useEffect } from 'react';
import { setupPageSEO } from '../utils/seo';
import { navigate } from "../App";
import { Breadcrumb } from "../components/Breadcrumb";

export function PrivacyPage() {
  useEffect(() => {
    setupPageSEO({
      path: '/privacy',
      title: 'Privacy Policy | IslandFruitGuide',
      description: 'Privacy policy for IslandFruitGuide.com. How we collect, use, and protect your personal information when you use our website and purchase our digital products.',
    });
  }, []);

  return (
    <div className="animate-fade-in">
      <div className="bg-gradient-to-r from-leaf to-leaf-light text-white py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: "Privacy Policy" }]} />
          <h1 className="font-heading text-3xl lg:text-5xl font-bold">Privacy Policy</h1>
          <p className="text-white/80 mt-3 text-lg">Last updated: June 2025</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="prose prose-lg max-w-none">

          <div className="bg-leaf/5 border border-leaf/20 rounded-2xl p-6 mb-10">
            <p className="text-charcoal dark:text-white leading-relaxed">
              At <strong>IslandFruitGuide</strong> (islandfruitguide.com), we are committed to protecting your
              privacy. This policy explains what information we collect, how we use it, and your rights regarding
              your data.
            </p>
          </div>

          {[
            {
              title: "1. Information We Collect",
              content: [
                "**Email address** — when you sign up for our newsletter, download a free ebook, or create an account.",
                "**Purchase information** — when you buy a digital product, PayPal processes your payment. We receive confirmation of your purchase but do not store credit card details.",
                "**Usage data** — anonymized data about which pages you visit, collected via standard server logs to improve our content.",
                "**Cookies** — small files stored in your browser to remember your preferences (e.g., dark mode, recently viewed fruits).",
              ]
            },
            {
              title: "2. How We Use Your Information",
              content: [
                "To deliver digital products you have purchased (ebooks, guides).",
                "To send you the welcome email and free ebook download link you requested.",
                "To send periodic newsletters about new Caribbean fruits, recipes, and guides (you can unsubscribe at any time).",
                "To personalise your site experience (recently viewed fruits, favorites).",
                "To improve our website based on anonymous analytics data.",
              ]
            },
            {
              title: "3. Data Sharing",
              content: [
                "We do **not** sell your personal data to third parties.",
                "**PayPal** processes all payments — their privacy policy applies to payment transactions.",
                "**Supabase** hosts our database with enterprise-grade security and encryption.",
                "We may share anonymized, aggregated data (e.g., \"most popular fruits\") publicly for educational purposes.",
              ]
            },
            {
              title: "4. Cookies",
              content: [
                "**Essential cookies** — required for the site to function (e.g., session, theme preference).",
                "**Analytics cookies** — anonymous traffic analysis to understand how visitors use our site.",
                "You can disable cookies in your browser settings. Some features may not function correctly without them.",
              ]
            },
            {
              title: "5. Your Rights (GDPR & CCPA)",
              content: [
                "**Access** — request a copy of the personal data we hold about you.",
                "**Deletion** — request that we delete your data (\"right to be forgotten\").",
                "**Correction** — request correction of inaccurate data.",
                "**Opt-out** — unsubscribe from emails at any time via the unsubscribe link in any email.",
                "To exercise any of these rights, contact us at privacy@islandfruitguide.com.",
              ]
            },
            {
              title: "6. Data Security",
              content: [
                "All data is transmitted over HTTPS (encrypted connections).",
                "Our database (Supabase) uses row-level security and encrypted storage.",
                "Payment data is processed exclusively by PayPal and never stored on our servers.",
                "We regularly review and update our security practices.",
              ]
            },
            {
              title: "7. Children's Privacy",
              content: [
                "IslandFruitGuide is not directed at children under 13.",
                "We do not knowingly collect personal information from children under 13.",
                "If you believe a child has provided us with personal information, contact us immediately.",
              ]
            },
            {
              title: "8. Changes to This Policy",
              content: [
                "We may update this Privacy Policy from time to time.",
                "Significant changes will be announced via email (if you are subscribed) and on this page.",
                "Continued use of the site after changes constitutes acceptance of the updated policy.",
              ]
            },
          ].map(section => (
            <div key={section.title} className="mb-10">
              <h2 className="font-heading text-2xl font-bold text-charcoal dark:text-white mb-4">{section.title}</h2>
              <ul className="space-y-2">
                {section.content.map((item, i) => (
                  <li key={i} className="text-charcoal-light dark:text-gray-300 leading-relaxed pl-4 border-l-2 border-leaf/30">
                    {item.replace(/\*\*(.*?)\*\*/g, "$1")}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="bg-charcoal/5 dark:bg-white/5 rounded-2xl p-6 mt-10">
            <h2 className="font-heading text-xl font-bold text-charcoal dark:text-white mb-3">Contact Us</h2>
            <p className="text-charcoal-light dark:text-gray-300">
              If you have questions about this Privacy Policy, contact us:
            </p>
            <ul className="mt-3 space-y-1 text-charcoal-light dark:text-gray-300">
              <li>📧 privacy@islandfruitguide.com</li>
              <li>🌐 islandfruitguide.com/contact</li>
            </ul>
            <button
              onClick={() => navigate("/contact")}
              className="mt-4 btn-primary text-sm"
            >
              Contact Us →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
