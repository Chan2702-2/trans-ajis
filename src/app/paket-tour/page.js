"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { PACKAGES } from "@/constants/packages";
import BookingForm from "@/components/BookingForm";

export default function PaketTourPage() {
  const [selectedPkgId, setSelectedPkgId] = useState("");
  const [activeFaq, setActiveFaq] = useState(null);
  const [starFilter, setStarFilter] = useState("all"); // 'all' | 3 | 4
  const [priceSort, setPriceSort] = useState("default"); // 'default' | 'asc' (murah ke mahal) | 'desc' (mahal ke murah)
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const handleSelectPackage = (pkgId) => {
    setSelectedPkgId(pkgId);
    const formSection = document.getElementById("booking-calculator");
    if (formSection) {
      formSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Filter dan Sort Paket
  const filteredAndSortedPackages = (() => {
    // 1. Filter Bintang Hotel
    let items = PACKAGES.filter((pkg) => {
      if (starFilter === "all") return true;
      return pkg.bintang === starFilter;
    });

    // 2. Sort Harga
    if (priceSort === "asc") {
      items = [...items].sort((a, b) => a.harga_rm - b.harga_rm);
    } else if (priceSort === "desc") {
      items = [...items].sort((a, b) => b.harga_rm - a.harga_rm);
    }

    return items;
  })();

  const faqs = [
    {
      q: "Apakah paket tour sudah termasuk tiket ferry?",
      a: "Ya! Seluruh paket tour kami (Paket 1, 2, dan 3) sudah termasuk tiket ferry pulang-pergi (PP) dari Singapura (HarbourFront) atau Malaysia (Johor Bahru) ke Batam, lengkap dengan pengurusan boarding."
    },
    {
      q: "Apakah jadwal/itinerary tour bisa dicustom?",
      a: "Tentu saja! Kami sangat fleksibel. Anda dapat meminta penyesuaian rute objek wisata, pilihan hotel (bintang 3/4/5), maupun penambahan hari tour. Silakan chat admin kami untuk kustomisasi rute."
    },
    {
      q: "Bagaimana dengan sistem pembayaran dan deposit?",
      a: "Pembayaran deposit dapat dilakukan melalui transfer bank lokal Indonesia atau rekening internasional (seperti Wise/RM). Pelunasan dapat diselesaikan saat penjemputan di Batam sesuai kesepakatan."
    },
    {
      q: "Apakah ada diskon atau bonus untuk rombongan?",
      a: "Ya! Kami memiliki promo khusus rombongan. Untuk Paket 1 dan 2, setiap pembelian minimal 10 pax akan mendapatkan gratis 1 pax (FREE 1). Untuk Paket 3, berlaku kelipatan bonus setiap 10 pax (10+1 free, 20+2 free, dst)."
    },
    {
      q: "Apakah armada transportasi yang digunakan bersifat pribadi?",
      a: "Ya, seluruh perjalanan menggunakan armada AC Private (tidak digabung dengan rombongan/wisatawan lain) untuk menjaga kenyamanan dan privasi liburan keluarga Anda."
    }
  ];

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col font-sans selection:bg-blue-500 selection:text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative w-9 h-9 rounded-lg overflow-hidden shadow-sm border border-slate-200 bg-slate-50">
              <Image
                src="/asset/img/logo-1.png"
                alt="Fajri Transport Batam Logo"
                fill
                sizes="36px"
                className="object-cover"
              />
            </div>
            <span className="font-extrabold text-lg tracking-tight text-blue-900">
              Fajri Transport Batam
            </span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">
              Beranda
            </Link>
            <Link href="/paket-tour" className="text-sm font-bold text-blue-600 transition-colors">
              Paket Tour
            </Link>
            <Link href="/blog" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">
              Blog
            </Link>
            <Link href="/ulasan" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">
              Ulasan
            </Link>
            <Link href="/#contact" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">
              Kontak
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            {/* Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-lg text-slate-600 hover:bg-slate-100 active:scale-95 transition-all cursor-pointer"
              aria-label="Menu Utama"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                )}
              </svg>
            </button>

            <button
              onClick={() => handleSelectPackage("")}
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 hover:bg-blue-700 text-sm font-bold text-white px-5 py-2.5 transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              Book Now
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white shadow-lg animate-mobile-menu">
            <div className="px-4 py-3 space-y-1">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2.5 px-3 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 active:bg-blue-50/50 hover:text-blue-650 transition-all"
              >
                Beranda
              </Link>
              <Link
                href="/paket-tour"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2.5 px-3 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 active:bg-blue-50/50 hover:text-blue-650 transition-all"
              >
                Paket Tour
              </Link>
              <Link
                href="/blog"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2.5 px-3 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 active:bg-blue-50/50 hover:text-blue-650 transition-all"
              >
                Blog
              </Link>
              <Link
                href="/ulasan"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2.5 px-3 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 active:bg-blue-50/50 hover:text-blue-650 transition-all"
              >
                Ulasan
              </Link>
              <Link
                href="/#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2.5 px-3 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 active:bg-blue-50/50 hover:text-blue-650 transition-all"
              >
                Kontak
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {/* Page Hero Header */}
        <section className="bg-[#1A365D] text-white py-16 sm:py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-cover bg-center opacity-10 mix-blend-overlay" style={{ backgroundImage: "url('/beach_resort_bintan.jpg')" }} />
          <div className="absolute -top-12 -left-12 w-48 h-48 bg-blue-600/20 rounded-full blur-2xl" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <span className="text-[10px] font-black uppercase tracking-widest bg-blue-600/35 border border-blue-400/40 text-blue-200 px-3.5 py-1.5 rounded-full">
              Layanan Tour Premium Batam & Bintan
            </span>
            <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              Pilihan Paket Tour Terbaik
            </h1>
            <p className="mt-4 text-xs sm:text-sm md:text-base text-blue-105 max-w-2xl mx-auto leading-relaxed font-medium">
              Nikmati liburan seru bebas ribet. Paket sudah All-In mencakup tiket ferry internasional PP, penginapan hotel berbintang, tiket masuk wisata, makan kelong seafood premium, dan armada transportasi AC private.
            </p>
          </div>
        </section>

        {/* Packages Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-black text-[#1A365D] tracking-tight">
              Pilih Paket Unggulan Anda
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
              Silakan pilih salah satu paket di bawah untuk mengaktifkan kalkulator instan dan formulir pemesanan otomatis.
            </p>
          </div>

          {/* Filter & Sort Controls */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-12 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
            {/* Filter Bintang Hotel */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider hidden md:inline">Kelas Hotel:</span>
              <div className="flex gap-1.5">
                {[
                  { id: "all", label: "Semua Paket" },
                  { id: 3, label: "Bintang 3 ⭐⭐⭐" },
                  { id: 4, label: "Bintang 4 ⭐⭐⭐⭐" }
                ].map((tab) => {
                  const isSelected = starFilter === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setStarFilter(tab.id)}
                      className={`px-3.5 py-2 text-xs font-extrabold rounded-xl border transition-all active:scale-95 cursor-pointer
                        ${isSelected 
                          ? "bg-blue-600 border-blue-600 text-white shadow-sm" 
                          : "bg-slate-50 border-slate-200 text-slate-655 hover:bg-slate-100"
                        }
                      `}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sort Harga Custom Premium */}
            <div className="flex items-center gap-2 w-full sm:w-auto relative">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap hidden md:inline">Urutkan Harga:</span>
              <div className="relative w-full sm:w-56">
                <button
                  type="button"
                  onClick={() => setShowSortDropdown(!showSortDropdown)}
                  className="w-full flex items-center justify-between px-4 py-2.5 text-xs font-extrabold bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-700 transition-all select-none cursor-pointer active:scale-98"
                >
                  <span className="flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
                    </svg>
                    {priceSort === "default" && "Default"}
                    {priceSort === "asc" && "Harga: Murah ke Mahal"}
                    {priceSort === "desc" && "Harga: Mahal ke Murah"}
                  </span>
                  <svg className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${showSortDropdown ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>

                {showSortDropdown && (
                  <>
                    {/* Backdrop to close dropdown */}
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setShowSortDropdown(false)}
                    />
                    <div className="absolute right-0 mt-2 w-full bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-3 duration-150 p-1">
                      {[
                        { id: "default", label: "Default (Rekomendasi)" },
                        { id: "asc", label: "Harga: Murah ke Mahal" },
                        { id: "desc", label: "Harga: Mahal ke Murah" }
                      ].map((opt) => {
                        const isAct = priceSort === opt.id;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => {
                              setPriceSort(opt.id);
                              setShowSortDropdown(false);
                            }}
                            className={`w-full text-left px-3.5 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-between
                              ${isAct 
                                ? "bg-blue-50 text-blue-650" 
                                : "text-slate-650 hover:bg-slate-50 hover:text-slate-800"
                              }
                            `}
                          >
                            {opt.label}
                            {isAct && (
                              <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                              </svg>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAndSortedPackages.map((pkg) => {
              const bestSellerIds = [
                "b3-3d2n-batam-1",
                "b3-3d2n-batam-bintan-2",
                "b3-3d2n-batam-bintan-3",
                "b4-3d2n-batam-5",
                "b4-3d2n-batam-6",
                "b4-3d2n-batam-bintan-8"
              ];
              const isBestSeller = bestSellerIds.includes(pkg.id);
              return (
                <div
                  key={pkg.id}
                  className={`group bg-white rounded-3xl overflow-hidden border transition-all duration-300 flex flex-col justify-between hover:shadow-xl hover:-translate-y-1
                    ${isBestSeller ? "border-amber-500 ring-2 ring-amber-500/10 shadow-md relative" : "border-slate-200 shadow-sm"}
                  `}
                >
                  {isBestSeller && (
                    <div className="absolute top-4 right-4 bg-amber-500 text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md z-20 border border-amber-600/30">
                      Best Seller
                    </div>
                  )}
                  
                  <div>
                    {/* Image Header */}
                    <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100">
                      <Image
                        src={pkg.image}
                        alt={pkg.nama}
                        fill
                        sizes="(max-w-768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      />
                      <div className="absolute bottom-4 left-4 bg-slate-900/70 backdrop-blur-md text-white text-[10px] font-extrabold px-3 py-1 rounded-lg">
                        {pkg.aturan_bonus.jumlah_pax_min 
                          ? `Promo: Beli ${pkg.aturan_bonus.jumlah_pax_min} Free ${pkg.aturan_bonus.free_pax}`
                          : `Promo: Beli 10 Free 1 (Kelipatan)`}
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex justify-between items-start gap-4 mb-4">
                        <h3 className="text-base font-extrabold text-[#1A365D] leading-snug">
                          {pkg.nama}
                        </h3>
                        <div className="text-right shrink-0">
                          <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Mulai dari</span>
                          <span className="text-lg font-black text-blue-600 whitespace-nowrap">RM {pkg.harga_rm}</span>
                          <span className="text-[10px] text-slate-500 block font-semibold">/ pax</span>
                        </div>
                      </div>

                      <div className="border-t border-slate-100 pt-4">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Fasilitas Termasuk:</span>
                        <ul className="space-y-2">
                          {pkg.deskripsi_fasilitas.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-650 leading-relaxed">
                              <svg className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                              </svg>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 pt-0">
                    <button
                      id={`btn-select-pkg-${pkg.id}`}
                      onClick={() => handleSelectPackage(pkg.id)}
                      className={`w-full inline-flex items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold transition-all cursor-pointer active:scale-95
                        ${isBestSeller 
                          ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/10" 
                          : "bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 hover:border-blue-200"
                        }
                      `}
                    >
                      Pilih & Hitung Harga
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Pricing Calculator Form Section */}
        <section id="booking-calculator" className="bg-slate-50 border-t border-b border-slate-200 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full">
                Kalkulator Harga Instan
              </span>
              <h2 className="mt-3 text-2xl sm:text-3xl font-black text-[#1A365D] tracking-tight">
                Hitung Estimasi & Booking
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                Masukkan nama Anda dan sesuaikan jumlah pax untuk menghitung total biaya serta melihat perolehan bonus free pax secara transparan.
              </p>
            </div>

            <BookingForm
              selectedPackageId={selectedPkgId}
              onPackageChange={(id) => setSelectedPkgId(id)}
            />
          </div>
        </section>

        {/* FAQ Accordion Section */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-[#1A365D] tracking-tight">
              Pertanyaan yang Sering Diajukan
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-500">
              Butuh informasi lebih lanjut? Simak beberapa jawaban atas pertanyaan seputar layanan tour kami.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm transition-all"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className="w-full flex items-center justify-between p-5 text-left font-bold text-xs sm:text-sm text-slate-800 hover:text-blue-600 transition-colors cursor-pointer select-none"
                  >
                    <span>{faq.q}</span>
                    <svg
                      className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2.5"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </button>
                  
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs text-slate-500 leading-relaxed border-t border-slate-50">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#0F172A] text-slate-400 border-t border-slate-800 py-12 text-center text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="mb-2">© {new Date().getFullYear()} Fajri Transport Batam. Hak Cipta Dilindungi.</p>
          <p className="text-[10px] text-slate-500">Penyedia Layanan Transportasi, Sewa Mobil & Paket Tour Terlengkap Batam & Bintan.</p>
        </div>
      </footer>

      {/* AI Customer / Assistant Bubble */}
      <div className="fixed bottom-6 left-6 z-50 pointer-events-none">
        {/* AI Prompt Bubble */}
        <div className="max-w-xs bg-white/95 backdrop-blur-md p-4 rounded-2xl rounded-bl-none border border-slate-200/85 shadow-xl pointer-events-auto flex flex-col gap-2 animate-imessage-pop animation-delay-300 transition-all duration-300">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-[10px] font-bold text-blue-900/60 uppercase tracking-widest">Fajri Ajis</span>
          </div>
          <p className="text-xs text-slate-750 leading-relaxed font-semibold italic">
            "Bonus lengkap: 10+ (1 Free), 20+ (2 Free), 30+ (3 Free), dst."
          </p>
        </div>
      </div>
    </div>
  );
}
