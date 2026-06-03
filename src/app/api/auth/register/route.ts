import { NextRequest, NextResponse } from "next/server";

// POST /api/auth/register
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone, email, full_name, role, password } = body;

    if (!phone || !full_name || !role) {
      return NextResponse.json({ error: "Téléphone, nom et rôle sont requis" }, { status: 400 });
    }
    if (!["passenger", "driver"].includes(role)) {
      return NextResponse.json({ error: "Rôle invalide" }, { status: 400 });
    }
    // Phone format validation (Moroccan)
    const phoneRegex = /^(\+212|0)(5|6|7)[0-9]{8}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ""))) {
      return NextResponse.json({ error: "Format de téléphone invalide" }, { status: 400 });
    }

    // In production: create Supabase user, send OTP
    return NextResponse.json({
      data: {
        user_id: `USR-${Date.now()}`,
        phone,
        role,
        status: "pending_verification",
        otp_sent: true,
      },
      message: "Code de vérification envoyé par SMS"
    }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
