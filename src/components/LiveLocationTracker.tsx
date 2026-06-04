'use client';

import { useEffect, useState } from 'react';
import { MapPin, Loader2 } from 'lucide-react';

interface Location {
  latitude: number;
  longitude: number;
  timestamp: number;
  accuracy?: number;
}

export default function LiveLocationTracker({
  rideId,
  onLocationUpdate,
}: {
  rideId: string;
  onLocationUpdate: (location: Location) => void;
}) {
  const [location, setLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tracking, setTracking] = useState(false);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Géolocalisation non supportée');
      return;
    }

    setTracking(true);
    let watchId: number;

    // Start watching position updates
    watchId = navigator.geolocation.watchPosition(
      (position) => {
        const newLocation: Location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          timestamp: Date.now(),
          accuracy: position.coords.accuracy,
        };

        setLocation(newLocation);
        setError(null);
        onLocationUpdate(newLocation);

        // Send location to server for real-time tracking
        fetch(`/api/rides/${rideId}/location`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lat: newLocation.latitude, lng: newLocation.longitude }),
        }).catch(err => console.error('Failed to update location:', err));
      },
      (err) => {
        setError(`Erreur de géolocalisation: ${err.message}`);
        setTracking(false);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 5000,
      }
    );

    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [rideId, onLocationUpdate]);

  return (
    <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
      {tracking ? (
        <>
          <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
          <span className="text-sm text-blue-900">
            {location
              ? `Position: ${location.latitude.toFixed(4)}°, ${location.longitude.toFixed(4)}°`
              : 'Connexion au GPS...'}
          </span>
        </>
      ) : (
        <>
          <MapPin className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">{error || 'GPS inactif'}</span>
        </>
      )}
      {location && (
        <span className="text-xs text-gray-500 ml-auto">
          ±{location.accuracy?.toFixed(0)}m
        </span>
      )}
    </div>
  );
}
