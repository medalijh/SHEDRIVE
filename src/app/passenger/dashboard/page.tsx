"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRealTimeNotifications, useRealTimeDrivers } from "@/hooks/useRealTime";
import { Bell, MapPin, Phone, Star, Clock, DollarSign } from "lucide-react";

// SOS Button Component
function SOSButton() {
  const [pressed, setPressed] = useState(false);
  const [countdown, setCountdown] = useState(3);

  const handleSOS = () => {
    setPressed(true);
    setCountdown(3);
  };

  useEffect(() => {
    if (!pressed) return;
    if (countdown === 0) {
      alert("🆘 ALERTE SOS ENVOYÉE!\n\nVotre position a été partagée avec:\n• Votre contact d'urgence\n• L'équipe SheDrive\n\nSoyez forte, l'aide est en route. 💪");
      setPressed(false);
      setCountdown(3);
      return;
    }
    const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [pressed, countdown]);

  return (
    <>
      {pressed && (
        <div className="fixed inset-0 bg-red-900/80 z-[998] flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full mx-6 text-center">
            <div className="text-6xl mb-4 animate-pulse">🆘</div>
            <h3 className="text-2xl font-bold text-red-700 mb-2">Alerte SOS</h3>
            <p className="text-gray-600 mb-6">L'alerte sera envoyée dans <strong>{countdown}</strong> secondes...</p>
            <button
              onClick={() => { setPressed(false); setCountdown(3); }}
              className="btn btn-outline w-full"
              style={{ borderColor: "#E53E3E", color: "#E53E3E" }}
            >
              ✕ Annuler
            </button>
          </div>
        </div>
      )}
      <button
        className="sos-button no-print"
        onClick={handleSOS}
        aria-label="Bouton SOS d'urgence"
        title="Appuyer en cas d'urgence"
      >
        <span className="text-base font-bold">SOS</span>
        <span style={{ fontSize: "10px" }}>🆘</span>
      </button>
    </>
  );
}

// Bottom Navigation
function BottomNav({ active }: { active: string }) {
  const items = [
    { href: "/passenger/dashboard", icon: "🏠", label: "Accueil", id: "home" },
    { href: "/passenger/book", icon: "🚗", label: "Réserver", id: "book" },
    { href: "/passenger/history", icon: "🕐", label: "Historique", id: "history" },
    { href: "/passenger/wallet", icon: "💳", label: "Wallet", id: "wallet" },
    { href: "/passenger/settings", icon: "⚙️", label: "Profil", id: "profile" },
  ];

  return (
    <nav className="bottom-nav">
      {items.map((item) => (
        <Link key={item.id} href={item.href} className={`bottom-nav-item ${active === item.id ? "active" : ""}`}>
          <div className="nav-icon">{item.icon}</div>
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}

// Live Map Mock
function LiveMap() {
  return (
    <div className="relative w-full h-56 sm:h-72 rounded-2xl sm:rounded-3xl overflow-hidden"
      style={{ background: "linear-gradient(135deg, #e8f5e8 0%, #d4e8d0 30%, #c8dfc4 60%, #b8d4b4 100%)" }}>
      {/* Map grid lines (mock) */}
      <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 400 300">
        {Array.from({ length: 8 }).map((_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 40} x2="400" y2={i * 40} stroke="#4a7c59" strokeWidth="0.5" />
        ))}
        {Array.from({ length: 12 }).map((_, i) => (
          <line key={`v${i}`} x1={i * 36} y1="0" x2={i * 36} y2="300" stroke="#4a7c59" strokeWidth="0.5" />
        ))}
        {/* Roads */}
        <path d="M0 150 Q100 140 200 150 T400 145" stroke="#ffffff" strokeWidth="6" fill="none" opacity="0.7"/>
        <path d="M180 0 Q190 75 200 150 T210 300" stroke="#ffffff" strokeWidth="5" fill="none" opacity="0.6"/>
        <path d="M0 80 Q80 70 160 85 T320 80" stroke="#ffffff" strokeWidth="4" fill="none" opacity="0.5"/>
        {/* Location pin */}
        <circle cx="200" cy="150" r="12" fill="var(--color-rose-gold-500)" opacity="0.9"/>
        <circle cx="200" cy="150" r="6" fill="white"/>
        <circle cx="200" cy="150" r="25" fill="var(--color-rose-gold-500)" opacity="0.15" className="animate-ping"/>
      </svg>

      {/* Map overlay gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-16 sm:h-24"
        style={{ background: "linear-gradient(to top, rgba(253,248,245,1) 0%, transparent 100%)" }} />

      {/* Map controls */}
      <div className="absolute top-3 sm:top-4 right-3 sm:right-4 flex flex-col gap-1.5 sm:gap-2">
        {["+", "−", "🎯"].map((ctrl) => (
          <button key={ctrl} className="w-8 sm:w-10 h-8 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center font-bold shadow-md text-xs sm:text-sm"
            style={{ background: "white", color: "var(--color-text)", boxShadow: "var(--shadow-sm)" }}>
            {ctrl}
          </button>
        ))}
      </div>

      {/* Location badge */}
      <div className="absolute bottom-4 sm:bottom-6 left-3 sm:left-4 flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full"
        style={{ background: "white", boxShadow: "var(--shadow-sm)" }}>
        <span className="online-dot" />
        <span className="text-xs sm:text-sm font-medium">Casablanca · Maarif</span>
      </div>
    </div>
  );
}

// Quick Book Widget
function QuickBookWidget() {
  const router = useRouter();
  return (
    <div className="card-luxury p-4 sm:p-5">
      <div className="flex items-center gap-2 mb-3 sm:mb-4">
        <span className="text-lg sm:text-xl">🚗</span>
        <h3 className="font-semibold text-sm sm:text-base" style={{ fontFamily: "var(--font-display)" }}>
          Où souhaitez-vous aller ?
        </h3>
      </div>

      <div className="flex flex-col gap-2 sm:gap-3 mb-3 sm:mb-4">
        {/* Pickup */}
        <div className="flex items-center gap-3 p-2.5 sm:p-3 rounded-lg sm:rounded-xl" style={{ background: "rgba(13,122,74,0.06)", border: "1px solid rgba(13,122,74,0.15)" }}>
          <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: "var(--color-emerald-500)" }} />
          <input
            className="flex-1 bg-transparent outline-none text-xs sm:text-sm"
            placeholder="Votre position actuelle"
            style={{ color: "var(--color-text)" }}
          />
          <span style={{ color: "var(--color-emerald-600)", fontSize: "1rem" }}>📍</span>
        </div>

        {/* Dotted line */}
        <div className="ml-[18px] flex flex-col gap-1">
          {[1, 2].map((i) => <div key={i} className="w-0.5 h-1 rounded-full ml-[4px]" style={{ background: "var(--color-sand-300)" }} />)}
        </div>

        {/* Dropoff */}
        <div className="flex items-center gap-3 p-2.5 sm:p-3 rounded-lg sm:rounded-xl" style={{ background: "rgba(200,149,108,0.06)", border: "1px solid rgba(200,149,108,0.15)" }}>
          <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: "var(--color-rose-gold-500)" }} />
          <input
            className="flex-1 bg-transparent outline-none text-xs sm:text-sm"
            placeholder="Entrez votre destination"
            style={{ color: "var(--color-text)" }}
          />
          <span style={{ color: "var(--color-rose-gold-500)", fontSize: "1rem" }}>🔍</span>
        </div>
      </div>

      <button
        onClick={() => router.push("/passenger/book")}
        className="btn btn-primary w-full text-xs sm:text-sm"
      >
        🌹 Trouver une conductrice
      </button>
    </div>
  );
}

