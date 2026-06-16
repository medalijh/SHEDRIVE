"use client";

import React, { useState } from "react";
import Link from "next/link";
import NextImage from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { useToastStore } from "@/store/useToastStore";
import { Home, Car, Clock, CreditCard, Settings, User, ShieldCheck, Bell, Globe, Pencil, Cake, MapPin, Image as ImageIcon, Gift, Trash2, Star, Lock, Key, List, ShieldAlert, Smartphone, MessageSquare, Mail, LogOut, Check, Save } from "lucide-react";

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
          <div className="nav-icon">{item.icon}</div><span>{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}

type Tab = "account" | "safety" | "notifications" | "language";

const SettingRow = ({ icon, label, value, onClick, isToggle, toggled }: {
  icon: React.ReactNode; label: string; value?: string; onClick?: () => void; isToggle?: boolean; toggled?: boolean;
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
  const { user, profile, signOut, refreshProfile } = useAuth();
  const router = useRouter();

  const [tab, setTab] = useState<Tab>("account");
  const [pushNotifs, setPushNotifs] = useState(true);
  const [smsNotifs, setSmsNotifs] = useState(true);
  const [emailNotifs, setEmailNotifs] = useState(false);
  const [shareLocation, setShareLocation] = useState(true);
  const [lang, setLang] = useState<"fr" | "ar" | "en">("fr");
  const [editField, setEditField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [saving, setSaving] = useState(false);

  const handleEditField = (field: string, currentValue: string) => {
    setEditField(field);
    setEditValue(currentValue || "");
  };

  const handleSaveField = async () => {
    if (!profile?.id || !isSupabaseConfigured() || !editField) return;
    setSaving(true);
    try {
      const supabase = getSupabaseClient();
      const updateData: Record<string, string> = {};
      updateData[editField] = editValue;
      const { error } = await supabase.from("profiles").update(updateData).eq("id", profile.id);
      if (error) {
        useToastStore.getState().addToast("Erreur: " + error.message, "error");
      } else {
        useToastStore.getState().addToast("Profil mis à jour", "success");
        await refreshProfile();
        setEditField(null);
      }
    } catch {
      useToastStore.getState().addToast("Erreur serveur", "error");
    }
    setSaving(false);
  };

  const tabs: { id: Tab; icon: React.ReactNode; label: string }[] = [
    { id: "account", icon: <User size={24} />, label: "Compte" },
    { id: "safety", icon: <ShieldCheck size={24} />, label: "Sécurité" },
    { id: "notifications", icon: <Bell size={24} />, label: "Notifs" },
    { id: "language", icon: <Globe size={24} />, label: "Langue" },
  ];

  const handleLogout = async () => {
    if (confirm("Voulez-vous vous deconnecter ?")) {
      await signOut();
    }
  };

  return (
    <div className="container-app mx-auto pb-28" style={{ background: "var(--color-silver-50)", minHeight: "100vh" }}>
      {/* Tulips Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <NextImage src="/tulips.png" alt="" fill className="object-cover opacity-[0.03]" />
      </div>
      <div className="px-6 pt-12 pb-4 relative z-10">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/passenger/dashboard" className="btn btn-icon-sm btn-ghost text-xl">←</Link>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>Paramètres</h1>
        </div>

        {/* Profile Card */}
        <div className="card-luxury p-5 flex items-center gap-5 mb-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-3xl flex items-center justify-center text-white"
              style={{ background: "linear-gradient(135deg, var(--color-rose-400), var(--color-rose-600))" }}>
              <User size={40} />
            </div>
            <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center text-white"
              style={{ background: "var(--color-purple-400)", color: "white" }}>
              <Pencil size={14} />
            </button>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-semibold truncate" style={{ fontFamily: "var(--font-display)" }}>
              {profile?.full_name || "Passagère"}
            </h2>
            <p className="text-sm truncate" style={{ color: "var(--color-muted)" }}>{profile?.phone || user?.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="badge badge-success flex items-center gap-1" style={{ fontSize: 10 }}><Check size={10}/> Vérifié</span>
              <span className="badge badge-primary flex items-center gap-1" style={{ fontSize: 10 }}><Star size={10} className="fill-current"/> {profile?.rating?.toFixed(1) || "N/A"}</span>
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
              <span className="text-purple-600">{t.icon}</span>
              <span className="text-xs font-medium">{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 relative z-10">
        {/* Account Tab */}
        {tab === "account" && (
          <div className="card p-5">
            <SettingRow icon={<User size={20} />} label="Nom complet" value={profile?.full_name} onClick={() => handleEditField("full_name", profile?.full_name || "")}/>
            <SettingRow icon={<Smartphone size={20} />} label="Telephone" value={profile?.phone || "Non renseigné"} onClick={() => handleEditField("phone", profile?.phone || "")}/>
            <SettingRow icon={<Mail size={20} />} label="Email" value={user?.email}/>
            <SettingRow icon={<Cake size={20} />} label="Date de naissance" value="Non renseignee"/>
            <SettingRow icon={<MapPin size={20} />} label="Ville préférée" value={profile?.city || "Non renseignee"}/>
            <SettingRow icon={<ImageIcon size={20} />} label="Photo de profil"/>
            <SettingRow icon={<Gift size={20} />} label="Mon code de parrainage" value="SHEDRIVE2026"/>
            <SettingRow icon={<Trash2 size={20} />} label="Supprimer mon compte"/>
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
                    style={{ background: c.primary ? "rgba(197,48,48,0.1)" : "rgba(225,29,72,0.08)", color: c.primary ? "var(--color-rose-600)" : "var(--color-purple-600)" }}>
                    {c.primary ? <Star size={20} className="fill-current" /> : <User size={20} />}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{c.name}</div>
                    <div className="text-xs" style={{ color: "var(--color-muted)" }}>{c.rel} · {c.phone}</div>
                  </div>
                  <button className="btn btn-sm btn-ghost" style={{ color: "var(--color-rose-600)" }}><Pencil size={16}/></button>
                </div>
              ))}
              <button className="btn btn-outline w-full mt-4">+ Ajouter un contact</button>
            </div>

            <div className="card p-5">
              <h3 className="font-semibold mb-4" style={{ fontFamily: "var(--font-display)" }}>Sécurité du compte</h3>
              <SettingRow icon={<Lock size={20} />} label="Authentification à 2 facteurs" isToggle toggled={true} onClick={() => {}}/>
              <SettingRow icon={<Key size={20} />} label="Changer le mot de passe"/>
              <SettingRow icon={<MapPin size={20} />} label="Partage de position en temps réel" isToggle toggled={shareLocation} onClick={() => setShareLocation(!shareLocation)}/>
              <SettingRow icon={<List size={20} />} label="Sessions actives"/>
            </div>

            <div className="p-4 rounded-2xl" style={{ background: "rgba(197,48,48,0.06)", border: "1px solid rgba(197,48,48,0.2)" }}>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-red-700"><ShieldAlert size={24} /></span>
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
            <SettingRow icon={<Smartphone size={20} />} label="Notifications push" value="Recevoir des alertes temps réel" isToggle toggled={pushNotifs} onClick={() => setPushNotifs(!pushNotifs)}/>
            <SettingRow icon={<MessageSquare size={20} />} label="Notifications SMS" value="Alertes importantes par SMS" isToggle toggled={smsNotifs} onClick={() => setSmsNotifs(!smsNotifs)}/>
            <SettingRow icon={<Mail size={20} />} label="Notifications email" value="Résumé hebdomadaire" isToggle toggled={emailNotifs} onClick={() => setEmailNotifs(!emailNotifs)}/>
            <div className="divider my-4"/>
            <h4 className="text-sm font-semibold mb-3" style={{ color: "var(--color-silver-700)" }}>Types de notifications</h4>
            <SettingRow icon={<Car size={20} />} label="Mises à jour du trajet" isToggle toggled={true} onClick={() => {}}/>
            <SettingRow icon={<CreditCard size={20} />} label="Transactions wallet" isToggle toggled={true} onClick={() => {}}/>
            <SettingRow icon={<Gift size={20} />} label="Promotions et offres" isToggle toggled={false} onClick={() => {}}/>
            <SettingRow icon={<Star size={20} />} label="Rappels d'évaluation" isToggle toggled={true} onClick={() => {}}/>
          </div>
        )}

        {/* Language Tab */}
        {tab === "language" && (
          <div className="flex flex-col gap-4">
            <div className="card p-5">
              <h3 className="font-semibold mb-4" style={{ fontFamily: "var(--font-display)" }}>Langue de l'application</h3>
              {[
                { id: "fr" as const, flag: "FR", label: "Français", native: "Français" },
                { id: "ar" as const, flag: "MA", label: "Arabe", native: "العربية" },
                { id: "en" as const, flag: "GB", label: "Anglais", native: "English" },
              ].map(l => (
                <button key={l.id} onClick={() => setLang(l.id)}
                  className="flex items-center gap-4 w-full py-4 border-b last:border-0 transition-colors"
                  style={{ borderColor: "var(--color-border)" }}>
                  <span className="text-sm font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded">{l.flag}</span>
                  <div className="flex-1 text-left">
                    <div className="text-sm font-medium">{l.label}</div>
                    <div className="text-xs" style={{ color: "var(--color-muted)", fontFamily: l.id === "ar" ? "var(--font-arabic)" : undefined }}>{l.native}</div>
                  </div>
                  {lang === l.id && <div className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs" style={{ background: "var(--color-purple-500)" }}><Check size={12}/></div>}
                </button>
              ))}
            </div>
            <div className="p-4 rounded-2xl" style={{ background: "rgba(225,29,72,0.08)", border: "1px solid rgba(225,29,72,0.2)" }}>
              <p className="text-xs flex items-center gap-1" style={{ color: "var(--color-rose-700)" }}>
                <Globe size={14}/> L'application supporte le RTL (droite à gauche) en arabe automatiquement.
              </p>
            </div>
          </div>
        )}

        {/* Logout */}
        <div className="mt-6 mb-4">
          <button className="btn btn-outline w-full flex items-center justify-center gap-2" style={{ borderColor: "rgba(197,48,48,0.3)", color: "#C53030" }}
            onClick={handleLogout}>
            <LogOut size={18} /> Se déconnecter
          </button>
        </div>
        <p className="text-center text-xs mb-6" style={{ color: "var(--color-silver-300)" }}>SheDrive Morocco v1.0.0</p>
      </div>

      {/* Edit Field Modal */}
      {editField && (
        <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }} onClick={() => setEditField(null)}>
          <div className="w-full max-w-md bg-white rounded-t-3xl p-6 pb-10" onClick={e => e.stopPropagation()}>
            <div className="w-10 h-1 rounded-full mx-auto mb-6" style={{ background: "var(--color-silver-300)" }}/>
            <h3 className="text-lg font-semibold mb-4" style={{ fontFamily: "var(--font-display)" }}>
              Modifier {editField === "full_name" ? "le nom" : editField === "phone" ? "le telephone" : editField}
            </h3>
            <input
              type="text"
              value={editValue}
              onChange={e => setEditValue(e.target.value)}
              className="input-field w-full mb-4"
              placeholder={editField === "full_name" ? "Votre nom complet" : "Votre numero de telephone"}
            />
            <button onClick={handleSaveField} disabled={saving} className="btn btn-primary w-full flex items-center justify-center gap-2">
              {saving ? (
                <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>Enregistrement...</span>
              ) : (
                <><Save size={18}/> Enregistrer</>
              )}
            </button>
          </div>
        </div>
      )}

      <BottomNav active="profile"/>
    </div>
  );
}
