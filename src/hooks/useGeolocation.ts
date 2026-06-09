"use client";

import { useState, useEffect, useCallback } from "react";

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  heading: number | null;
  speed: number | null;
  error: string | null;
  loading: boolean;
  supported: boolean;
}

interface UseGeolocationOptions {
  /** Enable high accuracy (GPS) */
  enableHighAccuracy?: boolean;
  /** Maximum age of cached position in ms */
  maximumAge?: number;
  /** Timeout for position request in ms */
  timeout?: number;
  /** Watch position continuously */
  watch?: boolean;
}

const defaultOptions: UseGeolocationOptions = {
  enableHighAccuracy: true,
  maximumAge: 10000,
  timeout: 15000,
  watch: false,
};

export function useGeolocation(options: UseGeolocationOptions = {}) {
  const opts = { ...defaultOptions, ...options };
  
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    accuracy: null,
    heading: null,
    speed: null,
    error: null,
    loading: true,
    supported: typeof window !== "undefined" && "geolocation" in navigator,
  });

  const handleSuccess = useCallback((position: GeolocationPosition) => {
    setState({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy,
      heading: position.coords.heading,
      speed: position.coords.speed,
      error: null,
      loading: false,
      supported: true,
    });
  }, []);

  const handleError = useCallback((error: GeolocationPositionError) => {
    let errorMessage = "Erreur de géolocalisation";
    switch (error.code) {
      case error.PERMISSION_DENIED:
        errorMessage = "Accès à la localisation refusé. Veuillez activer la géolocalisation.";
        break;
      case error.POSITION_UNAVAILABLE:
        errorMessage = "Position non disponible.";
        break;
      case error.TIMEOUT:
        errorMessage = "Délai de localisation dépassé.";
        break;
    }
    setState(prev => ({
      ...prev,
      error: errorMessage,
      loading: false,
    }));
  }, []);

  const requestPosition = useCallback(() => {
    if (!("geolocation" in navigator)) {
      setState(prev => ({
        ...prev,
        error: "La géolocalisation n'est pas supportée par ce navigateur.",
        loading: false,
        supported: false,
      }));
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      handleSuccess,
      handleError,
      {
        enableHighAccuracy: opts.enableHighAccuracy,
        maximumAge: opts.maximumAge,
        timeout: opts.timeout,
      }
    );
  }, [handleSuccess, handleError, opts.enableHighAccuracy, opts.maximumAge, opts.timeout]);

  useEffect(() => {
    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      setState(prev => ({
        ...prev,
        error: "La géolocalisation n'est pas supportée.",
        loading: false,
        supported: false,
      }));
      return;
    }

    if (opts.watch) {
      setState(prev => ({ ...prev, loading: true }));
      const watchId = navigator.geolocation.watchPosition(
        handleSuccess,
        handleError,
        {
          enableHighAccuracy: opts.enableHighAccuracy,
          maximumAge: opts.maximumAge,
          timeout: opts.timeout,
        }
      );
      return () => navigator.geolocation.clearWatch(watchId);
    } else {
      requestPosition();
    }
  }, [opts.watch, opts.enableHighAccuracy, opts.maximumAge, opts.timeout, handleSuccess, handleError, requestPosition]);

  return {
    ...state,
    requestPosition,
  };
}
