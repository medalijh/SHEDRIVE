'use client';

import { useEffect, useRef } from 'react';
import { MapPin, Navigation } from 'lucide-react';

interface RideMapProps {
  fromLat: number;
  fromLng: number;
  toLat: number;
  toLng: number;
  driverLat?: number;
  driverLng?: number;
  height?: string;
}

export default function RideMap({
  fromLat,
  fromLng,
  toLat,
  toLng,
  driverLat,
  driverLng,
  height = '400px',
}: RideMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // For now, show a simple map representation using canvas
    // In production, integrate with Mapbox API:
    // const mapboxgl = await import('mapbox-gl');
    // mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    // const map = new mapboxgl.Map({ container: mapContainer.current, ...options });

    const canvas = document.createElement('canvas');
    canvas.width = mapContainer.current.offsetWidth;
    canvas.height = parseInt(height);
    mapContainer.current.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw map background
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    for (let i = 0; i < canvas.width; i += 50) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
    }
    for (let i = 0; i < canvas.height; i += 50) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      ctx.stroke();
    }

    // Convert coordinates to canvas positions (simple projection)
    const minLat = Math.min(fromLat, toLat, driverLat || 0);
    const maxLat = Math.max(fromLat, toLat, driverLat || 0);
    const minLng = Math.min(fromLng, toLng, driverLng || 0);
    const maxLng = Math.max(fromLng, toLng, driverLng || 0);

    const latRange = maxLat - minLat || 1;
    const lngRange = maxLng - minLng || 1;

    const toX = (lng: number) => ((lng - minLng) / lngRange) * canvas.width;
    const toY = (lat: number) => ((maxLat - lat) / latRange) * canvas.height;

    // Draw route line
    ctx.strokeStyle = '#D97AB8';
    ctx.lineWidth = 3;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(toX(fromLng), toY(fromLat));
    ctx.lineTo(toX(toLng), toY(toLat));
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw start marker
    const startX = toX(fromLng);
    const startY = toY(fromLat);
    ctx.fillStyle = '#22c55e';
    ctx.beginPath();
    ctx.arc(startX, startY, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw end marker
    const endX = toX(toLng);
    const endY = toY(toLat);
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(endX, endY, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.stroke();

    // Draw driver marker if available
    if (driverLat && driverLng) {
      const driverX = toX(driverLng);
      const driverY = toY(driverLat);
      ctx.fillStyle = '#3b82f6';
      ctx.beginPath();
      ctx.arc(driverX, driverY, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw driver arrow/direction
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🚗', driverX, driverY);
    }

    // Draw legend
    ctx.fillStyle = '#666';
    ctx.font = '12px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('🟢 Départ', 20, canvas.height - 40);
    ctx.fillText('🔴 Destination', 20, canvas.height - 20);
    if (driverLat && driverLng) {
      ctx.fillText('🚗 Conductrice', 150, canvas.height - 20);
    }
  }, [fromLat, fromLng, toLat, toLng, driverLat, driverLng, height]);

  return (
    <div
      ref={mapContainer}
      style={{ height }}
      className="w-full rounded-lg border border-gray-200 overflow-hidden bg-gray-50 relative"
    />
  );
}
