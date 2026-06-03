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

type DriverStatus = "pending" | "approved" | "rejected" | "suspended";

const allDrivers = [
  { id: "DRV-441", name: "Meriem Tazi",    city: "Casablanca", submitted: "2025-06-02", trips: 0,    rating: 0,   status: "pending" as DriverStatus,  docs: 5, cin: true, license: true, vehicle: true, selfie: true, bg: true },
  { id: "DRV-440", name: "Houda Filali",   city: "Marrakech",  submitted: "2025-06-02", trips: 0,    rating: 0,   status: "pending" as DriverStatus,  docs: 4, cin: true, license: true, vehicle: true, selfie: false, bg: false },
  { id: "DRV-380", name: "Khadija Moqri",  city: "Casablanca", submitted: "2025-05-10", trips: 847,  rating: 4.9, status: "approved" as DriverStatus, docs: 5, cin: true, license: true, vehicle: true, selfie: true, bg: true },
  { id: "DRV-365", name: "Sara Hassani",   city: "Rabat",      submitted: "2025-05-05", trips: 412,  rating: 4.7, status: "approved" as DriverStatus, docs: 5, cin: true, license: true, vehicle: true, selfie: true, bg: true },
  { id: "DRV-320", name: "Amina Belhaj",   city: "Fès",        submitted: "2025-04-20", trips: 623,  rating: 4.8, status: "approved" as DriverStatus, docs: 5, cin: true, license: true, vehicle: true, selfie: true, bg: true },
  { id: "DRV-299", name: "Naima Zouiri",   city: "Agadir",     submitted: "2025-04-01", trips: 0,    rating: 0,   status: "rejected" as DriverStatus, docs: 3, cin: true, license: false, vehicle: false, selfie: true, bg: false },
];

