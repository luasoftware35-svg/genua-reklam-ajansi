'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const email = String(formData.get('email') ?? '');
    const password = String(formData.get('password') ?? '');
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

    router.replace('/admin');
    router.refresh();
  }

  return (
    <form action={onSubmit} className="login-card">
      <h1>Genua Admin</h1>
      <p>Email ve şifrenizle giriş yapın.</p>
      {error ? <div className="error-box">{error}</div> : null}
      <div className="field">
        <label htmlFor="email">Email</label>
        <input className="input" id="email" name="email" type="email" required placeholder="admin@genua.com" />
      </div>
      <div className="field" style={{ marginTop: 14 }}>
        <label htmlFor="password">Şifre</label>
        <input className="input" id="password" name="password" type="password" required placeholder="••••••••" />
      </div>
      <label style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 14 }}>
        <input type="checkbox" name="remember" /> Beni hatırla
      </label>
      <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%', marginTop: 20 }}>
        {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
      </button>
    </form>
  );
}
