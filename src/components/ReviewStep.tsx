type Props = {
  questions: string[];
  answers: string[];
  onChangeAnswer: (index: number, value: string) => void;
  onBack: () => void;
  onConfirm: () => void;
  sending: boolean;
};

export default function ReviewStep({
  questions,
  answers,
  onChangeAnswer,
  onBack,
  onConfirm,
  sending,
}: Props) {
  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-100 mb-4">
          <span className="text-3xl">📝</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">
          Relecture & correction
        </h2>
        <p className="text-slate-500 text-sm sm:text-base">
          Relisez et modifiez vos réponses avant l'envoi.
        </p>
      </div>

      <div className="space-y-6">
        {questions.map((q, i) => (
          <div key={i} className="bg-white/60 backdrop-blur-sm rounded-xl border border-slate-200 p-4 sm:p-5">
            <div className="flex items-start gap-3 mb-3">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-sky-500 text-white font-semibold text-sm flex items-center justify-center">
                {i + 1}
              </span>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-800 mb-1">Réponse {i + 1}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{q}</p>
              </div>
            </div>
            <textarea
              value={answers[i] || ""}
              onChange={(e) => onChangeAnswer(i, e.target.value)}
              rows={6}
              className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-400 transition-all resize-y text-slate-800 text-sm leading-relaxed"
              placeholder="Votre réponse…"
            />
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-col-reverse sm:flex-row justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          disabled={sending}
          className="px-5 py-3 rounded-xl bg-slate-100 text-slate-700 font-medium hover:bg-slate-200 transition-colors disabled:opacity-50"
        >
          ← Retour
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={sending}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
        >
          {sending ? (
            <>
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Envoi en cours…
            </>
          ) : (
            <>✓ Confirmer l'envoi</>
          )}
        </button>
      </div>
    </div>
  );
}
