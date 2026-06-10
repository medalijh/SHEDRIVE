"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { useToastStore } from "@/store/useToastStore";

export interface MapMarker {
  id: string;
  position: [number, number];
  type: "passenger" | "driver" | "pickup" | "dropoff" | "driver-active";
  label?: string;
  popup?: string;
}

interface LiveMapProps {
  center?: [number, number];
  zoom?: number;
  height?: string;
  markers?: MapMarker[];
  routePoints?: [number, number][];
  showUserLocation?: boolean;
  className?: string;
  borderRadius?: string;
  onMapClick?: (lat: number, lng: number) => void;
}

const DEFAULT_CENTER: [number, number] = [33.5731, -7.5898];
const DEFAULT_ZOOM = 14;

function createIcon(L: any, type: string) {
  const defs: Record<string, { bg: string; sz: number; html: string; bdr?: string }> = {
    passenger: { bg: "linear-gradient(135deg,#9333EA,#7E22CE)", sz: 36, bdr: "3px solid white", html: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>` },
    driver: { bg: "linear-gradient(135deg,#059669,#047857)", sz: 36, bdr: "3px solid white", html: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>` },
    "driver-active": { bg: "linear-gradient(135deg,#059669,#047857)", sz: 42, bdr: "3px solid #4ADE80", html: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>` },
    pickup: { bg: "#9333EA", sz: 32, bdr: "2px solid white", html: `<span style="font-weight:bold;font-size:14px;color:white">A</span>` },
    dropoff: { bg: "#E11D48", sz: 32, bdr: "2px solid white", html: `<span style="font-weight:bold;font-size:14px;color:white">B</span>` },
  };
  const d = defs[type] || defs.passenger;
  return L.divIcon({
    className: "",
    html: `<div style="width:${d.sz}px;height:${d.sz}px;border-radius:50%;background:${d.bg};display:flex;align-items:center;justify-content:center;box-shadow:0 3px 12px rgba(0,0,0,0.3);border:${d.bdr}">${d.html}</div>`,
    iconSize: [d.sz, d.sz],
    iconAnchor: [d.sz / 2, d.sz / 2],
  });
}

export default function LiveMap({
  center,
  zoom = DEFAULT_ZOOM,
  height = "300px",
  markers = [],
  routePoints,
  className = "",
  borderRadius = "1.5rem",
  showUserLocation,
  onMapClick,
}: LiveMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any>(null);
  const routeRef = useRef<any>(null);
  const LRef = useRef<any>(null);
  const clickRef = useRef(onMapClick);
  clickRef.current = onMapClick;
  const [loaded, setLoaded] = useState(false);

  // Load Leaflet + CSS
  useEffect(() => {
    // Ensure Leaflet CSS is loaded
    if (!document.querySelector('link[href*="leaflet"]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    import("leaflet").then((L) => {
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });
      LRef.current = L;
      setLoaded(true);
    });
  }, []);

  // Create map — wait for container to have actual pixel dimensions
  useEffect(() => {
    if (!loaded || !containerRef.current || mapRef.current) return;
    const L = LRef.current;
    const el = containerRef.current;

    // Wait for the element to have width > 0 before creating the map
    function tryInit() {
      const rect = el.getBoundingClientRect();
      if (rect.width < 10 || rect.height < 10) {
        requestAnimationFrame(tryInit);
        return;
      }

      const mapCenter = center || DEFAULT_CENTER;
      const map = L.map(el, {
        center: mapCenter,
        zoom,
        zoomControl: false,
        attributionControl: false,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
      }).addTo(map);

      map.on("click", (e: any) => {
        if (clickRef.current) clickRef.current(e.latlng.lat, e.latlng.lng);
      });

      mapRef.current = map;
      markersRef.current = L.layerGroup().addTo(map);
      routeRef.current = L.layerGroup().addTo(map);

      // Force proper size after paint
      requestAnimationFrame(() => {
        map.invalidateSize({ animate: false });
        // One more for good measure after CSS settles
        setTimeout(() => map.invalidateSize({ animate: false }), 300);
      });
    }

    requestAnimationFrame(tryInit);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markersRef.current = null;
        routeRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded]);

  // Handle container resize
  useEffect(() => {
    if (!containerRef.current || !mapRef.current) return;
    const ro = new ResizeObserver(() => {
      mapRef.current?.invalidateSize({ animate: false });
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [loaded]);

  // Update center
  useEffect(() => {
    if (!mapRef.current || !center || (center[0] === 0 && center[1] === 0)) return;
    mapRef.current.setView(center, zoom, { animate: true });
  }, [center, zoom]);

  // Update markers
  useEffect(() => {
    if (!markersRef.current || !LRef.current) return;
    markersRef.current.clearLayers();
    markers.forEach((m) => {
      const icon = createIcon(LRef.current, m.type);
      const mk = LRef.current.marker(m.position, { icon }).addTo(markersRef.current);
      if (m.popup) mk.bindPopup(`<div style="font-family:Inter,sans-serif;font-size:13px">${m.label ? `<strong>${m.label}</strong><br/>` : ""}${m.popup}</div>`);
    });
  }, [markers]);

  // Update route
  useEffect(() => {
    if (!routeRef.current || !LRef.current) return;
    routeRef.current.clearLayers();
    if (routePoints && routePoints.length >= 2) {
      LRef.current.polyline(routePoints, { color: "#E11D48", weight: 5, opacity: 0.85, dashArray: "12 8" }).addTo(routeRef.current);
      try {
        mapRef.current?.fitBounds(LRef.current.latLngBounds(routePoints), { padding: [40, 40], animate: true });
      } catch { /* ignore */ }
    }
  }, [routePoints]);

  const handleLocate = useCallback(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => mapRef.current?.setView([pos.coords.latitude, pos.coords.longitude], 16, { animate: true }),
      () => useToastStore.getState().addToast("Veuillez autoriser l'accès à votre position.", "error"),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  // Parse height to ensure numeric pixel value for the container
  const numericHeight = typeof height === "string" && height.endsWith("px") ? height : "300px";

  return (
    <div style={{ width: "100%", height: numericHeight, borderRadius, overflow: "hidden", position: "relative" }} className={className}>
      {/* Map target div — Leaflet attaches here */}
      <div
        ref={containerRef}
        style={{
          width: "100%",
          height: "100%",
        }}
      />

      {/* Locate button */}
      {showUserLocation && (
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleLocate(); }}
          style={{
            position: "absolute", bottom: 16, right: 16, zIndex: 1000,
            width: 44, height: 44, borderRadius: "50%", background: "white",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 2px 10px rgba(0,0,0,0.2)", border: "1.5px solid #e5e7eb",
            color: "#9333EA", cursor: "pointer", transition: "transform 0.2s",
          }}
          onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.08)")}
          onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
          aria-label="Ma position" title="Ma position"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
          </svg>
        </button>
      )}
    </div>
  );
}
