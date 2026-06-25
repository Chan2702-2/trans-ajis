"use client";

import { useState, useEffect } from "react";
import { PACKAGES } from "@/constants/packages";

export default function BookingForm({ selectedPackageId, onPackageChange }) {
  const [selectedId, setSelectedId] = useState("");
  const [pax, setPax] = useState(1);
  const [clientSelectedPkg, setClientSelectedPkg] = useState(null);

  // Sync with selected package from outside (e.g. when card is clicked)
  useEffect(() => {
    if (selectedPackageId) {
      setSelectedId(selectedPackageId);
    }
  }, [selectedPackageId]);

  // Update selected package details
  useEffect(() => {
    const pkg = PACKAGES.find((p) => p.id === selectedId);
    setClientSelectedPkg(pkg || null);
    if (onPackageChange && pkg) {
      onPackageChange(pkg.id);
    }
  }, [selectedId, onPackageChange]);

  // Calculations
  const packagePrice = clientSelectedPkg ? clientSelectedPkg.harga_rm : 0;
  const totalPrice = packagePrice * pax;

  let bonusPax = 0;
  if (clientSelectedPkg && clientSelectedPkg.aturan_bonus) {
    const { jumlah_pax_min, free_pax } = clientSelectedPkg.aturan_bonus;
    if (pax >= jumlah_pax_min) {
      bonusPax = Math.floor(pax / jumlah_pax_min) * free_pax;
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!clientSelectedPkg) {
      alert("Silakan pilih paket terlebih dahulu.");
      return;
    }
    if (pax < 1) {
      alert("Jumlah pax minimal adalah 1.");
      return;
    }

    // WA Link format: wa.me/PHONENUMBER?text=MESSAGE
    // Let's use a placeholder Indonesian WA admin number (e.g., 6281234567890) or let the user configure it.
    const adminPhone = "628117771234"; // standard Batam admin code
    const message = `Halo Admin, saya ingin memesan paket ${clientSelectedPkg.nama}. Detail: Jumlah Pax: ${pax}, Total Harga: RM ${totalPrice}. Mohon informasinya.`;
    const encodedMessage = encodeURIComponent(message);
    const waUrl = `https://wa.me/${adminPhone}?text=${encodedMessage}`;

    window.open(waUrl, "_blank");
  };

  return (
    <div id="booking-section" className="w-full max-w-xl mx-auto rounded-2xl bg-white p-6 md:p-8 shadow-lg dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
      <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-6 flex items-center gap-2">
        <svg className="w-6 h-6 text-teal-600 dark:text-teal-400" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-12v12m-3 0h15M5.25 6h13.5A2.25 2.25 0 0121 8.25v10.5A2.25 2.25 0 0118.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6z" />
        </svg>
        Formulir Pemesanan
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Dropdown Pilihan Paket */}
        <div>
          <label htmlFor="package-select" className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
            Pilih Paket Travel
          </label>
          <select
            id="package-select"
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-4 py-3 text-sm text-zinc-900 dark:text-zinc-100 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/25 transition-all duration-200"
            required
          >
            <option value="" disabled hidden>-- Pilih Paket Unggulan Anda --</option>
            {PACKAGES.map((pkg) => (
              <option key={pkg.id} value={pkg.id}>
                {pkg.nama} (RM {pkg.harga_rm}/pax)
              </option>
            ))}
          </select>
        </div>

        {/* Input Jumlah Pax */}
        <div>
          <label htmlFor="pax-input" className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
            Jumlah Peserta (Pax)
          </label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setPax(Math.max(1, pax - 1))}
              className="flex items-center justify-center w-11 h-11 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-teal-50 dark:hover:bg-teal-950 text-zinc-700 dark:text-zinc-350 font-bold transition-all text-xl"
            >
              -
            </button>
            <input
              id="pax-input"
              type="number"
              min="1"
              value={pax}
              onChange={(e) => setPax(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full text-center rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-4 py-2.5 text-base font-bold text-zinc-900 dark:text-zinc-100 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/25 transition-all duration-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              required
            />
            <button
              type="button"
              onClick={() => setPax(pax + 1)}
              className="flex items-center justify-center w-11 h-11 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-teal-50 dark:hover:bg-teal-950 text-zinc-700 dark:text-zinc-350 font-bold transition-all text-xl"
            >
              +
            </button>
          </div>
        </div>

        {/* Summary Area */}
        {clientSelectedPkg && (
          <div className="rounded-xl bg-teal-50/50 dark:bg-teal-950/20 p-5 border border-teal-100/50 dark:border-teal-900/30 space-y-3 transition-all duration-300">
            <h4 className="text-sm font-bold text-teal-900 dark:text-teal-400 uppercase tracking-wider mb-2">
              Ringkasan Pemesanan
            </h4>
            
            <div className="flex justify-between text-sm text-zinc-600 dark:text-zinc-350">
              <span>Paket Terpilih:</span>
              <span className="font-semibold text-zinc-900 dark:text-zinc-50">{clientSelectedPkg.nama}</span>
            </div>

            <div className="flex justify-between text-sm text-zinc-600 dark:text-zinc-350">
              <span>Harga Per Pax:</span>
              <span className="font-semibold text-zinc-900 dark:text-zinc-50">RM {packagePrice}</span>
            </div>

            <div className="flex justify-between text-sm text-zinc-600 dark:text-zinc-350">
              <span>Jumlah Pax:</span>
              <span className="font-semibold text-zinc-900 dark:text-zinc-50">{pax} Pax</span>
            </div>

            {/* Bonus Promo Ringkasan */}
            <div className="flex justify-between text-sm text-zinc-600 dark:text-zinc-350">
              <span>Bonus Free Pax:</span>
              {bonusPax > 0 ? (
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  +{bonusPax} Pax FREE
                </span>
              ) : (
                <span className="text-zinc-400 dark:text-zinc-500">
                  Belum mencapai min. {clientSelectedPkg.aturan_bonus.jumlah_pax_min} pax
                </span>
              )}
            </div>

            {bonusPax > 0 && (
              <div className="flex justify-between text-sm text-zinc-600 dark:text-zinc-350 border-t border-teal-100/30 dark:border-teal-900/30 pt-2">
                <span>Total Pax Diterima:</span>
                <span className="font-semibold text-zinc-950 dark:text-zinc-50">{pax + bonusPax} Pax</span>
              </div>
            )}

            <div className="border-t border-teal-200/50 dark:border-teal-900/50 pt-3 flex justify-between items-baseline">
              <span className="text-base font-bold text-zinc-900 dark:text-zinc-50">Total Harga:</span>
              <span className="text-2xl font-black text-teal-600 dark:text-teal-400">
                RM {totalPrice}
              </span>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 hover:bg-teal-500 dark:bg-teal-600 dark:hover:bg-teal-500 px-6 py-4 text-base font-bold text-white transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 cursor-pointer"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.012 2c-5.506 0-9.988 4.482-9.988 9.988 0 1.761.459 3.472 1.332 4.981L2 22l5.161-1.353c1.463.799 3.109 1.22 4.84 1.22 5.507 0 9.989-4.482 9.989-9.989A9.99 9.99 0 0 0 12.012 2zm4.995 14.19c-.274.773-1.338 1.408-1.849 1.488-.475.074-.93.267-3.033-.564-2.525-.997-4.143-3.559-4.269-3.727-.126-.167-1.026-1.365-1.026-2.604 0-1.239.65-1.848.878-2.093.23-.244.498-.306.663-.306.166 0 .332.002.476.009.151.007.354-.056.554.425.204.493.698 1.701.76 1.826.061.125.102.271.019.435-.082.166-.123.27-.246.416-.122.145-.257.324-.366.435-.121.121-.249.254-.108.498.141.242.628 1.033 1.349 1.674.928.825 1.71 1.08 1.954 1.202.244.121.385.102.529-.061.144-.165.626-.728.793-.977.167-.248.332-.207.558-.124.227.083 1.439.68 1.688.805.25.124.417.187.478.293.061.107.061.618-.213 1.391z"/>
          </svg>
          Pesan via WhatsApp
        </button>
      </form>
    </div>
  );
}
