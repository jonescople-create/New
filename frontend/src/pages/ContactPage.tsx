import { setupPageSEO } from '../utils/seo';
import { useEffect } from 'react';
import { setCanonicalURL } from '../utils/seoSchema';

export function ContactPage() {

  useEffect(() => {
    setupPageSEO({
      path: '/contact',
      title: 'Contact IslandFruitGuide | Get in Touch',
      description: 'Contact the IslandFruitGuide team. Questions about Caribbean fruits, recipes, ebooks, or partnerships — we would love to hear from you.',
    });
  }, []);
  useEffect(() => {
    setCanonicalURL('https://www.islandfruitguide.com/contact');
    document.title = 'Contact IslandFruitGuide | Get in Touch';
  }, []);

  return (
    <div className="min-h-screen bg-cream py-12">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-4xl sm:text-5xl font-bold text-charcoal mb-6">
          Contact Us
        </h1>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8">
          <h2 className="text-2xl font-bold text-charcoal mb-4">
            Get in Touch
          </h2>
          <p className="text-gray-700 mb-6 leading-relaxed">
            Have questions about tropical fruits? Want to contribute traditional knowledge? 
            Interested in collaborating? We'd love to hear from you!
          </p>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-primary mb-2">📧 Editorial Team</h3>
              <p className="text-gray-700">
                For content questions, corrections, or suggestions:
                <br />
                <a href="mailto:editorial@islandfruitguide.com" className="text-primary hover:underline">
                  editorial@islandfruitguide.com
                </a>
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-primary mb-2">🌿 Traditional Knowledge Submissions</h3>
              <p className="text-gray-700">
                Share your family's traditional fruit uses and recipes:
                <br />
                <a href="mailto:traditions@islandfruitguide.com" className="text-primary hover:underline">
                  traditions@islandfruitguide.com
                </a>
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-primary mb-2">🤝 Partnerships & Collaboration</h3>
              <p className="text-gray-700">
                For business inquiries and partnerships:
                <br />
                <a href="mailto:partnerships@islandfruitguide.com" className="text-primary hover:underline">
                  partnerships@islandfruitguide.com
                </a>
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-primary mb-2">📱 Social Media</h3>
              <div className="flex gap-4">
                <a href="https://facebook.com/islandfruitguide" className="text-primary hover:underline">
                  Facebook
                </a>
                <a href="https://instagram.com/islandfruitguide" className="text-primary hover:underline">
                  Instagram
                </a>
                <a href="https://twitter.com/islandfruitguide" className="text-primary hover:underline">
                  Twitter
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
          <h3 className="text-lg font-bold text-charcoal mb-2">⚡ Quick Response Time</h3>
          <p className="text-gray-700">
            We typically respond within 24-48 hours during business days (Monday-Friday, 9 AM - 5 PM EST).
          </p>
        </div>
      </div>
    </div>
  );
}