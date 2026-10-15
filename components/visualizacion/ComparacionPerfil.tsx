import type { VisualizationProfile } from "@/lib/types";

type ProfileComparisonProps = {
  current: VisualizationProfile;
  previous: VisualizationProfile;
  previousRegionLabel: string;
};

function describeChange(value: number, unit: string) {
  const rounded = Math.abs(value).toLocaleString("es-CL", {
    minimumFractionDigits: unit === "puntos" ? 0 : 2,
    maximumFractionDigits: unit === "puntos" ? 0 : 2,
  });

  if (Math.abs(value) < 0.005) return "Sin cambio";

  return [rounded, unit, value > 0 ? "más" : "menos"].filter(Boolean).join(" ");
}

export function ProfileComparison({
  current,
  previous,
  previousRegionLabel,
}: ProfileComparisonProps) {
  return (
    <aside className="rounded-2xl bg-white p-4 shadow-[0_18px_50px_rgba(30,41,59,0.14)]">
      <h2 className="text-base font-bold text-slate-950">
        Cambio desde la selección anterior
      </h2>
      <p className="mt-1 text-xs leading-snug text-slate-600">
        Antes: {previous.sex === "female" ? "mujeres" : "hombres"} de{" "}
        {previous.ageGroup} años · {previousRegionLabel}
      </p>
      <dl className="mt-4 grid gap-3">
        <div className="flex items-baseline justify-between gap-4">
          <dt className="text-sm font-medium text-slate-700">Soledad</dt>
          <dd className="text-sm font-bold text-indigo-700">
            {describeChange(
              current.lonelinessMean - previous.lonelinessMean,
              "",
            )}
          </dd>
        </div>
        <div className="flex items-baseline justify-between gap-4">
          <dt className="text-sm font-medium text-slate-700">Red de apoyo</dt>
          <dd className="text-sm font-bold text-indigo-700">
            {describeChange(
              Math.round((current.supportIndex - previous.supportIndex) * 100),
              "puntos",
            )}
          </dd>
        </div>
        <div className="flex items-baseline justify-between gap-4">
          <dt className="text-sm font-medium text-slate-700">Bienestar</dt>
          <dd className="text-sm font-bold text-indigo-700">
            {describeChange(current.wellbeingMean - previous.wellbeingMean, "")}
          </dd>
        </div>
      </dl>
    </aside>
  );
}
