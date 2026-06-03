import { createClient as createServerClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type Driver = Database["public"]["Tables"]["drivers"]["Row"];
type Ride = Database["public"]["Tables"]["rides"]["Row"];

export async function createUserProfile(
  userId: string,
  data: {
    fullName: string;
    phone: string;
    role: "passenger" | "driver";
    email?: string;
    city?: string;
    language?: "fr" | "ar" | "en";
  }
) {
  const supabase = await createServerClient();

  const { data: profile, error } = await supabase
    .from("profiles")
    .insert({
      id: userId,
      full_name: data.fullName,
      phone: data.phone,
      email: data.email,
      role: data.role,
      city: data.city,
      preferred_language: (data.language || "fr") as "fr" | "ar" | "en",
    } as any)
    .select();

  if (error) throw new Error(`Failed to create profile: ${error.message}`);
  return profile?.[0];
}

export async function getUserProfile(userId: string) {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) throw new Error(`Failed to fetch profile: ${error.message}`);
  return data as Profile;
}

export async function createRide(
  passengerId: string,
  data: {
    fromAddress: string;
    fromLat: number;
    fromLng: number;
    toAddress: string;
    toLat: number;
    toLng: number;
    passengerPrice: number;
    paymentMethod: "cash" | "wallet" | "card";
  }
) {
  const supabase = await createServerClient();

  const { data: ride, error } = await supabase
    .from("rides")
    .insert({
      passenger_id: passengerId,
      from_address: data.fromAddress,
      from_lat: data.fromLat,
      from_lng: data.fromLng,
      to_address: data.toAddress,
      to_lat: data.toLat,
      to_lng: data.toLng,
      passenger_price: data.passengerPrice,
      payment_method: data.paymentMethod,
    } as any)
    .select();

  if (error) throw new Error(`Failed to create ride: ${error.message}`);
  return ride?.[0];
}

export async function getActiveRides(userId: string, role: "passenger" | "driver") {
  const supabase = await createServerClient();

  let query = supabase.from("rides").select("*");

  if (role === "passenger") {
    query = query.eq("passenger_id", userId);
  } else {
    query = query.eq("driver_id", userId);
  }

  const { data, error } = await query.in("status", [
    "searching",
    "accepted",
    "driver_arrived",
    "in_progress",
  ]);

  if (error) throw new Error(`Failed to fetch rides: ${error.message}`);
  return data as Ride[];
}

export async function getAvailableDrivers(lat: number, lng: number, radiusKm: number = 5) {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from("drivers")
    .select("*, profiles:user_id(*)")
    .eq("is_online", true)
    .eq("approval_status", "approved");

  if (error) throw new Error(`Failed to fetch drivers: ${error.message}`);

  // Filter by radius (basic distance calculation)
  return (data || []).filter((driver: any) => {
    if (!driver.current_lat || !driver.current_lng) return false;
    const distance = calculateDistance(
      lat,
      lng,
      driver.current_lat,
      driver.current_lng
    );
    return distance <= radiusKm;
  });
}

export async function createWallet(userId: string, initialBalance: number = 0) {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from("wallets")
    .insert({
      user_id: userId,
      balance: initialBalance,
    } as any)
    .select();

  if (error) throw new Error(`Failed to create wallet: ${error.message}`);
  return data?.[0];
}

export async function getUserWallet(userId: string) {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from("wallets")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error && error.code !== "PGRST116")
    throw new Error(`Failed to fetch wallet: ${error.message}`);
  return data;
}

export async function addWalletTransaction(
  walletId: string,
  data: {
    type: "credit" | "debit";
    amount: number;
    description: string;
    referenceId?: string;
    referenceType?: "ride" | "topup" | "refund" | "withdrawal";
    paymentMethod?: string;
  }
) {
  const supabase = await createServerClient();

  const { data: transaction, error } = await supabase
    .from("wallet_transactions")
    .insert({
      wallet_id: walletId,
      type: data.type,
      amount: data.amount,
      description: data.description,
      reference_id: data.referenceId,
      reference_type: data.referenceType,
      payment_method: data.paymentMethod,
    } as any)
    .select();

  if (error)
    throw new Error(`Failed to create transaction: ${error.message}`);

  // Note: RPC function for wallet balance update should be created in Supabase
  // if (data.type === "credit") {
  //   await supabase.rpc("update_wallet_balance", {
  //     wallet_id: walletId,
  //     amount_delta: data.amount,
  //   });
  // }

  return transaction?.[0];
}

export async function triggerSOS(userId: string, rideId: string | null, lat?: number, lng?: number) {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from("sos_alerts")
    .insert({
      user_id: userId,
      ride_id: rideId,
      lat,
      lng,
    } as any)
    .select();

  if (error) throw new Error(`Failed to trigger SOS: ${error.message}`);
  return data?.[0];
}

export async function getStats() {
  const supabase = await createAdminClient();

  const [profiles, rides, drivers] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact" }),
    supabase.from("rides").select("id", { count: "exact" }),
    supabase
      .from("drivers")
      .select("id", { count: "exact" })
      .eq("approval_status", "approved"),
  ]);

  return {
    totalUsers: profiles.count || 0,
    totalRides: rides.count || 0,
    activeDrivers: drivers.count || 0,
  };
}

function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
