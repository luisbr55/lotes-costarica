'use server';

import { createClient } from '@/lib/supabase/server';
import { exigirAdmin } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

const ESTADOS = ['disponible', 'reservado', 'vendido'];

export async function eliminarLote(id: string) {
  const supabase = await createClient();
  await exigirAdmin(supabase);

  const { data: imagenes } = await supabase
    .from('lote_imagenes')
    .select('storage_path')
    .eq('lote_id', id);

  const { error } = await supabase.from('lotes').delete().eq('id', id);

  if (error) {
    console.error('Error al eliminar lote:', error);
    return;
  }

  if (imagenes && imagenes.length > 0) {
    await supabase.storage
      .from('lotes-imagenes')
      .remove(imagenes.map((img) => img.storage_path));
  }

  revalidatePath('/admin');
}

export async function cambiarEstado(id: string, estado: string) {
  if (!ESTADOS.includes(estado)) return;

  const supabase = await createClient();
  await exigirAdmin(supabase);

  const { error } = await supabase.from('lotes').update({ estado }).eq('id', id);

  if (error) {
    console.error('Error al cambiar estado:', error);
    return;
  }

  revalidatePath('/admin');
}

export async function marcarAtendida(id: string, atendida: boolean) {
  const supabase = await createClient();
  await exigirAdmin(supabase);

  const { error } = await supabase.from('consultas').update({ atendida }).eq('id', id);

  if (error) {
    console.error('Error al actualizar consulta:', error);
    return;
  }

  revalidatePath('/admin/consultas');
}