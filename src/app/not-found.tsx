"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-6 bg-white">
      <div className="mb-8">
        <div className="w-16 h-16 object-cover rounded-full border-2 border-rose-200 shadow-sm mx-auto overflow-hidden flex items-center justify-center bg-white flex-shrink-0"><img src="/logo.png" alt="SheDrive Logo" className="w-full h-full object-cover mix-blend-multiply scale-[1.35]" /></div>
      </div>
      <h1 className="text-display-lg text-black mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-black mb-6" style={{ fontFamily: "var(--font-display)" }}>
        Page introuvable
      </h2>
      <p className="text-base mb-8 max-w-md mx-auto" style={{ color: "rgba(0,0,0,0.6)" }}>
        Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
      </p>
      <Link href="/" className="btn btn-primary inline-flex items-center gap-2">
        <ArrowLeft size={18} /> Retour à l'accueil
      </Link>
    </div>
  );
}
