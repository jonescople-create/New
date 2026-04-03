import { setupPageSEO } from '../utils/seo';
import { useEffect } from 'react';
import { setCanonicalURL } from '../utils/seoSchema';

export function EditorialPolicyPage() {

  useEffect(() => {
    setupPageSEO({
      path: '/editorial-policy',
      title: 'Editorial Policy & Content Standards | IslandFruitGuide',
      description: 'IslandFruitGuide editorial standards, sourcing policy, and content review process. How we ensure accuracy and authenticity in all Caribbean fruit information.',
    });
  }, []);
  useEffect(() => {
    setCanonicalURL('https://www.islandfruitguide.com/editorial-policy');
    document.title = 'Editorial Policy | IslandFruitGuide Standards';
  }, []);

  return (
    <div className="min-h-screen bg-cream py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl sm:text-5xl font-bold text-charcoal mb-6">
          Editorial Policy
        </h1>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-6">
          <p className="text-gray-700 mb-4 leading-relaxed">
            IslandFruitGuide is committed to providing accurate, evidence-based information about 
            tropical and Caribbean fruits. This editorial policy outlines our standards and processes.
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-charcoal mb-4">🎯 Our Mission</h2>
            <p className="text-gray-700 leading-relaxed">
              To be the world's most trusted resource for tropical fruit information by combining 
              scientific research, traditional Caribbean knowledge, and cultural preservation.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-charcoal mb-4">✅ Content Standards</h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold mt-1">1.</span>
                <div>
                  <strong>Accuracy:</strong> All nutritional data verified against USDA databases and 
                  peer-reviewed Caribbean agricultural research.
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold mt-1">2.</span>
                <div>
                  <strong>Cultural Sensitivity:</strong> Traditional uses documented with proper cultural 
                  context and credit to indigenous knowledge holders.
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold mt-1">3.</span>
                <div>
                  <strong>Safety First:</strong> All medicinal information includes clear warnings and 
                  disclaimers. We never recommend replacing medical treatment.
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold mt-1">4.</span>
                <div>
                  <strong>Transparency:</strong> Sources cited where possible. Traditional knowledge 
                  marked as "traditional use" vs "scientific evidence."
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold mt-1">5.</span>
                <div>
                  <strong>Regular Updates:</strong> Content reviewed annually and updated as new research emerges.
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-charcoal mb-4">🔬 Review Process</h2>
            <div className="space-y-4 text-gray-700">
              <div>
                <h3 className="font-semibold text-charcoal mb-2">Step 1: Research</h3>
                <p>Information gathered from scientific literature, USDA databases, Caribbean agricultural 
                institutions, and documented traditional practices.</p>
              </div>
              <div>
                <h3 className="font-semibold text-charcoal mb-2">Step 2: Expert Review</h3>
                <p>Content reviewed by agricultural experts, nutritionists, or cultural anthropologists 
                depending on topic.</p>
              </div>
              <div>
                <h3 className="font-semibold text-charcoal mb-2">Step 3: Fact-Checking</h3>
                <p>All claims verified against multiple sources. Health benefits backed by research or 
                clearly marked as traditional use.</p>
              </div>
              <div>
                <h3 className="font-semibold text-charcoal mb-2">Step 4: Publication</h3>
                <p>Content published with proper disclaimers and source attribution where applicable.</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-charcoal mb-4">⚠️ Medical Disclaimer</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Information on this website is for educational purposes only and is not intended as medical advice. 
              Always consult a qualified healthcare provider before:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Using any fruit or plant for medicinal purposes</li>
              <li>Making dietary changes for health conditions</li>
              <li>Combining herbal remedies with prescription medications</li>
              <li>Treating any medical condition</li>
            </ul>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-charcoal mb-4">📧 Corrections & Feedback</h2>
            <p className="text-gray-700 leading-relaxed">
              We welcome corrections and feedback. If you find inaccurate information or have additional 
              knowledge to share, please contact us at:
              <br />
              <a href="mailto:editorial@islandfruitguide.com" className="text-primary hover:underline">
                editorial@islandfruitguide.com
              </a>
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-charcoal mb-4">🔄 Last Updated</h2>
            <p className="text-gray-700">January 2025</p>
          </div>
        </div>
      </div>
    </div>
  );
}