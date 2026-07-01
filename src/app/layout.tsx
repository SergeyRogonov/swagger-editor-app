import type { Metadata } from "next";
import "./globals.css";

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
    // <html lang="en">
    //   <body className="flex flex-col h-screen w-screen bg-slate-950 text-slate-100">
    //     <Header />
    //     <main className="flex-1 w-full min-h-0">{children}</main>
    //     <Footer />
    //   </body>
    // </html>
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-100">
        {children}
      </body>
    </html>
  );
}
