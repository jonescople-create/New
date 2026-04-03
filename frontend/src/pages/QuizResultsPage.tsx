import { useState } from "react";
import { navigate } from "../App";
import { Breadcrumb } from "../components/Breadcrumb";

const RESULTS = [
  {
    min: 0,
    max: 2,
    title: "The Island Tourist 🧳",
    message: "Welcome to the island! You're just starting your tropical fruit journey. Don't worry, we've got you covered. Check your inbox for your FREE Complete Guide to Caribbean Superfruits to become an expert in no time!",
    cta: "Shop Fresh Fruits to Start Tasting",
    link: "/buy-fruits",
    reward: "Free Superfruits Ebook",
  },
  {
    min: 3,
    max: 4,
    title: "The Tropical Explorer 🧭",
    message: "Great job! You definitely know your way around a Caribbean fruit market. You got most of them right! Check your inbox for your FREE tropical recipe ebook so you can put that knowledge to use in the kitchen.",
    cta: "Browse Caribbean Recipes",
    link: "/recipes",
    reward: "Free Recipe Ebook",
  },
  {
    min: 5,
    max: 5,
    title: "The Island Fruit Guru 👑",
    message: "Perfect Score! You are a true Caribbean superfruit expert. Since you know exactly how powerful these fruits are, we want to reward you. Use code GURU15 at checkout for 15% off your entire order today!",
    cta: "Claim Your 15% Off Now",
    link: "/store",
    reward: "15% Discount Code: GURU15",
  },
];

export function QuizResultsPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const score = Number(window.sessionStorage.getItem("ifg_quiz_score") || 0);

  const result = RESULTS.find(r => score >= r.min && score <= r.max) || RESULTS[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;
    window.localStorage.setItem("ifg_subscriber_email", email);
    setSubmitted(true);
  };

  return (
    <div className="animate-fade-in">
      <div className="bg-gradient-to-r from-leaf to-leaf-light text-white py-10 lg:py-14">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: "Quiz", path: "/quiz" }, { label: "Results" }]} />
          <h1 className="font-heading text-3xl lg:text-4xl font-bold">Your Superfruit IQ Results</h1>
          <p className="text-white/80 mt-2">Score: {score}/5</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-12">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-lg p-8 text-center">
          <h2 className="font-heading text-2xl lg:text-3xl font-bold text-charcoal mb-3">{result.title}</h2>
          <p className="text-charcoal-light mb-6">{result.message}</p>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email to unlock rewards"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-leaf focus:ring-2 focus:ring-leaf/20 outline-none"
              />
              <button type="submit" className="btn-primary w-full justify-center">
                Unlock My Reward
              </button>
            </form>
          ) : (
            <div className="bg-mango/10 rounded-2xl p-6 border border-mango/20">
              <p className="text-sm text-charcoal-light">Reward unlocked: <strong className="text-charcoal">{result.reward}</strong></p>
              <a
                href="https://image2url.com/r2/default/documents/1771979481368-df16b0ee-9819-4667-a8f2-4b3727d0f4b4.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary mt-4 inline-flex"
              >
                📥 Download Free Ebook
              </a>
            </div>
          )}

          <div className="mt-8">
            <button onClick={() => navigate(result.link)} className="btn-primary">
              {result.cta}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
