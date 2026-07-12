import Image from "next/image";
import {
  Activity,
  Building2,
  CalendarClock,
  Home,
  Phone,
  UserRound,
  UsersRound
} from "lucide-react";
import { SubmitButton } from "@/components/SubmitButton";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  createActivityRecord,
  createClientRecord,
  createOwnerRecord,
  createPropertyRecord,
  createTaskRecord,
  deleteRecord,
  signOut,
  toggleTask
} from "@/app/actions";
import { clientLabel, displayDate, inputDate, money, ownerLabel, propertyLabel } from "@/lib/format";
import type { Activity as ActivityRecord, Client, CrmData, Owner, Property, Task } from "@/lib/types";

function findById<T extends { id: string }>(records: T[], id: string | null) {
  return id ? records.find((record) => record.id === id) || null : null;
}

function dueWindowTasks(tasks: Task[]) {
  const limit = new Date();
  limit.setDate(limit.getDate() + 2);
  const limitDate = inputDate(limit);

  return tasks
    .filter((task) => !task.done && task.due_date <= limitDate)
    .sort((a, b) => a.due_date.localeCompare(b.due_date));
}

function dueLabel(task: Task) {
  const today = inputDate();
  if (task.done) return "Hecha";
  if (task.due_date < today) return "Vencida";
  if (task.due_date === today) return "Hoy";
  return "Prox. 2 dias";
}

function dueClass(task: Task) {
  const today = inputDate();
  if (task.done) return "bg-emerald-50 text-emerald-700";
  if (task.due_date <= today) return "bg-red-50 text-brand-red";
  return "bg-amber-50 text-amber-700";
}

function priorityClass(priority: string) {
  if (priority === "Alta") return "bg-red-50 text-brand-red";
  if (priority === "Baja") return "bg-neutral-100 text-neutral-600";
  return "bg-brand-black text-white";
}

function DeleteButton({ table, id }: { table: string; id: string }) {
  return (
    <form action={deleteRecord}>
      <input type="hidden" name="table" value={table} />
      <input type="hidden" name="id" value={id} />
      <SubmitButton label="Eliminar" pendingLabel="Eliminando..." icon="trash" variant="danger" title="Eliminar" />
    </form>
  );
}

