'use client';

import { useEffect, useState } from 'react';
import { useRealTimeNotifications, useRealTimeDrivers } from '@/hooks/useRealTime';
import RideMap from './RideMap';
import LiveLocationTracker from './LiveLocationTracker';
import { Bell, MapPin, Phone, Star, Clock, DollarSign, Navigation } from 'lucide-react';

export default function PassengerDashboard({ userId }: { userId: string }) {
  const [activeRide, setActiveRide] = useState<any>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const { notifications, unreadCount, markAsRead } = useRealTimeNotifications(userId);
  const { drivers } = useRealTimeDrivers(userLocation?.lat || null, userLocation?.lng || null);

  useEffect(() => {
    // Get user's current location for driver search
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => console.error('Geolocation error:', error)
      );
    }

    // Fetch active ride
    const fetchActiveRide = async () => {
      try {
        const response = await fetch(`/api/rides?userId=${userId}&status=searching`);
        const data = await response.json();
        if (data.data?.length > 0) {
          setActiveRide(data.data[0]);
        }
      } catch (err) {
        console.error('Failed to fetch active ride:', err);
      }
    };

    fetchActiveRide();
    const interval = setInterval(fetchActiveRide, 3000);
    return () => clearInterval(interval);
  }, [userId]);

  const handleLocationUpdate = async (location: any) => {
    if (activeRide) {
      try {
        await fetch(`/api/rides`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            rideId: activeRide.id,
            fromLat: location.latitude,
            fromLng: location.longitude,
          }),
        });
      } catch (err) {
        console.error('Failed to update ride location:', err);
      }
    }
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bienvenue</h1>
          <p className="text-gray-600 mt-1">SheDrive Morocco</p>
        </div>
        <div className="relative">
          <button className="relative p-2 rounded-full hover:bg-gray-100">
            <Bell className="w-6 h-6 text-gray-700" />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 w-5 h-5 bg-rose-gold-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Active Ride */}
      {activeRide ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="font-bold text-lg mb-4">Trajet en cours</h2>

          {/* Map */}
          <div className="mb-6">
            <RideMap
              fromLat={activeRide.fromLat}
              fromLng={activeRide.fromLng}
              toLat={activeRide.toLat}
              toLng={activeRide.toLng}
              driverLat={activeRide.driverLat}
              driverLng={activeRide.driverLng}
              height="300px"
            />
          </div>

          {/* Location Tracking */}
          <div className="mb-6">
            <LiveLocationTracker rideId={activeRide.id} onLocationUpdate={handleLocationUpdate} />
          </div>

          {/* Ride Details */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-rose-gold-500 mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-600">De:</p>
                <p className="font-semibold text-gray-900">{activeRide.fromAddress}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-emerald-500 mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-600">À:</p>
                <p className="font-semibold text-gray-900">{activeRide.toAddress}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-gold-500" />
                <span className="font-semibold">{activeRide.estimatedPrice} MAD</span>
              </div>
              <span className="text-sm font-medium px-3 py-1 rounded-full bg-blue-100 text-blue-700">
                {activeRide.status === 'searching' ? 'Recherche de conductrice...' : activeRide.status}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-rose-gold-500 to-emerald-500 rounded-xl p-8 text-white text-center">
          <Navigation className="w-12 h-12 mx-auto mb-4 opacity-80" />
          <h3 className="text-xl font-bold mb-2">Aucun trajet actif</h3>
          <p className="opacity-90 mb-6">Réservez un trajet pour commencer</p>
          <button className="bg-white text-rose-gold-600 font-semibold px-6 py-3 rounded-lg hover:shadow-lg transition-all">
            Réserver un trajet
          </button>
        </div>
      )}

      {/* Available Drivers */}
      {drivers.length > 0 && !activeRide && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="font-bold text-lg mb-4">Conductrices disponibles</h2>
          <div className="space-y-3">
            {drivers.slice(0, 5).map(driver => (
              <div key={driver.id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg border border-gray-100">
                <div>
                  <p className="font-semibold text-gray-900">{driver.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < Math.floor(driver.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">{driver.rating.toFixed(1)}</span>
                  </div>
                </div>
                <button className="bg-rose-gold-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-rose-gold-600 transition-all">
                  Réserver
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Notifications */}
      {notifications.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="font-bold text-lg mb-4">Notifications</h2>
          <div className="space-y-2">
            {notifications.slice(0, 3).map(notif => (
              <div
                key={notif.id}
                className="p-3 bg-blue-50 rounded-lg cursor-pointer hover:bg-blue-100"
                onClick={() => markAsRead(notif.id)}
              >
                <p className="font-semibold text-gray-900 text-sm">{notif.title}</p>
                <p className="text-gray-700 text-sm mt-1">{notif.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
