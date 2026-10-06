'use client';

import { useOptimistic, useTransition } from 'react';
import Link from 'next/link';
import { eliminarLote, cambiarEstado } from '../actions';
import { BotonEliminar } from './boton-eliminar';
import { CambioEstadoRapido } from './cambiar-estado-rapido';

const ESTADO_ESTILOS: Record<string, string> = {
  disponible: 'bg-success/15 text-success',
  reservado: 'bg-warning/15 text-warning',
  vendido: 'bg-destructive/15 text-destructive',
};

type Lote = {
  id: string;
  estado: string;
  metros_cuadrados: number;
  tipo: string;
  distritos: { nombre: string; cantones: { nombre: string; provincias: { nombre: string } } };
};

export function ListaLotes({ lotesIniciales }: { lotesIniciales: Lote[] }) {
  const [lotes, eliminarOptimista] = useOptimistic(
    lotesIniciales,
    (estadoActual, idAEliminar: string) => estadoActual.filter((l) => l.id !== idAEliminar)
  );
  const [, startTransition] = useTransition();

  function handleEliminar(id: string) {
    startTransition(async () => {
      eliminarOptimista(id);
      await eliminarLote(id);
    });
  }

  if (lotes.length === 0) {
    return <p className="text-text-muted">No hay lotes que coincidan con tu búsqueda.</p>;
  }

  return (
    <ul className="flex flex-col gap-3">
      {lotes.map((lote) => (
        <li
          key={lote.id}
          className="border border-surface-alt rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
        >
          <div>
            <span className={`inline-block text-xs px-2.5 py-1 rounded-full mb-1 ${ESTADO_ESTILOS[lote.estado]}`}>
              {lote.estado}
            </span>
            <p className="text-sm font-medium text-text">
              {lote.distritos.nombre}, {lote.distritos.cantones.nombre}, {lote.distritos.cantones.provincias.nombre}
            </p>
            <p className="text-sm text-text-muted">
              {lote.metros_cuadrados} m² · {lote.tipo}
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <CambioEstadoRapido loteId={lote.id} estadoActual={lote.estado} accion={cambiarEstado} />
            <Link href={`/admin/lotes/${lote.id}/editar`} className="text-sm text-primary hover:underline">
              Editar
            </Link>
            <BotonEliminar loteId={lote.id} onEliminar={handleEliminar} />
          </div>
        </li>
      ))}
    </ul>
  );
}