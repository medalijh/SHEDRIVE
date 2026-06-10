"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { useToastStore } from "@/store/useToastStore";

export interface MapMarker {
  id: string;
  position: [number, number]; // [lat, lng]
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

const MARKER_ICONS: Record<string, { bg: string; size: number; svg: string; border?: string }> = {
  passenger: {
    bg: "linear-gradient(135deg,#9333EA,#7E22CE)",
    size: 36,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  },
  driver: {
    bg: "linear-gradient(135deg,#059669,#047857)",
    size: 36,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>`,
  },
  "driver-active": {
    bg: "linear-gradient(135deg,#059669,#047857)",
    size: 42,
    border: "3px solid #4ADE80",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>`,
  },
  pickup: {
    bg: "#9333EA",
    size: 32,
    svg: `<span style="font-weight:bold;font-size:14px">A</span>`,
  },
  dropoff: {
    bg: "#E11D48",
    size: 32,
    svg: `<span style="font-weight:bold;font-size:14px">B</span>`,
  },
};

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
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);
  const routeLayerRef = useRef<any>(null);
  const [mounted, setMounted] = useState(false);
  const [leaflet, setLeaflet] = useState<any>(null);

  // Load Leaflet
  useEffect(() => {
    setMounted(true);
    import("leaflet").then((L) => {
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });
      setLeaflet(L);
    });
  }, []);

  const mapCenter = center || DEFAULT_CENTER;

  // Initialize map
  useEffect(() => {
    if (!leaflet || !mapContainerRef.current || mapInstanceRef.current) return;

    const map = leaflet.map(mapContainerRef.current, {
      center: mapCenter,
      zoom,
      zoomControl: false,
      attributionControl: false,
    });

    leaflet.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
    }).addTo(map);

    // Add click handler
    if (onMapClick) {
      map.on("click", (e: any) => {
        onMapClick(e.latlng.lat, e.latlng.lng);
      });
    }

    // Fix tile rendering — invalidateSize after a short delay
    setTimeout(() => {
      map.invalidateSize();
    }, 100);
    setTimeout(() => {
      map.invalidateSize();
    }, 500);

    mapInstanceRef.current = map;
    markersLayerRef.current = leaflet.layerGroup().addTo(map);
    routeLayerRef.current = leaflet.layerGroup().addTo(map);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      markersLayerRef.current = null;
      routeLayerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leaflet]);

  // Update center
  useEffect(() => {
    if (!mapInstanceRef.current || !center) return;
    if (center[0] !== 0 && center[1] !== 0) {
      mapInstanceRef.current.setView(center, zoom, { animate: true });
    }
  }, [center, zoom]);

  // Update markers
  useEffect(() => {
    if (!markersLayerRef.current || !leaflet) return;
    markersLayerRef.current.clearLayers();

    markers.forEach((m) => {
      const config = MARKER_ICONS[m.type] || MARKER_ICONS.passenger;
      const sz = config.size;
      const icon = leaflet.divIcon({
        className: "custom-marker",
        html: `<div style="width:${sz}px;height:${sz}px;border-radius:50%;background:${config.bg};display:flex;align-items:center;justify-content:center;color:white;box-shadow:0 3px 12px rgba(0,0,0,0.3);border:${config.border || '3px solid white'}">${config.svg}</div>`,
        iconSize: [sz, sz],
        iconAnchor: [sz / 2, sz / 2],
      });

      const marker = leaflet.marker(m.position, { icon }).addTo(markersLayerRef.current);
      if (m.popup) {
        marker.bindPopup(`<div style="font-family:Inter,sans-serif;font-size:13px">${m.label ? `<strong>${m.label}</strong><br/>` : ""}${m.popup}</div>`);
      }
    });
  }, [markers, leaflet]);

  // Update route
  useEffect(() => {
    if (!routeLayerRef.current || !leaflet) return;
    routeLayerRef.current.clearLayers();

    if (routePoints && routePoints.length >= 2) {
      leaflet.polyline(routePoints, {
        color: "#E11D48",
        weight: 4,
        opacity: 0.8,
        dashArray: "10 6",
      }).addTo(routeLayerRef.current);

      // Fit bounds to route
      const bounds = leaflet.latLngBounds(routePoints);
      mapInstanceRef.current?.fitBounds(bounds, { padding: [50, 50], animate: true });
    }
  }, [routePoints, leaflet]);

  // Handle locate me
  const handleLocate = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          mapInstanceRef.current?.setView([lat, lng], 16, { animate: true });
          if (onMapClick) onMapClick(lat, lng);
        },
        () => useToastStore.getState().addToast("Veuillez autoriser l'accès à votre position.", "error")
      );
    }
  }, [onMapClick]);

  if (!mounted) {
    return (
      <div
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
        <div style={{ textAlign: "center", color: "var(--color-muted)" }}>
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
    <div style={{ height, borderRadius, overflow: "hidden", position: "relative" }} className={className}>
      <div
        ref={mapContainerRef}
        style={{ height: "100%", width: "100%", borderRadius }}
      />

      {/* Locate me button */}
      {showUserLocation && (
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleLocate(); }}
          style={{
            position: "absolute",
            bottom: "75px",
            right: "15px",
            zIndex: 401,
            width: "44px",
            height: "44px",
            borderRadius: "50%",
            background: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            border: "1.5px solid var(--color-border)",
            color: "var(--color-purple-600)",
            cursor: "pointer",
            transition: "transform 0.2s",
          }}
          onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
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

      {/* Gradient overlay */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "60px",
          background: "linear-gradient(to top, rgba(255,255,255,0.9) 0%, transparent 100%)",
          pointerEvents: "none",
          zIndex: 400,
          borderRadius: `0 0 ${borderRadius} ${borderRadius}`,
        }}
      />
    </div>
  );
}
