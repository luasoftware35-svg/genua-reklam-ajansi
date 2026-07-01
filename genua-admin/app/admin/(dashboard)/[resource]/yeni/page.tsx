import { notFound } from 'next/navigation';
import { getResourceConfig } from '@/lib/admin/resources';
import { ResourceForm } from '@/components/admin/ResourceForm';

export const dynamic = 'force-dynamic';

export default async function NewResourcePage({
  params,
  searchParams,
}: {
  params: { resource: string };
  searchParams?: { error?: string };
}) {
  const { resource } = params;
  const config = getResourceConfig(resource);
  if (!config || config.single) notFound();
  return (
    <div>
      <div className="section-head"><div><h2>{config.createLabel ?? 'Yeni Kayıt'}</h2><p>{config.description}</p></div></div>
      <ResourceForm config={config} errorMessage={searchParams?.error ? decodeURIComponent(searchParams.error) : null} />
    </div>
  );
}
