import { listPengajuan } from "@/actions/pengajuan";
import PengajuanTable from "@/components/pengajuan-table";

export const dynamic = "force-dynamic";

export default async function Home() {
  const data = await listPengajuan();

  return (
    <main className="flex min-h-screen flex-col items-center px-4 py-10">
      <div className="w-full max-w-6xl">
        <PengajuanTable pengajuan={data} />
      </div>
    </main>
  );
}