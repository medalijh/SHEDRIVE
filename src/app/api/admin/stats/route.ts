import { NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

    // Check admin role
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    if (profile?.role !== "admin") return NextResponse.json({ error: "Accès refusé" }, { status: 403 });

    const admin = await createAdminClient();

    // Aggregate stats from real tables
    const [usersRes, driversRes, ridesRes, revenueRes, activeRes, pendingRes, todayRidesRes] = await Promise.all([
      admin.from("profiles").select("id", { count: "exact", head: true }),
      admin.from("drivers").select("id", { count: "exact", head: true }),
      admin.from("rides").select("id", { count: "exact", head: true }),
      admin.from("rides").select("final_price").eq("status", "completed"),
      admin.from("rides").select("id", { count: "exact", head: true }).in("status", ["searching", "accepted", "driver_arrived", "in_progress"]),
      admin.from("drivers").select("id", { count: "exact", head: true }).eq("status", "pending"),
      admin.from("rides").select("id", { count: "exact", head: true }).gte("created_at", new Date(new Date().setHours(0, 0, 0, 0)).toISOString()),
    ]);

    const totalRevenue = (revenueRes.data || []).reduce((sum: number, r: Record<string, unknown>) => sum + (Number(r.final_price) || 0), 0);

    // Recent rides with joined profile names
    const { data: recentRides } = await admin
      .from("rides")
      .select("*, passenger:profiles!passenger_id(full_name), driver:profiles!driver_id(full_name)")
      .order("created_at", { ascending: false })
      .limit(10);

    return NextResponse.json({
      stats: {
        total_users: usersRes.count || 0,
        total_drivers: driversRes.count || 0,
        total_rides: ridesRes.count || 0,
        total_revenue: totalRevenue,
        active_rides: activeRes.count || 0,
        pending_drivers: pendingRes.count || 0,
        rides_today: todayRidesRes.count || 0,
      },
      recent_rides: recentRides || [],
    });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
