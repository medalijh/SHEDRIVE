import { useEffect, useState, useCallback } from 'react';

export function useRealTimeRide(rideId: string | null) {
  const [ride, setRide] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRide = useCallback(async () => {
    if (!rideId) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/rides?rideId=${rideId}`);
      if (!response.ok) throw new Error('Failed to fetch ride');
      const data = await response.json();
      setRide(data.data?.[0]);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [rideId]);

  useEffect(() => {
    if (!rideId) return;

    fetchRide();
    
    // Poll for updates every 2 seconds
    const interval = setInterval(fetchRide, 2000);
    return () => clearInterval(interval);
  }, [rideId, fetchRide]);

  return { ride, loading, error, refetch: fetchRide };
}

export function useRealTimeDrivers(userLat: number | null, userLng: number | null) {
  const [drivers, setDrivers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDrivers = useCallback(async () => {
    if (userLat === null || userLng === null) return;

    setLoading(true);
    try {
      const response = await fetch(
        `/api/drivers?status=online&lat=${userLat}&lng=${userLng}&radius=10`
      );
      if (!response.ok) throw new Error('Failed to fetch drivers');
      const data = await response.json();
      setDrivers(data.data || []);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userLat, userLng]);

  useEffect(() => {
    if (userLat === null || userLng === null) return;

    fetchDrivers();
    
    // Poll for driver updates every 3 seconds
    const interval = setInterval(fetchDrivers, 3000);
    return () => clearInterval(interval);
  }, [userLat, userLng, fetchDrivers]);

  return { drivers, loading, error, refetch: fetchDrivers };
}

export function useRealTimeNotifications(userId: string | null) {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/notifications?userId=${userId}`);
      if (!response.ok) throw new Error('Failed to fetch notifications');
      const data = await response.json();
      setNotifications(data.data || []);
      setUnreadCount(data.data?.filter((n: any) => !n.read).length || 0);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (!userId) return;

    fetchNotifications();
    
    // Poll for new notifications every 5 seconds
    const interval = setInterval(fetchNotifications, 5000);
    return () => clearInterval(interval);
  }, [userId, fetchNotifications]);

  const markAsRead = async (notificationId: string) => {
    try {
      await fetch('/api/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, notificationId, read: true }),
      });
      await fetchNotifications();
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  return { notifications, unreadCount, loading, markAsRead, refetch: fetchNotifications };
}
