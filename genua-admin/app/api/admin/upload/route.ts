import { NextResponse } from 'next/server';
import { uploadMediaFile } from '@/lib/upload-media';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    if (!(file instanceof File)) return NextResponse.json({ error: 'Dosya bulunamadı' }, { status: 400 });

    const result = await uploadMediaFile(file);
    if ('error' in result) {
      const status = result.error.includes('Oturum') ? 401 : 500;
      return NextResponse.json({ error: result.error }, { status });
    }

    return NextResponse.json({ url: result.url, path: result.path });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Beklenmeyen sunucu hatası';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
