"use client";

import Link from "next/link";
import { ShieldCheck, UserCheck, Eye, EyeOff, Navigation, BrainCircuit, Lock, SearchCheck, CheckCircle2, Shield, Scale, TriangleAlert, BellRing } from "lucide-react";

function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50"
      style={{ background: "rgba(26,21,15,0.92)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(225,29,72,0.2)" }}>
      <div className="container-app mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-lg"
            style={{ background: "linear-gradient(135deg,var(--color-rose-500),var(--color-rose-700))" }}>🌹</div>
          <span className="text-lg font-bold text-white" style={{ fontFamily: "var(--font-display)" }}>SheDrive <span className="text-sm font-normal" style={{ color: "var(--color-rose-400)" }}>Morocco</span></span>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/auth/login" className="btn btn-sm btn-ghost text-white">Connexion</Link>
          <Link href="/auth/register" className="btn btn-sm btn-primary">S'inscrire</Link>
        </div>
      </div>
    </nav>
  );
}

export default function SafetyPage() {
  const features = [
    { level: "Basique", icon: <UserCheck size={28} />, title: "Vérification CIN & Selfie", titleAr: "التحقق من الهوية والصورة", desc: "Chaque conductrice et passagère doit soumettre sa CIN marocaine et un selfie en temps réel avant d'utiliser l'application." },
    { level: "Basique", icon: <SearchCheck size={28} />, title: "Antécédents & Permis", titleAr: "فحص السوابق والرخصة", desc: "Les conductrices passent par une vérification stricte de leur permis de conduire et de leurs antécédents." },
    { level: "Standard", icon: <Navigation size={28} />, title: "Suivi GPS 24/7", titleAr: "تتبع مسار الرحلة", desc: "Le trajet est enregistré en temps réel. En cas d'arrêt prolongé ou de déviation de l'itinéraire, notre équipe est alertée." },
    { level: "Standard", icon: <Eye size={28} />, title: "Partage de Position", titleAr: "مشاركة الموقع مع العائلة", desc: "Partagez votre position en direct avec jusqu'à 5 contacts de confiance pendant toute la durée du trajet." },
    { level: "Standard", icon: <EyeOff size={28} />, title: "Anonymat des Numéros", titleAr: "حماية رقم الهاتف", desc: "Les appels entre passagères et conductrices passent par notre système pour garder les numéros privés." },
    { level: "Avancé", icon: <BrainCircuit size={28} />, title: "IA Anti-Fraude", titleAr: "الذكاء الاصطناعي ضد الاحتيال", desc: "Notre intelligence artificielle détecte les comportements suspects et bloque automatiquement les faux profils." },
    { level: "Protection", icon: <Lock size={28} />, title: "Bouton SOS d'Urgence", titleAr: "زر الطوارئ", desc: "Un bouton rouge toujours visible. S'il est activé, notre équipe de sécurité locale intervient immédiatement." },
    { level: "Protection", icon: <ShieldCheck size={28} />, title: "Support Dédié 24/7", titleAr: "دعم مخصص 24/7", desc: "Une équipe d'assistance exclusivement féminine basée au Maroc, disponible jour et nuit pour vous accompagner." },
  ];

  const levelColor: Record<string, string> = {
    "Basique": "var(--color-blue-600)",
    "Standard": "var(--color-purple-600)",
    "Avancé": "var(--color-purple-600)",
    "Protection": "var(--color-rose-700)",
  };

  return (
    <div style={{ background: "var(--color-silver-50)" }}>
      <Navbar />

      {/* Hero */}
      <section className="pt-28 pb-20 px-6 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0A1F15 0%, #0D2A1A 50%, #121A10 100%)" }}>
        <div className="zellige-pattern absolute inset-0 opacity-10"/>
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full -translate-y-1/2 translate-x-1/2"
          style={{ background: "radial-gradient(circle,rgba(147,51,234,0.2) 0%,transparent 70%)" }}/>
        <div className="container-app mx-auto text-center relative z-10">
          <span className="badge mb-6 text-xs tracking-widest" style={{ background: "rgba(147,51,234,0.2)", color: "#4DBF8A", border: "1px solid rgba(147,51,234,0.3)" }}>VOTRE SÉCURITÉ</span>
          <h1 className="text-display-xl text-white mb-6">
            Sécurité de Niveau<br/>
            <span className="gradient-text-emerald">Entreprise</span>
          </h1>
          <p className="text-base max-w-xl mx-auto mb-8" style={{ color: "rgba(255,255,255,0.6)", lineHeight: "1.8" }}>
            SheDrive Morocco intègre les technologies de sécurité les plus avancées du secteur. Chaque trajet est protégé par plusieurs couches de sécurité simultanées.
          </p>
          <p className="text-sm" style={{ fontFamily: "var(--font-arabic)", direction: "rtl", color: "rgba(255,255,255,0.4)" }}>
            أمانك هو أولويتنا القصوى في كل رحلة
          </p>
        </div>
      </section>

      {/* OWASP Badge */}
      <section className="py-10 px-6" style={{ background: "var(--color-ivory-100)" }}>
        <div className="container-app mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-center">
            {[
              { icon: <Shield size={24} />, label: "OWASP Top 10", sub: "Conformité complète" },
              { icon: <Lock size={24} />, label: "RGPD / CNDP", sub: "Protection des données" },
              { icon: <CheckCircle2 size={24} />, label: "ISO 27001", sub: "Standard sécurité info" },
              { icon: <Scale size={24} />, label: "Droit marocain", sub: "Loi 09-08 conforme" },
            ].map(b => (
              <div key={b.label} className="flex items-center gap-3 px-6 py-4 rounded-2xl"
                style={{ background: "white", border: "1px solid var(--color-border)", minWidth: "180px" }}>
                <div className="text-emerald-600">{b.icon}</div>
                <div className="text-left">
                  <div className="text-sm font-semibold">{b.label}</div>
                  <div className="text-xs" style={{ color: "var(--color-muted)" }}>{b.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Features */}
      <section className="py-20 px-6">
        <div className="container-app mx-auto">
          <div className="text-center mb-14">
            <span className="badge badge-success mb-4 text-xs">8 COUCHES DE SÉCURITÉ</span>
            <h2 className="text-display-lg">Chaque couche <span className="gradient-text">vous protège</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(f => (
              <div key={f.title} className="card-luxury p-6 hover:scale-[1.01] transition-transform duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-emerald-600"
                    style={{ background: "rgba(147,51,234,0.08)" }}>{f.icon}</div>
                  <span className="text-xs font-semibold px-2 py-1 rounded-full"
                    style={{ background: `${levelColor[f.level]}15`, color: levelColor[f.level] }}>
                    {f.level}
                  </span>
                </div>
                <h3 className="font-semibold mb-1" style={{ fontFamily: "var(--font-display)" }}>{f.title}</h3>
                <p className="text-xs mb-3" style={{ fontFamily: "var(--font-arabic)", direction: "rtl", color: "var(--color-muted)" }}>{f.titleAr}</p>
                <p className="text-sm leading-relaxed" style={{ color: "var(--color-muted)" }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SOS Section */}
      <section className="py-20 px-6 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #7B1919 0%, #5C0F0F 100%)" }}>
        <div className="zellige-pattern absolute inset-0 opacity-10"/>
        <div className="container-app mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-6xl mb-6 animate-float flex"><TriangleAlert size={64} className="text-red-400" /></div>
              <h2 className="text-display-lg text-white mb-4">Le Bouton SOS<br/><span style={{ color: "rgba(255,150,150,0.9)" }}>Toujours à portée</span></h2>
              <p className="mb-6" style={{ color: "rgba(255,255,255,0.7)", lineHeight: "1.8" }}>
                Le bouton SOS rouge est visible en permanence sur votre écran pendant tout trajet. En cas de danger, maintenez-le 3 secondes pour déclencher une alerte complète.
              </p>
              <ul className="flex flex-col gap-3">
                {["Alerte immédiate à vos contacts de confiance", "Notification en temps réel à notre équipe de sécurité", "Partage automatique de votre position GPS", "Enregistrement de la session pour les autorités"].map(item => (
                  <li key={item} className="flex items-center gap-3 text-sm" style={{ color: "rgba(255,255,255,0.8)" }}>
                    <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 text-white" style={{ background: "rgba(255,255,255,0.2)" }}><CheckCircle2 size={12} /></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex justify-center">
              <div className="w-40 h-40 rounded-full flex flex-col items-center justify-center cursor-pointer"
                style={{ background: "linear-gradient(135deg,#E53E3E,#9B2C2C)", boxShadow: "0 0 60px rgba(229,62,62,0.5), 0 0 0 20px rgba(229,62,62,0.1)", animation: "sos-pulse 2s infinite" }}>
                <span className="text-white text-4xl font-bold mb-1">SOS</span>
                <span className="text-white opacity-80"><BellRing size={28} /></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 text-center" style={{ background: "var(--color-silver-50)" }}>
        <div className="container-app mx-auto">
          <h2 className="text-display-lg mb-6">Voyagez en toute <span className="gradient-text">confiance</span></h2>
          <p className="mb-8" style={{ color: "var(--color-muted)" }}>Rejoignez des milliers de femmes qui font confiance à SheDrive Morocco.</p>
          <Link href="/auth/register" className="btn btn-primary btn-lg">Commencer maintenant →</Link>
        </div>
      </section>

      <footer style={{ background: "#F3F4F6", color: "rgba(255,255,255,0.5)" }}>
        <div className="container-app mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="SheDrive Logo" className="w-10 h-10 object-cover rounded-full border border-rose-gold-200" />
            <span className="font-bold text-white" style={{ fontFamily: "var(--font-display)" }}>SheDrive Morocco</span>
          </div>
          <p className="text-xs">© 2025 SheDrive Morocco. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}
