import { useState, useEffect } from 'react';
import { setupPageSEO } from '../utils/seo';
import { navigate } from '../App';
import { medicinalLeaves, type MedicinalLeaf } from '../data/medicinalLeaves';
import { Breadcrumb } from '../components/Breadcrumb';

// Map health concern keywords → leaf slugs ranked by relevance
const CONCERN_MAP: Record<string, string[]> = {
  sleep:       ['soursop-leaf', 'passion-fruit-leaf', 'avocado-leaf'],
  pressure:    ['breadfruit-leaf', 'avocado-leaf', 'soursop-leaf'],
  diabetes:    ['guava-leaf', 'mango-leaf', 'papaya-leaf'],
  cold:        ['soursop-leaf', 'guava-leaf', 'tamarind-leaf'],
  stomach:     ['guava-leaf', 'papaya-leaf', 'tamarind-leaf'],
  inflammation:['soursop-leaf', 'papaya-leaf', 'tamarind-leaf'],
  immunity:    ['soursop-leaf', 'guava-leaf', 'papaya-leaf', 'mango-leaf'],
  skin:        ['papaya-leaf', 'soursop-leaf', 'guava-leaf', 'avocado-leaf'],
};

const CONCERN_NOTES: Record<string, Record<string, string>> = {
  'soursop-leaf': {
    sleep: 'Traditionally used in Caribbean evenings as a calming tea to promote restful sleep.',
    cold: 'Rich in vitamin C compounds; widely used in Caribbean folk medicine for cold & flu symptoms.',
    immunity: 'One of the most popular traditional immune-support teas in the Caribbean.',
    pressure: 'Traditionally consumed to support general circulatory wellness.',
    inflammation: 'Soursop leaf compounds are studied for anti-inflammatory properties.',
  },
  'guava-leaf': {
    diabetes: 'Traditional Caribbean remedy — guava leaf tea is used to support healthy blood sugar levels.',
    stomach: 'One of the most popular digestive teas in the Caribbean — used for centuries.',
    cold: 'High tannin content used in folk medicine for throat and respiratory discomfort.',
    immunity: 'Rich in vitamin C and antioxidants that support immune function.',
    skin: 'Scalp and skin applications are common in Caribbean beauty traditions.',
  },
  'papaya-leaf': {
    skin: 'Papain enzymes in the leaf are used topically for skin conditions in folk medicine.',
    stomach: 'Papain enzyme tea used in Caribbean tradition to support digestion.',
    diabetes: 'Traditionally prepared as a wellness tea for blood sugar balance support.',
    inflammation: 'Papain compound is one of nature\'s most potent anti-inflammatory enzymes.',
    immunity: 'High vitamin C and beta-carotene content support immune defense.',
  },
  'mango-leaf': {
    diabetes: 'Young mango leaves are a traditional morning tea in Ayurvedic and Caribbean medicine for glucose balance.',
    immunity: 'Rich in antioxidants including mangiferin studied for immune properties.',
  },
  'breadfruit-leaf': {
    pressure: 'Breadfruit leaf tea is one of the most popular Caribbean teas for heart and blood pressure support.',
    immunity: 'Rich in antioxidants and minerals.',
    skin: 'Traditional skin rinse for various skin conditions in Caribbean folk practice.',
  },
  'passion-fruit-leaf': {
    sleep: 'Passiflora is one of the best-studied natural sleep aids — traditional Caribbean bedtime tea.',
    inflammation: 'Traditional poultice for skin irritation and minor burns.',
  },
  'avocado-leaf': {
    pressure: 'Traditional Caribbean tea for circulatory and heart wellness.',
    sleep: 'Relaxing bath preparation used in Caribbean folk tradition.',
    stomach: 'Digestive tea after heavy meals in traditional practice.',
  },
  'tamarind-leaf': {
    stomach: 'Traditional digestive tea and external remedy used across the Caribbean.',
    cold: 'Used in folk medicine for fever reduction and general wellness.',
    inflammation: 'Tamarind leaf applied as an external poultice in folk practice.',
  },
};

