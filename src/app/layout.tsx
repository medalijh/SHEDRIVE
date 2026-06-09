import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import PWAManager from "@/components/PWAManager";
import { AuthProvider } from "@/components/AuthProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
});

// --- SEO Metadata -------------------------------------------------------------
export const metadata: Metadata = {
  title: {
    default: "SheDrive Morocco - Taxi Femme Maroc",
    template: "%s | SheDrive Morocco",
  },
  description:
    "SheDrive Morocco — Service de transport exclusivement féminin au Maroc. Sûr, élégant, premium. Réservez votre trajet en toute confiance.",
  keywords: [
    "women only taxi Morocco",
    "taxi femme Maroc",
    "سيارة أجرة نساء المغرب",
    "SheDrive",
    "ride-hailing Morocco",
    "safe rides for women",
    "transport femme casablanca",
    "VTC femme maroc",
  ],
  authors: [{ name: "SheDrive Morocco" }],
  creator: "SheDrive Morocco",
  publisher: "SheDrive Morocco",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://shedrive.ma"
  ),
  openGraph: {
    type: "website",
    locale: "fr_MA",
    alternateLocale: ["ar_MA", "en_US"],
    url: "https://shedrive.ma",
    siteName: "SheDrive Morocco",
    title: "SheDrive Morocco - Transport Féminin Premium",
    description:
      "Service de transport exclusivement féminin au Maroc. Sûr, élégant, empowerant.",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "SheDrive Morocco - Women-Only Ride-Hailing",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SheDrive Morocco",
    description: "Transport féminin premium au Maroc",
    images: ["/images/og-image.jpg"],
    site: "@SheDriverMaroc",
  },

  // PWA
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "SheDrive",
  },

  // Icons
  icons: {
    icon: [
      { url: "/icons/icon-32x32.png",   sizes: "32x32",   type: "image/png" },
      { url: "/icons/icon-96x96.png",   sizes: "96x96",   type: "image/png" },
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/apple-icon-57x57.png",   sizes: "57x57" },
      { url: "/icons/apple-icon-60x60.png",   sizes: "60x60" },
      { url: "/icons/apple-icon-72x72.png",   sizes: "72x72" },
      { url: "/icons/apple-icon-76x76.png",   sizes: "76x76" },
      { url: "/icons/apple-icon-114x114.png", sizes: "114x114" },
      { url: "/icons/apple-icon-120x120.png", sizes: "120x120" },
      { url: "/icons/apple-icon-144x144.png", sizes: "144x144" },
      { url: "/icons/apple-icon-152x152.png", sizes: "152x152" },
      { url: "/icons/apple-icon-180x180.png", sizes: "180x180" },
    ],
    other: [
      { rel: "mask-icon", url: "/icons/safari-pinned-tab.svg", color: "#E11D48" },
    ],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  verification: {
    google: "your-google-site-verification-id",
  },

  category: "transportation",
};

// --- Viewport -------------------------------------------------
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#E11D48" },
    { media: "(prefers-color-scheme: dark)",  color: "#1A150F" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  minimumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  colorScheme: "light dark",
  interactiveWidget: "resizes-visual",
};

// --- Root Layout --------------------------------------------------------------
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" dir="ltr" className={inter.variable}>
      <head>
        <link rel="icon" href="/logo.png" />
        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,600&family=Noto+Sans+Arabic:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />

        {/* Leaflet Map CSS */}
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossOrigin="" />


        {/* Mobile Web App */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="SheDrive" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="HandheldFriendly" content="True" />
        <meta name="MobileOptimized" content="320" />

        {/* Microsoft Tiles */}
        <meta name="msapplication-TileColor" content="#E11D48" />
        <meta name="msapplication-TileImage" content="/icons/icon-144x144.png" />
        <meta name="msapplication-config" content="/browserconfig.xml" />

        {/* Apple Splash Screens for common iPhone sizes */}
        <link rel="apple-touch-startup-image" href="/icons/splash-1125x2436.png"
          media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)" />
        <link rel="apple-touch-startup-image" href="/icons/splash-1242x2208.png"
          media="(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3)" />
        <link rel="apple-touch-startup-image" href="/icons/splash-750x1334.png"
          media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)" />
        <link rel="apple-touch-startup-image" href="/icons/splash-1284x2778.png"
          media="(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3)" />

        {/* Touch icon */}
        <link rel="apple-touch-icon" href="/icons/apple-icon-180x180.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/apple-icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="120x120" href="/icons/apple-icon-120x120.png" />

        {/* Canonical */}
        <link rel="canonical" href={process.env.NEXT_PUBLIC_APP_URL || "https://shedrive.ma"} />

        {/* DNS Prefetch */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        <link rel="dns-prefetch" href="//maps.googleapis.com" />
      </head>

      <body className="antialiased" style={{ WebkitTapHighlightColor: "transparent" }}>
        <AuthProvider>
          <PWAManager />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
