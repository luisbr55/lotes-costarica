import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MapaLote } from "../../_components/mapa-lote";
import { FaWhatsapp } from "react-icons/fa6";
import { FormularioConsulta } from "../../_components/formulario-consulta";
import { GaleriaLote } from "../../_components/galeria-lote";

const SERVICIOS: { campo: string; etiqueta: string }[] = [
  { campo: "agua_potable", etiqueta: "Agua potable" },
  { campo: "electricidad", etiqueta: "Electricidad" },
  { campo: "alcantarillado", etiqueta: "Alcantarillado" },
  { campo: "internet", etiqueta: "Internet" },
  { campo: "calle_asfaltada", etiqueta: "Calle asfaltada" },
  { campo: "alumbrado_publico", etiqueta: "Alumbrado público" },
  { campo: "telefono", etiqueta: "Teléfono" },
];

const ESTADO_ESTILOS: Record<string, string> = {
  disponible: "bg-success/15 text-success",
  reservado: "bg-warning/15 text-warning",
  vendido: "bg-destructive/15 text-destructive",
};

const WHATSAPP_NUMERO = "50684460066";

export default async function DetalleLotePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();

  const { data: lote, error } = await supabase
    .from("lotes_publico")
    .select("*, distritos(nombre, cantones(nombre, provincias(nombre)))")
    .eq("id", id)
    .single();

  if (!lote || error) {
    notFound();
  }

  const { data: imagenes } = await supabase
    .from("lote_imagenes")
    .select("*")
    .eq("lote_id", id)
    .order("orden");

  const urlsImagenes = (imagenes ?? []).map(
    (img) =>
      supabase.storage.from("lotes-imagenes").getPublicUrl(img.storage_path)
        .data.publicUrl,
  );

  return (
    <div>
      <main className="px-4 py-6 sm:px-6 max-w-3xl mx-auto">
        <Link
          href="/"
          className="text-sm text-text-muted hover:text-text inline-flex items-center gap-1 mb-4"
        >
          ← Volver al listado
        </Link>

        <div className="mb-6">
          <GaleriaLote urls={urlsImagenes} />
        </div>

        <div className="flex items-center justify-between mb-1">
          <h1 className="text-xl sm:text-2xl font-semibold text-text">
            Lote en {lote.distritos.cantones.nombre},{" "}
            {lote.distritos.cantones.provincias.nombre}
          </h1>
          <span
            className={`text-xs px-2.5 py-1 rounded-full whitespace-nowrap ${ESTADO_ESTILOS[lote.estado]}`}
          >
            {lote.estado}
          </span>
        </div>

        <p className="text-sm text-text-muted mb-6">
          {lote.distritos.nombre}, {lote.distritos.cantones.nombre},{" "}
          {lote.distritos.cantones.provincias.nombre}
          {" · "}
          {lote.metros_cuadrados} m² · {lote.tipo}
        </p>

        {lote.descripcion && (
          <p className="text-sm text-text mb-6">{lote.descripcion}</p>
        )}

        <h2 className="text-sm font-medium text-text mb-2">
          Servicios disponibles
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-6">
          {SERVICIOS.map(({ campo, etiqueta }) => {
            const activo = Boolean(lote[campo as keyof typeof lote]);
            return (
              <span
                key={campo}
                className={`text-sm flex items-center gap-1.5 ${activo ? "text-text" : "text-text-muted"}`}
              >
                <span className={activo ? "text-success" : "text-text-muted"}>
                  {activo ? "✓" : "✕"}
                </span>
                {etiqueta}
              </span>
            );
          })}
        </div>

        <div className="mb-6">
          <h2 className="text-sm font-medium text-text mb-2">Ubicación</h2>
          <MapaLote latitud={lote.latitud} longitud={lote.longitud} />
        </div>

        <div className="bg-surface border border-surface-alt rounded-lg p-4 sm:p-6">
          <p className="text-lg font-medium text-text mb-4">
            Precio:{" "}
            <span className="text-accent">
              {lote.precio
                ? `$${Number(lote.precio).toLocaleString()}`
                : "bajo consulta"}
            </span>
          </p>

          <a
            href={`https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(
              `Hola, estoy interesado en el lote de ${lote.metros_cuadrados} m² en ${lote.distritos.cantones.nombre}, ${lote.distritos.cantones.provincias.nombre}.`,
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-success text-white rounded-md px-4 py-2.5 text-sm font-medium hover:opacity-90 mb-6"
          >
            <FaWhatsapp className="text-lg" />
            Escribir por WhatsApp
          </a>

          <h2 className="text-sm font-medium text-text mb-2">
            Enviar consulta
          </h2>
          <FormularioConsulta loteId={lote.id} />
        </div>
      </main>
    </div>
  );
}