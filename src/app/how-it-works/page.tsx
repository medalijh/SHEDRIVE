"use client";

import Link from "next/link";
import { UserCircle, MapPin, Coins, CarFront, ShieldCheck, ClipboardEdit, FileCheck2, SearchCheck, GraduationCap, Power, Banknote, Star } from "lucide-react";

function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50"
      style={{ background: "rgba(255,255,255,0.92)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(225,29,72,0.2)" }}>
      <div className="container-app mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 object-cover rounded-full border border-rose-200 overflow-hidden flex items-center justify-center bg-white flex-shrink-0"><img src="/logo.png" alt="SheDrive Logo" className="w-full h-full object-cover mix-blend-multiply scale-[1.15]" /></div>
          <span className="text-lg font-bold text-black" style={{ fontFamily: "var(--font-display)" }}>SheDrive <span className="text-sm font-normal" style={{ color: "var(--color-rose-400)" }}>Morocco</span></span>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/auth/login" className="btn btn-sm btn-ghost text-black">Connexion</Link>
          <Link href="/auth/register" className="btn btn-sm btn-primary">S'inscrire</Link>
        </div>
      </div>
    </nav>
  );
}

export default function HowItWorksPage() {
  const passengerSteps = [
    { num: "01", icon: <UserCircle size={24} />, title: "Créez votre compte", desc: "Téléchargez l'application et inscrivez-vous en 2 minutes avec votre numéro de téléphone." },
    { num: "02", icon: <MapPin size={24} />, title: "Entrez votre destination", desc: "Saisissez votre point de départ et d'arrivée. Consultez le prix estimé pour votre trajet." },
    { num: "03", icon: <Coins size={24} />, title: "Proposez votre prix", desc: "Vous avez la liberté de proposer le prix qui vous convient ou d'accepter le tarif recommandé." },
    { num: "04", icon: <CarFront size={24} />, title: "Choisissez votre conductrice", desc: "Recevez des offres. Consultez le profil, la photo et la note de la conductrice avant d'accepter." },
    { num: "05", icon: <ShieldCheck size={24} />, title: "Voyagez en sécurité", desc: "Suivez votre trajet en temps réel, partagez-le avec un proche, et utilisez le bouton SOS si besoin." },
    { num: "06", icon: <Star size={24} />, title: "Évaluez votre expérience", desc: "Notez la conductrice et laissez un commentaire pour améliorer la communauté." },
  ];

  const driverSteps = [
    { num: "01", icon: <ClipboardEdit size={24} />, title: "Inscription gratuite", desc: "Remplissez le formulaire d'inscription en fournissant vos informations de base et coordonnées." },
    { num: "02", icon: <FileCheck2 size={24} />, title: "Vérification d'identité", desc: "Soumettez votre CIN, selfie de vérification, permis de conduire et informations du véhicule." },
    { num: "03", icon: <SearchCheck size={24} />, title: "Examen du dossier", desc: "Notre équipe examine votre dossier sous 24 à 48 heures et vous notifie par SMS." },
    { num: "04", icon: <GraduationCap size={24} />, title: "Approbation et formation", desc: "Une fois approuvée, accédez à notre formation en ligne sur la sécurité et les bonnes pratiques." },
    { num: "05", icon: <Power size={24} />, title: "Passez en ligne", desc: "Activez le mode en ligne pour recevoir les demandes de trajet des passagères proches." },
    { num: "06", icon: <Banknote size={24} />, title: "Gagnez en liberté", desc: "Acceptez les demandes qui vous conviennent. Retirez vos gains quand vous le souhaitez." },
  ];

  const faqs = [
    { q: "Comment SheDrive garantit-il que les conductrices sont des femmes ?", a: "Chaque conductrice passe par une vérification CIN + selfie comparée par notre équipe et IA. Les documents légaux confirment le genre." },
    { q: "Que se passe-t-il si je me sens en danger ?", a: "Maintenez le bouton SOS rouge 3 secondes. Une alerte est immédiatement envoyée à vos contacts et à notre équipe 24h/7j." },
    { q: "Comment fonctionne la négociation de prix ?", a: "Vous proposez un prix. Les conductrices voient votre offre et peuvent l'accepter ou faire une contre-offre. Vous choisissez librement." },
    { q: "Quels modes de paiement sont acceptés ?", a: "Espèces, carte bancaire marocaine, CMI, PayZone, ou wallet SheDrive rechargeable." },
    { q: "SheDrive est-il disponible 24h/24 ?", a: "Oui ! SheDrive fonctionne 24h/24 et 7j/7 dans les 18 villes marocaines disponibles." },
    { q: "Comment devenir conductrice SheDrive ?", a: "Cliquez sur 'Devenir Conductrice', remplissez le formulaire d'inscription, soumettez vos documents et attendez l'approbation sous 48h." },
  ];

  return (
    <div style={{ background: "var(--color-silver-50)" }}>
      <Navbar />

      {/* Hero */}
      <section className="pt-28 pb-16 px-6 text-center relative overflow-hidden bg-white">
        <div className="zellige-pattern absolute inset-0 opacity-20"/>
        <div className="container-app mx-auto relative z-10">
          <span className="badge mb-6 text-xs tracking-widest" style={{ background: "rgba(225,29,72,0.15)", color: "var(--color-rose-400)", border: "1px solid rgba(225,29,72,0.3)" }}>COMMENT ÇA MARCHE</span>
          <h1 className="text-display-xl text-black mb-4">Simple, Rapide,<br/><span className="gradient-text">Sécurisé</span></h1>
          <p style={{ color: "rgba(0,0,0,0.6)" }}>Tout ce que vous devez savoir pour utiliser SheDrive Morocco</p>
        </div>
      </section>

      {/* Passenger Steps */}
      <section className="py-20 px-6">
        <div className="container-app mx-auto">
          <div className="text-center mb-14">
            <span className="badge badge-primary mb-4 text-xs">POUR LES PASSAGÈRES</span>
            <h2 className="text-display-lg">Réservez un trajet <span className="gradient-text">en 4 étapes</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {passengerSteps.map((s, i) => (
              <div key={s.num} className="card-luxury p-6 relative">
                <div className="absolute top-4 right-4 text-4xl font-bold opacity-5" style={{ fontFamily: "var(--font-display)", color: "var(--color-rose-500)" }}>{s.num}</div>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-4"
                  style={{ background: i % 2 === 0 ? "rgba(225,29,72,0.1)" : "rgba(147,51,234,0.08)", color: "var(--color-rose-600)" }}>{s.icon}</div>
                <div className="text-xs font-semibold mb-2" style={{ color: "var(--color-rose-500)", letterSpacing: "0.08em" }}>ÉTAPE {s.num}</div>
                <h3 className="font-semibold mb-2" style={{ fontFamily: "var(--font-display)" }}>{s.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--color-muted)" }}>{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/auth/register?role=passenger" className="btn btn-primary btn-lg flex items-center justify-center gap-2 max-w-sm mx-auto">
              <UserCircle size={20} /> Créer mon compte passagère
            </Link>
          </div>
        </div>
      </section>

      {/* Driver Steps */}
      <section className="py-20 px-6 relative" style={{ background: "linear-gradient(135deg, var(--color-silver-50) 0%, var(--color-silver-100) 100%)" }}>
        <div className="zellige-pattern absolute inset-0 opacity-8"/>
        <div className="container-app mx-auto relative z-10">
          <div className="text-center mb-14">
            <span className="badge mb-4 text-xs" style={{ background: "rgba(147,51,234,0.2)", color: "#4DBF8A", border: "1px solid rgba(147,51,234,0.3)" }}>POUR LES CONDUCTRICES</span>
            <h2 className="text-display-lg text-black">Commencez à <span className="gradient-text-emerald">conduire</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {driverSteps.map((s, i) => (
              <div key={s.num} className="p-6 rounded-2xl relative"
                style={{ background: "rgba(255,255,255,0.92)", border: "1px solid rgba(147,51,234,0.2)" }}>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-4"
                  style={{ background: "rgba(147,51,234,0.15)", color: "#4DBF8A" }}>{s.icon}</div>
                <div className="text-xs font-semibold mb-2" style={{ color: "var(--color-purple-400)", letterSpacing: "0.08em" }}>ÉTAPE {s.num}</div>
                <h3 className="font-semibold mb-2 text-black" style={{ fontFamily: "var(--font-display)" }}>{s.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(0,0,0,0.6)" }}>{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/auth/register?role=driver" className="btn btn-emerald btn-lg flex items-center justify-center gap-2 max-w-sm mx-auto">
              <CarFront size={20} /> Devenir conductrice SheDrive
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6">
        <div className="container-app mx-auto">
          <div className="text-center mb-14">
            <span className="badge badge-primary mb-4 text-xs">FAQ</span>
            <h2 className="text-display-lg">Questions <span className="gradient-text">fréquentes</span></h2>
          </div>
          <div className="max-w-2xl mx-auto flex flex-col gap-4">
            {faqs.map((faq, i) => (
              <details key={i} className="card-luxury group">
                <summary className="p-5 font-semibold text-sm cursor-pointer flex items-center justify-between list-none">
                  {faq.q}
                  <span className="text-xl flex-shrink-0 ml-3 transition-transform group-open:rotate-45" style={{ color: "var(--color-rose-500)" }}>+</span>
                </summary>
                <div className="px-5 pb-5 text-sm leading-relaxed" style={{ color: "var(--color-muted)" }}>{faq.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <footer style={{ background: "#F3F4F6", color: "rgba(0,0,0,0.6)" }}>
        <div className="container-app mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 object-cover rounded-full border border-rose-gold-200 overflow-hidden flex items-center justify-center bg-white flex-shrink-0"><img src="/logo.png" alt="SheDrive Logo" className="w-full h-full object-cover mix-blend-multiply scale-[1.15]" /></div>
            <span className="font-bold text-black" style={{ fontFamily: "var(--font-display)" }}>SheDrive Morocco</span>
          </div>
          <p className="text-xs">© 2025 SheDrive Morocco. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}
