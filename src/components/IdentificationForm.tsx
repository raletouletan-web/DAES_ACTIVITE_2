import { useState } from "react";

export type UserInfo = {
  prenom: string;
  nom: string;
  email: string;
};

type Props = {
  initial: UserInfo;
  onSubmit: (info: UserInfo) => void;
};

export default function IdentificationForm({ initial, onSubmit }: Props) {
  const [prenom, setPrenom] = useState(initial.prenom);
  const [nom, setNom] = useState(initial.nom);
  const [email, setEmail] = useState(initial.email);
  const [errors, setErrors] = useState<{ [k: string]: string }>({});

  const validate = () => {
    const e: { [k: string]: string } = {};
    if (!prenom.trim()) e.prenom = "Le prénom est requis.";
    if (!nom.trim()) e.nom = "Le nom est requis.";
    if (!email.trim()) {
      e.email = "L'adresse e-mail est requise.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      e.email = "Format d'e-mail invalide.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (validate()) {
      onSubmit({ prenom: prenom.trim(), nom: nom.trim(), email: email.trim() });
    }
  };

  const inputCls = (hasError: boolean) =>
    `w-full px-4 py-3 rounded-xl border bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 transition-all ${
      hasError
        ? "border-red-300 focus:ring-red-200 focus:border-red-400"
        : "border-slate-200 focus:ring-sky-200 focus:border-sky-400"
    }`;

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-sky-100 mb-4">
          <span className="text-3xl">👤</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">
          Identification
        </h2>
        <p className="text-slate-500 text-sm sm:text-base">
          Renseignez vos informations pour commencer le questionnaire.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Prénom <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={prenom}
            onChange={(e) => setPrenom(e.target.value)}
            className={inputCls(!!errors.prenom)}
            placeholder="Votre prénom"
            autoComplete="given-name"
          />
          {errors.prenom && (
            <p className="mt-1.5 text-sm text-red-500">{errors.prenom}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Nom <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            className={inputCls(!!errors.nom)}
            placeholder="Votre nom"
            autoComplete="family-name"
          />
          {errors.nom && (
            <p className="mt-1.5 text-sm text-red-500">{errors.nom}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Adresse e-mail <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputCls(!!errors.email)}
            placeholder="vous@exemple.fr"
            autoComplete="email"
          />
          {errors.email && (
            <p className="mt-1.5 text-sm text-red-500">{errors.email}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full mt-4 px-6 py-3.5 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white font-semibold shadow-lg shadow-sky-500/30 hover:shadow-xl hover:shadow-sky-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
        >
          Commencer →
        </button>
      </form>
    </div>
  );
}
