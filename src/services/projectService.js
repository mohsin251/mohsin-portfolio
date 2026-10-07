import { supabase, PROJECT_IMAGES_BUCKET } from '../lib/supabase';

export async function getPublishedProjects() {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('published', true)
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function getFeaturedProjects() {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('published', true)
    .eq('featured', true)
    .order('display_order', { ascending: true });
  if (error) throw error;
  return data;
}

export async function getAllProjects() {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function getProjectBySlug(slug) {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function getProjectById(id) {
  const { data, error } = await supabase.from('projects').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  return data;
}

export async function isSlugTaken(slug, excludeId = null) {
  let query = supabase.from('projects').select('id').eq('slug', slug);
  if (excludeId) query = query.neq('id', excludeId);
  const { data, error } = await query;
  if (error) throw error;
  return data.length > 0;
}

export async function createProject(payload) {
  const { data, error } = await supabase.from('projects').insert(payload).select().single();
  if (error) throw error;
  return data;
}

export async function updateProject(id, payload) {
  const { data, error } = await supabase.from('projects').update(payload).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteProject(id) {
  const { error } = await supabase.from('projects').delete().eq('id', id);
  if (error) throw error;
}

export async function setPublished(id, published) {
  return updateProject(id, { published });
}

export async function duplicateProject(id) {
  const original = await getProjectById(id);
  if (!original) throw new Error('Project not found');

  let baseSlug = `${original.slug}-copy`;
  let slug = baseSlug;
  let n = 2;
  while (await isSlugTaken(slug)) {
    slug = `${baseSlug}-${n}`;
    n += 1;
  }

  // eslint-disable-next-line no-unused-vars
  const { id: _id, created_at, updated_at, ...rest } = original;
  const copy = {
    ...rest,
    title: `${original.title} Copy`,
    slug,
    published: false,
    featured: false,
  };
  return createProject(copy);
}

export async function updateProjectOrder(orderedIds) {
  const updates = orderedIds.map((id, index) =>
    supabase.from('projects').update({ display_order: index }).eq('id', id)
  );
  const results = await Promise.all(updates);
  const failed = results.find((r) => r.error);
  if (failed) throw failed.error;
}

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];

export function validateImageFile(file) {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return 'Only JPG, PNG, WEBP, or AVIF images are allowed.';
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return 'Image must be smaller than 5MB.';
  }
  return null;
}

export async function uploadProjectImage(file, onProgress) {
  const error = validateImageFile(file);
  if (error) throw new Error(error);

  const ext = file.name.split('.').pop();
  const path = `projects/${crypto.randomUUID()}.${ext}`;

  onProgress?.(10);
  const { error: uploadError } = await supabase.storage.from(PROJECT_IMAGES_BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
    contentType: file.type,
  });
  if (uploadError) throw uploadError;
  onProgress?.(90);

  const { data } = supabase.storage.from(PROJECT_IMAGES_BUCKET).getPublicUrl(path);
  onProgress?.(100);
  return { url: data.publicUrl, path };
}

export async function deleteProjectImageByUrl(url) {
  if (!url) return;
  const marker = `/${PROJECT_IMAGES_BUCKET}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return;
  const path = url.slice(idx + marker.length);
  const { error } = await supabase.storage.from(PROJECT_IMAGES_BUCKET).remove([path]);
  if (error) console.error('Failed to remove storage object', error);
}

export function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function isValidUrl(value) {
  if (!value) return true;
  try {
    const u = new URL(value);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}
