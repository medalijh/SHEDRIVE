"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// ─── Sidebar ────────────────────────────────────────────────
function AdminSidebar({ active }: { active: string }) {
  const nav = [
    { id: "dashboard",  icon: "📊", label: "Tableau de bord" },
    { id: "users",      icon: "👥", label: "Utilisateurs" },
    { id: "drivers",    icon: "🚗", label: "Conductrices" },
    { id: "rides",      icon: "🗺️", label: "Trajets" },
    { id: "payments",   icon: "💳", label: "Paiements" },
    { id: "analytics",  icon: "📈", label: "Analytiques" },
    { id: "support",    icon: "🎫", label: "Support" },
    { id: "settings",   icon: "⚙️", label: "Paramètres" },
  ];
  return (
    <aside className="hidden md:flex flex-col w-64 min-h-screen"
      style={{ background: "#F3F4F6", borderRight: "1px solid rgba(225,29,72,0.15)" }}>
      <div className="p-6 border-b" style={{ borderColor: "rgba(225,29,72,0.15)" }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-lg"
            style={{ background: "linear-gradient(135deg,var(--color-rose-500),var(--color-rose-700))" }}>
            🌹
          </div>
          <div>
            <div className="text-white font-bold text-sm" style={{ fontFamily: "var(--font-display)" }}>SheDrive</div>
            <div className="text-xs" style={{ color: "rgba(225,29,72,0.7)" }}>Admin Panel</div>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-4 flex flex-col gap-1">
        {nav.map(item => (
          <Link key={item.id} href={`/admin/${item.id === "dashboard" ? "" : item.id}`}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200"
            style={{
              background: active === item.id ? "rgba(225,29,72,0.15)" : "transparent",
              color: active === item.id ? "#E11D48" : "rgba(255,255,255,0.5)",
              borderLeft: active === item.id ? "3px solid var(--color-rose-500)" : "3px solid transparent",
            }}>
            <span className="text-base">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t" style={{ borderColor: "rgba(225,29,72,0.15)" }}>
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
            style={{ background: "rgba(225,29,72,0.15)" }}>👩‍💼</div>
          <div>
            <div className="text-xs text-white font-medium">Admin Principal</div>
            <div className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>admin@shedrive.ma</div>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 w-full text-xs rounded-lg mt-1 transition-colors hover:bg-white/5"
          style={{ color: "rgba(255,255,255,0.3)" }}
          onClick={async () => { 
            if (confirm("Déconnecter ?")) {
              await fetch("/api/auth/logout", { method: "POST" });
              window.location.href = "/auth/login"; 
            }
          }}>
          🚪 Déconnexion
        </button>
      </div>
    </aside>
  );
}

// ─── Stat Card ───────────────────────────────────────────────
function StatCard({ icon, label, value, sub, color, trend }: {
  icon: string; label: string; value: string; sub?: string; color: string; trend?: string;
}) {
  return (
    <div className="card p-5 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 rounded-full -translate-y-6 translate-x-6"
        style={{ background: `${color}08` }} />
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl"
            style={{ background: `${color}12` }}>{icon}</div>
          {trend && (
            <span className="text-xs font-semibold px-2 py-1 rounded-full"
              style={{ background: trend.startsWith("+") ? "rgba(147,51,234,0.1)" : "rgba(229,62,62,0.1)", color: trend.startsWith("+") ? "var(--color-purple-600)" : "#E53E3E" }}>
              {trend}
            </span>
          )}
        </div>
        <div className="text-2xl font-bold mb-1" style={{ fontFamily: "var(--font-display)", color }}>{value}</div>
        <div className="text-sm font-medium">{label}</div>
        {sub && <div className="text-xs mt-1" style={{ color: "var(--color-muted)" }}>{sub}</div>}
      </div>
    </div>
  );
}

// ─── ADMIN DASHBOARD ─────────────────────────────────────────
export default function AdminDashboard() {
  const [statsData, setStatsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then(res => res.json())
      .then(data => {
        if (!data.error) setStatsData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const stats = [
    { icon: "👥", label: "Utilisatrices", value: statsData?.passengers?.toString() || "0",  sub: "comptes passagers",   color: "var(--color-rose-500)",  trend: undefined },
    { icon: "🚗", label: "Conductrices",  value: statsData?.drivers?.toString() || "0",    sub: "comptes chauffeurs", color: "var(--color-purple-500)",  trend: undefined },
    { icon: "🗺️", label: "Trajets totaux", value: statsData?.rides?.toString() || "0", sub: "tous les statuts",          color: "var(--color-purple-500)",      trend: undefined },
    { icon: "💰", label: "Revenus totaux", value: (statsData?.revenue || 0).toLocaleString() + " MAD", sub: "net après commissions",   color: "var(--color-rose-500)", trend: undefined },
  ];

  return (
    <div className="flex min-h-screen" style={{ background: "var(--color-silver-50)" }}>
      <AdminSidebar active="dashboard" />

      <main className="flex-1 overflow-auto">
        <div className="sticky top-0 z-30 px-8 py-4 flex items-center justify-between"
          style={{ background: "rgba(253,248,245,0.95)", backdropFilter: "blur(16px)", borderBottom: "1px solid var(--color-border)" }}>
          <div>
            <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>Tableau de bord</h1>
            <p className="text-xs mt-0.5" style={{ color: "var(--color-muted)" }}>
              {new Date().toLocaleDateString("fr-MA", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 rounded-full flex items-center gap-2"
              style={{ background: "rgba(147,51,234,0.08)", border: "1px solid rgba(147,51,234,0.2)" }}>
              <div className="w-2 h-2 rounded-full" style={{ background: "var(--color-purple-500)", animation: "online-pulse 2s infinite" }}/>
              <span className="text-xs font-medium" style={{ color: "var(--color-purple-700)" }}>Système opérationnel</span>
            </div>
            <button className="btn btn-icon" style={{ background: "var(--color-silver-100)", position: "relative" }}>
              🔔
            </button>
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-base"
              style={{ background: "linear-gradient(135deg, var(--color-rose-500), var(--color-rose-700))" }}>
              👩‍💼
            </div>
          </div>
        </div>

        <div className="p-8 space-y-8">
          {loading ? (
            <div className="text-center py-20 text-gray-500 text-lg">Chargement des statistiques...</div>
          ) : (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map(s => <StatCard key={s.label} {...s} />)}
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: "👥", label: "Gérer les utilisateurs", href: "/admin/users", color: "var(--color-rose-500)" },
                  { icon: "🚗", label: "Approuver conductrices", href: "/admin/drivers", color: "var(--color-purple-500)" },
                ].map(a => (
                  <Link key={a.label} href={a.href}
                    className="card p-5 flex flex-col items-center text-center gap-3 transition-all hover:scale-[1.02] hover:shadow-md">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                      style={{ background: `${a.color}10` }}>{a.icon}</div>
                    <span className="text-sm font-medium">{a.label}</span>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
