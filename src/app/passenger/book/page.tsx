"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// SOS Button
function SOSButton() {
  const [pressed, setPressed] = useState(false);
  const [countdown, setCountdown] = useState(3);
  React.useEffect(() => {
    if (!pressed) return;
    if (countdown === 0) {
      alert("🆘 ALERTE SOS ENVOYÉE!\nVotre position a été partagée avec vos contacts d'urgence.");
      setPressed(false); setCountdown(3); return;
    }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [pressed, countdown]);
  return (
    <>
      {pressed && (
        <div className="fixed inset-0 z-[998] flex items-center justify-center" style={{ background: "rgba(153,27,27,0.85)", backdropFilter: "blur(6px)" }}>
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full mx-6 text-center shadow-2xl">
            <div className="text-6xl mb-4">🆘</div>
            <h3 className="text-2xl font-bold text-red-700 mb-2">Alerte SOS</h3>
            <p className="text-gray-600 mb-6">Envoi dans <strong>{countdown}</strong>s...</p>
            <button onClick={() => { setPressed(false); setCountdown(3); }} className="btn btn-outline w-full" style={{ borderColor: "#E53E3E", color: "#E53E3E" }}>✕ Annuler</button>
          </div>
        </div>
      )}
      <button className="sos-button" onClick={() => setPressed(true)} aria-label="SOS">
        <span className="font-bold">SOS</span><span style={{ fontSize: 10 }}>🆘</span>
      </button>
    </>
  );
}

// Bottom Nav
function BottomNav({ active }: { active: string }) {
  const items = [
    { href: "/passenger/dashboard", icon: "🏠", label: "Accueil", id: "home" },
    { href: "/passenger/book", icon: "🚗", label: "Réserver", id: "book" },
    { href: "/passenger/history", icon: "🕐", label: "Historique", id: "history" },
    { href: "/passenger/wallet", icon: "💳", label: "Wallet", id: "wallet" },
    { href: "/passenger/settings", icon: "⚙️", label: "Profil", id: "profile" },
  ];
  return (
    <nav className="bottom-nav">
      {items.map(item => (
        <Link key={item.id} href={item.href} className={`bottom-nav-item ${active === item.id ? "active" : ""}`}>
          <div className="nav-icon">{item.icon}</div>
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}

type BookStep = "location" | "price" | "drivers" | "confirm";

// Step 1: Location
function LocationStep({ onNext }: { onNext: (data: { from: string; to: string }) => void }) {
  const [from, setFrom] = useState("Ma position actuelle");
  const [to, setTo] = useState("");
  const recent = ["CIL Anfa", "Ain Diab", "Hay Hassani", "Maarif", "Gauthier", "Casa-Voyageurs"];
  return (
    <div className="flex flex-col gap-5">
      {/* Map preview */}
      <div className="relative h-52 rounded-3xl overflow-hidden"
        style={{ background: "linear-gradient(135deg, #e8f5e8 0%, #c8dfc4 100%)" }}>
        <svg className="absolute inset-0 w-full h-full opacity-25" viewBox="0 0 400 200">
          {Array.from({ length: 6 }).map((_, i) => <line key={`h${i}`} x1="0" y1={i*35} x2="400" y2={i*35} stroke="#4a7c59" strokeWidth="0.5"/>)}
          {Array.from({ length: 12 }).map((_, i) => <line key={`v${i}`} x1={i*36} y1="0" x2={i*36} y2="200" stroke="#4a7c59" strokeWidth="0.5"/>)}
          <path d="M0 100 Q100 90 200 100 T400 95" stroke="white" strokeWidth="6" fill="none" opacity="0.7"/>
          <path d="M150 0 Q160 50 170 100 T175 200" stroke="white" strokeWidth="5" fill="none" opacity="0.6"/>
          <circle cx="170" cy="100" r="10" fill="var(--color-rose-gold-500)" opacity="0.9"/>
          <circle cx="170" cy="100" r="5" fill="white"/>
          <circle cx="300" cy="60" r="10" fill="var(--color-emerald-500)" opacity="0.9"/>
          <circle cx="300" cy="60" r="5" fill="white"/>
        </svg>
        <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-full text-xs font-medium" style={{ background: "white", boxShadow: "var(--shadow-sm)" }}>
          📍 Casablanca · Maarif
        </div>
      </div>

      <div className="card-luxury p-5">
        <h3 className="font-semibold mb-4" style={{ fontFamily: "var(--font-display)" }}>Définir votre trajet</h3>
        {/* From */}
        <div className="flex items-center gap-3 p-3 rounded-xl mb-2" style={{ background: "rgba(13,122,74,0.06)", border: "1px solid rgba(13,122,74,0.15)" }}>
          <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: "var(--color-emerald-500)" }}/>
          <input value={from} onChange={e => setFrom(e.target.value)} className="flex-1 bg-transparent outline-none text-sm" placeholder="Point de départ"/>
          <button className="text-lg">📍</button>
        </div>
        {/* Connector dots */}
        <div className="ml-[22px] flex flex-col gap-1 my-1">
          {[1,2,3].map(i => <div key={i} className="w-0.5 h-1 rounded-full" style={{ background: "var(--color-sand-300)", marginLeft: 3 }}/>)}
        </div>
        {/* To */}
        <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "rgba(200,149,108,0.06)", border: "1px solid rgba(200,149,108,0.15)" }}>
          <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: "var(--color-rose-gold-500)" }}/>
          <input value={to} onChange={e => setTo(e.target.value)} className="flex-1 bg-transparent outline-none text-sm" placeholder="Où voulez-vous aller ?"/>
          <button className="text-lg">🔍</button>
        </div>
      </div>

      {/* Recent */}
      <div>
        <p className="text-xs font-semibold mb-3" style={{ color: "var(--color-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Destinations récentes</p>
        <div className="grid grid-cols-2 gap-2">
          {recent.map(place => (
            <button key={place} onClick={() => setTo(place)}
              className="flex items-center gap-2 p-3 rounded-xl text-left transition-all"
              style={{ background: "white", border: "1px solid var(--color-border)" }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--color-rose-gold-300)"; (e.currentTarget as HTMLButtonElement).style.background = "rgba(200,149,108,0.04)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--color-border)"; (e.currentTarget as HTMLButtonElement).style.background = "white"; }}>
              <span className="text-base">🕐</span>
              <span className="text-sm font-medium">{place}</span>
            </button>
          ))}
        </div>
      </div>

      <button onClick={() => { if (to) onNext({ from, to }); }}
        className="btn btn-primary btn-lg w-full" disabled={!to}>
        Continuer →
      </button>
    </div>
  );
}

