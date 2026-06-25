export default function PackageCard({ pkg, onSelect }) {
  const { nama, harga_rm, deskripsi_fasilitas, aturan_bonus } = pkg;
  
  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
      {/* Top Accent Gradient Line */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-teal-500 to-emerald-500" />
      
      <div>
        <div className="flex justify-between items-start gap-2 mb-4">
          <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
            {nama}
          </h3>
          <span className="inline-flex shrink-0 items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400">
            Min. {aturan_bonus.jumlah_pax_min} Pax (+{aturan_bonus.free_pax} Free)
          </span>
        </div>
        
        <div className="mb-6">
          <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Mulai dari</span>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-extrabold text-teal-600 dark:text-teal-400">RM {harga_rm}</span>
            <span className="text-zinc-500 dark:text-zinc-400 text-sm">/ pax</span>
          </div>
        </div>

        <div className="border-t border-zinc-100 dark:border-zinc-800 pt-4 mb-6">
          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-150 mb-3">Fasilitas Termasuk:</p>
          <ul className="space-y-2.5">
            {deskripsi_fasilitas.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-sm text-zinc-600 dark:text-zinc-350">
                <svg className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <button
        onClick={() => onSelect(pkg)}
        className="w-full mt-auto inline-flex items-center justify-center rounded-xl bg-zinc-900 hover:bg-teal-600 dark:bg-zinc-800 dark:hover:bg-teal-600 px-4 py-3 text-sm font-semibold text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 cursor-pointer"
      >
        Pilih Paket Ini
      </button>
    </div>
  );
}
