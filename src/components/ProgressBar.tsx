type Props = {
  step: number; // 1..4
  total?: number;
};

const labels = ["Identification", "Questions", "Relecture", "Envoi"];

export default function ProgressBar({ step, total = 4 }: Props) {
  const pct = (step / total) * 100;
  return (
    <div className="w-full mb-8">
      <div className="flex justify-between mb-2 text-xs sm:text-sm font-medium text-slate-600">
        {labels.map((label, i) => {
          const idx = i + 1;
          const active = idx <= step;
          return (
            <div
              key={label}
              className={`flex items-center gap-2 transition-colors ${
                active ? "text-sky-700" : "text-slate-400"
              }`}
            >
              <span
                className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold border transition-all ${
                  active
                    ? "bg-sky-500 text-white border-sky-500"
                    : "bg-white text-slate-400 border-slate-300"
                }`}
              >
                {idx}
              </span>
              <span className="hidden sm:inline">{label}</span>
            </div>
          );
        })}
      </div>
      <div className="w-full h-2 bg-slate-200/70 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-sky-400 to-sky-600 transition-all duration-500 ease-out rounded-full"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
