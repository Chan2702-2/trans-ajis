import Link from "next/link";
import Image from "next/image";
import { BLOG_ARTICLES } from "@/constants/articles";

export async function generateStaticParams() {
  return BLOG_ARTICLES.map((article) => ({
    id: article.id,
  }));
}

export default async function BlogDetailPage({ params }) {
  const { id } = await params;
  const article = BLOG_ARTICLES.find((a) => a.id === id);

  if (!article) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col font-sans">
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <span className="font-extrabold text-lg tracking-tight text-blue-900">Fajri Transport</span>
            </Link>
          </div>
        </header>
        <main className="flex-grow flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center mb-4 border border-red-100">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <h1 className="text-xl font-black text-slate-800">Artikel Tidak Ditemukan</h1>
          <p className="text-xs text-slate-500 mt-2 mb-6">Artikel yang Anda cari tidak tersedia atau telah dihapus.</p>
          <Link href="/blog" className="inline-flex items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white px-5 py-3 transition-all shadow-md active:scale-95 cursor-pointer">
            Kembali ke Blog
          </Link>
        </main>
      </div>
    );
  }

  // Get related articles (excluding the current one)
  const relatedArticles = BLOG_ARTICLES.filter((a) => a.id !== article.id).slice(0, 3);

  // Helper to parse markdown-like bold syntax
  const parseInlineStyles = (text) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={i} className="font-black text-slate-900">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

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

      {/* Main Content Area */}
      <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Article Content */}
        <main className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-6">
            <Link href="/blog" className="hover:text-blue-600 transition-colors">
              Blog
            </Link>
            <span>/</span>
            <span className="text-slate-500 line-clamp-1">{article.category}</span>
          </nav>

          {/* Heading */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#1A365D] tracking-tight leading-snug mb-4">
            {article.title}
          </h1>

          {/* Meta Info */}
          <div className="flex items-center gap-3 text-slate-400 text-xs font-bold uppercase tracking-wider mb-8 pb-6 border-b border-slate-100">
            <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md text-[9px] border border-blue-100/50">
              {article.category}
            </span>
            <span>•</span>
            <span>{article.date}</span>
            <span>•</span>
            <span>{article.readingTime}</span>
          </div>

          {/* Featured Image */}
          <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden mb-8 border border-slate-200">
            <Image
              src={article.image}
              alt={article.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Article Text Parser */}
          <div className="space-y-4 text-slate-650 leading-relaxed text-sm">
            {article.content.map((paragraph, index) => {
              const trimmed = paragraph.trim();

              if (trimmed.startsWith("###")) {
                return (
                  <h3 key={index} className="text-base sm:text-lg font-black text-[#1A365D] pt-6 pb-2">
                    {parseInlineStyles(trimmed.replace("###", "").trim())}
                  </h3>
                );
              }

              if (trimmed.startsWith("-")) {
                return (
                  <ul key={index} className="list-disc pl-5 my-2">
                    <li className="text-slate-650 leading-relaxed">
                      {parseInlineStyles(trimmed.replace("-", "").trim())}
                    </li>
                  </ul>
                );
              }

              return (
                <p key={index} className="leading-relaxed mb-4">
                  {parseInlineStyles(trimmed)}
                </p>
              );
            })}
          </div>

          {/* Call-to-action banner inside content */}
          <div className="mt-12 p-6 rounded-3xl bg-blue-50/50 border border-blue-100/50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-extrabold text-blue-900 mb-1">Rencanakan Perjalanan Anda ke Batam & Bintan</h4>
              <p className="text-xs text-blue-750">Nikmati layanan sewa mobil premium, bus pariwisata, dan paket tour All-in dengan sopir lokal berpengalaman.</p>
            </div>
            <Link
              href="/paket-tour"
              className="inline-flex items-center justify-center shrink-0 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white px-5 py-3.5 transition-all shadow-md shadow-blue-500/10 active:scale-95 cursor-pointer"
            >
              Lihat Paket Tour
            </Link>
          </div>

          {/* Back button */}
          <div className="mt-8 pt-8 border-t border-slate-100">
            <Link 
              href="/blog"
              className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              Kembali ke Semua Artikel
            </Link>
          </div>
        </main>

        {/* Right Side: Sidebar */}
        <aside className="lg:col-span-4 space-y-6">
          
          {/* Related Articles Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <h3 className="text-sm font-extrabold text-[#1A365D] uppercase tracking-wider mb-5 pb-3 border-b border-slate-100">
              Artikel Lainnya
            </h3>
            
            <div className="space-y-5">
              {relatedArticles.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/blog/${rel.id}`}
                  className="group flex gap-3.5 items-start hover:text-blue-600 transition-colors"
                >
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-100">
                    <Image
                      src={rel.image}
                      alt={rel.title}
                      fill
                      sizes="64px"
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                  </div>
                  <div>
                    <span className="text-[8px] font-black text-blue-600 bg-blue-50 border border-blue-100/30 px-2 py-0.5 rounded-md uppercase tracking-wider block w-fit mb-1.5">
                      {rel.category}
                    </span>
                    <h4 className="text-xs font-bold text-slate-800 leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {rel.title}
                    </h4>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Booking Contact Card */}
          <div className="bg-[#1A365D] text-white rounded-3xl p-6 shadow-md relative overflow-hidden">
            {/* Background Accent Deco */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-650/30 rounded-full translate-x-12 -translate-y-12 blur-xl" />
            
            <h3 className="text-base font-extrabold mb-2 relative z-10">Layanan Sewa Mobil & Tour Batam</h3>
            <p className="text-xs text-blue-100 leading-relaxed mb-6 relative z-10">
              Butuh penjemputan dari pelabuhan ferry, hotel, atau bandara Hang Nadim? Hubungi CS kami untuk konsultasi sewa mobil, sewa bus pariwisata, atau custom tour Batam-Bintan secara gratis!
            </p>

            <a
              href="https://wa.me/628123456789" // Placeholder WA or actual number
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 py-3 text-xs font-bold text-white transition-all shadow-md shadow-emerald-500/10 active:scale-95 cursor-pointer relative z-10"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.5-5.739-1.453L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.45 5.436 0 9.86-4.417 9.863-9.848.002-2.63-1.023-5.101-2.887-6.968C16.381 1.971 13.911.947 11.28.945c-5.44 0-9.865 4.417-9.867 9.851-.001 1.77.464 3.498 1.345 5.021l-.973 3.55 3.64-.954zm12.39-7.391c-.244-.122-1.45-.714-1.671-.796-.223-.081-.385-.122-.547.122-.162.244-.63.796-.772.957-.142.162-.284.183-.528.061-.244-.122-1.03-.38-1.962-1.211-.725-.647-1.215-1.448-1.357-1.691-.142-.244-.015-.376.107-.497.111-.11.244-.285.365-.427.122-.142.162-.244.244-.407.081-.162.041-.305-.021-.427-.061-.122-.547-1.32-.75-1.81-.197-.477-.398-.412-.547-.412-.142 0-.304-.006-.466-.006a.894.894 0 0 0-.65.304c-.223.244-.853.834-.853 2.031 0 1.197.873 2.35 1.002 2.506.122.162 1.705 2.603 4.14 3.65 2.434 1.047 2.434.698 2.879.658.448-.04 1.45-.592 1.653-1.162.203-.57.203-1.058.142-1.162-.061-.104-.223-.162-.466-.284z"/>
              </svg>
              Chat via WhatsApp
            </a>
          </div>
        </aside>
      </div>

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
