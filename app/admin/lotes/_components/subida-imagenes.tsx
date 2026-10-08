'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

const MAX_IMAGENES = 10;

export function SubidaImagenes() {
  const [carpeta] = useState(() => crypto.randomUUID());
  const [paths, setPaths] = useState<string[]>([]);
  const [subiendo, setSubiendo] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const archivos = Array.from(e.target.files ?? []);
    e.target.value = '';
    if (archivos.length === 0) return;

    if (paths.length + archivos.length > MAX_IMAGENES) {
      setError(`Máximo ${MAX_IMAGENES} imágenes por lote.`);
      return;
    }

    setError(null);
    setSubiendo(true);
    const supabase = createClient();
    const nuevos: string[] = [];

    for (const archivo of archivos) {
      const ext = archivo.name.split('.').pop() ?? 'jpg';
      const ruta = `${carpeta}/${crypto.randomUUID()}.${ext}`;
      const { error: errorUpload } = await supabase.storage
        .from('lotes-imagenes')
        .upload(ruta, archivo);

      if (errorUpload) {
        console.error('Error subiendo imagen:', errorUpload);
        setError('No se pudo subir alguna imagen. Intentá de nuevo.');
        continue;
      }
      nuevos.push(ruta);
    }

    setPaths((prev) => [...prev, ...nuevos]);
    setSubiendo(false);
  }

  async function quitar(ruta: string) {
    const supabase = createClient();
    await supabase.storage.from('lotes-imagenes').remove([ruta]);
    setPaths((prev) => prev.filter((p) => p !== ruta));
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="flex flex-col gap-1 text-sm text-text">
        Imágenes (hasta {MAX_IMAGENES})
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleChange}
          disabled={subiendo}
          className="text-sm"
        />
      </label>

      {subiendo && <p className="text-sm text-text-muted">Subiendo imágenes...</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}

      {paths.length > 0 && (
        <ul className="flex flex-wrap gap-2">
          {paths.map((ruta, i) => (
            <li
              key={ruta}
              className="text-xs bg-surface border border-surface-alt rounded-full px-3 py-1 flex items-center gap-2"
            >
              {i === 0 ? 'Portada' : `Imagen ${i + 1}`}
              <button
                type="button"
                onClick={() => quitar(ruta)}
                aria-label="Quitar imagen"
                className="text-destructive"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}

      {paths.map((ruta) => (
        <input key={ruta} type="hidden" name="imagen_paths" value={ruta} />
      ))}
    </div>
  );
}