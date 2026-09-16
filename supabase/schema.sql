-- Schema completo de la plataforma de lotes en venta.
-- Pensado para correr una sola vez sobre un proyecto Supabase nuevo, en este
-- orden (respeta las dependencias por foreign key). Ejecutado originalmente
-- a mano desde el SQL Editor de Supabase durante la Fase 0 del development-plan;
-- este archivo es la versión de referencia guardada en el repo.

-- ============================================================
-- 1. Catálogos de ubicación (Costa Rica)
-- ============================================================

create table provincias (
  id serial primary key,
  nombre text not null unique
);

create table cantones (
  id serial primary key,
  provincia_id integer not null references provincias(id),
  nombre text not null
);

create table distritos (
  id serial primary key,
  canton_id integer not null references cantones(id),
  nombre text not null
);

-- Poblado por separado con scripts/seed-ubicaciones.ts
-- (7 provincias, 82 cantones, 479 distritos)

-- ============================================================
-- 2. Lotes
-- ============================================================

create type tipo_lote as enum ('residencial', 'comercial', 'agricola');
create type estado_lote as enum ('disponible', 'reservado', 'vendido');

create table lotes (
  id uuid primary key default gen_random_uuid(),
  distrito_id integer not null references distritos(id),
  metros_cuadrados numeric(10,2) not null check (metros_cuadrados > 0),
  tipo tipo_lote not null,
  estado estado_lote not null default 'disponible',
  descripcion text,
  precio_referencia numeric(14,2), -- monto del lote; su exposición pública depende de mostrar_precio
  mostrar_precio boolean not null default false, -- si es true, precio_referencia se expone en la vista pública
  latitud double precision,
  longitud double precision,
  -- servicios: lista fija, columnas booleanas
  agua_potable boolean not null default false,
  electricidad boolean not null default false,
  alcantarillado boolean not null default false,
  internet boolean not null default false,
  calle_asfaltada boolean not null default false,
  alumbrado_publico boolean not null default false,
  telefono boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table lote_imagenes (
  id uuid primary key default gen_random_uuid(),
  lote_id uuid not null references lotes(id) on delete cascade,
  storage_path text not null,
  orden smallint not null default 0
);

create table consultas (
  id uuid primary key default gen_random_uuid(),
  lote_id uuid not null references lotes(id) on delete cascade,
  nombre text not null,
  contacto text not null, -- email o teléfono
  mensaje text not null,
  atendida boolean not null default false,
  created_at timestamptz not null default now()
);

create index idx_lotes_distrito on lotes(distrito_id);
create index idx_lotes_estado on lotes(estado);
create index idx_cantones_provincia on cantones(provincia_id);
create index idx_distritos_canton on distritos(canton_id);

-- ============================================================
-- 3. Administradores
-- ============================================================

-- Cuentas autorizadas a administrar el sitio (más de una persona puede administrar).
-- El id coincide con auth.users(id): un admin siempre es una cuenta real que
-- puede iniciar sesión, no un registro suelto.
create table admins (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  created_at timestamptz not null default now()
);

-- Función usada por las policies de RLS (tablas y storage) para chequear admin
-- sin duplicar la consulta a `admins` en cada policy, y sin problemas de RLS
-- recursivo (corre con los permisos del dueño de la función, no del caller).
create or replace function is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (select 1 from admins where id = auth.uid());
$$;

-- Cuentas iniciales (reemplazar por los UUID/email reales al reproducir el schema)
-- insert into admins (id, email) values
--   ('<uuid-cuenta-1>', '<email-cuenta-1>'),
--   ('<uuid-cuenta-2>', '<email-cuenta-2>');

-- ============================================================
-- 4. Vista pública de lotes
-- ============================================================

-- Único punto de lectura pública hacia los lotes. Enmascara el precio según
-- el toggle mostrar_precio. Corre con security_invoker = false (default de
-- Postgres): necesita leer `lotes` con permisos de dueño para funcionar para
-- usuarios anónimos, ya que `lotes` en sí queda cerrada solo a admins (ver RLS
-- más abajo). El enmascarado del precio lo hace el `case when` de esta vista,
-- no RLS — por eso es seguro que corra con permisos elevados.
create view lotes_publico as
select
  id, distrito_id, metros_cuadrados, tipo, estado, descripcion,
  case when mostrar_precio then precio_referencia else null end as precio,
  mostrar_precio, latitud, longitud, agua_potable, electricidad, alcantarillado,
  internet, calle_asfaltada, alumbrado_publico, telefono, created_at, updated_at
from lotes;

alter view lotes_publico set (security_invoker = false);

-- ============================================================
-- 5. Row Level Security
-- ============================================================

alter table provincias enable row level security;
alter table cantones enable row level security;
alter table distritos enable row level security;
alter table lotes enable row level security;
alter table lote_imagenes enable row level security;
alter table consultas enable row level security;
alter table admins enable row level security;

-- Catálogos de ubicación: lectura pública, escritura solo admin
create policy "lectura publica provincias"
on provincias for select using ( true );

create policy "escritura admin provincias"
on provincias for all
using ( is_admin() ) with check ( is_admin() );

create policy "lectura publica cantones"
on cantones for select using ( true );

create policy "escritura admin cantones"
on cantones for all
using ( is_admin() ) with check ( is_admin() );

create policy "lectura publica distritos"
on distritos for select using ( true );

create policy "escritura admin distritos"
on distritos for all
using ( is_admin() ) with check ( is_admin() );

-- lotes: SIN lectura pública directa. El público solo lee vía lotes_publico.
create policy "acceso admin lotes"
on lotes for all
using ( is_admin() ) with check ( is_admin() );

-- lote_imagenes: sí puede ser de lectura pública (no tiene datos sensibles)
create policy "lectura publica lote_imagenes"
on lote_imagenes for select using ( true );

create policy "escritura admin lote_imagenes"
on lote_imagenes for all
using ( is_admin() ) with check ( is_admin() );

-- consultas: cualquiera puede insertar (enviar el formulario), solo admin lee/gestiona
create policy "insertar consultas publico"
on consultas for insert
with check ( true );

create policy "gestionar consultas admin"
on consultas for all
using ( is_admin() ) with check ( is_admin() );

-- admins: sin policies -> nadie (ni siquiera un admin autenticado) puede leer o
-- escribir esta tabla vía la API pública. Se administra manualmente desde el
-- SQL Editor o el dashboard de Supabase. is_admin() puede leerla igual porque
-- corre como security definer (permisos del dueño, no del caller).

-- ============================================================
-- 6. Storage: bucket lotes-imagenes
-- ============================================================

-- El bucket en sí (público, solo lectura habilitada a nivel de bucket) se crea
-- desde el dashboard de Supabase, no por SQL. Estas policies controlan el
-- acceso real sobre storage.objects para ese bucket.

create policy "lectura publica lotes-imagenes"
on storage.objects for select
using ( bucket_id = 'lotes-imagenes' );

create policy "escritura admin lotes-imagenes"
on storage.objects for insert
with check ( bucket_id = 'lotes-imagenes' and is_admin() );

create policy "actualizar admin lotes-imagenes"
on storage.objects for update
using ( bucket_id = 'lotes-imagenes' and is_admin() )
with check ( bucket_id = 'lotes-imagenes' and is_admin() );

create policy "eliminar admin lotes-imagenes"
on storage.objects for delete
using ( bucket_id = 'lotes-imagenes' and is_admin() );