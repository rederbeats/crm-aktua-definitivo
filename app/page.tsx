import Link from "next/link";
import { CrmApp } from "@/components/CrmApp";
import { requireAdmin } from "@/lib/auth";
import { getCrmData } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const user = await requireAdmin();
  const data = await getCrmData().catch((error) => ({
    error: error instanceof Error ? error.message : "Error desconocido"
  }));

  if ("error" in data) {
    return (
      <main className="grid min-h-screen place-items-center bg-brand-paper p-6 text-brand-ink">
        <section className="panel max-w-xl p-6">
          <p className="text-xs font-bold uppercase text-brand-red">Error cargando CRM</p>
          <h1 className="mt-2 text-2xl font-black">No se pudieron leer los datos</h1>
          <p className="mt-3 text-sm leading-6 text-neutral-700">{data.error}</p>
          <Link className="mt-5 inline-flex rounded bg-brand-black px-4 py-2 text-sm font-bold text-white" href="/health">
            Revisar health check
          </Link>
        </section>
      </main>
    );
  }

  return <CrmApp data={data} userEmail={user.email || ""} />;
}
