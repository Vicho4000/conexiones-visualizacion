import type { AgeGroup, ProfileSex, VisualizationProfile } from "@/lib/types";

export const AGE_GROUPS: AgeGroup[] = [
  "18-29",
  "30-44",
  "45-59",
  "60-79",
  "80+",
];
export const SEX_OPTIONS: Array<{ value: ProfileSex; label: string }> = [
  { value: "female", label: "Mujer" },
  { value: "male", label: "Hombre" },
];

export function getProfile(
  profiles: VisualizationProfile[],
  region: string,
  ageGroup: AgeGroup,
  sex: ProfileSex,
) {
  return profiles.find(
    (profile) =>
      profile.region === region &&
      profile.ageGroup === ageGroup &&
      profile.sex === sex,
  );
}
