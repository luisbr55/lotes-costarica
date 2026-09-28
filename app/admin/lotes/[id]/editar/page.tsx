import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { SelectorUbicacion } from "../../_components/selector-ubicacion";
import { SelectorMapa } from "../../_components/selector-mapa";
import { actualizarLote } from "./actions";

export default async function EditarLotePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: lote, error } = await supabase
    .from("lotes")
    .select("*")
    .eq("id", id)
    .single();
  const [{ data: provincias }, { data: cantones }, { data: distritos }] =
    await Promise.all([
      supabase.from("provincias").select("*").order("nombre"),
      supabase.from("cantones").select("*").order("nombre"),
      supabase.from("distritos").select("*").order("nombre"),
    ]);

  if (!lote || error || !provincias || !cantones || !distritos) {
    notFound();
  }

  const actualizarLoteConId = actualizarLote.bind(null, id);

  return (
    <div>
      <h1>Editar lote</h1>

      <form action={actualizarLoteConId}>
        <SelectorUbicacion
          provincias={provincias}
          cantones={cantones}
          distritos={distritos}
          distritoIdInicial={lote.distrito_id}
        />

        <label>
          Metros cuadrados
          <input
            type="number"
            name="metros_cuadrados"
            step="0.01"
            min="0"
            defaultValue={lote.metros_cuadrados}
            required
          />
        </label>

        <label>
          Tipo
          <select name="tipo" defaultValue={lote.tipo} required>
            <option value="residencial">Residencial</option>
            <option value="comercial">Comercial</option>
            <option value="agricola">Agrícola</option>
          </select>
        </label>

        <label>
          Estado
          <select name="estado" defaultValue={lote.estado}>
            <option value="disponible">Disponible</option>
            <option value="reservado">Reservado</option>
            <option value="vendido">Vendido</option>
          </select>
        </label>

        <label>
          <input
            type="checkbox"
            name="agua_potable"
            defaultChecked={lote.agua_potable}
          />{" "}
          Agua potable
        </label>
        <label>
          <input
            type="checkbox"
            name="electricidad"
            defaultChecked={lote.electricidad}
          />{" "}
          Electricidad
        </label>
        <label>
          <input
            type="checkbox"
            name="alcantarillado"
            defaultChecked={lote.alcantarillado}
          />{" "}
          Alcantarillado
        </label>
        <label>
          <input
            type="checkbox"
            name="internet"
            defaultChecked={lote.internet}
          />{" "}
          Internet
        </label>
        <label>
          <input
            type="checkbox"
            name="calle_asfaltada"
            defaultChecked={lote.calle_asfaltada}
          />{" "}
          Calle asfaltada
        </label>
        <label>
          <input
            type="checkbox"
            name="alumbrado_publico"
            defaultChecked={lote.alumbrado_publico}
          />{" "}
          Alumbrado público
        </label>
        <label>
          <input
            type="checkbox"
            name="telefono"
            defaultChecked={lote.telefono}
          />{" "}
          Teléfono
        </label>

        <label>
          Descripción
          <textarea
            name="descripcion"
            rows={4}
            defaultValue={lote.descripcion ?? ""}
          />
        </label>

        <label>
          Precio de referencia
          <input
            type="number"
            name="precio_referencia"
            step="0.01"
            min="0"
            defaultValue={lote.precio_referencia ?? ""}
          />
        </label>

        <label>
          <input
            type="checkbox"
            name="mostrar_precio"
            defaultChecked={lote.mostrar_precio}
          />
          Mostrar precio al público
        </label>

        <SelectorMapa
          latitudInicial={lote.latitud}
          longitudInicial={lote.longitud}
        />

        <button type="submit">Guardar cambios</button>
      </form>
    </div>
  );
}
