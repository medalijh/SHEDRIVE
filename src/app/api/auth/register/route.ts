import { NextRequest, NextResponse } from "next/server";
import { createAdminClient, createClient } from "@/lib/supabase/server";
import { z } from "zod";

const registerSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Mot de passe minimum 6 caractères"),
  phone: z.string().optional(),
  full_name: z.string().min(1, "Nom complet requis"),
  role: z.enum(["passenger", "driver"], { message: "Rôle invalide" }),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message || "Données invalides" }, { status: 400 });
    }

    const { email, password, full_name, role, phone } = parsed.data;

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
      // Non-fatal if a DB trigger already created it
    }

    // For drivers, create driver record
    if (role === "driver") {
      const { error: driverError } = await supabase.from("drivers").insert({
        user_id: authData.user.id,
        status: "pending",
        is_online: false,
      });
      if (driverError) {
        console.error("Driver record creation error:", driverError);
      }
    }

    // Wallet is created by a DB trigger — do NOT insert manually

    // Log the user in immediately
    const userClient = await createClient();
    await userClient.auth.signInWithPassword({ email, password });

    return NextResponse.json({ user_id: authData.user.id, success: true }, { status: 201 });
  } catch (err) {
    console.error("Registration error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
