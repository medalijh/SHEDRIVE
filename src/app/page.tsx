"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Flower2, CarFront, Sparkles, ShieldCheck, Gem, Handshake, Map, MessageCircle, Wallet, MapPin, Coins, Users, LifeBuoy, Navigation, Lock, UserCheck, Share2, BrainCircuit, Star } from "lucide-react";

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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white">
      {/* Zellige Pattern Overlay */}
      <div
        className="absolute inset-0 zellige-pattern opacity-30"
        style={{ transform: `translateY(${scrollY * 0.3}px)` }}
      />

      {/* Radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(225,29,72,0.15) 0%, rgba(147,51,234,0.08) 50%, transparent 70%)",
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
      <div className="relative z-10 container-app px-4 sm:px-6 py-16 md:py-24 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 animate-fade-in"
          style={{ background: "rgba(225,29,72,0.1)", border: "1px solid rgba(225,29,72,0.2)" }}>
          <Flower2 size={20} color="var(--color-rose-500)" />
          <span className="text-sm font-medium" style={{ color: "var(--color-rose-600)" }}>
            Service exclusivement féminin au Maroc
          </span>
        </div>

        {/* Main Title */}
        <h1 className="text-display-2xl text-black mb-6 animate-slide-up">
          Voyagez en{" "}
          <span className="gradient-text">Toute Sécurité</span>
          <br />
          <span className="text-display-xl" style={{ color: "rgba(0,0,0,0.85)" }}>
            Entre Femmes
          </span>
        </h1>

        {/* Arabic subtitle */}
        <p className="text-lg mb-4 animate-slide-up delay-100"
          style={{ color: "rgba(0,0,0,0.6)", fontFamily: "var(--font-arabic)", direction: "rtl" }}>
          خدمة نقل حصرية للمرأة المغربية — أمان، أناقة، تمكين
        </p>

        <p className="text-base mb-10 max-w-lg mx-auto animate-slide-up delay-200"
          style={{ color: "rgba(0,0,0,0.55)" }}>
          SheDrive Morocco est la première plateforme de covoiturage{" "}
          réservée aux femmes. Conductrices vérifiées, trajets sécurisés,{" "}
          expérience premium dans toutes les villes marocaines.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 animate-slide-up delay-300">
          <Link href="/auth/register?role=passenger" className="btn btn-primary btn-xl w-full sm:w-auto">
            <CarFront size={20} />
            <span>Réserver un Trajet</span>
          </Link>
          <Link href="/auth/register?role=driver" className="btn btn-xl w-full sm:w-auto"
            style={{ background: "transparent", color: "var(--color-text)", border: "1.5px solid rgba(225,29,72,0.4)" }}>
            <Sparkles size={20} />
            <span>Devenir Conductrice</span>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 max-w-md mx-auto animate-slide-up delay-400">
          {[
            { value: "18+", label: "Villes", labelAr: "مدينة" },
            { value: "100%", label: "Femmes", labelAr: "نساء" },
            { value: "24/7", label: "Support", labelAr: "دعم" },
          ].map((stat) => (
            <div key={stat.label} className="text-center p-3 sm:p-4 rounded-xl sm:rounded-2xl"
              style={{ background: "rgba(0,0,0,0.03)", border: "1px solid rgba(225,29,72,0.2)" }}>
              <div className="text-display-sm gradient-text leading-tight">{stat.value}</div>
              <div className="text-xs mt-1" style={{ color: "rgba(0,0,0,0.5)" }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
        <div className="w-6 h-10 rounded-full border-2 flex items-start justify-center p-1"
          style={{ borderColor: "rgba(225,29,72,0.4)" }}>
          <div className="w-1 h-2 rounded-full" style={{ background: "var(--color-rose-600)", animation: "slideDown 1.5s ease-in-out infinite" }}/>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// FEATURES SECTION
// ============================================================
function FeaturesSection() {
  const features = [
    {
      icon: <ShieldCheck size={28} color="currentColor" />,
      title: "Sécurité Maximale",
      titleAr: "أمان قصوى",
      desc: "Conductrices vérifiées, suivi GPS en temps réel, bouton SOS d'urgence, et contacts de confiance.",
      color: "var(--color-rose-600)",
      bg: "rgba(225, 29, 72, 0.08)",
    },
    {
      icon: <Gem size={28} color="currentColor" />,
      title: "Expérience Premium",
      titleAr: "تجربة راقية",
      desc: "Véhicules élégants, conductrices professionnelles, et une interface luxueuse pensée pour vous.",
      color: "var(--color-purple-500)",
      bg: "rgba(147, 51, 234, 0.08)",
    },
    {
      icon: <Handshake size={28} color="currentColor" />,
      title: "Prix Négociables",
      titleAr: "أسعار قابلة للتفاوض",
      desc: "Proposez votre prix. Les conductrices font leurs offres. Vous choisissez la meilleure option.",
      color: "var(--color-baby-rose-600)",
      bg: "rgba(219, 39, 119, 0.08)",
    },
    {
      icon: <Map size={28} color="currentColor" />,
      title: "Tout le Maroc",
      titleAr: "كل المغرب",
      desc: "18 villes marocaines couvertes, de Casablanca à Agadir, de Tanger à Oujda.",
      color: "var(--color-rose-600)",
      bg: "rgba(225, 29, 72, 0.08)",
    },
    {
      icon: <MessageCircle size={28} color="currentColor" />,
      title: "Chat Intégré",
      titleAr: "محادثة مدمجة",
      desc: "Communication chiffrée entre passagères et conductrices, avec messages vocaux.",
      color: "var(--color-purple-500)",
      bg: "rgba(147, 51, 234, 0.08)",
    },
    {
      icon: <Wallet size={28} color="currentColor" />,
      title: "Paiements Flexibles",
      titleAr: "دفع مرن",
      desc: "Espèces, carte bancaire, CMI, ou portefeuille SheDrive. En dirhams marocains.",
      color: "var(--color-baby-rose-600)",
      bg: "rgba(219, 39, 119, 0.08)",
    },
  ];

  return (
    <section className="py-24 px-6" style={{ background: "var(--color-silver-50)" }}>
      <div className="container-app mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="badge badge-primary text-xs tracking-widest">POURQUOI SHEDRIVE</span>
          </div>
          <h2 className="text-display-xl mb-4">
            Conçu Pour{" "}
            <span className="gradient-text">Vous</span>
          </h2>
          <p style={{ color: "var(--color-muted)" }} className="max-w-md mx-auto">
            Chaque fonctionnalité a été pensée avec une seule priorité : votre sécurité et votre confort.
          </p>
        </div>

        {/* Divider */}
        <div className="divider-gold mb-16" />

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="card-luxury moroccan-arch-card p-6 hover:scale-[1.02] transition-transform duration-300"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                style={{ background: f.bg, color: f.color }}>
                {f.icon}
              </div>
              <h3 className="text-lg font-semibold mb-1" style={{ fontFamily: "var(--font-display)" }}>
                {f.title}
              </h3>
              <p className="text-xs mb-3" style={{ fontFamily: "var(--font-arabic)", direction: "rtl", color: "var(--color-muted)" }}>
                {f.titleAr}
              </p>
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
// HOW IT WORKS
// ============================================================
function HowItWorksSection() {
  const steps = [
    { num: "01", icon: <MapPin size={32} color="white" />, title: "Entrez votre destination", desc: "Indiquez où vous êtes et où vous allez. Notre carte interactive vous aide à localiser avec précision." },
    { num: "02", icon: <Coins size={32} color="white" />, title: "Proposez votre prix", desc: "Fixez le prix que vous souhaitez payer. Les conductrices disponibles verront votre demande." },
    { num: "03", icon: <Users size={32} color="white" />, title: "Choisissez votre conductrice", desc: "Consultez les profils, notes et offres des conductrices. Sélectionnez celle qui vous convient." },
    { num: "04", icon: <CarFront size={32} color="white" />, title: "Voyagez en sécurité", desc: "Suivez votre trajet en temps réel. Partagez votre position avec vos proches. Arrivez sereine." },
  ];

  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 relative overflow-hidden" style={{ background: "#FFFDF9" }}>
      <div className="zellige-pattern absolute inset-0 opacity-20" />
      <div className="container-app mx-auto relative z-10">
        <div className="text-center mb-16">
          <span className="badge badge-success mb-4 text-xs tracking-widest">COMMENT ÇA MARCHE</span>
          <h2 className="text-display-xl">
            Simple Comme <span className="gradient-text">Bonjour</span>
          </h2>
        </div>

        <div className="relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-16 left-1/2 -translate-x-1/2 w-3/4 h-px"
            style={{ background: "linear-gradient(90deg, transparent, var(--color-rose-300), transparent)" }}
          />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <div key={step.num} className="flex flex-col items-center text-center group">
                <div className="relative mb-6">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg relative z-10 transition-transform duration-300 group-hover:scale-110"
                    style={{ background: i % 2 === 0 ? "linear-gradient(135deg, var(--color-rose-500), var(--color-rose-700))" : "linear-gradient(135deg, var(--color-purple-400), var(--color-purple-600))", boxShadow: i % 2 === 0 ? "var(--shadow-rose)" : "var(--shadow-gold)" }}>
                    {step.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ background: "var(--color-purple-400)", color: "white" }}>
                    {step.num}
                  </div>
                </div>
                <h3 className="font-semibold mb-3 text-base" style={{ fontFamily: "var(--font-display)" }}>
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
            <h2 className="text-display-xl text-black mb-6">
              Sécurité de{" "}
              <span className="gradient-text-emerald">Niveau</span>
              {" "}Entreprise
            </h2>
            <p className="mb-8" style={{ color: "rgba(0,0,0,0.6)", lineHeight: "1.8" }}>
              SheDrive Morocco intègre les technologies de sécurité les plus avancées.
              Chaque trajet est surveillé en temps réel par notre équipe dédiée.
            </p>
            <p className="text-sm mb-10" style={{ color: "rgba(0,0,0,0.6)", fontFamily: "var(--font-arabic)", direction: "rtl" }}>
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
                <div className="text-gold-400 mb-2 flex justify-center text-rose-gold-200">
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
              <div className="mb-3 flex justify-center text-rose-gold-500">
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
// TESTIMONIALS
// ============================================================
function TestimonialsSection() {
  const testimonials = [
    {
      name: "Fatima Z.",
      city: "Casablanca",
      text: "Enfin un service qui comprend nos besoins ! Je me sens vraiment en sécurité à chaque trajet.",
      rating: 5,
      initials: "FZ",
    },
    {
      name: "Khadija M.",
      city: "Marrakech",
      desc: "Conductrice",
      text: "SheDrive m'a permis de travailler avec flexibilité tout en aidant d'autres femmes. C'est libérateur.",
      rating: 5,
      initials: "KM",
    },
    {
      name: "Amina B.",
      city: "Rabat",
      text: "L'interface est magnifique et le système de négociation de prix est vraiment pratique.",
      rating: 5,
      initials: "AB",
    },
  ];

  return (
    <section className="py-16 md:py-24 px-4 sm:px-6" style={{ background: "var(--color-silver-50)" }}>
      <div className="container-app mx-auto">
        <div className="text-center mb-16">
          <span className="badge badge-primary mb-4 text-xs tracking-widest">TÉMOIGNAGES</span>
          <h2 className="text-display-xl">
            Elles Nous Font <span className="gradient-text">Confiance</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="card-luxury p-6">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg"
                  style={{ background: "rgba(225,29,72,0.1)", color: "var(--color-rose-600)" }}>
                  {t.initials}
                </div>
                <div>
                  <div className="font-semibold">{t.name}</div>
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
              <p className="text-sm leading-relaxed" style={{ color: "var(--color-muted)" }}>
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
// CTA SECTION
// ============================================================
function CTASection() {
  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, var(--color-rose-600) 0%, var(--color-rose-800) 50%, #2C1F12 100%)" }}>
      <div className="zellige-pattern absolute inset-0 opacity-15" />
      <div className="container-app mx-auto relative z-10 text-center">
        <h2 className="text-display-xl text-black mb-6">
          Prête à Voyager{" "}
          <span style={{ color: "var(--color-purple-300)" }}>Autrement</span> ?
        </h2>
        <p className="text-base mb-4" style={{ fontFamily: "var(--font-arabic)", direction: "rtl", color: "rgba(0,0,0,0.6)" }}>
          انضمي إلى آلاف النساء اللواتي يتنقلن بأمان وأناقة مع شي درايف
        </p>
        <p className="mb-10 max-w-md mx-auto" style={{ color: "rgba(0,0,0,0.6)" }}>
          Rejoignez des milliers de femmes qui voyagent en toute sécurité avec SheDrive Morocco.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/auth/register?role=passenger" className="btn btn-xl gap-3"
            style={{ background: "white", color: "var(--color-rose-700)" }}>
            <CarFront size={20} />
            Je suis passagère
          </Link>
          <Link href="/auth/register?role=driver" className="btn btn-xl gap-3"
            style={{ background: "rgba(255,255,255,0.92)", color: "white", border: "1.5px solid rgba(0,0,0,0.6)", backdropFilter: "blur(10px)" }}>
            <Sparkles size={20} />
            Je suis conductrice
          </Link>
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
        background: scrolled ? "rgba(0,0,0,0.6)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(225,29,72,0.2)" : "none",
      }}>
      <div className="container-app mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 object-cover rounded-full border border-rose-200 overflow-hidden flex items-center justify-center bg-white flex-shrink-0"><img src="/logo.png" alt="SheDrive Logo" className="w-full h-full object-cover mix-blend-multiply scale-[1.15]" /></div>
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
              className="text-sm font-medium transition-colors duration-200"
              style={{ color: "rgba(0,0,0,0.7)" }}
              onMouseEnter={(e) => ((e.target as HTMLAnchorElement).style.color = "var(--color-rose-600)")}
              onMouseLeave={(e) => ((e.target as HTMLAnchorElement).style.color = "rgba(0,0,0,0.7)")}>
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
        <div className="md:hidden px-6 pb-6 animate-slide-down shadow-lg"
          style={{ background: "rgba(255,255,255,0.92)", borderBottom: "1px solid rgba(225,29,72,0.2)" }}>
          <div className="flex flex-col gap-4 pt-4">
            {[
              { href: "/about", label: "À propos" },
              { href: "/safety", label: "Sécurité" },
              { href: "/how-it-works", label: "Comment ça marche" },
            ].map((link) => (
              <Link key={link.href} href={link.href}
                className="text-sm font-medium py-2 border-b"
                style={{ color: "rgba(0,0,0,0.7)", borderColor: "rgba(225,29,72,0.15)" }}
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
// FOOTER
// ============================================================
function Footer() {
  return (
    <footer style={{ background: "#F3F4F6", color: "rgba(0,0,0,0.6)" }}>
      <div className="zellige-pattern opacity-5" style={{ height: "4px", background: "linear-gradient(90deg, var(--color-rose-500), var(--color-purple-400), var(--color-purple-500))" }} />
      <div className="container-app mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 object-cover rounded-full border border-rose-200 overflow-hidden flex items-center justify-center bg-white flex-shrink-0"><img src="/logo.png" alt="SheDrive Logo" className="w-full h-full object-cover mix-blend-multiply scale-[1.15]" /></div>
              <span className="text-lg font-bold text-black" style={{ fontFamily: "var(--font-display)" }}>SheDrive Morocco</span>
            </div>
            <p className="text-sm leading-relaxed mb-4">
              La première plateforme de covoiturage exclusivement féminine au Maroc.
            </p>
            <p className="text-xs" style={{ fontFamily: "var(--font-arabic)", direction: "rtl", color: "rgba(0,0,0,0.4)" }}>
              أول منصة نقل حصرية للمرأة في المغرب
            </p>
          </div>

          {/* Links */}
          {[
            {
              title: "Application",
              links: [
                { href: "/passenger/dashboard", label: "Espace Passagère" },
                { href: "/driver/dashboard", label: "Espace Conductrice" },
                { href: "/how-it-works", label: "Comment ça marche" },
                { href: "/auth/register", label: "S'inscrire" },
              ],
            },
            {
              title: "Entreprise",
              links: [
                { href: "/about", label: "À propos" },
                { href: "/safety", label: "Sécurité" },
                { href: "/contact", label: "Contact" },
                { href: "/support", label: "Support" },
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
              <h4 className="text-black font-semibold mb-4 text-sm">{col.title}</h4>
              <ul className="flex flex-col gap-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href}
                      className="text-sm hover:text-black transition-colors duration-200"
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
            © 2025 SheDrive Morocco. Tous droits réservés.
          </p>
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
// LANDING PAGE
// ============================================================
export default function LandingPage() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <SafetySection />
      <CitiesSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </main>
  );
}
