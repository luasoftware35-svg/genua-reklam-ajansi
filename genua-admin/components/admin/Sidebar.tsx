import Link from 'next/link';
import { BarChart3, BriefcaseBusiness, FileText, FolderKanban, Home, Image, Mail, MessageSquareQuote, PanelTop, Settings, Users, Wrench } from 'lucide-react';

const items = [
  { href: '/admin', label: 'Dashboard', icon: Home },
  { href: '/admin/ayarlar', label: 'Ayarlar', icon: Settings },
  { href: '/admin/hizmetler', label: 'Hizmetler', icon: Wrench },
  { href: '/admin/projeler', label: 'Portföy', icon: FolderKanban },
  { href: '/admin/ekip', label: 'Ekip', icon: Users },
  { href: '/admin/testimonials', label: 'Görüşler', icon: MessageSquareQuote },
  { href: '/admin/blog', label: 'Blog', icon: FileText },
  { href: '/admin/mesajlar', label: 'Mesajlar', icon: Mail },
  { href: '/admin/musteriler', label: 'Müşteri Logoları', icon: BriefcaseBusiness },
  { href: '/admin/bannerlar', label: 'Bannerlar', icon: PanelTop },
  { href: '/admin/medya', label: 'Medya', icon: Image },
  { href: '/admin/aktivite', label: 'Aktivite', icon: BarChart3 },
];

export function Sidebar() {
  return (
    <aside className="sidebar">
      <Link className="sidebar-brand" href="/admin">
        <span className="sidebar-mark">G</span>
        <span>Genua Admin</span>
      </Link>
      <nav className="sidebar-nav" aria-label="Admin menüsü">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Link className="sidebar-link" href={item.href} key={item.href}>
              <Icon size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
