"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { useRealtimeTracking } from "@/hooks/useRealtimeTracking";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { MapMarker } from "@/components/Map";

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
      alert("🆘 SOS Envoyé!");
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
            <div className="text-6xl mb-4">🆘</div>
            <h3 className="text-2xl font-bold text-red-700 mb-2">Alerte SOS</h3>
            <p className="text-gray-600 mb-6">Envoi dans <strong>{countdown}</strong>s...</p>
            <button onClick={() => { setPressed(false); setCountdown(3); }} className="btn btn-outline w-full" style={{ borderColor: "#E53E3E", color: "#E53E3E" }}>✕ Annuler</button>
          </div>
        </div>
      )}
      <button className="sos-button" onClick={() => setPressed(true)} aria-label="SOS"><span className="font-bold">SOS</span><span style={{ fontSize: 10 }}>🆘</span></button>
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
    searching: { label: "Recherche en cours", labelAr: "جاري البحث", color: "var(--color-gold-600)", bg: "rgba(212,160,23,0.1)", icon: "🔍" },
    accepted: { label: "Conductrice en route", labelAr: "السائقة في الطريق", color: "var(--color-gold-600)", bg: "rgba(212,160,23,0.1)", icon: "🚗" },
    driver_arrived: { label: "Conductrice arrivée !", labelAr: "وصلت السائقة!", color: "var(--color-emerald-600)", bg: "rgba(13,122,74,0.1)", icon: "📍" },
    in_progress: { label: "Trajet en cours", labelAr: "الرحلة جارية", color: "var(--color-rose-gold-600)", bg: "rgba(200,149,108,0.1)", icon: "🌹" },
    completed: { label: "Trajet terminé !", labelAr: "انتهت الرحلة!", color: "var(--color-emerald-600)", bg: "rgba(13,122,74,0.1)", icon: "✅" },
    cancelled: { label: "Trajet annulé", labelAr: "تم الإلغاء", color: "#E53E3E", bg: "rgba(229,62,62,0.1)", icon: "❌" },
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
    <div className="container-app mx-auto" style={{ background: "var(--color-sand-50)", minHeight: "100vh" }}>
      {/* Back */}
      <div className="absolute top-4 left-4 z-30">
        <Link href="/passenger/dashboard" className="btn btn-icon glass shadow-sm text-xl">←</Link>
      </div>

      {/* Map */}
      <div className="relative w-full h-72">
        <LiveMap center={mapCenter} zoom={15} markers={markers} height="100%" borderRadius="0" />
      </div>

      {/* Status Banner */}
      <div className="px-6 -mt-4 relative z-10">
        <div className="rounded-2xl p-4 flex items-center gap-4 shadow-md" style={{ background: sc.bg, border: `1px solid ${sc.color}33` }}>
          <span className="text-2xl">{sc.icon}</span>
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
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl" style={{ background: "linear-gradient(135deg, rgba(200,149,108,0.15), rgba(200,149,108,0.05))" }}>👩</div>
                <div className="online-dot absolute -bottom-1 -right-1"/>
              </div>
              <div className="flex-1">
                <div className="font-semibold">{ride.driver.profiles?.full_name || "Conductrice"}</div>
                <div className="text-xs mt-0.5" style={{ color: "var(--color-muted)" }}>⭐ 4.9 · 🚗 {ride.driver.vehicle_model}</div>
                <div className="text-xs mt-0.5" style={{ color: "var(--color-muted)" }}>🔢 {ride.driver.vehicle_plate}</div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold gradient-text" style={{ fontFamily: "var(--font-display)" }}>{ride.passenger_price} MAD</div>
                <div className="text-xs mt-1" style={{ color: "var(--color-muted)" }}>{ride.payment_method === "cash" ? "Espèces" : "Wallet"}</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <button onClick={() => setChatOpen(true)} className="flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all hover:scale-105" style={{ background: "rgba(200,149,108,0.08)", border: "1px solid rgba(200,149,108,0.2)" }}>
                <span className="text-xl">💬</span>
                <span className="text-xs font-medium">Chat</span>
              </button>
              <a href={`tel:${ride.driver.profiles?.phone || ""}`} className="flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all hover:scale-105 cursor-pointer" style={{ background: "rgba(13,122,74,0.08)", border: "1px solid rgba(13,122,74,0.2)" }}>
                <span className="text-xl">📞</span>
                <span className="text-xs font-medium">Appeler</span>
              </a>
              <button onClick={() => setShareOpen(true)} className="flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all hover:scale-105" style={{ background: "rgba(212,160,23,0.08)", border: "1px solid rgba(212,160,23,0.2)" }}>
                <span className="text-xl">🔗</span>
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
            <div className="text-5xl mb-4">🌹</div>
            <h3 className="text-xl font-semibold mb-2" style={{ fontFamily: "var(--font-display)" }}>Bonne arrivée ! Comment était votre trajet ?</h3>
            <div className="flex justify-center gap-3 my-6">
              {[1,2,3,4,5].map(star => <button key={star} className="text-4xl transition-transform hover:scale-125">⭐</button>)}
            </div>
            <textarea className="input-field text-sm mb-4" rows={2} placeholder="Laissez un commentaire (optionnel)..." />
            <Link href="/passenger/dashboard" className="btn btn-primary w-full">Terminer →</Link>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {shareOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ background: "rgba(0,0,0,0.5)" }} onClick={() => setShareOpen(false)}>
          <div className="w-full max-w-md bg-white rounded-t-3xl p-6" onClick={e => e.stopPropagation()}>
            <div className="w-10 h-1 rounded-full mx-auto mb-5" style={{ background: "var(--color-sand-300)" }}/>
            <h3 className="font-semibold text-lg mb-2" style={{ fontFamily: "var(--font-display)" }}>Partager ma position</h3>
            <div className="flex items-center gap-3 p-3 rounded-xl mb-5" style={{ background: "var(--color-sand-100)" }}>
              <span className="text-sm flex-1 truncate" style={{ color: "var(--color-muted)" }}>https://track.shedrive.ma/{rideId}</span>
              <button className="btn btn-sm btn-primary">Copier</button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[{ icon: "📱", label: "WhatsApp" }, { icon: "💬", label: "SMS" }, { icon: "📧", label: "Email" }].map(s => (
                <button key={s.label} className="p-3 rounded-xl text-center" style={{ background: "var(--color-sand-100)" }}>
                  <div className="text-2xl mb-1">{s.icon}</div>
                  <div className="text-xs">{s.label}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Chat Modal */}
      {chatOpen && (
        <div className="fixed inset-0 z-50 flex flex-col" style={{ background: "var(--color-sand-50)" }}>
          <div className="flex items-center gap-4 px-5 py-4" style={{ background: "white", borderBottom: "1px solid var(--color-border)" }}>
            <button onClick={() => setChatOpen(false)} className="btn btn-icon-sm btn-ghost text-xl">←</button>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-lg" style={{ background: "rgba(200,149,108,0.1)" }}>👩</div>
              <div>
                <div className="font-semibold text-sm">{ride?.driver?.profiles?.full_name || "Conductrice"}</div>
                <div className="text-xs" style={{ color: "var(--color-emerald-600)" }}>En ligne</div>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.from === "passenger" ? "justify-end" : "justify-start"}`}>
                <div className="max-w-[75%] px-4 py-3 rounded-2xl" style={{ background: msg.from === "passenger" ? "linear-gradient(135deg, var(--color-rose-gold-500), var(--color-rose-gold-700))" : "white", color: msg.from === "passenger" ? "white" : "var(--color-text)", boxShadow: "var(--shadow-xs)" }}>
                  <p className="text-sm">{msg.text}</p>
                  <p className="text-xs mt-1 opacity-60">{msg.time}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="px-4 py-3 flex gap-3" style={{ background: "white", borderTop: "1px solid var(--color-border)" }}>
            <button className="btn btn-icon-sm" style={{ background: "var(--color-sand-100)" }}>🎙</button>
            <input value={newMsg} onChange={e => setNewMsg(e.target.value)} className="flex-1 input-field py-3 text-sm" placeholder="Tapez un message..." onKeyDown={e => {
              if (e.key === "Enter" && newMsg.trim()) { setMessages(m => [...m, { from: "passenger", text: newMsg, time: new Date().toLocaleTimeString("fr-MA", { hour: "2-digit", minute: "2-digit" }) }]); setNewMsg(""); }
            }}/>
            <button onClick={() => {
              if (newMsg.trim()) { setMessages(m => [...m, { from: "passenger", text: newMsg, time: new Date().toLocaleTimeString("fr-MA", { hour: "2-digit", minute: "2-digit" }) }]); setNewMsg(""); }
            }} className="btn btn-icon btn-primary">→</button>
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
