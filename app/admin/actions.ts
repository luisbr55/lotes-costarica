'use server'

import {createClient} from '@/lib/supabase/server';
import {revalidatePath} from 'next/cache';

export async function eliminarLote(id:string){
    const supabase = await createClient();

    const {error} = await supabase.from('lotes').delete().eq('id', id);

    if(error){
        console.error("Error al eliminar lote: ", error);
        return;
    }

    revalidatePath('/admin');
}

export async function cambiarEstado(id: string, estado: string) {
  const supabase = await createClient();

  const { error } = await supabase.from('lotes').update({ estado }).eq('id', id);

  if (error) {
    console.error('Error al cambiar estado:', error);
    return;
  }

  revalidatePath('/admin');
}