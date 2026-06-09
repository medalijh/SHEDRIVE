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

type DriverStatus = "pending" | "approved" | "rejected" | "suspended" | "all";

export default function AdminDrivers() {
  const [drivers, setDrivers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<DriverStatus>("all");
  const [selected, setSelected] = useState<any | null>(null);
  const [search, setSearch] = useState("");

  const fetchDrivers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/drivers");
      if (res.ok) {
        const data = await res.json();
        setDrivers(data.drivers);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const filtered = drivers.filter(d => {
    const matchFilter = filter === "all" || d.approval_status === filter;
    const nameMatch = d.profiles?.full_name?.toLowerCase().includes(search.toLowerCase()) || false;
    const cityMatch = d.profiles?.city?.toLowerCase().includes(search.toLowerCase()) || false;
    return matchFilter && (nameMatch || cityMatch || search === "");
  });

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/drivers/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approval_status: status })
      });
      if (res.ok) {
        setDrivers(ds => ds.map(d => d.id === id ? { ...d, approval_status: status } : d));
        setSelected(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const statusBadge: Record<string, { label: string; cls: string }> = {
    pending:   { label: "En attente", cls: "badge-warning" },
    approved:  { label: "Approuvée",  cls: "badge-success" },
    rejected:  { label: "Rejetée",    cls: "badge-danger"  },
    suspended: { label: "Suspendue",  cls: "badge-neutral"  },
  };

  const counts = {
    all:       drivers.length,
    pending:   drivers.filter(d => d.approval_status === "pending").length,
    approved:  drivers.filter(d => d.approval_status === "approved").length,
    rejected:  drivers.filter(d => d.approval_status === "rejected").length,
    suspended: drivers.filter(d => d.approval_status === "suspended").length,
  };

  return (
    <div className="flex min-h-screen" style={{ background: "var(--color-silver-50)" }}>
      <AdminSidebar active="drivers" />
      <main className="flex-1 overflow-auto">
        <div className="sticky top-0 z-30 px-8 py-4 flex items-center justify-between"
          style={{ background: "rgba(253,248,245,0.95)", backdropFilter: "blur(16px)", borderBottom: "1px solid var(--color-border)" }}>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>Gestion des Conductrices</h1>
          <div className="flex items-center gap-3">
            <input className="input-field py-2 text-sm w-64" placeholder="🔍 Rechercher..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>

        <div className="p-8 space-y-6">
          <div className="flex gap-2 flex-wrap">
            {(["all","pending","approved","rejected","suspended"] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className="px-4 py-2 rounded-full text-xs font-semibold transition-all"
                style={{
                  background: filter === f ? "linear-gradient(135deg,var(--color-rose-500),var(--color-rose-700))" : "white",
                  color: filter === f ? "white" : "var(--color-muted)",
                  border: `1px solid ${filter === f ? "transparent" : "var(--color-border)"}`,
                  boxShadow: filter === f ? "var(--shadow-rose)" : "none",
                }}>
                {f === "all" ? `Toutes (${counts.all})` : `${statusBadge[f].label} (${counts[f]})`}
              </button>
            ))}
          </div>

          {counts.pending > 0 && (
            <div className="p-4 rounded-2xl flex items-center gap-4"
              style={{ background: "rgba(219,39,119,0.08)", border: "1px solid rgba(219,39,119,0.25)" }}>
              <span className="text-2xl">⏳</span>
              <div className="flex-1">
                <div className="text-sm font-semibold" style={{ color: "var(--color-purple-700)" }}>
                  {counts.pending} conductrice(s) en attente d'approbation
                </div>
                <div className="text-xs" style={{ color: "var(--color-muted)" }}>Vérifiez les dossiers et approuvez ou rejetez</div>
              </div>
              <button onClick={() => setFilter("pending")} className="btn btn-sm btn-gold">Voir →</button>
            </div>
          )}

          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: "var(--color-silver-50)" }}>
                    {["ID","Nom","Véhicule","Créé le","Statut","Actions"].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold" style={{ color: "var(--color-muted)", textTransform: "uppercase" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={6} className="text-center py-8 text-gray-500">Chargement...</td></tr>
                  ) : filtered.length === 0 ? (
                    <tr><td colSpan={6} className="text-center py-8 text-gray-500">Aucune conductrice trouvée.</td></tr>
                  ) : filtered.map(d => (
                    <tr key={d.id} className="border-t transition-colors hover:bg-sand-50 cursor-pointer" style={{ borderColor: "var(--color-border)" }}
                      onClick={() => setSelected(d)}>
                      <td className="px-4 py-3 font-mono text-xs" style={{ color: "var(--color-muted)" }}>{d.id.slice(0, 8)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-base" style={{ background: "rgba(225,29,72,0.1)" }}>👩</div>
                          <span className="font-medium">{d.profiles?.full_name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs" style={{ color: "var(--color-muted)" }}>
                        {d.vehicle_make} {d.vehicle_model}
                      </td>
                      <td className="px-4 py-3 text-xs" style={{ color: "var(--color-muted)" }}>
                        {new Date(d.created_at).toLocaleDateString("fr-FR")}
                      </td>
                      <td className="px-4 py-3"><span className={`badge ${statusBadge[d.approval_status]?.cls || 'badge-neutral'}`} style={{ fontSize: 10 }}>{statusBadge[d.approval_status]?.label || d.approval_status}</span></td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                          {d.approval_status === "pending" && (
                            <>
                              <button onClick={() => updateStatus(d.id, "approved")} className="btn btn-sm btn-emerald">✓</button>
                              <button onClick={() => updateStatus(d.id, "rejected")} className="btn btn-sm" style={{ background: "rgba(197,48,48,0.1)", color: "#C53030" }}>✕</button>
                            </>
                          )}
                          {d.approval_status === "approved" && (
                            <button onClick={() => updateStatus(d.id, "suspended")} className="btn btn-sm btn-outline" style={{ fontSize: 11 }}>Suspendre</button>
                          )}
                          {d.approval_status === "suspended" && (
                            <button onClick={() => updateStatus(d.id, "approved")} className="btn btn-sm btn-emerald" style={{ fontSize: 11 }}>Réactiver</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
          onClick={() => setSelected(null)}>
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl" style={{ background: "rgba(225,29,72,0.1)" }}>👩</div>
                <div>
                  <h3 className="text-xl font-semibold" style={{ fontFamily: "var(--font-display)" }}>{selected.profiles?.full_name}</h3>
                  <p className="text-sm" style={{ color: "var(--color-muted)" }}>{selected.profiles?.phone} · {selected.id.slice(0, 8)}</p>
                  <span className={`badge ${statusBadge[selected.approval_status]?.cls} mt-1`} style={{ fontSize: 10 }}>{statusBadge[selected.approval_status]?.label}</span>
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="btn btn-icon-sm btn-ghost text-xl">✕</button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {[
                { label: "Permis", val: selected.license_number },
                { label: "Plaque", val: selected.vehicle_plate },
                { label: "Exp Permis", val: new Date(selected.license_expiry).toLocaleDateString("fr-FR") },
                { label: "Exp Assur", val: new Date(selected.insurance_expiry).toLocaleDateString("fr-FR") },
              ].map(doc => (
                <div key={doc.label} className="flex items-center gap-2 p-3 rounded-xl"
                  style={{ background: "rgba(147,51,234,0.06)", border: "1px solid rgba(147,51,234,0.2)" }}>
                  <span style={{ color: "var(--color-purple-500)" }}>✓</span>
                  <div className="text-xs font-medium truncate flex-1 min-w-0" title={doc.val}>{doc.label}: {doc.val}</div>
                </div>
              ))}
            </div>

            {selected.approval_status === "pending" && (
              <div className="flex gap-3">
                <button onClick={() => updateStatus(selected.id, "rejected")} className="btn btn-outline flex-1" style={{ borderColor: "rgba(197,48,48,0.3)", color: "#C53030" }}>✕ Rejeter</button>
                <button onClick={() => updateStatus(selected.id, "approved")} className="btn btn-emerald flex-1">✓ Approuver</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
