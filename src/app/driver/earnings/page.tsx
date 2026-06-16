"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { Home, Map as MapIcon, Coins, Settings, CheckCircle, Flag, Landmark, Star, Car, ArrowLeft } from "lucide-react";

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

export default function DriverEarnings() {
  const { user } = useAuth();
  const [period, setPeriod] = useState<"day" | "week" | "month">("week");
  const [trips, setTrips] = useState<any[]>([]);
  const [stats, setStats] = useState({
    day: { amount: 0, count: 0 },
    week: { amount: 0, count: 0 },
    month: { amount: 0, count: 0 }
  });
  const [weekData, setWeekData] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]);

  const weekDays = ["Lun","Mar","Mer","Jeu","Ven","Sam","Dim"];
  const maxW = Math.max(...weekData, 1);

  useEffect(() => {
    if (!user || !isSupabaseConfigured()) return;

    const fetchTrips = async () => {
      const { data } = await getSupabaseClient()
        .from("rides")
        .select("*")
        .eq("driver_id", user.id)
        .eq("status", "completed")
        .order("created_at", { ascending: false });

      if (data) {
        setTrips(data);

        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay() + 1); // Monday
        startOfWeek.setHours(0, 0, 0, 0);
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

        const dayTrips = data.filter(t => t.created_at >= startOfDay);
        const weekTrips = data.filter(t => t.created_at >= startOfWeek.toISOString());
        const monthTrips = data.filter(t => t.created_at >= startOfMonth);

        const sumPrice = (arr: any[]) => arr.reduce((sum, t) => sum + (t.final_price || t.passenger_offered_price || 0), 0);

        setStats({
          day: { amount: sumPrice(dayTrips), count: dayTrips.length },
          week: { amount: sumPrice(weekTrips), count: weekTrips.length },
          month: { amount: sumPrice(monthTrips), count: monthTrips.length }
        });

        // Compute per-day earnings for the current week
        const dailyEarnings = [0, 0, 0, 0, 0, 0, 0];
        weekTrips.forEach(t => {
          const d = new Date(t.created_at);
          const dayIdx = (d.getDay() + 6) % 7; // Mon=0 ... Sun=6
          dailyEarnings[dayIdx] += (t.final_price || t.passenger_offered_price || 0);
        });
        setWeekData(dailyEarnings);
      }
    };

    fetchTrips();
  }, [user]);

  return (
    <div className="container-app mx-auto pb-28" style={{ background: "var(--color-silver-50)", minHeight: "100vh" }}>
      {/* Tulips Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <Image src="/tulips.png" alt="" fill className="object-cover opacity-[0.03]" />
      </div>

      {/* Header */}
      <div className="px-6 pt-12 pb-4">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/driver/dashboard" className="btn btn-icon-sm btn-ghost text-purple-600"><ArrowLeft size={24} /></Link>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>Mes Gains</h1>
        </div>

        {/* Period Tabs */}
        <div className="flex gap-2 mb-6">
          {([["day","Aujourd'hui"],["week","Cette semaine"],["month","Ce mois"]] as const).map(([id, label]) => (
            <button key={id} onClick={() => setPeriod(id)}
              className="px-4 py-2 rounded-full text-xs font-semibold transition-all"
              style={{
                background: period === id ? "linear-gradient(135deg,var(--color-purple-500),var(--color-purple-700))" : "white",
                color: period === id ? "white" : "var(--color-muted)",
                border: `1px solid ${period === id ? "transparent" : "var(--color-border)"}`,
                boxShadow: period === id ? "var(--shadow-emerald)" : "none",
              }}>
              {label}
            </button>
          ))}
        </div>

        {/* Main Earnings Card */}
        <div className="rounded-3xl p-7 relative overflow-hidden mb-5"
          style={{
            background: "linear-gradient(135deg, var(--color-purple-600) 0%, var(--color-purple-800) 60%, #0A1A10 100%)",
            boxShadow: "var(--shadow-emerald)",
          }}>
          <div className="zellige-pattern absolute inset-0 opacity-10"/>
          <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full" style={{ background: "rgba(255,255,255,0.92)" }}/>
          <div className="relative z-10">
            <p className="text-xs mb-1" style={{ color: "rgba(0,0,0,0.6)" }}>
              {period === "day" ? "Gains aujourd'hui" : period === "week" ? "Gains cette semaine" : "Gains ce mois"}
            </p>
            <div className="text-5xl font-bold text-black mb-1" style={{ fontFamily: "var(--font-display)" }}>
              {stats[period].amount.toLocaleString()} <span className="text-2xl">MAD</span>
            </div>
            <div className="flex gap-4 text-xs mt-3" style={{ color: "rgba(0,0,0,0.6)" }}>
              <span className="flex items-center gap-1"><Car size={14}/> {stats[period].count} trajets</span>
              <span className="flex items-center gap-1"><Star size={14} className="text-yellow-500 fill-current"/> 4.9 moy.</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: "Taux d'acceptation", value: "92%", icon: <CheckCircle size={24} />, color: "var(--color-purple-600)" },
            { label: "Taux de complétion", value: "98%", icon: <Flag size={24} />, color: "var(--color-rose-600)" },
            { label: "Gains moyens / trajet", value: stats[period].count > 0 ? `${Math.round(stats[period].amount / stats[period].count)} MAD` : "0 MAD", icon: <Coins size={24} />, color: "var(--color-purple-600)" },
          ].map(s => (
            <div key={s.label} className="card p-4 text-center">
              <div className="flex justify-center mb-1 text-purple-600">{s.icon}</div>
              <div className="text-base font-bold" style={{ color: s.color, fontFamily: "var(--font-display)" }}>{s.value}</div>
              <div className="text-xs mt-0.5 leading-tight" style={{ color: "var(--color-muted)" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Chart */}
      <div className="px-6 mb-6">
        <div className="card p-5">
          <h3 className="font-semibold mb-4" style={{ fontFamily: "var(--font-display)" }}>Gains par jour (semaine)</h3>
          <div className="flex items-end gap-2 h-24">
            {weekData.map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full rounded-t-lg transition-all duration-500"
                  style={{
                    height: `${(v / maxW) * 80}px`,
                    background: i === 5
                      ? "linear-gradient(to top, var(--color-purple-500), var(--color-purple-400))"
                      : "linear-gradient(to top, var(--color-silver-200), var(--color-silver-100))",
                    boxShadow: i === 5 ? "var(--shadow-emerald)" : "none",
                  }}/>
                <div className="text-xs" style={{ color: "var(--color-muted)" }}>{weekDays[i]}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Withdraw */}
      <div className="px-6 mb-6">
        <div className="card-luxury p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold" style={{ fontFamily: "var(--font-display)" }}>Retrait des gains</h3>
              <p className="text-xs mt-0.5" style={{ color: "var(--color-muted)" }}>Solde disponible : {stats.month.amount} MAD</p>
            </div>
            <div className="text-purple-600"><Landmark size={32} /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button className="btn btn-emerald">Virement bancaire</button>
            <button className="btn btn-outline">Retrait Cash</button>
          </div>
        </div>
      </div>

      {/* Trip History */}
      <div className="px-6">
        <h2 className="font-semibold mb-3" style={{ fontFamily: "var(--font-display)" }}>Trajets effectués</h2>
        <div className="card overflow-hidden">
          {trips.length === 0 ? (
             <div className="text-center py-6 text-gray-500 text-sm">Aucun trajet effectué.</div>
          ) : trips.map((t, i) => (
            <div key={t.id} className="flex items-center gap-4 p-4 border-b last:border-0" style={{ borderColor: "var(--color-border)" }}>
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(147,51,234,0.08)", color: "var(--color-purple-600)" }}><CheckCircle size={20}/></div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{t.from_address} → {t.to_address}</div>
                <div className="text-xs mt-0.5" style={{ color: "var(--color-muted)" }}>
                  {new Date(t.created_at).toLocaleString("fr-FR")}
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-sm font-bold" style={{ color: "var(--color-purple-600)" }}>+{t.final_price || t.passenger_offered_price} MAD</div>
                <div className="text-xs flex gap-0.5 justify-end mt-1 text-yellow-500">
                  {Array.from({ length: t.driver_rating || 5 }).map((_, idx) => (
                    <Star key={idx} size={10} className="fill-current" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <DriverBottomNav active="earnings"/>
    </div>
  );
}
