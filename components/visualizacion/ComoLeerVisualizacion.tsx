import { WELLBEING_LEVELS } from "@/lib/calculos-visualizacion/bienestar";

function PersonIcon() {
  return (
    <div className="flex h-14 w-14 justify-center" aria-hidden="true">
      <div className="h-14 aspect-[1/3] bg-[url('/personas/persona-central/persona-central-mujer-generica.webp')] bg-[length:300%_100%] bg-right bg-no-repeat drop-shadow-md" />
    </div>
  );
}

function PeopleIcon() {
  return (
    <div
      className="flex h-14 w-16 items-center justify-center -space-x-2"
      aria-hidden="true"
    >
      {[0, 1, 2].map((person) => (
        <span
          key={person}
          className="h-12 w-12 bg-no-repeat drop-shadow-sm"
          style={{
            backgroundImage:
              "url('/personas/red-de-apoyo/red-apoyo-18-29.webp')",
            backgroundPosition: `${(person / 3) * 100}% 0%`,
            backgroundSize: "400% 200%",
          }}
        />
      ))}
    </div>
  );
}

function WellbeingIcon() {
  return (
    <div
      className="flex h-14 w-14 items-center justify-center"
      aria-hidden="true"
    >
      <span className="h-14 aspect-[1/3] bg-[url('/personas/persona-central/persona-central-mujer-generica.webp')] bg-left bg-[length:300%_100%] bg-no-repeat [filter:drop-shadow(0_0_7px_#f59e0b)_drop-shadow(0_5px_10px_rgba(245,158,11,0.45))]" />
    </div>
  );
}

export function VisualEncodingLegend() {
  return (
    <aside className="min-w-0 rounded-2xl bg-white/95 p-5 shadow-[0_18px_50px_rgba(30,41,59,0.12)] sm:p-6 min-[1180px]:p-5">
      <h2 className="mb-5 text-xl font-bold leading-tight tracking-tight text-slate-950 sm:text-2xl min-[1180px]:mb-4 min-[1180px]:text-xl">
        Cómo leerla
      </h2>
      <div className="grid gap-5 sm:grid-cols-3 lg:grid-cols-1 min-[1180px]:gap-3">
        <div className="grid min-w-0 grid-cols-[4rem_minmax(0,1fr)] items-center gap-3">
          <PersonIcon />
          <div>
            <h3 className="font-semibold text-slate-900">Soledad</h3>
            <p className="mt-1 text-xs leading-snug text-slate-600">
              Una postura más cerrada indica mayor soledad promedio.
            </p>
          </div>
        </div>
        <div className="grid min-w-0 grid-cols-[4rem_minmax(0,1fr)] items-center gap-3">
          <PeopleIcon />
          <div>
            <h3 className="font-semibold text-slate-900">Red de apoyo</h3>
            <p className="mt-1 text-xs leading-snug text-slate-600">
              Más figuras indican una red de apoyo percibida más fuerte.
            </p>
          </div>
        </div>
        <div className="grid min-w-0 grid-cols-[4rem_minmax(0,1fr)] items-center gap-3">
          <WellbeingIcon />
          <div>
            <h3 className="font-semibold text-slate-900">Bienestar</h3>
            <p className="mt-1 text-xs leading-snug text-slate-600">
              El resplandor detrás de la persona muestra un nivel bajo, medio o
              alto.
            </p>
          </div>
        </div>
        <div className="col-span-full grid grid-cols-3 gap-2 lg:grid-cols-1">
          {WELLBEING_LEVELS.map((level) => (
            <div
              key={level.id}
              className="flex items-center gap-2 text-xs text-slate-700"
            >
              <span
                className="h-3 w-3 shrink-0 rounded-full border-2"
                style={{
                  backgroundColor: level.surface,
                  borderColor: level.color,
                }}
                aria-hidden="true"
              />
              <span className="font-semibold">{level.label}</span>
              <span className="tabular-nums text-slate-500">{level.range}</span>
            </div>
          ))}
        </div>
      </div>
      <p className="mt-6 border-t border-indigo-200 pt-4 text-sm leading-relaxed text-slate-700 min-[1180px]:mt-4 min-[1180px]:pt-3 min-[1180px]:text-xs">
        Describe promedios del grupo seleccionado, no personas individuales.
      </p>
    </aside>
  );
}
