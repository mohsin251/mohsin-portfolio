import { supabase } from '../lib/supabase';

export async function getPublishedServices() {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('published', true)
    .order('display_order', { ascending: true });
  if (error) throw error;
  return data;
}

export async function getAllServices() {
  const { data, error } = await supabase.from('services').select('*').order('display_order', { ascending: true });
  if (error) throw error;
  return data;
}

export async function createService(payload) {
  const { data, error } = await supabase.from('services').insert(payload).select().single();
  if (error) throw error;
  return data;
}

export async function updateService(id, payload) {
  const { data, error } = await supabase.from('services').update(payload).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteService(id) {
  const { error } = await supabase.from('services').delete().eq('id', id);
  if (error) throw error;
}
