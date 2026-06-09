"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

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
          <div className="nav-icon">{item.icon}</div><span>{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}

type Tab = "account" | "safety" | "notifications" | "language";

const SettingRow = ({ icon, label, value, onClick, isToggle, toggled }: {
  icon: string; label: string; value?: string; onClick?: () => void; isToggle?: boolean; toggled?: boolean;
}) => (
  <button className="flex items-center gap-4 w-full py-4 border-b last:border-0 text-left transition-colors hover:bg-sand-50"
    style={{ borderColor: "var(--color-border)" }} onClick={onClick}>
    <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-lg flex-shrink-0"
      style={{ background: "rgba(225,29,72,0.08)" }}>{icon}</div>
    <div className="flex-1">
      <div className="text-sm font-medium">{label}</div>
      {value && <div className="text-xs mt-0.5" style={{ color: "var(--color-muted)" }}>{value}</div>}
    </div>
    {isToggle ? (
      <div className="relative w-12 h-6 rounded-full transition-all duration-300"
        style={{ background: toggled ? "var(--color-purple-500)" : "var(--color-silver-300)" }}>
        <div className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-300"
          style={{ left: toggled ? "26px" : "2px" }}/>
      </div>
    ) : (
      <span style={{ color: "var(--color-muted)", fontSize: "1.1rem" }}>›</span>
    )}
  </button>
);

