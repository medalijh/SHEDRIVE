"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { useGeolocation } from "@/hooks/useGeolocation";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { searchAddress, getRoute, GeocodingResult } from "@/lib/mapUtils";

const LiveMap = dynamic(() => import("@/components/Map"), { ssr: false });

function SOSButton() {
  const [pressed, setPressed] = useState(false);
  const [countdown, setCountdown] = useState(3);
  useEffect(() => {
    if (!pressed) return;
    if (countdown === 0) {
      if (isSupabaseConfigured()) {
        getSupabaseClient().from("sos_alerts").insert({ status: "active" }).then();
      }
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
function LocationStepContent({ onNext }: { onNext: (data: { from: string; to: string; fromLat: number, fromLng: number, toLat: number, toLng: number, routeData: any }) => void }) {
  const { latitude, longitude } = useGeolocation();
  const searchParams = useSearchParams();
  const initialTo = searchParams.get("to") || "";

  const [from, setFrom] = useState("Ma position actuelle");
  const [to, setTo] = useState(initialTo);
  
  const [fromResults, setFromResults] = useState<GeocodingResult[]>([]);
  const [toResults, setToResults] = useState<GeocodingResult[]>([]);
  
  const [fromCoords, setFromCoords] = useState<[number, number] | null>(null);
  const [toCoords, setToCoords] = useState<[number, number] | null>(null);
  
  const [routePoints, setRoutePoints] = useState<[number, number][]>([]);
  const [routeData, setRouteData] = useState<any>(null);

  useEffect(() => {
    if (latitude && longitude && !fromCoords && from === "Ma position actuelle") {
      setFromCoords([latitude, longitude]);
    }
  }, [latitude, longitude, fromCoords, from]);

  useEffect(() => {
    if (from.length > 3 && from !== "Ma position actuelle") {
      const timer = setTimeout(() => searchAddress(from).then(setFromResults), 500);
      return () => clearTimeout(timer);
    } else setFromResults([]);
  }, [from]);

  useEffect(() => {
    if (to.length > 3) {
      const timer = setTimeout(() => searchAddress(to).then(setToResults), 500);
      return () => clearTimeout(timer);
    } else setToResults([]);
  }, [to]);

  useEffect(() => {
    if (fromCoords && toCoords) {
      getRoute(fromCoords[0], fromCoords[1], toCoords[0], toCoords[1]).then(res => {
        if (res) {
          setRouteData(res);
          setRoutePoints(res.geometry.coordinates.map((c: any) => [c[1], c[0]]));
        }
      });
    }
  }, [fromCoords, toCoords]);

  const mapCenter: [number, number] = fromCoords || (latitude && longitude ? [latitude, longitude] : [33.5731, -7.5898]);
  let markers: any[] = [];
  if (fromCoords) markers.push({ id: "from", position: fromCoords, type: "pickup" });
  if (toCoords) markers.push({ id: "to", position: toCoords, type: "dropoff" });

  const handleNext = () => {
    if (to && fromCoords && toCoords && routeData) {
      onNext({ from, to, fromLat: fromCoords[0], fromLng: fromCoords[1], toLat: toCoords[0], toLng: toCoords[1], routeData });
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="relative h-64 rounded-3xl overflow-hidden shadow-sm z-0">
        <LiveMap center={mapCenter} zoom={15} markers={markers} routePoints={routePoints} height="100%" borderRadius="1.5rem" showUserLocation={true} onMapClick={(lat, lng) => {
          if (!fromCoords) {
            setFromCoords([lat, lng]);
            setFrom("Position sélectionnée");
          } else {
            setToCoords([lat, lng]);
            setTo("Destination sélectionnée");
          }
        }} />
      </div>

      <div className="card-luxury p-5 z-10 relative">
        <h3 className="font-semibold mb-4" style={{ fontFamily: "var(--font-display)" }}>Définir votre trajet</h3>
        
        <div className="relative">
          <div className="flex items-center gap-3 p-3 rounded-xl mb-2" style={{ background: "rgba(147,51,234,0.06)", border: "1px solid rgba(147,51,234,0.15)" }}>
            <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: "var(--color-purple-500)" }}/>
            <input value={from} onChange={e => { setFrom(e.target.value); setFromCoords(null); }} className="flex-1 bg-transparent outline-none text-sm" placeholder="Point de départ"/>
          </div>
          {fromResults.length > 0 && (
            <div className="absolute z-50 left-0 right-0 bg-white shadow-lg rounded-xl mt-1 max-h-40 overflow-y-auto border border-gray-100">
              {fromResults.map((r, i) => (
                <button key={i} className="w-full text-left p-3 text-sm border-b last:border-0 hover:bg-gray-50" onClick={() => { setFrom(r.display_name.split(",")[0]); setFromCoords([r.lat, r.lon]); setFromResults([]); }}>
                  {r.display_name}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="ml-[22px] flex flex-col gap-1 my-1">
          {[1,2,3].map(i => <div key={i} className="w-0.5 h-1 rounded-full" style={{ background: "var(--color-silver-300)", marginLeft: 3 }}/>)}
        </div>

        <div className="relative">
          <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "rgba(225,29,72,0.06)", border: "1px solid rgba(225,29,72,0.15)" }}>
            <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: "var(--color-rose-500)" }}/>
            <input value={to} onChange={e => { setTo(e.target.value); setToCoords(null); }} className="flex-1 bg-transparent outline-none text-sm" placeholder="Où voulez-vous aller ?"/>
          </div>
          {toResults.length > 0 && (
            <div className="absolute z-50 left-0 right-0 bg-white shadow-lg rounded-xl mt-1 max-h-40 overflow-y-auto border border-gray-100">
              {toResults.map((r, i) => (
                <button key={i} className="w-full text-left p-3 text-sm border-b last:border-0 hover:bg-gray-50" onClick={() => { setTo(r.display_name.split(",")[0]); setToCoords([r.lat, r.lon]); setToResults([]); }}>
                  {r.display_name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <button onClick={handleNext} className="btn btn-primary btn-lg w-full" disabled={!toCoords || !fromCoords || !routeData}>
        {routeData ? "Continuer →" : "Saisissez un trajet..."}
      </button>
    </div>
  );
}

function LocationStep(props: any) {
  return (
    <Suspense fallback={<div className="p-4 text-center">Chargement...</div>}>
      <LocationStepContent {...props} />
    </Suspense>
  );
}

// Step 2: Price Offer
function PriceStep({ from, to, routeData, onNext }: { from: string; to: string; routeData: any; onNext: (data: {price: number, method: string}) => void }) {
  const distanceKm = (routeData.distance / 1000).toFixed(1);
  const durationMin = Math.round(routeData.duration / 60);
  
  // Calculate base price dynamically: 15 MAD base + 4 MAD per km
  const basePrice = Math.round(15 + (parseFloat(distanceKm) * 4));
  
  const [price, setPrice] = useState(basePrice);
  const suggested = [basePrice - 5, basePrice, basePrice + 5, basePrice + 10, basePrice + 15].filter(p => p >= 15);
  const [method, setMethod] = useState<"cash" | "wallet" | "card">("cash");

  return (
    <div className="flex flex-col gap-5">
      <div className="card-luxury p-5 text-center">
        <div className="flex items-center justify-center gap-3 mb-2 text-sm" style={{ color: "var(--color-muted)" }}>
          <span className="font-medium truncate max-w-[120px]">{from}</span>
          <span>→</span>
          <span className="font-medium truncate max-w-[120px]">{to}</span>
        </div>
        <div className="flex items-center justify-center gap-2 mb-1" style={{ color: "var(--color-muted)", fontSize: "0.75rem" }}>
          <span>📏 ~{distanceKm} km</span><span>·</span><span>⏱ ~{durationMin} min</span>
        </div>

        <h3 className="font-semibold mb-6 mt-4" style={{ fontFamily: "var(--font-display)" }}>Proposez votre prix</h3>

        <div className="flex items-center justify-center gap-4 mb-6">
          <button onClick={() => setPrice(p => Math.max(15, p - 5))}
            className="w-14 h-14 rounded-full text-xl font-bold shadow-md transition-all hover:scale-110"
            style={{ background: "var(--color-silver-100)", border: "1.5px solid var(--color-border)" }}>−</button>
          <div className="text-center">
            <div className="text-5xl font-bold gradient-text" style={{ fontFamily: "var(--font-display)" }}>{price}</div>
            <div className="text-sm font-medium mt-1" style={{ color: "var(--color-muted)" }}>MAD</div>
          </div>
          <button onClick={() => setPrice(p => p + 5)}
            className="w-14 h-14 rounded-full text-xl font-bold shadow-md transition-all hover:scale-110"
            style={{ background: "linear-gradient(135deg, var(--color-rose-500), var(--color-rose-700))", color: "white", boxShadow: "var(--shadow-rose)" }}>+</button>
        </div>

        <div className="flex gap-2 justify-center mb-6">
          {suggested.map(s => (
            <button key={s} onClick={() => setPrice(s)}
              className="px-3 py-1.5 rounded-full text-sm font-semibold transition-all"
              style={{
                background: price === s ? "linear-gradient(135deg, var(--color-rose-500), var(--color-rose-700))" : "var(--color-silver-100)",
                color: price === s ? "white" : "var(--color-muted)",
                boxShadow: price === s ? "var(--shadow-rose)" : "none",
              }}>
              {s}
            </button>
          ))}
        </div>

        <div className="p-3 rounded-xl text-xs" style={{ background: "rgba(219,39,119,0.08)", border: "1px solid rgba(219,39,119,0.2)", color: "var(--color-purple-700)" }}>
          💡 Prix suggéré : <strong>{basePrice - 5}–{basePrice + 5} MAD</strong> pour {distanceKm} km
        </div>
      </div>

      <div className="card p-5">
        <h4 className="font-semibold mb-4 text-sm">Mode de paiement</h4>
        <div className="grid grid-cols-3 gap-3">
          {[
            { id: "cash" as const, icon: "💵", label: "Espèces" },
            { id: "wallet" as const, icon: "💳", label: "Wallet" },
            { id: "card" as const, icon: "🏦", label: "Carte" },
          ].map(m => (
            <button key={m.id} onClick={() => setMethod(m.id)}
              className="p-3 rounded-xl border-2 text-center transition-all"
              style={{
                borderColor: method === m.id ? "var(--color-rose-400)" : "var(--color-border)",
                background: method === m.id ? "rgba(225,29,72,0.06)" : "transparent",
              }}>
              <div className="text-xl mb-1">{m.icon}</div>
              <div className="text-xs font-medium">{m.label}</div>
            </button>
          ))}
        </div>
      </div>

      <button onClick={() => onNext({price, method})} className="btn btn-primary btn-lg w-full">
        🌹 Chercher des conductrices
      </button>
    </div>
  );
}

// Step 3: Driver Selection
function DriversStep({ price, onNext }: { price: number; onNext: (driver: any) => void }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [drivers, setDrivers] = useState<any[]>([]);
  
  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    getSupabaseClient().from("drivers").select("*, profiles!user_id(full_name, rating)").eq("is_online", true).then(({ data }) => {
      if (data && data.length > 0) {
        setDrivers(data.map(d => ({
          id: d.id,
          user_id: d.user_id,
          name: d.profiles?.full_name || "Conductrice",
          rating: d.profiles?.rating || 4.9,
          trips: 150,
          car: `${d.vehicle_make} ${d.vehicle_model} · ${d.vehicle_color}`,
          plate: d.vehicle_plate,
          eta: Math.floor(Math.random() * 10) + 2,
          bid: price,
          badge: null
        })));
      } else {
        setDrivers([]);
      }
    });
  }, [price]);

  return (
    <div className="flex flex-col gap-4">
      <div className="p-4 rounded-2xl" style={{ background: "rgba(147,51,234,0.06)", border: "1px solid rgba(147,51,234,0.15)" }}>
        <div className="flex items-center gap-2 text-sm">
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "var(--color-purple-500)" }}/>
          <span style={{ color: "var(--color-purple-700)" }} className="font-medium">
            {drivers.length} conductrices disponibles près de vous
          </span>
        </div>
      </div>

      {drivers.map((driver, i) => (
        <div key={i}
          className="card-luxury p-5 cursor-pointer transition-all duration-200"
          style={{ outline: selected === i ? "2px solid var(--color-rose-400)" : "none", outlineOffset: "2px" }}
          onClick={() => setSelected(i)}>
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
              style={{ background: "linear-gradient(135deg, rgba(225,29,72,0.15), rgba(225,29,72,0.08))" }}>
              👩
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold truncate">{driver.name}</span>
                {driver.badge && <span className="badge badge-warning flex-shrink-0" style={{ fontSize: 10 }}>{driver.badge}</span>}
              </div>
              <div className="text-xs mb-2 truncate" style={{ color: "var(--color-muted)" }}>
                ⭐ {driver.rating} · {driver.trips} trajets · 🚗 {driver.car}
              </div>
              <div className="text-xs" style={{ color: "var(--color-muted)" }}>🔢 {driver.plate}</div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-xl font-bold" style={{ color: "var(--color-rose-700)", fontFamily: "var(--font-display)" }}>
                {driver.bid} MAD
              </div>
              <div className="text-xs mt-1" style={{ color: "var(--color-purple-600)" }}>⏱ {driver.eta} min</div>
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
function ConfirmStep({ driver, data }: { driver: any; data: any }) {
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const router = useRouter();

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/rides", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          from_address: data.from,
          from_lat: data.fromLat,
          from_lng: data.fromLng,
          to_address: data.to,
          to_lat: data.toLat,
          to_lng: data.toLng,
          passenger_price: driver.bid,
          payment_method: data.method,
        })
      });
      
      const result = await res.json();
      if (res.ok) {
        setConfirmed(true);
        setTimeout(() => {
          router.push(`/passenger/tracking?id=${result.ride.id}`);
        }, 1500);
      } else {
        alert("Erreur: " + result.error);
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  if (confirmed) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-24 h-24 rounded-full flex items-center justify-center text-5xl mb-6 animate-scale-in"
          style={{ background: "linear-gradient(135deg, var(--color-purple-500), var(--color-purple-700))", boxShadow: "var(--shadow-emerald)" }}>
          ✓
        </div>
        <h2 className="text-display-sm text-black mb-3" style={{ color: "var(--color-purple-700)" }}>
          Trajet confirmé !
        </h2>
        <p style={{ color: "var(--color-muted)" }}>Demande envoyée...</p>
        <div className="mt-4 flex items-center gap-2 text-sm" style={{ color: "var(--color-purple-600)" }}>
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

        <div className="flex flex-col gap-3 mb-6">
          {[
            { dot: "var(--color-purple-500)", label: "Départ", value: data.from },
            { dot: "var(--color-rose-500)", label: "Arrivée", value: data.to },
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

        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl"
            style={{ background: "rgba(225,29,72,0.1)" }}>👩</div>
          <div>
            <div className="font-semibold">{driver.name}</div>
            <div className="text-xs" style={{ color: "var(--color-muted)" }}>⭐ {driver.rating} · ⏱ {driver.eta} min</div>
          </div>
        </div>

        <div className="divider mb-5"/>

        <div className="flex items-center justify-between">
          <span className="text-sm" style={{ color: "var(--color-muted)" }}>Prix convenu</span>
          <span className="text-2xl font-bold gradient-text" style={{ fontFamily: "var(--font-display)" }}>
            {driver.bid} MAD
          </span>
        </div>
      </div>

      <div className="p-4 rounded-2xl" style={{ background: "rgba(197,48,48,0.06)", border: "1px solid rgba(197,48,48,0.15)" }}>
        <p className="text-xs text-red-700 font-medium mb-1">🛡️ Rappel sécurité</p>
        <p className="text-xs" style={{ color: "var(--color-muted)" }}>
          Vérifiez toujours la plaque d'immatriculation et le nom de la conductrice avant de monter.
        </p>
      </div>

      <button onClick={handleConfirm} className="btn btn-primary btn-lg w-full" disabled={loading}>
        {loading ? (
          <span className="flex items-center gap-2 justify-center">
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>
            Envoi en cours...
          </span>
        ) : "🌹 Confirmer le trajet"}
      </button>

      <Link href="/passenger/dashboard" className="btn btn-ghost w-full text-center">Annuler</Link>
    </div>
  );
}

export default function BookingPage() {
  const [step, setStep] = useState<BookStep>("location");
  const [data, setData] = useState({ from: "", to: "", fromLat: 0, fromLng: 0, toLat: 0, toLng: 0, routeData: null, price: 35, method: "cash", driver: null });

  const stepLabels: { [key in BookStep]: string } = {
    location: "Destination",
    price: "Votre prix",
    drivers: "Conductrices",
    confirm: "Confirmer",
  };
  const stepOrder: BookStep[] = ["location", "price", "drivers", "confirm"];
  const currentIdx = stepOrder.indexOf(step);

  return (
    <div className="container-app mx-auto pb-28" style={{ background: "var(--color-silver-50)", minHeight: "100vh" }}>
      <div className="sticky top-0 z-40 px-6 py-4" style={{ background: "rgba(253,248,245,0.95)", backdropFilter: "blur(16px)", borderBottom: "1px solid var(--color-border)" }}>
        <div className="flex items-center gap-4 mb-3">
          <Link href="/passenger/dashboard" className="btn btn-icon-sm btn-ghost text-xl">←</Link>
          <h1 className="text-lg font-semibold" style={{ fontFamily: "var(--font-display)" }}>Réserver un trajet</h1>
        </div>
        <div className="flex gap-1">
          {stepOrder.map((s, i) => (
            <div key={s} className="flex-1">
              <div className="h-1 rounded-full transition-all duration-500"
                style={{ background: i <= currentIdx ? "linear-gradient(90deg, var(--color-rose-500), var(--color-rose-400))" : "var(--color-silver-200)" }}/>
              <div className="text-center text-xs mt-1" style={{ color: i === currentIdx ? "var(--color-rose-600)" : "var(--color-silver-300)", fontSize: "9px", fontWeight: i === currentIdx ? 600 : 400 }}>
                {stepLabels[s]}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="px-6 pt-5">
        {step === "location" && <LocationStep onNext={(d: any) => { setData(prev => ({ ...prev, ...d })); setStep("price"); }}/>}
        {step === "price" && <PriceStep from={data.from} to={data.to} routeData={data.routeData} onNext={(d: any) => { setData(prev => ({ ...prev, ...d })); setStep("drivers"); }}/>}
        {step === "drivers" && <DriversStep price={data.price} onNext={driver => { setData(prev => ({ ...prev, driver })); setStep("confirm"); }}/>}
        {step === "confirm" && <ConfirmStep driver={data.driver} data={data}/>}
      </div>

      <SOSButton />
      <BottomNav active="book" />
    </div>
  );
}
