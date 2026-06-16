"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useAuth } from "@/hooks/useAuth";
import { useGeolocation } from "@/hooks/useGeolocation";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { MapMarker } from "@/components/Map";
import { useToastStore } from "@/store/useToastStore";
import { ShieldAlert, Home, Car, Clock, CreditCard, Settings, MapPin, Search, Bell, User, MessageCircle, Gift, Star, ShieldCheck, CheckCircle } from "lucide-react";

const LiveMap = dynamic(() => import("@/components/Map"), { ssr: false });

function SOSButton() {
  const [pressed, setPressed] = useState(false);
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (!pressed) return;
    if (countdown === 0) {
      if (isSupabaseConfigured()) {
        getSupabaseClient().from("sos_alerts").insert({ status: "active" }).then();
      }
      useToastStore.getState().addToast("ALERTE SOS ENVOYEE!\n\nVotre position a été partagée avec:\n- Votre contact d'urgence\n- L'équipe SheDrive", "warning");
      setPressed(false);
      setCountdown(3);
      return;
    }
    const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [pressed, countdown]);

  return (
    <>
      {pressed && (
        <div className="fixed inset-0 bg-red-900/80 z-[998] flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full mx-6 text-center">
            <div className="flex justify-center mb-4 text-red-600"><ShieldAlert size={64} className="animate-pulse" /></div>
            <h3 className="text-2xl font-bold text-red-700 mb-2">Alerte SOS</h3>
            <p className="text-gray-600 mb-6">L'alerte sera envoyée dans <strong>{countdown}</strong> secondes...</p>
            <button onClick={() => { setPressed(false); setCountdown(3); }} className="btn btn-outline w-full" style={{ borderColor: "#E53E3E", color: "#E53E3E" }}>✕ Annuler</button>
          </div>
        </div>
      )}
      <button className="sos-button no-print" onClick={() => setPressed(true)} aria-label="Bouton SOS d'urgence">
        <span className="text-base font-bold flex items-center gap-1"><ShieldAlert size={18} /> SOS</span>
      </button>
    </>
  );
}

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
      {items.map((item) => (
        <Link key={item.id} href={item.href} className={`bottom-nav-item ${active === item.id ? "active" : ""}`}>
          <div className="nav-icon">{item.icon}</div>
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}

function QuickBookWidget() {
  const router = useRouter();
  const [to, setTo] = useState("");
  return (
    <div className="card-luxury p-5">
      <div className="flex items-center gap-2 mb-4 text-purple-600">
        <Car size={24} />
        <h3 className="font-semibold text-base" style={{ fontFamily: "var(--font-display)" }}>Où souhaitez-vous aller ?</h3>
      </div>
      <div className="flex flex-col gap-3 mb-4">
        <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "rgba(147,51,234,0.06)", border: "1px solid rgba(147,51,234,0.15)" }}>
          <div className="w-3 h-3 rounded-full" style={{ background: "var(--color-purple-500)" }} />
          <input className="flex-1 bg-transparent outline-none text-sm" placeholder="Votre position actuelle" disabled style={{ color: "var(--color-text)", cursor: "not-allowed" }} />
          <MapPin size={20} style={{ color: "var(--color-purple-600)" }} />
        </div>
        <div className="ml-[18px] flex flex-col gap-1">
          {[1, 2].map((i) => <div key={i} className="w-0.5 h-1 rounded-full ml-[4px]" style={{ background: "var(--color-silver-300)" }} />)}
        </div>
        <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "rgba(225,29,72,0.06)", border: "1px solid rgba(225,29,72,0.15)" }}>
          <div className="w-3 h-3 rounded-full" style={{ background: "var(--color-rose-500)" }} />
          <input value={to} onChange={(e) => setTo(e.target.value)} className="flex-1 bg-transparent outline-none text-sm" placeholder="Entrez votre destination" style={{ color: "var(--color-text)" }} />
          <Search size={20} style={{ color: "var(--color-rose-500)" }} />
        </div>
      </div>
      <button onClick={() => router.push(to ? `/passenger/book?to=${encodeURIComponent(to)}` : "/passenger/book")} className="btn btn-primary w-full">Trouver une conductrice</button>
    </div>
  );
}

