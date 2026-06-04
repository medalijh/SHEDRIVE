import { NextRequest, NextResponse } from "next/server";

// Mock database (shared with register)
const users = new Map<string, any>();
const sessions = new Map<string, any>();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email et mot de passe requis" },
        { status: 400 }
      );
    }

    // Find user by email
    const user = Array.from(users.values()).find(u => u.email === email);
    
    if (!user || user.password !== password) {
      return NextResponse.json(
        { error: "Email ou mot de passe incorrect" },
        { status: 401 }
      );
    }

    // Create session
    const sessionId = `SESSION-${Date.now()}`;
    sessions.set(sessionId, {
      userId: user.id,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    });

    const { password: _, ...userWithoutPassword } = user;
    return NextResponse.json(
      {
        data: userWithoutPassword,
        sessionId,
        message: "Connexion réussie",
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Erreur serveur" },
      { status: 500 }
    );
  }
}
