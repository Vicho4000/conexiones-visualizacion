import { getWellbeingLevel } from "@/lib/calculos-visualizacion/bienestar";
import type { VisualEncodingValues } from "@/lib/calculos-visualizacion/codificacion-visual";
import { getPeopleCount } from "@/lib/calculos-visualizacion/red-de-apoyo";
import { getLonelinessPose } from "@/lib/calculos-visualizacion/soledad";
import type { VisualizationProfile } from "@/lib/types";

type ProfileSummaryProps = {
  profile: VisualizationProfile;
  regionLabel: string;
  visualValues: VisualEncodingValues;
};

function IndicatorRow({
  label,
  value,
  displayValue,
  level,
  explanation,
}: {
  label: string;
  value: number;
  displayValue: string;
  level: string;
  explanation: string;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between gap-3">
        <dt className="text-sm font-semibold text-slate-900">{label}</dt>
        <dd className="text-right text-xs tabular-nums text-slate-600">
          <span className="font-bold text-indigo-700">{level}</span>
          <span aria-hidden="true"> · </span>
          {displayValue}
        </dd>
      </div>
      <dd className="h-1.5 overflow-hidden rounded-full bg-indigo-50">
        <span
          className="metric-bar block h-full rounded-full bg-indigo-600 transition-[width] duration-500"
          style={{ width: `${Math.round(value * 100)}%` }}
        />
      </dd>
      <dd className="mt-1.5 text-xs leading-snug text-slate-600">
        {explanation}
      </dd>
    </div>
  );
}

const SEX_LABELS = { female: "Mujeres", male: "Hombres" } as const;
const POSE_LABELS = {
  neutral: "neutral",
  closed: "cerrada",
  sitting: "sentada",
} as const;

const GLOW_COLOR_LABELS = {
  low: "rosado",
  medium: "ámbar",
  high: "turquesa",
} as const;

function getSimpleLevel(value: number, feminine = false) {
  if (value < 0.34) return feminine ? "Baja" : "Bajo";
  if (value < 0.67) return feminine ? "Media" : "Medio";
  return feminine ? "Alta" : "Alto";
}

export function ProfileSummary({
  profile,
  regionLabel,
  visualValues,
}: ProfileSummaryProps) {
  const pose = getLonelinessPose(visualValues.loneliness);
  const peopleCount = getPeopleCount(visualValues.isolation);
  const wellbeingLevel = getWellbeingLevel(visualValues.wellbeing);

  return (
    <aside className="w-[min(18.5rem,calc(100vw-3.5rem))] rounded-2xl bg-white p-4 shadow-xl shadow-slate-900/10">
      <h3 className="text-base font-bold text-slate-950">
        Este grupo, en promedio
      </h3>
      <p className="mb-4 mt-1 text-xs leading-snug text-slate-600">
        {SEX_LABELS[profile.sex]} de {profile.ageGroup} años · {regionLabel}
      </p>
      <dl className="space-y-3">
        <IndicatorRow
          label="Soledad"
          value={profile.loneliness}
          displayValue={`${profile.lonelinessMean.toFixed(2)} de 5`}
          level={getSimpleLevel(visualValues.loneliness, true)}
          explanation={`La persona adopta una postura ${POSE_LABELS[pose]}.`}
        />
        <IndicatorRow
          label="Red de apoyo"
          value={profile.supportIndex}
          displayValue={`${Math.round(profile.supportIndex * 100)} de 100`}
          level={getSimpleLevel(1 - visualValues.isolation, true)}
          explanation={`A su alrededor aparecen ${peopleCount} figuras.`}
        />
        <IndicatorRow
          label="Bienestar"
          value={profile.wellbeing}
          displayValue={`${profile.wellbeingMean.toFixed(2)} de 5`}
          level={wellbeingLevel.label}
          explanation={`La persona brilla con un tono ${GLOW_COLOR_LABELS[wellbeingLevel.id]}.`}
        />
      </dl>
    </aside>
  );
}
