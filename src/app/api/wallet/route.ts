import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const topUpSchema = z.object({
  amount: z.number().min(10, "Montant minimum 10 MAD").max(5000, "Montant maximum 5000 MAD"),
});

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

    const { data: wallet, error: walletError } = await supabase
      .from("wallets")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (walletError || !wallet) {
      return NextResponse.json({ wallet: { balance: 0, currency: "MAD", is_frozen: false }, transactions: [] });
    }

    const { data: transactions } = await supabase
      .from("transactions")
      .select("*")
      .eq("wallet_id", wallet.id)
      .order("created_at", { ascending: false })
      .limit(50);

    return NextResponse.json({
      wallet,
      transactions: transactions || [],
    });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

    const body = await req.json();
    const parsed = topUpSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message || "Données invalides" }, { status: 400 });
    }

    const { amount } = parsed.data;

    // Get current wallet
    const { data: wallet, error: walletError } = await supabase
      .from("wallets")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (walletError || !wallet) {
      return NextResponse.json({ error: "Portefeuille non trouvé" }, { status: 404 });
    }

    if (wallet.is_frozen) {
      return NextResponse.json({ error: "Portefeuille gelé" }, { status: 403 });
    }

    const balanceBefore = wallet.balance;
    const balanceAfter = balanceBefore + amount;

    // Create transaction record with balance tracking
    const { data: transaction, error: txError } = await supabase
      .from("transactions")
      .insert({
        wallet_id: wallet.id,
        type: "credit",
        amount,
        balance_before: balanceBefore,
        balance_after: balanceAfter,
        description: `Recharge ${amount} MAD`,
        reference: `topup_${Date.now()}`,
        status: "completed",
      })
      .select()
      .single();

    if (txError) return NextResponse.json({ error: txError.message }, { status: 500 });

    // Update wallet balance
    const { error: updateError } = await supabase
      .from("wallets")
      .update({ balance: balanceAfter })
      .eq("id", wallet.id);

    if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 });

    return NextResponse.json({ transaction, new_balance: balanceAfter }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
