import { randomUUID } from 'crypto';
import { NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const formData = await request.formData();
  const file = formData.get('file');
  if (!(file instanceof File)) return NextResponse.json({ error: 'Dosya bulunamadı' }, { status: 400 });
  if (!file.type.startsWith('image/')) return NextResponse.json({ error: 'Sadece görsel dosyaları yüklenebilir' }, { status: 400 });

  const extension = file.name.split('.').pop() || 'jpg';
  const fileName = `${new Date().toISOString().slice(0, 10)}/${randomUUID()}.${extension}`;
  const buffer = await file.arrayBuffer();
  const admin = createAdminClient();
  const { error } = await admin.storage.from('genua-media').upload(fileName, buffer, { contentType: file.type, upsert: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const { data } = admin.storage.from('genua-media').getPublicUrl(fileName);
  return NextResponse.json({ url: data.publicUrl, path: fileName });
}
