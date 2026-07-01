'use client';

import { useRef, useState } from 'react';
import { uploadImageViaApi } from '@/lib/upload-client';

export function MediaUpload() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleUpload(file: File) {
    setPending(true);
    setMessage(null);

    try {
      const result = await uploadImageViaApi(file);

      if ('error' in result) {
        setMessage(result.error);
        return;
      }

      setMessage(`Yüklendi: ${result.url}`);
      window.location.reload();
    } catch {
      setMessage('Görsel yüklenirken beklenmeyen bir hata oluştu.');
    } finally {
      setPending(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  return (
    <div className="card card-pad">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void handleUpload(file);
        }}
      />
      <button className="btn btn-primary" type="button" disabled={pending} onClick={() => fileInputRef.current?.click()}>
        {pending ? 'Yükleniyor...' : 'Yeni Medya Yükle'}
      </button>
      {message ? <p className="toast-note">{message}</p> : null}
    </div>
  );
}
