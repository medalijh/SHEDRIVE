export interface GeocodingResult {
  display_name: string;
  lat: number;
  lon: number;
}

export interface RouteResult {
  distance: number; // in meters
  duration: number; // in seconds
  geometry: {
    coordinates: [number, number][]; // [lon, lat] array
  };
}

export async function searchAddress(query: string): Promise<GeocodingResult[]> {
  if (!query || query.length < 3) return [];
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=ma&limit=5`;
    const res = await fetch(url, { headers: { "Accept-Language": "fr" } });
    const data = await res.json();
    return data.map((item: any) => ({
      display_name: item.display_name,
      lat: parseFloat(item.lat),
      lon: parseFloat(item.lon),
    }));
  } catch (error) {
    console.error("Geocoding error:", error);
    return [];
  }
}

export async function getRoute(startLat: number, startLng: number, endLat: number, endLng: number): Promise<RouteResult | null> {
  try {
    // OSRM requires coordinates in longitude,latitude order!
    const url = `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.code !== "Ok" || !data.routes || data.routes.length === 0) return null;
    
    return {
      distance: data.routes[0].distance,
      duration: data.routes[0].duration,
      geometry: data.routes[0].geometry,
    };
  } catch (error) {
    console.error("Routing error:", error);
    return null;
  }
}
