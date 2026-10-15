"use client";

import { getWellbeingLevel } from "@/lib/calculos-visualizacion/bienestar";
import { getPeopleCount } from "@/lib/calculos-visualizacion/red-de-apoyo";
import { getLonelinessPose } from "@/lib/calculos-visualizacion/soledad";
import type { AgeGroup, LonelinessPose, ProfileSex } from "@/lib/types";

type VisualizationSceneProps = {
  ageGroup: AgeGroup;
  sex: ProfileSex;
  loneliness: number;
  isolation: number;
  wellbeing: number;
  isSummaryVisible: boolean;
  onCentralHoverChange: (hovered: boolean) => void;
};

type PersonPlacement = {
  left: number;
  top: number;
  size: number;
  angle: number;
  depth: number;
};

const PERSON_PLACEMENTS: PersonPlacement[] = [
  { left: 50, top: 10, size: 14, angle: 0, depth: 10 },
  { left: 17, top: 28, size: 15, angle: 2, depth: 24 },
  { left: 83, top: 28, size: 15, angle: 6, depth: 24 },
  { left: 11, top: 66, size: 16, angle: 3, depth: 60 },
  { left: 89, top: 66, size: 16, angle: 5, depth: 60 },
  { left: 27, top: 87, size: 16, angle: 3, depth: 74 },
  { left: 73, top: 87, size: 16, angle: 5, depth: 74 },
  { left: 28, top: 13, size: 13, angle: 1, depth: 12 },
  { left: 72, top: 13, size: 13, angle: 7, depth: 12 },
  { left: 50, top: 91, size: 14, angle: 4, depth: 78 },
];

const POSE_INDEX: Record<LonelinessPose, number> = {
  neutral: 0,
  closed: 1,
  sitting: 2,
};

const AGE_ASSET_SLUG: Record<AgeGroup, string> = {
  "18-29": "18-29",
  "30-44": "30-44",
  "45-59": "45-59",
  "60-79": "60-79",
  "80+": "80-mas",
};

function getSupportSheet(ageGroup: AgeGroup) {
  return `/personas/red-de-apoyo/red-apoyo-${AGE_ASSET_SLUG[ageGroup]}.webp`;
}

function getCentralSheet(sex: ProfileSex) {
  return sex === "female"
    ? "/personas/persona-central/persona-central-mujer-generica.webp"
    : "/personas/persona-central/persona-central-hombre-generico.webp";
}

function getAnglePosition(angle: number) {
  const column = angle % 4;
  const row = Math.floor(angle / 4);

  return `${(column / 3) * 100}% ${row * 100}%`;
}

function clampPosition(position: number, size: number) {
  const margin = size / 2 + 2;

  return Math.min(100 - margin, Math.max(margin, position));
}

function keepOutsideCentralFigure(
  left: number,
  top: number,
  size: number,
  index: number,
) {
  const halfSize = size / 2;
  const overlapsHorizontally = left + halfSize > 39 && left - halfSize < 61;
  const overlapsVertically = top + halfSize > 27 && top - halfSize < 81;

  if (!overlapsHorizontally || !overlapsVertically) {
    return { left, top };
  }

  const placeOnRight = left > 50 || (left === 50 && index % 2 === 0);
  const safeLeft = placeOnRight ? 61 + halfSize + 2 : 39 - halfSize - 2;

  return {
    left: clampPosition(safeLeft, size),
    top,
  };
}

