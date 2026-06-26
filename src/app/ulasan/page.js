"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/supabaseClient";

export default function UlasanPage() {
  const [reviews, setReviews] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState(0);
  const [isLoading, setIsLoading] = useState(true);



  useEffect(() => {
    async function fetchReviews() {
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
        console.error("Gagal memuat ulasan dari Supabase:", err);
        setReviews([]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchReviews();
  }, []);

  const filteredReviews = reviews.filter((rev) => {
    const matchesSearch = rev.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (rev.package && rev.package.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          rev.comment.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRating = ratingFilter === 0 || rev.rating === ratingFilter;
    return matchesSearch && matchesRating;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col font-sans">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative w-9 h-9 rounded-lg overflow-hidden shadow-sm border border-slate-200 bg-slate-50">
              <Image
                src="/asset/img/logo-1.png"
                alt="Fajri Transport Logo"
                fill
                sizes="36px"
                className="object-cover"
              />
            </div>
            <span className="font-extrabold text-lg tracking-tight text-blue-900">
              Fajri Transport Batam
            </span>
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 w-10 h-10 hover:bg-slate-50 transition-all shadow-sm active:scale-95 cursor-pointer"
            title="Kembali ke Beranda"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1A365D] tracking-tight">
            Semua Ulasan Pelanggan
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-650 max-w-xl mx-auto">
            Review asli dari para pelanggan setia yang menikmati layanan tour Batam & Bintan kami.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="w-full sm:max-w-xs relative">
            <input
              type="text"
              placeholder="Cari ulasan, nama, paket..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-4 pr-10 py-2.5 text-xs font-semibold text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/25 transition-all"
            />
            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.637 10.637z" />
              </svg>
            </div>
          </div>

          <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider self-center mr-2 shrink-0">Filter Rating:</span>
            {[0, 5, 4, 3, 2, 1].map((rating) => {
              const isActive = ratingFilter === rating;
              return (
                <button
                  key={rating}
                  onClick={() => setRatingFilter(rating)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer
                    ${isActive
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200/80"
                    }
                  `}
                >
                  {rating === 0 ? "Semua Bintang" : `${rating} ★`}
                </button>
              );
            })}
          </div>
        </div>

        {/* Grid List */}
        {isLoading ? (
          <div className="text-center py-16">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-xs font-semibold text-slate-500">Memuat ulasan dari Supabase...</p>
          </div>
        ) : filteredReviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredReviews.map((rev) => (
              <div 
                key={rev.id} 
                className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-300"
              >
                <div>
                  <div className="flex items-center gap-3.5 mb-4">
                    <div className="relative w-11 h-11 rounded-full overflow-hidden border border-slate-200 shrink-0 bg-slate-50 flex items-center justify-center">
                      {rev.photo ? (
                        <Image
                          src={rev.photo}
                          alt={rev.name}
                          fill
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
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white border border-slate-200 rounded-3xl">
            <svg className="w-12 h-12 text-slate-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
            </svg>
            <h3 className="text-sm font-extrabold text-[#1A365D] mb-1">Ulasan tidak ditemukan</h3>
            <p className="text-xs text-slate-400">Tidak ada ulasan yang cocok dengan kriteria pencarian atau filter Anda.</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#0F172A] text-slate-400 border-t border-slate-800 py-8 text-center text-xs">
        <p>© {new Date().getFullYear()} Fajri Transport Batam. Hak Cipta Dilindungi.</p>
      </footer>
    </div>
  );
}
