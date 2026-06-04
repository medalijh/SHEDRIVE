import { NextRequest, NextResponse } from "next/server";

// Mock drivers database with live location
const drivers: Map<string, any> = new Map();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");
    const radius = parseFloat(searchParams.get("radius") || "5");

    let results = Array.from(drivers.values());

    if (status) {
      results = results.filter(d => d.status === status);
    }

    // Find drivers within radius (simple distance calculation)
    if (lat && lng) {
      const userLat = parseFloat(lat);
      const userLng = parseFloat(lng);

      results = results.filter(d => {
        const distance = Math.sqrt(
          Math.pow(d.latitude - userLat, 2) + Math.pow(d.longitude - userLng, 2)
        );
        return distance <= radius;
      });
    }

    results = results.sort((a, b) => b.rating - a.rating);

    return NextResponse.json({
      data: results,
      count: results.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { driverId, latitude, longitude, status } = body;

    if (!driverId || latitude === undefined || longitude === undefined) {
      return NextResponse.json({ error: "Données manquantes" }, { status: 400 });
    }

    const driver = drivers.get(driverId) || {
      id: driverId,
      name: "Conductrice",
      phone: "+212 6XX XX XX XX",
      rating: 5.0,
      totalRides: 0,
      carModel: "Mercedes E-Class",
      carColor: "Silver",
      licensePlate: "MAR-2024",
      status: "offline",
      latitude: 33.5731,
      longitude: -7.5898,
      lastUpdate: new Date().toISOString(),
    };

    // Update location and status
    driver.latitude = latitude;
    driver.longitude = longitude;
    if (status) driver.status = status;
    driver.lastUpdate = new Date().toISOString();

    drivers.set(driverId, driver);

    return NextResponse.json({ data: driver });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