export function CrmApp({ data, userEmail }: { data: CrmData; userEmail: string }) {
  const dueTasks = dueWindowTasks(data.tasks);
  const openTasks = data.tasks.filter((task) => !task.done);
  const latestActivities = data.activities.slice(0, 6);

  return (
    <main className="min-h-screen bg-brand-paper text-brand-ink">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-neutral-800 bg-brand-black p-5 text-white lg:block">
        <Image src="/aktua-home-logo.png" alt="Aktua Home" width={190} height={190} className="rounded bg-white p-3" priority />
        <p className="mt-5 text-xs font-bold uppercase tracking-wide text-neutral-400">CRM privado</p>
        <nav className="mt-4 grid gap-1 text-sm font-bold">
          <NavLink href="#panel" icon={<Home size={17} />} label="Panel" />
          <NavLink href="#clientes" icon={<UsersRound size={17} />} label="Clientes" />
          <NavLink href="#propietarios" icon={<UserRound size={17} />} label="Propietarios" />
          <NavLink href="#inmuebles" icon={<Building2 size={17} />} label="Inmuebles" />
          <NavLink href="#actividades" icon={<Phone size={17} />} label="Actividades" />
          <NavLink href="#tareas" icon={<CalendarClock size={17} />} label="Tareas" />
        </nav>
      </aside>

      <section className="lg:pl-64">
        <header className="sticky top-0 z-10 border-b border-brand-line bg-brand-paper/95 px-4 py-4 backdrop-blur md:px-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase text-brand-red">Aktua Home</p>
              <h1 className="text-2xl font-black">CRM comercial</h1>
              <p className="text-sm text-neutral-600">{userEmail}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <ThemeToggle />
              <form action={signOut}>
                <SubmitButton label="Salir" pendingLabel="Saliendo..." icon="logout" variant="dark" />
              </form>
            </div>
          </div>
        </header>

        <div className="grid gap-8 p-4 md:p-6">
          <section id="panel" className="grid gap-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
              <Stat icon={<UsersRound size={19} />} label="Clientes" value={data.clients.length} />
              <Stat icon={<UserRound size={19} />} label="Propietarios" value={data.owners.length} />
              <Stat icon={<Building2 size={19} />} label="Inmuebles" value={data.properties.length} />
              <Stat icon={<Activity size={19} />} label="Actividades" value={data.activities.length} />
              <Stat icon={<CalendarClock size={19} />} label="Tareas proximas" value={dueTasks.length} alert />
            </div>

            <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
              <Panel title="Avisos pendientes" subtitle={`${openTasks.length} tareas abiertas`}>
                {dueTasks.length ? dueTasks.map((task) => <TaskItem key={task.id} task={task} data={data} />) : <Empty title="Sin avisos cercanos" body="Las tareas vencidas, de hoy o de los proximos 2 dias apareceran aqui." />}
              </Panel>
              <Panel title="Ultima actividad" subtitle="Historial comercial reciente">
                {latestActivities.length ? latestActivities.map((activity) => <ActivityItem key={activity.id} activity={activity} data={data} />) : <Empty title="Sin actividad reciente" body="Registra llamadas, emails, visitas o reuniones para crear historial." />}
              </Panel>
            </div>
          </section>

          <Module id="clientes" title="Clientes" formTitle="Nuevo cliente">
            <form action={createClientRecord} className="form-grid">
              <input name="name" required placeholder="Nombre completo" />
              <input name="phone" placeholder="Telefono" />
              <input name="email" type="email" placeholder="Email" />
              <select name="interest" defaultValue="Compra">
                <option>Compra</option>
                <option>Venta</option>
                <option>Alquiler</option>
                <option>Inversion</option>
              </select>
              <textarea name="notes" placeholder="Notas, presupuesto, zona, situacion..." />
              <PrimaryButton label="Guardar cliente" />
            </form>
            {data.clients.length ? data.clients.map((client) => <ClientCard key={client.id} client={client} />) : <Empty title="Sin clientes" body="Crea el primer contacto comercial." />}
          </Module>

          <Module id="propietarios" title="Propietarios" formTitle="Nuevo propietario">
            <form action={createOwnerRecord} className="form-grid">
              <input name="name" required placeholder="Nombre completo" />
              <input name="phone" placeholder="Telefono" />
              <input name="email" type="email" placeholder="Email" />
              <textarea name="notes" placeholder="Llaves, condiciones, disponibilidad, honorarios..." />
              <PrimaryButton label="Guardar propietario" />
            </form>
            {data.owners.length ? data.owners.map((owner) => <OwnerCard key={owner.id} owner={owner} propertyCount={data.properties.filter((property) => property.owner_id === owner.id).length} />) : <Empty title="Sin propietarios" body="Registra propietarios para asignar inmuebles." />}
          </Module>

          <Module id="inmuebles" title="Inmuebles" formTitle="Nuevo inmueble">
            <form action={createPropertyRecord} className="form-grid">
              <input name="title" required placeholder="Titulo o referencia" />
              <input name="address" placeholder="Direccion o zona" />
              <div className="grid gap-3 sm:grid-cols-2">
                <input name="price" type="number" min="0" step="1000" placeholder="Precio" />
                <select name="status" defaultValue="Disponible">
                  <option>Disponible</option>
                  <option>Reservado</option>
                  <option>Vendido</option>
                  <option>Alquilado</option>
                </select>
              </div>
              <select name="owner_id" defaultValue="">
                <option value="">Sin propietario asignado</option>
                {data.owners.map((owner) => <option key={owner.id} value={owner.id}>{ownerLabel(owner)}</option>)}
              </select>
              <textarea name="details" placeholder="Metros, habitaciones, estado, claves..." />
              <PrimaryButton label="Guardar inmueble" />
            </form>
            {data.properties.length ? data.properties.map((property) => <PropertyCard key={property.id} property={property} owner={findById(data.owners, property.owner_id)} />) : <Empty title="Sin inmuebles" body="Anade inmuebles y asigna su propietario." />}
          </Module>

          <Module id="actividades" title="Actividades" formTitle="Nueva actividad">
            <form action={createActivityRecord} className="form-grid">
              <RelationSelect name="client_id" label="Sin cliente asociado" records={data.clients} formatter={clientLabel} />
              <RelationSelect name="owner_id" label="Sin propietario asociado" records={data.owners} formatter={ownerLabel} />
              <RelationSelect name="property_id" label="Sin inmueble asociado" records={data.properties} formatter={propertyLabel} />
              <div className="grid gap-3 sm:grid-cols-2">
                <select name="type" defaultValue="Llamada">
                  <option>Llamada</option>
                  <option>WhatsApp</option>
                  <option>Email</option>
                  <option>Visita</option>
                  <option>Reunion</option>
                </select>
                <input name="activity_date" type="date" required defaultValue={inputDate()} />
              </div>
              <textarea name="notes" required placeholder="Resumen, proximos pasos, objeciones..." />
              <PrimaryButton label="Guardar actividad" />
            </form>
            {data.activities.length ? data.activities.map((activity) => <ActivityItem key={activity.id} activity={activity} data={data} />) : <Empty title="Sin historial" body="Cada interaccion quedara ordenada aqui." />}
          </Module>

          <Module id="tareas" title="Tareas pendientes" formTitle="Nueva tarea">
            <form action={createTaskRecord} className="form-grid">
              <input name="title" required placeholder="Ej. Llamar a Manuel" />
              <div className="grid gap-3 sm:grid-cols-2">
                <input name="due_date" type="date" required defaultValue={inputDate()} />
                <select name="priority" defaultValue="Normal">
                  <option>Baja</option>
                  <option>Normal</option>
                  <option>Alta</option>
                </select>
              </div>
              <RelationSelect name="client_id" label="Sin cliente asociado" records={data.clients} formatter={clientLabel} />
              <RelationSelect name="owner_id" label="Sin propietario asociado" records={data.owners} formatter={ownerLabel} />
              <RelationSelect name="property_id" label="Sin inmueble asociado" records={data.properties} formatter={propertyLabel} />
              <textarea name="notes" placeholder="Detalle de la tarea pendiente..." />
              <PrimaryButton label="Guardar tarea" />
            </form>
            {data.tasks.length ? data.tasks.map((task) => <TaskItem key={task.id} task={task} data={data} />) : <Empty title="Sin tareas" body="Crea pendientes y controla vencimientos." />}
          </Module>
        </div>
      </section>
    </main>
  );
}

function NavLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return <a className="flex items-center gap-3 rounded px-3 py-2 text-neutral-200 hover:bg-brand-red hover:text-white" href={href}>{icon}{label}</a>;
}

function Stat({ icon, label, value, alert }: { icon: React.ReactNode; label: string; value: number; alert?: boolean }) {
  return (
    <article className="panel p-4">
      <div className="flex items-center justify-between text-neutral-500">
        <span className="text-sm font-bold">{label}</span>
        <span className={alert ? "text-brand-red" : ""}>{icon}</span>
      </div>
      <strong className={alert ? "mt-2 block text-3xl text-brand-red" : "mt-2 block text-3xl"}>{value}</strong>
    </article>
  );
}

function Panel({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section className="panel p-4">
      <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
        <h2 className="text-lg font-black">{title}</h2>
        {subtitle ? <p className="text-sm text-neutral-500">{subtitle}</p> : null}
      </div>
      <div className="grid gap-3">{children}</div>
    </section>
  );
}

function Module({ id, title, formTitle, children }: { id: string; title: string; formTitle: string; children: React.ReactNode[] }) {
  const [form, list] = children;
  return (
    <section id={id} className="grid gap-4 xl:grid-cols-[380px_1fr]">
      <section className="panel p-4 xl:sticky xl:top-24 xl:self-start">
        <h2 className="mb-3 text-lg font-black">{formTitle}</h2>
        {form}
      </section>
      <Panel title={title}>{list}</Panel>
    </section>
  );
}

function PrimaryButton({ label }: { label: string }) {
  return <SubmitButton label={label} icon="plus" />;
}

function RelationSelect<T extends { id: string }>({ name, label, records, formatter }: { name: string; label: string; records: T[]; formatter: (record: T) => string }) {
  return (
    <select name={name} defaultValue="">
      <option value="">{label}</option>
      {records.map((record) => <option key={record.id} value={record.id}>{formatter(record)}</option>)}
    </select>
  );
}

