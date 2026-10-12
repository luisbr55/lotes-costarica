import type { SupabaseClient } from '@supabase/supabase-js';

export async function exigirAdmin(supabase: SupabaseClient) {
  const { data: esAdmin, error } = await supabase.rpc('is_admin');
  if (error || !esAdmin) {
    throw new Error('No autorizado');
  }
}