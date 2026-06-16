import { randomUUID } from 'crypto';
import { createClient, createAdminClient } from '@/lib/supabase/server';

const IMAGE_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif', 'heic', 'heif', 'svg']);

export type MediaUploadResult = { url: string; path: string } | { error: string };

function resolveContentType(file: File) {
  if (file.type.startsWith('image/')) return file.type;

  const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  if (extension === 'png') return 'image/png';
  if (extension === 'webp') return 'image/webp';
  if (extension === 'gif') return 'image/gif';
  if (extension === 'svg') return 'image/svg+xml';
  if (extension === 'heic') return 'image/heic';
  if (extension === 'heif') return 'image/heif';
  return 'image/jpeg';
}

export async function uploadMediaFile(file: File): Promise<MediaUploadResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Oturum bulunamadı. Lütfen tekrar giriş yapın.' };

  const serviceRoleKey = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    return { error: 'Sunucuda Supabase service role anahtarı tanımlı değil.' };
  }

  const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  if (!file.type.startsWith('image/') && !IMAGE_EXTENSIONS.has(extension)) {
    return { error: 'Sadece görsel dosyaları yüklenebilir' };
  }

  const fileName = `${new Date().toISOString().slice(0, 10)}/${randomUUID()}.${extension}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  const admin = createAdminClient();
  const { error } = await admin.storage.from('genua-media').upload(fileName, buffer, {
    contentType: resolveContentType(file),
    upsert: false,
  });

  if (error) {
    const message = error.message.includes('Bucket not found')
      ? 'Medya bucket bulunamadı. Supabase migration uygulanmalı.'
      : error.message;
    return { error: message };
  }

  const { data } = admin.storage.from('genua-media').getPublicUrl(fileName);
  return { url: data.publicUrl, path: fileName };
}
