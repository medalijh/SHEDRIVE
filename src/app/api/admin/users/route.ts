import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    
    const { data: adminProfile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    if (adminProfile?.role !== "admin") return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    
    const url = new URL(req.url);
    const role = url.searchParams.get("role");
    const status = url.searchParams.get("status");
    
    let query = supabase.from("profiles").select("*").order("created_at", { ascending: false });
    if (role) query = query.eq("role", role);
    if (status) query = query.eq("status", status);
    
    const { data, error } = await query;
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ users: data });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    
    const { data: adminProfile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    if (adminProfile?.role !== "admin") return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    
    const { user_id, action } = await req.json();
    const newStatus = action === "suspend" ? "suspended" : action === "reactivate" ? "active" : action === "ban" ? "banned" : null;
    if (!newStatus || !user_id) return NextResponse.json({ error: "Données invalides" }, { status: 400 });
    
    const { data, error } = await supabase.from("profiles").update({ status: newStatus }).eq("id", user_id).select().single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ user: data });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
