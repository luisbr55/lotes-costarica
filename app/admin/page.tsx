import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { ListaLotes } from './_components/lista-lotes';

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: Promise<{ estado?: string; busqueda?: string }>;
}) {
  const { estado, busqueda } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from('lotes')
    .select('*, distritos!inner(nombre, cantones!inner(nombre, provincias(nombre)))')
    .order('created_at', { ascending: false });

  if (estado) {
    query = query.eq('estado', estado);
  }

  if (busqueda) {
    query = query.ilike('distritos.cantones.nombre', `%${busqueda}%`);
  }

  const { data: lotes, error } = await query;

  if (error) {
    return <p className="p-6 text-destructive">Error cargando lotes: {error.message}</p>;
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-text">Lotes</h1>
        <Link href="/admin/consultas" className="text-sm text-primary hover:underline">
          Ver consultas
        </Link>
      </div>

      <form className="flex flex-col sm:flex-row gap-2 mb-6">
        <input
          type="text"
          name="busqueda"
          placeholder="Buscar por cantón..."
          defaultValue={busqueda ?? ''}
          className="border border-surface-alt rounded-md px-3 py-2 text-sm flex-1"
        />
        <select
          name="estado"
          defaultValue={estado ?? ''}
          className="border border-surface-alt rounded-md px-3 py-2 text-sm"
        >
          <option value="">Todos</option>
          <option value="disponible">Disponible</option>
          <option value="reservado">Reservado</option>
          <option value="vendido">Vendido</option>
        </select>
        <button
          type="submit"
          className="bg-primary text-background rounded-md px-4 py-2 text-sm hover:bg-primary-hover"
        >
          Filtrar
        </button>
      </form>

      <Link
        href="/admin/lotes/nuevo"
        className="inline-block bg-accent text-background rounded-md px-4 py-2 text-sm font-medium hover:opacity-90 mb-6"
      >
        Agregar lote
      </Link>

      <ListaLotes lotesIniciales={lotes} />
    </div>
  );
}