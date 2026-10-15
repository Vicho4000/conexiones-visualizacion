"use client";

import { useEffect, useRef } from "react";
import type { PointerEvent } from "react";
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
  previousProfile?: {
    sex: ProfileSex;
    loneliness: number;
    comparisonKey: string;
  };
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

const CONNECTED_ANGLES = [0, 1, 7, 2, 6, 3, 5, 4, 0, 4];

const AGE_ASSET_SLUG: Record<AgeGroup, string> = {
  "18-29": "18-29",
  "30-44": "30-44",
  "45-59": "45-59",
  "60-79": "60-79",
  "80+": "80-mas",
};

const SCENE_IMAGE_ASSETS = [
  "/personas/persona-central/persona-central-mujer-generica.webp",
  "/personas/persona-central/persona-central-hombre-generico.webp",
  ...Object.values(AGE_ASSET_SLUG).map(
    (age) => `/personas/red-de-apoyo/red-apoyo-${age}.webp`,
  ),
];

const CONNECTED_GROUP_POSITIONS = [
  { left: 50, top: 10 },
  { left: 18, top: 32 },
  { left: 82, top: 32 },
  { left: 12, top: 65 },
  { left: 88, top: 65 },
  { left: 25, top: 76 },
  { left: 75, top: 76 },
  { left: 29, top: 25 },
  { left: 71, top: 25 },
  { left: 50, top: 91 },
];

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

