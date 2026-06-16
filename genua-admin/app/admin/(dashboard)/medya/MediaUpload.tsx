'use client';

import { useState } from 'react';
import { Upload } from 'lucide-react';
import { adminUploadUrl, parseUploadResponse } from '@/lib/admin-api';

export function MediaUpload() {
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function onFile(file: File) {
    setPending(true);
    setMessage(null);

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
        setMessage(data.error ?? (raw ? 'Yükleme başarısız oldu.' : 'Sunucu yanıtı okunamadı.'));
        return;
      }

      setMessage(`Yüklendi: ${data.url}`);
      window.location.reload();
    } catch {
      setMessage('Görsel yüklenirken bağlantı hatası oluştu.');
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="card card-pad">
      <label className="btn btn-primary">
        <Upload size={16} /> {pending ? 'Yükleniyor...' : 'Yeni Medya Yükle'}
        <input type="file" accept="image/*" hidden onChange={(event) => event.target.files?.[0] && onFile(event.target.files[0])} />
      </label>
      {message ? <p className="toast-note">{message}</p> : null}
    </div>
  );
}
