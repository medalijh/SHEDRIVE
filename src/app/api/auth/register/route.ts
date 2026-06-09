import { NextRequest, NextResponse } from "next/server";
import { createAdminClient, createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const { email, password, phone, full_name, role } = await req.json();
    // Validate required fields
    if (!email || !password || !full_name || !role) {
      return NextResponse.json({ error: "Champs requis manquants" }, { status: 400 });
    }
    if (role !== "passenger" && role !== "driver") {
      return NextResponse.json({ error: "Rôle invalide" }, { status: 400 });
    }

    // Format phone to E.164 (+212)
    let formattedPhone = phone;
    if (phone) {
      if (phone.startsWith("0")) {
        formattedPhone = "+212" + phone.substring(1);
      } else if (!phone.startsWith("+")) {
        formattedPhone = "+212" + phone;
      }
    }

    const supabase = await createAdminClient();
    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      phone: formattedPhone || undefined,
      email_confirm: true,
      user_metadata: { full_name, role },
    });
    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }
    // Create profile
    const { error: profileError } = await supabase.from("profiles").insert({
      id: authData.user.id,
      full_name,
      phone: formattedPhone || "",
      email,
      role,
      status: "active",
    });
    if (profileError) {
      console.error("Profile creation error:", profileError);
    }
    // For drivers, create driver record
    if (role === "driver") {
      await supabase.from("drivers").insert({
        user_id: authData.user.id,
        vehicle_make: "",
        vehicle_model: "",
        vehicle_year: new Date().getFullYear(),
        vehicle_color: "",
        vehicle_plate: "",
        vehicle_type: "economy",
        license_number: "",
        license_expiry: new Date().toISOString(),
        insurance_expiry: new Date().toISOString(),
        inspection_expiry: new Date().toISOString(),
        approval_status: "pending",
      });
    }
    // Create wallet
    await supabase.from("wallets").insert({ user_id: authData.user.id, balance: 0 });

    // Log the user in immediately
    const userClient = await createClient();
    await userClient.auth.signInWithPassword({ email, password });

    return NextResponse.json({ user_id: authData.user.id, success: true }, { status: 201 });
  } catch (err) {
    console.error("Registration error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
