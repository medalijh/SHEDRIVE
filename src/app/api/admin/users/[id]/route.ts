import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    
    const { data: adminProfile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    if ((adminProfile as any)?.role !== "admin") return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    
    const { status } = await req.json();
    if (!["active", "suspended"].includes(status)) {
      return NextResponse.json({ error: "Statut invalide" }, { status: 400 });
    }
    
    const { data, error } = await supabase.from("profiles").update({ status }).eq("id", id).select().single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ user: data, new_status: status });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
