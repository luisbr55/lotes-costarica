import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { marcarAtendida } from "../actions";
import { CambioAtendida } from "../_components/cambio-atendida";

export default async function ConsultasPage() {
  const supabase = await createClient();

  const { data: consultas, error } = await supabase
    .from("consultas")
    .select(
      "*, lotes(id, distritos(nombre, cantones(nombre, provincias(nombre))))",
    )
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <p className="p-6 text-destructive">
        Error cargando consultas: {error.message}
      </p>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Consultas</h1>
        <Link href="/admin">Volver a lotes</Link>
      </div>

      {consultas.length === 0 ? (
        <p className="text-text-muted">No hay consultas todavía.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {consultas.map((consulta) => (
            <li
              key={consulta.id}
              className={`border rounded-lg p-4 ${
                consulta.atendida
                  ? "border-surface-alt bg-surface/50"
                  : "border-surface-alt"
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <p className="font-medium text-text">{consulta.nombre}</p>
                  <p className="text-sm text-text-muted">{consulta.contacto}</p>
                </div>
                <span className="text-xs text-text-muted whitespace-nowrap">
                  {new Date(consulta.created_at).toLocaleDateString("es-CR", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>

              <p className="text-sm text-text mb-2">{consulta.mensaje}</p>

              {consulta.lotes && (
                <Link
                  href={`/admin/lotes/${consulta.lotes.id}/editar`}
                  className="text-sm text-primary hover:underline"
                >
                  Lote en {consulta.lotes.distritos.cantones.nombre},{" "}
                  {consulta.lotes.distritos.cantones.provincias.nombre}
                </Link>
              )}
              <div className="mt-2">
                <CambioAtendida
                  consultaId={consulta.id}
                  atendidaActual={consulta.atendida}
                  accion={marcarAtendida}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
