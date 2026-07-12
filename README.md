# CRM Aktua Home - Vercel + Supabase

Aplicacion nueva desde cero para gestionar clientes, propietarios, inmuebles, actividades y tareas pendientes de Aktua Home.

## Incluye

- Login privado con Supabase Auth.
- Restriccion por `ADMIN_EMAILS`.
- Panel con totales de clientes, propietarios, inmuebles, actividades y tareas proximas.
- Avisos para tareas vencidas, de hoy o de los proximos 2 dias.
- CRUD de clientes, propietarios, inmuebles, actividades y tareas.
- Relaciones entre inmuebles, propietarios, clientes, actividades y tareas.
- Health check tecnico en `/health`.
- Diseno de herramienta interna con logo Aktua Home y colores negro, blanco y rojo.

## Variables

Copia `.env.example` a `.env.local` y completa:

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ADMIN_EMAILS=tu-email@dominio.com
```

`ADMIN_EMAILS` acepta varios emails separados por coma.

## Base de datos

Ejecuta la migracion:

```bash
supabase db push
```

Tambien puedes copiar el contenido de:

```text
supabase/migrations/20260712000100_aktua_crm_schema.sql
```

en el SQL Editor de Supabase.

Despues crea el usuario en Supabase Auth con email y contrasena, y anade ese email a `ADMIN_EMAILS`.

## Desarrollo

```bash
npm install
npm run dev
```

Abre `http://localhost:3000`.

## Despliegue en Vercel

1. Sube esta carpeta a GitHub.
2. Importa el proyecto en Vercel.
3. Configura las variables de entorno.
4. Despliega.
5. Abre `/health` en el dominio de Vercel para comprobar variables, conexion y tablas.
