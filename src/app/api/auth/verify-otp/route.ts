import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const { phone, otp } = await req.json();
    if (!phone || !otp) {
      return NextResponse.json({ error: "Téléphone et code requis" }, { status: 400 });
    }
    if (!/^\d{6}$/.test(otp)) {
      return NextResponse.json({ error: "Le code doit être composé de 6 chiffres" }, { status: 400 });
    }
    const supabase = await createClient();
    const { data, error } = await supabase.auth.verifyOtp({
      phone,
      token: otp,
      type: "sms",
    });
    if (error) {
      return NextResponse.json({ error: "Code invalide ou expiré" }, { status: 401 });
    }
    return NextResponse.json({ session: data.session, user: data.user });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
