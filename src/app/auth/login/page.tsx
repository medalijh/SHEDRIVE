"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

type AuthTab = "login" | "register";
type Role = "passenger" | "driver";

// Step indicator component
function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {Array.from({ length: total }).map((_, i) => (
        <React.Fragment key={i}>
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300"
            style={{
              background: i < current
                ? "linear-gradient(135deg, var(--color-rose-gold-500), var(--color-rose-gold-700))"
                : i === current
                ? "linear-gradient(135deg, var(--color-rose-gold-400), var(--color-rose-gold-600))"
                : "var(--color-sand-100)",
              color: i <= current ? "white" : "var(--color-muted)",
              boxShadow: i === current ? "var(--shadow-rose)" : "none",
              transform: i === current ? "scale(1.1)" : "scale(1)",
            }}
          >
            {i < current ? "✓" : i + 1}
          </div>
          {i < total - 1 && (
            <div
              className="flex-1 h-0.5 transition-all duration-300"
              style={{
                background: i < current - 1
                  ? "linear-gradient(90deg, var(--color-rose-gold-400), var(--color-rose-gold-300))"
                  : "var(--color-sand-200)",
              }}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

// Login Form
function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    // Mock login — replace with Supabase auth
    await new Promise((r) => setTimeout(r, 1500));
    router.push("/passenger/dashboard");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: "var(--color-sand-700)" }}>
          Email ou Téléphone
        </label>
        <input
          type="text"
          className="input-field"
          placeholder="+212 6XX XXX XXX ou email@exemple.ma"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: "var(--color-sand-700)" }}>
          Mot de passe
        </label>
        <div className="relative">
          <input
            type={showPass ? "text" : "password"}
            className="input-field pr-12"
            placeholder="••••••••"
            required
          />
          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-lg"
            style={{ color: "var(--color-muted)" }}
          >
            {showPass ? "🙈" : "👁️"}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" className="accent-rose-500 w-4 h-4" />
          <span className="text-sm" style={{ color: "var(--color-muted)" }}>
            Se souvenir de moi
          </span>
        </label>
        <Link href="/auth/forgot-password" className="text-sm font-medium" style={{ color: "var(--color-rose-gold-600)" }}>
          Mot de passe oublié ?
        </Link>
      </div>

      {error && (
        <div className="p-3 rounded-xl text-sm text-red-700" style={{ background: "rgba(229,62,62,0.1)" }}>
          ⚠️ {error}
        </div>
      )}

      <button type="submit" className="btn btn-primary btn-lg w-full" disabled={loading}>
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Connexion en cours...
          </span>
        ) : (
          "Se connecter →"
        )}
      </button>

      <div className="relative flex items-center gap-4">
        <div className="flex-1 divider" />
        <span className="text-xs" style={{ color: "var(--color-muted)" }}>OU</span>
        <div className="flex-1 divider" />
      </div>

      <button type="button" className="btn btn-outline btn-lg w-full gap-3">
        <span>📱</span>
        <span>Connexion par SMS</span>
      </button>
    </form>
  );
}

