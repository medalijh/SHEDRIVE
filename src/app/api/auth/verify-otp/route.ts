import { NextRequest, NextResponse } from "next/server";

// POST /api/auth/verify-otp
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone, otp, user_id } = body;

    if (!phone || !otp) {
      return NextResponse.json({ error: "Téléphone et OTP requis" }, { status: 400 });
    }
    if (otp.length !== 6 || !/^\d{6}$/.test(otp)) {
      return NextResponse.json({ error: "Code OTP invalide (6 chiffres)" }, { status: 400 });
    }

    // In production: verify OTP via Supabase Auth / Twilio
    // Mock: accept 123456 for testing
    if (otp !== "123456") {
      return NextResponse.json({ error: "Code incorrect ou expiré" }, { status: 401 });
    }

    return NextResponse.json({
      data: {
        user_id: user_id || `USR-${Date.now()}`,
        phone,
        verified: true,
        token: "mock-jwt-token-" + Date.now(),
      },
      message: "Téléphone vérifié avec succès"
    });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
