import Link from 'next/link';
import { createAdminClient } from '@/lib/supabase/server';
import { resources } from '@/lib/admin/resources';

export const dynamic = 'force-dynamic';

async function count(table: string) {
  const supabase = createAdminClient();
  const { count: total, error } = await supabase.from(table).select('*', { count: 'exact', head: true });
  if (error) return 0;
  return total ?? 0;
}

export default async function DashboardPage() {
  const [services, projects, posts, messages, logos] = await Promise.all([
    count('services'), count('projects'), count('blog_posts'), count('contact_messages'), count('client_logos'),
  ]);

  const cards = [
    { label: 'Hizmet', value: services, href: '/admin/hizmetler' },
    { label: 'Proje', value: projects, href: '/admin/projeler' },
    { label: 'Blog Yazısı', value: posts, href: '/admin/blog' },
    { label: 'Mesaj', value: messages, href: '/admin/mesajlar' },
    { label: 'Müşteri Logosu', value: logos, href: '/admin/musteriler' },
  ];

  return (
    <div>
      <div className="section-head">
        <div>
          <h2>Dashboard</h2>
          <p>İçerik durumunu hızlıca görüntüleyin ve yönetim modüllerine geçin.</p>
        </div>
        <Link className="btn btn-primary" href="/admin/medya">Medya Yükle</Link>
      </div>
      <div className="grid-cards">
        {cards.map((card) => (
          <Link className="card card-pad stat-card" href={card.href} key={card.label}>
            <strong>{card.value}</strong>
            <span>{card.label}</span>
          </Link>
        ))}
      </div>
      <div className="card card-pad" style={{ marginTop: 22 }}>
        <h3 style={{ marginTop: 0 }}>Hızlı Erişim</h3>
        <div className="tabs">
          {Object.values(resources).map((resource) => <Link className="tab" href={`/admin/${resource.key}`} key={resource.key}>{resource.title}</Link>)}
          <Link className="tab" href="/admin/medya">Medya Kütüphanesi</Link>
        </div>
      </div>
    </div>
  );
}
