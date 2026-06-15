import { notFound } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/server';
import { getResourceConfig } from '@/lib/admin/resources';
import { ResourceForm } from '@/components/admin/ResourceForm';

export const dynamic = 'force-dynamic';

export default async function EditResourcePage({ params }: { params: { resource: string; id: string } }) {
  const { resource, id } = params;
  const config = getResourceConfig(resource);
  if (!config || config.single) notFound();
  const supabase = createAdminClient();
  const { data, error } = await supabase.from(config.table).select('*').eq('id', id).maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) notFound();
  return (
    <div>
      <div className="section-head"><div><h2>{config.title} Düzenle</h2><p>{config.description}</p></div></div>
      <ResourceForm config={config} row={data as Record<string, unknown>} />
    </div>
  );
}
