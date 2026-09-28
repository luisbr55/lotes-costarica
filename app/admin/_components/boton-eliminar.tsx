'use client';

export function BotonEliminar({
  loteId,
  accion,
}: {
  loteId: string;
  accion: (id: string) => Promise<void>;
}) {
  return (
    <form
      action={accion.bind(null, loteId)}
      onSubmit={(e) => {
        if (!confirm('¿Seguro que querés eliminar este lote? Esta acción no se puede deshacer.')) {
          e.preventDefault();
        }
      }}
      style={{ display: 'inline' }}
    >
      <button type="submit">Eliminar</button>
    </form>
  );
}