export default function AdminDrivers() {
  const [drivers, setDrivers] = useState(allDrivers);
  const [filter, setFilter] = useState<"all" | DriverStatus>("all");
  const [selected, setSelected] = useState<typeof allDrivers[0] | null>(null);
  const [search, setSearch] = useState("");

  const filtered = drivers.filter(d => {
    const matchFilter = filter === "all" || d.status === filter;
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) || d.city.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const updateStatus = (id: string, status: DriverStatus) => {
    setDrivers(ds => ds.map(d => d.id === id ? { ...d, status } : d));
    setSelected(null);
  };

  const statusBadge: Record<DriverStatus, { label: string; cls: string }> = {
    pending:   { label: "En attente", cls: "badge-warning" },
    approved:  { label: "Approuvée",  cls: "badge-success" },
    rejected:  { label: "Rejetée",    cls: "badge-danger"  },
    suspended: { label: "Suspendue",  cls: "badge-neutral"  },
  };

  const counts = {
    all:       drivers.length,
    pending:   drivers.filter(d => d.status === "pending").length,
    approved:  drivers.filter(d => d.status === "approved").length,
    rejected:  drivers.filter(d => d.status === "rejected").length,
    suspended: drivers.filter(d => d.status === "suspended").length,
  };

  return (
    <div className="flex min-h-screen" style={{ background: "var(--color-sand-50)" }}>
      <AdminSidebar active="drivers" />
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <div className="sticky top-0 z-30 px-8 py-4 flex items-center justify-between"
          style={{ background: "rgba(253,248,245,0.95)", backdropFilter: "blur(16px)", borderBottom: "1px solid var(--color-border)" }}>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>Gestion des Conductrices</h1>
          <div className="flex items-center gap-3">
            <input className="input-field py-2 text-sm w-64" placeholder="🔍 Rechercher..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>

        <div className="p-8 space-y-6">
          {/* Filter Tabs */}
          <div className="flex gap-2 flex-wrap">
            {(["all","pending","approved","rejected","suspended"] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className="px-4 py-2 rounded-full text-xs font-semibold transition-all"
                style={{
                  background: filter === f ? "linear-gradient(135deg,var(--color-rose-gold-500),var(--color-rose-gold-700))" : "white",
                  color: filter === f ? "white" : "var(--color-muted)",
                  border: `1px solid ${filter === f ? "transparent" : "var(--color-border)"}`,
                  boxShadow: filter === f ? "var(--shadow-rose)" : "none",
                }}>
                {f === "all" ? `Toutes (${counts.all})` : `${statusBadge[f as DriverStatus].label} (${counts[f]})`}
              </button>
            ))}
          </div>

          {/* Pending alert */}
          {counts.pending > 0 && (
            <div className="p-4 rounded-2xl flex items-center gap-4"
              style={{ background: "rgba(212,160,23,0.08)", border: "1px solid rgba(212,160,23,0.25)" }}>
              <span className="text-2xl">⏳</span>
              <div className="flex-1">
                <div className="text-sm font-semibold" style={{ color: "var(--color-gold-700)" }}>
                  {counts.pending} conductrice(s) en attente d'approbation
                </div>
                <div className="text-xs" style={{ color: "var(--color-muted)" }}>Vérifiez les dossiers et approuvez ou rejetez</div>
              </div>
              <button onClick={() => setFilter("pending")} className="btn btn-sm btn-gold">Voir →</button>
            </div>
          )}

          {/* Table */}
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: "var(--color-sand-50)" }}>
                    {["ID","Nom","Ville","Soumis","Docs","Trajets","Note","Statut","Actions"].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold" style={{ color: "var(--color-muted)", textTransform: "uppercase" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(d => (
                    <tr key={d.id} className="border-t transition-colors hover:bg-sand-50 cursor-pointer" style={{ borderColor: "var(--color-border)" }}
                      onClick={() => setSelected(d)}>
                      <td className="px-4 py-3 font-mono text-xs" style={{ color: "var(--color-muted)" }}>{d.id}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-base" style={{ background: "rgba(200,149,108,0.1)" }}>👩</div>
                          <span className="font-medium">{d.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3" style={{ color: "var(--color-muted)" }}>{d.city}</td>
                      <td className="px-4 py-3 text-xs" style={{ color: "var(--color-muted)" }}>{d.submitted}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-0.5">
                          {[d.cin, d.license, d.vehicle, d.selfie, d.bg].map((ok, i) => (
                            <div key={i} className="w-2 h-2 rounded-full" style={{ background: ok ? "var(--color-emerald-500)" : "var(--color-sand-300)" }}/>
                          ))}
                        </div>
                        <div className="text-xs mt-0.5" style={{ color: "var(--color-muted)" }}>{d.docs}/5</div>
                      </td>
                      <td className="px-4 py-3 font-medium">{d.trips || "—"}</td>
                      <td className="px-4 py-3">{d.rating ? `⭐ ${d.rating}` : "—"}</td>
                      <td className="px-4 py-3"><span className={`badge ${statusBadge[d.status].cls}`} style={{ fontSize: 10 }}>{statusBadge[d.status].label}</span></td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                          {d.status === "pending" && (
                            <>
                              <button onClick={() => updateStatus(d.id, "approved")} className="btn btn-sm btn-emerald">✓</button>
                              <button onClick={() => updateStatus(d.id, "rejected")} className="btn btn-sm" style={{ background: "rgba(197,48,48,0.1)", color: "#C53030" }}>✕</button>
                            </>
                          )}
                          {d.status === "approved" && (
                            <button onClick={() => updateStatus(d.id, "suspended")} className="btn btn-sm btn-outline" style={{ fontSize: 11 }}>Suspendre</button>
                          )}
                          {d.status === "suspended" && (
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
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl" style={{ background: "rgba(200,149,108,0.1)" }}>👩</div>
                <div>
                  <h3 className="text-xl font-semibold" style={{ fontFamily: "var(--font-display)" }}>{selected.name}</h3>
                  <p className="text-sm" style={{ color: "var(--color-muted)" }}>{selected.city} · {selected.id}</p>
                  <span className={`badge ${statusBadge[selected.status].cls} mt-1`} style={{ fontSize: 10 }}>{statusBadge[selected.status].label}</span>
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="btn btn-icon-sm btn-ghost text-xl">✕</button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {[
                { label: "CIN", ok: selected.cin },
                { label: "Permis", ok: selected.license },
                { label: "Véhicule", ok: selected.vehicle },
                { label: "Selfie", ok: selected.selfie },
                { label: "Background", ok: selected.bg },
              ].map(doc => (
                <div key={doc.label} className="flex items-center gap-2 p-3 rounded-xl"
                  style={{ background: doc.ok ? "rgba(13,122,74,0.06)" : "rgba(197,48,48,0.06)", border: `1px solid ${doc.ok ? "rgba(13,122,74,0.2)" : "rgba(197,48,48,0.2)"}` }}>
                  <span style={{ color: doc.ok ? "var(--color-emerald-500)" : "#E53E3E" }}>{doc.ok ? "✓" : "✕"}</span>
                  <span className="text-xs font-medium">{doc.label}</span>
                </div>
              ))}
            </div>

            {selected.status === "pending" && (
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
