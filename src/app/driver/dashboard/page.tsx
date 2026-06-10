"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useAuth } from "@/hooks/useAuth";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useDriverLocationBroadcast, useDriverRideRequests } from "@/hooks/useRealtimeTracking";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { getRoute } from "@/lib/mapUtils";
import { MapMarker } from "@/components/Map";
import { useToastStore } from "@/store/useToastStore";
import { ShieldAlert, Home, Map as MapIcon, Coins, Settings, User, Star, MapPin, Flag, Banknote, CheckCircle, MessageCircle, ArrowRight } from "lucide-react";

const LiveMap = dynamic(() => import("@/components/Map"), { ssr: false });

function SOSButton() {
  const [pressed, setPressed] = useState(false);
  const [countdown, setCountdown] = useState(3);
  useEffect(() => {
    if (!pressed) return;
    if (countdown === 0) {
      if (isSupabaseConfigured()) {
        getSupabaseClient().from("sos_alerts").insert({ status: "active" }).then();
      }
      useToastStore.getState().addToast("🆘 SOS Envoyé avec succès à vos contacts !", "warning");
      setPressed(false);
      setCountdown(3);
      return;
    }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [pressed, countdown]);
  return (
    <>
      {pressed && (
        <div className="fixed inset-0 z-[998] flex items-center justify-center" style={{ background: "rgba(153,27,27,0.85)", backdropFilter: "blur(6px)" }}>
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full mx-6 text-center">
            <div className="flex justify-center mb-4 text-red-600"><ShieldAlert size={64} className="animate-pulse" /></div>
            <h3 className="text-2xl font-bold text-red-700 mb-2">Alerte SOS</h3>
            <p className="text-gray-600 mb-6">Envoi dans <strong>{countdown}</strong>s...</p>
            <button onClick={() => { setPressed(false); setCountdown(3); }} className="btn btn-outline w-full flex items-center justify-center gap-2" style={{ borderColor: "#E53E3E", color: "#E53E3E" }}>✕ Annuler</button>
          </div>
        </div>
      )}
      <button className="sos-button" onClick={() => setPressed(true)} aria-label="SOS"><span className="font-bold flex items-center gap-1"><ShieldAlert size={18} /> SOS</span></button>
    </>
  );
}

function DriverBottomNav({ active }: { active: string }) {
  const items = [
    { href: "/driver/dashboard", icon: <Home size={24} />, label: "Accueil", id: "home" },
    { href: "/driver/trips", icon: <MapIcon size={24} />, label: "Trajets", id: "trips" },
    { href: "/driver/earnings", icon: <Coins size={24} />, label: "Gains", id: "earnings" },
    { href: "/driver/settings", icon: <Settings size={24} />, label: "Profil", id: "profile" },
  ];
  return (
    <nav className="bottom-nav">
      {items.map(item => (
        <Link key={item.id} href={item.href} className={`bottom-nav-item ${active === item.id ? "active" : ""}`}>
          <div className="nav-icon">{item.icon}</div><span>{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}

// Incoming Ride Request Card
function RideRequestCard({ ride, onAccept, onDecline }: { ride: any, onAccept: () => void; onDecline: () => void }) {
  const [timer, setTimer] = useState(30);
  useEffect(() => {
    if (timer === 0) { onDecline(); return; }
    const t = setTimeout(() => setTimer(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [timer, onDecline]);

  const pct = (timer / 30) * 100;

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center" style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" }}>
      <div className="w-full max-w-md bg-white rounded-t-3xl overflow-hidden animate-slide-up">
        {/* Timer bar */}
        <div className="h-1.5 transition-all duration-1000" style={{
          width: `${pct}%`,
          background: pct > 50 ? "var(--color-purple-500)" : pct > 20 ? "var(--color-purple-400)" : "#E53E3E",
        }}/>

        <div className="p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-lg font-semibold" style={{ fontFamily: "var(--font-display)" }}>Nouvelle demande</h3>
              <p className="text-xs" style={{ color: "var(--color-muted)" }}>Répondez dans <strong>{timer}s</strong></p>
            </div>
            <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold border-4"
              style={{ borderColor: timer > 15 ? "var(--color-purple-500)" : "#E53E3E", color: timer > 15 ? "var(--color-purple-600)" : "#E53E3E" }}>
              {timer}
            </div>
          </div>

          <div className="card p-4 mb-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-rose-600" style={{ background: "rgba(225,29,72,0.1)" }}><User size={20}/></div>
              <div>
                <div className="text-sm font-semibold">Passagère</div>
                <div className="text-xs flex items-center gap-1" style={{ color: "var(--color-muted)" }}><Star size={12} className="text-yellow-500 fill-current"/> 4.8</div>
              </div>
              <div className="ml-auto text-right">
                <div className="text-2xl font-bold gradient-text" style={{ fontFamily: "var(--font-display)" }}>{ride.passenger_price} MAD</div>
                <div className="text-xs" style={{ color: "var(--color-muted)" }}>Offre passagère</div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {[
                { dot: "var(--color-purple-500)", label: ride.from_address, icon: <MapPin size={16}/> },
                { dot: "var(--color-rose-500)", label: ride.to_address, icon: <Flag size={16}/> },
              ].map((row, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: row.dot }}/>
                  <span className="text-sm line-clamp-1">{row.label}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-4 mt-3 text-xs" style={{ color: "var(--color-muted)" }}>
              <span className="flex items-center gap-1"><Banknote size={14}/> {ride.payment_method === "cash" ? "Espèces" : "Wallet"}</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={onDecline} className="btn btn-outline flex-1" style={{ borderColor: "rgba(197,48,48,0.3)", color: "#C53030" }}>✕ Décliner</button>
            <button onClick={onAccept} className="btn btn-emerald flex-1">✓ Accepter</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// DRIVER DASHBOARD
// ============================================================
export default function DriverDashboard() {
  const { profile } = useAuth();
  const { latitude, longitude } = useGeolocation({ watch: true });
  const [isOnline, setIsOnline] = useState(false);
  
  // Realtime hooks
  const { broadcasting } = useDriverLocationBroadcast(profile?.id || null, isOnline);
  const { pendingRequests, dismissRequest } = useDriverRideRequests(profile?.id || null, isOnline);
  
  const [activeRide, setActiveRide] = useState<any>(null);
  const [recentTrips, setRecentTrips] = useState<any[]>([]);
  const [stats, setStats] = useState({ trips: 0, earnings: 0, hours: "0h", rating: 4.9, acceptance: 92 });
  const [routePoints, setRoutePoints] = useState<[number, number][]>([]);

  useEffect(() => {
    if (activeRide) {
      const isAccepted = activeRide.status === "accepted";
      const destLat = isAccepted ? activeRide.from_lat : activeRide.to_lat;
      const destLng = isAccepted ? activeRide.from_lng : activeRide.to_lng;
      
      const startLat = latitude || activeRide.from_lat;
      const startLng = longitude || activeRide.from_lng;

      if (startLat && startLng && destLat && destLng) {
        getRoute(startLat, startLng, destLat, destLng).then(res => {
          if (res) {
            setRoutePoints(res.geometry.coordinates.map((c: any) => [c[1], c[0]]));
          }
        });
      }
    } else {
      setRoutePoints([]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeRide?.status, activeRide?.id]); // Recompute when status changes

  useEffect(() => {
    if (!profile?.id || !isSupabaseConfigured()) return;
    
    // Fetch stats and recent trips
    const fetchDashboardData = async () => {
      const supabase = getSupabaseClient();
      
      const { data: rides } = await supabase
        .from("rides")
        .select("*")
        .eq("driver_id", profile.id)
        .order("created_at", { ascending: false })
        .limit(10);
        
      if (rides) {
        const completed = rides.filter(r => r.status === "completed");
        setRecentTrips(completed.slice(0, 3));
        
        // Simple mock stats from real data
        const todayEarn = completed.reduce((sum, r) => sum + (r.final_price || r.passenger_price), 0);
        setStats(prev => ({
          ...prev,
          trips: completed.length,
          earnings: todayEarn,
        }));
        
        // Check for active ride
        const active = rides.find(r => ["accepted", "driver_arrived", "in_progress"].includes(r.status));
        if (active) setActiveRide(active);
      }
    };
    
    fetchDashboardData();
  }, [profile?.id]);

  const handleOnlineToggle = async () => {
    const nextState = !isOnline;
    setIsOnline(nextState);
    if (profile?.id && isSupabaseConfigured()) {
      await getSupabaseClient().from("drivers").update({ is_online: nextState }).eq("user_id", profile.id);
    }
  };

  const handleAcceptRide = async (ride: any) => {
    if (!profile?.id || !isSupabaseConfigured()) return;
    const { data, error } = await getSupabaseClient()
      .from("rides")
      .update({ status: "accepted", driver_id: profile.id })
      .eq("id", ride.id)
      .select()
      .single();
      
    if (!error && data) {
      setActiveRide(data);
      dismissRequest(ride.id);
    }
  };

  const currentRequest = pendingRequests.length > 0 ? pendingRequests[0] : null;

  // Map Markers
  const markers: MapMarker[] = [];
  const mapCenter: [number, number] = latitude && longitude ? [latitude, longitude] : [33.5731, -7.5898];
  
  if (isOnline) {
    markers.push({ id: "me", position: mapCenter, type: "driver-active" });
  }

  if (activeRide) {
    if (activeRide.from_lat && activeRide.from_lng) {
      markers.push({ id: "pickup", position: [activeRide.from_lat, activeRide.from_lng], type: "pickup" });
    }
    if (activeRide.to_lat && activeRide.to_lng) {
      markers.push({ id: "dropoff", position: [activeRide.to_lat, activeRide.to_lng], type: "dropoff" });
    }
  }

  return (
    <div className="container-app mx-auto pb-28" style={{ background: "var(--color-silver-50)", minHeight: "100vh" }}>
      {/* Header */}
      <div className="px-6 pt-12 pb-4 flex items-center justify-between">
        <div>
          <p className="text-sm" style={{ color: "var(--color-muted)" }}>Bonjour</p>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>{profile?.full_name || "Conductrice"}</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: isOnline ? "rgba(147,51,234,0.1)" : "var(--color-silver-100)", border: `1px solid ${isOnline ? "rgba(147,51,234,0.3)" : "var(--color-border)"}` }}>
            <div className="w-2 h-2 rounded-full" style={{ background: isOnline ? "var(--color-purple-500)" : "var(--color-silver-400)" }}/>
            <span className="text-xs font-semibold" style={{ color: isOnline ? "var(--color-purple-700)" : "var(--color-muted)" }}>
              {isOnline ? "En ligne" : "Hors ligne"}
            </span>
          </div>
          <Link href="/driver/settings">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white" style={{ background: "linear-gradient(135deg, var(--color-purple-500), var(--color-purple-700))" }}><User size={20}/></div>
          </Link>
        </div>
      </div>

      {/* Online Toggle */}
      <div className="px-6 mb-4">
        <button
          onClick={handleOnlineToggle}
          className="w-full py-4 rounded-2xl font-semibold text-base transition-all duration-300 relative overflow-hidden"
          style={{
            background: isOnline ? "linear-gradient(135deg, var(--color-purple-500), var(--color-purple-700))" : "linear-gradient(135deg, var(--color-rose-500), var(--color-rose-700))",
            color: "white",
            boxShadow: isOnline ? "var(--shadow-emerald)" : "var(--shadow-rose)",
          }}>
          {isOnline ? "En ligne — Touchez pour passer hors ligne" : "Hors ligne — Touchez pour commencer"}
          {broadcasting && <div className="absolute inset-0 bg-white/10 animate-pulse pointer-events-none" />}
        </button>
      </div>

      {/* Map */}
      <div className="px-6 mb-5">
        <div className="relative w-full h-64 rounded-3xl overflow-hidden shadow-sm">
          <LiveMap center={mapCenter} zoom={13} markers={markers} routePoints={routePoints} showUserLocation={true} height="100%" borderRadius="1.5rem" />
          {isOnline && pendingRequests.length > 0 && (
            <div className="absolute top-4 right-4 z-[400] px-3 py-1.5 rounded-full text-xs font-medium bg-white shadow-md text-red-600 animate-bounce flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-red-600"/> {pendingRequests.length} demandes proches
            </div>
          )}
        </div>
      </div>

      {/* Today Stats */}
      <div className="px-6 mt-5 mb-5">
        <h2 className="font-semibold mb-3" style={{ fontFamily: "var(--font-display)" }}>Aujourd'hui</h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-3xl p-5 relative overflow-hidden" style={{ background: "linear-gradient(135deg, var(--color-purple-600), var(--color-purple-800))", boxShadow: "var(--shadow-emerald)", gridColumn: "span 2" }}>
            <div className="zellige-pattern absolute inset-0 opacity-10"/>
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="text-xs mb-1" style={{ color: "rgba(0,0,0,0.6)" }}>Gains du jour</p>
                <div className="text-4xl font-bold text-black" style={{ fontFamily: "var(--font-display)" }}>
                  {stats.earnings} <span className="text-lg">MAD</span>
                </div>
                <p className="text-xs mt-1" style={{ color: "rgba(0,0,0,0.6)" }}>{stats.trips} trajets terminés</p>
              </div>
              <div className="text-purple-600"><Coins size={48} /></div>
            </div>
          </div>

          {[
            { label: "Note", value: `4.9`, icon: <Star size={16} className="text-yellow-500 fill-current"/>, sub: "Excellent", color: "var(--color-purple-600)" },
            { label: "Acceptation", value: `${stats.acceptance}%`, sub: "Taux", color: "var(--color-purple-600)" },
          ].map(stat => (
            <div key={stat.label} className="card p-4 text-center">
              <div className="text-2xl font-bold mb-1 flex items-center justify-center gap-1" style={{ color: stat.color, fontFamily: "var(--font-display)" }}>{stat.icon} {stat.value}</div>
              <div className="text-xs" style={{ color: "var(--color-muted)" }}>{stat.sub}</div>
              <div className="text-xs font-medium mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Ride Display */}
      {activeRide && (
        <div className="px-6 mb-5">
          <div className="card-luxury p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "var(--color-purple-500)" }}/>
                <span className="text-sm font-semibold" style={{ color: "var(--color-purple-600)" }}>Trajet en cours</span>
              </div>
              <span className="text-xs font-medium text-gray-500">{activeRide.status}</span>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-rose-600" style={{ background: "rgba(225,29,72,0.1)" }}><User size={24} /></div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm">Passagère</div>
                <div className="text-xs line-clamp-1" style={{ color: "var(--color-muted)" }}>{activeRide.from_address} → {activeRide.to_address}</div>
              </div>
              <div className="ml-auto text-right flex-shrink-0">
                <div className="text-xl font-bold gradient-text" style={{ fontFamily: "var(--font-display)" }}>{activeRide.passenger_price} MAD</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button className="btn btn-sm flex items-center justify-center gap-2" style={{ background: "rgba(147,51,234,0.08)", color: "var(--color-purple-700)", border: "1px solid rgba(147,51,234,0.2)" }}>
                <MessageCircle size={16} /> Chat
              </button>
              <button onClick={() => {
                // In real app, we'd open navigation. For now, mark as completed to test flow
                getSupabaseClient().from("rides").update({ status: "completed" }).eq("id", activeRide.id).then(() => setActiveRide(null));
              }} className="btn btn-sm flex items-center justify-center gap-2" style={{ background: "rgba(225,29,72,0.08)", color: "var(--color-rose-700)", border: "1px solid rgba(225,29,72,0.2)" }}>
                <CheckCircle size={16} /> Terminer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Recent Trips */}
      <div className="px-6 mb-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold" style={{ fontFamily: "var(--font-display)" }}>Trajets récents</h2>
          <Link href="/driver/earnings" className="text-xs font-medium flex items-center gap-1" style={{ color: "var(--color-rose-600)" }}>Voir tout <ArrowRight size={12}/></Link>
        </div>
        <div className="card">
          {recentTrips.length === 0 ? (
             <div className="text-center text-sm text-gray-500 py-4">Aucun trajet récent</div>
          ) : recentTrips.map((trip, i) => (
            <div key={i} className="flex items-center gap-4 p-4 border-b last:border-0" style={{ borderColor: "var(--color-border)" }}>
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-purple-600 flex-shrink-0" style={{ background: "rgba(147,51,234,0.08)" }}><CheckCircle size={20}/></div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium line-clamp-1">{trip.from_address} → {trip.to_address}</div>
                <div className="text-xs" style={{ color: "var(--color-muted)" }}>{new Date(trip.created_at).toLocaleDateString("fr-FR")}</div>
              </div>
              <div className="text-sm font-bold flex-shrink-0" style={{ color: "var(--color-purple-600)" }}>+{trip.final_price || trip.passenger_price} MAD</div>
            </div>
          ))}
        </div>
      </div>

      {/* Incoming Request */}
      {currentRequest && !activeRide && (
        <RideRequestCard
          ride={currentRequest}
          onAccept={() => handleAcceptRide(currentRequest)}
          onDecline={() => dismissRequest(currentRequest.id)}
        />
      )}

      <SOSButton/>
      <DriverBottomNav active="home"/>
    </div>
  );
}
