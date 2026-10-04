'use client';

export function CambioEstadoRapido({
  loteId,
  estadoActual,
  accion,
}: {
  loteId: string;
  estadoActual: string;
  accion: (id: string, estado: string) => Promise<void>;
}) {
  return (
    <select
      defaultValue={estadoActual}
      onChange={(e) => accion(loteId, e.target.value)}
      className="border border-surface-alt rounded-md px-2 py-1 text-sm"
    >
      <option value="disponible">Disponible</option>
      <option value="reservado">Reservado</option>
      <option value="vendido">Vendido</option>
    </select>
  );
}