import { supabase } from '../lib/supabase';

export async function getPublishedSkills() {
  const { data, error } = await supabase
    .from('skills')
    .select('*')
    .eq('published', true)
    .order('display_order', { ascending: true });
  if (error) throw error;
  return data;
}

export async function getAllSkills() {
  const { data, error } = await supabase.from('skills').select('*').order('display_order', { ascending: true });
  if (error) throw error;
  return data;
}

export async function createSkill(payload) {
  const { data, error } = await supabase.from('skills').insert(payload).select().single();
  if (error) throw error;
  return data;
}

export async function updateSkill(id, payload) {
  const { data, error } = await supabase.from('skills').update(payload).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteSkill(id) {
  const { error } = await supabase.from('skills').delete().eq('id', id);
  if (error) throw error;
}
