import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { z } from "zod";

const locationSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  heading: z.number().optional(),
  speed: z.number().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

    const body = await req.json();
    const parsed = locationSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Coordonnées invalides" }, { status: 400 });
    }

    const { lat, lng, heading, speed } = parsed.data;
    const admin = await createAdminClient();

    // Get driver record for this user
    const { data: driver } = await admin.from("drivers").select("id").eq("user_id", user.id).single();
    if (!driver) {
      return NextResponse.json({ error: "Conductrice non trouvée" }, { status: 404 });
    }

    // Update drivers table with current position
    const { error: driverError } = await admin
      .from("drivers")
      .update({
        current_lat: lat,
        current_lng: lng,
        is_online: true,
        last_location_update: new Date().toISOString(),
      })
      .eq("user_id", user.id);

    if (driverError) {
      return NextResponse.json({ error: driverError.message }, { status: 500 });
    }

    // Upsert into driver_locations for real-time tracking
    const { error: locError } = await admin
      .from("driver_locations")
      .upsert(
        {
          driver_id: driver.id,
          lat,
          lng,
          heading: heading ?? null,
          speed: speed ?? null,
        },
        { onConflict: "driver_id" }
      );

    if (locError) {
      console.error("driver_locations upsert error:", locError);
      // Non-fatal: drivers table is already updated
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
