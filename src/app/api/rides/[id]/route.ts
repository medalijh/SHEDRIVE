import { NextRequest, NextResponse } from "next/server";

// In-memory mock store (replace with Supabase in production)
const ridesStore: Record<string, {
  id: string; status: string; passengerId: string; driverId?: string;
  from: string; to: string; price: number; createdAt: string;
}> = {};

// GET /api/rides/[id] — get specific ride
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // In production: query from Supabase
  const ride = ridesStore[id];
  if (!ride) {
    // Return mock data for demo
    return NextResponse.json({
      data: {
        id,
        status: "in_progress",
        from: "Maarif, Casablanca",
        to: "CIL Anfa, Casablanca",
        price: 35,
        driver: {
          name: "Khadija M.",
          rating: 4.9,
          car: "Dacia Logan Gris",
          plate: "34521-A",
        },
        eta_minutes: 8,
        started_at: new Date().toISOString(),
      },
    });
  }

  return NextResponse.json({ data: ride });
}

// PATCH /api/rides/[id] — update ride status
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { status, driver_id, final_price } = body;

    const validStatuses = [
      "searching",
      "accepted",
      "driver_arrived",
      "in_progress",
      "completed",
      "cancelled",
    ];

    if (status && !validStatuses.includes(status)) {
      return NextResponse.json({ error: "Statut invalide" }, { status: 400 });
    }

    // In production: update Supabase rides table
    if (ridesStore[id]) {
      ridesStore[id] = { ...ridesStore[id], status: status || ridesStore[id].status };
    }

    return NextResponse.json({
      data: {
        id,
        status: status || "in_progress",
        driver_id,
        final_price,
        updated_at: new Date().toISOString(),
      },
      message: "Trajet mis à jour",
    });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// DELETE /api/rides/[id] — cancel ride
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { searchParams } = new URL(req.url);
  const reason = searchParams.get("reason") || "user_request";

  // In production: update Supabase rides table status = 'cancelled'
  if (ridesStore[id]) {
    ridesStore[id].status = "cancelled";
  }

  return NextResponse.json({
    data: {
      id,
      status: "cancelled",
      reason,
      cancelled_at: new Date().toISOString(),
    },
    message: "Trajet annulé",
  });
}
