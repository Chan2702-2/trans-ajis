"use client";

import { useState } from "react";
import { PACKAGES } from "@/constants/packages";
import PackageCard from "@/components/PackageCard";
import BookingForm from "@/components/BookingForm";

export default function Home() {
  const [selectedPackageId, setSelectedPackageId] = useState("");

  const handleSelectPackage = (pkg) => {
    setSelectedPackageId(pkg.id);
    const formElement = document.getElementById("booking-section");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 dark:bg-zinc-950 dark:text-zinc-100 flex flex-col font-sans transition-colors duration-300">
      
      {/* Header / Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-zinc-900/80 border-b border-zinc-100 dark:border-zinc-800/80 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-500 flex items-center justify-center shadow-md">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124l-.09-1.488m-15.38 0J18.75m-15.38 0a2.25 2.25 0 01-2.247-2.118L3 12.228m3.678 3.54a2.25 2.25 0 01-.665-1.665c0-.621.504-1.125 1.125-1.125h12.75c.621 0 1.125.504 1.125 1.125 0 .621-.504 1.125-1.125 1.125H6.678z" />
              </svg>
            </div>
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-teal-600 to-emerald-600 dark:from-teal-400 dark:to-emerald-400 bg-clip-text text-transparent">
              Ajis Batam Trans
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#packages" className="text-sm font-medium hover:text-teal-600 transition-colors">Paket Tour</a>
            <a href="#benefits" className="text-sm font-medium hover:text-teal-600 transition-colors">Keunggulan</a>
            <a href="#booking-section" className="text-sm font-medium hover:text-teal-600 transition-colors">Booking Form</a>
          </nav>
          <a
            href="#booking-section"
            className="inline-flex items-center justify-center rounded-lg bg-teal-600 hover:bg-teal-500 dark:bg-teal-600 dark:hover:bg-teal-500 text-xs sm:text-sm font-bold text-white px-4 py-2 transition-all shadow-sm"
          >
            Pesan Sekarang
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-28 bg-gradient-to-b from-teal-50/50 via-white to-slate-50 dark:from-zinc-900/30 dark:via-zinc-950 dark:to-zinc-950">
        <div className="absolute inset-0 opacity-30 dark:opacity-10 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-300 rounded-full filter blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-300 rounded-full filter blur-3xl animate-pulse delay-700" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 dark:bg-teal-950/40 px-4 py-1.5 text-xs sm:text-sm font-semibold text-teal-700 dark:text-teal-300 border border-teal-100 dark:border-teal-900/30 mb-6">
            ✨ Promo Terbatas: Beli 10 Pax Gratis 1 Free Pax!
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-zinc-900 dark:text-white max-w-4xl mx-auto leading-tight">
            Eksplorasi Keindahan Batam & Bintan Bersama <span className="bg-gradient-to-r from-teal-600 to-emerald-600 dark:from-teal-400 dark:to-emerald-400 bg-clip-text text-transparent">Partner Terpercaya</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Paket liburan premium terlengkap dengan penjemputan ferry terkoordinasi, armada nyaman ber-AC, hotel berbintang, dan pemandu lokal ramah.
          </p>
          <div className="mt-10 flex flex-wrap gap-4 justify-center">
            <a
              href="#packages"
              className="inline-flex items-center justify-center rounded-xl bg-teal-600 hover:bg-teal-500 text-sm sm:text-base font-bold text-white px-8 py-4 transition-all shadow-md hover:shadow-lg"
            >
              Lihat Pilihan Paket
            </a>
            <a
              href="#booking-section"
              className="inline-flex items-center justify-center rounded-xl bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-sm sm:text-base font-bold px-8 py-4 transition-all"
            >
              Kalkulator Harga
            </a>
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section id="packages" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
            Paket Tour Unggulan Kami
          </h2>
          <p className="mt-3 text-lg text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto">
            Temukan paket wisata terbaik dengan jaminan harga transparan dan fasilitas super komplit.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PACKAGES.map((pkg) => (
            <PackageCard
              key={pkg.id}
              pkg={pkg}
              onSelect={handleSelectPackage}
            />
          ))}
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section id="benefits" className="py-20 bg-zinc-100/50 dark:bg-zinc-900/30 border-y border-zinc-100 dark:border-zinc-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
              Mengapa Memilih Kami?
            </h2>
            <p className="mt-3 text-lg text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto">
              Kenyamanan dan kepuasan perjalanan Anda di Batam & Bintan adalah prioritas utama kami.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 shadow-sm border border-zinc-100 dark:border-zinc-800">
              <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-950/30 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-teal-600 dark:text-teal-400" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124l-.09-1.488m-15.356-10.25c-.621 0-1.129.504-1.09 1.124l.09 1.488m15.356-2.612H3.375a1.125 1.125 0 00-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-1.5a1.125 1.125 0 00-1.125-1.125z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-2">Armada Nyaman & AC</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Semua armada tour menggunakan model terbaru yang bersih, terawat, dan ber-AC dingin.</p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 shadow-sm border border-zinc-100 dark:border-zinc-800">
              <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-950/30 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-teal-600 dark:text-teal-400" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-2">Guide Lokal Berlisensi</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Didampingi pemandu wisata lokal ramah yang mengerti sejarah, spot foto terbaik, dan kuliner khas.</p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 shadow-sm border border-zinc-100 dark:border-zinc-800">
              <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-950/30 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-teal-600 dark:text-teal-400" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-2">Promo Beli 10 Pax Gratis 1</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Sangat cocok untuk rombongan keluarga atau corporate gathering. Hemat dan menguntungkan.</p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 shadow-sm border border-zinc-100 dark:border-zinc-800">
              <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-950/30 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-teal-600 dark:text-teal-400" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-2">Layanan Cepat & Pasti</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Admin responsif siap melayani pemesanan tiket ferry dan hotel dengan koordinasi yang mulus.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Form Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
            Kalkulator Instan & Pemesanan
          </h2>
          <p className="mt-3 text-lg text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto">
            Hitung total harga paket secara transparan sesuai jumlah pax dan dapatkan promo bonus secara otomatis!
          </p>
        </div>
        
        <BookingForm
          selectedPackageId={selectedPackageId}
          onPackageChange={(id) => setSelectedPackageId(id)}
        />
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-zinc-900 dark:bg-black text-zinc-400 border-t border-zinc-800 py-12 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="flex justify-center items-center gap-2 text-white">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-teal-500 to-emerald-500 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124l-.09-1.488m-15.38 0J18.75m-15.38 0a2.25 2.25 0 01-2.247-2.118L3 12.228m3.678 3.54a2.25 2.25 0 01-.665-1.665c0-.621.504-1.125 1.125-1.125h12.75c.621 0 1.125.504 1.125 1.125 0 .621-.504 1.125-1.125 1.125H6.678z" />
              </svg>
            </div>
            <span className="font-bold text-lg tracking-tight">Ajis Batam Trans & Tour</span>
          </div>
          <p className="text-sm max-w-md mx-auto">
            Penyedia layanan transportasi, sewa mobil, dan paket tour terlengkap di Batam & Bintan dengan pelayanan bintang 5.
          </p>
          <div className="text-xs text-zinc-500">
            © {new Date().getFullYear()} Ajis Batam Trans. Hak Cipta Dilindungi Undang-Undang.
          </div>
        </div>
      </footer>

    </div>
  );
}
