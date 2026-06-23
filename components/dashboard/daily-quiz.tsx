"use client";

import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Brain } from "lucide-react";

const quizzes = [
  {
    question: "Инфляция дегеніміз не?",
    options: ["Ақша санының өсуі", "Тауарлар бағасының жалпы өсуі", "Банктің пайдасы", "Валюта бағамы"],
    correct: 1,
    explanation: "Инфляция — тауарлар мен қызметтер бағасының жалпы өсуі. Ақшаның сатып алу қабілеті төмендейді.",
  },
  {
    question: "50/30/20 ережесі нені білдіреді?",
    options: [
      "50% жинақ, 30% азық-түлік, 20% ойын-сауық",
      "50% қажеттілік, 30% тілек, 20% жинақ",
      "50% кіріс, 30% шығын, 20% салық",
      "50% инвестиция, 30% жинақ, 20% шығын",
    ],
    correct: 1,
    explanation: "50/30/20 ережесі: кірістің 50% қажеттіліктерге, 30% тілектерге, 20% жинақ пен инвестицияға бөлінеді.",
  },
  {
    question: "Облигация деген не?",
    options: ["Компания акциясы", "Мемлекет немесе компания қарыз қағазы", "Банк депозиті", "Сақтандыру полисі"],
    correct: 1,
    explanation: "Облигация — эмитенттің берген қарыз міндеттемесі. Белгіленген мерзімде пайыз алып, аяқта негізгі соманы қайтарып аласыз.",
  },
  {
    question: "Диверсификация нені білдіреді?",
    options: [
      "Барлық ақшаны бір активке салу",
      "Ақшаны әр түрлі активтерге бөліп салу",
      "Тек алтынға инвестиция жасау",
      "Тек банкте ұстау",
    ],
    correct: 1,
    explanation: "Диверсификация — тәуекелді азайту үшін инвестицияны әр түрлі активтер арасында бөлу стратегиясы.",
  },
  {
    question: "Күрделі пайыз (compound interest) дегеніміз не?",
    options: [
      "Тек негізгі сомаға есептелетін пайыз",
      "Негізгі сома мен жинақталған пайызға есептелетін пайыз",
      "Жыл сайынғы банктік комиссия",
      "Несие бойынша айыппұл",
    ],
    correct: 1,
    explanation: "Күрделі пайыз — негізгі сома мен алдыңғы кезеңде жинақталған пайызға есептелетін пайыз. Уақыт өткен сайын экспоненциалды өседі.",
  },
  {
    question: "Акция сатып алу нені білдіреді?",
    options: [
      "Компанияға несие беру",
      "Компанияның үлесіне иелік ету",
      "Банктен пайыз алу",
      "Мемлекеттен субсидия алу",
    ],
    correct: 1,
    explanation: "Акция — компанияның меншік үлесі. Акционер дивиденд алып, акция бағасының өсуінен пайда табады.",
  },
  {
    question: "Қаржылық жастықша деген не?",
    options: [
      "Жастарға арналған депозит",
      "3-6 айлық шығындарға тең жинақ қоры",
      "Банктің несие лимиті",
      "Зейнетақы жинағы",
    ],
    correct: 1,
    explanation: "Қаржылық жастықша — күтпеген жағдайларға арналған 3-6 айлық шығындарыңызға тең жинақ. Бұл қаржылық қауіпсіздіктің негізі.",
  },
];

export function DailyQuiz({ dayOfYear }: { dayOfYear: number }) {
  const quiz = quizzes[dayOfYear % quizzes.length];
  const todayKey = `quiz_${dayOfYear}`;

  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(todayKey);
    if (saved !== null) {
      setSelected(parseInt(saved));
      setAnswered(true);
    }
  }, [todayKey]);

  const handleAnswer = (index: number) => {
    if (answered) return;
    setSelected(index);
    setAnswered(true);
    localStorage.setItem(todayKey, String(index));
  };

  const isCorrect = selected === quiz.correct;

  return (
    <div className="rounded-2xl bg-[var(--card)] border border-[var(--border)] overflow-hidden">
      <div className="bg-gradient-to-r from-violet-600/20 to-primary-600/20 px-5 py-3 flex items-center gap-2 border-b border-[var(--border)]">
        <Brain className="h-4 w-4 text-violet-400" />
        <span className="font-semibold text-sm">🧮 Қаржы сауаттылығы</span>
        <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-400 font-medium">+10 XP</span>
      </div>
      <div className="p-5">
        <p className="text-sm font-semibold mb-4 leading-relaxed">{quiz.question}</p>
        <div className="space-y-2">
          {quiz.options.map((option, i) => {
            let cls =
              "w-full text-left px-4 py-3 rounded-xl text-sm transition-all border flex items-center gap-2 ";
            if (!answered) {
              cls +=
                "border-[var(--border)] bg-[var(--secondary)] hover:border-violet-500 hover:bg-violet-500/10 cursor-pointer";
            } else if (i === quiz.correct) {
              cls += "border-emerald-500 bg-emerald-500/10 text-emerald-400 font-medium";
            } else if (i === selected && i !== quiz.correct) {
              cls += "border-red-500 bg-red-500/10 text-red-400";
            } else {
              cls += "border-[var(--border)] bg-[var(--secondary)] opacity-40";
            }
            return (
              <button key={i} className={cls} onClick={() => handleAnswer(i)} disabled={answered}>
                {answered && i === quiz.correct && (
                  <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                )}
                {answered && i === selected && i !== quiz.correct && (
                  <XCircle className="h-4 w-4 text-red-500 shrink-0" />
                )}
                {option}
              </button>
            );
          })}
        </div>
        {answered && (
          <div
            className={`mt-4 p-3 rounded-xl text-xs leading-relaxed ${
              isCorrect
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
            }`}
          >
            {isCorrect ? "✅ Дұрыс! +10 XP алдыңыз 🎉 — " : "❌ Қате. "}
            {quiz.explanation}
          </div>
        )}
      </div>
    </div>
  );
}
