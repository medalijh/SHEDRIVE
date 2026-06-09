"use client";

import { useEffect, useState, useCallback } from "react";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/client";

interface DriverLocation {
  driver_id: string;
  lat: number;
  lng: number;
  updated_at: string;
}

interface RideUpdate {
  id: string;
  status: string;
  driver_id: string | null;
  driver_lat?: number;
  driver_lng?: number;
}

/**
 * Subscribe to real-time driver location updates for a specific ride
 */
export function useRealtimeTracking(rideId: string | null) {
  const [driverLocation, setDriverLocation] = useState<DriverLocation | null>(null);
  const [rideStatus, setRideStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!rideId || !isSupabaseConfigured()) return;

    const supabase = getSupabaseClient();

    // Subscribe to ride status changes
    const rideChannel = supabase
      .channel(`ride-${rideId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "rides",
          filter: `id=eq.${rideId}`,
        },
        (payload) => {
          const updated = payload.new as RideUpdate;
          setRideStatus(updated.status);
        }
      )
      .subscribe((status) => {
        if (status === "CHANNEL_ERROR") {
          setError("Erreur de connexion au suivi en temps réel");
        }
      });

    // Subscribe to driver location updates (via drivers table)
    const locationChannel = supabase
      .channel(`driver-location-${rideId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "drivers",
        },
        (payload) => {
          const driver = payload.new as { id: string; user_id: string; current_lat: number | null; current_lng: number | null };
          if (driver.current_lat && driver.current_lng) {
            setDriverLocation({
              driver_id: driver.user_id,
              lat: driver.current_lat,
              lng: driver.current_lng,
              updated_at: new Date().toISOString(),
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(rideChannel);
      supabase.removeChannel(locationChannel);
    };
  }, [rideId]);

  return { driverLocation, rideStatus, error };
}

/**
 * Broadcast driver's location to Supabase (used by driver app)
 */
export function useDriverLocationBroadcast(driverId: string | null, isOnline: boolean) {
  const [broadcasting, setBroadcasting] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const updateLocation = useCallback(async (lat: number, lng: number) => {
    if (!driverId || !isSupabaseConfigured()) return;

    const supabase = getSupabaseClient();
    const { error } = await supabase
      .from("drivers")
      .update({
        current_lat: lat,
        current_lng: lng,
        is_online: true,
      })
      .eq("user_id", driverId);

    if (!error) {
      setLastUpdate(new Date());
    }
  }, [driverId]);

  useEffect(() => {
    if (!isOnline || !driverId || typeof window === "undefined") {
      setBroadcasting(false);
      return;
    }

    if (!("geolocation" in navigator)) {
      return;
    }

    setBroadcasting(true);

    // Watch position and broadcast every update
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        updateLocation(position.coords.latitude, position.coords.longitude);
      },
      (err) => {
        console.error("Location broadcast error:", err);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 5000,
        timeout: 10000,
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
      setBroadcasting(false);
      
      // Set offline when unmounting
      if (driverId && isSupabaseConfigured()) {
        const supabase = getSupabaseClient();
        supabase
          .from("drivers")
          .update({ is_online: false })
          .eq("user_id", driverId)
          .then();
      }
    };
  }, [isOnline, driverId, updateLocation]);

  return { broadcasting, lastUpdate };
}

/**
 * Subscribe to incoming ride requests for a driver
 */
export function useDriverRideRequests(driverId: string | null, isOnline: boolean) {
  const [pendingRequests, setPendingRequests] = useState<RideUpdate[]>([]);

  useEffect(() => {
    if (!driverId || !isOnline || !isSupabaseConfigured()) {
      setPendingRequests([]);
      return;
    }

    const supabase = getSupabaseClient();

    // Listen for new rides in 'searching' status
    const channel = supabase
      .channel("ride-requests")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "rides",
          filter: "status=eq.searching",
        },
        (payload) => {
          const newRide = payload.new as RideUpdate;
          setPendingRequests(prev => [...prev, newRide]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [driverId, isOnline]);

  const dismissRequest = useCallback((rideId: string) => {
    setPendingRequests(prev => prev.filter(r => r.id !== rideId));
  }, []);

  return { pendingRequests, dismissRequest };
}
