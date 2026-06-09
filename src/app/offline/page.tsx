"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    const handleOnline  = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online",  handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online",  handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    if (isOnline) {
      window.location.reload();
    }
  }, [isOnline]);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
      style={{ background: "linear-gradient(135deg, #1A150F 0%, #2C1F12 50%, #0D1F16 100%)" }}
    >
      {/* Zellige background */}
      <div
        className="fixed inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cg fill='none' stroke='%23C8956C' stroke-width='0.5' opacity='0.3'%3E%3Cpath d='M30 0 L60 30 L30 60 L0 30 Z'/%3E%3Cpath d='M30 10 L50 30 L30 50 L10 30 Z'/%3E%3Cline x1='30' y1='0' x2='30' y2='60'/%3E%3Cline x1='0' y1='30' x2='60' y2='30'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Logo */}
      <div className="relative z-10 flex flex-col items-center">
        <div
          className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl mb-6"
          style={{
            background: "linear-gradient(135deg,#E11D48,#8E5E3C)",
            boxShadow: "0 8px 40px rgba(225,29,72,0.4)",
          }}
        >
          🌹
        </div>

        <h1
          className="text-4xl font-bold text-white mb-2"
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
        >
          SheDrive Morocco
        </h1>

        <div className="text-6xl my-8">📡</div>

        <h2
          className="text-2xl font-semibold text-white mb-3"
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
        >
          Vous êtes hors ligne
        </h2>

        <p className="text-base mb-2" style={{ color: "rgba(255,255,255,0.6)" }}>
          Vérifiez votre connexion internet
        </p>

        {/* Arabic */}
        <p
          className="text-sm mb-10"
          style={{
            fontFamily: "'Noto Sans Arabic', Arial, sans-serif",
            direction: "rtl",
            color: "rgba(255,255,255,0.4)",
          }}
        >
          تحقق من اتصالك بالإنترنت
        </p>

        {/* Status indicator */}
        <div
          className="flex items-center gap-3 px-5 py-3 rounded-full mb-8"
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(225,29,72,0.2)",
          }}
        >
          <div
            className="w-3 h-3 rounded-full"
            style={{
              background: isOnline ? "#22C55E" : "#EF4444",
              boxShadow: isOnline ? "0 0 8px #22C55E" : "0 0 8px #EF4444",
              animation: "pulse 2s infinite",
            }}
          />
          <span className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.7)" }}>
            {isOnline ? "Connexion rétablie — rechargement..." : "Hors ligne"}
          </span>
        </div>

        <button
          onClick={() => window.location.reload()}
          className="px-8 py-4 rounded-full font-semibold text-white mb-4"
          style={{
            background: "linear-gradient(135deg,#E11D48,#8E5E3C)",
            boxShadow: "0 4px 24px rgba(225,29,72,0.4)",
            fontSize: "0.9375rem",
          }}
        >
          🔄 Réessayer
        </button>

        <Link
          href="/"
          className="text-sm"
          style={{ color: "rgba(225,29,72,0.7)", textDecoration: "underline" }}
        >
          Retour à l'accueil
        </Link>

        {/* Tip */}
        <div
          className="mt-12 p-5 rounded-2xl max-w-xs"
          style={{
            background: "rgba(225,29,72,0.08)",
            border: "1px solid rgba(225,29,72,0.15)",
          }}
        >
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.5)", lineHeight: "1.6" }}>
            💡 SheDrive fonctionne en mode hors ligne partiel. Vos trajets précédents sont disponibles dans l'historique même sans connexion.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
