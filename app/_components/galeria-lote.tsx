'use client';

import { useState } from 'react';
import Image from 'next/image';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6';

export function GaleriaLote({ urls }: { urls: string[] }) {
  const [indice, setIndice] = useState(0);

  if (urls.length === 0) {
    return (
      <div className="h-56 sm:h-72 bg-surface rounded-lg flex items-center justify-center text-text-muted">
        Sin imágenes disponibles
      </div>
    );
  }

  const anterior = () => setIndice((i) => (i === 0 ? urls.length - 1 : i - 1));
  const siguiente = () => setIndice((i) => (i === urls.length - 1 ? 0 : i + 1));

  return (
    <div>
      <div className="relative h-56 sm:h-72 w-full rounded-lg overflow-hidden bg-surface">
        <Image
          src={urls[indice]}
          alt={`Foto ${indice + 1} del lote`}
          fill
          className="object-cover"
          priority={indice === 0}
        />

        {urls.length > 1 && (
          <>
            <button
              type="button"
              onClick={anterior}
              aria-label="Foto anterior"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-text rounded-full p-2"
            >
              <FaChevronLeft />
            </button>
            <button
              type="button"
              onClick={siguiente}
              aria-label="Foto siguiente"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-text rounded-full p-2"
            >
              <FaChevronRight />
            </button>
          </>
        )}
      </div>

      {urls.length > 1 && (
        <div className="flex justify-center gap-1.5 mt-2">
          {urls.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndice(i)}
              aria-label={`Ir a foto ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                i === indice ? 'w-4 bg-primary' : 'w-1.5 bg-surface-alt'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}