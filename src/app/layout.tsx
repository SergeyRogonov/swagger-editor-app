import type { Metadata } from "next";
import "./globals.css";
import HeadFavicon from "@/features/favicon/HeadFavicon";

export const metadata: Metadata = {
  title: "Swagger/OpenAPI UI",
  description: "Swagger/OpenAPI editor and REST client",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <HeadFavicon />
      <body className="min-h-screen bg-slate-950 text-slate-100">
        {children}
      </body>
    </html>
  );
}
