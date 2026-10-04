'use client';

import { useFormStatus } from 'react-dom';

export function BotonEnviarConsulta() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-primary text-background rounded-md px-4 py-2.5 text-sm font-medium hover:bg-primary-hover disabled:opacity-50 self-start"
    >
      {pending ? 'Enviando...' : 'Enviar consulta'}
    </button>
  );
}