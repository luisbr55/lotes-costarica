'use client';

export function CambioAtendida({
  consultaId,
  atendidaActual,
  accion,
}: {
  consultaId: string;
  atendidaActual: boolean;
  accion: (id: string, atendida: boolean) => Promise<void>;
}) {
  return (
    <label className="flex items-center gap-2 text-sm text-text-muted">
      <input
        type="checkbox"
        defaultChecked={atendidaActual}
        onChange={(e) => accion(consultaId, e.target.checked)}
        className="accent-primary"
      />
      Atendida
    </label>
  );
}