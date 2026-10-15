import { AGE_GROUPS, SEX_OPTIONS } from "@/lib/calculos-visualizacion/perfiles";
import type { AgeGroup, ProfileSex, RegionOption } from "@/lib/types";
import { RegionFilter } from "@/components/filtros/FiltroRegion";

type ControlsProps = {
  regions: RegionOption[];
  selectedRegion: string;
  selectedAgeGroup: AgeGroup;
  selectedGender: ProfileSex;
  onRegionChange: (region: string) => void;
  onAgeGroupChange: (ageGroup: AgeGroup) => void;
  onGenderChange: (gender: ProfileSex) => void;
};

function ProfileIcon({ sex }: { sex: ProfileSex }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 48 48" className="h-9 w-9">
      <circle cx="24" cy="15" r="8" fill="currentColor" opacity="0.88" />
      <path
        d={
          sex === "female"
            ? "M12 42c1-11 5-17 12-17s11 6 12 17H12Z"
            : "M11 42c1-10 5-16 13-16s12 6 13 16H11Z"
        }
        fill="currentColor"
      />
      <path
        d={
          sex === "female"
            ? "M15 15c0-8 4-12 9-12 6 0 10 4 10 12-3-1-6-4-8-8-2 5-6 8-11 8Z"
            : "M16 11c2-6 13-8 17 0-5-1-11-1-17 0Z"
        }
        fill="currentColor"
      />
    </svg>
  );
}

function AgeDial({
  selectedAgeGroup,
  onChange,
}: {
  selectedAgeGroup: AgeGroup;
  onChange: (ageGroup: AgeGroup) => void;
}) {
  const selectedIndex = AGE_GROUPS.indexOf(selectedAgeGroup);

  return (
    <fieldset className="mt-7 min-[1180px]:mt-5">
      <legend className="text-base font-bold text-slate-950">
        Rango etario
      </legend>
      <div className="mt-2">
        <output
          htmlFor="profile-age-slider"
          className="block text-sm font-semibold tabular-nums text-indigo-700"
        >
          {selectedAgeGroup} años
        </output>
        <input
          id="profile-age-slider"
          type="range"
          min={0}
          max={AGE_GROUPS.length - 1}
          step={1}
          value={selectedIndex}
          aria-valuetext={`${selectedAgeGroup} años`}
          onChange={(event) => {
            const ageGroup = AGE_GROUPS[Number(event.target.value)];
            if (ageGroup) onChange(ageGroup);
          }}
          className="age-slider mt-1 w-full cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        />
        <div className="grid grid-cols-5" aria-hidden="true">
          {AGE_GROUPS.map((ageGroup) => (
            <span
              key={ageGroup}
              className={`text-center text-[10px] tabular-nums first:text-left last:text-right min-[1400px]:text-[11px] ${
                ageGroup === selectedAgeGroup
                  ? "font-bold text-slate-950"
                  : "text-slate-500"
              }`}
            >
              {ageGroup}
            </span>
          ))}
        </div>
      </div>
    </fieldset>
  );
}

export function Controls({
  regions,
  selectedRegion,
  selectedAgeGroup,
  selectedGender,
  onRegionChange,
  onAgeGroupChange,
  onGenderChange,
}: ControlsProps) {
  return (
    <aside
      className="w-full min-w-0 rounded-2xl bg-slate-50 p-5 sm:p-6 min-[1180px]:sticky min-[1180px]:top-4 min-[1180px]:max-h-full min-[1180px]:p-4"
      aria-label="Seleccionar perfil"
    >
      <h2 className="text-2xl font-extrabold tracking-[-0.02em] text-slate-950 min-[1180px]:text-xl">
        Filtros de perfil
      </h2>
      <fieldset className="mt-5 min-[1180px]:mt-3">
        <legend className="mb-3 text-base font-bold text-slate-950">
          Género
        </legend>
        <div className="grid grid-cols-2 gap-3">
          {SEX_OPTIONS.map((option) => {
            const active = selectedGender === option.value;
            return (
              <button
                key={option.value}
                type="button"
                aria-label={`Filtrar por género: ${option.label}`}
                aria-pressed={active}
                onClick={() => onGenderChange(option.value)}
                className={`flex min-h-24 flex-col items-center justify-center gap-1 rounded-xl border text-sm font-bold transition-[background-color,border-color,color,transform,box-shadow] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 min-[1180px]:min-h-20 ${
                  active
                    ? "border-indigo-300 bg-indigo-50 text-indigo-700 shadow-[0_8px_24px_rgba(50,45,120,0.12)]"
                    : "border-transparent bg-white text-slate-500 hover:border-slate-200 hover:bg-slate-50 hover:text-slate-800"
                }`}
              >
                <ProfileIcon sex={option.value} />
                {option.label}
              </button>
            );
          })}
        </div>
      </fieldset>

      <AgeDial
        selectedAgeGroup={selectedAgeGroup}
        onChange={onAgeGroupChange}
      />

      <div className="mt-6 border-t border-slate-200 pt-6 min-[1180px]:mt-3 min-[1180px]:pt-3">
        <RegionFilter
          value={selectedRegion}
          options={regions}
          onChange={onRegionChange}
        />
      </div>
    </aside>
  );
}
