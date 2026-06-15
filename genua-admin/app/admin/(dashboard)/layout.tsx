import { Header } from '@/components/admin/Header';
import { Sidebar } from '@/components/admin/Sidebar';

export const dynamic = 'force-dynamic';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-shell">
      <Sidebar />
      <main className="admin-main">
        <Header />
        <div className="admin-content">{children}</div>
      </main>
    </div>
  );
}
