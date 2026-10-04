'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setCargando(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    setCargando(false);

    if (error) {
      setError('Credenciales incorrectas. Intentá de nuevo.');
      return;
    }

    const next = searchParams.get('next') ?? '/admin';
    router.push(next);
    router.refresh();
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-surface border border-surface-alt rounded-lg p-6 flex flex-col gap-4"
      >
        <h1 className="text-xl font-semibold text-text text-center mb-2">Iniciar sesión</h1>

        <label className="flex flex-col gap-1 text-sm text-text">
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border border-surface-alt rounded-md px-3 py-2 text-sm bg-white"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-text">
          Contraseña
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border border-surface-alt rounded-md px-3 py-2 text-sm bg-white"
          />
        </label>

        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}

        <button
          type="submit"
          disabled={cargando}
          className="bg-primary text-background rounded-md px-4 py-2.5 text-sm font-medium hover:bg-primary-hover disabled:opacity-50"
        >
          {cargando ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}