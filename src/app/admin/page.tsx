"use client";

import React, { useState } from "react";
import Link from "next/link";

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
      style={{ background: "#0D0A07", borderRight: "1px solid rgba(200,149,108,0.15)" }}>
      {/* Logo */}
      <div className="p-6 border-b" style={{ borderColor: "rgba(200,149,108,0.15)" }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-lg"
            style={{ background: "linear-gradient(135deg,var(--color-rose-gold-500),var(--color-rose-gold-700))" }}>
            🌹
          </div>
          <div>
            <div className="text-white font-bold text-sm" style={{ fontFamily: "var(--font-display)" }}>SheDrive</div>
            <div className="text-xs" style={{ color: "rgba(200,149,108,0.7)" }}>Admin Panel</div>
          </div>
        </div>
      </div>
      {/* Nav */}
      <nav className="flex-1 p-4 flex flex-col gap-1">
        {nav.map(item => (
          <Link key={item.id} href={`/admin/${item.id === "dashboard" ? "" : item.id}`}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200"
            style={{
              background: active === item.id ? "rgba(200,149,108,0.15)" : "transparent",
              color: active === item.id ? "#C8956C" : "rgba(255,255,255,0.5)",
              borderLeft: active === item.id ? "3px solid var(--color-rose-gold-500)" : "3px solid transparent",
            }}>
            <span className="text-base">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
      {/* Footer */}
      <div className="p-4 border-t" style={{ borderColor: "rgba(200,149,108,0.15)" }}>
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
            style={{ background: "rgba(200,149,108,0.15)" }}>👩‍💼</div>
          <div>
            <div className="text-xs text-white font-medium">Admin Principal</div>
            <div className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>admin@shedrive.ma</div>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 w-full text-xs rounded-lg mt-1 transition-colors"
          style={{ color: "rgba(255,255,255,0.3)" }}
          onClick={() => { if (confirm("Déconnecter ?")) window.location.href = "/auth/login"; }}>
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
              style={{ background: trend.startsWith("+") ? "rgba(13,122,74,0.1)" : "rgba(229,62,62,0.1)", color: trend.startsWith("+") ? "var(--color-emerald-600)" : "#E53E3E" }}>
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

// ─── Mini Chart (SVG sparkline) ───────────────────────────────
function Sparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 120; const h = 40;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"/>
      <circle cx={(data.length - 1) / (data.length - 1) * w} cy={h - ((data[data.length-1] - min) / range) * h} r="3" fill={color}/>
    </svg>
  );
}

// ─── Revenue Chart ────────────────────────────────────────────
function RevenueChart() {
  const months = ["Jan","Fév","Mar","Avr","Mai","Jun"];
  const vals = [18200, 24500, 21800, 31200, 28900, 38700];
  const max = Math.max(...vals);
  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-semibold" style={{ fontFamily: "var(--font-display)" }}>Revenus mensuels</h3>
          <p className="text-xs mt-1" style={{ color: "var(--color-muted)" }}>6 derniers mois · MAD</p>
        </div>
        <div className="text-right">
          <div className="text-xl font-bold gradient-text" style={{ fontFamily: "var(--font-display)" }}>163 300 MAD</div>
          <div className="text-xs" style={{ color: "var(--color-emerald-600)" }}>↑ +34% vs période précédente</div>
        </div>
      </div>
      <div className="flex items-end gap-3 h-36">
        {vals.map((v, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-2">
            <div className="w-full rounded-t-xl transition-all duration-700"
              style={{
                height: `${(v / max) * 120}px`,
                background: i === vals.length - 1
                  ? "linear-gradient(to top, var(--color-rose-gold-600), var(--color-rose-gold-400))"
                  : "linear-gradient(to top, var(--color-sand-200), var(--color-sand-100))",
                boxShadow: i === vals.length - 1 ? "var(--shadow-rose)" : "none",
              }} />
            <div className="text-xs" style={{ color: "var(--color-muted)" }}>{months[i]}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Recent Rides Table ───────────────────────────────────────
function RecentRidesTable() {
  const rows = [
    { id: "RD-9921", passenger: "F. Bennani", driver: "Khadija M.", from: "Maarif", to: "CIL Anfa", amount: 35, status: "completed", time: "14:32" },
    { id: "RD-9920", passenger: "A. Alami", driver: "Sara H.", from: "Gauthier", to: "Ain Diab", amount: 42, status: "in_progress", time: "14:18" },
    { id: "RD-9919", passenger: "N. Berrada", driver: "Amina B.", from: "Sidi Bernoussi", to: "Hay Hassani", amount: 28, status: "completed", time: "13:55" },
    { id: "RD-9918", passenger: "H. Cherkaoui", driver: "—", from: "Casa-Voyageurs", to: "Maarif", amount: 30, status: "searching", time: "13:47" },
    { id: "RD-9917", passenger: "L. Tahiri", driver: "Fatima Z.", from: "Ain Sebaa", to: "Maarif", amount: 45, status: "cancelled", time: "13:30" },
  ];
  const statusBadge: Record<string, { label: string; cls: string }> = {
    completed:   { label: "Terminé",    cls: "badge-success" },
    in_progress: { label: "En cours",   cls: "badge-warning" },
    searching:   { label: "Recherche",  cls: "badge-primary" },
    cancelled:   { label: "Annulé",     cls: "badge-danger" },
  };
  return (
    <div className="card overflow-hidden">
      <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: "var(--color-border)" }}>
        <h3 className="font-semibold" style={{ fontFamily: "var(--font-display)" }}>Trajets récents</h3>
        <Link href="/admin/rides" className="text-xs font-medium" style={{ color: "var(--color-rose-gold-600)" }}>Voir tout →</Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: "var(--color-sand-50)" }}>
              {["ID","Passagère","Conductrice","Trajet","Montant","Heure","Statut"].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold" style={{ color: "var(--color-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.id} className="border-t transition-colors hover:bg-sand-50" style={{ borderColor: "var(--color-border)" }}>
                <td className="px-4 py-3 font-mono text-xs" style={{ color: "var(--color-muted)" }}>{r.id}</td>
                <td className="px-4 py-3 font-medium">{r.passenger}</td>
                <td className="px-4 py-3" style={{ color: "var(--color-muted)" }}>{r.driver}</td>
                <td className="px-4 py-3 text-xs">{r.from} → {r.to}</td>
                <td className="px-4 py-3 font-semibold" style={{ color: "var(--color-rose-gold-700)" }}>{r.amount} MAD</td>
                <td className="px-4 py-3 text-xs" style={{ color: "var(--color-muted)" }}>{r.time}</td>
                <td className="px-4 py-3"><span className={`badge ${statusBadge[r.status].cls}`} style={{ fontSize: 10 }}>{statusBadge[r.status].label}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Driver Approval Queue ────────────────────────────────────
function DriverApprovalQueue() {
  const [items, setItems] = useState([
    { id: "DRV-441", name: "Meriem Tazi", city: "Casablanca", submitted: "Il y a 2h", docs: 5 },
    { id: "DRV-440", name: "Houda Filali", city: "Marrakech",  submitted: "Il y a 4h", docs: 4 },
    { id: "DRV-439", name: "Zineb Arabi",  city: "Rabat",      submitted: "Hier",       docs: 5 },
  ]);
  const approve = (id: string) => setItems(it => it.filter(i => i.id !== id));
  return (
    <div className="card overflow-hidden">
      <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: "var(--color-border)" }}>
        <h3 className="font-semibold" style={{ fontFamily: "var(--font-display)" }}>Conductrices en attente</h3>
        <span className="badge badge-warning">{items.length} en attente</span>
      </div>
      <div className="divide-y" style={{ borderColor: "var(--color-border)" }}>
        {items.length === 0 && (
          <div className="px-6 py-8 text-center text-sm" style={{ color: "var(--color-muted)" }}>✅ Aucune demande en attente</div>
        )}
        {items.map(d => (
          <div key={d.id} className="flex items-center gap-4 px-6 py-4">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-lg flex-shrink-0"
              style={{ background: "rgba(200,149,108,0.08)" }}>👩</div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold">{d.name}</div>
              <div className="text-xs" style={{ color: "var(--color-muted)" }}>{d.city} · {d.docs}/5 docs · {d.submitted}</div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => approve(d.id)} className="btn btn-sm btn-emerald">✓ Approuver</button>
              <button className="btn btn-sm" style={{ background: "rgba(197,48,48,0.1)", color: "#C53030" }}>✕</button>
            </div>
          </div>
        ))}
      </div>
      <div className="px-6 py-3 border-t" style={{ borderColor: "var(--color-border)" }}>
        <Link href="/admin/drivers" className="text-xs font-medium" style={{ color: "var(--color-rose-gold-600)" }}>Voir toutes les demandes →</Link>
      </div>
    </div>
  );
}

// ─── SOS Alerts ──────────────────────────────────────────────
function SOSAlerts() {
  const alerts = [
    { id: "SOS-12", user: "F. Bennani", location: "Maarif, Casablanca", time: "Il y a 2 min", status: "active" },
    { id: "SOS-11", user: "A. Alami",   location: "Hay Hassani",        time: "Il y a 1h",   status: "resolved" },
  ];
  return (
    <div className="card overflow-hidden">
      <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: "var(--color-border)" }}>
        <h3 className="font-semibold text-red-700" style={{ fontFamily: "var(--font-display)" }}>🆘 Alertes SOS</h3>
        <span className="badge badge-danger">1 active</span>
      </div>
      {alerts.map(a => (
        <div key={a.id} className="flex items-center gap-4 px-6 py-4 border-b last:border-0"
          style={{ borderColor: "var(--color-border)", background: a.status === "active" ? "rgba(197,48,48,0.03)" : undefined }}>
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0"
            style={{ background: a.status === "active" ? "rgba(197,48,48,0.12)" : "rgba(13,122,74,0.08)", animation: a.status === "active" ? "sos-pulse 2s infinite" : "none" }}>
            {a.status === "active" ? "🆘" : "✅"}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold">{a.user} <span className="font-normal text-xs" style={{ color: "var(--color-muted)" }}>· {a.id}</span></div>
            <div className="text-xs" style={{ color: "var(--color-muted)" }}>📍 {a.location} · {a.time}</div>
          </div>
          {a.status === "active" && <button className="btn btn-sm" style={{ background: "rgba(197,48,48,0.1)", color: "#C53030", fontSize: 11 }}>Intervenir</button>}
          {a.status === "resolved" && <span className="badge badge-success" style={{ fontSize: 10 }}>Résolu</span>}
        </div>
      ))}
    </div>
  );
}

