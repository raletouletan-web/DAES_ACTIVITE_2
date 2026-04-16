import { useEffect, useState } from "react";
import { useSpeechRecognition } from "../hooks/useSpeechRecognition";

type Props = {
  questionIndex: number; // 0-based
  totalQuestions: number;
  questionText: string;
  initialAnswer: string;
  onChange: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
};
<div className="mt-6 flex justify-center">
          <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/b4M46Zvbwek"
            allowFullScreen
          ></iframe>
        </div>
export default function QuestionStep({
  questionIndex,
  totalQuestions,
  questionText,
  initialAnswer,
  onChange,
  onNext,
  onBack,
}: Props) {
  const [answer, setAnswer] = useState(initialAnswer);
  const { status, transcript, interim, error, supported, start, stop } =
    useSpeechRecognition("fr-FR");

  // Re-sync when switching question
  useEffect(() => {
    setAnswer(initialAnswer);
  }, [questionIndex, initialAnswer]);

  // Auto-save on change
  useEffect(() => {
    onChange(answer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answer]);

  // When transcript updates while recording, append to the textarea
  useEffect(() => {
    if (status === "recording" || status === "transcribing") {
      setAnswer(transcript + (interim ? " " + interim : ""));
    }
  }, [transcript, interim, status]);

  const handleMic = () => {
    if (status === "recording") {
      stop();
    } else {
      start(answer);
    }
  };

  const isLast = questionIndex === totalQuestions - 1;

  return (
    <div className="animate-fade-in" key={questionIndex}>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="px-2.5 py-1 rounded-full bg-sky-100 text-sky-700 text-xs font-semibold">
            Question {questionIndex + 1} / {totalQuestions}
          </span>
          <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold">
            Activité 2
          </span>
        </div>
        <h2 className="text-lg sm:text-xl font-semibold text-slate-800 leading-relaxed">
          {questionText}
        </h2>
      </div>

      <div className="relative">
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          rows={9}
          placeholder="Saisissez votre réponse ici, ou utilisez le micro pour la dicter…"
          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-400 transition-all resize-y text-slate-800 leading-relaxed"
        />

        {status === "transcribing" && (
          <div className="absolute top-3 right-3 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 border border-slate-200 shadow-sm text-xs text-slate-600">
            <span className="inline-block w-3 h-3 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
            Transcription en cours…
          </div>
        )}
        {status === "recording" && (
          <div className="absolute top-3 right-3 flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 border border-red-200 shadow-sm text-xs text-red-600 font-medium">
            <span className="inline-block w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            Enregistrement…
          </div>
        )}
      </div>

      {!supported && (
        <p className="mt-3 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
          ⚠️ La reconnaissance vocale n'est pas prise en charge par votre navigateur.
          Utilisez Chrome ou Edge sur ordinateur pour cette fonctionnalité.
        </p>
      )}
      {error && status === "error" && (
        <p className="mt-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          Erreur de reconnaissance vocale : {error}
        </p>
      )}

      <div className="mt-5 flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={handleMic}
          disabled={!supported}
          className={`flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all duration-200 ${
            status === "recording"
              ? "bg-red-500 text-white shadow-lg shadow-red-500/30 animate-pulse-rec"
              : "bg-white text-sky-700 border-2 border-sky-200 hover:border-sky-400 hover:bg-sky-50"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <span className="text-lg">🎤</span>
          {status === "recording" ? "Arrêter l'enregistrement" : "Répondre à l'oral"}
        </button>
      </div>

      <div className="mt-6 flex flex-col-reverse sm:flex-row justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-3 rounded-xl bg-slate-100 text-slate-700 font-medium hover:bg-slate-200 transition-colors"
        >
          ← Retour
        </button>
        <button
          type="button"
          onClick={onNext}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white font-semibold shadow-lg shadow-sky-500/30 hover:shadow-xl hover:-translate-y-0.5 transition-all"
        >
          {isLast ? "Voir le récapitulatif →" : "Question suivante →"}
        </button>
      </div>
    </div>
  );
}
