import { useEffect } from 'react';
import { setupPageSEO } from '../utils/seo';
import { navigate } from "../App";
import { Breadcrumb } from "../components/Breadcrumb";

export function TermsPage() {
  useEffect(() => {
    setupPageSEO({
      path: '/terms',
      title: 'Terms of Service | IslandFruitGuide',
      description: 'Terms of service for IslandFruitGuide.com. Our terms cover use of the website, purchase of digital products, and all interactive features.',
    });
  }, []);

  return (
    <div className="animate-fade-in">
      <div className="bg-gradient-to-r from-mango to-coral text-white py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: "Terms of Service" }]} />
          <h1 className="font-heading text-3xl lg:text-5xl font-bold">Terms of Service</h1>
          <p className="text-white/80 mt-3 text-lg">Last updated: June 2025</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="bg-mango/10 border border-mango/20 rounded-2xl p-6 mb-10">
          <p className="text-charcoal dark:text-white leading-relaxed">
            By accessing or using <strong>IslandFruitGuide</strong> (islandfruitguide.com), you agree to
            these Terms of Service. Please read them carefully.
          </p>
        </div>

        {[
          {
            title: "1. Acceptance of Terms",
            items: [
              "By using this website, you confirm you are at least 13 years old.",
              "You agree to use the site for lawful purposes only.",
              "These terms apply to all visitors, users, and customers.",
            ]
          },
          {
            title: "2. Intellectual Property",
            items: [
              "All content on IslandFruitGuide (text, images, recipes, guides, ebooks) is owned by IslandFruitGuide unless stated otherwise.",
              "You may share individual articles or recipes with proper attribution and a link back to the source.",
              "You may NOT reproduce, resell, or distribute our paid ebooks or guides without written permission.",
              "Our logo and brand name are trademarks of IslandFruitGuide.",
            ]
          },
          {
            title: "3. Digital Products & Purchases",
            items: [
              "All ebook and digital guide sales are final. Due to the digital nature of these products, we do not offer refunds unless the product is defective or significantly different from its description.",
              "Upon purchase, you receive a personal, non-transferable license to use the digital product for personal use only.",
              "You may not share, resell, or redistribute purchased digital products.",
              "Download links are valid for 30 days after purchase. Contact us if you need a new link.",
            ]
          },
          {
            title: "4. Health & Medical Disclaimer",
            items: [
              "All health and nutritional information on IslandFruitGuide is for educational purposes ONLY.",
              "Nothing on this site constitutes medical advice, diagnosis, or treatment.",
              "Always consult a qualified healthcare professional before making dietary changes, especially if you have medical conditions or take medications.",
              "Information about traditional or folk uses of fruits and leaves is cultural/historical in nature and is not a substitute for professional medical advice.",
            ]
          },
          {
            title: "5. User Conduct",
            items: [
              "You agree not to use the site to transmit harmful, illegal, or offensive content.",
              "You agree not to attempt to hack, scrape en masse, or disrupt the site's functionality.",
              "You agree not to impersonate other users or IslandFruitGuide staff.",
              "Violation of these rules may result in termination of your account and access.",
            ]
          },
          {
            title: "6. Limitation of Liability",
            items: [
              "IslandFruitGuide is provided 'as is' without warranties of any kind.",
              "We are not liable for any indirect, incidental, or consequential damages arising from your use of the site.",
              "Our total liability for any claim is limited to the amount you paid for the product or service in question.",
              "We are not responsible for the accuracy of third-party content linked from our site.",
            ]
          },
          {
            title: "7. Changes to Terms",
            items: [
              "We reserve the right to update these Terms of Service at any time.",
              "Significant changes will be announced on this page with an updated date.",
              "Continued use of the site after changes constitutes acceptance of the new terms.",
            ]
          },
          {
            title: "8. Governing Law",
            items: [
              "These terms are governed by the laws of Jamaica and applicable international regulations.",
              "Any disputes shall be resolved through good-faith negotiation before any legal proceedings.",
            ]
          },
        ].map(section => (
          <div key={section.title} className="mb-10">
            <h2 className="font-heading text-2xl font-bold text-charcoal dark:text-white mb-4">{section.title}</h2>
            <ul className="space-y-2">
              {section.items.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-charcoal-light dark:text-gray-300 leading-relaxed">
                  <span className="w-5 h-5 bg-mango/20 text-amber-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">{i + 1}</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="bg-charcoal/5 dark:bg-white/5 rounded-2xl p-6 mt-10">
          <h2 className="font-heading text-xl font-bold text-charcoal dark:text-white mb-3">Questions?</h2>
          <p className="text-charcoal-light dark:text-gray-300 mb-4">
            If you have questions about these Terms, please contact us:
          </p>
          <ul className="space-y-1 text-charcoal-light dark:text-gray-300 mb-4">
            <li>📧 legal@islandfruitguide.com</li>
            <li>🌐 islandfruitguide.com/contact</li>
          </ul>
          <div className="flex gap-3 flex-wrap">
            <button onClick={() => navigate("/contact")} className="btn-primary text-sm">Contact Us →</button>
            <button onClick={() => navigate("/privacy")} className="btn-secondary text-sm">Privacy Policy →</button>
          </div>
        </div>
      </div>
    </div>
  );
}
