import Image from "next/image";
import { signIn } from "@/app/actions";

export default async function LoginPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const message =
    params.error === "unauthorized"
      ? "Este email no esta autorizado en ADMIN_EMAILS."
      : params.error
        ? "No se ha podido iniciar sesion."
        : "";

  return (
    <main className="grid min-h-screen place-items-center bg-brand-paper p-6">
      <section className="panel w-full max-w-sm p-6">
        <Image src="/aktua-home-logo.png" alt="Aktua Home" width={220} height={220} className="mx-auto h-auto w-44" priority />
        <div className="mt-6">
          <p className="text-xs font-bold uppercase text-brand-red">Acceso privado</p>
          <h1 className="mt-1 text-2xl font-black">CRM Aktua Home</h1>
          <p className="mt-2 text-sm text-neutral-600">Login con Supabase Auth y lista de emails autorizados.</p>
        </div>
        {message ? <p className="mt-4 rounded bg-red-50 px-3 py-2 text-sm font-bold text-brand-red">{message}</p> : null}
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
