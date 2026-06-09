"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function RegisterRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  useEffect(() => {
    const role = searchParams.get("role") || "passenger";
    router.replace(`/auth/login?tab=register&role=${role}`);
  }, [router, searchParams]);
  return <div className="flex items-center justify-center min-h-screen"><p>Redirection...</p></div>;
}

export default function RegisterPage() {
  return <Suspense><RegisterRedirect /></Suspense>;
}
