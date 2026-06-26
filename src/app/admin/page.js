"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/supabaseClient";

export default function AdminPage() {
  const [passcode, setPasscode] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [authError, setAuthError] = useState("");

  const [customerName, setCustomerName] = useState("");
  const [customerTitle, setCustomerTitle] = useState("Mr.");
  const [selectedPkg, setSelectedPkg] = useState("Batam & Bintan 3D2N");
  const [expiryMinutes, setExpiryMinutes] = useState(30);

  const [generatedLink, setGeneratedLink] = useState("");
  const [linkCopied, setLinkCopied] = useState(false);

  const [reviews, setReviews] = useState([]);
  const [toastMessage, setToastMessage] = useState("");
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);

  const CORRECT_PASSCODE = "fajribtm123";

  // Fetch reviews from Supabase once authorized
  useEffect(() => {
    if (isAuthorized) {
      fetchReviews();
    }
  }, [isAuthorized]);

  const fetchReviews = async () => {
    setIsLoadingReviews(true);
    try {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      if (data) {
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
      }
    } catch (err) {
      console.error("Gagal memuat ulasan:", err);
      showToast("Gagal memuat data ulasan dari database.");
    } finally {
      setIsLoadingReviews(false);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (passcode === CORRECT_PASSCODE) {
      setIsAuthorized(true);
      setAuthError("");
    } else {
      setAuthError("Passcode salah! Silakan coba lagi.");
    }
  };

  const handleGenerateLink = async (e) => {
    e.preventDefault();
    
    // Create actual token and store it in magic_links table in Supabase
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000).toISOString();

    try {
      const { error } = await supabase
        .from("magic_links")
        .insert([{ token, expires_at: expiresAt, used: false }]);

      if (error) throw error;

      const origin = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
      const path = typeof window !== "undefined" ? window.location.pathname.replace("/admin", "") : "/";
      
      const link = `${origin}${path}?reviewToken=${token}`;
      
      setGeneratedLink(link);
      setLinkCopied(false);
      showToast("Link ulasan berhasil dibuat dan disimpan di database!");
    } catch (err) {
      console.error("Gagal membuat token magic link:", err);
      showToast("Gagal membuat link di database.");
    }
  };

  const handleCopyLink = () => {
    if (!generatedLink) return;
    navigator.clipboard.writeText(generatedLink);
    setLinkCopied(true);
    showToast("Link ulasan berhasil disalin ke clipboard!");
  };

  const handleDeleteReview = async (id) => {
    if (confirm("Apakah Anda yakin ingin menghapus ulasan ini dari database Supabase secara permanen?")) {
      try {
        const { error } = await supabase
          .from("reviews")
          .delete()
          .eq("id", id);

        if (error) throw error;

        setReviews((prev) => prev.filter((rev) => rev.id !== id));
        showToast("Ulasan berhasil dihapus dari database.");
      } catch (err) {
        console.error("Gagal menghapus ulasan:", err);
        showToast("Gagal menghapus ulasan dari database.");
      }
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 font-sans">
        <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-xl border border-slate-200 text-center">
          <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 mx-auto mb-4 flex items-center justify-center">
            <Image
              src="/asset/img/logo-1.png"
              alt="Fajri Transport Logo"
              fill
              sizes="48px"
              className="object-cover"
            />
          </div>
          <h2 className="text-lg font-black text-[#1A365D] mb-1">Admin Panel</h2>
          <p className="text-xs text-slate-500 mb-6">Masukkan passcode untuk mengakses dashboard manajemen ulasan.</p>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label htmlFor="passcode-input" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 pl-1">
                Passcode Admin
              </label>
              <input
                id="passcode-input"
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Masukkan passcode"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/25 transition-all text-center"
                required
              />
            </div>
            {authError && (
              <p className="text-xs font-bold text-red-600 text-center">{authError}</p>
            )}
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-700 py-3 text-xs font-bold text-white transition-all shadow-md active:scale-95 cursor-pointer"
            >
              Masuk Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col font-sans">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
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
              Dashboard Admin Ulasan
            </span>
          </div>
          
          <div className="flex gap-3">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 w-10 h-10 hover:bg-slate-50 transition-all shadow-sm active:scale-95 cursor-pointer"
              title="Kembali ke Beranda"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
            </Link>
            <button
              onClick={() => setIsAuthorized(false)}
              className="inline-flex items-center justify-center rounded-xl bg-red-650 hover:bg-red-700 text-xs font-bold text-white px-4 py-2.5 transition-all shadow-md active:scale-95 cursor-pointer"
            >
              Log Out
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Link Generator */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
            <h3 className="text-base font-extrabold text-[#1A365D] mb-4">Generator Magic Link Ulasan</h3>
            
            <form onSubmit={handleGenerateLink} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Nama Pelanggan (Optional)
                </label>
                <div className="grid grid-cols-12 gap-2">
                  <div className="col-span-4">
                    <div className="flex rounded-xl border border-slate-200 p-1 bg-slate-50 gap-1 h-[42px] items-center">
                      {["Mr.", "Mrs."].map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setCustomerTitle(t)}
                          className={`flex-1 text-center py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer select-none
                            ${customerTitle === t ? "bg-blue-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-800"}
                          `}
                        >
                          {t.replace(".", "")}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="col-span-8">
                    <input
                      type="text"
                      placeholder="Nama Pelanggan"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full h-[42px] rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-1"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="adm-pkg-select" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Paket Tour yang Diikuti
                </label>
                <select
                  id="adm-pkg-select"
                  value={selectedPkg}
                  onChange={(e) => setSelectedPkg(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-800 focus:border-blue-500 focus:outline-none cursor-pointer"
                >
                  <option value="Batam & Bintan 3D2N">Batam & Bintan 3D2N (Best Seller)</option>
                  <option value="Batam 2D1N">Batam 2D1N City Tour</option>
                  <option value="Batam 3D2N (Essential)">Batam 3D2N (Essential)</option>
                  <option value="Custom Route / Sewa Mobil Only">Sewa Mobil / Custom Route</option>
                </select>
              </div>

              <div>
                <label htmlFor="adm-expiry-select" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Masa Aktif Link
                </label>
                <select
                  id="adm-expiry-select"
                  value={expiryMinutes}
                  onChange={(e) => setExpiryMinutes(parseInt(e.target.value))}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-800 focus:border-blue-500 focus:outline-none cursor-pointer"
                >
                  <option value={15}>15 Menit</option>
                  <option value={30}>30 Menit (Direkomendasikan)</option>
                  <option value={60}>1 Jam</option>
                  <option value={1440}>1 Hari</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-700 py-3.5 text-xs font-bold text-white transition-all shadow-md active:scale-95 cursor-pointer"
              >
                Buat Magic Link
              </button>
            </form>

            {generatedLink && (
              <div className="mt-6 pt-6 border-t border-slate-100 space-y-3">
                <div className="p-3 bg-blue-50/50 border border-blue-100/50 rounded-xl break-all">
                  <span className="text-[10px] font-bold text-blue-900/60 block uppercase tracking-wider mb-1">Generated Link:</span>
                  <span className="text-xs font-semibold text-blue-700">{generatedLink}</span>
                </div>
                <button
                  onClick={handleCopyLink}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 py-3 text-xs font-bold text-white transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  {linkCopied ? "Link Tersalin!" : "Salin Link Ulasan"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Reviews Manager List */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
            <h3 className="text-base font-extrabold text-[#1A365D] mb-4">
              Kelola Ulasan Pelanggan ({reviews.length})
            </h3>

            {isLoadingReviews ? (
              <div className="text-center py-12">
                <div className="w-6 h-6 border-4 border-blue-650 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-[11px] text-slate-400 font-semibold">Mengambil ulasan...</p>
              </div>
            ) : reviews.length > 0 ? (
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
                {reviews.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-2xl border border-slate-150 bg-slate-50/50 flex items-start gap-4 justify-between">
                    <div className="flex items-start gap-3">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden border border-slate-200 shrink-0 bg-white flex items-center justify-center">
                        {rev.photo ? (
                          <Image src={rev.photo} alt={rev.name} fill className="object-cover" />
                        ) : (
                          <span className="text-[10px] font-bold text-slate-400">FA</span>
                        )}
                      </div>
                      <div>
                        <h4 className="text-xs font-extrabold text-[#1A365D]">{rev.name}</h4>
                        <div className="flex items-center gap-2 mt-0.5 mb-1.5">
                          <span className="text-[10px] text-slate-400 font-semibold">{rev.date}</span>
                          <span className="text-slate-300">•</span>
                          <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100/50">{rev.package || "Umum"}</span>
                        </div>
                        <div className="flex gap-0.5 text-amber-400 mb-2">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <svg key={i} className={`w-3.5 h-3.5 ${i < rev.rating ? "fill-current" : "stroke-current text-slate-200"}`} viewBox="0 0 24 24">
                              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                            </svg>
                          ))}
                        </div>
                        <p className="text-xs text-slate-600 italic">"{rev.comment}"</p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteReview(rev.id)}
                      className="text-red-500 hover:text-red-700 text-xs font-bold p-1 border border-transparent hover:border-red-200 rounded hover:bg-red-50 transition-all shrink-0 cursor-pointer"
                    >
                      Hapus
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-450 italic py-8 text-center">Belum ada ulasan masuk.</p>
            )}
          </div>
        </div>

      </main>

      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-slate-900 border border-slate-800 text-white shadow-xl rounded-xl px-4 py-3 animate-in fade-in slide-in-from-bottom-5 duration-350 max-w-sm">
          <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
          </svg>
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-[#0F172A] text-slate-400 border-t border-slate-800 py-8 text-center text-xs">
        <p>© {new Date().getFullYear()} Fajri Transport Batam. Hak Cipta Dilindungi.</p>
      </footer>
    </div>
  );
}
