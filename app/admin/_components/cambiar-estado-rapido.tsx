'use client';

import { useOptimistic, useTransition } from 'react';

export function CambioEstadoRapido({
  loteId,
  estadoActual,
  accion,
}: {
  loteId: string;
  estadoActual: string;
  accion: (id: string, estado: string) => Promise<void>;
}) {
  const [optimisticEstado, setOptimisticEstado] = useOptimistic(estadoActual);
  const [, startTransition] = useTransition();

  return (
    <select
      value={optimisticEstado}
      onChange={(e) => {
        const nuevoValor = e.target.value;
        startTransition(async () => {
          setOptimisticEstado(nuevoValor);
          await accion(loteId, nuevoValor);
        });
      }}
      className="border border-surface-alt rounded-md px-2 py-1 text-sm"
    >
      <option value="disponible">Disponible</option>
      <option value="reservado">Reservado</option>
      <option value="vendido">Vendido</option>
    </select>
  );
}