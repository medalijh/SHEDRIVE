"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { useToastStore } from "@/store/useToastStore";
import { Home, Car, Clock, CreditCard, Settings, Send, BarChart2, Coins, Gift, Ticket, Landmark, Smartphone, Banknote } from "lucide-react";

function BottomNav({ active }: { active: string }) {
  const items = [
    { href: "/passenger/dashboard", icon: <Home size={24} />, label: "Accueil", id: "home" },
    { href: "/passenger/book", icon: <Car size={24} />, label: "Réserver", id: "book" },
    { href: "/passenger/history", icon: <Clock size={24} />, label: "Historique", id: "history" },
    { href: "/passenger/wallet", icon: <CreditCard size={24} />, label: "Wallet", id: "wallet" },
    { href: "/passenger/settings", icon: <Settings size={24} />, label: "Profil", id: "profile" },
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

export default function WalletPage() {
  const [addOpen, setAddOpen] = useState(false);
  const [amount, setAmount] = useState(100);
  const [method, setMethod] = useState("card");
  const quickAmounts = [50, 100, 200, 500];

  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchWallet();
  }, []);

  const fetchWallet = async () => {
    try {
      const supabase = getSupabaseClient();
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) return;

      const { data: wallet } = await supabase.from("wallets").select("*").eq("user_id", userData.user.id).single();
      const { data: tx } = await supabase.from("wallet_transactions")
        .select("*")
        .eq("wallet_id", wallet?.id || "")
        .order("created_at", { ascending: false })
        .limit(50);

      setBalance(wallet?.balance || 0);
      setTransactions(tx || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleTopUp = async () => {
    setLoading(true);
    try {
      const supabase = getSupabaseClient();
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) {
        useToastStore.getState().addToast("Erreur: Non authentifié", "error");
        setLoading(false);
        return;
      }

      if (!amount || amount < 10 || amount > 5000) {
        useToastStore.getState().addToast("Montant entre 10 et 5000 MAD", "error");
        setLoading(false);
        return;
      }

      const { data: wallet } = await supabase.from("wallets").select("*").eq("user_id", userData.user.id).single();
      if (!wallet) {
        useToastStore.getState().addToast("Wallet non trouvé", "error");
        setLoading(false);
        return;
      }

      // Create transaction
      const { error: txError } = await supabase.from("wallet_transactions").insert({
        wallet_id: wallet.id,
        type: "credit",
        amount,
        description: `Recharge ${amount} MAD`,
        reference_type: "topup",
        payment_method: method || "card",
      });

      if (txError) {
        useToastStore.getState().addToast("Erreur: " + txError.message, "error");
      } else {
        await supabase.from("wallets").update({ balance: wallet.balance + amount }).eq("id", wallet.id);
        useToastStore.getState().addToast(`✅ ${amount} MAD ajoutés à votre wallet !`, "success");
        setAddOpen(false);
        fetchWallet();
      }
    } catch (error) {
      console.error(error);
      useToastStore.getState().addToast("Erreur serveur", "error");
    }
    setLoading(false);
  };

  return (
    <div className="container-app mx-auto pb-28" style={{ background: "var(--color-silver-50)", minHeight: "100vh" }}>
      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/passenger/dashboard" className="btn btn-icon-sm btn-ghost text-xl">←</Link>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>Mon Wallet</h1>
        </div>

        {/* Main Balance Card */}
        <div className="rounded-3xl p-7 relative overflow-hidden mb-4"
          style={{
            background: "linear-gradient(135deg, var(--color-rose-600) 0%, var(--color-rose-800) 40%, #2C1F12 100%)",
            boxShadow: "var(--shadow-rose)",
          }}>
          <div className="zellige-pattern absolute inset-0 opacity-10"/>
          {/* Decorative circles */}
          <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full" style={{ background: "rgba(255,255,255,0.92)" }}/>
          <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full" style={{ background: "rgba(255,255,255,0.92)" }}/>

          <div className="relative z-10">
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="text-xs mb-1" style={{ color: "rgba(0,0,0,0.6)" }}>Solde disponible</p>
                <div className="text-5xl font-bold text-black" style={{ fontFamily: "var(--font-display)" }}>
                  {Math.floor(balance)}<span className="text-2xl ml-1">.{(balance % 1).toFixed(2).substring(2)}</span>
                </div>
                <div className="text-sm mt-1" style={{ color: "rgba(0,0,0,0.6)" }}>Dirhams marocains (MAD)</div>
              </div>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-purple-600"
                style={{ background: "rgba(255,255,255,0.92)", backdropFilter: "blur(8px)" }}>
                <CreditCard size={32} />
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setAddOpen(true)} className="btn btn-sm flex-1"
                style={{ background: "rgba(255,255,255,0.92)", color: "white", border: "1px solid rgba(0,0,0,0.6)" }}>
                + Recharger
              </button>
              <button className="btn btn-sm flex-1 flex items-center justify-center gap-1"
                style={{ background: "rgba(255,255,255,0.92)", color: "white", border: "1px solid rgba(0,0,0,0.6)" }}>
                <Send size={16}/> Envoyer
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Ce mois", value: "108 MAD", icon: <BarChart2 size={24} />, color: "var(--color-rose-600)" },
            { label: "Total rechargé", value: "400 MAD", icon: <Coins size={24} />, color: "var(--color-purple-600)" },
            { label: "Économisé", value: "52 MAD", icon: <Gift size={24} />, color: "var(--color-purple-600)" },
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
          style={{ background: "linear-gradient(135deg, rgba(219,39,119,0.12), rgba(219,39,119,0.06))", border: "1px solid rgba(219,39,119,0.25)" }}>
          <span className="text-purple-600"><Ticket size={32} /></span>
          <div className="flex-1">
            <div className="text-sm font-semibold" style={{ color: "var(--color-purple-700)" }}>Vous avez un coupon disponible !</div>
            <div className="text-xs" style={{ color: "var(--color-muted)" }}>SHEDRIVE20 · -20% sur votre prochain trajet</div>
          </div>
          <button className="btn btn-sm btn-gold">Utiliser</button>
        </div>
      </div>

      {/* Transaction History */}
      <div className="px-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold" style={{ fontFamily: "var(--font-display)" }}>Historique des transactions</h2>
          <button className="text-xs font-medium" style={{ color: "var(--color-rose-600)" }}>Filtrer ▾</button>
        </div>

        <div className="card overflow-hidden">
          {transactions.length === 0 ? (
            <div className="text-center text-sm text-gray-500 py-6">Aucune transaction récente.</div>
          ) : transactions.map((tx, i) => (
            <div key={i} className="flex items-center gap-4 p-4 border-b last:border-0 hover:bg-sand-50 transition-colors"
              style={{ borderColor: "var(--color-border)" }}>
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-lg flex-shrink-0"
                style={{ background: tx.type === "credit" ? "rgba(147,51,234,0.1)" : "rgba(225,29,72,0.1)", color: tx.type === "credit" ? "var(--color-purple-600)" : "var(--color-rose-600)" }}>
                {tx.type === "credit" ? <CreditCard size={20} /> : <Car size={20} />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{tx.description}</div>
                <div className="text-xs mt-0.5" style={{ color: "var(--color-muted)" }}>
                  {new Date(tx.created_at).toLocaleString("fr-FR")} · {tx.reference_type}
                </div>
              </div>
              <div className={`text-sm font-bold flex-shrink-0`}
                style={{ color: tx.type === "credit" ? "var(--color-purple-600)" : "var(--color-rose-700)" }}>
                {tx.type === "credit" ? "+" : "-"}{tx.amount} MAD
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Funds Modal */}
      {addOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }} onClick={() => setAddOpen(false)}>
          <div className="w-full max-w-md bg-white rounded-t-3xl p-6 pb-10" onClick={e => e.stopPropagation()}>
            <div className="w-10 h-1 rounded-full mx-auto mb-6" style={{ background: "var(--color-silver-300)" }}/>
            <h3 className="text-xl font-semibold mb-6" style={{ fontFamily: "var(--font-display)" }}>Recharger le Wallet</h3>

            <div className="mb-5">
              <p className="text-sm font-medium mb-3" style={{ color: "var(--color-silver-700)" }}>Montant (MAD)</p>
              <div className="grid grid-cols-4 gap-2 mb-3">
                {quickAmounts.map(a => (
                  <button key={a} onClick={() => setAmount(a)}
                    className="py-3 rounded-xl text-sm font-semibold transition-all"
                    style={{
                      background: amount === a ? "linear-gradient(135deg, var(--color-rose-500), var(--color-rose-700))" : "var(--color-silver-100)",
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
              <p className="text-sm font-medium mb-3" style={{ color: "var(--color-silver-700)" }}>Méthode de paiement</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: "card", icon: <CreditCard size={20} />, label: "Carte Bancaire" },
                  { id: "cmi", icon: <Landmark size={20} />, label: "CMI (Maroc)" },
                  { id: "payzone", icon: <Smartphone size={20} />, label: "PayZone" },
                  { id: "cash", icon: <Banknote size={20} />, label: "Agent SheDrive" },
                ].map(m => (
                  <button key={m.id} onClick={() => setMethod(m.id)}
                    className="p-3 rounded-xl border-2 text-left flex items-center gap-2 transition-all"
                    style={{
                      borderColor: method === m.id ? "var(--color-rose-400)" : "var(--color-border)",
                      background: method === m.id ? "rgba(225,29,72,0.06)" : "transparent",
                    }}>
                    <span className="text-purple-600">{m.icon}</span>
                    <span className="text-xs font-medium">{m.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <button onClick={handleTopUp} disabled={loading}
              className="btn btn-primary btn-lg w-full">
              {loading ? "Recharge en cours..." : `Recharger ${amount} MAD →`}
            </button>
          </div>
        </div>
      )}

      <BottomNav active="wallet"/>
    </div>
  );
}
