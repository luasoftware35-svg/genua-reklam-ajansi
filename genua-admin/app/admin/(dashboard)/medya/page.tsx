import { createAdminClient } from '@/lib/supabase/server';
import { MediaUpload } from './MediaUpload';

export const dynamic = 'force-dynamic';

export default async function MediaPage() {
  const supabase = createAdminClient();
  const { data } = await supabase.storage.from('genua-media').list('', { limit: 100, sortBy: { column: 'created_at', order: 'desc' } });
  const files = data ?? [];

  return (
    <div>
      <div className="section-head"><div><h2>Medya Kütüphanesi</h2><p>Supabase Storage içindeki görselleri yükleyin ve URL olarak kullanın.</p></div></div>
      <MediaUpload />
      <div className="grid-cards" style={{ marginTop: 20 }}>
        {files.map((file) => {
          const { data: publicUrl } = supabase.storage.from('genua-media').getPublicUrl(file.name);
          return (
            <a className="card card-pad" href={publicUrl.publicUrl} target="_blank" rel="noreferrer" key={file.name}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={publicUrl.publicUrl} alt={file.name} style={{ width: '100%', height: 140, objectFit: 'contain', background: '#f8f8f0', borderRadius: 14 }} />
              <strong style={{ display: 'block', marginTop: 12, wordBreak: 'break-all' }}>{file.name}</strong>
              <span className="toast-note">{file.metadata?.size ? `${Math.round(Number(file.metadata.size) / 1024)} KB` : 'Dosya'}</span>
            </a>
          );
        })}
      </div>
    </div>
  );
}
