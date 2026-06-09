"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/client";

export default function DriverSettings() {
  const { user, profile } = useAuth();
  const router = useRouter();
  const [driverProfile, setDriverProfile] = useState<any>(null);

  const [isOnline, setIsOnline] = useState(false);
  const [pushOn, setPushOn] = useState(true);
  const [soundOn, setSoundOn] = useState(true);

  useEffect(() => {
    if (!user || !isSupabaseConfigured()) return;
    const fetchDriver = async () => {
      const { data } = await getSupabaseClient()
        .from("drivers")
        .select("*")
        .eq("user_id", user.id)
        .single();
      
      if (data) {
        setDriverProfile(data);
        setIsOnline(data.is_online);
      }
    };
    fetchDriver();
  }, [user]);

  const handleOnlineToggle = async () => {
    const newState = !isOnline;
    setIsOnline(newState);
    if (user && isSupabaseConfigured()) {
      await getSupabaseClient().from("drivers").update({ is_online: newState }).eq("user_id", user.id);
    }
  };

  const handleLogout = async () => {
    if (confirm("Déconnecter ?")) {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/auth/login");
    }
  };

  const Row = ({ icon, label, value, onClick, toggle, toggled }: {
    icon: string; label: string; value?: string; onClick?: () => void; toggle?: boolean; toggled?: boolean;
  }) => (
    <button className="flex items-center gap-4 w-full py-4 border-b last:border-0 text-left"
      style={{ borderColor: "var(--color-border)" }} onClick={onClick}>
      <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-lg" style={{ background: "rgba(13,122,74,0.08)" }}>{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium">{label}</div>
        {value && <div className="text-xs mt-0.5 truncate" style={{ color: "var(--color-muted)" }}>{value}</div>}
      </div>
      {toggle ? (
        <div className="relative w-12 h-6 rounded-full transition-all" style={{ background: toggled ? "var(--color-emerald-500)" : "var(--color-sand-300)" }}>
          <div className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all" style={{ left: toggled ? "26px" : "2px" }}/>
        </div>
      ) : (
        <span style={{ color: "var(--color-muted)" }}>›</span>
      )}
    </button>
  );

  return (
    <div className="container-app mx-auto pb-28" style={{ background: "var(--color-sand-50)", minHeight: "100vh" }}>
      <div className="px-6 pt-12 pb-4">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/driver/dashboard" className="btn btn-icon-sm btn-ghost text-xl">←</Link>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>Mon Profil Conductrice</h1>
        </div>

        {/* Profile */}
        <div className="card-luxury p-6 flex items-center gap-5 mb-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl"
              style={{ background: "linear-gradient(135deg,var(--color-emerald-400),var(--color-emerald-600))" }}>👩</div>
            <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center text-sm"
              style={{ background: "var(--color-gold-400)", color: "white" }}>✏️</button>
            {isOnline && <div className="online-dot absolute top-0 right-0"/>}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-semibold truncate" style={{ fontFamily: "var(--font-display)" }}>
              {profile?.full_name || "Conductrice"}
            </h2>
            <p className="text-sm truncate" style={{ color: "var(--color-muted)" }}>{profile?.phone || user?.email}</p>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className={`badge ${driverProfile?.approval_status === "approved" ? "badge-success" : "badge-warning"}`} style={{ fontSize: 10 }}>
                {driverProfile?.approval_status === "approved" ? "✓ Approuvée" : "En attente"}
              </span>
              <span className="badge badge-primary" style={{ fontSize: 10 }}>⭐ {profile?.rating || 5.0}</span>
            </div>
          </div>
        </div>

        {/* Vehicle Card */}
        <div className="card p-5 mb-5">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-2xl">🚗</span>
            <div className="flex-1 min-w-0">
              <div className="font-semibold truncate">
                {driverProfile ? `${driverProfile.vehicle_make} ${driverProfile.vehicle_model} · ${driverProfile.vehicle_color}` : "Véhicule non renseigné"}
              </div>
              <div className="text-xs truncate" style={{ color: "var(--color-muted)" }}>
                {driverProfile ? `${driverProfile.vehicle_year} · ${driverProfile.vehicle_plate} · ${driverProfile.vehicle_type}` : ""}
              </div>
            </div>
          </div>
          <button className="btn btn-sm btn-outline mt-3">Modifier le véhicule</button>
        </div>
      </div>

      {/* Settings sections */}
      <div className="px-6 flex flex-col gap-4">
        <div className="card p-5">
          <h3 className="font-semibold mb-1" style={{ fontFamily: "var(--font-display)" }}>Disponibilité</h3>
          <Row icon="🟢" label="Mode en ligne" value={isOnline ? "Vous êtes visible par les passagères" : "Vous n'êtes pas visible"} toggle toggled={isOnline} onClick={handleOnlineToggle}/>
        </div>

        <div className="card p-5">
          <h3 className="font-semibold mb-1" style={{ fontFamily: "var(--font-display)" }}>Informations</h3>
          <Row icon="👤" label="Nom complet" value={profile?.full_name}/>
          <Row icon="📱" label="Téléphone" value={profile?.phone || "Non renseigné"}/>
          <Row icon="📧" label="Email" value={user?.email}/>
          <Row icon="🏙️" label="Ville d'opération" value="Casablanca"/>
        </div>

        <div className="card p-5">
          <h3 className="font-semibold mb-1" style={{ fontFamily: "var(--font-display)" }}>Documents</h3>
          {[
            { icon: "🪪", label: "CIN", status: "Vérifiée", ok: true },
            { icon: "🎫", label: "Permis de conduire", status: `Exp. ${driverProfile?.license_expiry ? new Date(driverProfile.license_expiry).toLocaleDateString() : "Inconnue"}`, ok: true },
            { icon: "🚗", label: "Véhicule", status: "Vérifié", ok: true },
            { icon: "📋", label: "Assurance", status: `Exp. ${driverProfile?.insurance_expiry ? new Date(driverProfile.insurance_expiry).toLocaleDateString() : "Inconnue"}`, ok: true },
          ].map(d => (
            <div key={d.label} className="flex items-center gap-4 py-3 border-b last:border-0" style={{ borderColor: "var(--color-border)" }}>
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-lg" style={{ background: "rgba(13,122,74,0.08)" }}>{d.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{d.label}</div>
                <div className="text-xs truncate" style={{ color: "var(--color-muted)" }}>{d.status}</div>
              </div>
              <span style={{ color: d.ok ? "var(--color-emerald-500)" : "#E53E3E", fontSize: "1.2rem" }}>{d.ok ? "✓" : "✕"}</span>
            </div>
          ))}
        </div>

        <div className="card p-5">
          <h3 className="font-semibold mb-1" style={{ fontFamily: "var(--font-display)" }}>Notifications</h3>
          <Row icon="🔔" label="Nouvelles demandes" value="Son et vibration" toggle toggled={pushOn} onClick={() => setPushOn(!pushOn)}/>
          <Row icon="🔊" label="Son de notification" toggle toggled={soundOn} onClick={() => setSoundOn(!soundOn)}/>
        </div>

        <div className="card p-5">
          <h3 className="font-semibold mb-1" style={{ fontFamily: "var(--font-display)" }}>Sécurité</h3>
          <Row icon="🔐" label="Authentification 2FA"/>
          <Row icon="🔑" label="Changer le mot de passe"/>
          <Row icon="📋" label="Mes sessions actives"/>
        </div>

        <button className="btn btn-outline w-full" style={{ borderColor: "rgba(197,48,48,0.3)", color: "#C53030" }}
          onClick={handleLogout}>
          🚪 Se déconnecter
        </button>
      </div>

      {/* Bottom Nav */}
      <nav className="bottom-nav">
        {[
          { href: "/driver/dashboard", icon: "🏠", label: "Accueil",  id: "home" },
          { href: "/driver/trips",     icon: "🗺️", label: "Trajets",  id: "trips" },
          { href: "/driver/earnings",  icon: "💰", label: "Gains",    id: "earnings" },
          { href: "/driver/settings",  icon: "⚙️", label: "Profil",   id: "profile" },
        ].map(item => (
          <Link key={item.id} href={item.href} className={`bottom-nav-item ${item.id === "profile" ? "active" : ""}`}>
            <div className="nav-icon">{item.icon}</div><span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