// ─── ADMIN DASHBOARD ─────────────────────────────────────────
export default function AdminDashboard() {
  const stats = [
    { icon: "👥", label: "Utilisatrices", value: "4 821",  sub: "dont 312 nouvelles ce mois",   color: "var(--color-rose-gold-500)",  trend: "+12%" },
    { icon: "🚗", label: "Conductrices",  value: "847",    sub: "dont 23 en attente d'approbation", color: "var(--color-emerald-500)",  trend: "+8%" },
    { icon: "🗺️", label: "Trajets totaux", value: "31 204", sub: "dont 142 aujourd'hui",          color: "var(--color-gold-500)",      trend: "+24%" },
    { icon: "💰", label: "Revenus totaux", value: "163 300 MAD", sub: "net après commissions",   color: "var(--color-rose-gold-500)", trend: "+34%" },
    { icon: "⭐", label: "Note moyenne",  value: "4.87",   sub: "sur 5 · tous trajets",          color: "var(--color-gold-500)",      trend: "+0.3" },
    { icon: "🆘", label: "Alertes SOS",   value: "1",      sub: "1 active · 11 ce mois",         color: "#E53E3E",                    trend: undefined },
  ];

  return (
    <div className="flex min-h-screen" style={{ background: "var(--color-sand-50)" }}>
      <AdminSidebar active="dashboard" />

      <main className="flex-1 overflow-auto">
        {/* Top bar */}
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
              style={{ background: "rgba(13,122,74,0.08)", border: "1px solid rgba(13,122,74,0.2)" }}>
              <div className="w-2 h-2 rounded-full" style={{ background: "var(--color-emerald-500)", animation: "online-pulse 2s infinite" }}/>
              <span className="text-xs font-medium" style={{ color: "var(--color-emerald-700)" }}>Système opérationnel</span>
            </div>
            <button className="btn btn-icon" style={{ background: "var(--color-sand-100)", position: "relative" }}>
              🔔
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ background: "#E53E3E" }}/>
            </button>
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-base"
              style={{ background: "linear-gradient(135deg, var(--color-rose-gold-500), var(--color-rose-gold-700))" }}>
              👩‍💼
            </div>
          </div>
        </div>

        <div className="p-8 space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {stats.map(s => <StatCard key={s.label} {...s} />)}
          </div>

          {/* Revenue Chart + City breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2"><RevenueChart /></div>
            <div className="card p-6">
              <h3 className="font-semibold mb-5" style={{ fontFamily: "var(--font-display)" }}>Top Villes</h3>
              {[
                { city: "Casablanca", rides: 18432, pct: 59 },
                { city: "Marrakech",  rides: 5821,  pct: 19 },
                { city: "Rabat",      rides: 4102,  pct: 13 },
                { city: "Fès",        rides: 1804,  pct: 6  },
                { city: "Agadir",     rides: 1045,  pct: 3  },
              ].map(c => (
                <div key={c.city} className="mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{c.city}</span>
                    <span className="text-xs" style={{ color: "var(--color-muted)" }}>{c.rides.toLocaleString()} trajets</span>
                  </div>
                  <div className="h-2 rounded-full" style={{ background: "var(--color-sand-200)" }}>
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${c.pct}%`, background: "linear-gradient(90deg, var(--color-rose-gold-500), var(--color-rose-gold-300))" }}/>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RecentRidesTable />
            <div className="flex flex-col gap-6">
              <DriverApprovalQueue />
              <SOSAlerts />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: "👥", label: "Gérer les utilisateurs", href: "/admin/users", color: "var(--color-rose-gold-500)" },
              { icon: "🚗", label: "Approuver conductrices", href: "/admin/drivers", color: "var(--color-emerald-500)" },
              { icon: "📊", label: "Rapports & exports", href: "/admin/analytics", color: "var(--color-gold-500)" },
              { icon: "🎫", label: "Tickets support", href: "/admin/support", color: "var(--color-rose-gold-500)" },
            ].map(a => (
              <Link key={a.label} href={a.href}
                className="card p-5 flex flex-col items-center text-center gap-3 transition-all hover:scale-[1.02] hover:shadow-md">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                  style={{ background: `${a.color}10` }}>{a.icon}</div>
                <span className="text-sm font-medium">{a.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
