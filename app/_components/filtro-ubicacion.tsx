'use client';

import { useState } from 'react';

type Provincia = { id: number; nombre: string };
type Canton = { id: number; provincia_id: number; nombre: string };
type Distrito = { id: number; canton_id: number; nombre: string };

export function FiltroUbicacion({
  provincias,
  cantones,
  distritos,
  provinciaIdInicial,
  cantonIdInicial,
  distritoIdInicial,
  tipoInicial,
  mostrarTodosInicial,
}: {
  provincias: Provincia[];
  cantones: Canton[];
  distritos: Distrito[];
  provinciaIdInicial?: string;
  cantonIdInicial?: string;
  distritoIdInicial?: string;
  tipoInicial?: string;
  mostrarTodosInicial?: boolean;
}) {
  const [provinciaId, setProvinciaId] = useState(provinciaIdInicial ?? '');
  const [cantonId, setCantonId] = useState(cantonIdInicial ?? '');

  const cantonesFiltrados = cantones.filter((c) => c.provincia_id === Number(provinciaId));
  const distritosFiltrados = distritos.filter((d) => d.canton_id === Number(cantonId));

  return (
    <form className="flex flex-col sm:flex-row sm:flex-wrap gap-2 items-start sm:items-center">
      <select
        name="provincia_id"
        value={provinciaId}
        onChange={(e) => {
          setProvinciaId(e.target.value);
          setCantonId('');
        }}
        className="border border-surface-alt rounded-md px-3 py-2 text-sm w-full sm:w-auto"
      >
        <option value="">Provincia</option>
        {provincias.map((p) => (
          <option key={p.id} value={p.id}>{p.nombre}</option>
        ))}
      </select>

      <select
        name="canton_id"
        value={cantonId}
        onChange={(e) => setCantonId(e.target.value)}
        disabled={!provinciaId}
        className="border border-surface-alt rounded-md px-3 py-2 text-sm disabled:opacity-50 w-full sm:w-auto"
      >
        <option value="">Cantón</option>
        {cantonesFiltrados.map((c) => (
          <option key={c.id} value={c.id}>{c.nombre}</option>
        ))}
      </select>

      <select
        name="distrito_id"
        defaultValue={distritoIdInicial ?? ''}
        disabled={!cantonId}
        className="border border-surface-alt rounded-md px-3 py-2 text-sm disabled:opacity-50 w-full sm:w-auto"
      >
        <option value="">Distrito</option>
        {distritosFiltrados.map((d) => (
          <option key={d.id} value={d.id}>{d.nombre}</option>
        ))}
      </select>

      <select
        name="tipo"
        defaultValue={tipoInicial ?? ''}
        className="border border-surface-alt rounded-md px-3 py-2 text-sm w-full sm:w-auto"
      >
        <option value="">Tipo de lote</option>
        <option value="residencial">Residencial</option>
        <option value="comercial">Comercial</option>
        <option value="agricola">Agrícola</option>
      </select>

      <label className="flex items-center gap-2 text-sm text-text-muted">
        <input type="checkbox" name="mostrar_todos" defaultChecked={mostrarTodosInicial} />
        Incluir reservados y vendidos
      </label>

      <button
        type="submit"
        className="bg-primary text-background rounded-md px-4 py-2 text-sm hover:bg-primary-hover w-full sm:w-auto"
      >
        Filtrar
      </button>
    </form>
  );
}