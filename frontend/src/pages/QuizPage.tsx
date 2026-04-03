import { setupPageSEO } from '../utils/seo';
import { useEffect, useState } from 'react';;
import { navigate } from "../App";
import { saveQuizResult } from '../utils/db';
import { Breadcrumb } from "../components/Breadcrumb";

interface AnswerOption {
  label: string;
  value: string;
  isCorrect?: boolean;
  explanation?: string;
}

interface QuizQuestion {
  id: string;
  question: string;
  answers: AnswerOption[];
}

const questions: QuizQuestion[] = [
  {
    id: "q1",
    question: "What part of the raw Soursop fruit should you NEVER eat?",
    answers: [
      { label: "A) The white pulp", value: "A" },
      { label: "B) The green skin", value: "B" },
      { label: "C) The black seeds", value: "C", isCorrect: true, explanation: "They contain neurotoxins and should always be discarded." },
      { label: "D) The stem", value: "D" },
    ],
  },
  {
    id: "q2",
    question: "Papaya is a superstar in skincare because it contains which exfoliating enzyme?",
    answers: [
      { label: "A) Bromelain", value: "A" },
      { label: "B) Papain", value: "B", isCorrect: true, explanation: "Papain gently dissolves dead skin cells for a natural glow." },
      { label: "C) Pectin", value: "C" },
      { label: "D) Citric Acid", value: "D" },
    ],
  },
  {
    id: "q3",
    question: "Which fruit is known as the “Custard Cousin” to Soursop but is sweeter and pulls apart in segments?",
    answers: [
      { label: "A) Guinep", value: "A" },
      { label: "B) Otaheite Apple", value: "B" },
      { label: "C) Sweetsop (Sugar Apple)", value: "C", isCorrect: true, explanation: "It tastes like sugary vanilla custard and separates into segments." },
      { label: "D) Naseberry", value: "D" },
    ],
  },
  {
    id: "q4",
    question: "What is Jamaica’s national fruit, which is technically a fruit but cooked like a savory dish?",
    answers: [
      { label: "A) Ackee", value: "A", isCorrect: true, explanation: "Ackee is Jamaica’s national fruit, usually served with saltfish." },
      { label: "B) Breadfruit", value: "B" },
      { label: "C) Plantain", value: "C" },
      { label: "D) Jackfruit", value: "D" },
    ],
  },
  {
    id: "q5",
    question: "Bananas are famous for being packed with which essential mineral that helps prevent muscle cramps?",
    answers: [
      { label: "A) Iron", value: "A" },
      { label: "B) Calcium", value: "B" },
      { label: "C) Potassium", value: "C", isCorrect: true, explanation: "Potassium supports muscle function and sustained energy." },
      { label: "D) Zinc", value: "D" },
    ],
  },
];

export function QuizPage() {
  useEffect(() => {
    setupPageSEO({
      path: '/quiz',
      title: 'Caribbean Fruit Quiz — Test Your Tropical Knowledge | IslandFruitGuide',
      description: 'Test your Caribbean tropical fruit knowledge with our interactive quiz. Can you identify all 26 Caribbean fruits? Play now and share your score.',
    });
  }, []);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);

  const question = questions[currentIndex];
  const progress = Math.round(((currentIndex + 1) / questions.length) * 100);

  const handleSelect = (answer: AnswerOption) => {
    if (showFeedback) return;
    setSelected(answer.value);
    setShowFeedback(true);
    if (answer.isCorrect) setScore((prev) => prev + 1);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelected(null);
      setShowFeedback(false);
      return;
    }
    window.sessionStorage.setItem("ifg_quiz_score", String(score));
    navigate("/quiz/results");
  };

  return (
    <div className="animate-fade-in">
      <div className="bg-gradient-to-r from-leaf to-leaf-light text-white py-12 lg:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: "Quiz" }]} />
          <h1 className="font-heading text-3xl lg:text-5xl font-bold">
            Test Your Caribbean Superfruit IQ! 🌴
          </h1>
          <p className="text-white/90 mt-3 text-lg max-w-2xl">
            Think you know your island fruits? Take our quick 5-question quiz to find out — and unlock a special reward at the end!
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-12">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-lg p-6 sm:p-8">
          <div className="flex items-center justify-between text-sm text-charcoal-light mb-4">
            <span>Question {currentIndex + 1} of {questions.length}</span>
            <span>Score: {score}</span>
          </div>
          <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden mb-6">
            <div className="h-full bg-mango transition-all" style={{ width: `${progress}%` }} />
          </div>

          <h2 className="font-heading text-2xl font-bold text-charcoal mb-6">
            {question.question}
          </h2>

          <div className="grid gap-3">
            {question.answers.map((answer) => {
              const isSelected = selected === answer.value;
              const isCorrect = answer.isCorrect;
              return (
                <button
                  key={answer.value}
                  onClick={() => handleSelect(answer)}
                  className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${
                    !showFeedback
                      ? "border-gray-200 hover:border-leaf hover:bg-leaf/5"
                      : isSelected && isCorrect
                      ? "border-leaf bg-leaf/10"
                      : isSelected && !isCorrect
                      ? "border-coral bg-coral/10"
                      : "border-gray-100"
                  }`}
                >
                  <span className="font-medium text-charcoal">{answer.label}</span>
                </button>
              );
            })}
          </div>

          {showFeedback && (
            <div className={`mt-6 rounded-2xl p-4 border ${selected && question.answers.find(a => a.value === selected)?.isCorrect ? "bg-leaf/10 border-leaf/20" : "bg-coral/10 border-coral/20"}`}>
              <p className="text-sm text-charcoal-light">
                {question.answers.find(a => a.value === selected)?.isCorrect
                  ? "✅ Correct!"
                  : "❌ Not quite."} {question.answers.find(a => a.isCorrect)?.explanation}
              </p>
            </div>
          )}

          <div className="mt-8 flex justify-between items-center">
            <button
              onClick={() => navigate("/fruits")}
              className="text-sm text-charcoal-light hover:text-charcoal transition-colors"
            >
              Browse Fruits →
            </button>
            <button
              onClick={handleNext}
              disabled={!showFeedback}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentIndex === questions.length - 1 ? "See Results" : "Next Question"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
