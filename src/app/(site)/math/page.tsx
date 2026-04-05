"use client";

import { useState, useCallback, useEffect } from "react";

type Question = {
  question: string;
  answer: number;
  hint?: string;
};

function generateQuestions(): Question[] {
  const questions: Question[] = [];

  // Counting questions
  const emojis = ["🍎", "🌟", "🐟", "🦋", "🎈"];
  for (let i = 0; i < 3; i++) {
    const emoji = emojis[Math.floor(Math.random() * emojis.length)];
    const count = Math.floor(Math.random() * 8) + 2; // 2-9
    questions.push({
      question: `How many? ${emoji.repeat(count)}`,
      answer: count,
      hint: "Count them one by one!",
    });
  }

  // Addition (small numbers)
  for (let i = 0; i < 4; i++) {
    const a = Math.floor(Math.random() * 5) + 1; // 1-5
    const b = Math.floor(Math.random() * 5) + 1; // 1-5
    questions.push({
      question: `${a} + ${b} = ?`,
      answer: a + b,
      hint: "Use your fingers!",
    });
  }

  // Subtraction (result always positive)
  for (let i = 0; i < 3; i++) {
    const b = Math.floor(Math.random() * 4) + 1; // 1-4
    const a = b + Math.floor(Math.random() * 5) + 1; // always bigger
    questions.push({
      question: `${a} - ${b} = ?`,
      answer: a - b,
      hint: "Start with the big number and take away!",
    });
  }

  // Shuffle
  for (let i = questions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [questions[i], questions[j]] = [questions[j], questions[i]];
  }

  return questions;
}

function QuestionCard({
  question,
  index,
  onCorrect,
}: {
  question: Question;
  index: number;
  onCorrect: () => void;
}) {
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<"unanswered" | "correct" | "wrong">(
    "unanswered"
  );
  const [showHint, setShowHint] = useState(false);

  const check = () => {
    const val = parseInt(input, 10);
    if (val === question.answer) {
      setStatus("correct");
      onCorrect();
    } else {
      setStatus("wrong");
    }
  };

  return (
    <div
      className={`rounded-xl border p-6 transition-all ${
        status === "correct"
          ? "border-green-500 bg-green-500/10"
          : status === "wrong"
            ? "border-red-400 bg-red-400/10"
            : "border-card-border"
      }`}
    >
      <p className="text-sm text-muted mb-2">Question {index + 1}</p>
      <p className="text-2xl md:text-3xl font-bold mb-4">{question.question}</p>

      {status === "correct" ? (
        <p className="text-green-400 text-xl font-semibold">Correct!</p>
      ) : (
        <div className="flex items-center gap-3">
          <input
            type="number"
            inputMode="numeric"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              if (status === "wrong") setStatus("unanswered");
            }}
            onKeyDown={(e) => e.key === "Enter" && input && check()}
            className="w-24 rounded-lg border border-card-border bg-transparent px-4 py-2 text-xl text-center focus:outline-none focus:border-accent"
            placeholder="?"
            autoFocus={index === 0}
          />
          <button
            onClick={check}
            disabled={!input}
            className="rounded-lg bg-accent px-5 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity disabled:opacity-40"
          >
            Check
          </button>
        </div>
      )}

      {status === "wrong" && (
        <p className="text-red-400 text-sm mt-2">
          Not quite — try again!{" "}
          {question.hint && !showHint && (
            <button
              onClick={() => setShowHint(true)}
              className="underline text-muted hover:text-foreground"
            >
              Need a hint?
            </button>
          )}
        </p>
      )}

      {showHint && (
        <p className="text-muted text-sm mt-1">Hint: {question.hint}</p>
      )}
    </div>
  );
}

export default function MathPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [score, setScore] = useState(0);

  useEffect(() => {
    setQuestions(generateQuestions());
  }, []);

  const handleCorrect = useCallback(() => {
    setScore((s) => s + 1);
  }, []);

  const reset = () => {
    setQuestions(generateQuestions());
    setScore(0);
  };

  const allDone = questions.length > 0 && score === questions.length;

  if (questions.length === 0) {
    return (
      <section className="mx-auto max-w-3xl px-6 pt-24 pb-16">
        <p className="text-sm font-medium text-accent uppercase tracking-wider">
          Math Practice
        </p>
        <h1 className="text-4xl md:text-5xl font-bold leading-tight mt-2">
          Lisl&apos;s Math
        </h1>
        <p className="text-muted mt-6 text-lg">Loading questions...</p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-3xl px-6 pt-24 pb-16">
      <p className="text-sm font-medium text-accent uppercase tracking-wider">
        Math Practice
      </p>
      <h1 className="text-4xl md:text-5xl font-bold leading-tight mt-2">
        Lisl&apos;s Math
      </h1>
      <p className="text-muted mt-3 text-lg">
        Counting, addition & subtraction for age 5
      </p>

      {/* Score */}
      <div className="mt-8 flex items-center justify-between">
        <p className="text-lg">
          Score:{" "}
          <span className="font-bold text-accent">
            {score}/{questions.length}
          </span>
        </p>
        <button
          onClick={reset}
          className="rounded-lg border border-card-border px-4 py-2 text-sm text-muted hover:text-foreground hover:border-foreground transition-colors"
        >
          New Questions
        </button>
      </div>

      {allDone && (
        <div className="mt-6 rounded-xl border border-green-500 bg-green-500/10 p-6 text-center animate-fade-up">
          <p className="text-3xl mb-2">🎉</p>
          <p className="text-xl font-bold text-green-400">
            All done! Great job, Lisl!
          </p>
        </div>
      )}

      {/* Questions */}
      <div className="mt-8 space-y-6">
        {questions.map((q, i) => (
          <QuestionCard
            key={`${q.question}-${i}`}
            question={q}
            index={i}
            onCorrect={handleCorrect}
          />
        ))}
      </div>
    </section>
  );
}
