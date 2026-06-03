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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-hero-gradient">
      {/* Zellige Pattern Overlay */}
      <div
        className="absolute inset-0 zellige-pattern opacity-30"
        style={{ transform: `translateY(${scrollY * 0.3}px)` }}
      />

      {/* Radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(200,149,108,0.15) 0%, rgba(13,122,74,0.08) 50%, transparent 70%)",
        }}
      />

      {/* Decorative Arcs */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <svg className="absolute -top-20 -right-20 w-96 h-96 opacity-10" viewBox="0 0 400 400" fill="none">
          <circle cx="200" cy="200" r="180" stroke="#C8956C" strokeWidth="1" strokeDasharray="8 4"/>
          <circle cx="200" cy="200" r="140" stroke="#D4A017" strokeWidth="0.5" strokeDasharray="4 8"/>
          <circle cx="200" cy="200" r="100" stroke="#C8956C" strokeWidth="1"/>
          {/* Moroccan star pattern */}
          <path d="M200 60 L215 140 L290 100 L230 160 L290 220 L215 180 L200 260 L185 180 L110 220 L170 160 L110 100 L185 140 Z" stroke="#D4A017" strokeWidth="0.8" fill="none"/>
        </svg>

        <svg className="absolute -bottom-20 -left-20 w-80 h-80 opacity-10" viewBox="0 0 320 320" fill="none">
          <circle cx="160" cy="160" r="140" stroke="#0D7A4A" strokeWidth="1" strokeDasharray="6 4"/>
          <circle cx="160" cy="160" r="100" stroke="#C8956C" strokeWidth="0.6"/>
          <path d="M160 40 L173 120 L240 80 L190 140 L240 200 L173 160 L160 240 L147 160 L80 200 L130 140 L80 80 L147 120 Z" stroke="#C8956C" strokeWidth="0.7" fill="none"/>
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 container-app py-28 text-center flex flex-col items-center justify-center gap-5 sm:gap-7">

        {/* SUBTITLE — TOP */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full animate-fade-in text-[11px] sm:text-sm"
          style={{ background: "rgba(200,149,108,0.15)", border: "1px solid rgba(200,149,108,0.3)" }}>
          <Flower2 size={14} color="var(--color-rose-gold-500)" />
          <span className="font-medium" style={{ color: "var(--color-rose-gold-400)" }}>
            Service exclusivement féminin au Maroc
          </span>
        </div>

        {/* TITLE — MIDDLE */}
        <h1 className="text-3xl sm:text-5xl md:text-display-2xl text-white animate-slide-up leading-tight font-bold">
          Voyagez en{" "}
          <span className="gradient-text">Toute Sécurité</span>
          <br />
          <span className="text-2xl sm:text-3xl md:text-display-xl" style={{ color: "rgba(255,255,255,0.85)" }}>
            Entre Femmes
          </span>
        </h1>

        {/* DESCRIPTION — MIDDLE */}
        <div className="max-w-2xl flex flex-col gap-3">
          <p className="text-sm sm:text-base animate-slide-up delay-100"
            style={{ color: "rgba(255,255,255,0.6)", fontFamily: "var(--font-arabic)", direction: "rtl", lineHeight: "1.7" }}>
            خدمة نقل حصرية للمرأة المغربية — أمان، أناقة، تمكين
          </p>

          <p className="text-sm sm:text-base animate-slide-up delay-200 leading-relaxed"
            style={{ color: "rgba(255,255,255,0.55)", lineHeight: "1.7" }}>
            SheDrive Morocco est la première plateforme de covoiturage réservée aux femmes. Conductrices vérifiées, trajets sécurisés, expérience premium dans toutes les villes marocaines.
          </p>
        </div>

        {/* BUTTONS — BOTTOM */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full max-w-md sm:max-w-none sm:w-auto justify-center animate-slide-up delay-300">
          <Link href="/auth/register?role=passenger" className="btn btn-primary btn-lg w-full sm:w-auto">
            <CarFront size={18} />
            <span>Réserver un Trajet</span>
          </Link>
          <Link href="/auth/register?role=driver" className="btn btn-lg w-full sm:w-auto"
            style={{ background: "rgba(255,255,255,0.1)", color: "white", border: "1.5px solid rgba(200,149,108,0.4)", backdropFilter: "blur(10px)" }}>
            <Sparkles size={18} />
            <span>Devenir Conductrice</span>
          </Link>
        </div>

        {/* STATS — BOTTOM */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 w-full max-w-md animate-slide-up delay-400">
          {[
            { value: "18+", label: "Villes", labelAr: "مدينة" },
            { value: "100%", label: "Femmes", labelAr: "نساء" },
            { value: "24/7", label: "Support", labelAr: "دعم" },
          ].map((stat) => (
            <div key={stat.label} className="text-center p-3 sm:p-4 rounded-xl sm:rounded-2xl"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(200,149,108,0.2)" }}>
              <div className="text-base sm:text-xl gradient-text leading-tight font-bold">{stat.value}</div>
              <div className="text-[10px] sm:text-xs mt-1" style={{ color: "rgba(255,255,255,0.5)" }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
        <div className="w-6 h-10 rounded-full border-2 flex items-start justify-center p-1"
          style={{ borderColor: "rgba(200,149,108,0.4)" }}>
          <div className="w-1 h-2 rounded-full" style={{ background: "#C8956C", animation: "slideDown 1.5s ease-in-out infinite" }}/>
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
      color: "var(--color-emerald-500)",
      bg: "rgba(13,122,74,0.08)",
    },
    {
      icon: <Gem size={28} color="currentColor" />,
      title: "Expérience Premium",
      titleAr: "تجربة راقية",
      desc: "Véhicules élégants, conductrices professionnelles, et une interface luxueuse pensée pour vous.",
      color: "var(--color-rose-gold-500)",
      bg: "rgba(200,149,108,0.08)",
    },
    {
      icon: <Handshake size={28} color="currentColor" />,
      title: "Prix Négociables",
      titleAr: "أسعار قابلة للتفاوض",
      desc: "Proposez votre prix. Les conductrices font leurs offres. Vous choisissez la meilleure option.",
      color: "var(--color-gold-500)",
      bg: "rgba(212,160,23,0.08)",
    },
    {
      icon: <Map size={28} color="currentColor" />,
      title: "Tout le Maroc",
      titleAr: "كل المغرب",
      desc: "18 villes marocaines couvertes, de Casablanca à Agadir, de Tanger à Oujda.",
      color: "var(--color-emerald-500)",
      bg: "rgba(13,122,74,0.08)",
    },
    {
      icon: <MessageCircle size={28} color="currentColor" />,
      title: "Chat Intégré",
      titleAr: "محادثة مدمجة",
      desc: "Communication chiffrée entre passagères et conductrices, avec messages vocaux.",
      color: "var(--color-rose-gold-500)",
      bg: "rgba(200,149,108,0.08)",
    },
    {
      icon: <Wallet size={28} color="currentColor" />,
      title: "Paiements Flexibles",
      titleAr: "دفع مرن",
      desc: "Espèces, carte bancaire, CMI, ou portefeuille SheDrive. En dirhams marocains.",
      color: "var(--color-gold-500)",
      bg: "rgba(212,160,23,0.08)",
    },
  ];

  return (
    <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6" style={{ background: "var(--color-sand-50)" }}>
      <div className="container-app mx-auto">
        {/* HEADER SECTION */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-block mb-4 sm:mb-6">
            <span className="badge badge-primary text-xs tracking-widest">POURQUOI SHEDRIVE</span>
          </div>
          <h2 className="text-display-xl mb-4 sm:mb-6">
            Conçu Pour{" "}
            <span className="gradient-text">Vous</span>
          </h2>
          <p style={{ color: "var(--color-muted)" }} className="max-w-md mx-auto text-sm sm:text-base">
            Chaque fonctionnalité a été pensée avec une seule priorité : votre sécurité et votre confort.
          </p>
        </div>

        {/* DIVIDER */}
        <div className="divider-gold mb-12 sm:mb-16" />

        {/* FEATURES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="card-luxury moroccan-arch-card p-4 sm:p-6 hover:scale-[1.02] transition-transform duration-300 flex flex-col gap-4 sm:gap-5"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {/* Icon Section */}
              <div>
                <div className="w-12 sm:w-14 h-12 sm:h-14 rounded-2xl flex items-center justify-center mb-2 sm:mb-3"
                  style={{ background: f.bg, color: f.color }}>
                  {f.icon}
                </div>
              </div>

              {/* Title Section */}
              <div>
                <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2" style={{ fontFamily: "var(--font-display)" }}>
                  {f.title}
                </h3>
                <p className="text-xs mb-2 sm:mb-3" style={{ fontFamily: "var(--font-arabic)", direction: "rtl", color: "var(--color-muted)" }}>
                  {f.titleAr}
                </p>
              </div>

              {/* Description Section */}
              <p className="text-xs sm:text-sm leading-relaxed flex-grow" style={{ color: "var(--color-muted)" }}>
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
    <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 relative overflow-hidden" style={{ background: "#FFFDF9" }}>
      <div className="zellige-pattern absolute inset-0 opacity-20" />
      <div className="container-app mx-auto relative z-10">
        {/* HEADER SECTION */}
        <div className="text-center mb-12 sm:mb-16">
          <span className="badge badge-success mb-4 sm:mb-6 text-xs tracking-widest">COMMENT ÇA MARCHE</span>
          <h2 className="text-display-xl mb-4 sm:mb-6">
            Simple Comme <span className="gradient-text">Bonjour</span>
          </h2>
        </div>

        {/* STEPS GRID */}
        <div className="relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-16 left-1/2 -translate-x-1/2 w-3/4 h-px"
            style={{ background: "linear-gradient(90deg, transparent, var(--color-rose-gold-300), transparent)" }}
          />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 sm:gap-8">
            {steps.map((step, i) => (
              <div key={step.num} className="flex flex-col items-center text-center group gap-4 sm:gap-5">
                {/* ICON/NUMBER SECTION */}
                <div className="relative mb-2 sm:mb-3">
                  <div className="w-14 sm:w-16 h-14 sm:h-16 rounded-full flex items-center justify-center shadow-lg relative z-10 transition-transform duration-300 group-hover:scale-110"
                    style={{ background: i % 2 === 0 ? "linear-gradient(135deg, var(--color-rose-gold-500), var(--color-rose-gold-700))" : "linear-gradient(135deg, var(--color-gold-400), var(--color-gold-600))", boxShadow: i % 2 === 0 ? "var(--shadow-rose)" : "var(--shadow-gold)" }}>
                    {step.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ background: "var(--color-gold-400)", color: "white" }}>
                    {step.num}
                  </div>
                </div>

                {/* TITLE SECTION */}
                <h3 className="font-semibold text-sm sm:text-base" style={{ fontFamily: "var(--font-display)" }}>
                  {step.title}
                </h3>

                {/* DESCRIPTION SECTION */}
                <p className="text-xs sm:text-sm leading-relaxed flex-grow" style={{ color: "var(--color-muted)" }}>
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
    <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, var(--color-rose-gold-900) 0%, var(--color-rose-gold-800) 100%)" }}>
      <div className="zellige-pattern absolute inset-0" style={{ opacity: 0.12 }} />

      <div className="absolute top-0 right-0 w-96 h-96 rounded-full -translate-y-1/2 translate-x-1/2"
        style={{ background: "radial-gradient(circle, rgba(13,122,74,0.2) 0%, transparent 70%)" }}
      />

      <div className="container-app mx-auto relative z-10">
        <div className="grid md:grid-cols-2 gap-8 sm:gap-12 items-center">
          {/* LEFT SECTION */}
          <div>
            {/* Badge */}
            <span className="badge mb-4 sm:mb-6 text-xs tracking-widest"
              style={{ background: "rgba(13,122,74,0.2)", color: "#4DBF8A", border: "1px solid rgba(13,122,74,0.3)" }}>
              VOTRE SÉCURITÉ D'ABORD
            </span>

            {/* Title */}
            <h2 className="text-display-xl text-white mb-6 sm:mb-8">
              Sécurité de{" "}
              <span className="gradient-text-emerald">Niveau</span>
              {" "}Entreprise
            </h2>

            {/* Description */}
            <p className="mb-6 sm:mb-8 text-sm sm:text-base" style={{ color: "rgba(255,255,255,0.6)", lineHeight: "1.8" }}>
              SheDrive Morocco intègre les technologies de sécurité les plus avancées.
              Chaque trajet est surveillé en temps réel par notre équipe dédiée.
            </p>

            <p className="text-xs sm:text-sm mb-8 sm:mb-10" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-arabic)", direction: "rtl" }}>
              كل رحلة خاضعة للمراقبة الفورية لضمان سلامتك في كل لحظة
            </p>

            {/* Button */}
            <Link href="/safety" className="btn btn-emerald btn-lg text-sm sm:text-base">
              En Savoir Plus sur la Sécurité →
            </Link>
          </div>

          {/* RIGHT SECTION - Safety Features Grid */}
          <div className="grid grid-cols-2 gap-2 sm:gap-4">
            {features.map((f) => (
              <div key={f.label} className="p-3 sm:p-5 rounded-2xl text-center transition-all duration-300 hover:scale-105 cursor-default flex flex-col gap-2 sm:gap-3 justify-center items-center"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(212,160,23,0.3)" }}>
                {/* Icon */}
                <div className="text-gold-400 flex justify-center text-rose-gold-200 text-lg sm:text-xl">
                  {f.icon}
                </div>

                {/* Label */}
                <div className="text-[10px] sm:text-xs font-semibold text-white leading-tight">{f.label}</div>

                {/* Sub-label */}
                <div className="text-[9px] sm:text-xs" style={{ color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-arabic)" }}>{f.sub}</div>
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
    <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 relative" style={{ background: "var(--color-emerald-50)" }}>
      <div className="zellige-pattern absolute inset-0 opacity-10" />
      <div className="container-app mx-auto relative z-10">
        {/* HEADER SECTION */}
        <div className="text-center mb-12 sm:mb-16">
          <span className="badge badge-warning mb-4 sm:mb-6 text-xs tracking-widest">COUVERTURE NATIONALE</span>
          <h2 className="text-display-xl mb-4 sm:mb-6">
            Disponible dans <span className="gradient-text">18 Villes</span>
          </h2>
          <p className="text-sm sm:text-base" style={{ color: "var(--color-muted)" }}>
            De Tanger à Agadir, SheDrive couvre tout le Maroc
          </p>
        </div>

        {/* CITIES GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-4">
          {cities.map((city) => (
            <div key={city.name}
              className="p-2.5 sm:p-4 rounded-lg sm:rounded-xl text-center cursor-pointer group flex flex-col gap-1.5 sm:gap-2"
              style={{
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.background = "linear-gradient(135deg, rgba(200,149,108,0.08), rgba(13,122,74,0.05))";
                (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(200,149,108,0.3)";
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.background = "var(--color-surface)";
                (e.currentTarget as HTMLDivElement).style.borderColor = "var(--color-border)";
                (e.currentTarget as HTMLDivElement).style.transform = "none";
              }}
            >
              {/* Icon */}
              <div className="flex justify-center text-rose-gold-500">
                <MapPin size={20} color="var(--color-gold-500)" />
              </div>

              {/* City name */}
              <div className="text-xs sm:text-sm font-semibold">{city.name}</div>

              {/* Arabic name */}
              <div className="text-[10px] sm:text-xs" style={{ color: "var(--color-muted)", fontFamily: "var(--font-arabic)" }}>
                {city.nameAr}
              </div>
            </div>
          ))}
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
    <section className="py-16 md:py-24 px-4 sm:px-6" style={{ background: "var(--color-sand-50)" }}>
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
                  style={{ background: "rgba(200,149,108,0.1)", color: "var(--color-rose-gold-600)" }}>
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
                  <Star key={i} size={16} fill="var(--color-gold-400)" color="var(--color-gold-400)" />
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
      style={{ background: "linear-gradient(135deg, var(--color-rose-gold-600) 0%, var(--color-rose-gold-800) 50%, #2C1F12 100%)" }}>
      <div className="zellige-pattern absolute inset-0 opacity-15" />
      <div className="container-app mx-auto relative z-10 text-center">
        <h2 className="text-display-xl text-white mb-6">
          Prête à Voyager{" "}
          <span style={{ color: "var(--color-gold-300)" }}>Autrement</span> ?
        </h2>
        <p className="text-base mb-4" style={{ fontFamily: "var(--font-arabic)", direction: "rtl", color: "rgba(255,255,255,0.7)" }}>
          انضمي إلى آلاف النساء اللواتي يتنقلن بأمان وأناقة مع شي درايف
        </p>
        <p className="mb-10 max-w-md mx-auto" style={{ color: "rgba(255,255,255,0.6)" }}>
          Rejoignez des milliers de femmes qui voyagent en toute sécurité avec SheDrive Morocco.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/auth/register?role=passenger" className="btn btn-xl gap-3"
            style={{ background: "white", color: "var(--color-rose-gold-700)" }}>
            <CarFront size={20} />
            Je suis passagère
          </Link>
          <Link href="/auth/register?role=driver" className="btn btn-xl gap-3"
            style={{ background: "rgba(255,255,255,0.15)", color: "white", border: "1.5px solid rgba(255,255,255,0.3)", backdropFilter: "blur(10px)" }}>
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
        background: scrolled ? "rgba(26,21,15,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(200,149,108,0.2)" : "none",
      }}>
      <div className="container-app mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-lg"
            style={{ background: "linear-gradient(135deg, var(--color-rose-gold-500), var(--color-rose-gold-700))" }}>
            <Flower2 size={20} color="white" />
          </div>
          <span className="text-lg font-bold text-white" style={{ fontFamily: "var(--font-display)" }}>
            SheDrive
            <span className="text-sm font-normal ml-1" style={{ color: "var(--color-rose-gold-400)" }}>Morocco</span>
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
              style={{ color: "rgba(255,255,255,0.7)" }}
              onMouseEnter={(e) => ((e.target as HTMLAnchorElement).style.color = "var(--color-rose-gold-400)")}
              onMouseLeave={(e) => ((e.target as HTMLAnchorElement).style.color = "rgba(255,255,255,0.7)")}>
              {link.label}
            </Link>
          ))}
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/auth/login" className="btn btn-sm" style={{ color: "white", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.18)" }}>
            Connexion
          </Link>
          <Link href="/auth/register" className="btn btn-sm btn-primary">
            S'inscrire
          </Link>
        </div>

        {/* Mobile menu button */}
        <button className="md:hidden text-white p-2" onClick={() => setMenuOpen(!menuOpen)}>
          <div className="w-5 h-0.5 bg-white mb-1 transition-all" style={{ transform: menuOpen ? "rotate(45deg) translateY(6px)" : "none" }} />
          <div className="w-5 h-0.5 bg-white mb-1 transition-all" style={{ opacity: menuOpen ? 0 : 1 }} />
          <div className="w-5 h-0.5 bg-white transition-all" style={{ transform: menuOpen ? "rotate(-45deg) translateY(-6px)" : "none" }} />
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden px-6 pb-6 animate-slide-down"
          style={{ background: "rgba(26,21,15,0.96)", borderBottom: "1px solid rgba(200,149,108,0.2)" }}>
          <div className="flex flex-col gap-4 pt-4">
            {[
              { href: "/about", label: "À propos" },
              { href: "/safety", label: "Sécurité" },
              { href: "/how-it-works", label: "Comment ça marche" },
            ].map((link) => (
              <Link key={link.href} href={link.href}
                className="text-sm font-medium py-2 border-b"
                style={{ color: "rgba(255,255,255,0.7)", borderColor: "rgba(200,149,108,0.15)" }}
                onClick={() => setMenuOpen(false)}>
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col gap-3 pt-2">
              <Link href="/auth/login" className="btn btn-outline w-full" style={{ color: "rgba(255,255,255,0.8)", borderColor: "rgba(200,149,108,0.4)" }}
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
    <footer style={{ background: "#0D0A07", color: "rgba(255,255,255,0.6)" }}>
      <div className="zellige-pattern opacity-5" style={{ height: "4px", background: "linear-gradient(90deg, var(--color-rose-gold-500), var(--color-gold-400), var(--color-emerald-500))" }} />
      <div className="container-app mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-lg"
                style={{ background: "linear-gradient(135deg, var(--color-rose-gold-500), var(--color-rose-gold-700))" }}>
                <Flower2 size={20} color="white" />
              </div>
              <span className="text-lg font-bold text-white" style={{ fontFamily: "var(--font-display)" }}>SheDrive Morocco</span>
            </div>
            <p className="text-sm leading-relaxed mb-4">
              La première plateforme de covoiturage exclusivement féminine au Maroc.
            </p>
            <p className="text-xs" style={{ fontFamily: "var(--font-arabic)", direction: "rtl", color: "rgba(255,255,255,0.4)" }}>
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
              <h4 className="text-white font-semibold mb-4 text-sm">{col.title}</h4>
              <ul className="flex flex-col gap-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href}
                      className="text-sm hover:text-white transition-colors duration-200"
                      style={{ color: "rgba(255,255,255,0.5)" }}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="divider mb-8" style={{ background: "linear-gradient(90deg, transparent, rgba(200,149,108,0.3), transparent)" }} />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
            © 2025 SheDrive Morocco. Tous droits réservés.
          </p>
          <div className="flex items-center gap-2 text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
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
