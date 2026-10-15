export function Brand() {
  return (
    <div className="flex items-center gap-4">
      <svg
        viewBox="0 0 52 52"
        className="h-11 w-11 shrink-0 min-[1180px]:h-9 min-[1180px]:w-9"
        role="img"
        aria-label="Símbolo de Conexiones"
      >
        <path
          d="M14 12 35 28M14 40 35 28"
          fill="none"
          stroke="#8b7cff"
          strokeWidth="2"
        />
        <circle cx="14" cy="12" r="8" fill="#c4b5fd" />
        <circle cx="14" cy="40" r="8" fill="#6347f5" />
        <circle cx="35" cy="28" r="8" fill="#7c5cff" />
      </svg>
      <div>
        <h1 className="text-3xl font-extrabold tracking-[-0.025em] text-slate-950 min-[1180px]:text-2xl">
          Conexiones
        </h1>
        <p className="text-sm font-medium text-indigo-700 min-[1180px]:text-xs">
          Soledad, red de apoyo y bienestar
        </p>
      </div>
    </div>
  );
}
