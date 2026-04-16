type Props = {
  email: string;
  onRestart: () => void;
  onRestartSameUser: () => void;
};

export default function SuccessStep({ email, onRestart, onRestartSameUser }: Props) {
  return (
    <div className="animate-fade-in text-center py-6">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100 mb-6">
        <svg
          className="w-10 h-10 text-emerald-600"
          fill="none"
          stroke="currentColor"
          strokeWidth={3}
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-3">
        Vos réponses ont été envoyées !
      </h2>
      <p className="text-slate-600 mb-2">
        Une copie a été transmise à <strong className="text-sky-700">{email}</strong>
      </p>
      <p className="text-slate-500 text-sm mb-8">
        Et également au formateur. Merci pour votre participation. ✨
      </p>

      <div className="flex flex-col sm:flex-row gap-3 justify-center items-stretch sm:items-center max-w-2xl mx-auto">
        <button
          type="button"
          onClick={onRestartSameUser}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white font-semibold shadow-lg shadow-sky-500/30 hover:shadow-xl hover:-translate-y-0.5 transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refaire le questionnaire
        </button>

        <button
          type="button"
          onClick={onRestart}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white border-2 border-slate-200 text-slate-700 font-semibold hover:border-sky-300 hover:text-sky-700 hover:-translate-y-0.5 transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Nouvel utilisateur
        </button>
      </div>

      <p className="text-xs text-slate-400 mt-6">
        « Refaire le questionnaire » conserve votre identité · « Nouvel utilisateur » remet tout à zéro.
      </p>
    </div>
  );
}
