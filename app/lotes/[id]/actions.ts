'use server';

import { createClient } from '@/lib/supabase/server';

export type EstadoConsulta = { success: boolean; error?: string } | null;

export async function enviarConsulta(
  _prevState: EstadoConsulta,
  formData: FormData
): Promise<EstadoConsulta> {
  const supabase = await createClient();

  const lote_id = formData.get('lote_id') as string;
  const nombre = formData.get('nombre') as string;
  const contacto = formData.get('contacto') as string;
  const mensaje = formData.get('mensaje') as string;

  const { error } = await supabase.from('consultas').insert({
    lote_id,
    nombre,
    contacto,
    mensaje,
  });

  if (error) {
    console.error('Error al enviar consulta:', error);
    return { success: false, error: 'Hubo un error al enviar tu consulta. Intentá de nuevo.' };
  }
  console.log("test");
  return { success: true };
}