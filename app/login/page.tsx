import Image from "next/image";
import { signIn } from "@/app/actions";
import { ThemeToggle } from "@/components/ThemeToggle";

export default async function LoginPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string; code?: string; status?: string; detail?: string }>;
}) {
  const params = await searchParams;
  const messages: Record<string, string> = {
    unauthorized: "El login es correcto, pero este email no esta en ADMIN_EMAILS.",
    invalid_credentials: "Email o contrasena incorrectos, o el usuario no existe en Supabase Auth.",
    not_confirmed: "El usuario existe, pero el email no esta confirmado en Supabase Auth.",
    bad_anon_key: "La NEXT_PUBLIC_SUPABASE_ANON_KEY no parece valida para este proyecto.",
    auth: "Supabase ha rechazado el login. Abre /health y revisa el diagnostico de Auth.",
    invalid: "Email o contrasena incorrectos, o el usuario no existe en Supabase Auth."
  };
  const message = params.error ? messages[params.error] || messages.invalid : "";
  const detail = params.code || params.status ? `Codigo: ${params.code || "sin_codigo"}${params.status ? ` | HTTP ${params.status}` : ""}` : "";
  const authDetail = params.detail ? decodeURIComponent(params.detail) : "";

  return (
    <main className="grid min-h-screen place-items-center bg-brand-paper p-6">
      <section className="panel w-full max-w-sm p-6">
        <div className="mb-4 flex justify-end">
          <ThemeToggle />
        </div>
        <Image src="/aktua-home-logo-cropped.png" alt="Aktua Home" width={220} height={102} className="mx-auto h-auto w-48 rounded bg-white p-1" priority />
        <div className="mt-6">
          <p className="text-xs font-bold uppercase text-brand-red">Acceso privado</p>
          <h1 className="mt-1 text-2xl font-black">CRM Aktua Home</h1>
          <p className="mt-2 text-sm text-neutral-600">Login con Supabase Auth y lista de emails autorizados.</p>
        </div>
        {message ? (
          <div className="mt-4 rounded bg-red-50 px-3 py-2 text-sm font-bold text-brand-red">
            <p>{message}</p>
            {detail ? <p className="mt-1 text-xs font-semibold text-red-700">{detail}</p> : null}
            {authDetail ? <p className="mt-1 text-xs font-semibold text-red-700">{authDetail}</p> : null}
          </div>
        ) : null}
        <form action={signIn} className="mt-5 grid gap-3">
          <input name="email" type="email" required placeholder="Email" />
          <input name="password" type="password" required placeholder="Contrasena" />
          <button className="command-button justify-center bg-brand-red text-white" type="submit">
            Entrar
          </button>
        </form>
      </section>
    </main>
  );
}
