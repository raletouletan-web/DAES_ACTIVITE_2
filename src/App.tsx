import { useEffect, useState } from "react";
import emailjs from "@emailjs/browser";
import ProgressBar from "./components/ProgressBar";
import IdentificationForm, { type UserInfo } from "./components/IdentificationForm";
import QuestionStep from "./components/QuestionStep";
import ReviewStep from "./components/ReviewStep";
import SuccessStep from "./components/SuccessStep";

const QUESTIONS = [
  "Question 1 - Dans votre expérience, décrivez une situation où vous avez identifié des risques lors des soins apportés et qui vous a permis la mise en œuvre d'actions de prévention adaptées.",
  "Question 2 - Comment avez-vous repéré ces risques ?",
  "Question 3 - Comment avez-vous adapté les actions de prévention à la situation de la personne ?",
];

const EMAILJS_SERVICE_ID = "service_6gsqvxg";
const EMAILJS_TEMPLATE_ID = "template_cwlsfs9";
const EMAILJS_PUBLIC_KEY = "9d3bsPq_clwKINxP3";
const ADMIN_EMAIL = "raletouletan@gmail.com";

const STORAGE_KEY = "questions_activite1_aide_soignant";

type Phase = "identification" | "questions" | "review" | "success";

type SavedState = {
  user: UserInfo;
  answers: string[];
};

function loadState(): SavedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as SavedState;
      return {
        user: parsed.user || { prenom: "", nom: "", email: "" },
        answers: parsed.answers && parsed.answers.length === QUESTIONS.length
          ? parsed.answers
          : Array(QUESTIONS.length).fill(""),
      };
    }
  } catch {
    /* ignore */
  }
  return {
    user: { prenom: "", nom: "", email: "" },
    answers: Array(QUESTIONS.length).fill(""),
  };
}

export default function App() {
  const initial = loadState();
  const [phase, setPhase] = useState<Phase>("identification");
  const [user, setUser] = useState<UserInfo>(initial.user);
  const [answers, setAnswers] = useState<string[]>(initial.answers);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  // Init EmailJS once
  useEffect(() => {
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
  }, []);

  // Auto-save
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ user, answers } satisfies SavedState),
      );
    } catch {
      /* ignore */
    }
  }, [user, answers]);

  const stepNumber: 1 | 2 | 3 | 4 =
    phase === "identification" ? 1
      : phase === "questions" ? 2
        : phase === "review" ? 3
          : 4;

  const handleIdentificationSubmit = (info: UserInfo) => {
    setUser(info);
    setPhase("questions");
    setQuestionIndex(0);
  };

  const handleAnswerChange = (index: number, value: string) => {
    setAnswers((prev) => {
      if (prev[index] === value) return prev;
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const handleNextQuestion = () => {
    if (questionIndex < QUESTIONS.length - 1) {
      setQuestionIndex(questionIndex + 1);
    } else {
      setPhase("review");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackQuestion = () => {
    if (questionIndex > 0) {
      setQuestionIndex(questionIndex - 1);
    } else {
      setPhase("identification");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleConfirmSend = async () => {
    setSending(true);
    setSendError(null);

    const baseData = {
      prenom: user.prenom,
      nom: user.nom,
      email_utilisateur: user.email,
      reponse_1: answers[0] || "",
      reponse_2: answers[1] || "",
      reponse_3: answers[2] || "",
    };

    try {
      // Send to user
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        ...baseData,
        to_email: user.email,
        reply_to: user.email,
      });

      // Send to admin
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        ...baseData,
        to_email: ADMIN_EMAIL,
        reply_to: user.email,
      });

      setPhase("success");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      const msg = (err as { text?: string; message?: string })?.text
        || (err as { message?: string })?.message
        || "Une erreur est survenue lors de l'envoi.";
      setSendError(msg);
    } finally {
      setSending(false);
    }
  };

  const handleRestart = () => {
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* noop */ }
    setUser({ prenom: "", nom: "", email: "" });
    setAnswers(Array(QUESTIONS.length).fill(""));
    setQuestionIndex(0);
    setSendError(null);
    setPhase("identification");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRestartSameUser = () => {
    setAnswers(Array(QUESTIONS.length).fill(""));
    setQuestionIndex(0);
    setSendError(null);
    setPhase("questions");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen w-full px-4 py-6 sm:py-10">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <header className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 border border-sky-100 text-xs sm:text-sm text-sky-700 font-medium mb-3 backdrop-blur-sm">
            <span>🩺</span>
            Formation aide-soignant
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold text-slate-800 leading-tight">
            Questions Activité 2
          </h1>
          <p className="text-slate-500 text-sm sm:text-base mt-1">
            Aide-soignant · Identification des risques & actions de prévention
          </p>
        </header>

        {/* Card */}
        <main className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl shadow-sky-100/50 border border-white p-5 sm:p-8">
          <ProgressBar step={stepNumber} />

          {phase === "identification" && (
            <IdentificationForm
              initial={user}
              onSubmit={handleIdentificationSubmit}
            />
          )}

          {phase === "questions" && (
            <QuestionStep
              questionIndex={questionIndex}
              totalQuestions={QUESTIONS.length}
              questionText={QUESTIONS[questionIndex]}
              initialAnswer={answers[questionIndex] || ""}
              onChange={(v) => handleAnswerChange(questionIndex, v)}
              onNext={handleNextQuestion}
              onBack={handleBackQuestion}
            />
          )}

          {phase === "review" && (
            <>
              <ReviewStep
                questions={QUESTIONS}
                answers={answers}
                onChangeAnswer={handleAnswerChange}
                onBack={() => {
                  setPhase("questions");
                  setQuestionIndex(QUESTIONS.length - 1);
                }}
                onConfirm={handleConfirmSend}
                sending={sending}
              />
              {sendError && (
                <p className="mt-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  ⚠️ Erreur d'envoi : {sendError}
                </p>
              )}
            </>
          )}

          {phase === "success" && (
            <SuccessStep
              email={user.email}
              onRestart={handleRestart}
              onRestartSameUser={handleRestartSameUser}
            />
          )}
        </main>

        <footer className="text-center mt-6 text-xs text-slate-400">
          © {new Date().getFullYear()} · Vos réponses sont sauvegardées automatiquement sur cet appareil.
        </footer>
      </div>
    </div>
  );
}
