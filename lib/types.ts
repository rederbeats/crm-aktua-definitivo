export type Client = {
  id: string;
  created_at: string;
  name: string;
  phone: string | null;
  email: string | null;
  interest: string | null;
  notes: string | null;
};

export type Owner = {
  id: string;
  created_at: string;
  name: string;
  phone: string | null;
  email: string | null;
  notes: string | null;
};

export type PropertyStatus = "Disponible" | "Reservado" | "Vendido" | "Alquilado";

export type Property = {
  id: string;
  created_at: string;
  title: string;
  address: string | null;
  price: number | null;
  status: PropertyStatus;
  owner_id: string | null;
  details: string | null;
};

export type ActivityType = "Llamada" | "WhatsApp" | "Email" | "Visita" | "Reunion";

export type Activity = {
  id: string;
  created_at: string;
  client_id: string | null;
  owner_id: string | null;
  property_id: string | null;
  type: ActivityType;
  activity_date: string;
  notes: string;
};

export type TaskPriority = "Baja" | "Normal" | "Alta";

export type Task = {
  id: string;
  created_at: string;
  title: string;
  due_date: string;
  priority: TaskPriority;
  client_id: string | null;
  owner_id: string | null;
  property_id: string | null;
  notes: string | null;
  done: boolean;
};

export type CrmData = {
  clients: Client[];
  owners: Owner[];
  properties: Property[];
  activities: Activity[];
  tasks: Task[];
};
