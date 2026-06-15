'use client';

import { useState, useTransition } from 'react';
import { Upload } from 'lucide-react';

export function MediaUpload() {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  function onFile(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    startTransition(async () => {
      setMessage(null);
      const response = await fetch('/api/admin/upload', { method: 'POST', body: formData });
      const data = await response.json();
      setMessage(response.ok ? `Yüklendi: ${data.url}` : data.error ?? 'Yükleme başarısız');
      if (response.ok) window.location.reload();
    });
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
