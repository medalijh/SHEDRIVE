import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    
    const { data, error } = await supabase.from("rides").select("*, driver:drivers(user_id, vehicle_model, vehicle_plate, profiles(full_name, phone))").eq("id", id).single();
    if (error || !data) return NextResponse.json({ error: "Trajet non trouvé" }, { status: 404 });
    return NextResponse.json({ ride: data });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    
    const body = await req.json();
    const allowedStatuses = ["searching", "accepted", "driver_arrived", "in_progress", "completed", "cancelled"];
    
    const updateData: Record<string, unknown> = {};
    if (body.status) {
      if (!allowedStatuses.includes(body.status)) {
        return NextResponse.json({ error: "Statut invalide" }, { status: 400 });
      }
      updateData.status = body.status;
      if (body.status === "accepted") updateData.driver_id = body.driver_id || user.id;
      if (body.status === "in_progress") updateData.started_at = new Date().toISOString();
      if (body.status === "completed") updateData.completed_at = new Date().toISOString();
      if (body.status === "cancelled") {
        updateData.cancelled_by = body.cancelled_by || "system";
        updateData.cancellation_reason = body.reason || null;
      }
    }
    if (body.final_price) updateData.final_price = body.final_price;
    if (body.passenger_rating) updateData.passenger_rating = body.passenger_rating;
    if (body.driver_rating) updateData.driver_rating = body.driver_rating;
    
    const { data, error } = await supabase.from("rides").update(updateData).eq("id", id).select().single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ride: data });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    
    const url = new URL(req.url);
    const reason = url.searchParams.get("reason") || "Annulé par l'utilisateur";
    
    const { data, error } = await supabase.from("rides").update({
      status: "cancelled",
      cancelled_by: "passenger",
      cancellation_reason: reason,
    }).eq("id", id).select().single();
    
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ride: data });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
