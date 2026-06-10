"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { useRealtimeTracking } from "@/hooks/useRealtimeTracking";
import { useAuth } from "@/hooks/useAuth";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { MapMarker } from "@/components/Map";
import { useToastStore } from "@/store/useToastStore";
import { ShieldAlert, Search, Car, MapPin, CheckCircle, XCircle, User, Star, Hash, MessageCircle, Phone, Link as LinkIcon, Smartphone, Mail, Mic, Send, HeartHandshake } from "lucide-react";

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
      useToastStore.getState().addToast("🆘 SOS Envoyé avec succès !", "warning");
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
            <button onClick={() => { setPressed(false); setCountdown(3); }} className="btn btn-outline w-full" style={{ borderColor: "#E53E3E", color: "#E53E3E" }}>✕ Annuler</button>
          </div>
        </div>
      )}
      <button className="sos-button" onClick={() => setPressed(true)} aria-label="SOS"><span className="font-bold flex items-center gap-1"><ShieldAlert size={18} /> SOS</span></button>
    </>
  );
}

function TrackingContent() {
  const searchParams = useSearchParams();
  const rideId = searchParams.get("id");
  const router = useRouter();

  const [ride, setRide] = useState<any>(null);
  const { driverLocation, rideStatus } = useRealtimeTracking(rideId);

  const [shareOpen, setShareOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "driver", text: "Je suis en route, j'arrive bientôt 🌸", time: new Date().toLocaleTimeString("fr-MA", { hour: "2-digit", minute: "2-digit" }) },
  ]);
  const [newMsg, setNewMsg] = useState("");
  const [routePoints, setRoutePoints] = useState<[number, number][]>([]);

  useEffect(() => {
    if (ride) {
      const currentStatus = rideStatus || ride.status || "searching";
      const isAccepted = currentStatus === "accepted";
      const isInProgress = currentStatus === "in_progress";
      
      const destLat = isAccepted ? ride.from_lat : (isInProgress ? ride.to_lat : ride.to_lat);
      const destLng = isAccepted ? ride.from_lng : (isInProgress ? ride.to_lng : ride.to_lng);
      
      const startLat = (isAccepted || isInProgress) && driverLocation ? driverLocation.lat : ride.from_lat;
      const startLng = (isAccepted || isInProgress) && driverLocation ? driverLocation.lng : ride.from_lng;

      if (startLat && startLng && destLat && destLng) {
        import("@/lib/mapUtils").then(({ getRoute }) => {
          getRoute(startLat, startLng, destLat, destLng).then(res => {
            if (res) {
              setRoutePoints(res.geometry.coordinates.map((c: any) => [c[1], c[0]]));
            }
          });
        });
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rideStatus, ride?.id]);

  useEffect(() => {
    if (!rideId || !isSupabaseConfigured()) return;
    getSupabaseClient()
      .from("rides")
      .select("*, driver:drivers(vehicle_model, vehicle_plate, profiles(full_name, phone))")
      .eq("id", rideId)
      .single()
      .then(({ data }) => {
        if (data) setRide(data);
      });
  }, [rideId]);

  const currentStatus = rideStatus || ride?.status || "searching";

  const statusConfig: Record<string, any> = {
    searching: { label: "Recherche en cours", labelAr: "جاري البحث", color: "var(--color-purple-600)", bg: "rgba(219,39,119,0.1)", icon: <Search size={24} /> },
    accepted: { label: "Conductrice en route", labelAr: "السائقة في الطريق", color: "var(--color-purple-600)", bg: "rgba(219,39,119,0.1)", icon: <Car size={24} /> },
    driver_arrived: { label: "Conductrice arrivée !", labelAr: "وصلت السائقة!", color: "var(--color-purple-600)", bg: "rgba(147,51,234,0.1)", icon: <MapPin size={24} /> },
    in_progress: { label: "Trajet en cours", labelAr: "الرحلة جارية", color: "var(--color-rose-600)", bg: "rgba(225,29,72,0.1)", icon: <HeartHandshake size={24} /> },
    completed: { label: "Trajet terminé !", labelAr: "انتهت الرحلة!", color: "var(--color-purple-600)", bg: "rgba(147,51,234,0.1)", icon: <CheckCircle size={24} /> },
    cancelled: { label: "Trajet annulé", labelAr: "تم الإلغاء", color: "#E53E3E", bg: "rgba(229,62,62,0.1)", icon: <XCircle size={24} /> },
  };

  const sc = statusConfig[currentStatus] || statusConfig.searching;

  let markers: MapMarker[] = [];
  if (ride) {
    markers.push({ id: "pickup", position: [ride.from_lat, ride.from_lng], type: "pickup", popup: "Départ" });
    markers.push({ id: "dropoff", position: [ride.to_lat, ride.to_lng], type: "dropoff", popup: "Arrivée" });
  }
  if (driverLocation) {
    markers.push({ id: "driver", position: [driverLocation.lat, driverLocation.lng], type: "driver-active", popup: "Votre conductrice" });
  }

  const mapCenter: [number, number] = driverLocation ? [driverLocation.lat, driverLocation.lng] : (ride ? [ride.from_lat, ride.from_lng] : [33.5731, -7.5898]);

  return (
    <div className="container-app mx-auto" style={{ background: "var(--color-silver-50)", minHeight: "100vh" }}>
      {/* Back */}
      <div className="absolute top-4 left-4 z-30">
        <Link href="/passenger/dashboard" className="btn btn-icon glass shadow-sm text-xl">←</Link>
      </div>

      {/* Map */}
      <div className="relative w-full h-72">
        <LiveMap center={mapCenter} zoom={15} markers={markers} routePoints={routePoints} height="100%" borderRadius="0" />
      </div>

      {/* Status Banner */}
      <div className="px-6 -mt-4 relative z-10">
        <div className="rounded-2xl p-4 flex items-center gap-4 shadow-md" style={{ background: sc.bg, border: `1px solid ${sc.color}33` }}>
          <span className="text-purple-600" style={{ color: sc.color }}>{sc.icon}</span>
          <div>
            <div className="font-semibold text-sm" style={{ color: sc.color }}>{sc.label}</div>
            <div className="text-xs mt-0.5" style={{ fontFamily: "var(--font-arabic)", direction: "rtl", color: "var(--color-muted)" }}>{sc.labelAr}</div>
          </div>
          {(currentStatus === "accepted" || currentStatus === "in_progress") && (
            <div className="ml-auto flex items-center gap-1">
              {[1,2,3].map(i => (
                <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: sc.color, animation: `online-pulse ${0.4 + i * 0.2}s ease-in-out infinite` }}/>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Driver Card */}
      {ride?.driver && (
        <div className="px-6 mt-5">
          <div className="card-luxury p-5">
            <div className="flex items-center gap-4 mb-4">
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-rose-600" style={{ background: "linear-gradient(135deg, rgba(225,29,72,0.15), rgba(225,29,72,0.05))" }}><User size={32} /></div>
                <div className="online-dot absolute -bottom-1 -right-1"/>
              </div>
              <div className="flex-1">
                <div className="font-semibold">{ride.driver.profiles?.full_name || "Conductrice"}</div>
                <div className="text-xs mt-0.5 flex items-center gap-1" style={{ color: "var(--color-muted)" }}><Star size={12} className="text-yellow-500 fill-current"/> 4.9 · <Car size={12}/> {ride.driver.vehicle_model}</div>
                <div className="text-xs mt-0.5 flex items-center gap-1" style={{ color: "var(--color-muted)" }}><Hash size={12}/> {ride.driver.vehicle_plate}</div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold gradient-text" style={{ fontFamily: "var(--font-display)" }}>{ride.passenger_price} MAD</div>
                <div className="text-xs mt-1" style={{ color: "var(--color-muted)" }}>{ride.payment_method === "cash" ? "Espèces" : "Wallet"}</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <button onClick={() => setChatOpen(true)} className="flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all hover:scale-105" style={{ background: "rgba(225,29,72,0.08)", border: "1px solid rgba(225,29,72,0.2)", color: "var(--color-rose-600)" }}>
                <MessageCircle size={24} />
                <span className="text-xs font-medium">Chat</span>
              </button>
              <a href={`tel:${ride.driver.profiles?.phone || ""}`} className="flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all hover:scale-105 cursor-pointer" style={{ background: "rgba(147,51,234,0.08)", border: "1px solid rgba(147,51,234,0.2)", color: "var(--color-purple-600)" }}>
                <Phone size={24} />
                <span className="text-xs font-medium">Appeler</span>
              </a>
              <button onClick={() => setShareOpen(true)} className="flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all hover:scale-105" style={{ background: "rgba(219,39,119,0.08)", border: "1px solid rgba(219,39,119,0.2)", color: "var(--color-purple-700)" }}>
                <LinkIcon size={24} />
                <span className="text-xs font-medium">Partager</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Completed: Rating */}
      {currentStatus === "completed" && (
        <div className="px-6 mt-5">
          <div className="card-luxury p-6 text-center">
            <div className="flex justify-center text-rose-500 mb-4"><HeartHandshake size={48} /></div>
            <h3 className="text-xl font-semibold mb-2" style={{ fontFamily: "var(--font-display)" }}>Bonne arrivée ! Comment était votre trajet ?</h3>
            <div className="flex justify-center gap-3 my-6">
              {[1,2,3,4,5].map(star => <button key={star} className="text-gray-300 transition-transform hover:scale-125 focus:text-yellow-500 focus:fill-yellow-500"><Star size={36} className="fill-current"/></button>)}
            </div>
            <textarea className="input-field text-sm mb-4" rows={2} placeholder="Laissez un commentaire (optionnel)..." />
            <Link href="/passenger/dashboard" className="btn btn-primary w-full">Terminer →</Link>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {shareOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(6px)" }} onClick={() => setShareOpen(false)}>
          <div className="w-full max-w-md bg-white rounded-t-3xl p-6" onClick={e => e.stopPropagation()}>
            <div className="w-10 h-1 rounded-full mx-auto mb-5" style={{ background: "var(--color-silver-300)" }}/>
            <h3 className="font-semibold text-lg mb-2" style={{ fontFamily: "var(--font-display)" }}>Partager ma position</h3>
            <div className="flex items-center gap-3 p-3 rounded-xl mb-5" style={{ background: "var(--color-silver-100)" }}>
              <span className="text-sm flex-1 truncate" style={{ color: "var(--color-muted)" }}>https://track.shedrive.ma/{rideId}</span>
              <button className="btn btn-sm btn-primary">Copier</button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[{ icon: <Smartphone size={24}/>, label: "WhatsApp" }, { icon: <MessageCircle size={24}/>, label: "SMS" }, { icon: <Mail size={24}/>, label: "Email" }].map(s => (
                <button key={s.label} className="p-3 rounded-xl text-center flex flex-col items-center text-purple-600" style={{ background: "var(--color-silver-100)" }}>
                  <div className="mb-1">{s.icon}</div>
                  <div className="text-xs text-black">{s.label}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Chat Modal */}
      {chatOpen && (
        <div className="fixed inset-0 z-50 flex flex-col" style={{ background: "var(--color-silver-50)" }}>
          <div className="flex items-center gap-4 px-5 py-4" style={{ background: "white", borderBottom: "1px solid var(--color-border)" }}>
            <button onClick={() => setChatOpen(false)} className="btn btn-icon-sm btn-ghost text-xl">←</button>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 object-cover rounded-full border border-rose-200 overflow-hidden flex items-center justify-center bg-white flex-shrink-0"><img src="/logo.png" alt="SheDrive Logo" className="w-full h-full object-cover mix-blend-multiply scale-[1.35]" /></div>
              <div>
                <div className="font-semibold text-sm">{ride?.driver?.profiles?.full_name || "Conductrice"}</div>
                <div className="text-xs" style={{ color: "var(--color-purple-600)" }}>En ligne</div>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.from === "passenger" ? "justify-end" : "justify-start"}`}>
                <div className="max-w-[75%] px-4 py-3 rounded-2xl" style={{ background: msg.from === "passenger" ? "linear-gradient(135deg, var(--color-rose-500), var(--color-rose-700))" : "white", color: msg.from === "passenger" ? "white" : "var(--color-text)", boxShadow: "var(--shadow-xs)" }}>
                  <p className="text-sm">{msg.text}</p>
                  <p className="text-xs mt-1 opacity-60">{msg.time}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="px-4 py-3 flex gap-3 items-center" style={{ background: "white", borderTop: "1px solid var(--color-border)" }}>
            <button className="btn btn-icon-sm" style={{ background: "var(--color-silver-100)", color: "var(--color-muted)" }}><Mic size={18} /></button>
            <input value={newMsg} onChange={e => setNewMsg(e.target.value)} className="flex-1 input-field py-3 text-sm" placeholder="Tapez un message..." onKeyDown={e => {
              if (e.key === "Enter" && newMsg.trim()) { setMessages(m => [...m, { from: "passenger", text: newMsg, time: new Date().toLocaleTimeString("fr-MA", { hour: "2-digit", minute: "2-digit" }) }]); setNewMsg(""); }
            }}/>
            <button onClick={() => {
              if (newMsg.trim()) { setMessages(m => [...m, { from: "passenger", text: newMsg, time: new Date().toLocaleTimeString("fr-MA", { hour: "2-digit", minute: "2-digit" }) }]); setNewMsg(""); }
            }} className="btn btn-icon btn-primary flex items-center justify-center"><Send size={18} /></button>
          </div>
        </div>
      )}

      <SOSButton />
    </div>
  );
}

export default function TrackingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-sand-50" />}>
      <TrackingContent />
    </Suspense>
  );
}