// Recent Rides
function RecentRides() {
  const rides = [
    { from: "Maarif", to: "CIL Anfa", date: "Aujourd'hui", price: "35 MAD", status: "completed", driver: "Khadija M.", rating: 5 },
    { from: "Casa-Voyageurs", to: "Sidi Bernoussi", date: "Hier", price: "28 MAD", status: "completed", driver: "Amina B.", rating: 5 },
    { from: "Ain Sebaa", to: "Hay Hassani", date: "Dim. 01 Juin", price: "42 MAD", status: "completed", driver: "Fatima Z.", rating: 4 },
  ];

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold" style={{ fontFamily: "var(--font-display)" }}>Trajets récents</h3>
        <Link href="/passenger/history" className="text-xs font-medium" style={{ color: "var(--color-rose-gold-600)" }}>
          Voir tout →
        </Link>
      </div>
      <div className="flex flex-col gap-4">
        {rides.map((ride, i) => (
          <div key={i} className="flex items-center gap-4 py-3 border-b last:border-0" style={{ borderColor: "var(--color-border)" }}>
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-lg flex-shrink-0"
              style={{ background: "rgba(200,149,108,0.1)" }}>
              🚗
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">
                {ride.from} → {ride.to}
              </div>
              <div className="text-xs mt-1 flex items-center gap-2" style={{ color: "var(--color-muted)" }}>
                <span>{ride.date}</span>
                <span>·</span>
                <span>{ride.driver}</span>
                <span>·</span>
                <span>{"⭐".repeat(ride.rating)}</span>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-sm font-semibold" style={{ color: "var(--color-rose-gold-700)" }}>{ride.price}</div>
              <span className="badge badge-success mt-1" style={{ fontSize: "10px" }}>✓</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Wallet Quick View
function WalletCard() {
  return (
    <div className="rounded-3xl p-5 relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, var(--color-emerald-600) 0%, var(--color-emerald-800) 100%)",
        boxShadow: "var(--shadow-emerald)",
      }}>
      <div className="zellige-pattern absolute inset-0 opacity-10" />
      <div className="relative z-10 flex items-start justify-between mb-6">
        <div>
          <p className="text-xs mb-1" style={{ color: "rgba(255,255,255,0.6)" }}>Solde Wallet</p>
          <div className="text-3xl font-bold text-white" style={{ fontFamily: "var(--font-display)" }}>
            150,00 <span className="text-lg">MAD</span>
          </div>
        </div>
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
          style={{ background: "rgba(255,255,255,0.15)" }}>
          💳
        </div>
      </div>
      <div className="relative z-10 flex gap-3">
        <Link href="/passenger/wallet" className="btn btn-sm flex-1"
          style={{ background: "rgba(255,255,255,0.2)", color: "white", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.3)" }}>
          Recharger
        </Link>
        <Link href="/passenger/history" className="btn btn-sm flex-1"
          style={{ background: "rgba(255,255,255,0.1)", color: "white", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.2)" }}>
          Historique
        </Link>
      </div>
    </div>
  );
}

// ============================================================
// PASSENGER DASHBOARD
// ============================================================
export default function PassengerDashboard() {
  const [greeting, setGreeting] = useState("Bonjour");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Bonjour");
    else if (hour < 18) setGreeting("Bon après-midi");
    else setGreeting("Bonsoir");
  }, []);

  return (
    <div className="container-app mx-auto pb-24">
      {/* Header */}
      <div className="p-4 sm:p-6 pt-10 sm:pt-12">
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-xs sm:text-sm" style={{ color: "var(--color-muted)" }}>{greeting} 👋</p>
            <h1 className="text-xl sm:text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
              Fatima Zahra
            </h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/passenger/notifications" className="btn btn-icon btn-icon-sm"
              style={{ background: "var(--color-sand-100)" }}>
              <span className="text-lg sm:text-xl relative">
                🔔
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500" />
              </span>
            </Link>
            <Link href="/passenger/settings">
              <div className="w-9 sm:w-11 h-9 sm:h-11 rounded-full flex items-center justify-center text-lg sm:text-xl"
                style={{ background: "linear-gradient(135deg, var(--color-rose-gold-400), var(--color-rose-gold-600))" }}>
                👩
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="px-4 sm:px-6 mb-4 sm:mb-6">
        <LiveMap />
      </div>

      {/* Quick Book */}
      <div className="px-4 sm:px-6 mb-4 sm:mb-6">
        <QuickBookWidget />
      </div>

      {/* Wallet */}
      <div className="px-4 sm:px-6 mb-4 sm:mb-6">
        <WalletCard />
      </div>

      {/* Quick Actions */}
      <div className="px-4 sm:px-6 mb-4 sm:mb-6">
        <div className="grid grid-cols-4 gap-2 sm:gap-3">
          {[
            { icon: "📍", label: "Récents", href: "/passenger/history" },
            { icon: "💬", label: "Messages", href: "/passenger/messages" },
            { icon: "🎁", label: "Coupons", href: "/passenger/coupons" },
            { icon: "⭐", label: "Favoris", href: "/passenger/favorites" },
          ].map((action) => (
            <Link key={action.label} href={action.href}
              className="flex flex-col items-center gap-1.5 sm:gap-2 p-2.5 sm:p-4 rounded-lg sm:rounded-2xl text-center transition-all duration-200 hover:scale-105"
              style={{ background: "white", border: "1px solid var(--color-border)", boxShadow: "var(--shadow-xs)" }}>
              <span className="text-lg sm:text-2xl">{action.icon}</span>
              <span className="text-xs font-medium" style={{ color: "var(--color-muted)" }}>{action.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Rides */}
      <div className="px-4 sm:px-6 mb-4 sm:mb-6">
        <RecentRides />
      </div>

      {/* Safety Card */}
      <div className="px-4 sm:px-6 mb-6">
        <div className="rounded-2xl sm:rounded-3xl p-4 sm:p-5"
          style={{ background: "linear-gradient(135deg, rgba(197,48,48,0.08), rgba(197,48,48,0.04))", border: "1px solid rgba(197,48,48,0.2)" }}>
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-lg sm:rounded-2xl flex items-center justify-center text-lg sm:text-2xl flex-shrink-0"
              style={{ background: "rgba(197,48,48,0.12)" }}>
              🛡️
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-xs sm:text-sm mb-0.5 sm:mb-1">Sécurité & Contacts d'urgence</h3>
              <p className="text-xs" style={{ color: "var(--color-muted)" }}>
                Ajoutez vos contacts de confiance pour que le bouton SOS fonctionne
              </p>
            </div>
            <Link href="/passenger/settings#safety" className="btn btn-sm btn-outline flex-shrink-0 text-xs"
              style={{ borderColor: "rgba(197,48,48,0.3)", color: "#C53030" }}>
              Configurer
            </Link>
          </div>
        </div>
      </div>

      <SOSButton />
      <BottomNav active="home" />
    </div>
  );
}
