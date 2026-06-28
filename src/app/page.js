"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { PACKAGES } from "@/constants/packages";
import { BLOG_ARTICLES } from "@/constants/articles";
import BookingForm from "@/components/BookingForm";
import { supabase } from "@/supabaseClient";

export default function Home() {
  // State for Search Module
  const [searchDest, setSearchDest] = useState("");
  const [showDestModal, setShowDestModal] = useState(false);
  const [searchDate, setSearchDate] = useState("");
  const [showSearchUserModal, setShowSearchUserModal] = useState(false);
  const [searchUserTitle, setSearchUserTitle] = useState("Mr.");
  const [searchUserName, setSearchUserName] = useState("");
  const [searchError, setSearchError] = useState("");
  const [toastType, setToastType] = useState("error"); // "error" | "success"

  // State for Booking Form
  const [selectedPackageId, setSelectedPackageId] = useState("");
  const [activeArticle, setActiveArticle] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // State for Reviews Section
  const [reviews, setReviews] = useState([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [newReviewName, setNewReviewName] = useState("");
  const [newReviewTitle, setNewReviewTitle] = useState("Mr.");
  const [newReviewComment, setNewReviewComment] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewPhoto, setNewReviewPhoto] = useState("");
  const [newReviewPhotoBlob, setNewReviewPhotoBlob] = useState(null);
  const [activeToken, setActiveToken] = useState(null);

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

  // Effect to handle Magic Review Link validation with Supabase

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("reviewToken");
    if (token) {
      const name = urlParams.get("name");
      const title = urlParams.get("title");
      const pkg = urlParams.get("package");

      if (name) setNewReviewName(name);
      if (title) setNewReviewTitle(title);
      if (pkg) setNewReviewPkg(pkg);

      validateAndOpenReviewModal(token);
    }
  }, []);

  const validateAndOpenReviewModal = async (token) => {
    try {
      const { data, error } = await supabase
        .from("magic_links")
        .select("*")
        .eq("token", token)
        .single();

      if (error || !data) {
        setSearchError("Link ulasan tidak valid atau rusak.");
        window.history.replaceState({}, document.title, window.location.pathname);
        return;
      }

      if (data.used) {
        setSearchError("Link ulasan ini sudah digunakan untuk menulis ulasan.");
        window.history.replaceState({}, document.title, window.location.pathname);
        return;
      }

      const expiryTime = new Date(data.expires_at).getTime();
      if (Date.now() > expiryTime) {
        setSearchError("Link ulasan kedaluwarsa! Link ini hanya aktif selama 30 menit.");
        window.history.replaceState({}, document.title, window.location.pathname);
        return;
      }

      // If valid, save active token state & show modal
      setActiveToken(token);
      setShowReviewModal(true);
      window.history.replaceState({}, document.title, window.location.pathname);

      // Timeout auto close when token expires
      const timeLeft = expiryTime - Date.now();
      const timer = setTimeout(() => {
        setShowReviewModal(false);
        setSearchError("Sesi ulasan berakhir! Link ulasan Anda telah kedaluwarsa.");
        setActiveToken(null);
      }, timeLeft);
      return () => clearTimeout(timer);
    } catch (err) {
      console.error(err);
      setSearchError("Terjadi kesalahan memvalidasi link ulasan.");
    }
  };
  const [newReviewPkg, setNewReviewPkg] = useState("Batam & Bintan 3D2N");
  const [photoUploading, setPhotoUploading] = useState(false);
  const [showLinkGeneratorModal, setShowLinkGeneratorModal] = useState(false);
  const [generatedLink, setGeneratedLink] = useState("");

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
    const baseMessage = `Hy, Fajri.\n\nSaya tertarik dengan paket: ${pkgName}.`;
    const finalMessage = details ? `${baseMessage}\n\nDetail: ${details}` : baseMessage;
    const encoded = encodeURIComponent(finalMessage);
    window.open(`https://wa.me/${adminPhone}?text=${encoded}`, "_blank");
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchDest) {
      setSearchError("Silakan pilih destinasi terlebih dahulu.");
      return;
    }
    setShowSearchUserModal(true);
  };

  const handleConfirmSearchBooking = (e) => {
    e.preventDefault();
    if (!searchUserName.trim()) {
      setSearchError("Silakan isi nama Anda terlebih dahulu.");
      return;
    }
    const details = `Pemesan: ${searchUserTitle} ${searchUserName}\nDestinasi tujuan: ${searchDest}${searchDate ? `, Rencana Tanggal: ${searchDate}` : ""}`;
    handleWAFlow("Pencarian Rute / Jadwal", details);
    setShowSearchUserModal(false);
  };



  useEffect(() => {
    async function fetchHomepageReviews() {
      try {
        const { data, error } = await supabase
          .from("reviews")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;

        if (data && data.length > 0) {
          const formatted = data.map((item) => ({
            id: item.id,
            name: item.name,
            rating: item.rating,
            comment: item.comment,
            photo: item.photo || "",
            package: item.package || "",
            date: new Date(item.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
          }));
          setReviews(formatted);
        } else {
          setReviews([]);
        }
      } catch (err) {
        console.error("Gagal load reviews di homepage:", err);
        setReviews([]);
      }
    }
    fetchHomepageReviews();
  }, []);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPhotoUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 1000;
        const MAX_HEIGHT = 1000;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        // Generate base64 preview as webp
        const previewBase64 = canvas.toDataURL("image/webp", 0.8);
        setNewReviewPhoto(previewBase64);

        // Generate blob for uploading as webp
        canvas.toBlob((blob) => {
          setNewReviewPhotoBlob(blob);
          setPhotoUploading(false);
        }, "image/webp", 0.8);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newReviewName.trim() || !newReviewComment.trim()) {
      setSearchError("Silakan isi nama dan ulasan Anda.");
      return;
    }

    const payloadName = `${newReviewTitle} ${newReviewName}`;

    try {
      setPhotoUploading(true);
      let photoUrl = null;

      if (newReviewPhotoBlob) {
        const fileExt = "webp";
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("reviews")
          .upload(fileName, newReviewPhotoBlob, {
            contentType: "image/webp",
            cacheControl: "3600",
            upsert: false
          });

        if (uploadError) {
          throw new Error("Gagal mengunggah foto ke storage: " + uploadError.message);
        }

        const { data: publicUrlData } = supabase.storage
          .from("reviews")
          .getPublicUrl(fileName);
        
        photoUrl = publicUrlData.publicUrl;
      }

      // 1. Simpan ulasan ke tabel reviews di Supabase
      const { data: insertedData, error: insertError } = await supabase
        .from("reviews")
        .insert([
          {
            name: payloadName,
            rating: newReviewRating,
            comment: newReviewComment,
            photo: photoUrl,
            package: newReviewPkg || null
          }
        ])
        .select();

      if (insertError) throw insertError;

      // 2. Tandai token ulasan aktif sebagai used (sudah terpakai) di Supabase jika ada token aktif
      if (activeToken) {
        const { error: tokenError } = await supabase
          .from("magic_links")
          .update({ used: true })
          .eq("token", activeToken);

        if (tokenError) console.error("Gagal menonaktifkan token:", tokenError);
      }

      // 3. Update reviews state lokal agar langsung muncul di beranda
      if (insertedData && insertedData[0]) {
        const item = insertedData[0];
        const newRev = {
          id: item.id,
          name: item.name,
          rating: item.rating,
          comment: item.comment,
          photo: item.photo || "",
          package: item.package || "",
          date: new Date(item.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
        };
        setReviews((prev) => [newRev, ...prev]);
      }

      // Reset Form
      setNewReviewName("");
      setNewReviewTitle("Mr.");
      setNewReviewComment("");
      setNewReviewRating(5);
      setNewReviewPhoto("");
      setNewReviewPhotoBlob(null);
      setNewReviewPkg("Batam & Bintan 3D2N");
      setShowReviewModal(false);
      setActiveToken(null);

      setToastType("success");
      setSearchError("Ulasan Anda berhasil disimpan. Terima kasih!");
      setTimeout(() => setSearchError(""), 4000);
    } catch (err) {
      console.error("Gagal mengirim ulasan:", err);
      setToastType("error");
      setSearchError(err.message || "Gagal mengirim ulasan ke database. Silakan coba kembali.");
    } finally {
      setPhotoUploading(false);
    }
  };

  const handleGenerateMagicLink = () => {
    const expiresAt = Date.now() + 30 * 60 * 1000;
    const token = btoa(expiresAt.toString());
    const origin = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
    const path = typeof window !== "undefined" ? window.location.pathname : "/";
    const link = `${origin}${path}?reviewToken=${token}`;
    setGeneratedLink(link);
  };

  const handleCopyLink = () => {
    if (!generatedLink) return;
    navigator.clipboard.writeText(generatedLink);
    setToastType("success");
    setSearchError("Link berhasil disalin ke clipboard!");
    setTimeout(() => setSearchError(""), 3000);
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
                src="/asset/img/logo-1.png"
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
            <Link href="/paket-tour" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">Paket Tour</Link>
            <a href="#benefits" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">Keunggulan</a>
            <a href="#booking-section" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">Booking</a>
            <Link href="/blog" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">Blog</Link>
            <a href="#contact" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">Kontak</a>
          </nav>

          <div className="flex items-center gap-3">
            {/* Hamburger Button (Hanya tampil di mobile, di sebelah kiri Book Now) */}
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
              onClick={() => {
                const bookingSec = document.getElementById("booking-section");
                if (bookingSec) {
                  bookingSec.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 hover:bg-blue-700 text-sm font-bold text-white px-5 py-2.5 transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              Book Now
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer / Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white shadow-lg animate-mobile-menu">
            <div className="px-4 py-3 space-y-1">
              <Link
                href="/paket-tour"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2.5 px-3 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 active:bg-blue-50/50 hover:text-blue-650 transition-all"
              >
                Paket Tour
              </Link>
              <a
                href="#benefits"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2.5 px-3 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 active:bg-blue-50/50 hover:text-blue-650 transition-all"
              >
                Keunggulan
              </a>
              <a
                href="#booking-section"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2.5 px-3 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 active:bg-blue-50/50 hover:text-blue-650 transition-all"
              >
                Booking
              </a>
              <Link
                href="/blog"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2.5 px-3 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 active:bg-blue-50/50 hover:text-blue-650 transition-all"
              >
                Blog
              </Link>
              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2.5 px-3 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 active:bg-blue-50/50 hover:text-blue-650 transition-all"
              >
                Kontak
              </a>
            </div>
          </div>
        )}
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
                  Partner Transportasi & Tour Resmi Batam
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
            className="bg-white rounded-2xl p-3 md:p-4 shadow-lg border border-slate-200/80 grid grid-cols-12 gap-2 md:gap-4 items-end"
          >
            {/* Destination */}
            <div className="col-span-5 flex flex-col">
              <label htmlFor="dest-select" className="text-[10px] md:text-xs font-bold text-blue-900/60 uppercase tracking-wider mb-1 pl-1">
                Pilih Destinasi
              </label>
              <button
                type="button"
                onClick={() => setShowDestModal(true)}
                className="w-full flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-2 md:px-4 py-2.5 md:py-3.5 text-xs md:text-sm font-semibold text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/25 transition-all text-left"
              >
                <span className={`truncate ${searchDest ? "text-slate-800" : "text-slate-450 font-medium"}`}>
                  {searchDest ? searchDest : "Ke mana?"}
                </span>
                <svg className="w-3.5 h-3.5 md:w-4 md:h-4 text-slate-400 shrink-0 ml-1" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </button>

              {/* Destination Selector Modal */}
              {showDestModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                  {/* Backdrop */}
                  <div 
                    className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
                    onClick={() => setShowDestModal(false)}
                  />

                  {/* Modal Container */}
                  <div className="relative bg-white rounded-3xl border border-slate-200/90 shadow-2xl p-6 w-full max-w-md select-none animate-in fade-in zoom-in-95 duration-200">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-5">
                      <h4 className="text-sm font-extrabold text-[#1A365D]">Pilih Destinasi Wisata</h4>
                      <button
                        type="button"
                        onClick={() => setShowDestModal(false)}
                        className="w-7 h-7 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    {/* Options List */}
                    <div className="space-y-3">
                      {[
                        { value: "Batam & Bintan 3D2N", label: "Batam & Bintan 3D2N", desc: "Best Seller - Wisata pantai & kolam renang terbesar" },
                        { value: "Batam 2D1N", label: "Batam 2D1N City Tour", desc: "Relaxing - Keliling landmark & belanja seru" },
                        { value: "Batam 3D2N (Essential)", label: "Batam 3D2N (Essential)", desc: "Essential - Paket lengkap durasi sedang" },
                        { value: "Custom Route / Sewa Mobil Only", label: "Sewa Mobil / Custom Route", desc: "Rental armada premium dengan sopir berpengalaman" },
                      ].map((opt) => {
                        const isSelected = searchDest === opt.value;
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => {
                              setSearchDest(opt.value);
                              setShowDestModal(false);
                            }}
                            className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between group cursor-pointer
                              ${isSelected
                                ? "border-blue-600 bg-blue-50/30"
                                : "border-slate-200 hover:border-blue-400 hover:bg-slate-50/50"
                              }
                            `}
                          >
                            <div>
                              <span className={`block text-xs font-bold transition-colors
                                ${isSelected ? "text-blue-600" : "text-[#1A365D] group-hover:text-blue-600"}
                              `}>
                                {opt.label}
                              </span>
                              <span className="block text-[10px] text-slate-400 mt-1 font-medium">
                                {opt.desc}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Custom Modern Departure Date Picker */}
            <div className="col-span-4 flex flex-col relative">
              <label className="text-[10px] md:text-xs font-bold text-blue-900/60 uppercase tracking-wider mb-1 pl-1">
                Tanggal Keberangkatan
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowCalendar(!showCalendar)}
                  className="w-full flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 pl-2 pr-8 md:pl-4 md:pr-10 py-2.5 md:py-3 text-xs md:text-sm font-semibold text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/25 transition-all text-left"
                >
                  <span className="truncate">{searchDate ? getFormattedSearchDate() : "Pilih Tanggal"}</span>
                  <div className="absolute inset-y-0 right-0 pr-2 md:pr-3.5 flex items-center pointer-events-none">
                    <svg className="w-3.5 h-3.5 md:w-4 md:h-4 text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
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
                          type="button;;"
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

            {/* Submit Button */}
            <div className="col-span-3">
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-700 text-xs md:text-sm font-bold text-white py-2.5 md:py-3.5 transition-all shadow-md hover:shadow-lg active:scale-95 whitespace-nowrap"
              >
                <span className="hidden md:inline">Cari Jadwal</span>
                <span className="md:hidden">Cari</span>
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {(() => {
              // 6 Paket spesifik yang diminta:
              // Bintang 3:
              // 1. 3D2N Batam (Bintang 3 Paket A) -> id: "b3-3d2n-batam-1"
              // 2. 3D2N Batam & Bintan (Bintang 3 - Tanpa Makan) -> id: "b3-3d2n-batam-bintan-2"
              // 3. 3D2N Batam & Bintan (Bintang 3 - Stander) -> id: "b3-3d2n-batam-bintan-3"
              // Bintang 4:
              // 4. 3D2N Batam (Bintang 4 Standart) -> id: "b4-3d2n-batam-5"
              // 5. 3D2N Batam (Bintang 4 - Lengkap) -> id: "b4-3d2n-batam-6"
              // 6. 3D2N Batam - Bintan (Bintang 3 - Standart) -> id: "b3-3d2n-batam-bintan-3" atau "b4-3d2n-batam-bintan-8" (b4 standard)
              // User minta: "3. 3d2n batam - bintan (bintang 3 - standart)" untuk bintang 4 (b3-3d2n-batam-bintan-3) atau b4-3d2n-batam-bintan-8.
              // Kami pilih b4-3d2n-batam-bintan-8 sebagai item bintang 4 ke-3 agar seimbang (3 paket Bintang 3 dan 3 paket Bintang 4).
              const selectedIds = [
                "b3-3d2n-batam-1",
                "b3-3d2n-batam-bintan-2",
                "b3-3d2n-batam-bintan-3",
                "b4-3d2n-batam-5",
                "b4-3d2n-batam-6",
                "b4-3d2n-batam-bintan-8"
              ];
              
              const homePackages = PACKAGES.filter(p => selectedIds.includes(p.id));

              return homePackages.map((pkg) => {
                const isBestSeller = selectedIds.includes(pkg.id);
                return (
                  <div key={pkg.id} className={`group bg-white rounded-2xl overflow-hidden border transition-all duration-300 flex flex-col justify-between hover:shadow-lg
                    ${isBestSeller ? "border-amber-500 ring-2 ring-amber-500/10 shadow-md relative" : "border-slate-200/90 shadow-sm"}
                  `}>
                    <div>
                      <div className="relative aspect-[16/9] w-full bg-slate-100 overflow-hidden">
                        <Image
                          src={pkg.image}
                          alt={pkg.nama}
                          fill
                          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                        />
                        <div className="absolute top-4 left-4 bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-sm z-10">
                          Hotel ⭐{pkg.bintang === 3 ? "⭐⭐" : "⭐⭐⭐"}
                        </div>
                        {isBestSeller && (
                          <div className="absolute top-4 right-4 bg-amber-500 text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md z-15">
                            Best Seller
                          </div>
                        )}
                      </div>

                      <div className="p-6">
                        <div className="flex justify-between items-start gap-4 mb-4">
                          <h3 className="text-sm font-extrabold text-[#1A365D] leading-snug">
                            {pkg.nama}
                          </h3>
                          <div className="text-right shrink-0">
                            <span className="text-[10px] text-slate-500 block">Mulai dari</span>
                            <span className="text-lg font-black text-blue-600">RM {pkg.harga_rm}</span>
                            <span className="text-[10px] text-slate-500"> / pax</span>
                          </div>
                        </div>

                        <div className="border-t border-slate-100 pt-4">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Fasilitas Termasuk:</p>
                          <ul className="grid grid-cols-1 gap-y-1.5">
                            {pkg.deskripsi_fasilitas.slice(0, 5).map((item, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                                <svg className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                </svg>
                                <span className="truncate">{item}</span>
                              </li>
                            ))}
                            {pkg.deskripsi_fasilitas.length > 5 && (
                              <li className="text-[10px] text-blue-500 font-semibold pl-6">
                                + {pkg.deskripsi_fasilitas.length - 5} fasilitas lainnya
                              </li>
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 pt-0 border-t border-slate-50 flex justify-between items-center bg-slate-50/50">
                      <span className="text-[10px] text-slate-400 font-bold">Beli 10 Free 1</span>
                      <button
                        onClick={() => handleSelectPackage(pkg.id)}
                        className="w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-md transition-all active:scale-95 cursor-pointer"
                        title="Pesan Paket Ini"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                      </button>
                    </div>
                  </div>
                );
              });
            })()}
          </div>

          {/* Button Lihat Semua Paket */}
          <div className="mt-12 text-center reveal-on-scroll">
            <Link
              href="/paket-tour"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-sm font-bold text-white px-8 py-4 transition-all shadow-md active:scale-95 hover:shadow-lg"
            >
              Lihat Semua Paket
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
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
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                </svg>
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-800 mb-1">Koordinasi Mulus</h4>
                <p className="text-xs text-slate-500 leading-relaxed">Admin responsif yang siap mengatur tiket ferry PP dan hotel untuk Anda tanpa repot.</p>
              </div>
            </div>
          </div>
        </div>
      </section>      {/* Blog/SEO Section */}
      <section id="blog" className="py-20 border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-[#1A365D] tracking-tight">
              Artikel & Tips Perjalanan Batam
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
              Temukan rekomendasi destinasi wisata terbaik, tips sewa mobil hemat, dan panduan liburan seru di Batam & Bintan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {BLOG_ARTICLES.map((article, idx) => (
              <article 
                key={article.id}
                className={`group bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-sm flex flex-col justify-between hover:shadow-lg transition-all duration-300 reveal-on-scroll ${
                  idx % 3 === 1 ? 'reveal-delay-100' : idx % 3 === 2 ? 'reveal-delay-200' : ''
                }`}
              >
                <div>
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100">
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md z-10">
                      {article.category}
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-3 text-slate-400 text-[10px] font-medium mb-3">
                      <span>{article.date}</span>
                      <span>•</span>
                      <span>{article.readingTime}</span>
                    </div>
                    <h3 className="text-base font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {article.summary}
                    </p>
                  </div>
                </div>
                <div className="p-6 pt-0">
                  <button 
                    onClick={() => setActiveArticle(article)}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    Baca Selengkapnya
                    <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </button>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/blog"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs sm:text-sm font-bold text-white px-6 py-3.5 transition-all shadow-md active:scale-95 cursor-pointer animate-in fade-in slide-in-from-bottom-2 duration-300"
            >
              Lihat Semua Artikel
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className="py-20 border-t border-slate-200 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4 text-center md:text-left">
            <div>
              <h2 className="text-3xl font-extrabold text-[#1A365D] tracking-tight">
                Ulasan Pelanggan
              </h2>
              <p className="mt-2 text-sm text-slate-650 max-w-xl">
                Apa kata mereka yang telah merasakan pelayanan terbaik kami di Batam & Bintan.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 justify-center md:justify-end">
              <Link
                href="/ulasan"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1A365D] hover:bg-[#2C5282] text-xs sm:text-sm font-bold text-white px-5 py-3 transition-all shadow-md active:scale-95 cursor-pointer"
              >
                Lihat Semua Ulasan
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0" />
                </svg>
              </Link>
            </div>
          </div>

          {reviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {reviews.slice(0, 5).map((rev) => (
                <div 
                  key={rev.id} 
                  className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-300 animate-in fade-in slide-in-from-bottom-3 duration-500"
                >
                  <div>
                    <div className="flex items-center gap-3.5 mb-4">
                      <div className="relative w-11 h-11 rounded-full overflow-hidden border border-slate-200 shrink-0 bg-slate-50 flex items-center justify-center">
                        {rev.photo ? (
                          <Image
                            src={rev.photo}
                            alt={rev.name}
                            fill
                            sizes="44px"
                            className="object-cover"
                          />
                        ) : (
                          <span className="text-xs font-bold text-slate-400">FA</span>
                        )}
                      </div>
                      <div>
                        <h4 className="text-sm font-extrabold text-[#1A365D]">{rev.name}</h4>
                        <span className="text-[10px] text-slate-400 font-semibold">{rev.date}</span>
                      </div>
                    </div>

                    {/* Stars */}
                    <div className="flex gap-0.5 text-amber-400 mb-2.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${i < rev.rating ? "fill-current" : "stroke-current text-slate-300"}`}
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      ))}
                    </div>

                    {/* Selected Package Badge */}
                    {rev.package && (
                      <div className="mb-3">
                        <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 border border-blue-100/50">
                          Paket: {rev.package}
                        </span>
                      </div>
                    )}

                    <p className="text-xs md:text-sm text-slate-650 leading-relaxed italic">
                      "{rev.comment}"
                    </p>

                    {rev.photo && (
                      <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden mt-4 border border-slate-200/60 bg-slate-50 shrink-0 shadow-sm">
                        <Image
                          src={rev.photo}
                          alt="Foto Ulasan Pelanggan"
                          fill
                          sizes="(max-width: 768px) 100vw, 350px"
                          className="object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white border border-slate-200 rounded-3xl max-w-xl mx-auto shadow-sm animate-in fade-in duration-500">
              <svg className="w-12 h-12 text-slate-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <h3 className="text-sm font-extrabold text-[#1A365D] mb-1">Belum ada ulasan</h3>
              <p className="text-xs text-slate-500 px-6 leading-relaxed max-w-md mx-auto">
                Feedback asli dari pelanggan setia kami akan muncul di sini secara otomatis setelah pelanggan mengisi formulir ulasan.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setShowReviewModal(false)}
          />

          <form 
            onSubmit={handleReviewSubmit}
            className="relative bg-white rounded-3xl border border-slate-200/90 shadow-2xl p-6 w-full max-w-md select-none animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-5">
              <h4 className="text-sm font-extrabold text-[#1A365D]">Tulis Ulasan Anda</h4>
              <button
                type="button"
                onClick={() => setShowReviewModal(false)}
                className="w-7 h-7 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              {/* Sapaan & Nama */}
              <div className="grid grid-cols-12 gap-3">
                <div className="col-span-4">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Sapaan
                  </label>
                  <div className="flex rounded-xl border border-slate-200 p-1 bg-slate-50 gap-1 h-[42px] items-center">
                    {["Mr.", "Mrs.", "Ms."].map((t) => {
                      const isActive = newReviewTitle === t;
                      return (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setNewReviewTitle(t)}
                          className={`flex-1 text-center py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer select-none
                            ${isActive 
                              ? "bg-blue-600 text-white shadow-sm" 
                              : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                            }
                          `}
                        >
                          {t.replace(".", "")}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="col-span-8">
                  <label htmlFor="rev-name-input" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Nama Lengkap
                  </label>
                  <input
                    id="rev-name-input"
                    type="text"
                    value={newReviewName}
                    onChange={(e) => setNewReviewName(e.target.value)}
                    placeholder="Nama Anda"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/25 transition-all"
                    required
                  />
                </div>
              </div>

              {/* Rating */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Rating Bintang
                </label>
                <div className="flex gap-1.5 text-slate-300">
                  {[1, 2, 3, 4, 5].map((val) => {
                    const isFilled = val <= newReviewRating;
                    return (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setNewReviewRating(val)}
                        className={`w-7 h-7 transition-all cursor-pointer ${isFilled ? "text-amber-400" : "text-slate-300 hover:text-amber-300"}`}
                      >
                        <svg className="w-full h-full fill-current" viewBox="0 0 24 24">
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Tour Package Selection */}
              <div>
                <label htmlFor="rev-pkg-select" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Pilih Paket Tour
                </label>
                <select
                  id="rev-pkg-select"
                  value={newReviewPkg}
                  onChange={(e) => setNewReviewPkg(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/25 transition-all cursor-pointer"
                  required
                >
                  <option value="Batam & Bintan 3D2N">Batam & Bintan 3D2N (Best Seller)</option>
                  <option value="Batam 2D1N">Batam 2D1N City Tour</option>
                  <option value="Batam 3D2N (Essential)">Batam 3D2N (Essential)</option>
                  <option value="Custom Route / Sewa Mobil Only">Sewa Mobil / Custom Route</option>
                </select>
              </div>

              {/* Comment */}
              <div>
                <label htmlFor="rev-comment-input" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Ulasan / Testimoni
                </label>
                <textarea
                  id="rev-comment-input"
                  value={newReviewComment}
                  onChange={(e) => setNewReviewComment(e.target.value)}
                  placeholder="Tulis ulasan perjalanan Anda..."
                  rows="3"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/25 transition-all"
                  required
                />
              </div>

              {/* Photo Upload */}
              <div>
                <label htmlFor="rev-photo-input" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Foto Profil (Optional)
                </label>
                <div className="flex items-center gap-4">
                  <input
                    id="rev-photo-input"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="rev-photo-input"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-bold text-slate-700 px-4 py-2.5 transition-all cursor-pointer active:scale-95"
                  >
                    Pilih Foto
                  </label>
                  {photoUploading && (
                    <span className="text-[10px] text-blue-600 font-bold animate-pulse">Mengompres foto...</span>
                  )}
                  {newReviewPhoto && !photoUploading && (
                    <div className="relative w-10 h-10 rounded-full overflow-hidden border border-slate-200">
                      <Image
                        src={newReviewPhoto}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>
                <p className="text-[9px] text-slate-400 font-medium mt-1">Foto akan dioptimalkan otomatis agar berukuran kecil (~100kb - 200kb).</p>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={photoUploading}
                className="w-full inline-flex items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-700 py-3.5 text-xs font-bold text-white transition-all shadow-md active:scale-95 cursor-pointer disabled:bg-slate-300 disabled:cursor-not-allowed"
              >
                Simpan Ulasan
              </button>
            </div>
          </form>
        </div>
      )}

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
                src="https://maps.google.com/maps?q=1.1467051,104.027821&z=17&output=embed"
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
                src="/asset/img/logo-1.png"
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
            "Bonus lengkap: 10+ (1 Free), 20+ (2 Free), 30+ (3 Free), dst."
          </p>
        </div>
      </div>

      {/* Blog Article Reader Modal */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity cursor-pointer animate-in fade-in duration-200"
            onClick={() => setActiveArticle(null)}
          />
          {/* Modal content */}
          <div className="relative bg-white rounded-3xl border border-slate-200/90 shadow-2xl p-6 md:p-8 w-full max-w-2xl max-h-[85vh] overflow-y-auto select-text animate-in fade-in zoom-in-95 duration-200">
            {/* Close button */}
            <button
              onClick={() => setActiveArticle(null)}
              className="absolute top-6 right-6 w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors z-10 cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Header info */}
            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md uppercase tracking-wider">
              {activeArticle.category}
            </span>
            <h2 className="text-xl md:text-2xl font-black text-[#1A365D] mt-3 mb-2 leading-tight">
              {activeArticle.title}
            </h2>
            <div className="flex items-center gap-3 text-slate-400 text-xs font-semibold mb-6">
              <span>{activeArticle.date}</span>
              <span>•</span>
              <span>{activeArticle.readingTime}</span>
            </div>

            {/* Image */}
            <div className="relative aspect-[16/8] w-full rounded-2xl overflow-hidden mb-6 bg-slate-100 border border-slate-200/50">
              <Image
                src={activeArticle.image}
                alt={activeArticle.title}
                fill
                className="object-cover"
              />
            </div>

            {/* Content text */}
            <div className="prose prose-slate max-w-none text-xs md:text-sm text-slate-650 leading-relaxed space-y-4">
              {activeArticle.content.map((paragraph, index) => {
                if (paragraph.startsWith("###")) {
                  return (
                    <h4 key={index} className="text-sm md:text-base font-bold text-[#1A365D] pt-2">
                      {paragraph.replace("### ", "")}
                    </h4>
                  );
                }
                if (paragraph.startsWith("- ")) {
                  // list item
                  const cleanText = paragraph.replace("- ", "");
                  // Split bold text if any: **text**: desc
                  if (cleanText.includes("**")) {
                    const parts = cleanText.split("**");
                    return (
                      <li key={index} className="list-disc ml-5 pl-1 my-1">
                        <strong>{parts[1]}</strong>{parts[2]}
                      </li>
                    );
                  }
                  return (
                    <li key={index} className="list-disc ml-5 pl-1 my-1">
                      {cleanText}
                    </li>
                  );
                }
                // Check normal bold text like **Fajri Transport Batam**
                if (paragraph.includes("**")) {
                  const parts = paragraph.split("**");
                  return (
                    <p key={index}>
                      {parts[0]}<strong>{parts[1]}</strong>{parts[2]}
                    </p>
                  );
                }
                return <p key={index}>{paragraph}</p>;
              })}
            </div>

            {/* CTA inside modal */}
            <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-left">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Tertarik dengan destinasi ini?</p>
                <p className="text-xs font-semibold text-slate-600">Konsultasikan gratis perjalanan Anda bersama tim kami.</p>
              </div>
              <button
                onClick={() => {
                  setActiveArticle(null);
                  const calcSec = document.getElementById("booking-section");
                  if (calcSec) {
                    calcSec.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 px-6 py-3.5 text-xs font-bold text-white transition-all shadow-sm active:scale-95 cursor-pointer"
              >
                Hubungi Kami & Pesan Paket
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search User Details Modal */}
      {showSearchUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setShowSearchUserModal(false)}
          />

          {/* Modal Container */}
          <form 
            onSubmit={handleConfirmSearchBooking}
            className="relative bg-white rounded-3xl border border-slate-200/90 shadow-2xl p-6 w-full max-w-md select-none animate-in fade-in zoom-in-95 duration-200"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-5">
              <h4 className="text-sm font-extrabold text-[#1A365D]">Informasi Pemesan</h4>
              <button
                type="button"
                onClick={() => setShowSearchUserModal(false)}
                className="w-7 h-7 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div className="grid grid-cols-12 gap-3">
                <div className="col-span-4">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 pl-1">
                    Sapaan
                  </label>
                  <div className="flex rounded-xl border border-slate-200 p-1 bg-slate-50 gap-1 h-[42px] items-center">
                    {["Mr.", "Mrs.", "Ms."].map((t) => {
                      const isActive = searchUserTitle === t;
                      return (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setSearchUserTitle(t)}
                          className={`flex-1 text-center py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer select-none
                            ${isActive 
                              ? "bg-blue-600 text-white shadow-sm" 
                              : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                            }
                          `}
                        >
                          {t.replace(".", "")}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="col-span-8">
                  <label htmlFor="search-name-input" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 pl-1">
                    Nama Lengkap
                  </label>
                  <input
                    id="search-name-input"
                    type="text"
                    value={searchUserName}
                    onChange={(e) => setSearchUserName(e.target.value)}
                    placeholder="Masukkan nama Anda"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/25 transition-all"
                    required
                  />
                </div>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-700 py-3 text-xs font-bold text-white transition-all shadow-md active:scale-95 cursor-pointer"
              >
                Cari & Hubungi via WhatsApp
              </button>
            </div>
          </form>
        </div>
      )}
      {/* Magic Link Generator Modal */}
      {showLinkGeneratorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setShowLinkGeneratorModal(false)}
          />

          <div className="relative bg-white rounded-3xl border border-slate-200/90 shadow-2xl p-6 w-full max-w-md select-none animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-5">
              <h4 className="text-sm font-extrabold text-[#1A365D]">Generator Link Ulasan</h4>
              <button
                type="button"
                onClick={() => setShowLinkGeneratorModal(false)}
                className="w-7 h-7 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                Buat link khusus bagi pelanggan untuk memberikan ulasan. Link ini otomatis **kedaluwarsa dalam 30 menit** demi keamanan.
              </p>

              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl break-all">
                <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider mb-1">Link Ulasan:</span>
                <span className="text-xs font-semibold text-blue-600 select-all">{generatedLink || "Membuat link..."}</span>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleGenerateMagicLink}
                  className="flex-1 inline-flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 py-3 text-xs font-bold text-slate-700 transition-all active:scale-95 cursor-pointer"
                >
                  Buat Ulang Link
                </button>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="flex-1 inline-flex items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-700 py-3 text-xs font-bold text-white transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  Salin Link
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Toast Warning Notification */}
      {searchError && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 border shadow-xl rounded-2xl p-4 animate-in fade-in slide-in-from-bottom-5 duration-300 max-w-sm
          ${toastType === "success" 
            ? "bg-emerald-50 border-emerald-250 text-emerald-800" 
            : "bg-red-50 border-red-200 text-red-800"
          }
        `}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0
            ${toastType === "success" ? "bg-emerald-100" : "bg-red-100"}
          `}>
            {toastType === "success" ? (
              <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            )}
          </div>
          <div>
            <h5 className={`text-[10px] font-bold uppercase tracking-wider
              ${toastType === "success" ? "text-emerald-800" : "text-red-800"}
            `}>
              {toastType === "success" ? "Sukses" : "Perhatian"}
            </h5>
            <p className={`text-xs font-semibold mt-0.5
              ${toastType === "success" ? "text-emerald-700" : "text-red-700"}
            `}>
              {searchError}
            </p>
          </div>
          <button 
            type="button"
            onClick={() => setSearchError("")}
            className={`ml-auto shrink-0 cursor-pointer
              ${toastType === "success" ? "text-emerald-400 hover:text-emerald-600" : "text-red-400 hover:text-red-600"}
            `}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
