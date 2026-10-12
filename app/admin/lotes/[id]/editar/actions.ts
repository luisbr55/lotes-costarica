'use server';

import { createClient } from '@/lib/supabase/server';
import { exigirAdmin } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { leerLote } from '../../_lib/leer-lote';

export async function actualizarLote(id: string, formData: FormData) {
  const supabase = await createClient();
  await exigirAdmin(supabase);

  const datos = leerLote(formData);
  if (!datos) {
    console.error('Datos de lote inválidos');
    return;
  }

  const { error } = await supabase.from('lotes').update(datos).eq('id', id);

  if (error) {
    console.error('Error al actualizar lote:', error);
    return;
  }

  redirect('/admin');
}