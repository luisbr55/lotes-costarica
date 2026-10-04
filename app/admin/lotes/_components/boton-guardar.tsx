'use client';

import { useFormStatus } from 'react-dom';

export function BotonGuardar({ texto = 'Guardar' }: { texto?: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-primary text-background rounded-md px-4 py-2.5 text-sm font-medium hover:bg-primary-hover disabled:opacity-50 self-start"
    >
      {pending ? 'Guardando...' : texto}
    </button>
  );
}