// Passenger Registration
function PassengerRegisterForm() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const totalSteps = 4;

  const steps = [
    {
      title: "Informations personnelles",
      titleAr: "المعلومات الشخصية",
      fields: (
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "var(--color-sand-700)" }}>
              Nom complet *
            </label>
            <input className="input-field" type="text" placeholder="Fatima Zahra Bennani" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "var(--color-sand-700)" }}>
              Date de naissance *
            </label>
            <input className="input-field" type="date" required />
          </div>
          <div className="p-3 rounded-xl text-sm" style={{ background: "rgba(13,122,74,0.08)", color: "var(--color-emerald-700)", border: "1px solid rgba(13,122,74,0.2)" }}>
            🌸 SheDrive Morocco est un service exclusivement féminin.
          </div>
        </div>
      ),
    },
    {
      title: "Coordonnées",
      titleAr: "معلومات الاتصال",
      fields: (
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "var(--color-sand-700)" }}>
              Numéro de téléphone marocain *
            </label>
            <div className="flex gap-2">
              <div className="btn btn-sm" style={{ background: "var(--color-sand-100)", color: "var(--color-text)", border: "1.5px solid var(--color-border)", borderRadius: "var(--radius-md)", padding: "14px 12px", fontSize: "0.875rem", cursor: "default" }}>
                🇲🇦 +212
              </div>
              <input className="input-field flex-1" type="tel" placeholder="6XX XXX XXX" required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "var(--color-sand-700)" }}>
              Email (optionnel)
            </label>
            <input className="input-field" type="email" placeholder="votre@email.ma" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "var(--color-sand-700)" }}>
              Mot de passe *
            </label>
            <input className="input-field" type="password" placeholder="Minimum 8 caractères" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "var(--color-sand-700)" }}>
              Ville principale *
            </label>
            <select className="input-field">
              {[
                "Casablanca", "Rabat", "Marrakech", "Fès", "Agadir",
                "Tanger", "Meknès", "Oujda", "Tétouan", "Salé",
              ].map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>
      ),
    },
    {
      title: "Vérification du téléphone",
      titleAr: "التحقق من رقم الهاتف",
      fields: (
        <div className="flex flex-col gap-6 items-center text-center">
          <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl"
            style={{ background: "rgba(200,149,108,0.1)" }}>
            📱
          </div>
          <div>
            <p className="font-medium mb-2">Code envoyé par SMS</p>
            <p className="text-sm" style={{ color: "var(--color-muted)" }}>
              Entrez le code à 6 chiffres envoyé au +212 6XX XXX XXX
            </p>
          </div>
          <div className="flex gap-3 justify-center">
            {Array.from({ length: 6 }).map((_, i) => (
              <input
                key={i}
                type="text"
                maxLength={1}
                className="w-12 h-14 text-center text-xl font-bold border-2 rounded-xl"
                style={{ borderColor: "var(--color-rose-gold-300)", color: "var(--color-text)" }}
              />
            ))}
          </div>
          <button className="text-sm" style={{ color: "var(--color-rose-gold-600)" }}>
            Renvoyer le code →
          </button>
        </div>
      ),
    },
    {
      title: "Contacts d'urgence",
      titleAr: "جهات الطوارئ",
      fields: (
        <div className="flex flex-col gap-4">
          <div className="p-4 rounded-2xl" style={{ background: "rgba(197,48,48,0.08)", border: "1px solid rgba(197,48,48,0.2)" }}>
            <p className="text-sm font-semibold text-red-700 mb-1">🆘 Contact d'urgence SOS</p>
            <p className="text-xs" style={{ color: "var(--color-muted)" }}>
              En cas d'urgence, cette personne sera alertée automatiquement avec votre position GPS.
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "var(--color-sand-700)" }}>
              Nom du contact *
            </label>
            <input className="input-field" type="text" placeholder="Prénom Nom" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "var(--color-sand-700)" }}>
              Téléphone du contact *
            </label>
            <div className="flex gap-2">
              <div style={{ background: "var(--color-sand-100)", color: "var(--color-text)", border: "1.5px solid var(--color-border)", borderRadius: "var(--radius-md)", padding: "14px 12px", fontSize: "0.875rem" }}>
                🇲🇦 +212
              </div>
              <input className="input-field flex-1" type="tel" placeholder="6XX XXX XXX" required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "var(--color-sand-700)" }}>
              Relation
            </label>
            <select className="input-field">
              {["Mère", "Sœur", "Amie", "Collègue", "Mari", "Père", "Autre"].map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </div>
        </div>
      ),
    },
  ];

  const handleNext = async () => {
    if (step < totalSteps - 1) {
      setStep(step + 1);
    } else {
      setLoading(true);
      await new Promise((r) => setTimeout(r, 1500));
      router.push("/passenger/dashboard");
    }
  };

  return (
    <div>
      <StepIndicator current={step} total={totalSteps} />
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-1" style={{ fontFamily: "var(--font-display)" }}>
          {steps[step].title}
        </h3>
        <p className="text-xs" style={{ color: "var(--color-muted)", fontFamily: "var(--font-arabic)", direction: "rtl" }}>
          {steps[step].titleAr}
        </p>
      </div>

      {steps[step].fields}

      <div className="flex gap-3 mt-6">
        {step > 0 && (
          <button
            type="button"
            onClick={() => setStep(step - 1)}
            className="btn btn-outline flex-1"
          >
            ← Retour
          </button>
        )}
        <button
          type="button"
          onClick={handleNext}
          className="btn btn-primary flex-1"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Finalisation...
            </span>
          ) : step < totalSteps - 1 ? (
            "Continuer →"
          ) : (
            "🌹 Créer mon compte"
          )}
        </button>
      </div>
    </div>
  );
}

