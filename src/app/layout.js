import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Fajri Tour & Travel Batam",
  // Gw tambahin kata 'Pakej', 'Singapore', dan 'Malaysia' biar robot Google SG/MY gampang nangkep
  description: "Pilihan paket tour & pakej percutian Batam - Bintan terlengkap untuk jemaah lokal, Singapore, & Malaysia. Promo bonus beli 10 pax gratis 1!",
  icons: {
    icon: "/asset/img/logo-1.png",
  },
  verification: {
    google: "4Fy39JwJArDnY-szTJvLq47EZOFU33L4kiPlAZ_8Krk",
  }
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="id" // Diubah ke 'id' agar sesuai dengan bahasa utama web
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
