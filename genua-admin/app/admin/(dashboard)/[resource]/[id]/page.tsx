import { notFound } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/server';
import { getResourceConfig } from '@/lib/admin/resources';
import { normalizeProjectRow } from '@/lib/admin/project-row';
import { ResourceForm } from '@/components/admin/ResourceForm';

export const dynamic = 'force-dynamic';

export default async function EditResourcePage({
  params,
  searchParams,
}: {
  params: { resource: string; id: string };
  searchParams?: { error?: string };
}) {
  const { resource, id } = params;
  const config = getResourceConfig(resource);
  if (!config || config.single) notFound();
  const supabase = createAdminClient();
  const { data, error } = await supabase.from(config.table).select('*').eq('id', id).maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) notFound();
  const row = resource === 'projeler' ? normalizeProjectRow(data as Record<string, unknown>) : (data as Record<string, unknown>);
  return (
    <div>
      <div className="section-head"><div><h2>{config.title} Düzenle</h2><p>{config.description}</p></div></div>
      <ResourceForm config={config} row={row} errorMessage={searchParams?.error ? decodeURIComponent(searchParams.error) : null} />
    </div>
  );
}
