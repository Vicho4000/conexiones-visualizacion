"use client";

import dynamic from "next/dynamic";
import { getWellbeingLevel } from "@/lib/calculos-visualizacion/bienestar";
import { getPeopleCount } from "@/lib/calculos-visualizacion/red-de-apoyo";
import { getLonelinessPose } from "@/lib/calculos-visualizacion/soledad";
import type { AgeGroup, ProfileSex } from "@/lib/types";

const Scene3D = dynamic(() => import("./Escena3D"), {
  ssr: false,
  loading: () => (
    <div className="scene-loading absolute inset-[18%_12%] rounded-[50%] bg-indigo-100/45" />
  ),
});

type VisualizationSceneProps = {
  ageGroup: AgeGroup;
  sex: ProfileSex;
  loneliness: number;
  isolation: number;
  wellbeing: number;
  previousProfile?: {
    ageGroup: AgeGroup;
    sex: ProfileSex;
    loneliness: number;
    comparisonKey: string;
  };
  isSummaryVisible: boolean;
  onCentralHoverChange: (hovered: boolean) => void;
};

export default function VisualizationScene({
  loneliness,
  isolation,
  wellbeing,
  isSummaryVisible,
  onCentralHoverChange,
}: VisualizationSceneProps) {
  const peopleCount = getPeopleCount(isolation);
  const pose = getLonelinessPose(loneliness);
  const wellbeingLevel = getWellbeingLevel(wellbeing);

  return (
    <div
      className="visualization-stage relative h-[28rem] overflow-visible sm:h-[34rem] min-[1180px]:h-auto min-[1180px]:min-h-0 min-[1180px]:flex-1"
      role="group"
      aria-label={`Escena tridimensional agregada con ${peopleCount} figuras de apoyo`}
      data-testid="visualization-scene"
      data-pose={pose}
      data-people-count={peopleCount}
      data-loneliness-visual={loneliness.toFixed(3)}
      data-isolation-visual={isolation.toFixed(3)}
      data-wellbeing-visual={wellbeing.toFixed(3)}
    >
      <Scene3D
        peopleCount={peopleCount}
        supportLevel={1 - isolation}
        wellbeing={wellbeing}
        wellbeingColor={wellbeingLevel.color}
        pose={pose}
      />
      <button
        type="button"
        aria-label="Mostrar datos del perfil agregado seleccionado"
        aria-expanded={isSummaryVisible}
        aria-controls="profile-detail"
        data-testid="central-person"
        className="absolute left-1/2 top-[52%] z-20 h-[42%] w-[18%] -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-[45%] bg-transparent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-500"
        onPointerEnter={(event) => {
          if (event.pointerType === "mouse") onCentralHoverChange(true);
        }}
        onPointerLeave={(event) => {
          if (event.pointerType === "mouse") onCentralHoverChange(false);
        }}
        onPointerUp={(event) => {
          if (event.pointerType !== "mouse") {
            onCentralHoverChange(!isSummaryVisible);
          }
        }}
        onFocus={() => onCentralHoverChange(true)}
        onBlur={() => onCentralHoverChange(false)}
      />
    </div>
  );
}
