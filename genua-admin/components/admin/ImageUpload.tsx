'use client';

import { useEffect, useRef, useState } from 'react';
import { uploadImageViaApi } from '@/lib/upload-client';

export function ImageUpload({ name, defaultValue }: { name: string; defaultValue?: string | null }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState(defaultValue ?? '');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setUrl(defaultValue ?? '');
  }, [defaultValue]);

  async function handleUpload(file: File) {
    setPending(true);
    setError(null);

    try {
      const result = await uploadImageViaApi(file);

      if ('error' in result) {
        setError(result.error);
        return;
      }

      setUrl(result.url);
    } catch {
      setError('Görsel yüklenirken beklenmeyen bir hata oluştu.');
    } finally {
      setPending(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  return (
    <div className="field">
      <input type="hidden" name={name} value={url} />
      <input className="input" value={url} onChange={(event) => setUrl(event.target.value)} placeholder="https://..." aria-label={name} />
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
      <button className="btn" type="button" style={{ justifyContent: 'flex-start' }} disabled={pending} onClick={() => fileInputRef.current?.click()}>
        {pending ? 'Yükleniyor...' : 'Dosya Yükle'}
      </button>
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt="Önizleme" style={{ width: 120, height: 80, objectFit: 'contain', background: '#f8f8f0', borderRadius: 12, padding: 8 }} />
      ) : null}
      {error ? <span className="error-box">{error}</span> : null}
    </div>
  );
}
