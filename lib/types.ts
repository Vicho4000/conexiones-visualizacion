export type Sex = "mujer" | "hombre" | "otro/no informado";

export type VisualizationDatum = {
  id: string;
  ageGroup: string;
  sex: Sex;
  loneliness: number;
  socialIntegration: number;
  wellbeing: number;
  isDemo: true;
};

export type AgeGroup = "18-29" | "30-44" | "45-59" | "60-79" | "80+";
export type ProfileSex = "female" | "male";
export type LonelinessPose = "neutral" | "closed" | "sitting";

export type RegionOption = {
  id: string;
  label: string;
};

export type VisualizationProfile = {
  region: string;
  ageGroup: AgeGroup;
  sex: ProfileSex;
  loneliness: number;
  isolation: number;
  wellbeing: number;
  lonelinessMean: number;
  supportIndex: number;
  wellbeingMean: number;
  sampleSize?: number;
};

export type ProfilesMetadata = {
  dataStatus: "real-aggregate";
  source: string;
  weight: string;
  description: string;
  regions: RegionOption[];
  indicators: {
    loneliness: string;
    support: string;
    wellbeing: string;
  };
};

export type ProfilesFile = {
  _meta: ProfilesMetadata;
  profiles: VisualizationProfile[];
};
