export type ClientUploadResult = { url: string; path: string } | { error: string };

export async function uploadImageViaApi(file: File): Promise<ClientUploadResult> {
  const formData = new FormData();
  formData.append('file', file);

  let response: Response;
  try {
    response = await fetch('/api/admin/upload', {
      method: 'POST',
      body: formData,
      credentials: 'same-origin',
    });
  } catch {
    return { error: 'Görsel yüklenirken ağ hatası oluştu.' };
  }

  const payload = (await response.json().catch(() => ({}))) as { url?: string; path?: string; error?: string };
  if (!response.ok) {
    return { error: payload.error || 'Görsel yüklenemedi.' };
  }

  if (!payload.url) {
    return { error: 'Yükleme tamamlandı ancak görsel adresi alınamadı.' };
  }

  return { url: payload.url, path: payload.path ?? '' };
}
