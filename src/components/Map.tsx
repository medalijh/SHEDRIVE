"use client";

import dynamic from "next/dynamic";
import React, { useEffect, useRef, useState } from "react";

// Dynamically import Leaflet components to avoid SSR issues
const MapContainerDynamic = dynamic(
  () => import("react-leaflet").then(mod => mod.MapContainer),
  { ssr: false }
);
const TileLayerDynamic = dynamic(
  () => import("react-leaflet").then(mod => mod.TileLayer),
  { ssr: false }
);
const MarkerDynamic = dynamic(
  () => import("react-leaflet").then(mod => mod.Marker),
  { ssr: false }
);
const PopupDynamic = dynamic(
  () => import("react-leaflet").then(mod => mod.Popup),
  { ssr: false }
);
const PolylineDynamic = dynamic(
  () => import("react-leaflet").then(mod => mod.Polyline),
  { ssr: false }
);

// Map recenter component
function MapUpdater({ center, zoom }: { center: [number, number]; zoom?: number }) {
  const MapUpdaterInner = dynamic(
    () =>
      import("react-leaflet").then(mod => {
        const { useMap } = mod;
        return function Updater({ center: c, zoom: z }: { center: [number, number]; zoom?: number }) {
          const map = useMap();
          useEffect(() => {
            if (c[0] !== 0 && c[1] !== 0) {
              map.setView(c, z || map.getZoom(), { animate: true });
            }
          }, [c, z, map]);
          return null;
        };
      }),
    { ssr: false }
  );
  return <MapUpdaterInner center={center} zoom={zoom} />;
}

// Map Route Bounds Updater component
function RouteBoundsUpdater({ routePoints }: { routePoints: [number, number][] }) {
  const RouteBoundsUpdaterInner = dynamic(
    () =>
      import("react-leaflet").then(mod => {
        const { useMap } = mod;
        return function Updater({ points }: { points: [number, number][] }) {
          const map = useMap();
          useEffect(() => {
            if (points && points.length >= 2) {
              import("leaflet").then((L) => {
                const bounds = L.latLngBounds(points);
                map.fitBounds(bounds, { padding: [50, 50], animate: true });
              });
            }
          }, [points, map]);
          return null;
        };
      }),
    { ssr: false }
  );
  return <RouteBoundsUpdaterInner points={routePoints} />;
}

export interface MapMarker {
  id: string;
  position: [number, number]; // [lat, lng]
  type: "passenger" | "driver" | "pickup" | "dropoff" | "driver-active";
  label?: string;
  popup?: string;
}

interface LiveMapProps {
  /** Center coordinates [lat, lng] */
  center?: [number, number];
  /** Zoom level (default: 14) */
  zoom?: number;
  /** Height of the map */
  height?: string;
  /** Markers to display */
  markers?: MapMarker[];
  /** Route polyline points */
  routePoints?: [number, number][];
  /** Show user's current location */
  showUserLocation?: boolean;
  /** Additional CSS class */
  className?: string;
  /** Border radius */
  borderRadius?: string;
  /** Called when map is clicked */
  onMapClick?: (lat: number, lng: number) => void;
}

// Default center: Casablanca, Morocco
const DEFAULT_CENTER: [number, number] = [33.5731, -7.5898];
const DEFAULT_ZOOM = 14;

// Leaflet CSS must be loaded
function LeafletCSS() {
  useEffect(() => {
    // Add Leaflet CSS if not already loaded
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      link.integrity = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=";
      link.crossOrigin = "";
      document.head.appendChild(link);
    }
  }, []);
  return null;
}