// Step 2: Price Offer
function PriceStep({ from, to, onNext }: { from: string; to: string; onNext: (price: number) => void }) {
  const [price, setPrice] = useState(35);
  const suggested = [25, 30, 35, 40, 45];
  const [method, setMethod] = useState<"cash" | "wallet" | "card">("cash");

  return (
    <div className="flex flex-col gap-5">
      <div className="card-luxury p-5 text-center">
        <div className="flex items-center justify-center gap-3 mb-2 text-sm" style={{ color: "var(--color-muted)" }}>
          <span className="font-medium">{from}</span>
          <span>→</span>
          <span className="font-medium">{to}</span>
        </div>
        <div className="flex items-center justify-center gap-2 mb-1" style={{ color: "var(--color-muted)", fontSize: "0.75rem" }}>
          <span>📏 ~8.5 km</span><span>·</span><span>⏱ ~22 min</span>
        </div>

        <h3 className="font-semibold mb-6 mt-4" style={{ fontFamily: "var(--font-display)" }}>Proposez votre prix</h3>

        {/* Price Adjuster */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <button onClick={() => setPrice(p => Math.max(10, p - 5))}
            className="w-14 h-14 rounded-full text-xl font-bold shadow-md transition-all hover:scale-110"
            style={{ background: "var(--color-sand-100)", border: "1.5px solid var(--color-border)" }}>−</button>
          <div className="text-center">
            <div className="text-5xl font-bold gradient-text" style={{ fontFamily: "var(--font-display)" }}>{price}</div>
            <div className="text-sm font-medium mt-1" style={{ color: "var(--color-muted)" }}>MAD</div>
          </div>
          <button onClick={() => setPrice(p => p + 5)}
            className="w-14 h-14 rounded-full text-xl font-bold shadow-md transition-all hover:scale-110"
            style={{ background: "linear-gradient(135deg, var(--color-rose-gold-500), var(--color-rose-gold-700))", color: "white", boxShadow: "var(--shadow-rose)" }}>+</button>
        </div>

        {/* Quick amounts */}
        <div className="flex gap-2 justify-center mb-6">
          {suggested.map(s => (
            <button key={s} onClick={() => setPrice(s)}
              className="px-3 py-1.5 rounded-full text-sm font-semibold transition-all"
              style={{
                background: price === s ? "linear-gradient(135deg, var(--color-rose-gold-500), var(--color-rose-gold-700))" : "var(--color-sand-100)",
                color: price === s ? "white" : "var(--color-muted)",
                boxShadow: price === s ? "var(--shadow-rose)" : "none",
              }}>
              {s}
            </button>
          ))}
        </div>

        <div className="p-3 rounded-xl text-xs" style={{ background: "rgba(212,160,23,0.08)", border: "1px solid rgba(212,160,23,0.2)", color: "var(--color-gold-700)" }}>
          💡 Prix suggéré : <strong>30–40 MAD</strong> pour cette distance
        </div>
      </div>

      {/* Payment Method */}
      <div className="card p-5">
        <h4 className="font-semibold mb-4 text-sm">Mode de paiement</h4>
        <div className="grid grid-cols-3 gap-3">
          {[
            { id: "cash" as const, icon: "💵", label: "Espèces" },
            { id: "wallet" as const, icon: "💳", label: "Wallet (150 MAD)" },
            { id: "card" as const, icon: "🏦", label: "Carte" },
          ].map(m => (
            <button key={m.id} onClick={() => setMethod(m.id)}
              className="p-3 rounded-xl border-2 text-center transition-all"
              style={{
                borderColor: method === m.id ? "var(--color-rose-gold-400)" : "var(--color-border)",
                background: method === m.id ? "rgba(200,149,108,0.06)" : "transparent",
              }}>
              <div className="text-xl mb-1">{m.icon}</div>
              <div className="text-xs font-medium">{m.label}</div>
            </button>
          ))}
        </div>
      </div>

      <button onClick={() => onNext(price)} className="btn btn-primary btn-lg w-full">
        🌹 Chercher des conductrices
      </button>
    </div>
  );
}

// Step 3: Driver Selection
function DriversStep({ price, onNext }: { price: number; onNext: (driver: { name: string; rating: number; bid: number; eta: number }) => void }) {
  const [selected, setSelected] = useState<number | null>(null);
  const drivers = [
    { name: "Khadija M.", rating: 4.9, trips: 847, car: "Dacia Logan · Gris", plate: "34521 · A", eta: 4, bid: price - 5, badge: "⭐ Top conductrice" },
    { name: "Amina B.", rating: 4.8, trips: 623, car: "Renault Sandero · Blanc", plate: "28734 · B", eta: 7, bid: price, badge: null },
    { name: "Fatima Z.", rating: 5.0, trips: 1204, car: "Peugeot 208 · Noir", plate: "71023 · C", eta: 11, bid: price + 5, badge: "💎 Elite" },
    { name: "Sara H.", rating: 4.7, trips: 412, car: "Dacia Duster · Blanc", plate: "55821 · D", eta: 6, bid: price - 5, badge: null },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="p-4 rounded-2xl" style={{ background: "rgba(13,122,74,0.06)", border: "1px solid rgba(13,122,74,0.15)" }}>
        <div className="flex items-center gap-2 text-sm">
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "var(--color-emerald-500)" }}/>
          <span style={{ color: "var(--color-emerald-700)" }} className="font-medium">
            {drivers.length} conductrices disponibles près de vous
          </span>
        </div>
      </div>

      {drivers.map((driver, i) => (
        <div key={i}
          className="card-luxury p-5 cursor-pointer transition-all duration-200"
          style={{ outline: selected === i ? "2px solid var(--color-rose-gold-400)" : "none", outlineOffset: "2px" }}
          onClick={() => setSelected(i)}>
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
              style={{ background: "linear-gradient(135deg, rgba(200,149,108,0.15), rgba(200,149,108,0.08))" }}>
              👩
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold">{driver.name}</span>
                {driver.badge && <span className="badge badge-warning" style={{ fontSize: 10 }}>{driver.badge}</span>}
              </div>
              <div className="text-xs mb-2" style={{ color: "var(--color-muted)" }}>
                ⭐ {driver.rating} · {driver.trips} trajets · 🚗 {driver.car}
              </div>
              <div className="text-xs" style={{ color: "var(--color-muted)" }}>🔢 {driver.plate}</div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-xl font-bold" style={{ color: "var(--color-rose-gold-700)", fontFamily: "var(--font-display)" }}>
                {driver.bid} MAD
              </div>
              <div className="text-xs mt-1" style={{ color: "var(--color-emerald-600)" }}>⏱ {driver.eta} min</div>
              {selected === i && (
                <div className="mt-2">
                  <span className="badge badge-primary" style={{ fontSize: 10 }}>✓ Sélectionnée</span>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={() => { if (selected !== null) onNext(drivers[selected]); }}
        className="btn btn-primary btn-lg w-full"
        disabled={selected === null}>
        Confirmer la conductrice →
      </button>
    </div>
  );
}

// Step 4: Confirm
function ConfirmStep({ driver, from, to, price }: { driver: { name: string; rating: number; bid: number; eta: number }; from: string; to: string; price: number }) {
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const router = useRouter();

  const handleConfirm = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 2000));
    setConfirmed(true);
    await new Promise(r => setTimeout(r, 1500));
    router.push("/passenger/tracking");
  };

  if (confirmed) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-24 h-24 rounded-full flex items-center justify-center text-5xl mb-6 animate-scale-in"
          style={{ background: "linear-gradient(135deg, var(--color-emerald-500), var(--color-emerald-700))", boxShadow: "var(--shadow-emerald)" }}>
          ✓
        </div>
        <h2 className="text-display-sm text-white mb-3" style={{ color: "var(--color-emerald-700)" }}>
          Trajet confirmé !
        </h2>
        <p style={{ color: "var(--color-muted)" }}>Votre conductrice est en route...</p>
        <div className="mt-4 flex items-center gap-2 text-sm" style={{ color: "var(--color-emerald-600)" }}>
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "currentColor" }}/>
          <span>Redirection vers le suivi...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="card-luxury p-6">
        <h3 className="font-semibold mb-5 text-center" style={{ fontFamily: "var(--font-display)" }}>
          Récapitulatif du trajet
        </h3>

        {/* Route Summary */}
        <div className="flex flex-col gap-3 mb-6">
          {[
            { dot: "var(--color-emerald-500)", label: "Départ", value: from },
            { dot: "var(--color-rose-gold-500)", label: "Arrivée", value: to },
          ].map(row => (
            <div key={row.label} className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: row.dot }}/>
              <div>
                <div className="text-xs" style={{ color: "var(--color-muted)" }}>{row.label}</div>
                <div className="text-sm font-medium">{row.value}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="divider mb-5"/>

        {/* Driver */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl"
            style={{ background: "rgba(200,149,108,0.1)" }}>👩</div>
          <div>
            <div className="font-semibold">{driver.name}</div>
            <div className="text-xs" style={{ color: "var(--color-muted)" }}>⭐ {driver.rating} · ⏱ {driver.eta} min</div>
          </div>
        </div>

        <div className="divider mb-5"/>

        {/* Price */}
        <div className="flex items-center justify-between">
          <span className="text-sm" style={{ color: "var(--color-muted)" }}>Prix convenu</span>
          <span className="text-2xl font-bold gradient-text" style={{ fontFamily: "var(--font-display)" }}>
            {driver.bid} MAD
          </span>
        </div>
      </div>

      {/* Safety reminder */}
      <div className="p-4 rounded-2xl" style={{ background: "rgba(197,48,48,0.06)", border: "1px solid rgba(197,48,48,0.15)" }}>
        <p className="text-xs text-red-700 font-medium mb-1">🛡️ Rappel sécurité</p>
        <p className="text-xs" style={{ color: "var(--color-muted)" }}>
          Vérifiez toujours la plaque d'immatriculation et le nom de la conductrice avant de monter.
          Le bouton SOS est disponible à tout moment.
        </p>
      </div>

      <button onClick={handleConfirm} className="btn btn-primary btn-lg w-full" disabled={loading}>
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>
            Confirmation en cours...
          </span>
        ) : "🌹 Confirmer le trajet"}
      </button>

      <Link href="/passenger/dashboard" className="btn btn-ghost w-full text-center">
        Annuler
      </Link>
    </div>
  );
}

