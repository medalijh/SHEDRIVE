import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    
    // Check admin role
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    if (profile?.role !== "admin") return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    
    // Aggregate stats
    const [usersRes, driversRes, ridesRes, revenueRes, activeRes, pendingRes, todayRidesRes, sosRes] = await Promise.all([
      supabase.from("profiles").select("id", { count: "exact", head: true }),
      supabase.from("drivers").select("id", { count: "exact", head: true }),
      supabase.from("rides").select("id", { count: "exact", head: true }),
      supabase.from("rides").select("final_price").eq("status", "completed"),
      supabase.from("rides").select("id", { count: "exact", head: true }).in("status", ["searching", "accepted", "driver_arrived", "in_progress"]),
      supabase.from("drivers").select("id", { count: "exact", head: true }).eq("approval_status", "pending"),
      supabase.from("rides").select("id", { count: "exact", head: true }).gte("created_at", new Date(new Date().setHours(0,0,0,0)).toISOString()),
      supabase.from("sos_alerts").select("id", { count: "exact", head: true }).eq("status", "active"),
    ]);
    
    const totalRevenue = (revenueRes.data || []).reduce((sum, r) => sum + (r.final_price || 0), 0);
    
    // Recent rides
    const { data: recentRides } = await supabase.from("rides").select("*, passenger:profiles!passenger_id(full_name), driver:profiles!driver_id(full_name)").order("created_at", { ascending: false }).limit(10);
    
    // Recent SOS alerts
    const { data: sosAlerts } = await supabase.from("sos_alerts").select("*, user:profiles(full_name, phone)").order("created_at", { ascending: false }).limit(5);
    
    return NextResponse.json({
      stats: {
        total_users: usersRes.count || 0,
        total_drivers: driversRes.count || 0,
        total_rides: ridesRes.count || 0,
        total_revenue: totalRevenue,
        active_rides: activeRes.count || 0,
        pending_drivers: pendingRes.count || 0,
        rides_today: todayRidesRes.count || 0,
        active_sos: sosRes.count || 0,
      },
      recent_rides: recentRides || [],
      sos_alerts: sosAlerts || [],
    });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
