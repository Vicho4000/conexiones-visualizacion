import Image from "next/image";
import type { RegionOption } from "@/lib/types";

type RegionFilterProps = {
  value: string;
  options: RegionOption[];
  onChange: (value: string) => void;
};

const REGION_LAYER_IDS: Record<string, string> = {
  "Arica Y Parinacota": "map_chile_AricaParinacota",
  Tarapaca: "map_chile_Tarapaca",
  Antofagasta: "map_chile_Antofagasta",
  Atacama: "map_chile_Atacama",
  Coquimbo: "map_chile_Coquimbo",
  Valparaiso: "map_chile_Valparaiso",
  "Metropolitana De Santiago": "map_chile_Metropolitana",
  "Libertador General Bernardo O'higgins": "map_chile_OHiggins",
  Maule: "map_chile_Maule",
  Ñuble: "map_chile_Nuble",
  Biobio: "map_chile_Biobio",
  "La Araucania": "map_chile_Araucania",
  "Los Rios": "map_chile_Los_Rios",
  "Los Lagos": "map_chile_Los_Lagos",
  "Aysen Del General Carlos Ibañez Del Campo": "map_chile_Aysen",
  "Magallanes Y De La Antartica Chilena": "map_chile_Magallanes",
};

export function RegionFilter({ value, options, onChange }: RegionFilterProps) {
  const selectedLayer = REGION_LAYER_IDS[value];

  return (
    <div className="grid w-full min-w-0 max-w-full gap-2 overflow-hidden">
      <label
        htmlFor="profile-region"
        className="text-base font-semibold text-slate-800"
      >
        Región
      </label>
      <span className="relative block min-w-0 max-w-full">
        <select
          id="profile-region"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="block min-h-12 w-full min-w-0 max-w-full appearance-none truncate rounded-xl border border-indigo-200 bg-white py-3 pl-4 pr-10 text-base font-medium text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        >
          {options.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-indigo-600"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path d="m6 8 4 4 4-4" />
        </svg>
      </span>
      <div className="mt-1 flex h-32 items-center justify-center rounded-xl bg-white/70">
        <Image
          key={value}
          src={`/mapas/regiones-de-chile.svg${selectedLayer ? `#${selectedLayer}` : ""}`}
          alt={
            value === "all"
              ? "Mapa de todas las regiones de Chile"
              : `Mapa de Chile con ${options.find((option) => option.id === value)?.label ?? value} destacada`
          }
          width={1640}
          height={280}
          unoptimized
          className="h-auto w-32 max-w-none rotate-90"
        />
      </div>
    </div>
  );
}
