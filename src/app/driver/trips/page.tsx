"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/client";

function DriverBottomNav({ active }: { active: string }) {
  const items = [
    { href: "/driver/dashboard", icon: "🏠", label: "Accueil",  id: "home" },
    { href: "/driver/trips",     icon: "🗺️", label: "Trajets",  id: "trips" },
    { href: "/driver/earnings",  icon: "💰", label: "Gains",    id: "earnings" },
    { href: "/driver/settings",  icon: "⚙️", label: "Profil",   id: "profile" },
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

export default function DriverTrips() {
  const { user } = useAuth();
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "completed" | "cancelled">("all");

  useEffect(() => {
    if (!user || !isSupabaseConfigured()) return;
    const fetchTrips = async () => {
      const { data } = await getSupabaseClient()
        .from("rides")
        .select("*, passenger:profiles!passenger_id(full_name)")
        .eq("driver_id", user.id)
        .order("created_at", { ascending: false });
      
      if (data) setTrips(data);
      setLoading(false);
    };
    fetchTrips();
  }, [user]);

  const filtered = filter === "all" ? trips : trips.filter(t => t.status === filter);

  return (
    <div className="container-app mx-auto pb-28" style={{ background: "var(--color-sand-50)", minHeight: "100vh" }}>
      <div className="px-6 pt-12 pb-4">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/driver/dashboard" className="btn btn-icon-sm btn-ghost text-xl">←</Link>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>Mes Trajets</h1>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-5">
          {(["all", "completed", "cancelled"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className="px-4 py-2 rounded-full text-xs font-semibold transition-all"
              style={{
                background: filter === f ? "linear-gradient(135deg, var(--color-emerald-500), var(--color-emerald-700))" : "white",
                color: filter === f ? "white" : "var(--color-muted)",
                border: `1px solid ${filter === f ? "transparent" : "var(--color-border)"}`,
                boxShadow: filter === f ? "var(--shadow-emerald)" : "none",
              }}>
              {f === "all" ? "Tous" : f === "completed" ? "✓ Terminés" : "✕ Annulés"}
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 flex flex-col gap-4">
        {loading ? (
          <div className="text-center py-10 text-gray-500 text-sm">Chargement...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-10 text-gray-500 text-sm">Aucun trajet trouvé.</div>
        ) : filtered.map((ride) => (
          <div key={ride.id} className="card-luxury p-5 transition-all">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl flex-shrink-0"
                style={{ background: ride.status === "completed" ? "rgba(13,122,74,0.1)" : "rgba(197,48,48,0.1)" }}>
                {ride.status === "completed" ? "✅" : "❌"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold truncate">{ride.from_address} → {ride.to_address}</span>
                </div>
                <div className="text-xs mb-2" style={{ color: "var(--color-muted)" }}>
                  {new Date(ride.created_at).toLocaleDateString("fr-FR")} · Passagère: {ride.passenger?.full_name || "Inconnue"}
                </div>
                <div className="flex items-center gap-3 text-xs" style={{ color: "var(--color-muted)" }}>
                  {ride.status === "completed" && (
                    <>
                      <span>{"⭐".repeat(ride.driver_rating || 5)}</span>
                    </>
                  )}
                  {ride.status === "cancelled" && <span className="text-red-500">Annulé</span>}
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-base font-bold" style={{ color: "var(--color-emerald-700)", fontFamily: "var(--font-display)" }}>
                  +{ride.final_price || ride.passenger_price} MAD
                </div>
                <div className="text-xs mt-1" style={{ color: "var(--color-muted)" }}>#{ride.id.slice(0, 8)}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <DriverBottomNav active="trips"/>
    </div>
  );
}
