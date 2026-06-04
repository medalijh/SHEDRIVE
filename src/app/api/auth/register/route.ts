import { NextRequest, NextResponse } from "next/server";

// In-memory store for demo (replace with database in production)
const users: Map<string, any> = new Map();
const sessions: Map<string, any> = new Map();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, city, password, role } = body;

    // Validation
    if (!name || !email || !phone || !password || !role) {
      return NextResponse.json(
        { error: "Tous les champs sont requis" },
        { status: 400 }
      );
    }

    if (!["passenger", "driver"].includes(role)) {
      return NextResponse.json(
        { error: "Rôle invalide" },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Email invalide" },
        { status: 400 }
      );
    }

    // Phone validation (Moroccan)
    const phoneRegex = /^(\+212|0)(5|6|7)[0-9]{8}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ""))) {
      return NextResponse.json(
        { error: "Format de téléphone invalide" },
        { status: 400 }
      );
    }

    // Password validation
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Le mot de passe doit contenir au moins 8 caractères" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = Array.from(users.values()).find(u => u.email === email);
    if (existingUser) {
      return NextResponse.json(
        { error: "Cet email est déjà utilisé" },
        { status: 409 }
      );
    }

    // Create user
    const userId = `USR-${Date.now()}`;
    const user = {
      id: userId,
      name,
      email,
      phone,
      city,
      role,
      password, // WARNING: Only for demo - hash passwords in production
      rating: role === "driver" ? 5.0 : 0,
      totalRides: 0,
      status: "active",
      createdAt: new Date().toISOString(),
    };

    users.set(userId, user);

    // Create session
    const sessionId = `SESSION-${Date.now()}`;
    sessions.set(sessionId, {
      userId,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    });

    const { password: _, ...userWithoutPassword } = user;
    return NextResponse.json(
      {
        data: userWithoutPassword,
        sessionId,
        message: "Inscription réussie",
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Erreur serveur" },
      { status: 500 }
    );
  }
}
