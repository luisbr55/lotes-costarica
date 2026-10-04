'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { enviarConsulta, type EstadoConsulta } from '@/app/lotes/[id]/actions';

function BotonEnviar() {
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

export function FormularioConsulta({ loteId }: { loteId: string }) {
  const [state, formAction] = useActionState<EstadoConsulta, FormData>(enviarConsulta, null);

  if (state?.success) {
    return (
      <p className="text-success text-sm">
        ¡Gracias! Tu consulta fue enviada, te vamos a contactar pronto.
      </p>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-3 max-w-md">
      <input type="hidden" name="lote_id" value={loteId} />

      <input
        type="text"
        name="nombre"
        placeholder="Nombre"
        required
        className="border border-surface-alt rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:border-primary"
      />
      <input
        type="text"
        name="contacto"
        placeholder="Teléfono o correo"
        required
        className="border border-surface-alt rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:border-primary"
      />
      <textarea
        name="mensaje"
        placeholder="Mensaje"
        required
        rows={4}
        className="border border-surface-alt rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:border-primary resize-none"
      />

      {state?.error && <p className="text-destructive text-sm">{state.error}</p>}

      <BotonEnviar />
    </form>
  );
}