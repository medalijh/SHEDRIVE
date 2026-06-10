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

function makeIcon(L: any, type: string) {
  const configs: Record<string, { bg: string; sz: number; inner: string; border?: string }> = {
    passenger: {
      bg: "linear-gradient(135deg,#9333EA,#7E22CE)", sz: 36, border: "3px solid white",
      inner: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
    },
    driver: {
      bg: "linear-gradient(135deg,#059669,#047857)", sz: 36, border: "3px solid white",
      inner: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>`,
    },
    "driver-active": {
      bg: "linear-gradient(135deg,#059669,#047857)", sz: 42, border: "3px solid #4ADE80",
      inner: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>`,
    },
    pickup: {
      bg: "#9333EA", sz: 32, border: "2px solid white",
      inner: `<span style="font-weight:bold;font-size:14px;color:white">A</span>`,
    },
    dropoff: {
      bg: "#E11D48", sz: 32, border: "2px solid white",
      inner: `<span style="font-weight:bold;font-size:14px;color:white">B</span>`,
    },
  };
  const c = configs[type] || configs.passenger;
  return L.divIcon({
    className: "",
    html: `<div style="width:${c.sz}px;height:${c.sz}px;border-radius:50%;background:${c.bg};display:flex;align-items:center;justify-content:center;box-shadow:0 3px 12px rgba(0,0,0,0.3);border:${c.border || "3px solid white"}">${c.inner}</div>`,
    iconSize: [c.sz, c.sz],
    iconAnchor: [c.sz / 2, c.sz / 2],
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
  const wrapperRef = useRef<HTMLDivElement>(null);
  const mapElRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersGroupRef = useRef<any>(null);
  const routeGroupRef = useRef<any>(null);
  const LRef = useRef<any>(null);
  const [ready, setReady] = useState(false);
  const onMapClickRef = useRef(onMapClick);
  onMapClickRef.current = onMapClick;

  // 1. Load leaflet
  useEffect(() => {
    let cancelled = false;
    import("leaflet").then((L) => {
      if (cancelled) return;
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });
      LRef.current = L;
      setReady(true);
    });
    return () => { cancelled = true; };
  }, []);

  // 2. Create map once leaflet + DOM ready
  useEffect(() => {
    if (!ready || !mapElRef.current || mapRef.current) return;
    const L = LRef.current;
    const mapCenter = center || DEFAULT_CENTER;

    const map = L.map(mapElRef.current, {
      center: mapCenter,
      zoom,
      zoomControl: false,
      attributionControl: false,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
    }).addTo(map);

    // Click handler
    map.on("click", (e: any) => {
      if (onMapClickRef.current) {
        onMapClickRef.current(e.latlng.lat, e.latlng.lng);
      }
    });

    mapRef.current = map;
    markersGroupRef.current = L.layerGroup().addTo(map);
    routeGroupRef.current = L.layerGroup().addTo(map);

    // Force tiles to render correctly with multiple invalidateSize calls
    const fixSize = () => map.invalidateSize({ animate: false });
    fixSize();
    const t1 = setTimeout(fixSize, 50);
    const t2 = setTimeout(fixSize, 200);
    const t3 = setTimeout(fixSize, 500);
    const t4 = setTimeout(fixSize, 1000);

    // ResizeObserver — keeps tiles correct if container resizes
    let ro: ResizeObserver | null = null;
    if (wrapperRef.current) {
      ro = new ResizeObserver(() => {
        requestAnimationFrame(fixSize);
      });
      ro.observe(wrapperRef.current);
    }

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      ro?.disconnect();
      map.remove();
      mapRef.current = null;
      markersGroupRef.current = null;
      routeGroupRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  // 3. Update center/zoom
  useEffect(() => {
    if (!mapRef.current || !center) return;
    if (center[0] !== 0 && center[1] !== 0) {
      mapRef.current.setView(center, zoom, { animate: true });
    }
  }, [center, zoom]);

  // 4. Update markers
  useEffect(() => {
    if (!markersGroupRef.current || !LRef.current) return;
    const L = LRef.current;
    markersGroupRef.current.clearLayers();

    markers.forEach((m) => {
      const icon = makeIcon(L, m.type);
      const marker = L.marker(m.position, { icon }).addTo(markersGroupRef.current);
      if (m.popup) {
        marker.bindPopup(`<div style="font-family:Inter,sans-serif;font-size:13px">${m.label ? `<strong>${m.label}</strong><br/>` : ""}${m.popup}</div>`);
      }
    });
  }, [markers]);

  // 5. Update route polyline
  useEffect(() => {
    if (!routeGroupRef.current || !LRef.current) return;
    const L = LRef.current;
    routeGroupRef.current.clearLayers();

    if (routePoints && routePoints.length >= 2) {
      L.polyline(routePoints, {
        color: "#E11D48",
        weight: 5,
        opacity: 0.85,
        dashArray: "12 8",
      }).addTo(routeGroupRef.current);

      // Fit map to route bounds
      try {
        const bounds = L.latLngBounds(routePoints);
        mapRef.current?.fitBounds(bounds, { padding: [40, 40], animate: true });
      } catch (e) {
        console.warn("fitBounds error:", e);
      }
    }
  }, [routePoints]);

  // Locate button handler
  const handleLocate = useCallback(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        mapRef.current?.setView([lat, lng], 16, { animate: true });
        // Don't auto-set onMapClick from locate — user should click manually
      },
      () => useToastStore.getState().addToast("Veuillez autoriser l'accès à votre position.", "error"),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  // SSR / loading placeholder
  if (!ready) {
    return (
      <div
        ref={wrapperRef}
        className={className}
        style={{
          height,
          borderRadius,
          background: "linear-gradient(135deg, #fdf2f8 0%, #f3e8ff 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center", color: "#9CA3AF" }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ margin: "0 auto 8px" }}>
            <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/>
            <line x1="9" x2="9" y1="3" y2="18"/>
            <line x1="15" x2="15" y1="6" y2="21"/>
          </svg>
          <div style={{ fontSize: "0.875rem" }}>Chargement de la carte...</div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={wrapperRef}
      style={{ height, borderRadius, overflow: "hidden", position: "relative" }}
      className={className}
    >
      {/* Leaflet map container — MUST have explicit width and height */}
      <div
        ref={mapElRef}
        style={{ width: "100%", height: "100%", position: "absolute", top: 0, left: 0 }}
      />

      {/* Locate me button */}
      {showUserLocation && (
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleLocate(); }}
          style={{
            position: "absolute",
            bottom: "16px",
            right: "16px",
            zIndex: 1000,
            width: "44px",
            height: "44px",
            borderRadius: "50%",
            background: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
            border: "1.5px solid #e5e7eb",
            color: "#9333EA",
            cursor: "pointer",
            transition: "transform 0.2s",
          }}
          onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.08)")}
          onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
          aria-label="Ma position"
          title="Recentrer sur ma position"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
        </button>
      )}
    </div>
  );
}
