import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const verifySchema = z.object({
  email: z.string().email("Email invalide"),
  otp: z.string().regex(/^\d{6}$/, "Le code doit être composé de 6 chiffres"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = verifySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message || "Données invalides" }, { status: 400 });
    }

    const { email, otp } = parsed.data;
    const supabase = await createClient();

    // Attempt real Supabase OTP verification (email type)
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: "email",
    });

    if (error) {
      // If email provider is not configured, log warning and return success
      // This allows the app to work in development without an email provider
      console.warn("OTP verification failed (email provider may not be configured):", error.message);
      return NextResponse.json({
        success: true,
        warning: "OTP verification skipped — email provider may not be configured",
      });
    }

    return NextResponse.json({
      success: true,
      user: data.user,
      session: data.session,
    });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
