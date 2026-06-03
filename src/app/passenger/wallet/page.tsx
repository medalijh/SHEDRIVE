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

const transactions = [
  { type: "debit", desc: "Trajet · Maarif → CIL Anfa", amount: -35, date: "Aujourd'hui 14:45", ref: "TXN-8823", icon: "🚗" },
  { type: "credit", desc: "Recharge Wallet", amount: +100, date: "Hier 09:12", ref: "TXN-8801", icon: "💳" },
  { type: "debit", desc: "Trajet · Ain Diab → Hay Hassani", amount: -28, date: "Dim 01 Juin", ref: "TXN-8754", icon: "🚗" },
  { type: "credit", desc: "Coupon BIENVENUE (-20%)", amount: +7, date: "Dim 01 Juin", ref: "TXN-8753", icon: "🎁" },
  { type: "debit", desc: "Trajet · Sidi Bernoussi → Maarif", amount: -45, date: "Sam 31 Mai", ref: "TXN-8721", icon: "🚗" },
  { type: "credit", desc: "Remboursement trajet #8699", amount: +45, date: "Sam 31 Mai", ref: "TXN-8722", icon: "↩️" },
];

export default function WalletPage() {
  const [addOpen, setAddOpen] = useState(false);
  const [amount, setAmount] = useState(100);
  const [method, setMethod] = useState("card");
  const quickAmounts = [50, 100, 200, 500];

  return (
    <div className="container-app mx-auto pb-28" style={{ background: "var(--color-sand-50)", minHeight: "100vh" }}>
      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/passenger/dashboard" className="btn btn-icon-sm btn-ghost text-xl">←</Link>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>Mon Wallet</h1>
        </div>

        {/* Main Balance Card */}
        <div className="rounded-3xl p-7 relative overflow-hidden mb-4"
          style={{
            background: "linear-gradient(135deg, var(--color-rose-gold-600) 0%, var(--color-rose-gold-800) 40%, #2C1F12 100%)",
            boxShadow: "var(--shadow-rose)",
          }}>
          <div className="zellige-pattern absolute inset-0 opacity-10"/>
          {/* Decorative circles */}
          <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}/>
          <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full" style={{ background: "rgba(255,255,255,0.04)" }}/>

          <div className="relative z-10">
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="text-xs mb-1" style={{ color: "rgba(255,255,255,0.6)" }}>Solde disponible</p>
                <div className="text-5xl font-bold text-white" style={{ fontFamily: "var(--font-display)" }}>
                  150<span className="text-2xl ml-1">.00</span>
                </div>
                <div className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.6)" }}>Dirhams marocains (MAD)</div>
              </div>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
                style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)" }}>
                💳
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setAddOpen(true)} className="btn btn-sm flex-1"
                style={{ background: "rgba(255,255,255,0.2)", color: "white", border: "1px solid rgba(255,255,255,0.3)" }}>
                + Recharger
              </button>
              <button className="btn btn-sm flex-1"
                style={{ background: "rgba(255,255,255,0.1)", color: "white", border: "1px solid rgba(255,255,255,0.2)" }}>
                📤 Envoyer
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Ce mois", value: "108 MAD", icon: "📊", color: "var(--color-rose-gold-600)" },
            { label: "Total rechargé", value: "400 MAD", icon: "💰", color: "var(--color-emerald-600)" },
            { label: "Économisé", value: "52 MAD", icon: "🎁", color: "var(--color-gold-600)" },
          ].map(s => (
            <div key={s.label} className="p-4 rounded-2xl text-center"
              style={{ background: "white", border: "1px solid var(--color-border)" }}>
              <div className="text-xl mb-1">{s.icon}</div>
              <div className="text-sm font-bold" style={{ color: s.color }}>{s.value}</div>
              <div className="text-xs" style={{ color: "var(--color-muted)" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Coupon Banner */}
      <div className="px-6 mb-6">
        <div className="rounded-2xl p-4 flex items-center gap-4"
          style={{ background: "linear-gradient(135deg, rgba(212,160,23,0.12), rgba(212,160,23,0.06))", border: "1px solid rgba(212,160,23,0.25)" }}>
          <span className="text-2xl">🎟️</span>
          <div className="flex-1">
            <div className="text-sm font-semibold" style={{ color: "var(--color-gold-700)" }}>Vous avez un coupon disponible !</div>
            <div className="text-xs" style={{ color: "var(--color-muted)" }}>SHEDRIVE20 · -20% sur votre prochain trajet</div>
          </div>
          <button className="btn btn-sm btn-gold">Utiliser</button>
        </div>
      </div>

      {/* Transaction History */}
      <div className="px-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold" style={{ fontFamily: "var(--font-display)" }}>Historique des transactions</h2>
          <button className="text-xs font-medium" style={{ color: "var(--color-rose-gold-600)" }}>Filtrer ▾</button>
        </div>

        <div className="card overflow-hidden">
          {transactions.map((tx, i) => (
            <div key={i} className="flex items-center gap-4 p-4 border-b last:border-0 hover:bg-sand-50 transition-colors"
              style={{ borderColor: "var(--color-border)" }}>
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-lg flex-shrink-0"
                style={{ background: tx.type === "credit" ? "rgba(13,122,74,0.1)" : "rgba(200,149,108,0.1)" }}>
                {tx.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{tx.desc}</div>
                <div className="text-xs mt-0.5" style={{ color: "var(--color-muted)" }}>{tx.date} · {tx.ref}</div>
              </div>
              <div className={`text-sm font-bold flex-shrink-0 ${tx.type === "credit" ? "" : ""}`}
                style={{ color: tx.type === "credit" ? "var(--color-emerald-600)" : "var(--color-rose-gold-700)" }}>
                {tx.type === "credit" ? "+" : ""}{tx.amount} MAD
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Funds Modal */}
      {addOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }} onClick={() => setAddOpen(false)}>
          <div className="w-full max-w-md bg-white rounded-t-3xl p-6 pb-10" onClick={e => e.stopPropagation()}>
            <div className="w-10 h-1 rounded-full mx-auto mb-6" style={{ background: "var(--color-sand-300)" }}/>
            <h3 className="text-xl font-semibold mb-6" style={{ fontFamily: "var(--font-display)" }}>Recharger le Wallet</h3>

            <div className="mb-5">
              <p className="text-sm font-medium mb-3" style={{ color: "var(--color-sand-700)" }}>Montant (MAD)</p>
              <div className="grid grid-cols-4 gap-2 mb-3">
                {quickAmounts.map(a => (
                  <button key={a} onClick={() => setAmount(a)}
                    className="py-3 rounded-xl text-sm font-semibold transition-all"
                    style={{
                      background: amount === a ? "linear-gradient(135deg, var(--color-rose-gold-500), var(--color-rose-gold-700))" : "var(--color-sand-100)",
                      color: amount === a ? "white" : "var(--color-muted)",
                    }}>
                    {a}
                  </button>
                ))}
              </div>
              <input type="number" value={amount} onChange={e => setAmount(Number(e.target.value))}
                className="input-field text-center text-lg font-bold" placeholder="Montant personnalisé"/>
            </div>

            <div className="mb-6">
              <p className="text-sm font-medium mb-3" style={{ color: "var(--color-sand-700)" }}>Méthode de paiement</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: "card", icon: "💳", label: "Carte Bancaire" },
                  { id: "cmi", icon: "🏦", label: "CMI (Maroc)" },
                  { id: "payzone", icon: "📱", label: "PayZone" },
                  { id: "cash", icon: "💵", label: "Agent SheDrive" },
                ].map(m => (
                  <button key={m.id} onClick={() => setMethod(m.id)}
                    className="p-3 rounded-xl border-2 text-left flex items-center gap-2 transition-all"
                    style={{
                      borderColor: method === m.id ? "var(--color-rose-gold-400)" : "var(--color-border)",
                      background: method === m.id ? "rgba(200,149,108,0.06)" : "transparent",
                    }}>
                    <span className="text-xl">{m.icon}</span>
                    <span className="text-xs font-medium">{m.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <button onClick={() => { setAddOpen(false); alert(`✅ ${amount} MAD ajoutés à votre wallet!`); }}
              className="btn btn-primary btn-lg w-full">
              Recharger {amount} MAD →
            </button>
          </div>
        </div>
      )}

      <BottomNav active="wallet"/>
    </div>
  );
}
