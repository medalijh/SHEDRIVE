"use client";

import React, { useState } from "react";
import Link from "next/link";

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
      style={{ background: "#0D0A07", borderRight: "1px solid rgba(200,149,108,0.15)" }}>
      <div className="p-6 border-b" style={{ borderColor: "rgba(200,149,108,0.15)" }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-lg"
            style={{ background: "linear-gradient(135deg,var(--color-rose-gold-500),var(--color-rose-gold-700))" }}>🌹</div>
          <div>
            <div className="text-white font-bold text-sm" style={{ fontFamily: "var(--font-display)" }}>SheDrive</div>
            <div className="text-xs" style={{ color: "rgba(200,149,108,0.7)" }}>Admin Panel</div>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-4 flex flex-col gap-1">
        {nav.map(item => (
          <Link key={item.id} href={item.href}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all"
            style={{
              background: active === item.id ? "rgba(200,149,108,0.15)" : "transparent",
              color: active === item.id ? "#C8956C" : "rgba(255,255,255,0.5)",
              borderLeft: active === item.id ? "3px solid var(--color-rose-gold-500)" : "3px solid transparent",
            }}>
            <span>{item.icon}</span><span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}

const users = [
  { id: "USR-4821", name: "Fatima Z. Bennani", phone: "+212 6XX XXX 01", city: "Casablanca", joined: "2025-03-12", rides: 24, rating: 5.0, status: "active",    verified: true },
  { id: "USR-4820", name: "Asmaa Rachidi",     phone: "+212 6XX XXX 02", city: "Rabat",      joined: "2025-04-01", rides: 11, rating: 4.8, status: "active",    verified: true },
  { id: "USR-4819", name: "Nadia El Khoury",   phone: "+212 6XX XXX 03", city: "Marrakech",  joined: "2025-05-15", rides: 3,  rating: 5.0, status: "active",    verified: false },
  { id: "USR-4818", name: "Houda Benali",      phone: "+212 6XX XXX 04", city: "Fès",        joined: "2025-05-28", rides: 0,  rating: 0,   status: "pending",   verified: false },
  { id: "USR-4817", name: "Layla Tahiri",      phone: "+212 6XX XXX 05", city: "Casablanca", joined: "2025-02-10", rides: 47, rating: 4.7, status: "suspended", verified: true },
];

export default function AdminUsers() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "pending" | "suspended">("all");
  const [data, setData] = useState(users);

  const filtered = data.filter(u => {
    const m = filter === "all" || u.status === filter;
    const s = u.name.toLowerCase().includes(search.toLowerCase()) || u.phone.includes(search);
    return m && s;
  });

  const statusBadge = { active: "badge-success", pending: "badge-warning", suspended: "badge-danger" };
  const statusLabel = { active: "Active", pending: "En attente", suspended: "Suspendue" };

  const suspend = (id: string) => setData(d => d.map(u => u.id === id ? { ...u, status: u.status === "suspended" ? "active" : "suspended" } : u));

  return (
    <div className="flex min-h-screen" style={{ background: "var(--color-sand-50)" }}>
      <AdminSidebar active="users" />
      <main className="flex-1 overflow-auto">
        <div className="sticky top-0 z-30 px-8 py-4 flex items-center justify-between"
          style={{ background: "rgba(253,248,245,0.95)", backdropFilter: "blur(16px)", borderBottom: "1px solid var(--color-border)" }}>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>Gestion des Utilisatrices</h1>
          <input className="input-field py-2 text-sm w-64" placeholder="🔍 Nom ou téléphone..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        <div className="p-8 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: "Total", value: data.length, color: "var(--color-rose-gold-500)" },
              { label: "Actives", value: data.filter(u => u.status === "active").length, color: "var(--color-emerald-500)" },
              { label: "En attente", value: data.filter(u => u.status === "pending").length, color: "var(--color-gold-500)" },
              { label: "Suspendues", value: data.filter(u => u.status === "suspended").length, color: "#E53E3E" },
            ].map(s => (
              <div key={s.label} className="card p-5 text-center">
                <div className="text-3xl font-bold mb-1" style={{ fontFamily: "var(--font-display)", color: s.color }}>{s.value}</div>
                <div className="text-sm" style={{ color: "var(--color-muted)" }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            {(["all","active","pending","suspended"] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className="px-4 py-2 rounded-full text-xs font-semibold transition-all"
                style={{
                  background: filter === f ? "linear-gradient(135deg,var(--color-rose-gold-500),var(--color-rose-gold-700))" : "white",
                  color: filter === f ? "white" : "var(--color-muted)",
                  border: `1px solid ${filter === f ? "transparent" : "var(--color-border)"}`,
                }}>
                {f === "all" ? "Toutes" : statusLabel[f]}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "var(--color-sand-50)" }}>
                  {["ID","Nom","Téléphone","Ville","Inscription","Trajets","Note","Vérifié","Statut","Actions"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold" style={{ color: "var(--color-muted)", textTransform: "uppercase" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(u => (
                  <tr key={u.id} className="border-t transition-colors hover:bg-sand-50" style={{ borderColor: "var(--color-border)" }}>
                    <td className="px-4 py-3 font-mono text-xs" style={{ color: "var(--color-muted)" }}>{u.id}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm" style={{ background: "rgba(200,149,108,0.1)" }}>👩</div>
                        <span className="font-medium">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: "var(--color-muted)" }}>{u.phone}</td>
                    <td className="px-4 py-3 text-xs">{u.city}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: "var(--color-muted)" }}>{u.joined}</td>
                    <td className="px-4 py-3 font-medium text-center">{u.rides}</td>
                    <td className="px-4 py-3 text-xs">{u.rating ? `⭐ ${u.rating}` : "—"}</td>
                    <td className="px-4 py-3 text-center">
                      {u.verified ? <span style={{ color: "var(--color-emerald-500)" }}>✓</span> : <span style={{ color: "var(--color-sand-300)" }}>—</span>}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`badge ${statusBadge[u.status as keyof typeof statusBadge]}`} style={{ fontSize: 10 }}>
                        {statusLabel[u.status as keyof typeof statusLabel]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => suspend(u.id)} className="btn btn-sm btn-outline" style={{ fontSize: 11 }}>
                        {u.status === "suspended" ? "Réactiver" : "Suspendre"}
                      </button>
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
