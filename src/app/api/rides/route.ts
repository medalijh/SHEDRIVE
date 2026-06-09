import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    
    const url = new URL(req.url);
    const status = url.searchParams.get("status");
    const passengerId = url.searchParams.get("passenger_id");
    const driverId = url.searchParams.get("driver_id");
    const limit = parseInt(url.searchParams.get("limit") || "20");
    
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
    const { from_address, from_lat, from_lng, to_address, to_lat, to_lng, passenger_price, payment_method } = body;
    
    if (!from_address || !to_address || !passenger_price) {
      return NextResponse.json({ error: "Champs requis manquants" }, { status: 400 });
    }
    if (passenger_price < 5 || passenger_price > 500) {
      return NextResponse.json({ error: "Prix entre 5 et 500 MAD" }, { status: 400 });
    }
    
    const { data, error } = await supabase.from("rides").insert({
      passenger_id: user.id,
      from_address,
      from_lat: from_lat || 0,
      from_lng: from_lng || 0,
      to_address,
      to_lat: to_lat || 0,
      to_lng: to_lng || 0,
      passenger_price,
      payment_method: payment_method || "cash",
      status: "searching"
    }).select().single();
    
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ride: data }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
