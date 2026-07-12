import { redirect } from "next/navigation";
import { createClient } from "./supabase/server";

export function getAdminEmails() {
  return (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export async function requireAdmin() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user?.email) {
    redirect("/login");
  }

  const allowedEmails = getAdminEmails();
  const email = data.user.email.toLowerCase();

  if (allowedEmails.length === 0 || !allowedEmails.includes(email)) {
    redirect("/login?error=unauthorized");
  }

  return data.user;
}
