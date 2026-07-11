import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/provider/ThemeProvider";

export const metadata: Metadata = {
  title: "Swagger/OpenAPI UI",
  description: "Swagger/OpenAPI editor and REST client",
  applicationName: "Swagger UI (Coffee-Driven Development)",
  openGraph: {
    title: "Swagger UI (Coffee-Driven Development)",
    description: "Swagger UI (Coffee-Driven Development)",
    url: "/",
    siteName: "Swagger UI (Coffee-Driven Development)",
    images: [
      {
        url: "/favicon/favicon_256.jpg",
        width: 256,
        height: 256,
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Swagger UI (Coffee-Driven Development)",
    description: "Swagger UI (Coffee-Driven Development)",
    images: ["/favicon/favicon_256.jpg"],
  },
  icons: {
    icon: [
      { url: "/favicon/favicon.ico", sizes: "any" },
      { url: "/favicon/favicon_16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon/favicon_32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon/favicon_96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon/favicon_192.png", sizes: "192x192", type: "image/png" },
      { url: "/favicon/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/favicon/favicon_57.png", sizes: "57x57" },
      { url: "/favicon/favicon_60.png", sizes: "60x60" },
      { url: "/favicon/favicon_72.png", sizes: "72x72" },
      { url: "/favicon/favicon_76.png", sizes: "76x76" },
      { url: "/favicon/favicon_114.png", sizes: "114x114" },
      { url: "/favicon/favicon_120.png", sizes: "120x120" },
      { url: "/favicon/favicon_144.png", sizes: "144x144" },
      { url: "/favicon/favicon_152.png", sizes: "152x152" },
      { url: "/favicon/favicon_180.png", sizes: "180x180" },
    ],
  },
  manifest: "/favicon/manifest.webmanifest",
  themeColor: "#f8f9fa",
  appleWebApp: {
    title: "Swagger UI (Coffee-Driven Development)",
    statusBarStyle: "default",
  },
  other: {
    "msapplication-TileColor": "#2d89ef",
    "msapplication-TileImage": "/favicon/favicon_144.png",
    "msapplication-config": "/favicon/ieconfig.xml",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-base text-text-primary">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