function Meta({ items }: { items: Array<string | number | null | undefined> }) {
  const clean = items.filter((item) => item !== null && item !== undefined && String(item).trim() !== "");
  return <div className="mt-2 flex flex-wrap gap-2 text-sm text-neutral-600">{clean.map((item) => <span key={String(item)} className="tag">{item}</span>)}</div>;
}

function Empty({ title, body }: { title: string; body: string }) {
  return <div className="rounded border border-dashed border-neutral-300 bg-neutral-50 p-6 text-center"><strong className="block">{title}</strong><span className="text-sm text-neutral-600">{body}</span></div>;
}

function ClientCard({ client }: { client: Client }) {
  return <RecordCard title={client.name} table="crm_clients" id={client.id} meta={[client.interest, client.phone, client.email]} notes={client.notes} />;
}

function OwnerCard({ owner, propertyCount }: { owner: Owner; propertyCount: number }) {
  return <RecordCard title={owner.name} table="crm_owners" id={owner.id} meta={[owner.phone, owner.email, `${propertyCount} inmuebles`]} notes={owner.notes} />;
}

function PropertyCard({ property, owner }: { property: Property; owner: Owner | null }) {
  return <RecordCard title={property.title} table="crm_properties" id={property.id} meta={[property.status, money(property.price), property.address, owner?.name]} notes={property.details} />;
}

function RecordCard({ title, table, id, meta, notes }: { title: string; table: string; id: string; meta: Array<string | number | null | undefined>; notes?: string | null }) {
  return (
    <article className="record">
      <div className="flex flex-wrap justify-between gap-3">
        <div>
          <h3 className="font-bold">{title}</h3>
          <Meta items={meta} />
        </div>
        <DeleteButton table={table} id={id} />
      </div>
      {notes ? <p className="mt-3 text-sm leading-6 text-neutral-600">{notes}</p> : null}
    </article>
  );
}

function ActivityItem({ activity, data }: { activity: ActivityRecord; data: CrmData }) {
  const client = findById(data.clients, activity.client_id);
  const owner = findById(data.owners, activity.owner_id);
  const property = findById(data.properties, activity.property_id);
  const contact = [client?.name, owner?.name].filter(Boolean).join(" / ") || "Sin contacto";

  return (
    <article className="record">
      <div className="flex flex-wrap justify-between gap-3">
        <div>
          <h3 className="font-bold">{activity.type} con {contact}</h3>
          <Meta items={[displayDate(activity.activity_date), property ? propertyLabel(property) : null]} />
        </div>
        <DeleteButton table="crm_activities" id={activity.id} />
      </div>
      <p className="mt-3 text-sm leading-6 text-neutral-600">{activity.notes}</p>
    </article>
  );
}

function TaskItem({ task, data }: { task: Task; data: CrmData }) {
  const client = findById(data.clients, task.client_id);
  const owner = findById(data.owners, task.owner_id);
  const property = findById(data.properties, task.property_id);

  return (
    <article className="record">
      <div className="flex flex-wrap justify-between gap-3">
        <div>
          <h3 className={task.done ? "font-bold text-neutral-500 line-through" : "font-bold"}>{task.title}</h3>
          <Meta items={[displayDate(task.due_date), client?.name, owner?.name, property ? propertyLabel(property) : null]} />
        </div>
        <div className="flex gap-2">
          <form action={toggleTask}>
            <input type="hidden" name="id" value={task.id} />
            <input type="hidden" name="done" value={String(!task.done)} />
            <SubmitButton
              label={task.done ? "Reabrir" : "Marcar hecha"}
              pendingLabel="Actualizando..."
              icon="check"
              variant="ghost"
              title={task.done ? "Reabrir" : "Marcar hecha"}
            />
          </form>
          <DeleteButton table="crm_tasks" id={task.id} />
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <span className={`tag font-bold ${dueClass(task)}`}>{dueLabel(task)}</span>
        <span className={`tag font-bold ${priorityClass(task.priority)}`}>{task.priority}</span>
      </div>
      {task.notes ? <p className="mt-3 text-sm leading-6 text-neutral-600">{task.notes}</p> : null}
    </article>
  );
}