function recommendLeaves(concerns: string[]): MedicinalLeaf[] {
  const scores = new Map<string, number>();
  for (const concern of concerns) {
    const slugs = CONCERN_MAP[concern] || [];
    slugs.forEach((slug, idx) => {
      scores.set(slug, (scores.get(slug) || 0) + (slugs.length - idx));
    });
  }
  return medicinalLeaves
    .filter(l => scores.has(l.slug))
    .sort((a, b) => (scores.get(b.slug) || 0) - (scores.get(a.slug) || 0))
    .slice(0, 5);
}

const CONCERN_LIST = [
  { value: 'sleep',        label: 'Sleep & Anxiety',        icon: '😴' },
  { value: 'pressure',     label: 'High Blood Pressure',    icon: '❤️' },
  { value: 'diabetes',     label: 'Blood Sugar / Diabetes', icon: '🩺' },
  { value: 'cold',         label: 'Cold / Flu / Fever',     icon: '🤧' },
  { value: 'stomach',      label: 'Stomach / Digestion',    icon: '🫃' },
  { value: 'inflammation', label: 'Pain / Inflammation',    icon: '🔥' },
  { value: 'immunity',     label: 'Immune System Boost',    icon: '🛡️' },
  { value: 'skin',         label: 'Skin Conditions',        icon: '✨' },
];

