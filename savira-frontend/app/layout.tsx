import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import WhatsAppButton from "@/components/ui/WhatsAppButton";

export const metadata: Metadata = {
  title: "SAVIRA ATTIRES | Premium Indian Ethnic Wear",
  description:
    "Discover premium Indian ethnic wear — Kurtis, Co-ord Sets, Festive & Office Wear. Elegant, modern, and crafted for the contemporary Indian woman.",
  keywords:
    "Indian ethnic wear, kurtis, co-ord sets, festive wear, women clothing, SAVIRA ATTIRES",
  openGraph: {
    title: "SAVIRA ATTIRES | Premium Indian Ethnic Wear",
    description: "Grace Woven Beautifully — Premium Indian ethnic fashion.",
    type: "website",
    locale: "en_IN",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className="bg-ivory min-h-screen flex flex-col">
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              fontFamily: "Poppins, sans-serif",
              fontSize: "14px",
              borderRadius: "12px",
            },
          }}
        />
        <Navbar />
        <main className="flex-1 pb-16 md:pb-0">{children}</main>
        <Footer />
        <MobileBottomNav />
        <WhatsAppButton />
      </body>
    </html>
  );
}
