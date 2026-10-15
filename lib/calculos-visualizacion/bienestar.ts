export type WellbeingVisualState = {
  saturation: number;
  brightness: number;
};

export const WELLBEING_LEVELS = [
  {
    id: "low",
    label: "Bajo",
    range: "0–33%",
    color: "#fb7185",
    surface: "rgba(251, 113, 133, 0.2)",
  },
  {
    id: "medium",
    label: "Medio",
    range: "34–66%",
    color: "#f59e0b",
    surface: "rgba(245, 158, 11, 0.2)",
  },
  {
    id: "high",
    label: "Alto",
    range: "67–100%",
    color: "#14b8a6",
    surface: "rgba(20, 184, 166, 0.2)",
  },
] as const;

export function getWellbeingLevel(wellbeing: number) {
  const normalizedWellbeing = clamp01(wellbeing);
  if (normalizedWellbeing < 0.34) return WELLBEING_LEVELS[0];
  if (normalizedWellbeing < 0.67) return WELLBEING_LEVELS[1];
  return WELLBEING_LEVELS[2];
}

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

export function getWellbeingVisualState(
  wellbeing: number,
): WellbeingVisualState {
  const normalizedWellbeing = clamp01(wellbeing);

  return {
    saturation: 0.25 + normalizedWellbeing * 0.75,
    brightness: 0.72 + normalizedWellbeing * 0.28,
  };
}
