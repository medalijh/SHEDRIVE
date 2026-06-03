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

function Footer() {
  return (
    <footer style={{ background: "#0D0A07", color: "rgba(255,255,255,0.5)" }}>
      <div className="container-app mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-base"
              style={{ background: "linear-gradient(135deg,var(--color-rose-gold-500),var(--color-rose-gold-700))" }}>🌹</div>
            <span className="font-bold text-white" style={{ fontFamily: "var(--font-display)" }}>SheDrive Morocco</span>
          </div>
          <p className="text-xs">© 2025 SheDrive Morocco. Tous droits réservés. 🇲🇦</p>
        </div>
      </div>
    </footer>
  );
}

export default function AboutPage() {
  const values = [
    { icon: "🛡️", title: "Sécurité avant tout",    body: "Chaque trajet, chaque conductrice, chaque passagère — la sécurité est notre priorité absolue. Notre technologie surveille en temps réel." },
    { icon: "🌹", title: "Exclusivement féminin",   body: "SheDrive est conçu par des femmes, pour des femmes. Toutes nos conductrices et passagères sont vérifiées et féminines." },
    { icon: "🇲🇦", title: "Fièrement marocain",    body: "Nous comprenons la culture, les besoins et les défis des femmes marocaines. Notre service est pensé pour le Maroc." },
    { icon: "💎", title: "Qualité premium",          body: "Vous méritez le meilleur. Interface élégante, conductrices professionnelles, et une expérience digne d'une startup mondiale." },
    { icon: "🤝", title: "Prix équitables",          body: "Notre système de négociation transparent permet aux passagères et conductrices de trouver un accord juste à chaque trajet." },
    { icon: "🌍", title: "Impact social",            body: "Nous créons des opportunités économiques pour les femmes marocaines tout en renforçant leur autonomie et leur liberté de mouvement." },
  ];

  const team = [
    { name: "Salma Benali",    role: "CEO & Co-fondatrice",     emoji: "👩‍💼", city: "Casablanca" },
    { name: "Nadia Alaoui",    role: "CTO & Co-fondatrice",     emoji: "👩‍💻", city: "Rabat" },
    { name: "Fatima El Hadi",  role: "Directrice Opérations",   emoji: "👩‍🔧", city: "Marrakech" },
    { name: "Amina Berrada",   role: "Directrice Marketing",    emoji: "👩‍🎨", city: "Casablanca" },
  ];

  return (
    <div style={{ background: "var(--color-sand-50)" }}>
      <Navbar />

      {/* Hero */}
      <section className="pt-28 pb-20 px-6 relative overflow-hidden bg-hero-gradient">
        <div className="zellige-pattern absolute inset-0 opacity-20"/>
        <div className="container-app mx-auto text-center relative z-10">
          <span className="badge mb-6 text-xs tracking-widest" style={{ background: "rgba(200,149,108,0.15)", color: "var(--color-rose-gold-400)", border: "1px solid rgba(200,149,108,0.3)" }}>À PROPOS</span>
          <h1 className="text-display-xl text-white mb-6">
            Plus qu'un service de transport,<br/>
            <span className="gradient-text">un mouvement féminin</span>
          </h1>
          <p className="text-base max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.6)", lineHeight: "1.8" }}>
            SheDrive Morocco est née d'une conviction simple : les femmes marocaines méritent de se déplacer en toute sécurité, avec élégance, et dans un espace exclusivement féminin.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 px-6">
        <div className="container-app mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="badge badge-primary mb-4 text-xs">NOTRE HISTOIRE</span>
              <h2 className="text-display-lg mb-6">Née au cœur<br/>de <span className="gradient-text">Casablanca</span></h2>
              <p className="mb-4 leading-relaxed" style={{ color: "var(--color-muted)" }}>
                En 2024, deux ingénieures marocaines — Salma et Nadia — ont eu assez des mauvaises expériences de transport. Elles ont décidé de créer la solution qu'elles auraient voulu utiliser.
              </p>
              <p className="mb-6 leading-relaxed" style={{ color: "var(--color-muted)" }}>
                Aujourd'hui, SheDrive opère dans 18 villes marocaines, avec des centaines de conductrices vérifiées et des milliers de passagères satisfaites.
              </p>
              <p className="text-sm" style={{ fontFamily: "var(--font-arabic)", direction: "rtl", color: "var(--color-muted)" }}>
                وُلدت شي درايف من قناعة: المرأة المغربية تستحق التنقل بأمان وكرامة.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { num: "4 821+", label: "Passagères", icon: "👥" },
                { num: "847+",   label: "Conductrices", icon: "🚗" },
                { num: "31 204+", label: "Trajets", icon: "🗺️" },
                { num: "18",     label: "Villes", icon: "🏙️" },
              ].map(s => (
                <div key={s.label} className="card-luxury p-6 text-center">
                  <div className="text-3xl mb-2">{s.icon}</div>
                  <div className="text-2xl font-bold gradient-text mb-1" style={{ fontFamily: "var(--font-display)" }}>{s.num}</div>
                  <div className="text-sm" style={{ color: "var(--color-muted)" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-6 relative" style={{ background: "var(--color-ivory-100)" }}>
        <div className="zellige-pattern absolute inset-0 opacity-15"/>
        <div className="container-app mx-auto relative z-10">
          <div className="text-center mb-14">
            <span className="badge badge-primary mb-4 text-xs">NOS VALEURS</span>
            <h2 className="text-display-lg">Ce qui nous <span className="gradient-text">définit</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map(v => (
              <div key={v.title} className="card-luxury p-6 hover:scale-[1.02] transition-transform duration-300">
                <div className="text-3xl mb-4">{v.icon}</div>
                <h3 className="font-semibold mb-3 text-lg" style={{ fontFamily: "var(--font-display)" }}>{v.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--color-muted)" }}>{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 px-6">
        <div className="container-app mx-auto">
          <div className="text-center mb-14">
            <span className="badge badge-primary mb-4 text-xs">L'ÉQUIPE</span>
            <h2 className="text-display-lg">Les femmes derrière <span className="gradient-text">SheDrive</span></h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {team.map(t => (
              <div key={t.name} className="card-luxury p-6 text-center">
                <div className="w-16 h-16 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-4"
                  style={{ background: "linear-gradient(135deg,rgba(200,149,108,0.15),rgba(13,122,74,0.08))" }}>{t.emoji}</div>
                <h3 className="font-semibold mb-1" style={{ fontFamily: "var(--font-display)" }}>{t.name}</h3>
                <p className="text-xs mb-1" style={{ color: "var(--color-rose-gold-600)" }}>{t.role}</p>
                <p className="text-xs" style={{ color: "var(--color-muted)" }}>{t.city}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 text-center relative overflow-hidden bg-hero-gradient">
        <div className="zellige-pattern absolute inset-0 opacity-15"/>
        <div className="relative z-10">
          <h2 className="text-display-lg text-white mb-6">Rejoignez notre <span className="gradient-text">communauté</span></h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register?role=passenger" className="btn btn-primary btn-lg">🌹 Je suis passagère</Link>
            <Link href="/auth/register?role=driver" className="btn btn-lg" style={{ background: "rgba(255,255,255,0.1)", color: "white", border: "1.5px solid rgba(200,149,108,0.4)" }}>🌸 Je suis conductrice</Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
