"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { createAdminClient, createClient } from "@/lib/supabase/server";

const allowedTables = ["crm_clients", "crm_owners", "crm_properties", "crm_activities", "crm_tasks"];
const propertyStatuses = ["Disponible", "Reservado", "Vendido", "Alquilado"];
const activityTypes = ["Llamada", "WhatsApp", "Email", "Visita", "Reunion"];
const taskPriorities = ["Baja", "Normal", "Alta"];

function value(formData: FormData, key: string) {
  const raw = formData.get(key);
  const text = typeof raw === "string" ? raw.trim() : "";
  return text || null;
}

function required(formData: FormData, key: string) {
  const text = value(formData, key);
  if (!text) throw new Error(`Falta el campo ${key}`);
  return text;
}

function enumValue(formData: FormData, key: string, allowed: string[]) {
  const text = required(formData, key);
  if (!allowed.includes(text)) throw new Error(`Valor no permitido para ${key}`);
  return text;
}

function numericValue(formData: FormData, key: string) {
  const text = value(formData, key);
  if (!text) return null;
  const number = Number(text);
  if (Number.isNaN(number) || number < 0) throw new Error(`Valor numerico no valido para ${key}`);
  return number;
}

function redirectWithAuthError(error: { code?: string; message: string; status?: number }) {
  const code = error.code || "unknown";
  const status = error.status ? String(error.status) : "";
  const message = error.message.toLowerCase();
  const params = new URLSearchParams();

  if (code === "email_not_confirmed" || message.includes("email not confirmed")) {
    params.set("error", "not_confirmed");
  } else if (
    code === "invalid_credentials" ||
    message.includes("invalid login credentials") ||
    message.includes("invalid credentials")
  ) {
    params.set("error", "invalid_credentials");
  } else if (message.includes("invalid api key") || message.includes("api key")) {
    params.set("error", "bad_anon_key");
  } else {
    params.set("error", "auth");
  }

  params.set("code", code);
  if (status) params.set("status", status);
  params.set("detail", error.message.slice(0, 140));

  console.error("Supabase login error", { code, status, message: error.message });
  redirect(`/login?${params.toString()}`);
}

export async function signIn(formData: FormData) {
  const email = required(formData, "email");
  const password = required(formData, "password");
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirectWithAuthError(error);
  }

  redirect("/");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function createClientRecord(formData: FormData) {
  await requireAdmin();
  const supabase = createAdminClient();

  await supabase
    .from("crm_clients")
    .insert({
      name: required(formData, "name"),
      phone: value(formData, "phone"),
      email: value(formData, "email"),
      interest: value(formData, "interest"),
      notes: value(formData, "notes")
    })
    .throwOnError();

  revalidatePath("/");
}

export async function createOwnerRecord(formData: FormData) {
  await requireAdmin();
  const supabase = createAdminClient();

  await supabase
    .from("crm_owners")
    .insert({
      name: required(formData, "name"),
      phone: value(formData, "phone"),
      email: value(formData, "email"),
      notes: value(formData, "notes")
    })
    .throwOnError();

  revalidatePath("/");
}

export async function createPropertyRecord(formData: FormData) {
  await requireAdmin();
  const supabase = createAdminClient();

  await supabase
    .from("crm_properties")
    .insert({
      title: required(formData, "title"),
      address: value(formData, "address"),
      price: numericValue(formData, "price"),
      status: enumValue(formData, "status", propertyStatuses),
      owner_id: value(formData, "owner_id"),
      details: value(formData, "details")
    })
    .throwOnError();

  revalidatePath("/");
}

export async function createActivityRecord(formData: FormData) {
  await requireAdmin();
  const supabase = createAdminClient();

  await supabase
    .from("crm_activities")
    .insert({
      client_id: value(formData, "client_id"),
      owner_id: value(formData, "owner_id"),
      property_id: value(formData, "property_id"),
      type: enumValue(formData, "type", activityTypes),
      activity_date: required(formData, "activity_date"),
      notes: required(formData, "notes")
    })
    .throwOnError();

  revalidatePath("/");
}

export async function createTaskRecord(formData: FormData) {
  await requireAdmin();
  const supabase = createAdminClient();

  await supabase
    .from("crm_tasks")
    .insert({
      title: required(formData, "title"),
      due_date: required(formData, "due_date"),
      priority: enumValue(formData, "priority", taskPriorities),
      client_id: value(formData, "client_id"),
      owner_id: value(formData, "owner_id"),
      property_id: value(formData, "property_id"),
      notes: value(formData, "notes")
    })
    .throwOnError();

  revalidatePath("/");
}

export async function toggleTask(formData: FormData) {
  await requireAdmin();
  const id = required(formData, "id");
  const done = required(formData, "done") === "true";
  const supabase = createAdminClient();

  await supabase.from("crm_tasks").update({ done }).eq("id", id).throwOnError();
  revalidatePath("/");
}

export async function deleteRecord(formData: FormData) {
  await requireAdmin();
  const table = required(formData, "table");
  const id = required(formData, "id");

  if (!allowedTables.includes(table)) {
    throw new Error("Tabla no permitida");
  }

  const supabase = createAdminClient();
  await supabase.from(table).delete().eq("id", id).throwOnError();
  revalidatePath("/");
}
