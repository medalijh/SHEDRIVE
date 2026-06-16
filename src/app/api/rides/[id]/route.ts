import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const ALLOWED_STATUSES = ["searching", "accepted", "driver_arrived", "in_progress", "completed", "cancelled"] as const;

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

    const { data, error } = await supabase
      .from("rides")
      .select("*, passenger:profiles!passenger_id(id, full_name, phone, avatar_url), driver:profiles!driver_id(id, full_name, phone, avatar_url)")
      .eq("id", id)
      .single();

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
    const updateData: Record<string, unknown> = {};

    if (body.status) {
      if (!ALLOWED_STATUSES.includes(body.status)) {
        return NextResponse.json({ error: "Statut invalide" }, { status: 400 });
      }
      updateData.status = body.status;
      if (body.status === "accepted") updateData.driver_id = body.driver_id || user.id;
      if (body.status === "completed" && body.final_price) updateData.final_price = body.final_price;
    }
    if (body.final_price !== undefined) updateData.final_price = body.final_price;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "Aucune modification" }, { status: 400 });
    }

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

    // Only allow cancellation of rides that aren't completed
    const { data: existing } = await supabase.from("rides").select("status, passenger_id").eq("id", id).single();
    if (!existing) return NextResponse.json({ error: "Trajet non trouvé" }, { status: 404 });
    if (existing.status === "completed" || existing.status === "cancelled") {
      return NextResponse.json({ error: "Impossible d'annuler ce trajet" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("rides")
      .update({ status: "cancelled" })
      .eq("id", id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ride: data });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
