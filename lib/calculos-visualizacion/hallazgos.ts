import type { VisualizationProfile } from "@/lib/types";

type InsightCandidate = {
  importance: number;
  text: string;
};

type MetricDefinition = {
  values: number[];
  current: number;
  meaningfulDifference: number;
  scale: number;
  highText: string;
  lowText: string;
  differenceText: (difference: number) => string;
};

function average(values: number[]) {
  return values.reduce((total, value) => total + value, 0) / values.length;
}

function direction(value: number) {
  return value >= 0 ? "sobre" : "bajo";
}

function formatDecimal(value: number) {
  return value.toLocaleString("es-CL", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function getProfileInsight(
  profile: VisualizationProfile,
  profiles: VisualizationProfile[],
): string | null {
  const comparableProfiles = profiles.filter(
    (item) => item.region === profile.region && item.sex === profile.sex,
  );

  if (comparableProfiles.length < 2) {
    return null;
  }

  const metrics: MetricDefinition[] = [
    {
      values: comparableProfiles.map((item) => item.lonelinessMean),
      current: profile.lonelinessMean,
      meaningfulDifference: 0.15,
      scale: 4,
      highText: "La soledad está entre las más altas de las edades comparadas.",
      lowText: "La soledad está entre las más bajas de las edades comparadas.",
      differenceText: (difference) =>
        `La soledad está ${formatDecimal(Math.abs(difference))} puntos ${direction(difference)} el promedio de las edades comparadas.`,
    },
    {
      values: comparableProfiles.map((item) => item.supportIndex),
      current: profile.supportIndex,
      meaningfulDifference: 0.03,
      scale: 1,
      highText:
        "La red de apoyo está entre las más altas de las edades comparadas.",
      lowText:
        "La red de apoyo está entre las más bajas de las edades comparadas.",
      differenceText: (difference) =>
        `La red de apoyo está ${Math.abs(Math.round(difference * 100))} puntos ${direction(difference)} el promedio de las edades comparadas.`,
    },
    {
      values: comparableProfiles.map((item) => item.wellbeingMean),
      current: profile.wellbeingMean,
      meaningfulDifference: 0.15,
      scale: 4,
      highText:
        "El bienestar está entre los más altos de las edades comparadas.",
      lowText:
        "El bienestar está entre los más bajos de las edades comparadas.",
      differenceText: (difference) =>
        `El bienestar está ${formatDecimal(Math.abs(difference))} puntos ${direction(difference)} el promedio de las edades comparadas.`,
    },
  ];

  const candidates = metrics.flatMap<InsightCandidate>((metric) => {
    const minimum = Math.min(...metric.values);
    const maximum = Math.max(...metric.values);
    const range = maximum - minimum;

    if (range < metric.meaningfulDifference) return [];

    const tolerance = metric.meaningfulDifference / 4;
    const isHigh = maximum - metric.current <= tolerance;
    const isLow = metric.current - minimum <= tolerance;

    if (isHigh || isLow) {
      return [
        {
          importance: range / metric.scale + 0.1,
          text: isHigh ? metric.highText : metric.lowText,
        },
      ];
    }

    const difference = metric.current - average(metric.values);

    if (Math.abs(difference) < metric.meaningfulDifference) return [];

    return [
      {
        importance: Math.abs(difference) / metric.scale,
        text: metric.differenceText(difference),
      },
    ];
  });

  return (
    candidates.toSorted(
      (first, second) => second.importance - first.importance,
    )[0]?.text ?? null
  );
}
