"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

function AdminSidebar({ active }: { active: string }) {
  const nav = [
    { id: "dashboard", icon: "📊", label: "Tableau de bord", href: "/admin" },
    { id: "users",     icon: "👥", label: "Utilisateurs",    href: "/admin/users" },
    { id: "drivers",   icon: "🚗", label: "Conductrices",    href: "/admin/drivers" },
    { id: "rides",     icon: "🗺️", label: "Trajets",         href: "/admin/rides" },
    { id: "analytics", icon: "📈", label: "Analytiques",     href: "/admin/analytics" },
    { id: "support",   icon: "🎫", label: "Support",         href: "/admin/support" },
    { id: "settings",  icon: "⚙️", label: "Paramètres",     href: "/admin/settings" },
  ];
  return (
    <aside className="hidden md:flex flex-col w-64 min-h-screen"
      style={{ background: "#F3F4F6", borderRight: "1px solid rgba(225,29,72,0.15)" }}>
      <div className="p-6 border-b" style={{ borderColor: "rgba(225,29,72,0.15)" }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 object-cover rounded-full border border-rose-200 overflow-hidden flex items-center justify-center bg-white flex-shrink-0"><img src="/logo.png" alt="SheDrive Logo" className="w-full h-full object-cover mix-blend-multiply scale-[1.35]" /></div>
          <div>
            <div className="text-black font-bold text-sm" style={{ fontFamily: "var(--font-display)" }}>SheDrive</div>
            <div className="text-xs" style={{ color: "rgba(225,29,72,0.7)" }}>Admin Panel</div>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-4 flex flex-col gap-1">
        {nav.map(item => (
          <Link key={item.id} href={item.href}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all"
            style={{
              background: active === item.id ? "rgba(225,29,72,0.15)" : "transparent",
              color: active === item.id ? "#E11D48" : "rgba(0,0,0,0.6)",
              borderLeft: active === item.id ? "3px solid var(--color-rose-500)" : "3px solid transparent",
            }}>
            <span>{item.icon}</span><span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}

export default function AdminRides() {
  const [rides, setRides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "completed" | "cancelled" | "in_progress" | "searching">("all");

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const res = await fetch("/api/rides?limit=100"); // Just fetch recent 100 for admin
        if (res.ok) {
          const data = await res.json();
          // We might need to fetch driver/passenger names too, but we can just display IDs or fetch a custom admin route.
          // The /api/rides route just returns rides. Let's use it as is for now.
          setRides(data.rides || []);
        }
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchRides();
  }, []);

  const filtered = filter === "all" ? rides : rides.filter(r => r.status === filter);

  const statusBadge: Record<string, { label: string; cls: string }> = {
    completed:   { label: "Terminé",    cls: "badge-success" },
    in_progress: { label: "En cours",   cls: "badge-warning" },
    searching:   { label: "Recherche",  cls: "badge-primary" },
    cancelled:   { label: "Annulé",     cls: "badge-danger" },
  };

  return (
    <div className="flex min-h-screen" style={{ background: "var(--color-silver-50)" }}>
      <AdminSidebar active="rides" />
      <main className="flex-1 overflow-auto">
        <div className="sticky top-0 z-30 px-8 py-4 flex items-center justify-between"
          style={{ background: "rgba(253,248,245,0.95)", backdropFilter: "blur(16px)", borderBottom: "1px solid var(--color-border)" }}>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>Gestion des Trajets</h1>
        </div>

        <div className="p-8 space-y-6">
          {/* Filters */}
          <div className="flex gap-2">
            {(["all", "searching", "in_progress", "completed", "cancelled"] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className="px-4 py-2 rounded-full text-xs font-semibold transition-all"
                style={{
                  background: filter === f ? "linear-gradient(135deg,var(--color-rose-500),var(--color-rose-700))" : "white",
                  color: filter === f ? "white" : "var(--color-muted)",
                  border: `1px solid ${filter === f ? "transparent" : "var(--color-border)"}`,
                }}>
                {f === "all" ? "Tous" : statusBadge[f].label}
              </button>
            ))}
          </div>

          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "var(--color-silver-50)" }}>
                  {["ID","Passagère ID","Conductrice ID","Départ","Arrivée","Prix","Statut","Date"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold" style={{ color: "var(--color-muted)", textTransform: "uppercase" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={8} className="text-center py-8 text-gray-500">Chargement...</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={8} className="text-center py-8 text-gray-500">Aucun trajet trouvé.</td></tr>
                ) : filtered.map(r => (
                  <tr key={r.id} className="border-t transition-colors hover:bg-sand-50" style={{ borderColor: "var(--color-border)" }}>
                    <td className="px-4 py-3 font-mono text-xs" style={{ color: "var(--color-muted)" }}>{r.id.slice(0, 8)}</td>
                    <td className="px-4 py-3 text-xs">{r.passenger_id?.slice(0, 8) || "Inconnu"}</td>
                    <td className="px-4 py-3 text-xs">{r.driver_id?.slice(0, 8) || "Aucune"}</td>
                    <td className="px-4 py-3 text-xs truncate max-w-[150px]">{r.from_address}</td>
                    <td className="px-4 py-3 text-xs truncate max-w-[150px]">{r.to_address}</td>
                    <td className="px-4 py-3 font-semibold" style={{ color: "var(--color-rose-700)" }}>{r.final_price || r.passenger_price} MAD</td>
                    <td className="px-4 py-3"><span className={`badge ${statusBadge[r.status]?.cls || 'badge-neutral'}`} style={{ fontSize: 10 }}>{statusBadge[r.status]?.label || r.status}</span></td>
                    <td className="px-4 py-3 text-xs" style={{ color: "var(--color-muted)" }}>
                      {new Date(r.created_at).toLocaleString("fr-FR")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
