/// <reference types="google.maps" />

"use client";

import { useState, useEffect, useRef } from "react";
import { setOptions, importLibrary } from "@googlemaps/js-api-loader";

const CENTRO_COSTA_RICA = { lat: 9.7489, lng: -83.7534 };

export function SelectorMapa() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [latitud, setLatitud] = useState("");
  const [longitud, setLongitud] = useState("");

  useEffect(() => {
    setOptions({
      key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
      v: "weekly",
    });

    let marker: google.maps.Marker | null = null;

    importLibrary("maps").then(({ Map }) => {
      if (!mapRef.current) return;

      const map = new Map(mapRef.current, {
        center: CENTRO_COSTA_RICA,
        zoom: 8,
      });

      map.addListener("click", (e: google.maps.MapMouseEvent) => {
        if (!e.latLng) return;
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();

        setLatitud(String(lat));
        setLongitud(String(lng));

        if (marker) {
          marker.setPosition(e.latLng);
        } else {
          marker = new google.maps.Marker({ position: e.latLng, map });
        }
      });
    });
  }, []);

  return (
    <div>
      <div ref={mapRef} style={{ height: "300px", width: "100%" }} />

      <label>
        Latitud
        <input
          type="number"
          step="any"
          name="latitud"
          value={latitud}
          onChange={(e) => setLatitud(e.target.value)}
          required
        />
      </label>
      <label>
        Longitud
        <input
          type="number"
          step="any"
          name="longitud"
          value={longitud}
          onChange={(e) => setLongitud(e.target.value)}
          required
        />
      </label>
    </div>
  );
}
