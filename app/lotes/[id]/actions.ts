'use server';

import { createClient } from '@/lib/supabase/server';

export type EstadoConsulta = { success: boolean; error?: string } | null;

export async function enviarConsulta(
  _prevState: EstadoConsulta,
  formData: FormData
): Promise<EstadoConsulta> {

  if (formData.get('sitio_web')) return { success: true };

  const lote_id = String(formData.get('lote_id') ?? '');
  const nombre = String(formData.get('nombre') ?? '').trim();
  const contacto = String(formData.get('contacto') ?? '').trim();
  const mensaje = String(formData.get('mensaje') ?? '').trim();

  if (
    !lote_id ||
    nombre.length < 1 || nombre.length > 100 ||
    contacto.length < 3 || contacto.length > 100 ||
    mensaje.length < 1 || mensaje.length > 1000
  ) {
    return { success: false, error: 'Revisá los datos ingresados.' };
  }

  const supabase = await createClient();

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

  return { success: true };
}