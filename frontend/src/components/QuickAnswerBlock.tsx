/**
 * Quick Answer / FAQ Component for AEO (Answer Engine Optimization)
 * Phase 7C - Content Enhancement
 */

import { useState } from 'react';

interface FAQ {
  question: string;
  answer: string;
}

interface QuickAnswerProps {
  title?: string;
  question?: string;
  answer: string;
  faqs?: FAQ[];
}

export function QuickAnswerBlock({ title, question, answer, faqs = [] }: QuickAnswerProps) {
  const heading = title || question || "Quick Answer";
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  return (
    <div className="bg-gradient-to-br from-emerald-50 to-green-50 border-2 border-primary rounded-2xl p-6 mb-8">
      {/* Quick Answer */}
      <div className="mb-6">
        <div className="flex items-start gap-3 mb-3">
          <span className="text-2xl">❓</span>
          <h3 className="text-xl font-bold text-charcoal">{heading}</h3>
        </div>
        <div className="bg-white rounded-lg p-4 border border-emerald-200">
          <p className="text-gray-800 leading-relaxed">{answer}</p>
        </div>
      </div>

      {/* FAQ Section */}
      {faqs.length > 0 && (
        <div>
          <h4 className="text-lg font-semibold text-charcoal mb-4 flex items-center gap-2">
            <span>💡</span> Common Questions
          </h4>
          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white rounded-lg border border-emerald-200 overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFAQ(expandedFAQ === idx ? null : idx)}
                  className="w-full text-left px-4 py-3 flex items-center justify-between hover:bg-emerald-50 transition"
                >
                  <span className="font-semibold text-charcoal">{faq.question}</span>
                  <span className="text-primary text-xl">
                    {expandedFAQ === idx ? '−' : '+'}
                  </span>
                </button>
                {expandedFAQ === idx && (
                  <div className="px-4 py-3 border-t border-emerald-100 bg-gray-50">
                    <p className="text-gray-700">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Featured Snippet Optimization Block
 */
interface FeatureSnippetProps {
  title: string;
  items: string[];
  type?: 'numbered' | 'bulleted';
}

export function FeaturedSnippetBlock({ title, items, type = 'bulleted' }: FeatureSnippetProps) {
  return (
    <div className="bg-white border-2 border-gray-200 rounded-xl p-6 mb-6">
      <h3 className="text-lg font-bold text-charcoal mb-4">{title}</h3>
      {type === 'numbered' ? (
        <ol className="list-decimal list-inside space-y-2">
          {items.map((item, idx) => (
            <li key={idx} className="text-gray-800 leading-relaxed">{item}</li>
          ))}
        </ol>
      ) : (
        <ul className="space-y-2">
          {items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-primary font-bold mt-1">•</span>
              <span className="text-gray-800 leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}