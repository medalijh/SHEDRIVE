import { NextRequest, NextResponse } from "next/server";

// Mock ride data store
const rides: Record<string, {
  id: string; status: string; passengerId: string; driverId?: string;
  from: string; to: string; price: number; createdAt: string;
}> = {};

// GET /api/rides — list rides
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const passengerId = searchParams.get("passenger_id");

  let results = Object.values(rides);
  if (status) results = results.filter(r => r.status === status);
  if (passengerId) results = results.filter(r => r.passengerId === passengerId);

  return NextResponse.json({ data: results, count: results.length });
}

// POST /api/rides — create a ride
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { passenger_id, from_location, to_location, price, payment_method } = body;

    if (!passenger_id || !from_location || !to_location || !price) {
      return NextResponse.json({ error: "Champs requis manquants" }, { status: 400 });
    }
    if (price < 5 || price > 500) {
      return NextResponse.json({ error: "Prix invalide (5–500 MAD)" }, { status: 400 });
    }

    const id = `RD-${Date.now()}`;
    rides[id] = {
      id,
      status: "searching",
      passengerId: passenger_id,
      from: from_location,
      to: to_location,
      price,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({ data: rides[id], message: "Trajet créé avec succès" }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
