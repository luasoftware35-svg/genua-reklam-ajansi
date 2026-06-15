import { redirect } from 'next/navigation';
import { Bell, LogOut } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';

async function signOut() {
  'use server';
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/admin/login');
}

export async function Header() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <header className="admin-header">
      <div>
        <h1>Yönetim Paneli</h1>
        <span className="toast-note">Genua Reklam Ajansı içerik operasyonu</span>
      </div>
      <div className="actions">
        <span className="btn" aria-label="Bildirimler"><Bell size={16} /> Yeni</span>
        <form action={signOut}>
          <button className="btn" type="submit"><LogOut size={16} /> Çıkış</button>
        </form>
        <span className="badge">{user?.email ?? 'Admin'}</span>
      </div>
    </header>
  );
}
