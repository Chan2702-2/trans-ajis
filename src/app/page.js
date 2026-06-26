"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { PACKAGES } from "@/constants/packages";
import BookingForm from "@/components/BookingForm";

export default function Home() {
  // Setup Intersection Observer for Scroll Reveal
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal-active");
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const elements = document.querySelectorAll(".reveal-on-scroll");
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  // State for Search Module
  const [searchDest, setSearchDest] = useState("");
  const [searchDate, setSearchDate] = useState("");

  // State for Booking Form
  const [selectedPackageId, setSelectedPackageId] = useState("");

  const getTodayDateString = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };
  const todayStr = getTodayDateString();

  // Custom Modern Calendar states
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth());
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());

  const monthNames = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni", 
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];
  const dayNames = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

  const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
  const firstDayIndex = new Date(calendarYear, calendarMonth, 1).getDay();

  const handlePrevMonth = () => {
    if (calendarMonth === 0) {
      setCalendarMonth(11);
      setCalendarYear((prev) => prev - 1);
    } else {
      setCalendarMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (calendarMonth === 11) {
      setCalendarMonth(0);
      setCalendarYear((prev) => prev + 1);
    } else {
      setCalendarMonth((prev) => prev + 1);
    }
  };

  const handleSelectDay = (day) => {
    const formattedDate = `${calendarYear}-${String(calendarMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSearchDate(formattedDate);
    setShowCalendar(false);
  };

  const isPastDate = (day) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dateToCheck = new Date(calendarYear, calendarMonth, day);
    return dateToCheck < today;
  };

  // Helper to format date for input display
  const getFormattedSearchDate = () => {
    if (!searchDate) return "Pilih Tanggal Keberangkatan";
    const parts = searchDate.split("-");
    const d = parseInt(parts[2]);
    const m = parseInt(parts[1]) - 1;
    const y = parts[0];
    return `${d} ${monthNames[m]} ${y}`;
  };

  const handleSelectPackage = (pkgId) => {
    setSelectedPackageId(pkgId);
    const formElement = document.getElementById("booking-section");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Helper to generate WA Link
  const handleWAFlow = (pkgName, details = "") => {
    const adminPhone = "6281266648244";
    const baseMessage = `Halo Admin Fajri Transport Batam, saya tertarik dengan paket: ${pkgName}.`;
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
                alt="Fajri Transport Batam Logo"
                fill
                className="object-cover"
              />
            </div>
            <span className="font-extrabold text-lg tracking-tight text-blue-900">
              Fajri Transport Batam
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
      <section 
        className="relative py-20 md:py-28 bg-cover bg-center border-b border-slate-200"
        style={{
          backgroundImage: "url('/beach_resort_bintan.jpg')"
        }}
      >
        {/* Dark overlay to ensure contrast and readability */}
        <div className="absolute inset-0 bg-slate-900/35 backdrop-blur-[2px]" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 md:p-10 shadow-2xl border border-slate-200/60">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left Column: Text & CTA */}
              <div className="lg:col-span-7 space-y-6 text-left">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-4 py-1.5 text-xs font-bold text-blue-700 border border-blue-100 shadow-sm">
                  ⚡ Partner Transportasi & Tour Resmi Batam
                </span>
                <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#1A365D] leading-tight">
                  Eksplorasi Keindahan Batam & Bintan Bersama Partner Terpercaya
                </h1>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl">
                  Penyedia layanan transportasi premium terlengkap dengan armada modern, hotel berbintang, dan pemandu lokal berlisensi.
                </p>
                <div className="flex flex-wrap gap-4 pt-2">
                  <a
                    href="#packages"
                    className="inline-flex items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-700 text-xs sm:text-sm font-bold text-white px-6 py-3 transition-all shadow-md active:scale-95"
                  >
                    Lihat Pilihan Paket
                  </a>
                  <a
                    href="#booking-section"
                    className="inline-flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs sm:text-sm font-bold text-slate-700 px-6 py-3 transition-all active:scale-95"
                  >
                    Kalkulator Harga
                  </a>
                </div>
              </div>

              {/* Right Column: Vehicle Card */}
              <div className="lg:col-span-5 w-full">
                <div className="rounded-2xl overflow-hidden border border-slate-200 bg-blue-50/40 p-2.5 shadow-md">
                  <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-slate-100">
                    <Image
                      src="/tour_van_batam.jpg"
                      alt="Armada Transportasi Modern"
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-2 font-medium text-center">Armada Toyota Hiace Commuter premium kami</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

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

              {/* Custom Modern Departure Date Picker */}
              <div className="flex flex-col relative">
                <label className="text-xs font-bold text-blue-900/60 uppercase tracking-wider mb-1.5 pl-1">
                  Tanggal Keberangkatan
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowCalendar(!showCalendar)}
                    className="w-full flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 pl-4 pr-10 py-3 text-sm font-semibold text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/25 transition-all text-left"
                  >
                    <span>{getFormattedSearchDate()}</span>
                    <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
                      <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                      </svg>
                    </div>
                  </button>

                  {/* Calendar Modal Popup */}
                  {showCalendar && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                      {/* Backdrop overlay */}
                      <div 
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
                        onClick={() => setShowCalendar(false)}
                      />
                      
                      {/* Modal Content */}
                      <div className="relative bg-white rounded-3xl border border-slate-200/90 shadow-2xl p-6 w-full max-w-sm select-none animate-in fade-in zoom-in-95 duration-200">
                        {/* Title & Close */}
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="text-sm font-extrabold text-[#1A365D]">Pilih Tanggal Keberangkatan</h4>
                          <button
                            type="button"
                            onClick={() => setShowCalendar(false)}
                            className="w-7 h-7 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>

                        {/* Calendar Header */}
                        <div className="flex justify-between items-center mb-4 bg-slate-50 rounded-xl p-2">
                          <button
                            type="button"
                            onClick={handlePrevMonth}
                            className="w-8 h-8 rounded-lg hover:bg-white flex items-center justify-center text-slate-600 shadow-sm border border-slate-100 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                            </svg>
                          </button>
                          <span className="text-sm font-bold text-blue-900">
                            {monthNames[calendarMonth]} {calendarYear}
                          </span>
                          <button
                            type="button"
                            onClick={handleNextMonth}
                            className="w-8 h-8 rounded-lg hover:bg-white flex items-center justify-center text-slate-600 shadow-sm border border-slate-100 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                            </svg>
                          </button>
                        </div>

                        {/* Calendar Weekdays */}
                        <div className="grid grid-cols-7 gap-1.5 text-center mb-2">
                          {dayNames.map((day) => (
                            <span key={day} className="text-[10px] font-bold text-slate-400 uppercase">
                              {day}
                            </span>
                          ))}
                        </div>

                        {/* Calendar Days Grid */}
                        <div className="grid grid-cols-7 gap-1.5 justify-items-center">
                          {/* Day padding */}
                          {Array.from({ length: firstDayIndex }).map((_, i) => (
                            <div key={`pad-${i}`} className="w-8 h-8" />
                          ))}
                          
                          {/* Days numbers */}
                          {Array.from({ length: daysInMonth }).map((_, i) => {
                            const day = i + 1;
                            const past = isPastDate(day);
                            const formattedToCheck = `${calendarYear}-${String(calendarMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                            const isSelected = searchDate === formattedToCheck;
                            
                            return (
                              <button
                                key={`day-${day}`}
                                type="button"
                                disabled={past}
                                onClick={() => handleSelectDay(day)}
                                className={`
                                  h-8 w-8 text-xs font-semibold rounded-lg flex items-center justify-center transition-all
                                  ${past 
                                    ? "text-slate-200 cursor-not-allowed" 
                                    : isSelected
                                      ? "bg-blue-600 text-white font-bold shadow-md transform scale-110"
                                      : "text-slate-700 hover:bg-slate-100 hover:scale-105"
                                  }
                                `}
                              >
                                {day}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
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
            <div className="group bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-sm flex flex-col justify-between hover:shadow-lg transition-all duration-300 reveal-on-scroll">
              <div>
                <div className="relative aspect-[16/7] w-full bg-slate-100 overflow-hidden">
                  <Image
                    src="/beach_resort_bintan.jpg"
                    alt="Batam & Bintan Resort"
                    fill
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm z-10">
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
                        <li key={idx} className="flex items-start gap-2 text-xs text-slate-605">
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
            <div className="group bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-sm flex flex-col justify-between hover:shadow-lg transition-all duration-300 reveal-on-scroll reveal-delay-100">
              <div>
                <div className="relative aspect-[16/7] w-full bg-slate-100 overflow-hidden">
                  <Image
                    src="/batam_temple_landmark.jpg"
                    alt="Batam Temple Landmark"
                    fill
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm z-10">
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
            <div className="group bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-sm flex flex-col justify-between hover:shadow-lg transition-all duration-300 reveal-on-scroll reveal-delay-200">
              <div>
                <div className="relative aspect-[16/7] w-full bg-slate-100 overflow-hidden">
                  <Image
                    src="/batam_city_mall.jpg"
                    alt="Batam Shopping Mall"
                    fill
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm z-10">
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 reveal-on-scroll">
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
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-start gap-4 reveal-on-scroll">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25" />
                </svg>
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-800 mb-1">Armada Nyaman & Baru</h4>
                <p className="text-xs text-slate-500 leading-relaxed">Semua armada tour menggunakan model terbaru yang bersih, terawat, dan ber-AC dingin.</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-start gap-4 reveal-on-scroll reveal-delay-100">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                </svg>
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-800 mb-1">Guide Lokal Berlisensi</h4>
                <p className="text-xs text-slate-500 leading-relaxed">Didampingi pemandu wisata lokal ramah yang mengerti sejarah, spot foto terbaik, dan kuliner khas.</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-start gap-4 reveal-on-scroll reveal-delay-200">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63" />
                </svg>
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-800 mb-1">Koordinasi Mulus</h4>
                <p className="text-xs text-slate-500 leading-relaxed">Admin responsif yang siap mengatur tiket ferry PP dan hotel untuk Anda tanpa repot.</p>
              </div>
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
          </div>          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 max-w-6xl mx-auto">
            {/* Info Cards Column (spans 3 columns to make map smaller) */}
            <div className="lg:col-span-3 flex flex-col gap-6">
              {/* WhatsApp */}
              <a 
                href="https://wa.me/6281266648244" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-6 rounded-2xl bg-white shadow-sm border border-slate-200 hover:shadow-md hover:border-blue-500/50 transition-all group flex items-start gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-emerald-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.725 1.451 5.405.002 9.801-4.394 9.803-9.805.001-2.621-1.022-5.086-2.88-6.944C16.438 1.996 13.975 1.02 11.35 1.02c-5.41 0-9.808 4.397-9.81 9.811-.001 1.642.434 3.243 1.258 4.654l-.994 3.634 3.72-.976" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800 mb-1">WhatsApp</h3>
                  <p className="text-xs text-slate-500 mb-2">+62 812-6664-8244</p>
                  <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                    Chat Sekarang
                    <svg className="w-3 h-3 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </span>
                </div>
              </a>

              {/* Email */}
              <a 
                href="mailto:info@fajritransportbatam.com" 
                className="p-6 rounded-2xl bg-white shadow-sm border border-slate-200 hover:shadow-md hover:border-blue-500/50 transition-all group flex items-start gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800 mb-1">Email</h3>
                  <p className="text-xs text-slate-500 mb-2">info@fajritransportbatam.com</p>
                  <span className="text-[11px] font-semibold text-blue-600 flex items-center gap-1">
                    Kirim Email
                    <svg className="w-3 h-3 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </span>
                </div>
              </a>

              {/* Lokasi / Alamat */}
              <div className="p-6 rounded-2xl bg-white shadow-sm border border-slate-200 flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6 text-rose-600" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25s-7.5-4.108-7.5-11.25C19.5 6.358 16.142 3 12 3c-4.142 0-7.5 3.358-7.5 7.5 0 7.142 7.5 11.25 7.5 11.25s7.5-4.108 7.5-11.25z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800 mb-1">Lokasi Utama</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Bengkong indah bawah blok e no 2 gang flamboyan, Batam, Kepulauan Riau, Indonesia
                  </p>
                </div>
              </div>
            </div>

            {/* Google Map Embed (spans 2 columns to be smaller, with fixed height) */}
            <div className="lg:col-span-2 w-full h-[280px] lg:h-[350px] rounded-2xl overflow-hidden shadow-sm border border-slate-200 relative bg-white">
              <iframe
                title="Lokasi Fajri Transport Batam"
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
                alt="Fajri Transport Batam Logo"
                fill
                className="object-cover"
              />
            </div>
            <span className="font-bold text-base tracking-tight">Fajri Transport Batam & Tour</span>
          </div>
          <p className="text-xs max-w-md mx-auto text-slate-500">
            Penyedia layanan transportasi, sewa mobil, dan paket tour terlengkap di Batam & Bintan dengan pelayanan bintang 5.
          </p>
          <div className="text-[10px] text-slate-600">
            © {new Date().getFullYear()} Fajri Transport Batam. Hak Cipta Dilindungi Undang-Undang.
          </div>
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
            "Ubah Paket 3 untuk menampilkan group bonus lengkap: 10+ (1 Free), 20+ (2 Free), 30+ (3 Free), dst."
          </p>
        </div>
      </div>

    </div>
  );
}
