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
    >
      <button
        type="submit"
        className="text-sm text-destructive hover:underline"
      >
        Eliminar
      </button>
    </form>
  );
}