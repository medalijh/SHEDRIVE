import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    
    const { data: wallet } = await supabase.from("wallets").select("*").eq("user_id", user.id).single();
    const { data: transactions } = await supabase.from("wallet_transactions")
      .select("*")
      .eq("wallet_id", wallet?.id || "")
      .order("created_at", { ascending: false })
      .limit(50);
    
    return NextResponse.json({ wallet: wallet || { balance: 0 }, transactions: transactions || [] });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    
    const { amount, payment_method } = await req.json();
    if (!amount || amount < 10 || amount > 5000) {
      return NextResponse.json({ error: "Montant entre 10 et 5000 MAD" }, { status: 400 });
    }
    
    const { data: wallet } = await supabase.from("wallets").select("*").eq("user_id", user.id).single();
    if (!wallet) return NextResponse.json({ error: "Wallet non trouvé" }, { status: 404 });
    
    // Create transaction
    const { data: transaction, error: txError } = await supabase.from("wallet_transactions").insert({
      wallet_id: wallet.id,
      type: "credit",
      amount,
      description: `Recharge ${amount} MAD`,
      reference_type: "topup",
      payment_method: payment_method || "card",
    }).select().single();
    
    if (txError) return NextResponse.json({ error: txError.message }, { status: 500 });
    
    // Update balance
    await supabase.from("wallets").update({ balance: wallet.balance + amount }).eq("id", wallet.id);
    
    return NextResponse.json({ transaction, new_balance: wallet.balance + amount }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
