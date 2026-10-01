import { createClient } from '@/lib/supabase/server';
import { FiltroUbicacion } from './_components/filtro-ubicacion';

const ESTADO_ESTILOS: Record<string, string> = {
  disponible: 'bg-success/15 text-success',
  reservado: 'bg-warning/15 text-warning',
  vendido: 'bg-destructive/15 text-destructive',
};

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{
    provincia_id?: string;
    canton_id?: string;
    distrito_id?: string;
    tipo?: string;
    mostrar_todos?: string;
  }>;
}) {
  const { provincia_id, canton_id, distrito_id, tipo, mostrar_todos } = await searchParams;

  const supabase = await createClient();

  const [{ data: provincias }, { data: cantones }, { data: distritos }] = await Promise.all([
    supabase.from('provincias').select('*').order('nombre'),
    supabase.from('cantones').select('*').order('nombre'),
    supabase.from('distritos').select('*').order('nombre'),
  ]);

  let query = supabase
    .from('lotes_publico')
    .select('*, distritos(nombre, cantones(nombre, provincias(nombre)))');

  if (!mostrar_todos) {
    query = query.eq('estado', 'disponible');
  }

  if (distrito_id) {
    query = query.eq('distrito_id', Number(distrito_id));
  } else if (canton_id) {
    const distritosIds = (distritos ?? [])
      .filter((d) => d.canton_id === Number(canton_id))
      .map((d) => d.id);
    query = query.in('distrito_id', distritosIds);
  } else if (provincia_id) {
    const cantonesIds = (cantones ?? [])
      .filter((c) => c.provincia_id === Number(provincia_id))
      .map((c) => c.id);
    const distritosIds = (distritos ?? [])
      .filter((d) => cantonesIds.includes(d.canton_id))
      .map((d) => d.id);
    query = query.in('distrito_id', distritosIds);
  }

  if (tipo) {
    query = query.eq('tipo', tipo);
  }

  const { data: lotes, error } = await query;

  if (error) {
    return <p className="p-6 text-destructive">Error cargando lotes: {error.message}</p>;
  }

  return (
    <div>
 
      <main className="px-4 py-6 sm:px-6">
        <h1 className="text-2xl font-semibold mb-4">Lotes en venta</h1>

        <div className="mb-6">
          <FiltroUbicacion
            provincias={provincias ?? []}
            cantones={cantones ?? []}
            distritos={distritos ?? []}
            provinciaIdInicial={provincia_id}
            cantonIdInicial={canton_id}
            distritoIdInicial={distrito_id}
            tipoInicial={tipo}
            mostrarTodosInicial={mostrar_todos === 'on'}
          />
        </div>

        {lotes.length === 0 ? (
          <p className="text-text-muted">No hay lotes que coincidan con tu búsqueda.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {lotes.map((lote) => (
              <a
                key={lote.id}
                href={`/lotes/${lote.id}`}
                className="border border-surface-alt rounded-lg overflow-hidden bg-white hover:shadow-md transition-shadow"
              >
                <div className="h-28 bg-surface flex items-center justify-center text-text-muted">
                  Sin imagen
                </div>
                <div className="p-3">
                  <span className={`inline-block text-xs px-2.5 py-1 rounded-full ${ESTADO_ESTILOS[lote.estado]}`}>
                    {lote.estado}
                  </span>
                  <p className="text-sm font-medium mt-2 text-text">
                    {lote.distritos.cantones.nombre}, {lote.distritos.cantones.provincias.nombre}
                  </p>
                  <p className="text-sm text-text-muted">
                    {lote.metros_cuadrados} m² · {lote.tipo}
                  </p>
                </div>
              </a>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}