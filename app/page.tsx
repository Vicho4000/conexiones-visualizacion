import profilesData from "@/data/processed/ebs-profiles.json";
import { Brand } from "@/components/interfaz/Marca";
import { Visualization } from "@/components/visualizacion/Visualizacion";
import type { ProfilesFile } from "@/lib/types";

export default function Home() {
  const data = profilesData as ProfilesFile;

  return (
    <main className="mx-auto min-h-screen w-full max-w-[1480px] px-4 py-6 sm:px-8 min-[1180px]:h-dvh min-[1180px]:min-h-[720px] min-[1180px]:overflow-hidden min-[1180px]:px-8 min-[1180px]:py-4 min-[1400px]:px-10">
      <header className="mb-6 min-[1180px]:mb-3">
        <Brand />
      </header>

      <Visualization profiles={data.profiles} metadata={data._meta} />
    </main>
  );
}
