"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

function SOSButton() {
  const [pressed, setPressed] = useState(false);
  const [countdown, setCountdown] = useState(3);
  useEffect(() => {
    if (!pressed) return;
    if (countdown === 0) { alert("🆘 SOS Envoyé!"); setPressed(false); setCountdown(3); return; }
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

// Live Tracking Map
function TrackingMap({ progress }: { progress: number }) {
  return (
    <div className="relative w-full h-72 overflow-hidden"
      style={{ background: "linear-gradient(135deg, #e8f5e8 0%, #c8dfc4 100%)" }}>
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 300">
        {/* Grid */}
        {Array.from({ length: 8 }).map((_, i) => <line key={`h${i}`} x1="0" y1={i*40} x2="400" y2={i*40} stroke="#4a7c59" strokeWidth="0.4" opacity="0.3"/>)}
        {Array.from({ length: 12 }).map((_, i) => <line key={`v${i}`} x1={i*36} y1="0" x2={i*36} y2="300" stroke="#4a7c59" strokeWidth="0.4" opacity="0.3"/>)}
        {/* Roads */}
        <path d="M20 200 Q80 180 160 170 Q240 160 320 140 Q360 130 380 90" stroke="white" strokeWidth="8" fill="none" opacity="0.8"/>
        <path d="M20 200 Q80 180 160 170 Q240 160 320 140 Q360 130 380 90" stroke="var(--color-rose-gold-400)" strokeWidth="3" fill="none" opacity="0.7" strokeDasharray="12 4"/>
        {/* Pickup (destination) */}
        <circle cx="380" cy="90" r="12" fill="var(--color-emerald-500)" opacity="0.9"/>
        <circle cx="380" cy="90" r="7" fill="white"/>
        <text x="380" y="75" textAnchor="middle" fill="var(--color-emerald-700)" fontSize="10" fontWeight="600">Arrivée</text>
        {/* Animated driver position */}
        <circle
          cx={20 + (360 * progress / 100)}
          cy={200 - (110 * progress / 100)}
          r="14"
          fill="var(--color-rose-gold-500)"
          opacity="0.95"
        />
        <circle
          cx={20 + (360 * progress / 100)}
          cy={200 - (110 * progress / 100)}
          r="7"
          fill="white"
        />
        <circle
          cx={20 + (360 * progress / 100)}
          cy={200 - (110 * progress / 100)}
          r="25"
          fill="var(--color-rose-gold-500)"
          opacity="0.1"
        />
        {/* Passenger */}
        <circle cx="20" cy="200" r="10" fill="var(--color-sand-600)" opacity="0.7"/>
        <circle cx="20" cy="200" r="5" fill="white"/>
      </svg>

      {/* Overlay gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-20"
        style={{ background: "linear-gradient(to top, rgba(253,248,245,1) 0%, transparent 100%)" }}/>

      {/* ETA Badge */}
      <div className="absolute top-4 right-4 px-4 py-2 rounded-2xl shadow-lg"
        style={{ background: "white" }}>
        <div className="text-xs font-medium" style={{ color: "var(--color-muted)" }}>Arrivée dans</div>
        <div className="text-xl font-bold" style={{ color: "var(--color-rose-gold-700)", fontFamily: "var(--font-display)" }}>
          {Math.max(1, Math.round(8 * (1 - progress / 100)))} min
        </div>
      </div>
    </div>
  );
}

// ============================================================
// TRACKING PAGE
// ============================================================
export default function TrackingPage() {
  const [progress, setProgress] = useState(15);
  const [status, setStatus] = useState<"arriving" | "arrived" | "in_ride" | "completed">("arriving");
  const [shareOpen, setShareOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "driver", text: "Je suis en route, j'arrive dans ~7 minutes 🌸", time: "14:32" },
    { from: "driver", text: "Je porte un hijab vert, voiture blanche Logan", time: "14:33" },
  ]);
  const [newMsg, setNewMsg] = useState("");

  // Simulate driver movement
  useEffect(() => {
    if (status !== "arriving" && status !== "in_ride") return;
    const interval = setInterval(() => {
      setProgress(p => {
        const next = p + 2;
        if (next >= 100) {
          setStatus("completed");
          clearInterval(interval);
          return 100;
        }
        if (next >= 50 && status === "arriving") setStatus("in_ride");
        return next;
      });
    }, 800);
    return () => clearInterval(interval);
  }, [status]);

  const statusConfig = {
    arriving: { label: "Conductrice en route", labelAr: "السائقة في الطريق", color: "var(--color-gold-600)", bg: "rgba(212,160,23,0.1)", icon: "🚗" },
    arrived: { label: "Conductrice arrivée !", labelAr: "وصلت السائقة!", color: "var(--color-emerald-600)", bg: "rgba(13,122,74,0.1)", icon: "📍" },
    in_ride: { label: "Trajet en cours", labelAr: "الرحلة جارية", color: "var(--color-rose-gold-600)", bg: "rgba(200,149,108,0.1)", icon: "🌹" },
    completed: { label: "Trajet terminé !", labelAr: "انتهت الرحلة!", color: "var(--color-emerald-600)", bg: "rgba(13,122,74,0.1)", icon: "✅" },
  };
  const sc = statusConfig[status];

  return (
    <div className="container-app mx-auto" style={{ background: "var(--color-sand-50)", minHeight: "100vh" }}>
      {/* Back */}
      <div className="absolute top-4 left-4 z-30">
        <Link href="/passenger/dashboard" className="btn btn-icon glass shadow-sm text-xl">←</Link>
      </div>

      {/* Map */}
      <TrackingMap progress={progress}/>

      {/* Status Banner */}
      <div className="px-6 -mt-4 relative z-10">
        <div className="rounded-2xl p-4 flex items-center gap-4 shadow-md"
          style={{ background: sc.bg, border: `1px solid ${sc.color}33` }}>
          <span className="text-2xl">{sc.icon}</span>
          <div>
            <div className="font-semibold text-sm" style={{ color: sc.color }}>{sc.label}</div>
            <div className="text-xs mt-0.5" style={{ fontFamily: "var(--font-arabic)", direction: "rtl", color: "var(--color-muted)" }}>{sc.labelAr}</div>
          </div>
          {(status === "arriving" || status === "in_ride") && (
            <div className="ml-auto flex items-center gap-1">
              {[1,2,3].map(i => (
                <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: sc.color, animation: `online-pulse ${0.4 + i * 0.2}s ease-in-out infinite` }}/>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      {status !== "completed" && (
        <div className="px-6 mt-4">
          <div className="flex items-center justify-between text-xs mb-2" style={{ color: "var(--color-muted)" }}>
            <span>🟢 Départ</span>
            <span>🔴 Arrivée</span>
          </div>
          <div className="h-2 rounded-full" style={{ background: "var(--color-sand-200)" }}>
            <div className="h-full rounded-full transition-all duration-700"
              style={{ width: `${progress}%`, background: "linear-gradient(90deg, var(--color-emerald-500), var(--color-rose-gold-500))" }}/>
          </div>
        </div>
      )}

      {/* Driver Card */}
      <div className="px-6 mt-5">
        <div className="card-luxury p-5">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
                style={{ background: "linear-gradient(135deg, rgba(200,149,108,0.15), rgba(200,149,108,0.05))" }}>
                👩
              </div>
              <div className="online-dot absolute -bottom-1 -right-1"/>
            </div>
            <div className="flex-1">
              <div className="font-semibold">Khadija M.</div>
              <div className="text-xs mt-0.5" style={{ color: "var(--color-muted)" }}>⭐ 4.9 · 847 trajets · 🚗 Logan Gris</div>
              <div className="text-xs mt-0.5" style={{ color: "var(--color-muted)" }}>🔢 34521 · A</div>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold gradient-text" style={{ fontFamily: "var(--font-display)" }}>30 MAD</div>
              <div className="text-xs mt-1" style={{ color: "var(--color-muted)" }}>Espèces</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-3">
            <button onClick={() => setChatOpen(true)}
              className="flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all hover:scale-105"
              style={{ background: "rgba(200,149,108,0.08)", border: "1px solid rgba(200,149,108,0.2)" }}>
              <span className="text-xl">💬</span>
              <span className="text-xs font-medium">Chat</span>
            </button>
            <a href="tel:+212600000000"
              className="flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all hover:scale-105 cursor-pointer"
              style={{ background: "rgba(13,122,74,0.08)", border: "1px solid rgba(13,122,74,0.2)" }}>
              <span className="text-xl">📞</span>
              <span className="text-xs font-medium">Appeler</span>
            </a>
            <button onClick={() => setShareOpen(true)}
              className="flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all hover:scale-105"
              style={{ background: "rgba(212,160,23,0.08)", border: "1px solid rgba(212,160,23,0.2)" }}>
              <span className="text-xl">🔗</span>
              <span className="text-xs font-medium">Partager</span>
            </button>
          </div>
        </div>
      </div>

      {/* Completed: Rating */}
      {status === "completed" && (
        <div className="px-6 mt-5">
          <div className="card-luxury p-6 text-center">
            <div className="text-5xl mb-4">🌹</div>
            <h3 className="text-xl font-semibold mb-2" style={{ fontFamily: "var(--font-display)" }}>
              Bonne arrivée ! Comment était votre trajet ?
            </h3>
            <div className="flex justify-center gap-3 my-6">
              {[1,2,3,4,5].map(star => (
                <button key={star} className="text-4xl transition-transform hover:scale-125">⭐</button>
              ))}
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
            <p className="text-sm mb-5" style={{ color: "var(--color-muted)" }}>
              Partagez ce lien avec vos proches pour qu'ils puissent suivre votre trajet en temps réel.
            </p>
            <div className="flex items-center gap-3 p-3 rounded-xl mb-5" style={{ background: "var(--color-sand-100)" }}>
              <span className="text-sm flex-1 truncate" style={{ color: "var(--color-muted)" }}>https://track.shedrive.ma/abc123...</span>
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
                <div className="font-semibold text-sm">Khadija M.</div>
                <div className="text-xs" style={{ color: "var(--color-emerald-600)" }}>En ligne</div>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.from === "passenger" ? "justify-end" : "justify-start"}`}>
                <div className="max-w-[75%] px-4 py-3 rounded-2xl"
                  style={{
                    background: msg.from === "passenger" ? "linear-gradient(135deg, var(--color-rose-gold-500), var(--color-rose-gold-700))" : "white",
                    color: msg.from === "passenger" ? "white" : "var(--color-text)",
                    boxShadow: "var(--shadow-xs)",
                  }}>
                  <p className="text-sm">{msg.text}</p>
                  <p className="text-xs mt-1 opacity-60">{msg.time}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="px-4 py-3 flex gap-3" style={{ background: "white", borderTop: "1px solid var(--color-border)" }}>
            <button className="btn btn-icon-sm" style={{ background: "var(--color-sand-100)" }}>🎙</button>
            <input value={newMsg} onChange={e => setNewMsg(e.target.value)}
              className="flex-1 input-field py-3 text-sm" placeholder="Tapez un message..."
              onKeyDown={e => {
                if (e.key === "Enter" && newMsg.trim()) {
                  setMessages(m => [...m, { from: "passenger", text: newMsg, time: new Date().toLocaleTimeString("fr-MA", { hour: "2-digit", minute: "2-digit" }) }]);
                  setNewMsg("");
                }
              }}/>
            <button onClick={() => {
              if (newMsg.trim()) {
                setMessages(m => [...m, { from: "passenger", text: newMsg, time: new Date().toLocaleTimeString("fr-MA", { hour: "2-digit", minute: "2-digit" }) }]);
                setNewMsg("");
              }
            }} className="btn btn-icon btn-primary">→</button>
          </div>
        </div>
      )}

      <SOSButton />
    </div>
  );
}
