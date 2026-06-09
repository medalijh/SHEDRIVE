"use client";

import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function PWAManager() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [swReady, setSwReady] = useState(false);

  // ── Register Service Worker ──────────────────────────────────
  useEffect(() => {
    if ("serviceWorker" in navigator && typeof window !== "undefined") {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js", { scope: "/" })
          .then((registration) => {
            setSwReady(true);
            console.log("[SheDrive SW] Registered:", registration.scope);

            // Check for updates
            registration.addEventListener("updatefound", () => {
              const newSW = registration.installing;
              if (!newSW) return;
              newSW.addEventListener("statechange", () => {
                if (newSW.state === "installed" && navigator.serviceWorker.controller) {
                  // New version available
                  console.log("[SheDrive SW] New version available");
                }
              });
            });
          })
          .catch((err) => console.error("[SheDrive SW] Registration failed:", err));
      });
    }
  }, []);

  // ── Detect Install Prompt ────────────────────────────────────
  useEffect(() => {
    // Check if already installed (standalone mode)
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true;

    setIsInstalled(isStandalone);

    // Capture the install prompt
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);

      // Show banner after 30 seconds of using the app
      setTimeout(() => setShowBanner(true), 30000);
    };

    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => {
      setIsInstalled(true);
      setShowBanner(false);
      setInstallPrompt(null);
    });

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  // ── Handle Install ───────────────────────────────────────────
  const handleInstall = async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    const result = await installPrompt.userChoice;
    if (result.outcome === "accepted") {
      setShowBanner(false);
      setInstallPrompt(null);
    }
  };

  if (!showBanner || isInstalled || !installPrompt) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[9999] px-4 pb-4 pointer-events-none"
      style={{ maxWidth: "480px", margin: "0 auto" }}
    >
      <div
        className="rounded-2xl p-4 pointer-events-auto"
        style={{
          background: "rgba(255,255,255,0.96)",
          backdropFilter: "blur(24px)",
          border: "1px solid rgba(225,29,72,0.3)",
          boxShadow: "0 -4px 40px rgba(225,29,72,0.1)",
        }}
      >
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 object-cover rounded-2xl border border-rose-200 shadow-sm overflow-hidden flex items-center justify-center bg-white flex-shrink-0"><img src="/logo.png" alt="SheDrive Logo" className="w-full h-full object-cover mix-blend-multiply scale-[1.35]" /></div>
          </div>
          <div className="flex-1 min-w-0">
            <h3
              className="text-black font-semibold text-sm mb-0.5"
              style={{ fontFamily: "var(--font-display)", fontSize: "1rem" }}
            >
              Installer SheDrive
            </h3>
            <p className="text-xs" style={{ color: "rgba(0,0,0,0.55)", lineHeight: "1.5" }}>
              Ajoutez l'app à votre écran d'accueil pour un accès rapide et une expérience native
            </p>
          </div>
          <button
            onClick={() => setShowBanner(false)}
            className="text-xl flex-shrink-0"
            style={{ color: "rgba(0,0,0,0.3)", paddingTop: "2px" }}
            aria-label="Fermer"
          >
            ✕
          </button>
        </div>

        <div className="flex gap-3 mt-4">
          <button
            onClick={() => setShowBanner(false)}
            className="flex-1 py-2.5 rounded-full text-xs font-semibold"
            style={{
              background: "rgba(0,0,0,0.05)",
              color: "rgba(0,0,0,0.6)",
              border: "1px solid rgba(0,0,0,0.1)",
            }}
          >
            Plus tard
          </button>
          <button
            onClick={handleInstall}
            className="flex-1 py-2.5 rounded-full text-xs font-semibold text-white"
            style={{
              background: "linear-gradient(135deg,var(--color-rose-500),var(--color-rose-700))",
              boxShadow: "0 2px 12px rgba(225,29,72,0.3)",
            }}
          >
            Installer
          </button>
        </div>
      </div>
    </div>
  );
}
