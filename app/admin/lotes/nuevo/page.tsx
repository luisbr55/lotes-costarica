import { crearLote } from "./actions";
import { createClient } from "@/lib/supabase/server";
import { SelectorUbicacion } from "./selector-ubicacion";
import { SelectorMapa } from "./selector-mapa";

export default async function NuevoLotePage() {
  const supabase = await createClient();
  const [{ data: provincias }, { data: cantones }, { data: distritos }] =
    await Promise.all([
      supabase.from("provincias").select("*").order("nombre"),
      supabase.from("cantones").select("*").order("nombre"),
      supabase.from("distritos").select("*").order("nombre"),
    ]);

  return (
    <div>
      <h1>Agregar lote</h1>

      <form action={crearLote}>
        <SelectorUbicacion
          provincias={provincias ?? []}
          cantones={cantones ?? []}
          distritos={distritos ?? []}
        />
        <label>
          Metros cuadrados
          <input
            type="number"
            name="metros_cuadrados"
            step="0.01"
            min="0"
            required
          />
        </label>

        <label>
          Tipo
          <select name="tipo" required>
            <option value="residencial">Residencial</option>
            <option value="comercial">Comercial</option>
            <option value="agricola">Agrícola</option>
          </select>
        </label>

        <label>
          Estado
          <select name="estado" defaultValue="disponible">
            <option value="disponible">Disponible</option>
            <option value="reservado">Reservado</option>
            <option value="vendido">Vendido</option>
          </select>
        </label>

        <label>
          <input type="checkbox" name="agua_potable" />
          Agua potable
        </label>
        <label>
          <input type="checkbox" name="electricidad" />
          Electricidad
        </label>
        <label>
          <input type="checkbox" name="alcantarillado" />
          Alcantarillado
        </label>
        <label>
          <input type="checkbox" name="internet" />
          Internet
        </label>
        <label>
          <input type="checkbox" name="calle_asfaltada" />
          Calle asfaltada
        </label>
        <label>
          <input type="checkbox" name="alumbrado_publico" />
          Alumbrado público
        </label>
        <label>
          <input type="checkbox" name="telefono" />
          Teléfono
        </label>

        <label>
          Descripción
          <textarea name="descripcion" rows={4} />
        </label>
        <label>
          Precio de referencia
          <input type="number" name="precio_referencia" step="0.01" min="0" />
        </label>

        <label>
          <input type="checkbox" name="mostrar_precio" />
          Mostrar precio al público
        </label>

        <label>
          Imagenes del lote (10 maximo)
          <input type="file" name="imagenes" accept="image/*" multiple />
        </label>
      <SelectorMapa />
        <button type="submit">Guardar lote</button>
      </form>
    </div>
  );
}
