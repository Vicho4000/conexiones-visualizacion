"use client";

import { useEffect, useState } from "react";
import { getVisualEncodingValues } from "@/lib/calculos-visualizacion/codificacion-visual";
import { getProfileInsight } from "@/lib/calculos-visualizacion/hallazgos";
import { getProfile } from "@/lib/calculos-visualizacion/perfiles";
import type {
  AgeGroup,
  ProfilesMetadata,
  ProfileSex,
  VisualizationProfile,
} from "@/lib/types";
import { ProfileComparison } from "./ComparacionPerfil";
import { VisualEncodingLegend } from "./ComoLeerVisualizacion";
import { Controls } from "./ControlesPerfil";
import VisualizationScene from "./EscenarioVisual";
import { ProfileInsight } from "./HallazgoPerfil";
import { ProfileSummary } from "./ResumenPerfil";

type VisualizationProps = {
  profiles: VisualizationProfile[];
  metadata: ProfilesMetadata;
};

const FIRST_VISIT_KEY = "conexiones:profile-hint-seen:v1";

export function Visualization({ profiles, metadata }: VisualizationProps) {
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<AgeGroup>("18-29");
  const [selectedGender, setSelectedGender] = useState<ProfileSex>("female");
  const [isCentralHovered, setIsCentralHovered] = useState(false);
  const [isLegendOpen, setIsLegendOpen] = useState(false);
  const [previousProfile, setPreviousProfile] =
    useState<VisualizationProfile | null>(null);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);
  const [isInsightOpen, setIsInsightOpen] = useState(false);
  const [showFirstVisitHint, setShowFirstVisitHint] = useState(false);

  useEffect(() => {
    const animationFrame = requestAnimationFrame(() => {
      setShowFirstVisitHint(localStorage.getItem(FIRST_VISIT_KEY) !== "true");
    });

    return () => cancelAnimationFrame(animationFrame);
  }, []);
  const profile =
    getProfile(profiles, selectedRegion, selectedAgeGroup, selectedGender) ??
    profiles[0];

  if (!profile) {
    return <p role="alert">No hay perfiles de demostración disponibles.</p>;
  }

  const visualValues = getVisualEncodingValues(profile, profiles);
  const regionLabel =
    metadata.regions.find((region) => region.id === profile.region)?.label ??
    "Todo Chile";
  const previousRegionLabel = previousProfile
    ? (metadata.regions.find((region) => region.id === previousProfile.region)
        ?.label ?? "Todo Chile")
    : "";
  const profileInsight = getProfileInsight(profile, profiles);

  function prepareProfileChange() {
    setPreviousProfile(profile);
    setIsCentralHovered(false);
    setIsLegendOpen(false);
    setIsComparisonOpen(false);
    setIsInsightOpen(false);
    setShowFirstVisitHint(false);
    localStorage.setItem(FIRST_VISIT_KEY, "true");
  }

  return (
    <section className="min-w-0">
      <p className="sr-only" aria-live="polite">
        Perfil seleccionado: {profile.sex === "female" ? "mujeres" : "hombres"}{" "}
        de {profile.ageGroup} años, {regionLabel}. Soledad{" "}
        {profile.lonelinessMean.toFixed(2)} de 5, red de apoyo{" "}
        {Math.round(profile.supportIndex * 100)} de 100 y bienestar{" "}
        {profile.wellbeingMean.toFixed(2)} de 5.
      </p>
      <div className="grid min-w-0 max-w-full grid-cols-[minmax(0,1fr)] items-start gap-6 min-[1180px]:h-[calc(100dvh-5.5rem)] min-[1180px]:min-h-[630px] min-[1180px]:grid-cols-[15.5rem_minmax(0,1fr)] min-[1180px]:gap-5 min-[1400px]:grid-cols-[16.5rem_minmax(0,1fr)] min-[1400px]:gap-7">
        <Controls
          regions={metadata.regions}
          selectedRegion={selectedRegion}
          selectedAgeGroup={selectedAgeGroup}
          selectedGender={selectedGender}
          onRegionChange={(region) => {
            prepareProfileChange();
            setSelectedRegion(region);
          }}
          onAgeGroupChange={(ageGroup) => {
            prepareProfileChange();
            setSelectedAgeGroup(ageGroup);
          }}
          onGenderChange={(gender) => {
            prepareProfileChange();
            setSelectedGender(gender);
          }}
        />
        <div className="relative flex min-w-0 max-w-full flex-col min-[1180px]:h-full">
          <button
            type="button"
            className={`absolute right-3 top-3 z-[130] flex h-11 w-11 items-center justify-center rounded-full shadow-[0_10px_30px_rgba(30,41,59,0.14)] transition-[background-color,color,transform] duration-200 hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-indigo-600 ${
              isLegendOpen
                ? "bg-indigo-600 text-white"
                : "bg-white text-indigo-700 hover:bg-indigo-50"
            }`}
            title="Cómo leerla"
            aria-label={
              isLegendOpen
                ? "Cerrar cómo leer la visualización"
                : "Abrir cómo leer la visualización"
            }
            aria-expanded={isLegendOpen}
            aria-controls="visualization-legend"
            onClick={() => {
              setIsComparisonOpen(false);
              setIsInsightOpen(false);
              setIsLegendOpen((isOpen) => !isOpen);
            }}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <circle
                cx="12"
                cy="12"
                r="9"
                stroke="currentColor"
                strokeWidth="1.8"
              />
              <path
                d="M12 10.5V17"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <circle cx="12" cy="7.4" r="1" fill="currentColor" />
            </svg>
          </button>
          <button
            type="button"
            className={`absolute right-16 top-3 z-[130] flex h-11 w-11 items-center justify-center rounded-full shadow-[0_10px_30px_rgba(30,41,59,0.14)] transition-[background-color,color,transform] duration-200 hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:bg-white disabled:text-slate-300 disabled:shadow-none disabled:hover:scale-100 ${
              isInsightOpen
                ? "bg-indigo-600 text-white"
                : "bg-white text-indigo-700 hover:bg-indigo-50"
            }`}
            title={
              profileInsight
                ? "Dato destacado"
                : "No hay una diferencia destacable en este perfil"
            }
            aria-label={
              profileInsight
                ? "Mostrar dato destacado"
                : "No hay una diferencia destacable en este perfil"
            }
            aria-expanded={isInsightOpen}
            aria-controls="profile-insight"
            disabled={!profileInsight}
            onClick={() => {
              setIsLegendOpen(false);
              setIsComparisonOpen(false);
              setIsInsightOpen((isOpen) => !isOpen);
            }}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M12 3.5 13.5 9l5.5 1.5-5.5 1.5-1.5 5.5-1.5-5.5L5 10.5 10.5 9 12 3.5Z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
              <path
                d="m18.5 15 .6 2.1 2.1.6-2.1.6-.6 2.2-.6-2.2-2.1-.6 2.1-.6.6-2.1Z"
                fill="currentColor"
              />
            </svg>
          </button>
          <button
            type="button"
            className={`absolute right-[7.25rem] top-3 z-[130] flex h-11 w-11 items-center justify-center rounded-full shadow-[0_10px_30px_rgba(30,41,59,0.14)] transition-[background-color,color,transform] duration-200 hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:text-slate-300 disabled:shadow-none disabled:hover:scale-100 disabled:hover:bg-white ${
              isComparisonOpen
                ? "bg-indigo-600 text-white"
                : "bg-white text-indigo-700 hover:bg-indigo-50"
            }`}
            title={
              previousProfile
                ? "Comparar selecciones"
                : "Cambia un filtro para comparar"
            }
            aria-label={
              previousProfile
                ? "Comparar con la selección anterior"
                : "Cambia un filtro para habilitar la comparación"
            }
            aria-expanded={isComparisonOpen}
            aria-controls="profile-comparison"
            disabled={!previousProfile}
            onClick={() => {
              setIsLegendOpen(false);
              setIsInsightOpen(false);
              setIsComparisonOpen((isOpen) => !isOpen);
            }}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M8 7h11M16 4l3 3-3 3M16 17H5M8 14l-3 3 3 3"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          {isLegendOpen ? (
            <div
              id="visualization-legend"
              className="profile-detail-enter absolute right-3 top-16 z-[125] w-[min(19rem,calc(100%-1.5rem))]"
            >
              <VisualEncodingLegend />
            </div>
          ) : null}
          {isComparisonOpen && previousProfile ? (
            <div
              id="profile-comparison"
              className="profile-detail-enter absolute right-3 top-16 z-[125] w-[min(20rem,calc(100%-1.5rem))]"
            >
              <ProfileComparison
                current={profile}
                previous={previousProfile}
                previousRegionLabel={previousRegionLabel}
              />
            </div>
          ) : null}
          {isInsightOpen && profileInsight ? (
            <div
              id="profile-insight"
              key={`${profile.region}-${profile.ageGroup}-${profile.sex}`}
              className="insight-enter absolute right-3 top-16 z-[125]"
            >
              <ProfileInsight text={profileInsight} />
            </div>
          ) : null}
          {showFirstVisitHint ? (
            <p className="first-visit-hint absolute left-4 top-4 z-[110] max-w-[19rem] rounded-xl bg-white/95 px-4 py-3 text-sm font-medium leading-snug text-slate-700 shadow-[0_12px_36px_rgba(30,41,59,0.11)] sm:left-7">
              Cambia el perfil y observa cómo reaccionan la postura, las
              personas y el resplandor.
            </p>
          ) : null}
          <VisualizationScene
            ageGroup={profile.ageGroup}
            sex={profile.sex}
            loneliness={visualValues.loneliness}
            isolation={visualValues.isolation}
            wellbeing={visualValues.wellbeing}
            isSummaryVisible={isCentralHovered}
            onCentralHoverChange={(isVisible) => {
              if (isVisible) {
                setIsLegendOpen(false);
                setIsInsightOpen(false);
                setIsComparisonOpen(false);
              }
              setIsCentralHovered(isVisible);
            }}
          />
          {isCentralHovered ? (
            <div
              id="profile-detail"
              className="profile-detail-enter absolute left-4 top-[4.5rem] z-[120] sm:left-7"
            >
              <ProfileSummary
                profile={profile}
                regionLabel={regionLabel}
                visualValues={visualValues}
              />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
