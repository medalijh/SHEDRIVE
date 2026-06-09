"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MessageCircle, Phone, Mail, MessageSquare, MapPin, TriangleAlert, CheckCircle2, Send } from "lucide-react";

function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50"
      style={{ background: "rgba(255,255,255,0.92)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(225,29,72,0.2)" }}>
      <div className="container-app mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 object-cover rounded-full border border-rose-200 overflow-hidden flex items-center justify-center bg-white flex-shrink-0"><img src="/logo.png" alt="SheDrive Logo" className="w-full h-full object-cover mix-blend-multiply scale-[1.35]" /></div>
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

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "general", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div style={{ background: "var(--color-silver-50)" }}>
      <Navbar />

      <section className="pt-28 pb-16 px-6 text-center relative overflow-hidden bg-white">
        <div className="zellige-pattern absolute inset-0 opacity-20"/>
        <div className="container-app mx-auto relative z-10">
          <span className="badge mb-6 text-xs tracking-widest" style={{ background: "rgba(225,29,72,0.15)", color: "var(--color-rose-400)", border: "1px solid rgba(225,29,72,0.3)" }}>CONTACT</span>
          <h1 className="text-display-xl text-black mb-4">Parlons-nous <span className="gradient-text"><MessageCircle className="inline-block ml-2 mb-2" size={40} /></span></h1>
          <p style={{ color: "rgba(0,0,0,0.6)" }}>Notre équipe est disponible 24h/24 pour vous aider</p>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="container-app mx-auto">
          <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            {/* Contact Info */}
            <div>
              <h2 className="text-display-sm mb-8">Nous <span className="gradient-text">contacter</span></h2>
              <div className="flex flex-col gap-5">
                {[
                  { icon: <Phone size={24} />, label: "Téléphone", value: "+212 5XX-XXX-XXX", sub: "Lun-Ven, 9h-18h" },
                  { icon: <Mail size={24} />, label: "Email", value: "contact@shedrive.ma", sub: "Réponse sous 24h" },
                  { icon: <MessageSquare size={24} />, label: "WhatsApp", value: "+212 6XX-XXX-XXX", sub: "Support rapide" },
                  { icon: <MapPin size={24} />, label: "Siège", value: "Maarif, Casablanca 20100", sub: "Maroc" },
                ].map(c => (
                  <div key={c.label} className="flex items-start gap-4 p-5 card-luxury">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-rose-gold-600 flex-shrink-0"
                      style={{ background: "rgba(225,29,72,0.08)" }}>{c.icon}</div>
                    <div>
                      <div className="text-xs font-semibold mb-1" style={{ color: "var(--color-rose-600)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{c.label}</div>
                      <div className="font-semibold">{c.value}</div>
                      <div className="text-xs mt-0.5" style={{ color: "var(--color-muted)" }}>{c.sub}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-5 rounded-2xl"
                style={{ background: "rgba(197,48,48,0.06)", border: "1px solid rgba(197,48,48,0.2)" }}>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-red-600"><TriangleAlert size={24} /></span>
                  <span className="font-semibold text-red-700">Urgence</span>
                </div>
                <p className="text-sm" style={{ color: "var(--color-muted)" }}>
                  En cas d'urgence pendant un trajet, utilisez le bouton SOS dans l'application. Pour une urgence médicale, appelez le <strong>150</strong>.
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="card-luxury p-8">
              {sent ? (
                <div className="text-center py-8">
                  <div className="text-emerald-500 flex justify-center mb-4"><CheckCircle2 size={64} /></div>
                  <h3 className="text-xl font-semibold mb-2" style={{ fontFamily: "var(--font-display)" }}>Message envoyé !</h3>
                  <p style={{ color: "var(--color-muted)" }}>Nous vous répondrons sous 24h.</p>
                  <button onClick={() => setSent(false)} className="btn btn-outline mt-6">Envoyer un autre message</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <h3 className="text-xl font-semibold" style={{ fontFamily: "var(--font-display)" }}>Envoyez-nous un message</h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="form-label">Nom complet</label>
                      <input className="input-field" required placeholder="Fatima Zahra" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}/>
                    </div>
                    <div>
                      <label className="form-label">Téléphone</label>
                      <input className="input-field" placeholder="+212 6XX XXX XXX" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}/>
                    </div>
                  </div>

                  <div>
                    <label className="form-label">Email</label>
                    <input className="input-field" type="email" required placeholder="fatima@email.ma" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}/>
                  </div>

                  <div>
                    <label className="form-label">Sujet</label>
                    <select className="input-field" value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}>
                      <option value="general">Question générale</option>
                      <option value="driver">Devenir conductrice</option>
                      <option value="payment">Problème de paiement</option>
                      <option value="safety">Sécurité</option>
                      <option value="complaint">Réclamation</option>
                      <option value="partnership">Partenariat</option>
                    </select>
                  </div>

                  <div>
                    <label className="form-label">Message</label>
                    <textarea className="input-field" rows={5} required placeholder="Décrivez votre demande en détail..." value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}/>
                  </div>

                  <button type="submit" className="btn btn-primary btn-lg w-full flex items-center justify-center gap-2">Envoyer le message <Send size={20} /></button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <footer style={{ background: "#F3F4F6", color: "rgba(0,0,0,0.6)" }}>
        <div className="container-app mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 object-cover rounded-full border border-rose-gold-200 overflow-hidden flex items-center justify-center bg-white flex-shrink-0"><img src="/logo.png" alt="SheDrive Logo" className="w-full h-full object-cover mix-blend-multiply scale-[1.35]" /></div>
            <span className="font-bold text-black" style={{ fontFamily: "var(--font-display)" }}>SheDrive Morocco</span>
          </div>
          <p className="text-xs">© 2025 SheDrive Morocco. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}
