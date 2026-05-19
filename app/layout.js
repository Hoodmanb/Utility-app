import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import { ToastProvider } from "@/components/Toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "UsedSphere | Premium Used Products Marketplace",
    template: "%s | UsedSphere Marketplace"
  },
  description: "Browse high-quality pre-owned phones, laptops, gaming gear, fashion, and home appliances. Submit buy requests or sell your own items directly via WhatsApp & Instagram.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    title: "UsedSphere | Premium Used Products Marketplace",
    description: "Browse verified, high-quality pre-owned items. Direct conversion via WhatsApp and Instagram DMs.",
    type: "website",
    locale: "en_US",
  }
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100 mesh-gradient">
        <ToastProvider>
          <Navbar />
          <main className="flex-1 flex flex-col">
            {children}
          </main>
          <Footer />
          <FloatingWhatsApp />
        </ToastProvider>
      </body>
    </html>
  );
}
