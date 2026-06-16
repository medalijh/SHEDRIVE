"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Flower2, CarFront, Sparkles, ShieldCheck, Gem, Handshake, Map, MessageCircle, Wallet, MapPin, Coins, Users, LifeBuoy, Navigation, Lock, UserCheck, Share2, BrainCircuit, Star, Mail, Phone, Send, Heart, Briefcase, GraduationCap } from "lucide-react";

// ============================================================
// HERO SECTION
// ============================================================
function HeroSection() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white pt-20">
      {/* Zellige Pattern Overlay */}
      <div
        className="absolute inset-0 zellige-pattern opacity-30"
        style={{ transform: `translateY(${scrollY * 0.3}px)` }}
      />

      {/* Radial glow */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[800px] h-[800px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(225,29,72,0.1) 0%, rgba(147,51,234,0.05) 50%, transparent 70%)",
        }}
      />

      {/* Decorative Flowers */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute -top-20 -right-20 w-[400px] h-[400px] opacity-30 mix-blend-multiply rotate-12">
          <Image src="/tulips.png" alt="Tulipes décoratives" fill className="object-cover" />
        </div>
        <div className="absolute -bottom-20 -left-20 w-[350px] h-[350px] opacity-20 mix-blend-multiply -rotate-45">
          <Image src="/tulips.png" alt="Tulipes décoratives" fill className="object-cover" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 container-app px-4 sm:px-6 py-12 md:py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Text */}
          <div className="text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 animate-fade-in"
              style={{ background: "rgba(225,29,72,0.1)", border: "1px solid rgba(225,29,72,0.2)" }}>
              <Flower2 size={16} color="var(--color-rose-500)" />
              <span className="text-xs font-medium" style={{ color: "var(--color-rose-600)" }}>
                Service exclusivement féminin
              </span>
            </div>

            <h1 className="text-display-2xl text-black mb-6 animate-slide-up leading-tight">
              Voyagez en{" "}
              <span className="gradient-text block">Toute Sécurité</span>
              <span className="text-display-xl" style={{ color: "rgba(0,0,0,0.85)" }}>
                Entre Femmes
              </span>
            </h1>

            <p className="text-base md:text-lg mb-8 max-w-lg animate-slide-up delay-200"
              style={{ color: "rgba(0,0,0,0.6)" }}>
              SheDrive Morocco est la 1ère plateforme de covoiturage réservée aux femmes. 
              Fini le harcèlement ou le stress dans les transports. Profitez de conductrices vérifiées et d'un trajet premium.
            </p>

            {/* CTA Buttons (Above the fold) */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10 animate-slide-up delay-300">
              <Link href="/auth/register?role=passenger" className="btn btn-primary btn-xl">
                <CarFront size={20} />
                <span>Réserver un Trajet</span>
              </Link>
              <Link href="/auth/register?role=driver" className="btn btn-xl"
                style={{ background: "transparent", color: "var(--color-text)", border: "1.5px solid rgba(225,29,72,0.4)" }}>
                <Sparkles size={20} />
                <span>Devenir Conductrice</span>
              </Link>
            </div>
          </div>

          {/* Right Visual (Product App Mockup representation) */}
          <div className="relative animate-float hidden md:flex justify-center">
             <div className="relative w-[300px] h-[600px] bg-white rounded-[40px] shadow-2xl overflow-hidden border-8 border-gray-900" style={{ boxShadow: "0 25px 50px -12px rgba(225,29,72,0.25)" }}>
               {/* Mockup Screen */}
               <div className="absolute inset-0 bg-silver-50">
                  <div className="h-1/2" style={{ background: "linear-gradient(135deg, var(--color-rose-500), var(--color-purple-600))" }}>
                    <div className="pt-12 px-6 text-white font-bold text-xl">Où allez-vous ?</div>
                    <div className="mt-4 mx-4 bg-white p-3 rounded-xl flex items-center gap-3 text-black shadow-md">
                      <MapPin size={18} className="text-rose-500" /> Casablanca, Maarif
                    </div>
                  </div>
                  <div className="h-1/2 bg-white rounded-t-3xl -mt-6 relative p-6">
                    <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6"></div>
                    <div className="flex items-center gap-4 p-3 border rounded-xl mb-4 border-rose-200 bg-rose-50">
                       <div className="w-12 h-12 bg-rose-200 rounded-full flex items-center justify-center text-rose-600"><UserCheck /></div>
                       <div>
                         <div className="font-bold text-sm">Khadija M. (Conductrice)</div>
                         <div className="text-xs text-gray-500">Renault Clio • ★ 4.9</div>
                       </div>
                    </div>
                    <button className="w-full py-3 rounded-xl text-white font-bold text-sm" style={{ background: "var(--color-rose-600)" }}>Confirmer le trajet (35 MAD)</button>
                  </div>
               </div>
             </div>
             {/* Decorative element behind mockup */}
             <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full opacity-30 mix-blend-multiply" style={{ background: "var(--color-rose-300)", filter: "blur(40px)" }}></div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// PROBLEM & MISSION (Presentation)
// ============================================================
function MissionSection() {
  return (
    <section className="py-16 px-4 sm:px-6 bg-white relative">
      <div className="container-app mx-auto text-center max-w-4xl">
        <span className="badge badge-error mb-4 text-xs tracking-widest">LE PROBLÈME</span>
        <h2 className="text-display-lg mb-6">
          Les transports ne sont pas toujours <span className="text-rose-600">sécurisants</span> pour les femmes.
        </h2>
        <p className="text-base text-gray-600 mb-12">
          Au Maroc, beaucoup de femmes ressentent de l'insécurité, subissent du harcèlement ou de l'inconfort dans les transports quotidiens. Nous avons décidé de changer cela.
        </p>

        <div className="p-8 rounded-3xl" style={{ background: "linear-gradient(135deg, rgba(225,29,72,0.05), rgba(147,51,234,0.05))", border: "1px solid rgba(225,29,72,0.1)" }}>
           <span className="badge badge-primary mb-4 text-xs tracking-widest">NOTRE MISSION (LE PROJET)</span>
           <h3 className="text-display-md mb-4 gradient-text">Créé par des Femmes, pour les Femmes</h3>
           <p className="text-sm text-gray-700 leading-relaxed max-w-2xl mx-auto">
             Le projet <strong>SheDrive Morocco</strong> est né d'une volonté simple : offrir aux Marocaines une liberté de mouvement totale, en toute sérénité. 
             Notre équipe s'engage à fournir une plateforme technologique fiable qui relie des conductrices professionnelles et des passagères pour des trajets 100% sécurisés.
           </p>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// FEATURES SECTION (3 Key Benefits)
// ============================================================
function FeaturesSection() {
  const features = [
    {
      icon: <ShieldCheck size={32} color="currentColor" />,
      title: "Sécurité Totale (Zéro Harcèlement)",
      desc: "Chaque conductrice est rigoureusement vérifiée. Suivi GPS en temps réel et bouton SOS inclus pour voyager l'esprit tranquille.",
      color: "var(--color-rose-600)",
      bg: "rgba(225, 29, 72, 0.08)",
    },
    {
      icon: <Handshake size={32} color="currentColor" />,
      title: "Liberté sur les Prix (Négociables)",
      desc: "Proposez votre prix ou choisissez parmi les offres de nos conductrices. Un système juste et transparent pour toutes.",
      color: "var(--color-purple-500)",
      bg: "rgba(147, 51, 234, 0.08)",
    },
    {
      icon: <Gem size={32} color="currentColor" />,
      title: "Confort et Premium",
      desc: "Des véhicules propres, une conduite agréable, et des discussions entre femmes. Plus qu'un trajet, une vraie communauté.",
      color: "var(--color-baby-rose-600)",
      bg: "rgba(219, 39, 119, 0.08)",
    },
  ];

  return (
    <section className="py-20 px-6" style={{ background: "var(--color-silver-50)" }}>
      <div className="container-app mx-auto">
        <div className="text-center mb-16">
          <span className="badge badge-primary text-xs tracking-widest mb-4">NOS 3 BÉNÉFICES CLÉS</span>
          <h2 className="text-display-xl mb-4">
            Ce que vous y <span className="gradient-text">Gagnez</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="card-luxury p-8 hover:scale-[1.02] transition-transform duration-300 text-center"
            >
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
                style={{ background: f.bg, color: f.color }}>
                {f.icon}
              </div>
              <h3 className="text-lg font-bold mb-3" style={{ fontFamily: "var(--font-display)" }}>
                {f.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--color-muted)" }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// POUR QUI SECTION (Target Audience)
// ============================================================
function TargetAudienceSection() {
  const targets = [
    { icon: <Briefcase size={24} />, title: "Les Professionnelles", desc: "Pour vos trajets domicile-travail en toute sérénité." },
    { icon: <GraduationCap size={24} />, title: "Les Étudiantes", desc: "Pour rentrer des cours tard le soir sans aucune crainte." },
    { icon: <Heart size={24} />, title: "Les Mamans", desc: "Pour vos courses ou accompagner vos enfants en sécurité." },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 bg-white">
      <div className="container-app mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-display-lg mb-4">SheDrive est fait <span className="text-purple-600">Pour Vous</span></h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Peu importe votre profil, si vous êtes une femme, notre communauté vous ouvre ses portes.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {targets.map((t) => (
             <div key={t.title} className="p-6 border border-gray-100 rounded-2xl bg-gray-50 flex flex-col items-center text-center">
               <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mb-4">{t.icon}</div>
               <h4 className="font-bold mb-2">{t.title}</h4>
               <p className="text-sm text-gray-500">{t.desc}</p>
             </div>
           ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// HOW IT WORKS (3 Simple Steps)
// ============================================================
function HowItWorksSection() {
  const steps = [
    { num: "01", icon: <MapPin size={32} color="white" />, title: "Saisissez votre trajet", desc: "Indiquez votre destination et proposez le prix qui vous convient." },
    { num: "02", icon: <Users size={32} color="white" />, title: "Choisissez votre conductrice", desc: "Consultez les offres des conductrices vérifiées et sélectionnez la meilleure." },
    { num: "03", icon: <ShieldCheck size={32} color="white" />, title: "Voyagez en toute sécurité", desc: "Profitez d'un trajet 100% sécurisé entre femmes jusqu'à votre arrivée." },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 relative overflow-hidden" style={{ background: "#FFFDF9" }}>
      <div className="zellige-pattern absolute inset-0 opacity-20" />
      <div className="container-app mx-auto relative z-10">
        <div className="text-center mb-16">
          <span className="badge badge-success mb-4 text-xs tracking-widest">COMMENT ÇA MARCHE</span>
          <h2 className="text-display-xl">
            En <span className="gradient-text">3 Étapes Simples</span>
          </h2>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-10 left-1/2 -translate-x-1/2 w-2/3 h-px"
            style={{ background: "linear-gradient(90deg, transparent, var(--color-rose-300), transparent)" }}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {steps.map((step, i) => (
              <div key={step.num} className="flex flex-col items-center text-center group">
                <div className="relative mb-6">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center shadow-lg relative z-10 transition-transform duration-300 group-hover:scale-110"
                    style={{ background: i % 2 === 0 ? "linear-gradient(135deg, var(--color-rose-500), var(--color-rose-700))" : "linear-gradient(135deg, var(--color-purple-400), var(--color-purple-600))", boxShadow: i % 2 === 0 ? "var(--shadow-rose)" : "var(--shadow-gold)" }}>
                    {step.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                    style={{ background: "var(--color-purple-800)", color: "white", border: "2px solid white" }}>
                    {step.num}
                  </div>
                </div>
                <h3 className="font-bold mb-3 text-lg" style={{ fontFamily: "var(--font-display)" }}>
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--color-muted)" }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// TESTIMONIALS (Proof)
// ============================================================
function TestimonialsSection() {
  const testimonials = [
    {
      name: "Fatima Z.",
      city: "Casablanca",
      text: "Enfin un service qui comprend nos besoins ! Je n'ai plus peur de rentrer seule le soir, je me sens vraiment en sécurité.",
      rating: 5,
      initials: "FZ",
    },
    {
      name: "Khadija M.",
      city: "Marrakech",
      desc: "Conductrice",
      text: "SheDrive m'a permis de travailler avec flexibilité tout en aidant d'autres femmes. Les revenus sont excellents.",
      rating: 5,
      initials: "KM",
    },
    {
      name: "Amina B.",
      city: "Rabat",
      text: "L'application est super intuitive et le système de négociation de prix est vraiment juste. C'est le top.",
      rating: 5,
      initials: "AB",
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 bg-white">
      <div className="container-app mx-auto">
        <div className="text-center mb-16">
          <span className="badge badge-warning mb-4 text-xs tracking-widest">PREUVE SOCIALE</span>
          <h2 className="text-display-xl">
            La Preuve par <span className="gradient-text">Elles</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="card-luxury p-6 border border-rose-100">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg"
                  style={{ background: "rgba(225,29,72,0.1)", color: "var(--color-rose-600)" }}>
                  {t.initials}
                </div>
                <div>
                  <div className="font-bold">{t.name}</div>
                  <div className="text-xs" style={{ color: "var(--color-muted)" }}>
                    {t.desc ? `${t.desc} · ` : ""}{t.city}
                  </div>
                </div>
              </div>
              <div className="stars mb-4 flex gap-1">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} size={16} fill="var(--color-purple-400)" color="var(--color-purple-400)" />
                ))}
              </div>
              <p className="text-sm italic text-gray-600">
                "{t.text}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// CTA SECTION (Lead Capture)
// ============================================================
function CTASection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(email) {
      setSubmitted(true);
    }
  };

  return (
    <section className="py-20 px-4 sm:px-6 relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, var(--color-rose-600) 0%, var(--color-rose-800) 50%, #2C1F12 100%)" }}>
      <div className="zellige-pattern absolute inset-0 opacity-15" />
      <div className="container-app mx-auto relative z-10 text-center max-w-3xl">
        <h2 className="text-display-xl text-white mb-6">
          Prête à Voyager{" "}
          <span style={{ color: "var(--color-purple-300)" }}>Autrement</span> ?
        </h2>
        <p className="mb-10 text-rose-100 text-lg">
          Rejoignez la révolution de la mobilité féminine au Maroc. Inscrivez-vous maintenant ou laissez-nous votre email pour être contactée.
        </p>

        {/* Action Button (Repeated CTA) */}
        <div className="flex justify-center mb-12">
          <Link href="/auth/register?role=passenger" className="btn btn-xl shadow-2xl"
            style={{ background: "white", color: "var(--color-rose-700)" }}>
            Créer mon compte gratuitement
          </Link>
        </div>

        {/* Lead Capture Form */}
        <div className="max-w-md mx-auto bg-white/10 p-6 rounded-2xl backdrop-blur-md border border-white/20">
           <h4 className="text-white font-bold mb-4">Besoin de plus d'informations ?</h4>
           {!submitted ? (
             <form onSubmit={handleSubmit} className="flex gap-2">
               <input 
                 type="email" 
                 required
                 placeholder="Votre adresse email..." 
                 className="flex-1 px-4 py-3 rounded-xl outline-none text-black"
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
               />
               <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white px-5 rounded-xl flex items-center justify-center transition-colors">
                 <Send size={18} />
               </button>
             </form>
           ) : (
             <div className="bg-green-500/20 text-green-100 border border-green-500/30 p-3 rounded-xl flex items-center justify-center gap-2">
               <ShieldCheck size={20} />
               <span className="font-medium">Merci, on vous recontacte très vite !</span>
             </div>
           )}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// NAVIGATION
// ============================================================
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(255,255,255,0.95)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(225,29,72,0.1)" : "none",
      }}>
      <div className="container-app mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 object-cover rounded-full border border-rose-200 overflow-hidden flex items-center justify-center bg-white flex-shrink-0"><img src="/logo.png" alt="SheDrive Logo" className="w-full h-full object-cover mix-blend-multiply scale-[1.35]" /></div>
          <span className="text-lg font-bold text-black" style={{ fontFamily: "var(--font-display)" }}>
            SheDrive
            <span className="text-sm font-normal ml-1" style={{ color: "var(--color-rose-600)" }}>Morocco</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          {[
            { href: "/about", label: "À propos" },
            { href: "/safety", label: "Sécurité" },
            { href: "/how-it-works", label: "Comment ça marche" },
          ].map((link) => (
            <Link key={link.href} href={link.href}
              className="text-sm font-medium transition-colors duration-200 text-gray-700 hover:text-rose-600">
              {link.label}
            </Link>
          ))}
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/auth/login" className="btn btn-sm btn-ghost text-black">
            Connexion
          </Link>
          <Link href="/auth/register" className="btn btn-sm btn-primary">
            S'inscrire
          </Link>
        </div>

        {/* Mobile menu button */}
        <button className="md:hidden text-black p-2" onClick={() => setMenuOpen(!menuOpen)}>
          <div className="w-5 h-0.5 bg-black mb-1 transition-all" style={{ transform: menuOpen ? "rotate(45deg) translateY(6px)" : "none" }} />
          <div className="w-5 h-0.5 bg-black mb-1 transition-all" style={{ opacity: menuOpen ? 0 : 1 }} />
          <div className="w-5 h-0.5 bg-black transition-all" style={{ transform: menuOpen ? "rotate(-45deg) translateY(-6px)" : "none" }} />
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden px-6 pb-6 animate-slide-down shadow-lg bg-white border-b border-rose-100">
          <div className="flex flex-col gap-4 pt-4">
            {[
              { href: "/about", label: "À propos" },
              { href: "/safety", label: "Sécurité" },
              { href: "/how-it-works", label: "Comment ça marche" },
            ].map((link) => (
              <Link key={link.href} href={link.href}
                className="text-sm font-medium py-2 border-b border-rose-50 text-gray-700"
                onClick={() => setMenuOpen(false)}>
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col gap-3 pt-2">
              <Link href="/auth/login" className="btn btn-outline w-full" style={{ color: "rgba(0,0,0,0.8)", borderColor: "rgba(225,29,72,0.4)" }}
                onClick={() => setMenuOpen(false)}>
                Connexion
              </Link>
              <Link href="/auth/register" className="btn btn-primary w-full" onClick={() => setMenuOpen(false)}>
                S'inscrire
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

// ============================================================
// FOOTER (Trust & Credibility)
// ============================================================
function Footer() {
  return (
    <footer style={{ background: "#F3F4F6", color: "rgba(0,0,0,0.6)" }}>
      <div className="zellige-pattern opacity-5" style={{ height: "4px", background: "linear-gradient(90deg, var(--color-rose-500), var(--color-purple-400), var(--color-purple-500))" }} />
      <div className="container-app mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand & Contact */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 object-cover rounded-full border border-rose-200 overflow-hidden flex items-center justify-center bg-white flex-shrink-0"><img src="/logo.png" alt="SheDrive Logo" className="w-full h-full object-cover mix-blend-multiply scale-[1.35]" /></div>
              <span className="text-lg font-bold text-black" style={{ fontFamily: "var(--font-display)" }}>SheDrive Morocco</span>
            </div>
            <p className="text-sm leading-relaxed mb-6">
              La première plateforme de covoiturage exclusivement féminine au Maroc.
            </p>
            
            {/* Contact Info (Checklist Requirement) */}
            <div className="flex flex-col gap-3">
              <a href="mailto:contact@shedrive.ma" className="flex items-center gap-2 text-sm text-gray-600 hover:text-rose-600 transition-colors">
                <Mail size={16} /> contact@shedrive.ma
              </a>
              <a href="tel:+212500000000" className="flex items-center gap-2 text-sm text-gray-600 hover:text-rose-600 transition-colors">
                <Phone size={16} /> +212 5 00 00 00 00
              </a>
            </div>
          </div>

          {/* Links */}
          {[
            {
              title: "Application",
              links: [
                { href: "/auth/login?role=passenger", label: "Espace Passagère" },
                { href: "/auth/login?role=driver", label: "Espace Conductrice" },
                { href: "/how-it-works", label: "Comment ça marche" },
                { href: "/auth/register", label: "S'inscrire" },
              ],
            },
            {
              title: "Entreprise",
              links: [
                { href: "/about", label: "À propos du Projet" },
                { href: "/safety", label: "Sécurité" },
              ],
            },
            {
              title: "Légal",
              links: [
                { href: "/privacy", label: "Politique de confidentialité" },
                { href: "/terms", label: "Conditions d'utilisation" },
              ],
            },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="text-black font-bold mb-4 text-sm">{col.title}</h4>
              <ul className="flex flex-col gap-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href}
                      className="text-sm hover:text-rose-600 transition-colors duration-200"
                      style={{ color: "rgba(0,0,0,0.5)" }}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="divider mb-8" style={{ background: "linear-gradient(90deg, transparent, rgba(225,29,72,0.3), transparent)" }} />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs" style={{ color: "rgba(0,0,0,0.4)" }}>
            © 2026 SheDrive Morocco. Tous droits réservés.
          </p>
          
          {/* Social Links */}
          <div className="flex items-center gap-4 text-gray-500 text-sm font-semibold">
            <a href="#" className="hover:text-rose-500 transition-colors">Instagram</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Facebook</a>
          </div>

          <div className="flex items-center gap-2 text-xs" style={{ color: "rgba(0,0,0,0.4)" }}>
            <MapPin size={12} />
            <span>Fièrement Marocain · صنع في المغرب</span>
            <Flower2 size={12} />
          </div>
        </div>
      </div>
    </footer>
  );
}

// ============================================================
// SAFETY SECTION
// ============================================================
function SafetySection() {
  const features = [
    { icon: <LifeBuoy size={28} />, label: "Bouton SOS", sub: "زر الطوارئ" },
    { icon: <Navigation size={28} />, label: "GPS Temps Réel", sub: "تتبع فوري" },
    { icon: <Lock size={28} />, label: "Chiffrement E2E", sub: "تشفير كامل" },
    { icon: <UserCheck size={28} />, label: "Vérification ID", sub: "التحقق من الهوية" },
    { icon: <Share2 size={28} />, label: "Partage de Trajet", sub: "مشاركة الرحلة" },
    { icon: <BrainCircuit size={28} />, label: "Anti-Fraude AI", sub: "ذكاء اصطناعي" },
  ];

  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, var(--color-rose-900) 0%, var(--color-rose-800) 100%)" }}>
      <div className="zellige-pattern absolute inset-0" style={{ opacity: 0.12 }} />

      {/* Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full -translate-y-1/2 translate-x-1/2"
        style={{ background: "radial-gradient(circle, rgba(147,51,234,0.2) 0%, transparent 70%)" }}
      />

      <div className="container-app mx-auto relative z-10">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div>
            <span className="badge mb-6 text-xs tracking-widest"
              style={{ background: "rgba(147,51,234,0.2)", color: "#4DBF8A", border: "1px solid rgba(147,51,234,0.3)" }}>
              VOTRE SÉCURITÉ D'ABORD
            </span>
            <h2 className="text-display-xl text-white mb-6">
              Sécurité de{" "}
              <span className="text-emerald-400">Niveau</span>
              {" "}Entreprise
            </h2>
            <p className="mb-8" style={{ color: "rgba(255,255,255,0.8)", lineHeight: "1.8" }}>
              SheDrive Morocco intègre les technologies de sécurité les plus avancées.
              Chaque trajet est surveillé en temps réel par notre équipe dédiée.
            </p>
            <p className="text-sm mb-10" style={{ color: "rgba(255,255,255,0.8)", fontFamily: "var(--font-arabic)", direction: "rtl" }}>
              كل رحلة خاضعة للمراقبة الفورية لضمان سلامتك في كل لحظة
            </p>
            <Link href="/safety" className="btn btn-emerald btn-lg">
              En Savoir Plus sur la Sécurité →
            </Link>
          </div>

          {/* Right: Safety Features Grid */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {features.map((f) => (
              <div key={f.label} className="p-4 sm:p-5 rounded-2xl text-center transition-all duration-300 hover:scale-105 cursor-default flex flex-col justify-center items-center"
                style={{ background: "rgba(255,255,255,0.92)", border: "1px solid rgba(219,39,119,0.3)" }}>
                <div className="text-rose-500 mb-2 flex justify-center">
                  {f.icon}
                </div>
                <div className="text-[11px] sm:text-xs font-semibold text-black mb-1 leading-tight">{f.label}</div>
                <div className="text-[10px] sm:text-xs" style={{ color: "rgba(0,0,0,0.6)", fontFamily: "var(--font-arabic)" }}>{f.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// MOROCCAN CITIES SECTION
// ============================================================
function CitiesSection() {
  const cities = [
    { name: "Casablanca", nameAr: "الدار البيضاء" },
    { name: "Marrakech", nameAr: "مراكش" },
    { name: "Rabat", nameAr: "الرباط" },
    { name: "Fès", nameAr: "فاس" },
    { name: "Agadir", nameAr: "أكادير" },
    { name: "Tanger", nameAr: "طنجة" },
    { name: "Meknès", nameAr: "مكناس" },
    { name: "Oujda", nameAr: "وجدة" },
    { name: "Tétouan", nameAr: "تطوان" },
  ];

  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 relative" style={{ background: "var(--color-purple-50)" }}>
      <div className="zellige-pattern absolute inset-0 opacity-10" />
      <div className="container-app mx-auto relative z-10">
        <div className="text-center mb-16">
          <span className="badge badge-warning mb-4 text-xs tracking-widest">COUVERTURE NATIONALE</span>
          <h2 className="text-display-xl mb-4">
            Disponible dans <span className="gradient-text">18 Villes</span>
          </h2>
          <p style={{ color: "var(--color-muted)" }}>
            De Tanger à Agadir, SheDrive couvre tout le Maroc
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
          {cities.map((city) => (
            <div key={city.name}
              className="p-3 sm:p-4 rounded-xl text-center cursor-pointer group"
              style={{
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.background = "linear-gradient(135deg, rgba(225,29,72,0.08), rgba(147,51,234,0.05))";
                (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(225,29,72,0.3)";
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.background = "var(--color-surface)";
                (e.currentTarget as HTMLDivElement).style.borderColor = "var(--color-border)";
                (e.currentTarget as HTMLDivElement).style.transform = "none";
              }}
            >
              <div className="mb-3 flex justify-center text-rose-500">
                <MapPin size={28} color="var(--color-purple-500)" />
              </div>
              <div className="text-sm font-semibold">{city.name}</div>
              <div className="text-xs mt-1" style={{ color: "var(--color-muted)", fontFamily: "var(--font-arabic)" }}>
                {city.nameAr}
              </div>
            </div>
          ))}
          <div className="p-4 rounded-2xl text-center flex flex-col justify-center items-center"
            style={{ background: "linear-gradient(135deg, rgba(225,29,72,0.1), rgba(147,51,234,0.08))", border: "1.5px dashed rgba(225,29,72,0.3)" }}>
            <Sparkles size={28} color="var(--color-purple-400)" className="mb-2" />
            <div className="text-sm font-semibold gradient-text">+9 Villes</div>
            <div className="text-xs mt-1" style={{ color: "var(--color-muted)" }}>et plus encore</div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// LANDING PAGE
// ============================================================
export default function LandingPage() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <MissionSection />
      <FeaturesSection />
      <TargetAudienceSection />
      <HowItWorksSection />
      <SafetySection />
      <CitiesSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </main>
  );
}
