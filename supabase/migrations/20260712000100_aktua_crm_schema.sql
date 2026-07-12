create extension if not exists "pgcrypto";

create table if not exists crm_clients (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  phone text,
  email text,
  interest text,
  notes text
);

create table if not exists crm_owners (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  phone text,
  email text,
  notes text
);

create table if not exists crm_properties (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  title text not null,
  address text,
  price numeric,
  status text not null default 'Disponible',
  owner_id uuid references crm_owners(id) on delete set null,
  details text,
  constraint crm_properties_status_check check (status in ('Disponible', 'Reservado', 'Vendido', 'Alquilado'))
);

create table if not exists crm_activities (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  client_id uuid references crm_clients(id) on delete set null,
  owner_id uuid references crm_owners(id) on delete set null,
  property_id uuid references crm_properties(id) on delete set null,
  type text not null,
  activity_date date not null default current_date,
  notes text not null,
  constraint crm_activities_type_check check (type in ('Llamada', 'WhatsApp', 'Email', 'Visita', 'Reunion'))
);

create table if not exists crm_tasks (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  title text not null,
  due_date date not null,
  priority text not null default 'Normal',
  client_id uuid references crm_clients(id) on delete set null,
  owner_id uuid references crm_owners(id) on delete set null,
  property_id uuid references crm_properties(id) on delete set null,
  notes text,
  done boolean not null default false,
  constraint crm_tasks_priority_check check (priority in ('Baja', 'Normal', 'Alta'))
);

create index if not exists crm_properties_owner_id_idx on crm_properties(owner_id);
create index if not exists crm_activities_client_id_idx on crm_activities(client_id);
create index if not exists crm_activities_owner_id_idx on crm_activities(owner_id);
create index if not exists crm_activities_property_id_idx on crm_activities(property_id);
create index if not exists crm_tasks_client_id_idx on crm_tasks(client_id);
create index if not exists crm_tasks_owner_id_idx on crm_tasks(owner_id);
create index if not exists crm_tasks_property_id_idx on crm_tasks(property_id);
create index if not exists crm_tasks_due_date_idx on crm_tasks(due_date);
create index if not exists crm_tasks_done_idx on crm_tasks(done);

alter table crm_clients enable row level security;
alter table crm_owners enable row level security;
alter table crm_properties enable row level security;
alter table crm_activities enable row level security;
alter table crm_tasks enable row level security;

-- The Next.js app uses Supabase Auth for login and a server-only service role key
-- for CRM operations. Never expose SUPABASE_SERVICE_ROLE_KEY in client code.
