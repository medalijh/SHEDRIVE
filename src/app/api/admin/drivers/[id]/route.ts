import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

    const { data: adminProfile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    if (adminProfile?.role !== "admin") return NextResponse.json({ error: "Accès refusé" }, { status: 403 });

    const admin = await createAdminClient();
    const { data, error } = await admin
      .from("drivers")
      .select("*, profile:profiles!user_id(id, full_name, phone, email, avatar_url)")
      .eq("id", id)
      .single();

    if (error || !data) return NextResponse.json({ error: "Conductrice non trouvée" }, { status: 404 });
    return NextResponse.json({ driver: data });
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

    const { data: adminProfile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    if (adminProfile?.role !== "admin") return NextResponse.json({ error: "Accès refusé" }, { status: 403 });

    const { action } = await req.json();
    const statusMap: Record<string, string> = {
      approve: "approved",
      reject: "rejected",
      suspend: "suspended",
      reactivate: "approved",
    };

    const newStatus = statusMap[action];
    if (!newStatus) return NextResponse.json({ error: "Action invalide" }, { status: 400 });

    const admin = await createAdminClient();
    const { data, error } = await admin
      .from("drivers")
      .update({ status: newStatus })
      .eq("id", id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ driver: data, action, new_status: newStatus });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
