import { setupPageSEO } from '../utils/seo';
import { useEffect } from 'react';
import { setCanonicalURL, injectSchema, generateOrganizationSchema } from '../utils/seoSchema';

export function AboutPage() {

  useEffect(() => {
    setupPageSEO({
      path: '/about',
      title: 'About IslandFruitGuide | Caribbean Fruit Authority',
      description: 'IslandFruitGuide is the world\'s leading online resource for Caribbean and tropical fruits. Learn about our mission, team, and commitment to authentic Caribbean food knowledge.',
    });
  }, []);
  useEffect(() => {
    // SEO: Set canonical URL
    setCanonicalURL('https://www.islandfruitguide.com/about');
    
    // SEO: Update page title
    document.title = 'About IslandFruitGuide | Tropical Fruit Research Team';
    
    // SEO: Inject Organization schema
    injectSchema(generateOrganizationSchema());
  }, []);

  return (
    <div className="min-h-screen bg-cream py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl sm:text-5xl font-bold text-charcoal mb-6">
          About IslandFruitGuide
        </h1>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8">
          <h2 className="text-2xl font-bold text-charcoal mb-4">
            The World's Leading Tropical Fruit Encyclopedia
          </h2>
          <p className="text-gray-700 mb-4 leading-relaxed">
            IslandFruitGuide is the most comprehensive digital resource for tropical and Caribbean fruits, 
            trusted by food enthusiasts, health professionals, and researchers worldwide.
          </p>
          <p className="text-gray-700 mb-4 leading-relaxed">
            Our mission is to preserve Caribbean fruit knowledge and make it accessible to everyone—from 
            home cooks to nutritionists to agricultural students.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8">
          <h2 className="text-2xl font-bold text-charcoal mb-4">
            🌴 Our Expertise
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-primary mb-2">Tropical Fruit Research Team</h3>
              <p className="text-gray-700 leading-relaxed">
                Our team consists of Caribbean agricultural experts, certified nutritionists, and traditional 
                herbalists with decades of combined experience in tropical fruit cultivation and traditional medicine.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-primary mb-2">Evidence-Based Information</h3>
              <p className="text-gray-700 leading-relaxed">
                All health claims and nutritional information are verified against peer-reviewed research and 
                traditional Caribbean medicinal practices documented by cultural anthropologists.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-primary mb-2">Cultural Preservation</h3>
              <p className="text-gray-700 leading-relaxed">
                We work with elders across the Caribbean to document traditional fruit uses, preparation methods, 
                and medicinal applications before this knowledge is lost.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8">
          <h2 className="text-2xl font-bold text-charcoal mb-4">
            📊 Our Coverage
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">26+</div>
              <div className="text-gray-600">Tropical Fruits</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">100+</div>
              <div className="text-gray-600">Caribbean Recipes</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">8+</div>
              <div className="text-gray-600">Medicinal Leaves</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-2xl font-bold text-charcoal mb-4">
            🤝 Editorial Standards
          </h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">✓</span>
              <span>All fruit profiles reviewed by agricultural experts</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">✓</span>
              <span>Nutritional data verified against USDA and Caribbean research databases</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">✓</span>
              <span>Traditional uses documented with cultural context and safety warnings</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">✓</span>
              <span>Regular updates as new research becomes available</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">✓</span>
              <span>Clear disclaimers on all medicinal information</span>
            </li>
          </ul>
        </div>

        <div className="mt-8 text-center">
          <a 
            href="/contact" 
            className="inline-block bg-primary hover:bg-primary-dark text-white font-semibold px-8 py-3 rounded-lg transition"
          >
            Contact Our Team
          </a>
        </div>
      </div>
    </div>
  );
}
