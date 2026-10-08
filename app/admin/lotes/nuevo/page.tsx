import { crearLote } from "./actions";
import { createClient } from "@/lib/supabase/server";
import { SelectorUbicacion } from "../_components/selector-ubicacion";
import { SelectorMapa } from "../_components/selector-mapa";
import { BotonGuardar } from "../_components/boton-guardar";
import { SubidaImagenes } from "../_components/subida-imagenes";


const inputClase =
  "border border-surface-alt rounded-md px-3 py-2 text-sm w-full";
const labelClase = "flex flex-col gap-1 text-sm text-text";
const checkboxLabelClase = "flex items-center gap-2 text-sm text-text";

export default async function NuevoLotePage() {
  const supabase = await createClient();
  const [{ data: provincias }, { data: cantones }, { data: distritos }] =
    await Promise.all([
      supabase.from("provincias").select("*").order("nombre"),
      supabase.from("cantones").select("*").order("nombre"),
      supabase.from("distritos").select("*").order("nombre"),
    ]);

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold text-text mb-6">Agregar lote</h1>

      <form action={crearLote} className="flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <SelectorUbicacion
            provincias={provincias ?? []}
            cantones={cantones ?? []}
            distritos={distritos ?? []}
          />
        </div>

        <label className={labelClase}>
          Metros cuadrados
          <input
            type="number"
            name="metros_cuadrados"
            step="0.01"
            min="0"
            required
            className={inputClase}
          />
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className={labelClase}>
            Tipo
            <select name="tipo" required className={inputClase}>
              <option value="residencial">Residencial</option>
              <option value="comercial">Comercial</option>
              <option value="agricola">Agrícola</option>
            </select>
          </label>

          <label className={labelClase}>
            Estado
            <select
              name="estado"
              defaultValue="disponible"
              className={inputClase}
            >
              <option value="disponible">Disponible</option>
              <option value="reservado">Reservado</option>
              <option value="vendido">Vendido</option>
            </select>
          </label>
        </div>

        <div>
          <p className="text-sm font-medium text-text mb-2">
            Servicios disponibles
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <label className={checkboxLabelClase}>
              <input
                type="checkbox"
                name="agua_potable"
                className="accent-primary"
              />{" "}
              Agua potable
            </label>
            <label className={checkboxLabelClase}>
              <input
                type="checkbox"
                name="electricidad"
                className="accent-primary"
              />{" "}
              Electricidad
            </label>
            <label className={checkboxLabelClase}>
              <input
                type="checkbox"
                name="alcantarillado"
                className="accent-primary"
              />{" "}
              Alcantarillado
            </label>
            <label className={checkboxLabelClase}>
              <input
                type="checkbox"
                name="internet"
                className="accent-primary"
              />{" "}
              Internet
            </label>
            <label className={checkboxLabelClase}>
              <input
                type="checkbox"
                name="calle_asfaltada"
                className="accent-primary"
              />{" "}
              Calle asfaltada
            </label>
            <label className={checkboxLabelClase}>
              <input
                type="checkbox"
                name="alumbrado_publico"
                className="accent-primary"
              />{" "}
              Alumbrado público
            </label>
            <label className={checkboxLabelClase}>
              <input
                type="checkbox"
                name="telefono"
                className="accent-primary"
              />{" "}
              Teléfono
            </label>
          </div>
        </div>

        <label className={labelClase}>
          Descripción
          <textarea name="descripcion" rows={4} className={inputClase} />
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className={labelClase}>
            Precio de referencia
            <input
              type="number"
              name="precio_referencia"
              step="0.01"
              min="0"
              className={inputClase}
            />
          </label>
          <label className={`${checkboxLabelClase} sm:self-end sm:pb-2`}>
            <input
              type="checkbox"
              name="mostrar_precio"
              className="accent-primary"
            />{" "}
            Mostrar precio al público
          </label>
        </div>

        <div>
          <p className="text-sm font-medium text-text mb-2">
            Ubicación en el mapa
          </p>
          <SelectorMapa />
        </div>

        <SubidaImagenes />

        <BotonGuardar texto="Agregar lote" />
      </form>
    </div>
  );
}
