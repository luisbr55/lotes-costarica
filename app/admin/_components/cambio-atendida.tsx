'use client';

import { useOptimistic, useTransition } from 'react';

export function CambioAtendida({
  consultaId,
  atendidaActual,
  accion,
}: {
  consultaId: string;
  atendidaActual: boolean;
  accion: (id: string, atendida: boolean) => Promise<void>;
}) {
  const [optimisticAtendida, setOptimisticAtendida] = useOptimistic(atendidaActual);
  const [, startTransition] = useTransition();

  return (
    <label className="flex items-center gap-2 text-sm text-text-muted">
      <input
        type="checkbox"
        checked={optimisticAtendida}
        onChange={(e) => {
          const nuevoValor = e.target.checked;
          startTransition(async () => {
            setOptimisticAtendida(nuevoValor);
            await accion(consultaId, nuevoValor);
          });
        }}
        className="accent-primary"
      />
      Atendida
    </label>
  );
}