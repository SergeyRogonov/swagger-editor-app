import type { Metadata } from "next";
import "./globals.css";
import HeadFavicon from "@/features/favicon/HeadFavicon";
import { ThemeProvider } from "@/provider/ThemeProvider";

export const metadata: Metadata = {
  title: "Swagger/OpenAPI UI",
  description: "Swagger/OpenAPI editor and REST client",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <HeadFavicon />
      <body className="min-h-screen bg-base text-text-primary">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
