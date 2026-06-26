"use client";

import { useState } from "react";
import Image from "next/image";
import { PACKAGES } from "@/constants/packages";
import BookingForm from "@/components/BookingForm";

export default function Home() {
  // State for Search Module
  const [searchDest, setSearchDest] = useState("");
  const [searchDate, setSearchDate] = useState("");

  // State for Booking Form
  const [selectedPackageId, setSelectedPackageId] = useState("");

  const handleSelectPackage = (pkgId) => {
    setSelectedPackageId(pkgId);
    const formElement = document.getElementById("booking-section");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Helper to generate WA Link
  const handleWAFlow = (pkgName, details = "") => {
    const adminPhone = "628117771234";
    const baseMessage = `Halo Admin Ajis Batam Trans, saya tertarik dengan paket: ${pkgName}.`;
    const finalMessage = details ? `${baseMessage} ${details}` : baseMessage;
    const encoded = encodeURIComponent(finalMessage);
    window.open(`https://wa.me/${adminPhone}?text=${encoded}`, "_blank");
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchDest) {
      alert("Silakan pilih destinasi terlebih dahulu.");
      return;
    }
    const details = `Destinasi tujuan: ${searchDest}${searchDate ? `, Rencana Tanggal: ${searchDate}` : ""}`;
    handleWAFlow("Pencarian Rute / Jadwal", details);
  };

  return (
    <div 
      className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col font-sans selection:bg-blue-500 selection:text-white"
      style={{
        backgroundImage: 'radial-gradient(#e2e8f0 1.5px, transparent 1.5px)',
        backgroundSize: '24px 24px',
      }}
    >
      
      {/* 2. Navigation Bar (Top) */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 rounded-lg overflow-hidden shadow-sm border border-slate-200 bg-slate-50">
              <Image
                src="/asset/img/logo-1.jpeg"
                alt="Ajis Batam Trans Logo"
                fill
                className="object-cover"
              />
            </div>
            <span className="font-extrabold text-lg tracking-tight text-blue-900">
              Ajis Batam Trans
            </span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <a href="#packages" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">Paket Tour</a>
            <a href="#benefits" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">Keunggulan</a>
            <a href="#booking-section" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">Booking</a>
            <a href="#contact" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">Kontak</a>
          </nav>

          <button
            onClick={() => handleWAFlow("Booking Langsung", "Ingin memesan armada / paket tour sesegera mungkin.")}
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 hover:bg-blue-700 text-sm font-bold text-white px-5 py-2.5 transition-all shadow-sm active:scale-95"
          >
            Book Now
          </button>
        </div>
      </header>

      {/* 3. Hero Section */}
      <section className="relative pt-16 pb-24 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#1A365D] leading-tight max-w-3xl mx-auto">
            Eksplorasi Keindahan Batam & Bintan Bersama Partner Terpercaya
          </h1>
          
          <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-xl mx-auto leading-relaxed">
            Penyedia layanan transportasi premium terlengkap dengan armada modern, hotel berbintang, dan pemandu lokal berlisensi.
          </p>

          <div className="mt-6 flex justify-center gap-4">
            <a
              href="#packages"
              className="inline-flex items-center text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors gap-1 group"
            >
              Lihat Pilihan Paket
              <span className="transform group-hover:translate-x-1 transition-transform">→</span>
            </a>
          </div>

          {/* Focused Vehicle Banner Card */}
          <div className="mt-10 max-w-2xl mx-auto rounded-2xl overflow-hidden border border-slate-200 bg-blue-50/40 p-3 shadow-md">
            <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-slate-100">
              <Image
                src="/tour_van_batam.jpg"
                alt="Armada Transportasi Modern"
                fill
                className="object-cover"
                priority
              />
            </div>
            <p className="text-xs text-slate-500 mt-2.5 font-medium">Armada Toyota Hiace Commuter premium kami untuk kenyamanan maksimal Anda</p>
          </div>
        </div>

        {/* 4. Search / Booking Module */}
        <div className="max-w-4xl mx-auto px-4 mt-12 relative z-20">
          <form 
            onSubmit={handleSearchSubmit}
            className="bg-white rounded-2xl p-4 shadow-lg border border-slate-200/80 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between"
          >
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Destination */}
              <div className="flex flex-col">
                <label htmlFor="dest-select" className="text-xs font-bold text-blue-900/60 uppercase tracking-wider mb-1.5 pl-1">
                  Pilih Destinasi
                </label>
                <select
                  id="dest-select"
                  value={searchDest}
                  onChange={(e) => setSearchDest(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/25 transition-all"
                  required
                >
                  <option value="" disabled hidden>Ke mana liburan Anda?</option>
                  <option value="Batam & Bintan 3D2N">Batam & Bintan 3D2N (Best Seller)</option>
                  <option value="Batam 2D1N">Batam 2D1N City Tour</option>
                  <option value="Batam 3D2N (Essential)">Batam 3D2N (Essential)</option>
                  <option value="Custom Route / Sewa Mobil Only">Sewa Mobil / Custom Route</option>
                </select>
              </div>

              {/* Departure Date */}
              <div className="flex flex-col">
                <label htmlFor="date-input" className="text-xs font-bold text-blue-900/60 uppercase tracking-wider mb-1.5 pl-1">
                  Tanggal Keberangkatan
                </label>
                <input
                  id="date-input"
                  type="date"
                  value={searchDate}
                  onChange={(e) => setSearchDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/25 transition-all"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex items-end justify-stretch md:justify-start pt-2 md:pt-0">
              <button
                type="submit"
                className="w-full md:w-auto inline-flex items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-700 text-sm font-bold text-white px-8 py-3.5 transition-all shadow-md hover:shadow-lg active:scale-95 whitespace-nowrap"
              >
                Cari Jadwal
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* 5. Paket Populer Section */}
      <section id="packages" className="py-20 border-t border-slate-200 bg-white/60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-[#1A365D] tracking-tight">
              Paket City Tour Terpopuler
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
              Pilihan paket terfavorit dengan layanan jemput ferry dan keliling objek wisata terpopuler.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Card 1: Batam & Bintan 3D2N */}
            <div className="bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
              <div>
                <div className="relative aspect-[16/7] w-full bg-slate-100">
                  <Image
                    src="/beach_resort_bintan.jpg"
                    alt="Batam & Bintan Resort"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                    Promo: 10 pax FREE 1 orang
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-start gap-4 mb-4">
                    <h3 className="text-lg font-bold text-[#1A365D]">
                      1. Batam & Bintan 3D2N (Best Seller)
                    </h3>
                    <div className="text-right shrink-0">
                      <span className="text-xs text-slate-500 block">Mulai dari</span>
                      <span className="text-xl font-extrabold text-blue-600">RM 750</span>
                      <span className="text-xs text-slate-500"> / pax</span>
                      <span className="text-[10px] text-slate-400 block font-medium">(min 4 pax)</span>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-4">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Fasilitas Termasuk (10 Poin):</p>
                    <ul className="grid grid-cols-1 gap-y-2">
                      {[
                        "Tiket Ferry PP (Singapore/Johor to Batam)",
                        "Tiket Ferry Domestik PP (Batam to Bintan)",
                        "Transportasi AC Private selama tour (Batam & Bintan)",
                        "Hotel Bintang 4 (2 Malam di Batam/Bintan + Sarapan)",
                        "Tiket Masuk ke Treasure Bay Bintan (Lagoi)",
                        "Kunjungan Gurun Pasir & Danau Biru Bintan",
                        "City Tour Batam (Jembatan Barelang, Welcome to Batam)",
                        "Pemandu Wisata Profesional & Berlisensi",
                        "2x Makan Siang Seafood di Restauran Kelong Premium",
                        "Air Mineral gratis selama perjalanan tour"
                      ].map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                          <svg className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-slate-50 flex justify-end">
                <button
                  onClick={() => handleSelectPackage("batam-bintan-3d2n")}
                  className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-md transition-all active:scale-95"
                  title="Pesan Paket Ini"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Card 2: Batam 2D1N */}
            <div className="bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
              <div>
                <div className="relative aspect-[16/7] w-full bg-slate-100">
                  <Image
                    src="/batam_temple_landmark.jpg"
                    alt="Batam Temple Landmark"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                    Promo: 10 pax FREE 1 orang
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-start gap-4 mb-4">
                    <h3 className="text-lg font-bold text-[#1A365D]">
                      2. Batam 2D1N
                    </h3>
                    <div className="text-right shrink-0">
                      <span className="text-xs text-slate-500 block">Mulai dari</span>
                      <span className="text-xl font-extrabold text-blue-600">RM 499</span>
                      <span className="text-xs text-slate-500"> / pax</span>
                      <span className="text-[10px] text-slate-400 block font-medium">(min 4 pax)</span>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-4">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Fasilitas Termasuk (9 Poin):</p>
                    <ul className="grid grid-cols-1 gap-y-2">
                      {[
                        "Tiket Ferry PP (Singapore/Johor to Batam)",
                        "Transportasi AC Private selama tour di Batam",
                        "Hotel Bintang 3 (1 Malam + Sarapan Pagi)",
                        "City Tour Jembatan Barelang (Iconic Spot)",
                        "Kunjungan ke Masjid Cheng Ho & Miniatur Rumah Adat",
                        "Wisata Belanja di Mall Terbesar Batam (Grand Batam Mall)",
                        "Pemandu Wisata lokal ramah & berpengalaman",
                        "1x Makan Siang Seafood di Restaurant Kelong Lokal",
                        "Air Mineral & Snack Box saat kedatangan"
                      ].map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                          <svg className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-slate-50 flex justify-end">
                <button
                  onClick={() => handleSelectPackage("batam-2d1n")}
                  className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-md transition-all active:scale-95"
                  title="Pesan Paket Ini"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Card 3: Batam 3D2N (Essential) */}
            <div className="bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
              <div>
                <div className="relative aspect-[16/7] w-full bg-slate-100">
                  <Image
                    src="/batam_city_mall.jpg"
                    alt="Batam Shopping Mall"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                    Promo: Group Bonus 10+
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-start gap-4 mb-4">
                    <h3 className="text-lg font-bold text-[#1A365D]">
                      3. Batam 3D2N (Essential)
                    </h3>
                    <div className="text-right shrink-0">
                      <span className="text-xs text-slate-500 block">Mulai dari</span>
                      <span className="text-xl font-extrabold text-blue-600">RM 499</span>
                      <span className="text-xs text-slate-500"> / pax</span>
                      <span className="text-[10px] text-slate-400 block font-medium">(min 4 pax)</span>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-4">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Fasilitas Termasuk:</p>
                    <ul className="grid grid-cols-1 gap-y-2">
                      {[
                        "Tiket Ferry PP (Singapore/Johor/Batam)",
                        "Transportasi AC selama tour Batam",
                        "Hotel Bintang 3 (2 Malam + Sarapan)",
                        "Full Day Tour Batam & Shopping Tour",
                        "Makan Siang & Malam Seafood/Kuliner lokal",
                        "Dokumentasi foto/video gratis"
                      ].map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                          <svg className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-slate-50 flex justify-end">
                <button
                  onClick={() => handleSelectPackage("batam-3d2n-essential")}
                  className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-md transition-all active:scale-95"
                  title="Pesan Paket Ini"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Booking Calculator Section */}
      <section id="booking-section" className="py-20 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-[#1A365D] tracking-tight">
              Kalkulator Instan & Pemesanan
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
              Hitung total harga paket secara transparan sesuai jumlah pax dan dapatkan promo bonus secara otomatis!
            </p>
          </div>
          
          <BookingForm
            selectedPackageId={selectedPackageId}
            onPackageChange={(id) => setSelectedPackageId(id)}
          />
        </div>
      </section>

      {/* Keunggulan Section */}
      <section id="benefits" className="py-20 bg-slate-100/40 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-[#1A365D] tracking-tight">
              Mengapa Memilih Kami?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25" />
                </svg>
              </div>
              <h4 className="text-base font-bold text-slate-800 mb-2">Armada Nyaman & Baru</h4>
              <p className="text-xs text-slate-500 leading-relaxed">Semua armada tour menggunakan model terbaru yang bersih, terawat, dan ber-AC dingin.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                </svg>
              </div>
              <h4 className="text-base font-bold text-slate-800 mb-2">Guide Lokal Berlisensi</h4>
              <p className="text-xs text-slate-500 leading-relaxed">Didampingi pemandu wisata lokal ramah yang mengerti sejarah, spot foto terbaik, dan kuliner khas.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63" />
                </svg>
              </div>
              <h4 className="text-base font-bold text-slate-800 mb-2">Koordinasi Mulus</h4>
              <p className="text-xs text-slate-500 leading-relaxed">Admin responsif yang siap mengatur tiket ferry PP dan hotel untuk Anda tanpa repot.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-[#1A365D] tracking-tight">
              Hubungi Kami
            </h2>
            <p className="mt-3 text-sm text-slate-600 max-w-xl mx-auto">
              Punya pertanyaan atau butuh penyesuaian rute? Tim kami siap melayani Anda 24/7.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 max-w-6xl mx-auto">
            {/* Info Cards Column */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              {/* WhatsApp */}
              <a 
                href="https://wa.me/628117771234" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-6 rounded-2xl bg-white shadow-sm border border-slate-200 hover:shadow-md hover:border-blue-500/50 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-emerald-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.725 1.451 5.405.002 9.801-4.394 9.803-9.805.001-2.621-1.022-5.086-2.88-6.944C16.438 1.996 13.975 1.02 11.35 1.02c-5.41 0-9.808 4.397-9.81 9.811-.001 1.642.434 3.243 1.258 4.654l-.994 3.634 3.72-.976" />
                  </svg>
                </div>
                <h3 className="text-base font-bold text-slate-800 mb-1">WhatsApp</h3>
                <p className="text-xs text-slate-500 mb-2">+62 811-777-1234</p>
                <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                  Chat Sekarang
                  <svg className="w-3 h-3 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </span>
              </a>

              {/* Email */}
              <a 
                href="mailto:info@ajisbatamtrans.com" 
                className="p-6 rounded-2xl bg-white shadow-sm border border-slate-200 hover:shadow-md hover:border-blue-500/50 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                </div>
                <h3 className="text-base font-bold text-slate-800 mb-1">Email</h3>
                <p className="text-xs text-slate-500 mb-2">info@ajisbatamtrans.com</p>
                <span className="text-[11px] font-semibold text-blue-600 flex items-center gap-1">
                  Kirim Email
                  <svg className="w-3 h-3 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </span>
              </a>

              {/* Lokasi / Alamat */}
              <div className="p-6 rounded-2xl bg-white shadow-sm border border-slate-200">
                <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-rose-600" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25s-7.5-4.108-7.5-11.25C19.5 6.358 16.142 3 12 3c-4.142 0-7.5 3.358-7.5 7.5 0 7.142 7.5 11.25 7.5 11.25s7.5-4.108 7.5-11.25z" />
                  </svg>
                </div>
                <h3 className="text-base font-bold text-slate-800 mb-1">Lokasi Utama</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Batam, Kepulauan Riau, Indonesia
                </p>
              </div>
            </div>

            {/* Google Map Embed */}
            <div className="lg:col-span-3 w-full h-[350px] lg:h-auto min-h-[350px] rounded-2xl overflow-hidden shadow-sm border border-slate-200 relative bg-white">
              <iframe
                title="Lokasi Ajis Batam Trans"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127672.48419688467!2d103.9242964893113!3d1.0182470726223293!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31d98bcee06f0e9f%3A0x3039d80b220cc70!2sBatam%2C%20Batam%20City%2C%20Riau%20Islands!5e0!3m2!1sen!2sid!4v1700000000000!5m2!1sen!2sid"
                className="w-full h-full border-0 absolute inset-0 opacity-90 hover:opacity-100 transition-opacity"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-[#0F172A] text-slate-400 border-t border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="flex justify-center items-center gap-2 text-white">
            <div className="relative w-7 h-7 rounded-lg overflow-hidden border border-slate-700 bg-slate-800 shadow-sm">
              <Image
                src="/asset/img/logo-1.jpeg"
                alt="Ajis Batam Trans Logo"
                fill
                className="object-cover"
              />
            </div>
            <span className="font-bold text-base tracking-tight">Ajis Batam Trans & Tour</span>
          </div>
          <p className="text-xs max-w-md mx-auto text-slate-500">
            Penyedia layanan transportasi, sewa mobil, dan paket tour terlengkap di Batam & Bintan dengan pelayanan bintang 5.
          </p>
          <div className="text-[10px] text-slate-600">
            © {new Date().getFullYear()} Ajis Batam Trans. Hak Cipta Dilindungi Undang-Undang.
          </div>
        </div>
      </footer>

      {/* 7. Frosted Glass AI Bubble and Realistic Pen */}
      <div className="fixed bottom-6 left-6 z-50 flex items-end gap-3 pointer-events-none">
        {/* The Realistic Pen */}
        <div className="relative w-4 h-36 origin-bottom rotate-[28deg] translate-x-4 translate-y-1 drop-shadow-[2px_8px_4px_rgba(0,0,0,0.15)] flex flex-col items-center">
          {/* Pen Tip / Nib */}
          <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[10px] border-b-slate-400" />
          {/* Pen Tip Collar */}
          <div className="w-[8px] h-3 bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-600 rounded-t-sm" />
          {/* Pen Body */}
          <div className="w-[10px] h-20 bg-gradient-to-r from-blue-900 via-blue-800 to-slate-900 relative flex items-center justify-center">
            {/* Laser etched brand text */}
            <span className="text-[6px] text-yellow-400 font-extrabold tracking-widest uppercase rotate-90 whitespace-nowrap opacity-85 select-none">
              AJIS BATAM TRANS
            </span>
          </div>
          {/* Gold Accent Ring */}
          <div className="w-[11px] h-1.5 bg-gradient-to-r from-yellow-500 to-yellow-600" />
          {/* Pen Cap End */}
          <div className="w-[10px] h-6 bg-slate-800 rounded-b-md" />
          {/* Pen Clip */}
          <div className="absolute top-12 -right-1.5 w-1 h-12 bg-slate-400 rounded-sm shadow-sm" />
        </div>

        {/* AI Prompt Bubble */}
        <div className="max-w-xs bg-white/70 backdrop-blur-md p-4 rounded-2xl border border-slate-200/80 shadow-lg pointer-events-auto flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-[10px] font-bold text-blue-900/60 uppercase tracking-widest">AI Customizer</span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed font-semibold italic">
            "Ubah Paket 3 untuk menampilkan group bonus lengkap: 10+ (1 Free), 20+ (2 Free), 30+ (3 Free), dst."
          </p>
        </div>
      </div>

    </div>
  );
}
