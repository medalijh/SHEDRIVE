// Service Worker for SheDrive Morocco PWA
// Provides offline support, background sync, and push notifications

const CACHE_NAME = "shedrive-v1";
const STATIC_ASSETS = [
  "/",
  "/offline",
  "/manifest.json",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
];

// ── Install: cache static assets ──────────────────────────────
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// ── Activate: clean old caches ────────────────────────────────
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// ── Fetch: Network-first with offline fallback ────────────────
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests and cross-origin
  if (request.method !== "GET" || !url.origin.includes(self.location.origin)) {
    return;
  }

  // API calls: network only (never cache)
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(
      fetch(request).catch(() =>
        new Response(JSON.stringify({ error: "Hors ligne", offline: true }), {
          status: 503,
          headers: { "Content-Type": "application/json" },
        })
      )
    );
    return;
  }

  // Static assets (icons, images, fonts): cache-first
  if (
    url.pathname.startsWith("/icons/") ||
    url.pathname.startsWith("/images/") ||
    url.pathname.startsWith("/_next/static/") ||
    request.destination === "font"
  ) {
    event.respondWith(
      caches.match(request).then(
        (cached) => cached || fetch(request).then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return response;
        })
      )
    );
    return;
  }

  // Navigation: network-first, fallback to cache, then offline page
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Cache successful navigation responses
        if (response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return response;
      })
      .catch(() =>
        caches.match(request).then(
          (cached) => cached || caches.match("/offline")
        )
      )
  );
});

// ── Push Notifications ────────────────────────────────────────
self.addEventListener("push", (event) => {
  let data = { title: "SheDrive 🌹", body: "Nouvelle notification" };
  try {
    data = event.data.json();
  } catch {}

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "/icons/icon-192x192.png",
      badge: "/icons/badge-72x72.png",
      tag: data.tag || "shedrive-notification",
      data: data.url || "/",
      actions: data.actions || [],
      vibrate: [200, 100, 200],
      requireInteraction: data.requireInteraction || false,
    })
  );
});

// ── Notification click ────────────────────────────────────────
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data || "/";
  event.waitUntil(
    clients.matchAll({ type: "window" }).then((clientList) => {
      const existing = clientList.find((c) => c.url === url && "focus" in c);
      if (existing) return existing.focus();
      return clients.openWindow(url);
    })
  );
});

// ── Background Sync (for offline ride requests) ───────────────
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-rides") {
    event.waitUntil(syncPendingRides());
  }
});

async function syncPendingRides() {
  try {
    const db = await openDB();
    const pending = await db.getAll("pending-rides");
    for (const ride of pending) {
      await fetch("/api/rides", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ride),
      });
      await db.delete("pending-rides", ride.id);
    }
  } catch {
    // Will retry on next sync
  }
}

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open("shedrive-db", 1);
    req.onupgradeneeded = () => {
      req.result.createObjectStore("pending-rides", { keyPath: "id" });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}
