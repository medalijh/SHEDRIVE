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
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-lg"
            style={{ background: "linear-gradient(135deg,var(--color-rose-500),var(--color-rose-700))" }}>🌹</div>
          <div>
            <div className="text-white font-bold text-sm" style={{ fontFamily: "var(--font-display)" }}>SheDrive</div>
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
              color: active === item.id ? "#E11D48" : "rgba(255,255,255,0.5)",
              borderLeft: active === item.id ? "3px solid var(--color-rose-500)" : "3px solid transparent",
            }}>
            <span>{item.icon}</span><span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}

export default function AdminUsers() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "pending" | "suspended">("all");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      if (res.ok) {
        const json = await res.json();
        setData(json.users);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filtered = data.filter(u => {
    const m = filter === "all" || u.status === filter;
    const s = u.full_name?.toLowerCase().includes(search.toLowerCase()) || u.phone?.includes(search) || u.email?.toLowerCase().includes(search.toLowerCase());
    return m && s;
  });

  const statusBadge = { active: "badge-success", pending: "badge-warning", suspended: "badge-danger" };
  const statusLabel = { active: "Active", pending: "En attente", suspended: "Suspendue" };

  const suspend = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "suspended" ? "active" : "suspended";
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setData(d => d.map(u => u.id === id ? { ...u, status: newStatus } : u));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex min-h-screen" style={{ background: "var(--color-silver-50)" }}>
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
              { label: "Total", value: data.length, color: "var(--color-rose-500)" },
              { label: "Actives", value: data.filter(u => u.status === "active").length, color: "var(--color-purple-500)" },
              { label: "En attente", value: data.filter(u => u.status === "pending").length, color: "var(--color-purple-500)" },
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
                  background: filter === f ? "linear-gradient(135deg,var(--color-rose-500),var(--color-rose-700))" : "white",
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
                <tr style={{ background: "var(--color-silver-50)" }}>
                  {["ID","Nom","Email/Téléphone","Inscription","Statut","Actions"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold" style={{ color: "var(--color-muted)", textTransform: "uppercase" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} className="text-center py-8 text-gray-500">Chargement...</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-8 text-gray-500">Aucun utilisateur trouvé.</td></tr>
                ) : filtered.map(u => (
                  <tr key={u.id} className="border-t transition-colors hover:bg-sand-50" style={{ borderColor: "var(--color-border)" }}>
                    <td className="px-4 py-3 font-mono text-xs" style={{ color: "var(--color-muted)" }}>{u.id.slice(0, 8)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm" style={{ background: "rgba(225,29,72,0.1)" }}>👩</div>
                        <span className="font-medium">{u.full_name || "Anonyme"}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: "var(--color-muted)" }}>
                      <div>{u.email}</div>
                      <div>{u.phone}</div>
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: "var(--color-muted)" }}>
                      {new Date(u.created_at).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`badge ${statusBadge[u.status as keyof typeof statusBadge] || 'badge-neutral'}`} style={{ fontSize: 10 }}>
                        {statusLabel[u.status as keyof typeof statusLabel] || u.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => suspend(u.id, u.status)} className="btn btn-sm btn-outline" style={{ fontSize: 11 }}>
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