function interpolate(from: number, to: number, progress: number) {
  return from + (to - from) * progress;
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
  previousProfile,
  isSummaryVisible,
  onCentralHoverChange,
}: VisualizationSceneProps) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const sceneBoundsRef = useRef<DOMRect | null>(null);
  const pointerFrameRef = useRef<number | null>(null);
  const pointerPositionRef = useRef({ horizontal: 0, vertical: 0 });
  const peopleCount = getPeopleCount(isolation);
  const pose = getLonelinessPose(loneliness);
  const selectedPoseIndex = POSE_INDEX[pose];
  const centralSheet = getCentralSheet(sex);
  const wellbeingLevel = getWellbeingLevel(wellbeing);
  const supportLevel = 1 - isolation;
  const socialSpread = 0.78 + isolation * 0.3;
  const groupingStrength = Math.max(0, (supportLevel - 0.55) / 0.45);

  useEffect(() => {
    const scene = sceneRef.current;
    SCENE_IMAGE_ASSETS.forEach((source) => {
      const image = new Image();
      image.decoding = "async";
      image.src = source;
    });
    const resizeObserver = scene
      ? new ResizeObserver(() => {
          sceneBoundsRef.current = scene.getBoundingClientRect();
        })
      : null;

    if (scene) {
      sceneBoundsRef.current = scene.getBoundingClientRect();
      resizeObserver?.observe(scene);
    }

    return () => {
      resizeObserver?.disconnect();
      if (pointerFrameRef.current !== null) {
        cancelAnimationFrame(pointerFrameRef.current);
      }
    };
  }, []);

  function updatePointerPosition(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse") return;

    const bounds =
      sceneBoundsRef.current ?? event.currentTarget.getBoundingClientRect();
    pointerPositionRef.current = {
      horizontal: (event.clientX - bounds.left) / bounds.width - 0.5,
      vertical: (event.clientY - bounds.top) / bounds.height - 0.5,
    };

    if (pointerFrameRef.current !== null) return;

    pointerFrameRef.current = requestAnimationFrame(() => {
      const element = sceneRef.current;
      const { horizontal, vertical } = pointerPositionRef.current;

      element?.style.setProperty("--scene-x", `${horizontal * 14}px`);
      element?.style.setProperty("--scene-y", `${vertical * 10}px`);
      element?.style.setProperty("--focus-x", `${horizontal * 6}px`);
      element?.style.setProperty("--focus-y", `${vertical * 4}px`);
      pointerFrameRef.current = null;
    });
  }

  function resetPointerPosition() {
    if (pointerFrameRef.current !== null) {
      cancelAnimationFrame(pointerFrameRef.current);
      pointerFrameRef.current = null;
    }

    const element = sceneRef.current;
    element?.style.setProperty("--scene-x", "0px");
    element?.style.setProperty("--scene-y", "0px");
    element?.style.setProperty("--focus-x", "0px");
    element?.style.setProperty("--focus-y", "0px");
  }

  return (
    <div
      ref={sceneRef}
      className="visualization-stage relative h-[28rem] overflow-visible sm:h-[34rem] min-[1180px]:h-auto min-[1180px]:min-h-0 min-[1180px]:flex-1"
      role="group"
      aria-label={`Representación visual agregada con ${peopleCount} figuras de apoyo`}
      data-testid="visualization-scene"
      data-pose={pose}
      data-people-count={peopleCount}
      data-loneliness-visual={loneliness.toFixed(3)}
      data-isolation-visual={isolation.toFixed(3)}
      data-wellbeing-visual={wellbeing.toFixed(3)}
      onPointerEnter={(event) => {
        sceneBoundsRef.current = event.currentTarget.getBoundingClientRect();
      }}
      onPointerMove={updatePointerPosition}
      onPointerLeave={resetPointerPosition}
    >
      {PERSON_PLACEMENTS.map((placement, index) => {
        const isVisible = index < peopleCount;
        const responsiveAngle =
          supportLevel >= 0.67 ? CONNECTED_ANGLES[index] : placement.angle;
        const groupedPosition = CONNECTED_GROUP_POSITIONS[index];
        const responsiveLeft = interpolate(
          placement.left,
          groupedPosition.left,
          groupingStrength,
        );
        const responsiveTop = interpolate(
          placement.top,
          groupedPosition.top,
          groupingStrength,
        );
        const initialHorizontalPosition = clampPosition(
          50 + (responsiveLeft - 50) * socialSpread,
          placement.size,
        );
        const initialVerticalPosition = clampPosition(
          53 + (responsiveTop - 53) * socialSpread,
          placement.size,
        );
        const safePosition = keepOutsideCentralFigure(
          initialHorizontalPosition,
          initialVerticalPosition,
          placement.size,
          index,
        );

        return (
          <div
            key={`support-person-${index}`}
            className="support-person pointer-events-none absolute aspect-square transition-[left,top,width,opacity,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
            data-active={isVisible}
            style={{
              left: `${safePosition.left}%`,
              top: `${safePosition.top}%`,
              width: `${placement.size}%`,
              zIndex: placement.depth,
              opacity: isVisible ? 0.58 + supportLevel * 0.42 : 0,
              transform: `translate(-50%, ${isVisible ? "-50%" : "-42%"}) scale(${isVisible ? 0.92 + supportLevel * 0.08 : 0.86})`,
              transitionDelay: `${index * 18}ms`,
            }}
            aria-hidden="true"
          >
            <span
              className="absolute inset-0 bg-no-repeat transition-[transform,filter] duration-300 ease-out"
              style={{
                transform:
                  "translate(var(--scene-x, 0px), var(--scene-y, 0px))",
                filter: `grayscale(${0.98 - supportLevel * 0.24}) saturate(${0.2 + supportLevel * 0.34}) drop-shadow(0 18px 16px rgba(51, 65, 85, ${0.08 + supportLevel * 0.08}))`,
                backgroundImage: `url('${getSupportSheet(ageGroup)}')`,
                backgroundPosition: getAnglePosition(responsiveAngle),
                backgroundSize: "400% 200%",
                willChange: "transform",
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
        className="absolute left-1/2 top-[53%] z-[100] aspect-[1/3] h-[44%] max-h-[16rem] w-auto cursor-pointer rounded-[42%] transition-transform duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-500 sm:h-[46%]"
        style={{
          filter: "drop-shadow(0 22px 20px rgba(79, 70, 170, 0.18))",
          transform:
            "translate(calc(-50% + var(--focus-x, 0px)), calc(-50% + var(--focus-y, 0px)))",
        }}
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
        {[0, 1, 2].map((poseIndex) => (
          <span
            key={`glow-${poseIndex}`}
            className="central-person-glow pointer-events-none absolute z-0 transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{
              left: poseIndex === 2 ? "-115%" : "-85%",
              right: poseIndex === 2 ? "-115%" : "-85%",
              top: poseIndex === 2 ? "36%" : "8%",
              bottom: poseIndex === 2 ? "-8%" : "3%",
              opacity:
                selectedPoseIndex === poseIndex ? 0.2 + wellbeing * 0.14 : 0,
              transform: `rotate(${poseIndex === 1 ? 5 : poseIndex === 2 ? -3 : -5}deg) scale(${1.02 + wellbeing * 0.04})`,
            }}
            aria-hidden="true"
            data-wellbeing-level={wellbeingLevel.id}
          >
            <span
              className="absolute inset-[4%_12%_8%_2%] transition-[background-color,filter] duration-500"
              style={{
                backgroundColor: wellbeingLevel.color,
                borderRadius: "44% 56% 63% 37% / 58% 38% 62% 42%",
                filter: `blur(${18 + wellbeing * 7}px)`,
              }}
            />
            <span
              className="absolute inset-[22%_-2%_-3%_34%] transition-[background-color,filter] duration-500"
              style={{
                backgroundColor: wellbeingLevel.color,
                borderRadius: "61% 39% 42% 58% / 36% 64% 41% 59%",
                filter: `blur(${22 + wellbeing * 8}px)`,
              }}
            />
          </span>
        ))}
        {previousProfile ? (
          <span
            key={previousProfile.comparisonKey}
            className="previous-profile-ghost pointer-events-none absolute inset-0 z-[5] bg-no-repeat"
            style={{
              backgroundImage: `url('${getCentralSheet(previousProfile.sex)}')`,
              backgroundPosition: `${POSE_INDEX[getLonelinessPose(previousProfile.loneliness)] * 50}% center`,
              backgroundSize: "300% 100%",
            }}
            aria-hidden="true"
          />
        ) : null}
        {[0, 1, 2].map((poseIndex) => (
          <span
            key={poseIndex}
            className="absolute inset-0 z-10 bg-no-repeat transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{
              backgroundImage: `url('${centralSheet}')`,
              backgroundPosition: `${poseIndex * 50}% center`,
              backgroundSize: "300% 100%",
              opacity: selectedPoseIndex === poseIndex ? 1 : 0,
              transform:
                selectedPoseIndex === poseIndex
                  ? "translateY(0) scale(1)"
                  : "translateY(8px) scale(0.98)",
            }}
            aria-hidden="true"
          />
        ))}
      </button>
    </div>
  );
}
