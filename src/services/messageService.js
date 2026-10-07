import { supabase } from '../lib/supabase';

export async function submitContactMessage({ name, email, project_type, message }) {
  const { error } = await supabase.from('messages').insert({ name, email, project_type, message });
  if (error) throw error;
}

export async function getAllMessages() {
  const { data, error } = await supabase.from('messages').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function markMessageStatus(id, status) {
  const { data, error } = await supabase.from('messages').update({ status }).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteMessage(id) {
  const { error } = await supabase.from('messages').delete().eq('id', id);
  if (error) throw error;
}
