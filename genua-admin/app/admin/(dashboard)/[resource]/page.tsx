import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Plus } from 'lucide-react';
import { createAdminClient } from '@/lib/supabase/server';
import { getResourceConfig } from '@/lib/admin/resources';
import { DataTable } from '@/components/admin/DataTable';
import { ResourceForm } from '@/components/admin/ResourceForm';

export const dynamic = 'force-dynamic';

export default async function ResourcePage({ params }: { params: { resource: string } }) {
  const { resource } = params;
  const config = getResourceConfig(resource);
  if (!config) notFound();

  const supabase = createAdminClient();
  const orderColumn = config.orderBy ?? 'created_at';

  if (config.single) {
    const { data, error } = await supabase.from(config.table).select('*').limit(1).maybeSingle();
    if (error) {
      return (
        <div>
          <div className="section-head"><div><h2>{config.title}</h2><p>{config.description}</p></div></div>
          <div className="card card-pad">
            <h3 style={{ marginTop: 0 }}>Supabase bağlantısı kurulamadı</h3>
            <p className="toast-note">{error.message}</p>
            <p className="toast-note">Lütfen `.env.local` içindeki Supabase URL ve key değerlerini kontrol edin.</p>
          </div>
        </div>
      );
    }
    return (
      <div>
        <div className="section-head"><div><h2>{config.title}</h2><p>{config.description}</p></div></div>
        <ResourceForm config={config} row={(data as Record<string, unknown> | null) ?? null} />
      </div>
    );
  }

  const { data, error } = await supabase.from(config.table).select('*').order(orderColumn, { ascending: config.orderBy !== 'created_at' }).limit(100);
  if (error) {
    return (
      <div>
        <div className="section-head">
          <div><h2>{config.title}</h2><p>{config.description}</p></div>
          <Link className="btn btn-primary" href={`/admin/${config.key}/yeni`}><Plus size={16} /> {config.createLabel ?? 'Yeni Kayıt'}</Link>
        </div>
        <div className="card card-pad">
          <h3 style={{ marginTop: 0 }}>Supabase bağlantısı kurulamadı</h3>
          <p className="toast-note">{error.message}</p>
          <p className="toast-note">Bu hata genelde hatalı Project URL/key veya migration henüz uygulanmadığında görünür.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="section-head">
        <div><h2>{config.title}</h2><p>{config.description}</p></div>
        <Link className="btn btn-primary" href={`/admin/${config.key}/yeni`}><Plus size={16} /> {config.createLabel ?? 'Yeni Kayıt'}</Link>
      </div>
      <DataTable resourceKey={config.key} columns={config.columns} rows={(data as Array<Record<string, unknown>>) ?? []} />
    </div>
  );
}
