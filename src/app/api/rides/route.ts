import { NextRequest, NextResponse } from "next/server";

// Mock ride data store
const rides: Map<string, any> = new Map();

// GET /api/rides — list rides with real-time data
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const passengerId = searchParams.get("passenger_id");
    const driverId = searchParams.get("driver_id");

    let results = Array.from(rides.values());
    
    if (status) results = results.filter(r => r.status === status);
    if (passengerId) results = results.filter(r => r.passengerId === passengerId);
    if (driverId) results = results.filter(r => r.driverId === driverId);

    return NextResponse.json({ 
      data: results, 
      count: results.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/rides — create a new ride with live tracking
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { passengerId, fromAddress, toAddress, fromLat, fromLng, toLat, toLng, estimatedPrice } = body;

    if (!passengerId || !fromAddress || !toAddress) {
      return NextResponse.json({ error: "Données manquantes" }, { status: 400 });
    }

    const rideId = `RIDE-${Date.now()}`;
    const ride = {
      id: rideId,
      passengerId,
      driverId: null,
      fromAddress,
      toAddress,
      fromLat: fromLat || 33.5731,
      fromLng: fromLng || -7.5898,
      toLat: toLat || 33.9716,
      toLng: toLng || -6.8498,
      estimatedPrice: estimatedPrice || 50,
      actualPrice: null,
      status: "searching",
      driverLat: null,
      driverLng: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      acceptedAt: null,
      completedAt: null,
    };

    rides.set(rideId, ride);
    return NextResponse.json({ data: ride }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT /api/rides — update ride status (for real-time tracking)
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { rideId, status, driverId, driverLat, driverLng, actualPrice } = body;

    if (!rideId) {
      return NextResponse.json({ error: "ID de trajet manquant" }, { status: 400 });
    }

    const ride = rides.get(rideId);
    if (!ride) {
      return NextResponse.json({ error: "Trajet non trouvé" }, { status: 404 });
    }

    // Update ride with new data
    if (status) ride.status = status;
    if (driverId !== undefined) ride.driverId = driverId;
    if (driverLat !== undefined) ride.driverLat = driverLat;
    if (driverLng !== undefined) ride.driverLng = driverLng;
    if (actualPrice !== undefined) ride.actualPrice = actualPrice;
    
    if (status === "accepted") ride.acceptedAt = new Date().toISOString();
    if (status === "completed") ride.completedAt = new Date().toISOString();
    
    ride.updatedAt = new Date().toISOString();

    rides.set(rideId, ride);
    return NextResponse.json({ data: ride });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