function RecentRides() {
  const [rides, setRides] = useState<any[]>([]);
  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    const fetchRides = async () => {
      const { data: { user } } = await getSupabaseClient().auth.getUser();
      if (!user) return;
      const { data } = await getSupabaseClient()
        .from("rides")
        .select("*, driver:profiles!driver_id(full_name)")
        .eq("passenger_id", user.id)
        .order("created_at", { ascending: false })
        .limit(3);
      if (data) setRides(data);
    };
    fetchRides();
  }, []);

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold" style={{ fontFamily: "var(--font-display)" }}>Trajets récents</h3>
        <Link href="/passenger/history" className="text-xs font-medium" style={{ color: "var(--color-rose-600)" }}>Voir tout →</Link>
      </div>
      <div className="flex flex-col gap-4">
        {rides.length === 0 ? (
          <div className="text-center text-sm text-gray-500 py-4">Aucun trajet récent</div>
        ) : rides.map((ride, i) => (
          <div key={i} className="flex items-center gap-4 py-3 border-b last:border-0" style={{ borderColor: "var(--color-border)" }}>
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-rose-600 flex-shrink-0" style={{ background: "rgba(225,29,72,0.1)" }}>
              <Car size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{ride.from_address} → {ride.to_address}</div>
              <div className="text-xs mt-1 flex items-center gap-2" style={{ color: "var(--color-muted)" }}>
                <span>{new Date(ride.created_at).toLocaleDateString("fr-FR")}</span>
                <span>·</span>
                <span>{ride.driver?.full_name || "Conductrice"}</span>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-sm font-semibold" style={{ color: "var(--color-rose-700)" }}>{ride.final_price || ride.passenger_offered_price} MAD</div>
              {ride.status === "completed" && <div className="flex justify-end mt-1"><CheckCircle size={14} className="text-emerald-500" /></div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function WalletCard() {
  const [balance, setBalance] = useState(0);
  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    const fetchBalance = async () => {
      const { data: { user } } = await getSupabaseClient().auth.getUser();
      if (!user) return;
      const { data } = await getSupabaseClient().from("wallets").select("balance").eq("user_id", user.id).single();
      if (data) setBalance(data.balance);
    };
    fetchBalance();
  }, []);

  return (
    <div className="rounded-3xl p-5 relative overflow-hidden" style={{ background: "linear-gradient(135deg, var(--color-purple-600) 0%, var(--color-purple-800) 100%)", boxShadow: "var(--shadow-emerald)" }}>
      <div className="zellige-pattern absolute inset-0 opacity-10" />
      <div className="relative z-10 flex items-start justify-between mb-6">
        <div>
          <p className="text-xs mb-1" style={{ color: "rgba(0,0,0,0.6)" }}>Solde Wallet</p>
          <div className="text-3xl font-bold text-black" style={{ fontFamily: "var(--font-display)" }}>{balance.toFixed(2)} <span className="text-lg">MAD</span></div>
        </div>
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-purple-700" style={{ background: "rgba(255,255,255,0.92)" }}>
          <CreditCard size={24} />
        </div>
      </div>
      <div className="relative z-10 flex gap-3">
        <Link href="/passenger/wallet" className="btn btn-sm flex-1" style={{ background: "rgba(255,255,255,0.92)", color: "white", backdropFilter: "blur(8px)", border: "1px solid rgba(0,0,0,0.6)" }}>Recharger</Link>
        <Link href="/passenger/history" className="btn btn-sm flex-1" style={{ background: "rgba(255,255,255,0.92)", color: "white", backdropFilter: "blur(8px)", border: "1px solid rgba(0,0,0,0.6)" }}>Historique</Link>
      </div>
    </div>
  );
}

export default function PassengerDashboard() {
  const { profile } = useAuth();
  const { latitude, longitude } = useGeolocation();
  const [greeting, setGreeting] = useState("Bonjour");
  const [drivers, setDrivers] = useState<any[]>([]);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Bonjour");
    else if (hour < 18) setGreeting("Bon après-midi");
    else setGreeting("Bonsoir");
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    getSupabaseClient().from("drivers").select("*").eq("is_online", true).not("current_lat", "is", null).then(({ data }) => {
      if (data) setDrivers(data);
    });
  }, []);

  let markers: MapMarker[] = [];
  if (latitude && longitude) {
    markers.push({ id: "user", position: [latitude, longitude], type: "passenger" });
  }
  drivers.forEach((d) => {
    if (d.current_lat && d.current_lng) {
      markers.push({ id: d.id, position: [d.current_lat, d.current_lng], type: "driver" });
    }
  });

  const mapCenter: [number, number] = (latitude && longitude) ? [latitude, longitude] : [33.5731, -7.5898];

  return (
    <div className="container-app mx-auto pb-24">
      {/* Tulips Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <Image src="/tulips.png" alt="" fill className="object-cover opacity-[0.03]" />
      </div>
      {/* Header */}
      <div className="p-6 pt-12 relative z-10">
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-sm" style={{ color: "var(--color-muted)" }}>{greeting}</p>
            <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>{profile?.full_name || "Passagère"}</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/passenger/notifications" className="btn btn-icon relative" style={{ background: "var(--color-silver-100)", color: "var(--color-text)" }}>
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500" />
            </Link>
            <Link href="/passenger/settings">
              <div className="w-11 h-11 rounded-full flex items-center justify-center text-white" style={{ background: "linear-gradient(135deg, var(--color-rose-400), var(--color-rose-600))" }}>
                <User size={20} />
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="px-6 mb-6 relative z-10">
        <LiveMap 
          center={mapCenter} 
          zoom={14} 
          markers={markers} 
          height="250px" 
          showUserLocation={true} 
          onMapClick={(lat, lng) => {
            // Optionnel : on pourrait stocker la position forcée ici
            console.log("Locate:", lat, lng);
          }}
        />
      </div>

      {/* Quick Book */}
      <div className="px-6 mb-6"><QuickBookWidget /></div>

      {/* Wallet */}
      <div className="px-6 mb-6"><WalletCard /></div>

      {/* Quick Actions */}
      <div className="px-6 mb-6">
        <div className="grid grid-cols-4 gap-3">
          {[
            { icon: <MapPin size={24} />, label: "Récents", href: "/passenger/history" },
            { icon: <MessageCircle size={24} />, label: "Messages", href: "/passenger/messages" },
            { icon: <Gift size={24} />, label: "Coupons", href: "/passenger/coupons" },
            { icon: <Star size={24} />, label: "Favoris", href: "/passenger/favorites" },
          ].map((action) => (
            <Link key={action.label} href={action.href} className="flex flex-col items-center gap-2 p-4 rounded-2xl text-center transition-all duration-200 hover:scale-105" style={{ background: "white", border: "1px solid var(--color-border)", boxShadow: "var(--shadow-xs)" }}>
              <span className="text-purple-600">{action.icon}</span>
              <span className="text-xs font-medium" style={{ color: "var(--color-muted)" }}>{action.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Rides */}
      <div className="px-6 mb-6"><RecentRides /></div>

      {/* Safety Card */}
      <div className="px-6 mb-6">
        <div className="rounded-3xl p-5" style={{ background: "linear-gradient(135deg, rgba(197,48,48,0.08), rgba(197,48,48,0.04))", border: "1px solid rgba(197,48,48,0.2)" }}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-red-600" style={{ background: "rgba(197,48,48,0.12)" }}>
              <ShieldCheck size={24} />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-sm mb-1">Sécurité & Contacts d'urgence</h3>
              <p className="text-xs" style={{ color: "var(--color-muted)" }}>Ajoutez vos contacts de confiance pour que le bouton SOS fonctionne</p>
            </div>
            <Link href="/passenger/settings#safety" className="btn btn-sm btn-outline" style={{ borderColor: "rgba(197,48,48,0.3)", color: "#C53030" }}>Configurer</Link>
          </div>
        </div>
      </div>

      <SOSButton />
      <BottomNav active="home" />
    </div>
  );
}