export default function SettingsPage() {
  const { user, profile } = useAuth();
  const router = useRouter();

  const [tab, setTab] = useState<Tab>("account");
  const [pushNotifs, setPushNotifs] = useState(true);
  const [smsNotifs, setSmsNotifs] = useState(true);
  const [emailNotifs, setEmailNotifs] = useState(false);
  const [shareLocation, setShareLocation] = useState(true);
  const [lang, setLang] = useState<"fr" | "ar" | "en">("fr");

  const tabs: { id: Tab; icon: string; label: string }[] = [
    { id: "account", icon: "👤", label: "Compte" },
    { id: "safety", icon: "🛡️", label: "Sécurité" },
    { id: "notifications", icon: "🔔", label: "Notifs" },
    { id: "language", icon: "🌍", label: "Langue" },
  ];

  const handleLogout = async () => {
    if (confirm("Déconnecter ?")) {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/auth/login");
    }
  };

  return (
    <div className="container-app mx-auto pb-28" style={{ background: "var(--color-silver-50)", minHeight: "100vh" }}>
      <div className="px-6 pt-12 pb-4">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/passenger/dashboard" className="btn btn-icon-sm btn-ghost text-xl">←</Link>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>Paramètres</h1>
        </div>

        {/* Profile Card */}
        <div className="card-luxury p-5 flex items-center gap-5 mb-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl"
              style={{ background: "linear-gradient(135deg, var(--color-rose-400), var(--color-rose-600))" }}>
              👩
            </div>
            <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center text-sm"
              style={{ background: "var(--color-purple-400)", color: "white" }}>
              ✏️
            </button>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-semibold truncate" style={{ fontFamily: "var(--font-display)" }}>
              {profile?.full_name || "Passagère"}
            </h2>
            <p className="text-sm truncate" style={{ color: "var(--color-muted)" }}>{profile?.phone || user?.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="badge badge-success" style={{ fontSize: 10 }}>✓ Vérifié</span>
              <span className="badge badge-primary" style={{ fontSize: 10 }}>⭐ 5.0</span>
            </div>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className="flex flex-col items-center gap-1.5 p-3 rounded-2xl text-center transition-all"
              style={{
                background: tab === t.id ? "linear-gradient(135deg, var(--color-rose-500), var(--color-rose-700))" : "white",
                color: tab === t.id ? "white" : "var(--color-muted)",
                border: tab === t.id ? "none" : "1px solid var(--color-border)",
                boxShadow: tab === t.id ? "var(--shadow-rose)" : "none",
              }}>
              <span className="text-xl">{t.icon}</span>
              <span className="text-xs font-medium">{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="px-6">
        {/* Account Tab */}
        {tab === "account" && (
          <div className="card p-5">
            <SettingRow icon="👤" label="Nom complet" value={profile?.full_name}/>
            <SettingRow icon="📱" label="Téléphone" value={profile?.phone || "Non renseigné"}/>
            <SettingRow icon="📧" label="Email" value={user?.email}/>
            <SettingRow icon="🎂" label="Date de naissance" value="Non renseignée"/>
            <SettingRow icon="🏙️" label="Ville préférée" value="Casablanca"/>
            <SettingRow icon="🖼️" label="Photo de profil"/>
            <SettingRow icon="🎁" label="Mon code de parrainage" value="SHEDRIVE2026"/>
            <SettingRow icon="🗑️" label="Supprimer mon compte"/>
          </div>
        )}

        {/* Safety Tab */}
        {tab === "safety" && (
          <div className="flex flex-col gap-4" id="safety">
            <div className="card p-5">
              <h3 className="font-semibold mb-4" style={{ fontFamily: "var(--font-display)" }}>Contacts d'urgence SOS</h3>
              {[
                { name: "Samira Bennani", rel: "Mère", phone: "+212 6XX XXX X01", primary: true },
                { name: "Nadia Alami", rel: "Sœur", phone: "+212 6XX XXX X02", primary: false },
              ].map((c, i) => (
                <div key={i} className="flex items-center gap-3 py-3 border-b last:border-0" style={{ borderColor: "var(--color-border)" }}>
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-lg"
                    style={{ background: c.primary ? "rgba(197,48,48,0.1)" : "rgba(225,29,72,0.08)" }}>
                    {c.primary ? "⭐" : "👤"}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{c.name}</div>
                    <div className="text-xs" style={{ color: "var(--color-muted)" }}>{c.rel} · {c.phone}</div>
                  </div>
                  <button className="btn btn-sm btn-ghost" style={{ color: "var(--color-rose-600)" }}>✏️</button>
                </div>
              ))}
              <button className="btn btn-outline w-full mt-4">+ Ajouter un contact</button>
            </div>

            <div className="card p-5">
              <h3 className="font-semibold mb-4" style={{ fontFamily: "var(--font-display)" }}>Sécurité du compte</h3>
              <SettingRow icon="🔐" label="Authentification à 2 facteurs" isToggle toggled={true} onClick={() => {}}/>
              <SettingRow icon="🔑" label="Changer le mot de passe"/>
              <SettingRow icon="📍" label="Partage de position en temps réel" isToggle toggled={shareLocation} onClick={() => setShareLocation(!shareLocation)}/>
              <SettingRow icon="📋" label="Sessions actives"/>
            </div>

            <div className="p-4 rounded-2xl" style={{ background: "rgba(197,48,48,0.06)", border: "1px solid rgba(197,48,48,0.2)" }}>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xl">🆘</span>
                <span className="font-semibold text-red-700 text-sm">Bouton SOS</span>
              </div>
              <p className="text-xs" style={{ color: "var(--color-muted)" }}>
                Le bouton SOS rouge en bas à droite est toujours visible pendant un trajet.
                Maintenez appuyé 3 secondes pour envoyer une alerte d'urgence à vos contacts et à notre équipe.
              </p>
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {tab === "notifications" && (
          <div className="card p-5">
            <h3 className="font-semibold mb-4" style={{ fontFamily: "var(--font-display)" }}>Préférences de notification</h3>
            <SettingRow icon="📲" label="Notifications push" value="Recevoir des alertes temps réel" isToggle toggled={pushNotifs} onClick={() => setPushNotifs(!pushNotifs)}/>
            <SettingRow icon="💬" label="Notifications SMS" value="Alertes importantes par SMS" isToggle toggled={smsNotifs} onClick={() => setSmsNotifs(!smsNotifs)}/>
            <SettingRow icon="📧" label="Notifications email" value="Résumé hebdomadaire" isToggle toggled={emailNotifs} onClick={() => setEmailNotifs(!emailNotifs)}/>
            <div className="divider my-4"/>
            <h4 className="text-sm font-semibold mb-3" style={{ color: "var(--color-silver-700)" }}>Types de notifications</h4>
            <SettingRow icon="🚗" label="Mises à jour du trajet" isToggle toggled={true} onClick={() => {}}/>
            <SettingRow icon="💳" label="Transactions wallet" isToggle toggled={true} onClick={() => {}}/>
            <SettingRow icon="🎁" label="Promotions et offres" isToggle toggled={false} onClick={() => {}}/>
            <SettingRow icon="⭐" label="Rappels d'évaluation" isToggle toggled={true} onClick={() => {}}/>
          </div>
        )}

        {/* Language Tab */}
        {tab === "language" && (
          <div className="flex flex-col gap-4">
            <div className="card p-5">
              <h3 className="font-semibold mb-4" style={{ fontFamily: "var(--font-display)" }}>Langue de l'application</h3>
              {[
                { id: "fr" as const, flag: "🇫🇷", label: "Français", native: "Français" },
                { id: "ar" as const, flag: "🇲🇦", label: "Arabe", native: "العربية" },
                { id: "en" as const, flag: "🇬🇧", label: "Anglais", native: "English" },
              ].map(l => (
                <button key={l.id} onClick={() => setLang(l.id)}
                  className="flex items-center gap-4 w-full py-4 border-b last:border-0 transition-colors"
                  style={{ borderColor: "var(--color-border)" }}>
                  <span className="text-2xl">{l.flag}</span>
                  <div className="flex-1 text-left">
                    <div className="text-sm font-medium">{l.label}</div>
                    <div className="text-xs" style={{ color: "var(--color-muted)", fontFamily: l.id === "ar" ? "var(--font-arabic)" : undefined }}>{l.native}</div>
                  </div>
                  {lang === l.id && <div className="w-5 h-5 rounded-full flex items-center justify-center text-black text-xs" style={{ background: "var(--color-purple-500)" }}>✓</div>}
                </button>
              ))}
            </div>
            <div className="p-4 rounded-2xl" style={{ background: "rgba(225,29,72,0.08)", border: "1px solid rgba(225,29,72,0.2)" }}>
              <p className="text-xs" style={{ color: "var(--color-rose-700)" }}>
                🌍 L'application supporte le RTL (droite à gauche) en arabe automatiquement.
              </p>
            </div>
          </div>
        )}

        {/* Logout */}
        <div className="mt-6 mb-4">
          <button className="btn btn-outline w-full" style={{ borderColor: "rgba(197,48,48,0.3)", color: "#C53030" }}
            onClick={handleLogout}>
            🚪 Se déconnecter
          </button>
        </div>
        <p className="text-center text-xs mb-6" style={{ color: "var(--color-silver-300)" }}>SheDrive Morocco v1.0.0</p>
      </div>

      <BottomNav active="profile"/>
    </div>
  );
}
