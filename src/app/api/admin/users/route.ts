import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

    const { data: adminProfile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    if (adminProfile?.role !== "admin") return NextResponse.json({ error: "Accès refusé" }, { status: 403 });

    const admin = await createAdminClient();
    const url = new URL(req.url);
    const role = url.searchParams.get("role");
    const status = url.searchParams.get("status");
    const search = url.searchParams.get("search");

    let query = admin.from("profiles").select("*").order("created_at", { ascending: false });
    if (role) query = query.eq("role", role);
    if (status) query = query.eq("status", status);
    if (search) query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`);

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
    const statusMap: Record<string, string> = {
      suspend: "suspended",
      reactivate: "active",
      ban: "banned",
    };
    const newStatus = statusMap[action];
    if (!newStatus || !user_id) return NextResponse.json({ error: "Données invalides" }, { status: 400 });

    const admin = await createAdminClient();
    const { data, error } = await admin
      .from("profiles")
      .update({ status: newStatus })
      .eq("id", user_id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ user: data });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
