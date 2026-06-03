"use client";

import React, { useState } from "react";
import Link from "next/link";

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
      {items.map(item => (
        <Link key={item.id} href={item.href} className={`bottom-nav-item ${active === item.id ? "active" : ""}`}>
          <div className="nav-icon">{item.icon}</div>
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}

const rides = [
  { from: "Maarif", to: "CIL Anfa", date: "02 Juin 2025", time: "14:32", price: 35, driver: "Khadija M.", rating: 5, status: "completed", distance: "8.5 km", duration: "22 min", id: "RD-8823" },
  { from: "Casa-Voyageurs", to: "Sidi Bernoussi", date: "01 Juin 2025", time: "09:15", price: 28, driver: "Amina B.", rating: 5, status: "completed", distance: "6.2 km", duration: "18 min", id: "RD-8754" },
  { from: "Ain Diab", to: "Hay Hassani", date: "31 Mai 2025", time: "20:44", price: 42, driver: "Fatima Z.", rating: 4, status: "completed", distance: "11 km", duration: "31 min", id: "RD-8721" },
  { from: "Maarif", to: "Gauthier", date: "30 Mai 2025", time: "13:05", price: 20, driver: "Sara H.", rating: 5, status: "completed", distance: "3.5 km", duration: "12 min", id: "RD-8689" },
  { from: "Ain Sebaa", to: "Maarif", date: "28 Mai 2025", time: "08:30", price: 0, driver: "Nadia K.", rating: 3, status: "cancelled", distance: "-", duration: "-", id: "RD-8651" },
];

export default function HistoryPage() {
  const [selectedRide, setSelectedRide] = useState<typeof rides[0] | null>(null);
  const [filter, setFilter] = useState<"all" | "completed" | "cancelled">("all");

  const filtered = filter === "all" ? rides : rides.filter(r => r.status === filter);

  return (
    <div className="container-app mx-auto pb-28" style={{ background: "var(--color-sand-50)", minHeight: "100vh" }}>
      <div className="px-6 pt-12 pb-4">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/passenger/dashboard" className="btn btn-icon-sm btn-ghost text-xl">←</Link>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>Historique des Trajets</h1>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: "Trajets", value: "24", icon: "🚗" },
            { label: "km parcourus", value: "187", icon: "📏" },
            { label: "MAD dépensés", value: "672", icon: "💳" },
          ].map(s => (
            <div key={s.label} className="p-3 rounded-2xl text-center" style={{ background: "white", border: "1px solid var(--color-border)" }}>
              <div className="text-lg mb-0.5">{s.icon}</div>
              <div className="text-sm font-bold" style={{ color: "var(--color-rose-gold-700)" }}>{s.value}</div>
              <div className="text-xs" style={{ color: "var(--color-muted)" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-5">
          {(["all", "completed", "cancelled"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className="px-4 py-2 rounded-full text-xs font-semibold transition-all"
              style={{
                background: filter === f ? "linear-gradient(135deg, var(--color-rose-gold-500), var(--color-rose-gold-700))" : "white",
                color: filter === f ? "white" : "var(--color-muted)",
                border: `1px solid ${filter === f ? "transparent" : "var(--color-border)"}`,
                boxShadow: filter === f ? "var(--shadow-rose)" : "none",
              }}>
              {f === "all" ? "Tous" : f === "completed" ? "✓ Terminés" : "✕ Annulés"}
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 flex flex-col gap-4">
        {filtered.map((ride) => (
          <div key={ride.id} className="card-luxury p-5 cursor-pointer transition-all hover:scale-[1.01]"
            onClick={() => setSelectedRide(ride)}>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl flex-shrink-0"
                style={{
                  background: ride.status === "completed" ? "rgba(13,122,74,0.1)" : "rgba(197,48,48,0.1)",
                }}>
                {ride.status === "completed" ? "✅" : "❌"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold">{ride.from} → {ride.to}</span>
                </div>
                <div className="text-xs mb-2" style={{ color: "var(--color-muted)" }}>
                  {ride.date} · {ride.time} · {ride.driver}
                </div>
                <div className="flex items-center gap-3 text-xs" style={{ color: "var(--color-muted)" }}>
                  {ride.status === "completed" && (
                    <>
                      <span>📏 {ride.distance}</span>
                      <span>⏱ {ride.duration}</span>
                      <span>{"⭐".repeat(ride.rating)}</span>
                    </>
                  )}
                  {ride.status === "cancelled" && <span className="text-red-500">Annulé</span>}
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                {ride.price > 0 ? (
                  <div className="text-base font-bold" style={{ color: "var(--color-rose-gold-700)", fontFamily: "var(--font-display)" }}>
                    {ride.price} MAD
                  </div>
                ) : (
                  <span className="badge badge-neutral" style={{ fontSize: 10 }}>—</span>
                )}
                <div className="text-xs mt-1" style={{ color: "var(--color-muted)" }}>#{ride.id}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Ride Detail Modal */}
      {selectedRide && (
        <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }} onClick={() => setSelectedRide(null)}>
          <div className="w-full max-w-md bg-white rounded-t-3xl p-6 pb-10" onClick={e => e.stopPropagation()}>
            <div className="w-10 h-1 rounded-full mx-auto mb-6" style={{ background: "var(--color-sand-300)" }}/>
            <h3 className="text-lg font-semibold mb-5" style={{ fontFamily: "var(--font-display)" }}>
              Détails du trajet {selectedRide.id}
            </h3>

            <div className="flex flex-col gap-4 mb-6">
              {[
                { icon: "🟢", label: "Départ", value: selectedRide.from },
                { icon: "🔴", label: "Arrivée", value: selectedRide.to },
                { icon: "📅", label: "Date", value: `${selectedRide.date} · ${selectedRide.time}` },
                { icon: "👩", label: "Conductrice", value: selectedRide.driver },
                { icon: "📏", label: "Distance", value: selectedRide.distance },
                { icon: "⏱", label: "Durée", value: selectedRide.duration },
                { icon: "💳", label: "Prix payé", value: `${selectedRide.price} MAD` },
              ].map(row => (
                <div key={row.label} className="flex items-center gap-3">
                  <span className="text-base">{row.icon}</span>
                  <div className="flex-1">
                    <span className="text-xs" style={{ color: "var(--color-muted)" }}>{row.label}: </span>
                    <span className="text-sm font-medium">{row.value}</span>
                  </div>
                </div>
              ))}
            </div>

            {selectedRide.status === "completed" && (
              <div className="flex gap-3">
                <button className="btn btn-outline flex-1">📞 Recontacter</button>
                <Link href="/passenger/book" className="btn btn-primary flex-1">🔄 Trajet similaire</Link>
              </div>
            )}
          </div>
        </div>
      )}

      <BottomNav active="history"/>
    </div>
  );
}
