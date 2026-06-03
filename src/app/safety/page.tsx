"use client";

import Link from "next/link";

function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50"
      style={{ background: "rgba(26,21,15,0.92)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(200,149,108,0.2)" }}>
      <div className="container-app mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-lg"
            style={{ background: "linear-gradient(135deg,var(--color-rose-gold-500),var(--color-rose-gold-700))" }}>🌹</div>
          <span className="text-lg font-bold text-white" style={{ fontFamily: "var(--font-display)" }}>SheDrive <span className="text-sm font-normal" style={{ color: "var(--color-rose-gold-400)" }}>Morocco</span></span>
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
    { icon: "🆘", title: "Bouton SOS", titleAr: "زر الطوارئ", desc: "En cas d'urgence, maintenez le bouton SOS. Une alerte immédiate est envoyée à vos contacts de confiance et à notre équipe, avec votre position GPS en temps réel.", level: "Critique" },
    { icon: "📡", title: "GPS Temps Réel", titleAr: "تتبع GPS فوري", desc: "Chaque trajet est tracé en temps réel sur nos serveurs. Vous pouvez partager votre position avec vos proches via un lien sécurisé.", level: "Essentiel" },
    { icon: "🔐", title: "Chiffrement E2E", titleAr: "تشفير من طرف إلى طرف", desc: "Tous les messages échangés entre passagères et conductrices sont chiffrés de bout en bout. Personne d'autre ne peut y accéder.", level: "Essentiel" },
    { icon: "👤", title: "Vérification d'Identité", titleAr: "التحقق من الهوية", desc: "Chaque conductrice passe par une vérification multi-étapes : CIN, selfie, permis de conduire, antécédents judiciaires et visite technique du véhicule.", level: "Obligatoire" },
    { icon: "📱", title: "Partage de Trajet", titleAr: "مشاركة الرحلة", desc: "Partagez un lien de suivi en direct avec vos proches. Ils voient votre position en temps réel sans avoir besoin de créer un compte.", level: "Essentiel" },
    { icon: "🤖", title: "Détection IA", titleAr: "كشف الذكاء الاصطناعي", desc: "Notre IA surveille en permanence les trajets anormaux : déviations, arrêts suspects, comportements inhabituels. Une alerte est levée automatiquement.", level: "Avancé" },
    { icon: "🔑", title: "Authentification 2FA", titleAr: "المصادقة الثنائية", desc: "Double vérification à chaque connexion : mot de passe + code SMS. Votre compte est protégé même si votre mot de passe est compromis.", level: "Obligatoire" },
    { icon: "🛡️", title: "Anti-Fraude", titleAr: "مكافحة الاحتيال", desc: "Empreinte digitale d'appareil, limitation des tentatives de connexion, et surveillance des comportements suspects pour protéger votre compte.", level: "Avancé" },
    { icon: "📞", title: "Appel Masqué", titleAr: "المكالمة المجهولة", desc: "Appelez votre conductrice sans révéler votre numéro réel. Notre système de proxy masque les deux numéros pour protéger la vie privée.", level: "Protection" },
  ];

  const levelColor: Record<string, string> = {
    "Critique": "#C53030",
    "Essentiel": "var(--color-emerald-600)",
    "Obligatoire": "var(--color-rose-gold-700)",
    "Avancé": "var(--color-gold-600)",
    "Protection": "var(--color-emerald-500)",
  };

  return (
    <div style={{ background: "var(--color-sand-50)" }}>
      <Navbar />

      {/* Hero */}
      <section className="pt-28 pb-20 px-6 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0A1F15 0%, #0D2A1A 50%, #121A10 100%)" }}>
        <div className="zellige-pattern absolute inset-0 opacity-10"/>
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full -translate-y-1/2 translate-x-1/2"
          style={{ background: "radial-gradient(circle,rgba(13,122,74,0.2) 0%,transparent 70%)" }}/>
        <div className="container-app mx-auto text-center relative z-10">
          <span className="badge mb-6 text-xs tracking-widest" style={{ background: "rgba(13,122,74,0.2)", color: "#4DBF8A", border: "1px solid rgba(13,122,74,0.3)" }}>VOTRE SÉCURITÉ</span>
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
              { icon: "🔒", label: "OWASP Top 10", sub: "Conformité complète" },
              { icon: "📋", label: "RGPD / CNDP", sub: "Protection des données" },
              { icon: "🏆", label: "ISO 27001", sub: "Standard sécurité info" },
              { icon: "🇲🇦", label: "Droit marocain", sub: "Loi 09-08 conforme" },
            ].map(b => (
              <div key={b.label} className="flex items-center gap-3 px-6 py-4 rounded-2xl"
                style={{ background: "white", border: "1px solid var(--color-border)", minWidth: "180px" }}>
                <span className="text-2xl">{b.icon}</span>
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
            <span className="badge badge-success mb-4 text-xs">9 COUCHES DE SÉCURITÉ</span>
            <h2 className="text-display-lg">Chaque couche <span className="gradient-text">vous protège</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(f => (
              <div key={f.title} className="card-luxury p-6 hover:scale-[1.01] transition-transform duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                    style={{ background: "rgba(13,122,74,0.08)" }}>{f.icon}</div>
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
              <div className="text-6xl mb-6 animate-float">🆘</div>
              <h2 className="text-display-lg text-white mb-4">Le Bouton SOS<br/><span style={{ color: "rgba(255,150,150,0.9)" }}>Toujours à portée</span></h2>
              <p className="mb-6" style={{ color: "rgba(255,255,255,0.7)", lineHeight: "1.8" }}>
                Le bouton SOS rouge est visible en permanence sur votre écran pendant tout trajet. En cas de danger, maintenez-le 3 secondes pour déclencher une alerte complète.
              </p>
              <ul className="flex flex-col gap-3">
                {["Alerte immédiate à vos contacts de confiance", "Notification en temps réel à notre équipe de sécurité", "Partage automatique de votre position GPS", "Enregistrement de la session pour les autorités"].map(item => (
                  <li key={item} className="flex items-center gap-3 text-sm" style={{ color: "rgba(255,255,255,0.8)" }}>
                    <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0" style={{ background: "rgba(255,255,255,0.2)" }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex justify-center">
              <div className="w-40 h-40 rounded-full flex flex-col items-center justify-center cursor-pointer"
                style={{ background: "linear-gradient(135deg,#E53E3E,#9B2C2C)", boxShadow: "0 0 60px rgba(229,62,62,0.5), 0 0 0 20px rgba(229,62,62,0.1)", animation: "sos-pulse 2s infinite" }}>
                <span className="text-white text-4xl font-bold">SOS</span>
                <span className="text-white text-2xl mt-1">🆘</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 text-center" style={{ background: "var(--color-sand-50)" }}>
        <div className="container-app mx-auto">
          <h2 className="text-display-lg mb-6">Voyagez en toute <span className="gradient-text">confiance</span></h2>
          <p className="mb-8" style={{ color: "var(--color-muted)" }}>Rejoignez des milliers de femmes qui font confiance à SheDrive Morocco.</p>
          <Link href="/auth/register" className="btn btn-primary btn-lg">Commencer maintenant →</Link>
        </div>
      </section>

      <footer style={{ background: "#0D0A07", color: "rgba(255,255,255,0.5)" }}>
        <div className="container-app mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg,var(--color-rose-gold-500),var(--color-rose-gold-700))" }}>🌹</div>
            <span className="font-bold text-white" style={{ fontFamily: "var(--font-display)" }}>SheDrive Morocco</span>
          </div>
          <p className="text-xs">© 2025 SheDrive Morocco. Tous droits réservés. 🇲🇦</p>
        </div>
      </footer>
    </div>
  );
}
