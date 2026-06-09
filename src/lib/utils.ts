// SheDrive Morocco — Shared Utilities

/**
 * Format a number as Moroccan Dirham currency
 */
export function formatMAD(amount: number): string {
  return new Intl.NumberFormat("fr-MA", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount) + " MAD";
}

/**
 * Format a date in French locale
 */
export function formatDate(dateStr: string, style: "full" | "short" | "relative" = "short"): string {
  const date = new Date(dateStr);
  const now = new Date();
  
  if (style === "relative") {
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return "À l'instant";
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays === 1) return "Hier";
    if (diffDays < 7) return `Il y a ${diffDays} jours`;
  }
  
  if (style === "full") {
    return date.toLocaleDateString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  
  // short
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/**
 * Format time only
 */
export function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Format a Moroccan phone number
 */
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("212")) {
    const rest = cleaned.slice(3);
    return `+212 ${rest.slice(0, 1)} ${rest.slice(1, 3)} ${rest.slice(3, 5)} ${rest.slice(5, 7)} ${rest.slice(7)}`.trim();
  }
  if (cleaned.startsWith("0")) {
    return `0${cleaned.slice(1, 2)} ${cleaned.slice(2, 4)} ${cleaned.slice(4, 6)} ${cleaned.slice(6, 8)} ${cleaned.slice(8)}`.trim();
  }
  return phone;
}

/**
 * Validate Moroccan phone number
 */
export function isValidMoroccanPhone(phone: string): boolean {
  return /^(\+212|0)(5|6|7)[0-9]{8}$/.test(phone.replace(/\s/g, ""));
}

/**
 * Calculate distance between two GPS points using Haversine formula
 * Returns distance in kilometers
 */
export function haversineDistance(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

/**
 * Estimate travel time based on distance (average city speed ~30 km/h in Morocco)
 */
export function estimateTravelTime(distanceKm: number): number {
  return Math.ceil(distanceKm / 30 * 60); // minutes
}

/**
 * Generate a greeting based on time of day
 */
export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Bonjour";
  if (hour < 18) return "Bon après-midi";
  return "Bonsoir";
}

/**
 * Truncate text with ellipsis
 */
export function truncate(str: string, maxLen: number): string {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen - 1) + "…";
}

/**
 * Generate a random ride share token
 */
export function generateShareToken(): string {
  return Array.from({ length: 8 }, () =>
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"[
      Math.floor(Math.random() * 62)
    ]
  ).join("");
}

/**
 * Moroccan cities with coordinates
 */
export const MOROCCAN_CITIES = [
  { id: "casablanca", name: "Casablanca", lat: 33.5731, lng: -7.5898 },
  { id: "rabat", name: "Rabat", lat: 34.0209, lng: -6.8416 },
  { id: "marrakech", name: "Marrakech", lat: 31.6295, lng: -7.9811 },
  { id: "fes", name: "Fès", lat: 34.0181, lng: -5.0078 },
  { id: "agadir", name: "Agadir", lat: 30.4278, lng: -9.5981 },
  { id: "tanger", name: "Tanger", lat: 35.7595, lng: -5.8340 },
  { id: "meknes", name: "Meknès", lat: 33.8935, lng: -5.5547 },
  { id: "oujda", name: "Oujda", lat: 34.6814, lng: -1.9086 },
  { id: "kenitra", name: "Kénitra", lat: 34.2610, lng: -6.5802 },
  { id: "tetouan", name: "Tétouan", lat: 35.5785, lng: -5.3684 },
  { id: "sale", name: "Salé", lat: 34.0531, lng: -6.7986 },
  { id: "mohammedia", name: "Mohammedia", lat: 33.6866, lng: -7.3830 },
  { id: "el_jadida", name: "El Jadida", lat: 33.2549, lng: -8.5007 },
  { id: "beni_mellal", name: "Beni Mellal", lat: 32.3394, lng: -6.3498 },
  { id: "nador", name: "Nador", lat: 35.1681, lng: -2.9287 },
  { id: "laayoune", name: "Laâyoune", lat: 27.1253, lng: -13.1625 },
  { id: "dakhla", name: "Dakhla", lat: 23.6848, lng: -15.9570 },
  { id: "essaouira", name: "Essaouira", lat: 31.5085, lng: -9.7595 },
] as const;

/**
 * Ride status labels in French
 */
export const RIDE_STATUS_LABELS: Record<string, string> = {
  searching: "Recherche en cours",
  accepted: "Accepté",
  driver_arrived: "Conductrice arrivée",
  in_progress: "En cours",
  completed: "Terminé",
  cancelled: "Annulé",
};

/**
 * Ride status colors
 */
export const RIDE_STATUS_COLORS: Record<string, string> = {
  searching: "var(--color-gold-500)",
  accepted: "var(--color-emerald-500)",
  driver_arrived: "var(--color-emerald-600)",
  in_progress: "var(--color-rose-gold-500)",
  completed: "var(--color-emerald-700)",
  cancelled: "#E53E3E",
};
