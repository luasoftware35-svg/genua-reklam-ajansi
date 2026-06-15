import { createAdminClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function ActivityPage() {
  const supabase = createAdminClient();
  const { data } = await supabase.from('activity_logs').select('*').order('created_at', { ascending: false }).limit(100);
  return (
    <div>
      <div className="section-head"><div><h2>Aktivite Logları</h2><p>Admin aksiyonları için audit trail alanı.</p></div></div>
      <div className="card table-wrap">
        <table>
          <thead><tr><th>Aksiyon</th><th>Tablo</th><th>Kayıt</th><th>Tarih</th></tr></thead>
          <tbody>{(data ?? []).map((log) => <tr key={log.id}><td>{log.action}</td><td>{log.table_name ?? '-'}</td><td>{log.record_id ?? '-'}</td><td>{log.created_at ?? '-'}</td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}
