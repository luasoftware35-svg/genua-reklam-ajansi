'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/server';
import { uploadMediaFile } from '@/lib/upload-media';
import { estimateReadTime, parseJson, parseList, slugify } from '@/lib/utils';
import { getResourceConfig, type ResourceField } from '@/lib/admin/resources';
import { stripProjectHeroFields } from '@/lib/admin/project-row';
import { stripTeamResumeField } from '@/lib/admin/team-row';
import { fetchInstagramReelMeta } from '@/lib/instagram-oembed';

async function enrichInstagramReelPayload(payload: Record<string, unknown>) {
  const reelUrl = String(payload.reel_url || '').trim();
  if (!reelUrl) return payload;

  const thumbnail = String(payload.thumbnail_url || '').trim();
  const title = String(payload.title || '').trim();
  if (thumbnail && title) return payload;

  const meta = await fetchInstagramReelMeta(reelUrl);
  if (!thumbnail && meta.thumbnail_url) payload.thumbnail_url = meta.thumbnail_url;
  if (!title && meta.title) payload.title = meta.title;
  return payload;
}

export async function uploadMediaAction(formData: FormData) {
  try {
    const file = formData.get('file');
    if (!(file instanceof File)) return { error: 'Dosya bulunamadı' };

    const result = await uploadMediaFile(file);
    if ('error' in result) return { error: result.error };
    return { url: result.url, path: result.path };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Görsel yüklenemedi';
    return { error: message };
  }
}

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
  if (resourceKey === 'musteriler') {
    const initials = payload.initials ? String(payload.initials).trim() : '';
    const logoUrl = payload.logo_url ? String(payload.logo_url) : '';
    if (initials && (!logoUrl || logoUrl.startsWith('initials:'))) payload.logo_url = `initials:${initials}`;
    delete payload.initials;
    delete payload.is_public_client;
    delete payload.is_collapsed;
  }
  return { config, payload };
}

function resourceErrorPath(resourceKey: string, id?: string, message?: string) {
  const base = id ? `/admin/${resourceKey}/${id}` : `/admin/${resourceKey}/yeni`;
  if (!message) return base;
  return `${base}?error=${encodeURIComponent(message)}`;
}

function handleResourceWriteError(resourceKey: string, error: { message: string }, payload: Record<string, unknown>, id?: string) {
  if (error.message.includes('case_hero') && resourceKey === 'projeler') {
    return { retryPayload: stripProjectHeroFields(payload) };
  }

  if (error.message.includes('resume_content') && resourceKey === 'ekip') {
    return { retryPayload: stripTeamResumeField(payload) };
  }

  redirect(resourceErrorPath(resourceKey, id, error.message));
}

export async function createResource(resourceKey: string, formData: FormData) {
  const { config, payload } = serializePayload(resourceKey, formData);
  if (resourceKey === 'reels') await enrichInstagramReelPayload(payload);
  const supabase = createAdminClient();
  let { error } = await supabase.from(config.table).insert(payload);

  if (error) {
    const retry = handleResourceWriteError(resourceKey, error, payload);
    if (retry?.retryPayload) {
      ({ error } = await supabase.from(config.table).insert(retry.retryPayload));
    }
  }

  if (error) redirect(resourceErrorPath(resourceKey, undefined, error.message));
  revalidatePath(`/admin/${resourceKey}`);
  redirect(`/admin/${resourceKey}`);
}

export async function updateResource(resourceKey: string, id: string, formData: FormData) {
  const { config, payload } = serializePayload(resourceKey, formData);
  if (resourceKey === 'reels') await enrichInstagramReelPayload(payload);
  const supabase = createAdminClient();
  let { error } = await supabase.from(config.table).update(payload).eq('id', id);

  if (error) {
    const retry = handleResourceWriteError(resourceKey, error, payload, id);
    if (retry?.retryPayload) {
      ({ error } = await supabase.from(config.table).update(retry.retryPayload).eq('id', id));
    }
  }

  if (error) redirect(resourceErrorPath(resourceKey, id, error.message));
  revalidatePath(`/admin/${resourceKey}`);
  revalidatePath(`/admin/${resourceKey}/${id}`);
  redirect(`/admin/${resourceKey}/${id}?saved=1`);
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