// Driver Registration
function DriverRegisterForm() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const totalSteps = 5;

  const steps = [
    {
      title: "Informations personnelles",
      content: (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Nom complet *</label>
              <input className="input-field" type="text" placeholder="Khadija Alami" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Téléphone *</label>
              <div className="flex gap-2">
                <div style={{ background: "var(--color-sand-100)", border: "1.5px solid var(--color-border)", borderRadius: "var(--radius-md)", padding: "14px 12px" }}>🇲🇦 +212</div>
                <input className="input-field flex-1" type="tel" placeholder="6XX XXX XXX" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email *</label>
              <input className="input-field" type="email" placeholder="conductrice@email.ma" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Mot de passe *</label>
              <input className="input-field" type="password" placeholder="Minimum 8 caractères" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Ville d'opération *</label>
              <select className="input-field">
                {["Casablanca", "Rabat", "Marrakech", "Fès", "Agadir", "Tanger"].map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Carte Nationale d'Identité (CIN)",
      content: (
        <div className="flex flex-col gap-5">
          <div className="p-4 rounded-2xl" style={{ background: "rgba(200,149,108,0.08)", border: "1px solid rgba(200,149,108,0.2)" }}>
            <p className="text-sm font-medium mb-1" style={{ color: "var(--color-rose-gold-700)" }}>
              📋 Vérification d'identité requise
            </p>
            <p className="text-xs" style={{ color: "var(--color-muted)" }}>
              Pour la sécurité de toutes les passagères, nous vérifions l'identité de chaque conductrice.
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Numéro de CIN *</label>
            <input className="input-field" type="text" placeholder="AB123456" />
          </div>
          {["Recto de la CIN", "Verso de la CIN"].map((label) => (
            <div key={label}>
              <label className="block text-sm font-medium mb-2">{label} *</label>
              <div className="border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer hover:border-rose-400 transition-colors"
                style={{ borderColor: "var(--color-rose-gold-300)" }}>
                <div className="text-3xl mb-2">📷</div>
                <p className="text-sm font-medium">Cliquez pour uploader</p>
                <p className="text-xs mt-1" style={{ color: "var(--color-muted)" }}>JPG, PNG ou PDF — max 5MB</p>
              </div>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: "Selfie de vérification",
      content: (
        <div className="flex flex-col gap-5 items-center text-center">
          <div className="w-24 h-24 rounded-full flex items-center justify-center text-5xl"
            style={{ background: "rgba(200,149,108,0.1)" }}>
            🤳
          </div>
          <div>
            <h4 className="font-semibold mb-2">Photo de vérification</h4>
            <p className="text-sm" style={{ color: "var(--color-muted)" }}>
              Prenez un selfie en tenant votre CIN visible pour vérifier que vous êtes bien la titulaire.
            </p>
          </div>
          <div className="w-full border-2 border-dashed rounded-2xl p-10 cursor-pointer hover:border-rose-400 transition-colors"
            style={{ borderColor: "var(--color-rose-gold-300)" }}>
            <div className="text-4xl mb-3">📸</div>
            <p className="font-medium text-sm">Prendre ou uploader une photo</p>
            <p className="text-xs mt-1" style={{ color: "var(--color-muted)" }}>Format carré recommandé</p>
          </div>
          <ul className="text-xs text-left w-full flex flex-col gap-2" style={{ color: "var(--color-muted)" }}>
            {["Visage clairement visible", "CIN tenue face à la caméra", "Bonne luminosité", "Fond neutre de préférence"].map((tip) => (
              <li key={tip} className="flex items-center gap-2">
                <span style={{ color: "var(--color-emerald-500)" }}>✓</span> {tip}
              </li>
            ))}
          </ul>
        </div>
      ),
    },
    {
      title: "Permis de conduire",
      content: (
        <div className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-medium mb-2">Numéro du permis *</label>
            <input className="input-field" type="text" placeholder="MC1234567" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Date d'expiration *</label>
            <input className="input-field" type="date" />
          </div>
          {["Recto du permis", "Verso du permis"].map((label) => (
            <div key={label}>
              <label className="block text-sm font-medium mb-2">{label} *</label>
              <div className="border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer"
                style={{ borderColor: "var(--color-rose-gold-300)" }}>
                <div className="text-3xl mb-2">🪪</div>
                <p className="text-sm font-medium">Cliquez pour uploader</p>
                <p className="text-xs mt-1" style={{ color: "var(--color-muted)" }}>JPG, PNG — max 5MB</p>
              </div>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: "Informations du véhicule",
      content: (
        <div className="flex flex-col gap-4">
          {[
            { label: "Marque *", placeholder: "Dacia, Renault, Peugeot..." },
            { label: "Modèle *", placeholder: "Logan, Sandero, 208..." },
            { label: "Année *", placeholder: "2018", type: "number" },
            { label: "Couleur *", placeholder: "Blanc, Gris, Noir..." },
            { label: "Plaque d'immatriculation *", placeholder: "123456 | A" },
          ].map((field) => (
            <div key={field.label}>
              <label className="block text-sm font-medium mb-2">{field.label}</label>
              <input className="input-field" type={field.type || "text"} placeholder={field.placeholder} />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium mb-2">Catégorie du véhicule *</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: "economy", label: "Économique", emoji: "🚗", desc: "Logan, Sandero..." },
                { id: "comfort", label: "Confort", emoji: "🚙", desc: "Duster, Megane..." },
                { id: "luxury", label: "Luxe", emoji: "✨", desc: "Mercedes, BMW..." },
                { id: "van", label: "Van / Monospace", emoji: "🚐", desc: "Kangoo, Berlingo..." },
              ].map((cat) => (
                <div key={cat.id} className="p-4 rounded-xl cursor-pointer border-2 transition-all"
                  style={{ borderColor: "var(--color-border)" }}>
                  <div className="text-2xl mb-1">{cat.emoji}</div>
                  <div className="text-sm font-semibold">{cat.label}</div>
                  <div className="text-xs" style={{ color: "var(--color-muted)" }}>{cat.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
    },
  ];

  const handleNext = async () => {
    if (step < totalSteps - 1) {
      setStep(step + 1);
    } else {
      setLoading(true);
      await new Promise((r) => setTimeout(r, 2000));
      router.push("/driver/dashboard");
    }
  };

  return (
    <div>
      <StepIndicator current={step} total={totalSteps} />
      <div className="mb-6">
        <h3 className="text-lg font-semibold" style={{ fontFamily: "var(--font-display)" }}>
          {steps[step].title}
        </h3>
      </div>
      {steps[step].content}
      <div className="flex gap-3 mt-6">
        {step > 0 && (
          <button type="button" onClick={() => setStep(step - 1)} className="btn btn-outline flex-1">
            ← Retour
          </button>
        )}
        <button type="button" onClick={handleNext} className="btn btn-primary flex-1" disabled={loading}>
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Soumission...
            </span>
          ) : step < totalSteps - 1 ? (
            "Continuer →"
          ) : (
            "🌸 Soumettre ma demande"
          )}
        </button>
      </div>
      {step === totalSteps - 1 && (
        <p className="text-xs text-center mt-4" style={{ color: "var(--color-muted)" }}>
          Votre dossier sera examiné dans les 24-48h. Vous recevrez une notification par SMS et email.
        </p>
      )}
    </div>
  );
}

// ============================================================
// MAIN AUTH PAGE (inner component reads searchParams)
// ============================================================
function AuthContent() {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("tab") || "login") as AuthTab;
  const initialRole = (searchParams.get("role") || "passenger") as Role;

  const [tab, setTab] = useState<AuthTab>(
    searchParams.get("role") ? "register" : initialTab
  );
  const [role, setRole] = useState<Role>(initialRole);

  return (
    <div className="min-h-screen flex" style={{ background: "var(--color-sand-50)" }}>
      {/* Left Panel (Desktop) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-12 bg-hero-gradient">
        <div className="zellige-pattern absolute inset-0 opacity-20" />

        {/* Decorative */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full -translate-y-1/2 translate-x-1/2"
          style={{ background: "radial-gradient(circle, rgba(200,149,108,0.2) 0%, transparent 70%)" }} />
        <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full translate-y-1/2 -translate-x-1/2"
          style={{ background: "radial-gradient(circle, rgba(13,122,74,0.15) 0%, transparent 70%)" }} />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
              style={{ background: "linear-gradient(135deg, var(--color-rose-gold-500), var(--color-rose-gold-700))" }}>
              🌹
            </div>
            <span className="text-xl font-bold text-white" style={{ fontFamily: "var(--font-display)" }}>
              SheDrive Morocco
            </span>
          </div>

          <h2 className="text-display-lg text-white mb-6">
            Bienvenue dans <br />
            <span className="gradient-text">votre espace</span>
          </h2>
          <p className="text-base mb-8" style={{ color: "rgba(255,255,255,0.6)" }}>
            La plateforme de transport exclusive pour les femmes marocaines.
            Sécurité, élégance, et liberté à chaque trajet.
          </p>
          <p style={{ fontFamily: "var(--font-arabic)", direction: "rtl", color: "rgba(255,255,255,0.4)", fontSize: "0.9rem" }}>
            منصة النقل الحصرية للمرأة المغربية — أمان وأناقة في كل رحلة
          </p>
        </div>

        <div className="relative z-10 grid grid-cols-3 gap-4">
          {[
            { emoji: "🛡️", label: "100% Sécurisé" },
            { emoji: "🌹", label: "100% Féminin" },
            { emoji: "🇲🇦", label: "100% Marocain" },
          ].map((f) => (
            <div key={f.label} className="text-center p-4 rounded-2xl"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(200,149,108,0.2)" }}>
              <div className="text-2xl mb-2">{f.emoji}</div>
              <div className="text-xs text-white font-medium">{f.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex flex-col justify-start overflow-y-auto">
        {/* Mobile Logo */}
        <div className="lg:hidden p-6 pb-0 flex items-center gap-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-base"
            style={{ background: "linear-gradient(135deg, var(--color-rose-gold-500), var(--color-rose-gold-700))" }}>
            🌹
          </div>
          <span className="font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--color-rose-gold-700)" }}>
            SheDrive Morocco
          </span>
        </div>

        <div className="flex-1 p-6 lg:p-12 flex flex-col justify-center max-w-md w-full mx-auto lg:mx-0">
          {/* Tab Switcher */}
          <div className="flex rounded-2xl p-1 mb-8" style={{ background: "var(--color-sand-100)" }}>
            {[
              { id: "login" as AuthTab, label: "Connexion" },
              { id: "register" as AuthTab, label: "S'inscrire" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all duration-200"
                style={{
                  background: tab === t.id ? "white" : "transparent",
                  color: tab === t.id ? "var(--color-rose-gold-700)" : "var(--color-muted)",
                  boxShadow: tab === t.id ? "var(--shadow-sm)" : "none",
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {tab === "login" ? (
            <>
              <div className="mb-6">
                <h1 className="text-display-sm mb-1">Bon retour 👋</h1>
                <p style={{ color: "var(--color-muted)", fontSize: "0.875rem" }}>
                  Connectez-vous à votre compte SheDrive
                </p>
              </div>
              <LoginForm />
            </>
          ) : (
            <>
              {/* Role Selector */}
              <div className="mb-6">
                <h1 className="text-display-sm mb-4">Créer un compte 🌹</h1>
                <p className="text-sm mb-4" style={{ color: "var(--color-muted)" }}>
                  Je souhaite m'inscrire en tant que :
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: "passenger" as Role, emoji: "🚗", label: "Passagère", sub: "راكبة" },
                    { id: "driver" as Role, emoji: "🌸", label: "Conductrice", sub: "سائقة" },
                  ].map((r) => (
                    <button
                      key={r.id}
                      onClick={() => setRole(r.id)}
                      className="p-4 rounded-2xl border-2 text-center transition-all duration-200"
                      style={{
                        borderColor: role === r.id ? "var(--color-rose-gold-400)" : "var(--color-border)",
                        background: role === r.id ? "rgba(200,149,108,0.06)" : "transparent",
                      }}
                    >
                      <div className="text-2xl mb-1">{r.emoji}</div>
                      <div className="text-sm font-semibold">{r.label}</div>
                      <div className="text-xs" style={{ color: "var(--color-muted)", fontFamily: "var(--font-arabic)" }}>{r.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              {role === "passenger" ? <PassengerRegisterForm /> : <DriverRegisterForm />}
            </>
          )}

          <p className="text-xs text-center mt-6" style={{ color: "var(--color-muted)" }}>
            En continuant, vous acceptez nos{" "}
            <Link href="/terms" className="underline" style={{ color: "var(--color-rose-gold-600)" }}>
              Conditions d'utilisation
            </Link>{" "}
            et notre{" "}
            <Link href="/privacy" className="underline" style={{ color: "var(--color-rose-gold-600)" }}>
              Politique de confidentialité
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

// Suspense wrapper — required for useSearchParams during static export
export default function AuthPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--color-sand-50)" }}>
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl animate-float"
              style={{ background: "linear-gradient(135deg,var(--color-rose-gold-500),var(--color-rose-gold-700))" }}>🌹</div>
            <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: "var(--color-rose-gold-400)" }}/>
          </div>
        </div>
      }
    >
      <AuthContent />
    </Suspense>
  );
}
