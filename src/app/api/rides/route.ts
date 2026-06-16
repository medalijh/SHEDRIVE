import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const createRideSchema = z.object({
  from_address: z.string().min(1, "Adresse de départ requise"),
  from_lat: z.number().optional().default(0),
  from_lng: z.number().optional().default(0),
  to_address: z.string().min(1, "Adresse d'arrivée requise"),
  to_lat: z.number().optional().default(0),
  to_lng: z.number().optional().default(0),
  passenger_offered_price: z.number().min(5, "Prix minimum 5 MAD").max(500, "Prix maximum 500 MAD"),
  estimated_distance_km: z.number().optional(),
  estimated_duration_minutes: z.number().optional(),
  route_polyline: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

    const url = new URL(req.url);
    const status = url.searchParams.get("status");
    const passengerId = url.searchParams.get("passenger_id");
    const driverId = url.searchParams.get("driver_id");
    const limit = Math.min(parseInt(url.searchParams.get("limit") || "20", 10), 100);

    let query = supabase.from("rides").select("*").order("created_at", { ascending: false }).limit(limit);
    if (status) query = query.eq("status", status);
    if (passengerId) query = query.eq("passenger_id", passengerId);
    if (driverId) query = query.eq("driver_id", driverId);

    const { data, error } = await query;
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ rides: data });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

    const body = await req.json();
    const parsed = createRideSchema.safeParse(body);
    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message || "Données invalides";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { data, error } = await supabase.from("rides").insert({
      passenger_id: user.id,
      from_address: parsed.data.from_address,
      from_lat: parsed.data.from_lat,
      from_lng: parsed.data.from_lng,
      to_address: parsed.data.to_address,
      to_lat: parsed.data.to_lat,
      to_lng: parsed.data.to_lng,
      passenger_offered_price: parsed.data.passenger_offered_price,
      estimated_distance_km: parsed.data.estimated_distance_km ?? null,
      estimated_duration_minutes: parsed.data.estimated_duration_minutes ?? null,
      route_polyline: parsed.data.route_polyline ?? null,
      status: "searching",
    }).select().single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ride: data }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