export default function LiveMap({
  center,
  zoom = DEFAULT_ZOOM,
  height = "300px",
  markers = [],
  routePoints,
  className = "",
  borderRadius = "1.5rem",
  onMapClick,
}: LiveMapProps) {
  const [mounted, setMounted] = useState(false);
  const [leafletReady, setLeafletReady] = useState(false);
  const iconsRef = useRef<Record<string, unknown>>({});

  const mapCenter = center || DEFAULT_CENTER;

  useEffect(() => {
    setMounted(true);
    // Load Leaflet and create custom icons
    import("leaflet").then((L) => {
      // Fix default icon issue
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      
      iconsRef.current = {
        passenger: new L.DivIcon({
          className: "custom-marker",
          html: `<div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#C8956C,#A0714E);display:flex;align-items:center;justify-content:center;color:white;font-size:18px;box-shadow:0 3px 12px rgba(200,149,108,0.5);border:3px solid white;">📍</div>`,
          iconSize: [36, 36],
          iconAnchor: [18, 18],
        }),
        driver: new L.DivIcon({
          className: "custom-marker",
          html: `<div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#0D7A4A,#065F3A);display:flex;align-items:center;justify-content:center;color:white;font-size:18px;box-shadow:0 3px 12px rgba(13,122,74,0.5);border:3px solid white;">🚗</div>`,
          iconSize: [36, 36],
          iconAnchor: [18, 18],
        }),
        "driver-active": new L.DivIcon({
          className: "custom-marker",
          html: `<div style="width:42px;height:42px;border-radius:50%;background:linear-gradient(135deg,#0D7A4A,#065F3A);display:flex;align-items:center;justify-content:center;color:white;font-size:20px;box-shadow:0 3px 16px rgba(13,122,74,0.6);border:3px solid #4ADE80;animation:pulse 2s infinite;">🚗</div>`,
          iconSize: [42, 42],
          iconAnchor: [21, 21],
        }),
        pickup: new L.DivIcon({
          className: "custom-marker",
          html: `<div style="width:32px;height:32px;border-radius:50%;background:#0D7A4A;display:flex;align-items:center;justify-content:center;color:white;font-size:14px;box-shadow:0 2px 8px rgba(13,122,74,0.4);border:2px solid white;">A</div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        }),
        dropoff: new L.DivIcon({
          className: "custom-marker",
          html: `<div style="width:32px;height:32px;border-radius:50%;background:#C8956C;display:flex;align-items:center;justify-content:center;color:white;font-size:14px;box-shadow:0 2px 8px rgba(200,149,108,0.4);border:2px solid white;">B</div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        }),
      };
      setLeafletReady(true);
    });
  }, []);

  if (!mounted) {
    // SSR placeholder
    return (
      <div
        className={className}
        style={{
          height,
          borderRadius,
          background: "linear-gradient(135deg, #e8f5e8 0%, #c8dfc4 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center", color: "#4a7c59" }}>
          <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🗺️</div>
          <div style={{ fontSize: "0.875rem" }}>Chargement de la carte...</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <LeafletCSS />
      <div style={{ height, borderRadius, overflow: "hidden", position: "relative" }} className={className}>
        <MapContainerDynamic
          center={mapCenter}
          zoom={zoom}
          style={{ height: "100%", width: "100%", borderRadius }}
          zoomControl={false}
          attributionControl={false}
        >
          <TileLayerDynamic
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <MapUpdater center={mapCenter} zoom={zoom} />
          {routePoints && routePoints.length >= 2 && <RouteBoundsUpdater routePoints={routePoints} />}

          {leafletReady && markers.map((marker) => (
            <MarkerDynamic
              key={marker.id}
              position={marker.position}
              icon={iconsRef.current[marker.type] as L.DivIcon | undefined}
            >
              {marker.popup && (
                <PopupDynamic>
                  <div style={{ fontFamily: "Inter, sans-serif", fontSize: "13px" }}>
                    {marker.label && <strong>{marker.label}</strong>}
                    <br />
                    {marker.popup}
                  </div>
                </PopupDynamic>
              )}
            </MarkerDynamic>
          ))}

          {routePoints && routePoints.length >= 2 && (
            <PolylineDynamic
              positions={routePoints}
              pathOptions={{
                color: "#C8956C",
                weight: 4,
                opacity: 0.8,
                dashArray: "10 6",
              }}
            />
          )}
        </MapContainerDynamic>

        {/* Floating "Where am I" button if showUserLocation is enabled or if there's a click handler */}
        {showUserLocation && (
          <button
            onClick={(e) => {
              e.preventDefault();
              if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                  (pos) => {
                    if (onMapClick) onMapClick(pos.coords.latitude, pos.coords.longitude);
                  },
                  () => alert("Veuillez autoriser l'accès à votre position.")
                );
              }
            }}
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
              fontSize: "20px",
              cursor: "pointer",
              transition: "transform 0.2s"
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            aria-label="Ma position"
            title="Recentrer sur ma position"
          >
            📍
          </button>
        )}

        {/* Gradient overlay at bottom */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "60px",
            background: "linear-gradient(to top, rgba(253,248,245,0.9) 0%, transparent 100%)",
            pointerEvents: "none",
            zIndex: 400,
            borderRadius: `0 0 ${borderRadius} ${borderRadius}`,
          }}
        />
      </div>
    </>
  );
}
