import { createClient } from '@/lib/supabase/server';

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
    return <p>Error cargando lotes: {error.message}</p>;
  }

  return (
    <div>
      <h1>Lotes</h1>

      <form>
        <input
          type="text"
          name="busqueda"
          placeholder="Buscar por cantón..."
          defaultValue={busqueda ?? ''}
        />
        <select name="estado" defaultValue={estado ?? ''}>
          <option value="">Todos</option>
          <option value="disponible">Disponible</option>
          <option value="reservado">Reservado</option>
          <option value="vendido">Vendido</option>
        </select>
        <button type="submit">Filtrar</button>
      </form>

      <ul>
        {lotes.map((lote) => (
          <li key={lote.id}>
            {lote.distritos.nombre}, {lote.distritos.cantones.nombre},{' '}
            {lote.distritos.cantones.provincias.nombre} — {lote.metros_cuadrados} m² —{' '}
            {lote.tipo} — {lote.estado}
          </li>
        ))}
      </ul>
    </div>
  );
}