'use client';

import { useEffect, useRef } from 'react';
import { setOptions, importLibrary } from '@googlemaps/js-api-loader';

export function MapaLote({ latitud, longitud }: { latitud: number; longitud: number }) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setOptions({ key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!, v: 'weekly' });

    importLibrary('maps').then(({ Map }) => {
      if (!mapRef.current) return;

      const posicion = { lat: latitud, lng: longitud };
      const map = new Map(mapRef.current, {
        center: posicion,
        zoom: 15,
        disableDefaultUI: true,
        zoomControl: true,
      });

      new google.maps.Marker({ position: posicion, map });
    });
  }, [latitud, longitud]);

  return <div ref={mapRef} className="h-56 sm:h-72 rounded-lg w-full" />;
}