export default function VisualizationScene({
  ageGroup,
  sex,
  loneliness,
  isolation,
  wellbeing,
  isSummaryVisible,
  onCentralHoverChange,
}: VisualizationSceneProps) {
  const peopleCount = getPeopleCount(isolation);
  const pose = getLonelinessPose(loneliness);
  const selectedPoseIndex = POSE_INDEX[pose];
  const centralSheet = getCentralSheet(sex);
  const wellbeingLevel = getWellbeingLevel(wellbeing);
  const supportLevel = 1 - isolation;

  return (
    <div
      className="visualization-stage relative h-[28rem] overflow-visible sm:h-[34rem] min-[1180px]:h-auto min-[1180px]:min-h-0 min-[1180px]:flex-1"
      role="group"
      aria-label={`Representación visual agregada con ${peopleCount} figuras de apoyo`}
      data-testid="visualization-scene"
      data-pose={pose}
      data-people-count={peopleCount}
      data-loneliness-visual={loneliness.toFixed(3)}
      data-isolation-visual={isolation.toFixed(3)}
      data-wellbeing-visual={wellbeing.toFixed(3)}
    >
      {PERSON_PLACEMENTS.map((placement, index) => {
        const isVisible = index < peopleCount;
        const safePosition = keepOutsideCentralFigure(
          clampPosition(placement.left, placement.size),
          clampPosition(placement.top, placement.size),
          placement.size,
          index,
        );

        return (
          <div
            key={`support-person-${index}`}
            className="support-person pointer-events-none absolute aspect-square transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
            data-active={isVisible}
            style={{
              left: `${safePosition.left}%`,
              top: `${safePosition.top}%`,
              width: `${placement.size}%`,
              zIndex: placement.depth,
              opacity: isVisible ? 0.64 + supportLevel * 0.3 : 0,
              transform: `translate(-50%, ${isVisible ? "-50%" : "-42%"}) scale(${isVisible ? 0.92 + supportLevel * 0.08 : 0.86})`,
              transitionDelay: `${index * 8}ms`,
            }}
            aria-hidden="true"
          >
            <span
              className="absolute inset-0 bg-no-repeat"
              style={{
                backgroundImage: `url('${getSupportSheet(ageGroup)}')`,
                backgroundPosition: getAnglePosition(placement.angle),
                backgroundSize: "400% 200%",
              }}
            />
          </div>
        );
      })}

      <button
        type="button"
        aria-label="Mostrar datos del perfil agregado seleccionado"
        aria-expanded={isSummaryVisible}
        aria-controls="profile-detail"
        data-testid="central-person"
        className="absolute left-1/2 top-[53%] z-[100] aspect-[1/3] h-[44%] max-h-[16rem] w-auto -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-[42%] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-500 sm:h-[46%]"
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
      >
        <span
          className="central-person-glow pointer-events-none absolute z-0 transition-[inset,opacity,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{
            left: selectedPoseIndex === 2 ? "-115%" : "-85%",
            right: selectedPoseIndex === 2 ? "-115%" : "-85%",
            top: selectedPoseIndex === 2 ? "36%" : "8%",
            bottom: selectedPoseIndex === 2 ? "-8%" : "3%",
            opacity: 0.34 + wellbeing * 0.22,
            transform: `rotate(${selectedPoseIndex === 1 ? 5 : selectedPoseIndex === 2 ? -3 : -5}deg) scale(${1.02 + wellbeing * 0.04})`,
          }}
          aria-hidden="true"
          data-wellbeing-level={wellbeingLevel.id}
        >
          <span
            className="wellbeing-light-primary absolute inset-[4%_12%_8%_2%] transition-colors duration-300"
            style={{
              color: wellbeingLevel.color,
              borderRadius: "44% 56% 63% 37% / 58% 38% 62% 42%",
            }}
          />
          <span
            className="wellbeing-light-secondary absolute inset-[22%_-2%_-3%_34%] transition-colors duration-300"
            style={{
              color: wellbeingLevel.color,
              borderRadius: "61% 39% 42% 58% / 36% 64% 41% 59%",
            }}
          />
        </span>
        {[0, 1, 2].map((poseIndex) => (
          <span
            key={`${sex}-${poseIndex}`}
            className={`central-person-pose absolute inset-0 z-10 bg-no-repeat ${selectedPoseIndex === poseIndex ? "is-active" : ""}`}
            style={{
              backgroundImage: `url('${centralSheet}')`,
              backgroundPosition: `${poseIndex * 50}% center`,
              backgroundSize: "300% 100%",
            }}
            aria-hidden="true"
          />
        ))}
      </button>
    </div>
  );
}
