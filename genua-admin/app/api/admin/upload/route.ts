import { randomUUID } from 'crypto';
import { NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

const IMAGE_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif', 'heic', 'heif', 'svg']);

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

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Oturum bulunamadı. Lütfen tekrar giriş yapın.' }, { status: 401 });

    const serviceRoleKey = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!serviceRoleKey) {
      return NextResponse.json({ error: 'Sunucuda Supabase service role anahtarı tanımlı değil.' }, { status: 500 });
    }

    const formData = await request.formData();
    const file = formData.get('file');
    if (!(file instanceof File)) return NextResponse.json({ error: 'Dosya bulunamadı' }, { status: 400 });

    const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    if (!file.type.startsWith('image/') && !IMAGE_EXTENSIONS.has(extension)) {
      return NextResponse.json({ error: 'Sadece görsel dosyaları yüklenebilir' }, { status: 400 });
    }

    const fileName = `${new Date().toISOString().slice(0, 10)}/${randomUUID()}.${extension}`;
    const buffer = await file.arrayBuffer();
    const admin = createAdminClient();
    const { error } = await admin.storage.from('genua-media').upload(fileName, buffer, {
      contentType: resolveContentType(file),
      upsert: false,
    });

    if (error) {
      const message = error.message.includes('Bucket not found')
        ? 'Medya bucket bulunamadı. Supabase migration uygulanmalı.'
        : error.message;
      return NextResponse.json({ error: message }, { status: 500 });
    }

    const { data } = admin.storage.from('genua-media').getPublicUrl(fileName);
    return NextResponse.json({ url: data.publicUrl, path: fileName });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Beklenmeyen sunucu hatası';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
