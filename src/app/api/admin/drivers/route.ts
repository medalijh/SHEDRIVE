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
    const status = url.searchParams.get("status");
    
    let query = supabase.from("drivers").select("*, profiles!user_id(*)").order("created_at", { ascending: false });
    if (status) query = query.eq("approval_status", status);
    
    const { data, error } = await query;
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ drivers: data });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
