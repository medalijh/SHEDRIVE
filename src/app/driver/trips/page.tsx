"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { Home, Map as MapIcon, Coins, Settings, CheckCircle, XCircle, Star, ArrowLeft } from "lucide-react";

function DriverBottomNav({ active }: { active: string }) {
  const items = [
    { href: "/driver/dashboard", icon: <Home size={24}/>, label: "Accueil",  id: "home" },
    { href: "/driver/trips",     icon: <MapIcon size={24}/>, label: "Trajets",  id: "trips" },
    { href: "/driver/earnings",  icon: <Coins size={24}/>, label: "Gains",    id: "earnings" },
    { href: "/driver/settings",  icon: <Settings size={24}/>, label: "Profil",   id: "profile" },
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
    <div className="container-app mx-auto pb-28" style={{ background: "var(--color-silver-50)", minHeight: "100vh" }}>
      {/* Tulips Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <Image src="/tulips.png" alt="" fill className="object-cover opacity-[0.03]" />
      </div>

      <div className="px-6 pt-12 pb-4">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/driver/dashboard" className="btn btn-icon-sm btn-ghost text-purple-600"><ArrowLeft size={24} /></Link>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>Mes Trajets</h1>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-5">
          {(["all", "completed", "cancelled"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className="px-4 py-2 rounded-full text-xs font-semibold transition-all"
              style={{
                background: filter === f ? "linear-gradient(135deg, var(--color-purple-500), var(--color-purple-700))" : "white",
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
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: ride.status === "completed" ? "rgba(16,185,129,0.1)" : "rgba(197,48,48,0.1)", color: ride.status === "completed" ? "var(--color-emerald-600)" : "var(--color-red-600)" }}>
                {ride.status === "completed" ? <CheckCircle size={24} /> : <XCircle size={24} />}
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
                    <div className="flex text-yellow-500">
                      {Array.from({ length: ride.driver_rating || 5 }).map((_, i) => (
                        <Star key={i} size={14} className="fill-yellow-500" />
                      ))}
                    </div>
                  )}
                  {ride.status === "cancelled" && <span className="text-red-500">Annulé</span>}
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-base font-bold" style={{ color: "var(--color-purple-700)", fontFamily: "var(--font-display)" }}>
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
