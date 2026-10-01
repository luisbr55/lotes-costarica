"use server";

import { createClient } from "@/lib/supabase/server";

export async function enviarConsulta(formData: FormData) {
  const supbase = await createClient();

  const lote_id = formData.get("lote_id") as string;
  const nombre = formData.get("nombre") as string;
  const contacto = formData.get("contacto") as string;
  const mensaje = formData.get("mensaje") as string;

  const { error } = await supbase.from("consultas").insert({
    lote_id,
    nombre,
    contacto,
    mensaje,
  });

  if (error) {
    console.log("Error al enviar la consulta:", error);
    return;
  }
}
