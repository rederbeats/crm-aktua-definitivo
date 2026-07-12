import "server-only";

import { createAdminClient } from "./supabase/server";
import type { Activity, Client, CrmData, Owner, Property, Task } from "./types";

export async function getCrmData(): Promise<CrmData> {
  const supabase = createAdminClient();

  const [clients, owners, properties, activities, tasks] = await Promise.all([
    supabase.from("crm_clients").select("*").order("created_at", { ascending: false }),
    supabase.from("crm_owners").select("*").order("created_at", { ascending: false }),
    supabase.from("crm_properties").select("*").order("created_at", { ascending: false }),
    supabase.from("crm_activities").select("*").order("activity_date", { ascending: false }),
    supabase.from("crm_tasks").select("*").order("done", { ascending: true }).order("due_date", { ascending: true })
  ]);

  const error = clients.error || owners.error || properties.error || activities.error || tasks.error;
  if (error) throw new Error(error.message);

  return {
    clients: (clients.data || []) as Client[],
    owners: (owners.data || []) as Owner[],
    properties: (properties.data || []) as Property[],
    activities: (activities.data || []) as Activity[],
    tasks: (tasks.data || []) as Task[]
  };
}
