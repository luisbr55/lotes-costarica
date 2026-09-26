"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function crearLote(formData: FormData) {
  const supabase = await createClient();
  const metros_cuadrados = formData.get("metros_cuadrados") as string;
  const tipo = formData.get("tipo") as string;
  const estado = formData.get("estado") as string;
  const descripcion = formData.get("descripcion") as string;
  const distrito_id = formData.get("distrito_id") as string;

  const agua_potable = formData.has("agua_potable");
  const electricidad = formData.has("electricidad");
  const alcantarillado = formData.has("alcantarillado");
  const internet = formData.has("internet");
  const calle_asfaltada = formData.has("calle_asfaltada");
  const alumbrado_publico = formData.has("alumbrado_publico");
  const telefono = formData.has("telefono");

  const precio_referencia = formData.get("precio_referencia") as string;
  const mostrar_precio = formData.has("mostrar_precio");

  const precio = precio_referencia ? Number(precio_referencia) : null;

  const latitud = formData.get("latitud") as string;
  const longitud = formData.get("longitud") as string;

  const { error } = await supabase.from("lotes").insert({
    metros_cuadrados: Number(metros_cuadrados),
    tipo,
    estado,
    distrito_id: Number(distrito_id),
    descripcion,
    agua_potable,
    electricidad,
    alcantarillado,
    internet,
    calle_asfaltada,
    alumbrado_publico,
    telefono,
    precio_referencia: precio,
    mostrar_precio,
    latitud: Number(latitud),
    longitud: Number(longitud),
  });

  if (error) {
    console.error("Error al crear lote:", error);
    return;
  }
  redirect("/admin");
}
