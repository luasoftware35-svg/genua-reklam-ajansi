'use client';

import { useState } from 'react';
import { Upload } from 'lucide-react';
import { adminUploadUrl, parseUploadResponse } from '@/lib/admin-api';

export function ImageUpload({ name, defaultValue }: { name: string; defaultValue?: string | null }) {
  const [url, setUrl] = useState(defaultValue ?? '');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function upload(file: File) {
    setPending(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch(adminUploadUrl(), {
        method: 'POST',
        body: formData,
        credentials: 'same-origin',
      });
      const { data, raw } = await parseUploadResponse(response);

      if (!response.ok) {
        setError(data.error ?? (raw ? 'Yükleme başarısız oldu.' : 'Sunucu yanıtı okunamadı.'));
        return;
      }

      if (!data.url) {
        setError('Yükleme tamamlandı ancak görsel adresi alınamadı.');
        return;
      }

      setUrl(data.url);
    } catch {
      setError('Görsel yüklenirken bağlantı hatası oluştu.');
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="field">
      <input className="input" name={name} value={url} onChange={(event) => setUrl(event.target.value)} placeholder="https://..." />
      <label className="btn" style={{ justifyContent: 'flex-start' }}>
        <Upload size={16} /> {pending ? 'Yükleniyor...' : 'Dosya Yükle'}
        <input type="file" accept="image/*" hidden onChange={(event) => event.target.files?.[0] && upload(event.target.files[0])} />
      </label>
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt="Önizleme" style={{ width: 120, height: 80, objectFit: 'contain', background: '#f8f8f0', borderRadius: 12, padding: 8 }} />
      ) : null}
      {error ? <span className="error-box">{error}</span> : null}
    </div>
  );
}
