'use client';

import { useState } from 'react';

type Provincia = { id: number; nombre: string };
type Canton = { id: number; provincia_id: number; nombre: string };
type Distrito = { id: number; canton_id: number; nombre: string };

const inputClase = 'border border-surface-alt rounded-md px-3 py-2 text-sm w-full disabled:opacity-50';
const labelClase = 'flex flex-col gap-1 text-sm text-text';

export function SelectorUbicacion({
  provincias,
  cantones,
  distritos,
  distritoIdInicial,
}: {
  provincias: Provincia[];
  cantones: Canton[];
  distritos: Distrito[];
  distritoIdInicial?: number;
}) {
  const distritoInicial = distritos.find((d) => d.id === distritoIdInicial);
  const cantonInicial = cantones.find((c) => c.id === distritoInicial?.canton_id);

  const [provinciaId, setProvinciaId] = useState(
    cantonInicial ? String(cantonInicial.provincia_id) : ''
  );
  const [cantonId, setCantonId] = useState(
    distritoInicial ? String(distritoInicial.canton_id) : ''
  );

  const cantonesFiltrados = cantones.filter((c) => c.provincia_id === Number(provinciaId));
  const distritosFiltrados = distritos.filter((d) => d.canton_id === Number(cantonId));

  return (
    <>
      <label className={labelClase}>
        Provincia
        <select
          name="provincia_id"
          value={provinciaId}
          onChange={(e) => {
            setProvinciaId(e.target.value);
            setCantonId('');
          }}
          required
          className={inputClase}
        >
          <option value="">Seleccionar...</option>
          {provincias.map((p) => (
            <option key={p.id} value={p.id}>{p.nombre}</option>
          ))}
        </select>
      </label>

      <label className={labelClase}>
        Cantón
        <select
          name="canton_id"
          value={cantonId}
          onChange={(e) => setCantonId(e.target.value)}
          disabled={!provinciaId}
          required
          className={inputClase}
        >
          <option value="">Seleccionar...</option>
          {cantonesFiltrados.map((c) => (
            <option key={c.id} value={c.id}>{c.nombre}</option>
          ))}
        </select>
      </label>

      <label className={labelClase}>
        Distrito
        <select
          name="distrito_id"
          defaultValue={distritoIdInicial ?? ''}
          disabled={!cantonId}
          required
          className={inputClase}
        >
          <option value="">Seleccionar...</option>
          {distritosFiltrados.map((d) => (
            <option key={d.id} value={d.id}>{d.nombre}</option>
          ))}
        </select>
      </label>
    </>
  );
}