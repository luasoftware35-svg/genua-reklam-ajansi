import { redirect } from 'next/navigation';
import { Bell, LogOut } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';

const USER_TIMEOUT_MS = 8000;

async function getUserEmail() {
  try {
    const supabase = await createClient();
    const result = await Promise.race([
      supabase.auth.getUser(),
      new Promise<null>((resolve) => setTimeout(() => resolve(null), USER_TIMEOUT_MS)),
    ]);

    return result && 'data' in result ? result.data.user?.email ?? 'Admin' : 'Admin';
  } catch {
    return 'Admin';
  }
}

async function signOut() {
  'use server';
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/admin/login');
}

export async function Header() {
  const userEmail = await getUserEmail();

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
        <span className="badge">{userEmail}</span>
      </div>
    </header>
  );
}
