import { extent, scaleLinear } from "d3";
import type { VisualizationProfile } from "@/lib/types";

export type VisualEncodingValues = {
  loneliness: number;
  isolation: number;
  wellbeing: number;
};

function createRelativeScale(values: number[]) {
  const [minimum = 0, maximum = 1] = extent(values);

  if (minimum === maximum) return () => 0.5;

  return scaleLinear().domain([minimum, maximum]).range([0, 1]).clamp(true);
}

export function getVisualEncodingValues(
  profile: VisualizationProfile,
  profiles: VisualizationProfile[],
): VisualEncodingValues {
  const comparableProfiles = profiles.filter(
    (item) => item.region === profile.region && item.sex === profile.sex,
  );
  const lonelinessScale = createRelativeScale(
    comparableProfiles.map((item) => item.loneliness),
  );
  const isolationScale = createRelativeScale(
    comparableProfiles.map((item) => item.isolation),
  );
  const wellbeingScale = createRelativeScale(
    comparableProfiles.map((item) => item.wellbeing),
  );

  return {
    loneliness: lonelinessScale(profile.loneliness),
    isolation: isolationScale(profile.isolation),
    wellbeing: wellbeingScale(profile.wellbeing),
  };
}
