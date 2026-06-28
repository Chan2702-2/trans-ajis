"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { BLOG_ARTICLES } from "@/constants/articles";

export default function BlogListPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  // Get unique categories
  const categories = ["Semua", ...Array.from(new Set(BLOG_ARTICLES.map((a) => a.category)))];

  // Filter articles
  const filteredArticles = BLOG_ARTICLES.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "Semua" || article.category === selectedCategory;

    return matchesSearch && matchesCategory;
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
            <Link href="/paket-tour" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">
              Paket Tour
            </Link>
            <Link href="/blog" className="text-sm font-bold text-blue-600 transition-colors">
              Blog
            </Link>
            <Link href="/ulasan" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">
              Ulasan
            </Link>
            <Link href="/#contact" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">
              Kontak
            </Link>
          </nav>

          <Link
            href="/paket-tour"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 hover:bg-blue-700 text-sm font-bold text-white px-5 py-2.5 transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            Pesan Tour
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {/* Page Hero Header */}
        <div className="text-center mb-12">
          <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 border border-blue-100/80 px-3 py-1 rounded-full">
            Inspirasi Liburan & Tips Perjalanan
          </span>
          <h1 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-black text-[#1A365D] tracking-tight">
            Blog Fajri Transport
          </h1>
          <p className="mt-4 text-sm sm:text-base text-slate-650 max-w-2xl mx-auto leading-relaxed">
            Dapatkan informasi destinasi wisata terpopuler di Batam & Bintan, kuliner seafood kelong terbaik, hingga tips sewa kendaraan pariwisata terpercaya.
          </p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200 mb-10 flex flex-col gap-5">
          {/* Search Input */}
          <div className="relative w-full max-w-md mx-auto sm:mx-0">
            <input
              id="blog-search-input"
              type="text"
              placeholder="Cari topik, tips, atau destinasi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 py-3 text-xs font-semibold text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/25 transition-all shadow-inner"
            />
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.637 10.637z" />
              </svg>
            </div>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap gap-2.5 border-t border-slate-100 pt-4 overflow-x-auto scrollbar-none">
            {categories.map((category) => {
              const isActive = selectedCategory === category;
              return (
                <button
                  key={category}
                  id={`btn-category-${category.replace(/\s+/g, "-").toLowerCase()}`}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer select-none active:scale-95
                    ${isActive
                      ? "bg-blue-600 text-white shadow-sm shadow-blue-500/10 border border-blue-600"
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/50"
                    }
                  `}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        {/* Article Grid */}
        {filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((article) => (
              <article
                key={article.id}
                className="group bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-sm flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div>
                  {/* Aspect Ratio Box */}
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100 border-b border-slate-100">
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      sizes="(max-w-768px) 100vw, (max-w-1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      priority={article.id === "1"}
                    />
                    <div className="absolute top-4 left-4 bg-blue-600 text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-1.5 rounded-lg z-10 border border-blue-550/40 shadow-sm">
                      {article.category}
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-3 text-slate-400 text-[10px] font-extrabold mb-3 uppercase tracking-wider">
                      <span>{article.date}</span>
                      <span>•</span>
                      <span>{article.readingTime}</span>
                    </div>
                    <h2 className="text-base font-extrabold text-slate-800 mb-2.5 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                      {article.title}
                    </h2>
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                      {article.summary}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <Link
                    href={`/blog/${article.id}`}
                    id={`btn-read-more-${article.id}`}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-slate-50 border border-slate-200/70 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 py-3 text-xs font-bold text-slate-700 transition-all cursor-pointer active:scale-95"
                  >
                    Baca Selengkapnya
                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm">
            <svg className="w-12 h-12 text-slate-350 mx-auto mb-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            <h3 className="text-base font-extrabold text-slate-700">Tidak ada artikel ditemukan</h3>
            <p className="text-xs text-slate-450 mt-1">Coba gunakan kata kunci pencarian yang lain.</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#0F172A] text-slate-400 border-t border-slate-800 py-12 text-center text-xs mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="mb-2">© {new Date().getFullYear()} Fajri Transport Batam. Hak Cipta Dilindungi.</p>
          <p className="text-[10px] text-slate-500">Penyedia Layanan Transportasi, Sewa Mobil & Paket Tour Terlengkap Batam & Bintan.</p>
        </div>
      </footer>
    </div>
  );
}
