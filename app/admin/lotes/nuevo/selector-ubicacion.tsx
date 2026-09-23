'use client';

import { useState } from 'react';

type Provincia = { id: number; nombre: string };
type Canton = { id: number; provincia_id: number; nombre: string };
type Distrito = { id: number; canton_id: number; nombre: string };

export function SelectorUbicacion({
  provincias,
  cantones,
  distritos,
}: {
  provincias: Provincia[];
  cantones: Canton[];
  distritos: Distrito[];
}) {
  const [provinciaId, setProvinciaId] = useState('');
  const [cantonId, setCantonId] = useState('');

  const cantonesFiltrados = cantones.filter((c) => c.provincia_id === Number(provinciaId));
  const distritosFiltrados = distritos.filter((d) => d.canton_id === Number(cantonId));

  return (
    <>
      <label>
        Provincia
        <select
          name="provincia_id"
          value={provinciaId}
          onChange={(e) => {
            setProvinciaId(e.target.value);
            setCantonId(''); // reset en cascada
          }}
          required
        >
          <option value="">Seleccionar...</option>
          {provincias.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nombre}
            </option>
          ))}
        </select>
      </label>

      <label>
        Cantón
        <select
          name="canton_id"
          value={cantonId}
          onChange={(e) => setCantonId(e.target.value)}
          disabled={!provinciaId}
          required
        >
          <option value="">Seleccionar...</option>
          {cantonesFiltrados.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre}
            </option>
          ))}
        </select>
      </label>

      <label>
        Distrito
        <select name="distrito_id" disabled={!cantonId} required>
          <option value="">Seleccionar...</option>
          {distritosFiltrados.map((d) => (
            <option key={d.id} value={d.id}>
              {d.nombre}
            </option>
          ))}
        </select>
      </label>
    </>
  );
}