import type { LonelinessPose } from "@/lib/types";

export function getLonelinessPose(loneliness: number): LonelinessPose {
  if (loneliness <= 0.25) return "neutral";
  if (loneliness <= 0.5) return "closed";
  return "sitting";
}
