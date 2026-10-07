import { supabase } from '../lib/supabase';

export async function getPublishedExperience() {
  const { data, error } = await supabase
    .from('experience')
    .select('*')
    .eq('published', true)
    .order('display_order', { ascending: true });
  if (error) throw error;
  return data;
}

export async function getAllExperience() {
  const { data, error } = await supabase.from('experience').select('*').order('display_order', { ascending: true });
  if (error) throw error;
  return data;
}

export async function createExperience(payload) {
  const { data, error } = await supabase.from('experience').insert(payload).select().single();
  if (error) throw error;
  return data;
}

export async function updateExperience(id, payload) {
  const { data, error } = await supabase.from('experience').update(payload).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteExperience(id) {
  const { error } = await supabase.from('experience').delete().eq('id', id);
  if (error) throw error;
}
