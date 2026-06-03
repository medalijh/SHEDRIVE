import { NextRequest, NextResponse } from "next/server";

// GET /api/admin/stats — dashboard metrics
export async function GET(req: NextRequest) {
  // In production: aggregate from Supabase
  return NextResponse.json({
    data: {
      users:    { total: 4821, new_this_month: 312, active_today: 847 },
      drivers:  { total: 847, pending: 23, online_now: 142, avg_rating: 4.87 },
      rides:    { total: 31204, today: 142, in_progress: 14, completed_today: 128 },
      revenue:  { total_mad: 163300, this_month: 38700, commission_rate: 0.15 },
      safety:   { sos_alerts_active: 1, sos_alerts_month: 11, resolved_pct: 97 },
      cities:   [
        { name: "Casablanca", rides: 18432, drivers: 501 },
        { name: "Marrakech",  rides: 5821,  drivers: 163 },
        { name: "Rabat",      rides: 4102,  drivers: 98  },
        { name: "Fès",        rides: 1804,  drivers: 52  },
        { name: "Agadir",     rides: 1045,  drivers: 33  },
      ],
      generated_at: new Date().toISOString(),
    }
  });
}
