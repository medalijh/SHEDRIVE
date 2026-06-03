import { NextRequest, NextResponse } from "next/server";

// PATCH /api/admin/drivers/[id] — approve, reject or suspend a driver
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { action, reason } = body;
    const validActions = ["approve", "reject", "suspend", "reactivate"];

    if (!action || !validActions.includes(action)) {
      return NextResponse.json(
        { error: `Action invalide. Valeurs acceptées: ${validActions.join(", ")}` },
        { status: 400 }
      );
    }

    const statusMap: Record<string, string> = {
      approve:    "approved",
      reject:     "rejected",
      suspend:    "suspended",
      reactivate: "approved",
    };

    const messageMap: Record<string, string> = {
      approve:    "Conductrice approuvée avec succès",
      reject:     "Conductrice rejetée",
      suspend:    "Conductrice suspendue",
      reactivate: "Conductrice réactivée",
    };

    // In production: update Supabase drivers table + send SMS notification
    return NextResponse.json({
      data: {
        driver_id: id,
        status: statusMap[action],
        reason: reason || null,
        updated_at: new Date().toISOString(),
        sms_sent: true,
      },
      message: messageMap[action],
    });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
