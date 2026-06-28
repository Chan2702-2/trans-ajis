"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { PACKAGES } from "@/constants/packages";
import BookingForm from "@/components/BookingForm";

export default function PaketTourPage() {
  const [selectedPkgId, setSelectedPkgId] = useState("");
  const [activeFaq, setActiveFaq] = useState(null);

  const handleSelectPackage = (pkgId) => {
    setSelectedPkgId(pkgId);
    const formSection = document.getElementById("booking-calculator");
    if (formSection) {
      formSection.scrollIntoView({ behavior: "smooth" });
    }
  };

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

          <button
            onClick={() => handleSelectPackage("")}
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 hover:bg-blue-700 text-sm font-bold text-white px-5 py-2.5 transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            Pesan Sekarang
          </button>
        </div>
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
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-[#1A365D] tracking-tight">
              Pilih Paket Unggulan Anda
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
              Silakan pilih salah satu paket di bawah untuk mengaktifkan kalkulator instan dan formulir pemesanan otomatis.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {PACKAGES.map((pkg) => {
              const isBestSeller = pkg.id === "batam-bintan-3d2n";
              return (
                <div
                  key={pkg.id}
                  className={`group bg-white rounded-3xl overflow-hidden border transition-all duration-300 flex flex-col justify-between hover:shadow-xl hover:-translate-y-1
                    ${isBestSeller ? "border-blue-500 ring-2 ring-blue-500/20 shadow-md relative" : "border-slate-200 shadow-sm"}
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
    </div>
  );
}