// ============================================================
// BOOKING PAGE
// ============================================================
export default function BookingPage() {
  const [step, setStep] = useState<BookStep>("location");
  const [data, setData] = useState({ from: "", to: "", price: 35, driver: { name: "", rating: 5, bid: 35, eta: 5 } });

  const stepLabels: { [key in BookStep]: string } = {
    location: "Destination",
    price: "Votre prix",
    drivers: "Conductrices",
    confirm: "Confirmer",
  };
  const stepOrder: BookStep[] = ["location", "price", "drivers", "confirm"];
  const currentIdx = stepOrder.indexOf(step);

  return (
    <div className="container-app mx-auto pb-28" style={{ background: "var(--color-sand-50)", minHeight: "100vh" }}>
      {/* Header */}
      <div className="sticky top-0 z-40 px-6 py-4" style={{ background: "rgba(253,248,245,0.95)", backdropFilter: "blur(16px)", borderBottom: "1px solid var(--color-border)" }}>
        <div className="flex items-center gap-4 mb-3">
          <Link href="/passenger/dashboard" className="btn btn-icon-sm btn-ghost text-xl">←</Link>
          <h1 className="text-lg font-semibold" style={{ fontFamily: "var(--font-display)" }}>Réserver un trajet</h1>
        </div>
        {/* Progress Bar */}
        <div className="flex gap-1">
          {stepOrder.map((s, i) => (
            <div key={s} className="flex-1">
              <div className="h-1 rounded-full transition-all duration-500"
                style={{ background: i <= currentIdx ? "linear-gradient(90deg, var(--color-rose-gold-500), var(--color-rose-gold-400))" : "var(--color-sand-200)" }}/>
              <div className="text-center text-xs mt-1" style={{ color: i === currentIdx ? "var(--color-rose-gold-600)" : "var(--color-sand-300)", fontSize: "9px", fontWeight: i === currentIdx ? 600 : 400 }}>
                {stepLabels[s]}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="px-6 pt-5">
        {step === "location" && (
          <LocationStep onNext={({ from, to }) => { setData(d => ({ ...d, from, to })); setStep("price"); }}/>
        )}
        {step === "price" && (
          <PriceStep from={data.from} to={data.to} onNext={price => { setData(d => ({ ...d, price })); setStep("drivers"); }}/>
        )}
        {step === "drivers" && (
          <DriversStep price={data.price} onNext={driver => { setData(d => ({ ...d, driver })); setStep("confirm"); }}/>
        )}
        {step === "confirm" && (
          <ConfirmStep driver={data.driver} from={data.from} to={data.to} price={data.price}/>
        )}
      </div>

      <SOSButton />
      <BottomNav active="book" />
    </div>
  );
}
