"use server";

import { createClient } from "@/lib/supabase/server";
import { exigirAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import { leerLote } from "../_lib/leer-lote";

export async function crearLote(formData: FormData) {
  const supabase = await createClient();
  await exigirAdmin(supabase);

  const datos = leerLote(formData);
  if (!datos) {
    console.error("Datos de lote inválidos");
    return;
  }

  const { data: lote, error } = await supabase
    .from("lotes")
    .insert(datos)
    .select("id")
    .single();

  if (error) {
    console.error("Error al crear lote:", error);
    return;
  }

  const rutas = formData.getAll("imagen_paths").map(String).slice(0, 10);

  if (rutas.length > 0) {
    const { error: errorImagenes } = await supabase
      .from("lote_imagenes")
      .insert(
        rutas.map((storage_path, i) => ({
          lote_id: lote.id,
          storage_path,
          orden: i,
        })),
      );

    if (errorImagenes) {
      console.error("Error guardando imágenes:", errorImagenes);
    }
  }

  redirect("/admin");
}