'use client';

export function BotonEliminar({
  loteId,
  onEliminar,
}: {
  loteId: string;
  onEliminar: (id: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => {
        if (confirm('¿Seguro que querés eliminar este lote? Esta acción no se puede deshacer.')) {
          onEliminar(loteId);
        }
      }}
      className="text-sm text-destructive hover:underline"
    >
      Eliminar
    </button>
  );
}