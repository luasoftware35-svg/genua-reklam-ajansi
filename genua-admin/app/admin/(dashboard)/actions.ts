'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/server';
import { estimateReadTime, parseJson, parseList, slugify } from '@/lib/utils';
import { getResourceConfig, type ResourceField } from '@/lib/admin/resources';

function getValue(field: ResourceField, formData: FormData) {
  const raw = formData.get(field.name);
  if (field.type === 'checkbox') return formData.has(field.name);
  if (field.type === 'number') return raw ? Number(raw) : null;
  if (field.type === 'tags') return parseList(raw);
  if (field.type === 'json') return parseJson(raw);
  if (field.type === 'datetime') return raw ? new Date(String(raw)).toISOString() : null;
  if (field.type === 'date') return raw ? String(raw) : null;
  return raw ? String(raw) : null;
}

function serializePayload(resourceKey: string, formData: FormData) {
  const config = getResourceConfig(resourceKey);
  if (!config) throw new Error('Bilinmeyen kaynak');
  const payload: Record<string, unknown> = {};
  for (const field of config.fields) payload[field.name] = getValue(field, formData);
  if ('slug' in payload && !payload.slug && payload.title) payload.slug = slugify(String(payload.title));
  if (resourceKey === 'blog' && payload.content) payload.read_time_minutes = estimateReadTime(String(payload.content));
  if (resourceKey === 'blog' && payload.status === 'published' && !payload.published_at) payload.published_at = new Date().toISOString();
  return { config, payload };
}

export async function createResource(resourceKey: string, formData: FormData) {
  const { config, payload } = serializePayload(resourceKey, formData);
  const supabase = createAdminClient();
  const { error } = await supabase.from(config.table).insert(payload);
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/${resourceKey}`);
  redirect(`/admin/${resourceKey}`);
}

export async function updateResource(resourceKey: string, id: string, formData: FormData) {
  const { config, payload } = serializePayload(resourceKey, formData);
  const supabase = createAdminClient();
  const { error } = await supabase.from(config.table).update(payload).eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/${resourceKey}`);
  redirect(`/admin/${resourceKey}`);
}

export async function deleteResource(resourceKey: string, id: string) {
  const config = getResourceConfig(resourceKey);
  if (!config) throw new Error('Bilinmeyen kaynak');
  const supabase = createAdminClient();
  const { error } = await supabase.from(config.table).delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/${resourceKey}`);
}

export async function saveSettings(id: string | null, formData: FormData) {
  const { config, payload } = serializePayload('ayarlar', formData);
  const supabase = createAdminClient();
  const query = id ? supabase.from(config.table).update(payload).eq('id', id) : supabase.from(config.table).insert(payload);
  const { error } = await query;
  if (error) throw new Error(error.message);
  revalidatePath('/admin/ayarlar');
  redirect('/admin/ayarlar');
}
