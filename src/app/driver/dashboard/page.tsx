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

function DriverBottomNav({ active }: { active: string }) {
  const items = [
    { href: "/driver/dashboard", icon: "🏠", label: "Accueil", id: "home" },
    { href: "/driver/trips", icon: "🗺️", label: "Trajets", id: "trips" },
    { href: "/driver/earnings", icon: "💰", label: "Gains", id: "earnings" },
    { href: "/driver/settings", icon: "⚙️", label: "Profil", id: "profile" },
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
function RideRequestCard({ onAccept, onDecline }: { onAccept: () => void; onDecline: () => void }) {
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
          background: pct > 50 ? "var(--color-emerald-500)" : pct > 20 ? "var(--color-gold-400)" : "#E53E3E",
        }}/>

        <div className="p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-lg font-semibold" style={{ fontFamily: "var(--font-display)" }}>Nouvelle demande</h3>
              <p className="text-xs" style={{ color: "var(--color-muted)" }}>Répondez dans <strong>{timer}s</strong></p>
            </div>
            <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold border-4"
              style={{ borderColor: timer > 15 ? "var(--color-emerald-500)" : "#E53E3E", color: timer > 15 ? "var(--color-emerald-600)" : "#E53E3E" }}>
              {timer}
            </div>
          </div>

          <div className="card p-4 mb-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl" style={{ background: "rgba(200,149,108,0.1)" }}>👩</div>
              <div>
                <div className="text-sm font-semibold">Passagère anonyme</div>
                <div className="text-xs" style={{ color: "var(--color-muted)" }}>⭐ 4.8 · 47 trajets</div>
              </div>
              <div className="ml-auto text-right">
                <div className="text-2xl font-bold gradient-text" style={{ fontFamily: "var(--font-display)" }}>35 MAD</div>
                <div className="text-xs" style={{ color: "var(--color-muted)" }}>Offre passagère</div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {[
                { dot: "var(--color-emerald-500)", label: "CIL Anfa, Casablanca", icon: "📍" },
                { dot: "var(--color-rose-gold-500)", label: "Hay Hassani, Casablanca", icon: "🏁" },
              ].map((row, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: row.dot }}/>
                  <span className="text-sm">{row.label}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-4 mt-3 text-xs" style={{ color: "var(--color-muted)" }}>
              <span>📏 8.5 km</span>
              <span>⏱ ~22 min</span>
              <span>💵 Espèces</span>
              <span>📍 ~3 min de vous</span>
            </div>
          </div>

          {/* Bid */}
          <div className="mb-5">
            <p className="text-xs font-medium mb-2" style={{ color: "var(--color-sand-700)" }}>Votre contre-offre (optionnel)</p>
            <div className="flex gap-3">
              {[30, 35, 40].map(bid => (
                <button key={bid} className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
                  style={{ background: bid === 35 ? "linear-gradient(135deg, var(--color-rose-gold-500), var(--color-rose-gold-700))" : "var(--color-sand-100)", color: bid === 35 ? "white" : "var(--color-muted)" }}>
                  {bid} MAD
                </button>
              ))}
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

// Live Map for Driver
function DriverMap({ isOnline }: { isOnline: boolean }) {
  return (
    <div className="relative w-full h-56 sm:h-64 overflow-hidden rounded-2xl sm:rounded-none" style={{ background: "linear-gradient(135deg, #e8f5e8 0%, #c8dfc4 100%)" }}>
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 260">
        {Array.from({ length: 7 }).map((_, i) => <line key={`h${i}`} x1="0" y1={i*38} x2="400" y2={i*38} stroke="#4a7c59" strokeWidth="0.4" opacity="0.25"/>)}
        {Array.from({ length: 12 }).map((_, i) => <line key={`v${i}`} x1={i*36} y1="0" x2={i*36} y2="260" stroke="#4a7c59" strokeWidth="0.4" opacity="0.25"/>)}
        <path d="M20 200 Q100 170 200 130 Q280 100 380 60" stroke="white" strokeWidth="8" fill="none" opacity="0.7"/>
        <path d="M0 130 Q80 120 160 130 T320 125" stroke="white" strokeWidth="5" fill="none" opacity="0.5"/>
        {isOnline ? (
          <>
            <circle cx="200" cy="130" r="16" fill="var(--color-emerald-500)" opacity="0.95"/>
            <circle cx="200" cy="130" r="8" fill="white"/>
            <circle cx="200" cy="130" r="30" fill="var(--color-emerald-500)" opacity="0.15"/>
            <text x="200" y="162" textAnchor="middle" fill="var(--color-emerald-700)" fontSize="9" fontWeight="600">Vous êtes en ligne</text>
          </>
        ) : (
          <>
            <circle cx="200" cy="130" r="16" fill="var(--color-sand-400)" opacity="0.8"/>
            <circle cx="200" cy="130" r="8" fill="white"/>
            <text x="200" y="162" textAnchor="middle" fill="var(--color-sand-600)" fontSize="9">Hors ligne</text>
          </>
        )}
        {/* Nearby requests */}
        {isOnline && (
          <>
            <circle cx="120" cy="90" r="8" fill="var(--color-rose-gold-500)" opacity="0.7"/>
            <circle cx="300" cy="180" r="6" fill="var(--color-rose-gold-400)" opacity="0.5"/>
            <circle cx="340" cy="80" r="7" fill="var(--color-rose-gold-500)" opacity="0.6"/>
          </>
        )}
      </svg>
      <div className="absolute bottom-0 left-0 right-0 h-12 sm:h-16" style={{ background: "linear-gradient(to top, rgba(253,248,245,1) 0%, transparent 100%)" }}/>
      {isOnline && (
        <div className="absolute top-3 sm:top-4 right-3 sm:right-4 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-medium" style={{ background: "white", boxShadow: "var(--shadow-sm)" }}>
          🔴 {Math.floor(Math.random() * 5) + 2} demandes proches
        </div>
      )}
    </div>
  );
}

// ============================================================
// DRIVER DASHBOARD
// ============================================================
export default function DriverDashboard() {
  const [isOnline, setIsOnline] = useState(false);
  const [showRequest, setShowRequest] = useState(false);
  const [rideAccepted, setRideAccepted] = useState(false);

  useEffect(() => {
    if (!isOnline) return;
    const timer = setTimeout(() => setShowRequest(true), 4000);
    return () => clearTimeout(timer);
  }, [isOnline]);

  const todayStats = {
    trips: 5,
    earnings: 187,
    hours: "6h 30min",
    rating: 4.9,
    acceptance: 92,
  };

  return (
    <div className="container-app mx-auto pb-28" style={{ background: "var(--color-sand-50)", minHeight: "100vh" }}>
      {/* Header */}
      <div className="px-4 sm:px-6 pt-10 sm:pt-12 pb-3 sm:pb-4 flex items-center justify-between">
        <div>
          <p className="text-xs sm:text-sm" style={{ color: "var(--color-muted)" }}>Bonjour 👋</p>
          <h1 className="text-xl sm:text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>Khadija M.</h1>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full"
            style={{ background: isOnline ? "rgba(13,122,74,0.1)" : "var(--color-sand-100)", border: `1px solid ${isOnline ? "rgba(13,122,74,0.3)" : "var(--color-border)"}` }}>
            <div className="w-2 h-2 rounded-full" style={{ background: isOnline ? "var(--color-emerald-500)" : "var(--color-sand-400)" }}/>
            <span className="text-xs font-semibold" style={{ color: isOnline ? "var(--color-emerald-700)" : "var(--color-muted)" }}>
              {isOnline ? "En ligne" : "Hors ligne"}
            </span>
          </div>
          <Link href="/driver/settings">
            <div className="w-9 sm:w-10 h-9 sm:h-10 rounded-full flex items-center justify-center text-lg sm:text-xl"
              style={{ background: "linear-gradient(135deg, var(--color-emerald-500), var(--color-emerald-700))" }}>
              👩
            </div>
          </Link>
        </div>
      </div>

      {/* Online Toggle */}
      <div className="px-4 sm:px-6 mb-3 sm:mb-4">
        <button
          onClick={() => { setIsOnline(!isOnline); if (isOnline) setShowRequest(false); setRideAccepted(false); }}
          className="w-full py-3 sm:py-4 rounded-xl sm:rounded-2xl font-semibold text-xs sm:text-base transition-all duration-300"
          style={{
            background: isOnline
              ? "linear-gradient(135deg, var(--color-emerald-500), var(--color-emerald-700))"
              : "linear-gradient(135deg, var(--color-rose-gold-500), var(--color-rose-gold-700))",
            color: "white",
            boxShadow: isOnline ? "var(--shadow-emerald)" : "var(--shadow-rose)",
          }}>
          {isOnline ? "🟢 En ligne — Touchez pour passer hors ligne" : "🔴 Hors ligne — Touchez pour commencer"}
        </button>
      </div>

      {/* Map */}
      <div className="px-0 sm:px-6 mb-3 sm:mb-5">
        <DriverMap isOnline={isOnline}/>
      </div>

      {/* Today Stats */}
      <div className="px-4 sm:px-6 mt-3 sm:mt-5 mb-4 sm:mb-5">
        <h2 className="font-semibold mb-2 sm:mb-3 text-sm sm:text-base" style={{ fontFamily: "var(--font-display)" }}>Aujourd'hui</h2>
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          <div className="rounded-2xl sm:rounded-3xl p-4 sm:p-5 relative overflow-hidden"
            style={{ background: "linear-gradient(135deg, var(--color-emerald-600), var(--color-emerald-800))", boxShadow: "var(--shadow-emerald)", gridColumn: "span 2" }}>
            <div className="zellige-pattern absolute inset-0 opacity-10"/>
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="text-xs mb-1" style={{ color: "rgba(255,255,255,0.6)" }}>Gains du jour</p>
                <div className="text-3xl sm:text-4xl font-bold text-white" style={{ fontFamily: "var(--font-display)" }}>
                  {todayStats.earnings} <span className="text-sm sm:text-lg">MAD</span>
                </div>
                <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.5)" }}>{todayStats.trips} trajets · {todayStats.hours}</p>
              </div>
              <div className="text-3xl sm:text-5xl">💰</div>
            </div>
          </div>

          {[
            { label: "Note", value: `⭐ ${todayStats.rating}`, sub: "Excellent", color: "var(--color-gold-600)" },
            { label: "Acceptation", value: `${todayStats.acceptance}%`, sub: "Taux", color: "var(--color-emerald-600)" },
          ].map(stat => (
            <div key={stat.label} className="card p-3 sm:p-4 text-center">
              <div className="text-xl sm:text-2xl font-bold mb-1" style={{ color: stat.color, fontFamily: "var(--font-display)" }}>{stat.value}</div>
              <div className="text-xs" style={{ color: "var(--color-muted)" }}>{stat.sub}</div>
              <div className="text-xs font-medium mt-0.5 sm:mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Ride Display */}
      {rideAccepted && (
        <div className="px-4 sm:px-6 mb-4 sm:mb-5">
          <div className="card-luxury p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "var(--color-emerald-500)" }}/>
              <span className="text-xs sm:text-sm font-semibold" style={{ color: "var(--color-emerald-600)" }}>Trajet en cours</span>
            </div>
            <div className="flex items-center gap-3 mb-3 sm:mb-4">
              <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-lg sm:rounded-2xl flex items-center justify-center text-lg sm:text-2xl flex-shrink-0" style={{ background: "rgba(200,149,108,0.1)" }}>👩</div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm">Passagère</div>
                <div className="text-xs" style={{ color: "var(--color-muted)" }}>CIL Anfa → Hay Hassani</div>
              </div>
              <div className="ml-auto text-right flex-shrink-0">
                <div className="text-lg sm:text-xl font-bold gradient-text" style={{ fontFamily: "var(--font-display)" }}>35 MAD</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <button className="btn btn-sm text-xs" style={{ background: "rgba(13,122,74,0.08)", color: "var(--color-emerald-700)", border: "1px solid rgba(13,122,74,0.2)" }}>
                💬 Chat
              </button>
              <Link href="/passenger/tracking" className="btn btn-sm text-xs" style={{ background: "rgba(200,149,108,0.08)", color: "var(--color-rose-gold-700)", border: "1px solid rgba(200,149,108,0.2)" }}>
                🗺️ Navigation
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Recent Trips */}
      <div className="px-4 sm:px-6 mb-4 sm:mb-5">
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <h2 className="font-semibold text-sm sm:text-base" style={{ fontFamily: "var(--font-display)" }}>Trajets récents</h2>
          <Link href="/driver/earnings" className="text-xs font-medium" style={{ color: "var(--color-rose-gold-600)" }}>Voir tout →</Link>
        </div>
        <div className="card">
          {[
            { from: "Maarif", to: "CIL Anfa", time: "14:32", amount: 35, duration: "22 min" },
            { from: "Gauthier", to: "Ain Diab", time: "12:15", amount: 40, duration: "28 min" },
            { from: "Ain Sebaa", to: "Maarif", time: "09:45", amount: 45, duration: "35 min" },
          ].map((trip, i) => (
            <div key={i} className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 border-b last:border-0" style={{ borderColor: "var(--color-border)" }}>
              <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-lg sm:rounded-2xl flex items-center justify-center text-sm sm:text-lg flex-shrink-0" style={{ background: "rgba(13,122,74,0.08)" }}>✅</div>
              <div className="flex-1 min-w-0">
                <div className="text-xs sm:text-sm font-medium truncate">{trip.from} → {trip.to}</div>
                <div className="text-xs" style={{ color: "var(--color-muted)" }}>{trip.time} · {trip.duration}</div>
              </div>
              <div className="text-xs sm:text-sm font-bold flex-shrink-0" style={{ color: "var(--color-emerald-600)" }}>+{trip.amount} MAD</div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-4 sm:px-6 mb-4">
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {[
            { icon: "📊", label: "Gains", href: "/driver/earnings" },
            { icon: "⭐", label: "Avis", href: "/driver/reviews" },
            { icon: "🎓", label: "Formation", href: "/driver/training" },
          ].map(a => (
            <Link key={a.label} href={a.href}
              className="flex flex-col items-center gap-1.5 sm:gap-2 p-3 sm:p-4 rounded-lg sm:rounded-2xl text-center"
              style={{ background: "white", border: "1px solid var(--color-border)" }}>
              <span className="text-lg sm:text-2xl">{a.icon}</span>
              <span className="text-xs font-medium" style={{ color: "var(--color-muted)" }}>{a.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Incoming Request */}
      {showRequest && !rideAccepted && (
        <RideRequestCard
          onAccept={() => { setShowRequest(false); setRideAccepted(true); }}
          onDecline={() => setShowRequest(false)}
        />
      )}

      <SOSButton/>
      <DriverBottomNav active="home"/>
    </div>
  );
}