export function MedicinalAdvisorPage() {
  const [selected, setSelected] = useState<string[]>([]);
  const [results, setResults] = useState<MedicinalLeaf[]>([]);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    setupPageSEO({
      title: 'Medicinal Leaf Advisor | Caribbean Herbal Medicine Guide',
      description: 'Find Caribbean medicinal leaves for your health needs. Traditional remedies backed by generations of island wisdom.',
      path: '/tools/medicinal-advisor',
    });
  }, []);

  const toggle = (v: string) => setSelected(p => p.includes(v) ? p.filter(x => x !== v) : [...p, v]);

  const getRecommendations = () => {
    setResults(recommendLeaves(selected));
    setShowResults(true);
  };

  const reset = () => { setSelected([]); setResults([]); setShowResults(false); };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <Breadcrumb items={[{ label: 'Tools', href: '/tools' }, { label: 'Medicinal Advisor' }]} />
          <div className="text-center mt-4">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">🌿 Medicinal Leaf Advisor</h1>
            <p className="text-lg text-white/90">Traditional Caribbean herbal remedies for natural wellness</p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">
        {!showResults ? (
          <>
            <div className="bg-amber-50 border border-amber-300 rounded-2xl p-5 mb-8">
              <h3 className="font-bold text-amber-900 mb-2 flex items-center gap-2">⚠️ Important Disclaimer</h3>
              <p className="text-amber-900 text-sm">
                This tool documents <strong>traditional Caribbean folk medicine practices only</strong>. It is NOT medical advice.
                Always consult a healthcare professional before using herbal remedies, especially if you have existing conditions or take medications.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-charcoal mb-2">Select Your Health Concerns</h2>
              <p className="text-charcoal-light text-sm mb-6">Choose one or more areas where you're seeking traditional natural support</p>

              {selected.length > 0 && (
                <div className="mb-5 p-3 bg-green-50 rounded-xl">
                  <p className="text-green-700 font-bold text-sm">{selected.length} concern{selected.length !== 1 ? 's' : ''} selected</p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                {CONCERN_LIST.map(c => (
                  <button key={c.value} onClick={() => toggle(c.value)}
                    className={`p-4 rounded-xl border-2 text-left transition-all flex items-center gap-3 ${
                      selected.includes(c.value)
                        ? 'border-green-500 bg-green-500 text-white shadow-lg'
                        : 'border-gray-200 bg-white text-charcoal hover:border-green-400 hover:bg-green-50'
                    }`}>
                    <span className="text-3xl">{c.icon}</span>
                    <div>
                      <div className="font-bold">{c.label}</div>
                      {selected.includes(c.value) && <div className="text-xs mt-0.5 opacity-90">✓ Selected</div>}
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <button onClick={getRecommendations} disabled={selected.length === 0}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-3.5 px-8 rounded-xl hover:scale-105 transition-transform disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none">
                  Get Recommendations
                </button>
                {selected.length > 0 && (
                  <button onClick={() => setSelected([])} className="px-5 py-3.5 bg-gray-100 text-charcoal font-medium rounded-xl hover:bg-gray-200 transition">Clear</button>
                )}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
              <h2 className="text-3xl font-bold text-charcoal mb-2">🌿 Recommended Medicinal Leaves</h2>
              <p className="text-charcoal-light">
                Traditional Caribbean remedies for:{' '}
                <strong>{selected.map(v => CONCERN_LIST.find(c => c.value === v)?.label).filter(Boolean).join(', ')}</strong>
              </p>
            </div>

            {results.length > 0 ? (
              <div className="space-y-5 mb-6">
                {results.map(leaf => {
                  // Build contextual usage note for selected concerns
                  const notes = selected
                    .map(c => CONCERN_NOTES[leaf.slug]?.[c])
                    .filter(Boolean);
                  const primaryNote = notes[0] || leaf.traditional_uses[0];
                  const mainPrep = leaf.preparation_methods[0];

                  return (
                    <div key={leaf.slug} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div>
                          <h3 className="text-xl font-bold text-charcoal">{leaf.common_name}</h3>
                          <p className="text-xs text-charcoal-light italic">{leaf.scientific_name}</p>
                        </div>
                        <span className="text-3xl">🌿</span>
                      </div>

                      <p className="text-charcoal text-sm mb-4 leading-relaxed">{primaryNote}</p>

                      {mainPrep && (
                        <div className="mb-4 p-4 bg-green-50 rounded-xl">
                          <h4 className="font-bold text-charcoal text-sm mb-2">How to Prepare: {mainPrep.method}</h4>
                          <p className="text-charcoal-light text-xs leading-relaxed line-clamp-3">{mainPrep.instructions}</p>
                        </div>
                      )}

                      {leaf.contraindications.length > 0 && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
                          <p className="text-xs font-bold text-red-700 mb-1">⚠️ Cautions:</p>
                          <ul className="text-xs text-red-700 space-y-0.5">
                            {leaf.contraindications.slice(0, 2).map((c, i) => (
                              <li key={i}>• {c}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <button onClick={() => navigate(`/medicinal-leaves/${leaf.slug}`)}
                        className="bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-2.5 px-5 rounded-xl hover:scale-105 transition-transform text-sm">
                        Full Guide: {leaf.common_name} →
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-8 text-center mb-6">
                <div className="text-5xl mb-3">🤔</div>
                <h3 className="text-xl font-bold text-charcoal mb-2">No Matches Found</h3>
                <p className="text-charcoal-light mb-4">Try different concern combinations or browse all medicinal leaves.</p>
                <button onClick={() => navigate('/medicinal-leaves')} className="bg-green-600 text-white font-bold py-2.5 px-6 rounded-xl hover:scale-105 transition-transform">Browse All Leaves →</button>
              </div>
            )}

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
              <p className="text-xs text-amber-900">{results[0]?.disclaimer || 'This content documents traditional folk medicine practices only. It is NOT medical advice. Always consult a qualified healthcare provider.'}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={reset} className="flex-1 bg-gray-100 text-charcoal font-bold py-3 px-6 rounded-xl hover:bg-gray-200 transition">🔄 Try Again</button>
              <button onClick={() => navigate('/medicinal-leaves')} className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-3 px-6 rounded-xl hover:scale-105 transition-transform">🌿 Browse All Medicinal Leaves</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
