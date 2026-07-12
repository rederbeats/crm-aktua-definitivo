import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

type Check = {
  name: string;
  ok: boolean;
  detail: string;
};

const requiredEnv = [
  "NEXT_PUBLIC_SITE_URL",
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "ADMIN_EMAILS"
];

function envCheck(name: string): Check {
  const value = process.env[name];
  return {
    name,
    ok: Boolean(value?.trim()),
    detail: value?.trim() ? "Configurada" : "Falta o esta vacia"
  };
}

function jwtRoleCheck(name: string, expectedRole: string): Check {
  const value = process.env[name]?.trim();

  if (!value) {
    return { name: `${name} role`, ok: false, detail: "Falta la clave" };
  }

  try {
    const [, payload] = value.split(".");
    if (!payload) throw new Error("La clave no tiene formato JWT");
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = JSON.parse(Buffer.from(normalized, "base64").toString("utf8")) as { role?: string; ref?: string };
    const role = decoded.role || "sin role";

    return {
      name: `${name} role`,
      ok: role === expectedRole,
      detail: role === expectedRole ? `OK, role ${role}` : `Role recibido: ${role}. Esperado: ${expectedRole}`
    };
  } catch (error) {
    return {
      name: `${name} role`,
      ok: false,
      detail: error instanceof Error ? error.message : "No se pudo leer la clave"
    };
  }
}

async function tableChecks(): Promise<Check[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    return [{ name: "Conexion Supabase", ok: false, detail: "Faltan URL o service role key" }];
  }

  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false }
  });
  const tables = ["crm_clients", "crm_owners", "crm_properties", "crm_activities", "crm_tasks"];

  return Promise.all(
    tables.map(async (table) => {
      const { error, count } = await supabase.from(table).select("id", { count: "exact", head: true });
      return {
        name: `Tabla ${table}`,
        ok: !error,
        detail: error ? error.message : `OK, ${count ?? 0} registros`
      };
    })
  );
}

async function authEndpointCheck(): Promise<Check> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return {
      name: "Supabase Auth endpoint",
      ok: false,
      detail: "Faltan NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY"
    };
  }

  try {
    const response = await fetch(`${url}/auth/v1/settings`, {
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`
      },
      cache: "no-store"
    });

    return {
      name: "Supabase Auth endpoint",
      ok: response.ok,
      detail: response.ok ? "OK, Auth responde" : `HTTP ${response.status} ${response.statusText}`
    };
  } catch (error) {
    return {
      name: "Supabase Auth endpoint",
      ok: false,
      detail: error instanceof Error ? error.message : "No se pudo consultar Auth"
    };
  }
}

export default async function HealthPage() {
  const checks = [
    ...requiredEnv.map(envCheck),
    jwtRoleCheck("NEXT_PUBLIC_SUPABASE_ANON_KEY", "anon"),
    jwtRoleCheck("SUPABASE_SERVICE_ROLE_KEY", "service_role"),
    await authEndpointCheck(),
    ...(await tableChecks())
  ];

  return (
    <main className="min-h-screen bg-brand-paper p-6 text-brand-ink">
      <section className="panel mx-auto max-w-3xl p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase text-brand-red">Diagnostico tecnico</p>
            <h1 className="mt-1 text-2xl font-black">Health check CRM</h1>
            <p className="mt-2 text-sm text-neutral-600">Comprueba variables, conexion con Supabase y tablas principales.</p>
          </div>
          <Link className="rounded bg-brand-black px-4 py-2 text-sm font-bold text-white" href="/">
            Volver
          </Link>
        </div>
        <div className="mt-6 grid gap-3">
          {checks.map((check) => (
            <article key={check.name} className="rounded border border-brand-line bg-white p-4">
              <div className="flex items-center justify-between gap-4">
                <strong>{check.name}</strong>
                <span className={check.ok ? "rounded-full bg-emerald-50 px-3 py-1 text-sm font-bold text-emerald-700" : "rounded-full bg-red-50 px-3 py-1 text-sm font-bold text-brand-red"}>
                  {check.ok ? "OK" : "Error"}
                </span>
              </div>
              <p className="mt-2 text-sm text-neutral-600">{check.detail}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
