# Lotes Costa Rica

Sitio web para publicar y buscar lotes de terreno en venta, con un panel de
administración privado para gestionarlos.

- Sitio público: búsqueda de lotes por provincia/cantón/distrito y tipo, con
  detalle de cada lote (fotos, metros, servicios disponibles, ubicación en
  mapa, precio bajo consulta o visible según el lote).
- Panel admin: cuentas autorizadas (tabla `admins`) pueden crear, editar y
  eliminar lotes, y revisar las consultas recibidas desde el sitio.

## Stack

- [Next.js](https://nextjs.org) (App Router, TypeScript)
- [Supabase](https://supabase.com) — base de datos (Postgres), autenticación
  y almacenamiento de imágenes
- [Tailwind CSS](https://tailwindcss.com)
- Google Maps JavaScript API (ubicación de lotes)

## Documentación del proyecto

Antes de tocar código, revisar:

- [`sdd/mvp-lotes/functional-spec.md`](./sdd/mvp-lotes/functional-spec.md) — qué hace cada pantalla
- [`sdd/mvp-lotes/technical-spec.md`](./sdd/mvp-lotes/technical-spec.md) — modelo de datos, RLS, arquitectura
- [`sdd/mvp-lotes/development-plan.md`](./sdd/mvp-lotes/development-plan.md) — fases de implementación
- [`sdd/design-system.md`](./sdd/design-system.md) — paleta de color, tipografía, estilo visual
- [`supabase/schema.sql`](./supabase/schema.sql) — SQL completo (tablas, RLS, funciones, policies)

## Levantar el proyecto en local

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

Crear un archivo `.env.local` en la raíz del proyecto con:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
```

Los valores de Supabase salen de **Project Settings → Data API** (URL) y
**API Keys** (Publishable key / Secret key) del proyecto en Supabase.

### 3. Base de datos

Correr `supabase/schema.sql` en el SQL Editor de un proyecto Supabase nuevo
para crear todas las tablas, policies y funciones. Poblar los catálogos de
ubicación con:

```bash
npx tsx --env-file=.env.local scripts/seed-ubicaciones.ts
```

Después, crear las cuentas admin en **Authentication → Users** y agregarlas
a la tabla `admins` (ver `supabase/schema.sql` para el ejemplo de `insert`).

### 4. Correr el servidor de desarrollo

```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000).

## Estado del proyecto

Actualmente en desarrollo.
