'use client';

import { useEffect, useState } from 'react';
import { useRealTimeNotifications } from '@/hooks/useRealTime';
import RideMap from './RideMap';
import { Bell, Navigation, TrendingUp, Clock, CheckCircle, DollarSign } from 'lucide-react';

export default function DriverDashboard({ userId }: { userId: string }) {
  const [driverStatus, setDriverStatus] = useState('offline');
  const [availableRides, setAvailableRides] = useState<any[]>([]);
  const [currentRide, setCurrentRide] = useState<any>(null);
  const [earnings, setEarnings] = useState(0);
  const [completedRides, setCompletedRides] = useState(0);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const { notifications, unreadCount } = useRealTimeNotifications(userId);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(loc);

          // Update driver location on server
          fetch('/api/drivers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              driverId: userId,
              latitude: loc.lat,
              longitude: loc.lng,
              status: driverStatus,
            }),
          }).catch(err => console.error('Failed to update driver location:', err));
        }
      );
    }
  }, [userId, driverStatus]);

  useEffect(() => {
    if (driverStatus !== 'online' || !userLocation) return;

    // Fetch available rides nearby
    const fetchRides = async () => {
      try {
        const response = await fetch(
          `/api/rides?status=searching&lat=${userLocation.lat}&lng=${userLocation.lng}`
        );
        const data = await response.json();
        setAvailableRides(data.data || []);
      } catch (err) {
        console.error('Failed to fetch rides:', err);
      }
    };

    fetchRides();
    const interval = setInterval(fetchRides, 5000);
    return () => clearInterval(interval);
  }, [driverStatus, userLocation]);

  const toggleStatus = async () => {
    const newStatus = driverStatus === 'online' ? 'offline' : 'online';
    setDriverStatus(newStatus);

    if (userLocation) {
      try {
        await fetch('/api/drivers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            driverId: userId,
            latitude: userLocation.lat,
            longitude: userLocation.lng,
            status: newStatus,
          }),
        });
      } catch (err) {
        console.error('Failed to update status:', err);
      }
    }
  };

  const acceptRide = async (rideId: string) => {
    try {
      const response = await fetch('/api/rides', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rideId,
          driverId: userId,
          status: 'accepted',
        }),
      });

      const data = await response.json();
      setCurrentRide(data.data);
      setAvailableRides(prev => prev.filter(r => r.id !== rideId));
    } catch (err) {
      console.error('Failed to accept ride:', err);
    }
  };

  const completeRide = async () => {
    if (!currentRide) return;

    try {
      const response = await fetch('/api/rides', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rideId: currentRide.id,
          status: 'completed',
          actualPrice: currentRide.estimatedPrice,
        }),
      });

      setEarnings(prev => prev + (currentRide.estimatedPrice || 0));
      setCompletedRides(prev => prev + 1);
      setCurrentRide(null);
    } catch (err) {
      console.error('Failed to complete ride:', err);
    }
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tableau de bord Conductrice</h1>
          <p className="text-gray-600 mt-1">
            Statut: <span className={`font-semibold ${driverStatus === 'online' ? 'text-green-600' : 'text-gray-600'}`}>
              {driverStatus === 'online' ? 'En ligne' : 'Hors ligne'}
            </span>
          </p>
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

      {/* Status Toggle */}
      <button
        onClick={toggleStatus}
        className={`w-full py-4 rounded-xl font-bold text-white text-lg transition-all ${
          driverStatus === 'online'
            ? 'bg-gradient-to-r from-green-500 to-emerald-600'
            : 'bg-gradient-to-r from-gray-500 to-gray-600'
        }`}
      >
        {driverStatus === 'online' ? 'Allez hors ligne' : 'Allez en ligne'}
      </button>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <TrendingUp className="w-6 h-6 text-emerald-500 mb-2" />
          <p className="text-2xl font-bold text-gray-900">{earnings} MAD</p>
          <p className="text-xs text-gray-600">Gains totaux</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <CheckCircle className="w-6 h-6 text-blue-500 mb-2" />
          <p className="text-2xl font-bold text-gray-900">{completedRides}</p>
          <p className="text-xs text-gray-600">Trajets complétés</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <Navigation className="w-6 h-6 text-rose-gold-500 mb-2" />
          <p className="text-2xl font-bold text-gray-900">{availableRides.length}</p>
          <p className="text-xs text-gray-600">Trajets disponibles</p>
        </div>
      </div>

      {/* Current Ride */}
      {currentRide ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="font-bold text-lg mb-4">Trajet en cours</h2>

          <div className="mb-6">
            <RideMap
              fromLat={currentRide.fromLat}
              fromLng={currentRide.fromLng}
              toLat={currentRide.toLat}
              toLng={currentRide.toLng}
              height="300px"
            />
          </div>

          <div className="space-y-3 mb-6">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">De: {currentRide.fromAddress}</p>
              <p className="text-sm text-gray-600 mt-2">À: {currentRide.toAddress}</p>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-semibold">{currentRide.estimatedPrice} MAD</span>
              <span className="text-sm font-medium px-3 py-1 rounded-full bg-blue-100 text-blue-700">
                {currentRide.status}
              </span>
            </div>
          </div>

          <button
            onClick={completeRide}
            className="w-full bg-green-500 text-white font-bold py-3 rounded-lg hover:bg-green-600 transition-all"
          >
            Terminer le trajet
          </button>
        </div>
      ) : availableRides.length > 0 && driverStatus === 'online' ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="font-bold text-lg mb-4">Trajets disponibles ({availableRides.length})</h2>
          <div className="space-y-3">
            {availableRides.slice(0, 5).map(ride => (
              <div key={ride.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold text-gray-900">{ride.fromAddress}</p>
                    <p className="text-sm text-gray-600 mt-1">{ride.toAddress}</p>
                  </div>
                  <span className="font-bold text-lg text-emerald-600">{ride.estimatedPrice} MAD</span>
                </div>
                <button
                  onClick={() => acceptRide(ride.id)}
                  className="w-full bg-rose-gold-500 text-white font-semibold py-2 rounded-lg hover:bg-rose-gold-600 transition-all"
                >
                  Accepter ce trajet
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : driverStatus === 'online' ? (
        <div className="bg-blue-50 rounded-xl p-8 text-center border border-blue-200">
          <Clock className="w-12 h-12 mx-auto mb-4 text-blue-600" />
          <p className="text-gray-700 font-semibold">Pas de trajets disponibles pour le moment</p>
          <p className="text-gray-600 text-sm mt-2">Restez en ligne pour recevoir des demandes</p>
        </div>
      ) : null}
    </div>
  );
}
