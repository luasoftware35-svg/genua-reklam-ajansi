'use client';

import { useState, useTransition } from 'react';
import { Upload } from 'lucide-react';

export function ImageUpload({ name, defaultValue }: { name: string; defaultValue?: string | null }) {
  const [url, setUrl] = useState(defaultValue ?? '');
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function upload(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    startTransition(async () => {
      setError(null);
      const response = await fetch('/api/admin/upload', { method: 'POST', body: formData });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error ?? 'Yükleme başarısız');
        return;
      }
      setUrl(data.url);
    });
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
