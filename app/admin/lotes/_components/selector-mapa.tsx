/// <reference types="google.maps" />

'use client';

import { useState, useEffect, useRef } from 'react';
import { setOptions, importLibrary } from '@googlemaps/js-api-loader';

const CENTRO_COSTA_RICA = { lat: 9.7489, lng: -83.7534 };
const inputClase = 'border border-surface-alt rounded-md px-3 py-2 text-sm w-full';
const labelClase = 'flex flex-col gap-1 text-sm text-text';

export function SelectorMapa({
  latitudInicial,
  longitudInicial,
}: {
  latitudInicial?: number;
  longitudInicial?: number;
}) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [latitud, setLatitud] = useState(latitudInicial != null ? String(latitudInicial) : '');
  const [longitud, setLongitud] = useState(longitudInicial != null ? String(longitudInicial) : '');

  useEffect(() => {
    setOptions({ key: process.env.GOOGLE_MAPS_API_KEY!, v: 'weekly' });

    let marker: google.maps.Marker | null = null;
    const hayInicial = latitudInicial != null && longitudInicial != null;
    const centroInicial = hayInicial
      ? { lat: latitudInicial!, lng: longitudInicial! }
      : CENTRO_COSTA_RICA;

    importLibrary('maps').then(({ Map }) => {
      if (!mapRef.current) return;

      const map = new Map(mapRef.current, { center: centroInicial, zoom: hayInicial ? 15 : 8 });

      if (hayInicial) {
        marker = new google.maps.Marker({ position: centroInicial, map });
      }

      map.addListener('click', (e: google.maps.MapMouseEvent) => {
        if (!e.latLng) return;
        setLatitud(String(e.latLng.lat()));
        setLongitud(String(e.latLng.lng()));

        if (marker) marker.setPosition(e.latLng);
        else marker = new google.maps.Marker({ position: e.latLng, map });
      });
    });
  }, [latitudInicial, longitudInicial]);

  return (
    <div className="flex flex-col gap-3">
      <div ref={mapRef} className="h-56 sm:h-72 rounded-lg w-full border border-surface-alt" />
      <div className="grid grid-cols-2 gap-3">
        <label className={labelClase}>
          Latitud
          <input type="number" step="any" name="latitud" value={latitud} onChange={(e) => setLatitud(e.target.value)} required className={inputClase} />
        </label>
        <label className={labelClase}>
          Longitud
          <input type="number" step="any" name="longitud" value={longitud} onChange={(e) => setLongitud(e.target.value)} required className={inputClase} />
        </label>
      </div>
    </div>
  );
}