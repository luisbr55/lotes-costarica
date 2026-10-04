import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { eliminarLote } from "./actions";
import { BotonEliminar } from "./_components/boton-eliminar";
import { CambioEstadoRapido } from "./_components/cambiar-estado-rapido";
import { cambiarEstado } from "./actions";

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: Promise<{ estado?: string; busqueda?: string }>;
}) {
  const { estado, busqueda } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("lotes")
    .select(
      "*, distritos!inner(nombre, cantones!inner(nombre, provincias(nombre)))",
    )
    .order("created_at", { ascending: false });

  if (estado) {
    query = query.eq("estado", estado);
  }

  if (busqueda) {
    query = query.ilike("distritos.cantones.nombre", `%${busqueda}%`);
  }

  const { data: lotes, error } = await query;

  if (error) {
    return <p>Error cargando lotes: {error.message}</p>;
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1>Lotes</h1>
        <Link href="/admin/consultas">Ver consultas</Link>
      </div>

      <form>
        <input
          type="text"
          name="busqueda"
          placeholder="Buscar por cantón..."
          defaultValue={busqueda ?? ""}
        />
        <select name="estado" defaultValue={estado ?? ""}>
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
            {lote.distritos.nombre}, {lote.distritos.cantones.nombre},{" "}
            {lote.distritos.cantones.provincias.nombre} —{" "}
            {lote.metros_cuadrados} m² — {lote.tipo} — {lote.estado}{" "}
            <Link href={`/admin/lotes/${lote.id}/editar`}>Editar</Link>
            <BotonEliminar loteId={lote.id} accion={eliminarLote} />
            <CambioEstadoRapido
              loteId={lote.id}
              estadoActual={lote.estado}
              accion={cambiarEstado}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
