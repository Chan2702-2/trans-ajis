export const PACKAGES = [
  {
    id: "batam-bintan-3d2n",
    nama: "1. Batam & Bintan 3D2N (Best Seller)",
    harga_rm: 750,
    min_pax: 4,
    image: "/beach_resort_bintan.jpg",
    deskripsi_fasilitas: [
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
    ],
    aturan_bonus: {
      jumlah_pax_min: 10,
      free_pax: 1
    }
  },
  {
    id: "batam-2d1n",
    nama: "2. Batam 2D1N Relaxing",
    harga_rm: 499,
    min_pax: 4,
    image: "/batam_temple_landmark.jpg",
    deskripsi_fasilitas: [
      "Tiket Ferry PP (Singapore/Johor to Batam)",
      "Transportasi AC Private selama tour di Batam",
      "Hotel Bintang 3 (1 Malam + Sarapan Pagi)",
      "City Tour Jembatan Barelang (Iconic Spot)",
      "Kunjungan ke Masjid Cheng Ho & Miniatur Rumah Adat",
      "Wisata Belanja di Mall Terbesar Batam (Grand Batam Mall)",
      "Pemandu Wisata lokal ramah & berpengalaman",
      "1x Makan Siang Seafood di Restaurant Kelong Lokal",
      "Air Mineral & Snack Box saat kedatangan"
    ],
    aturan_bonus: {
      jumlah_pax_min: 10,
      free_pax: 1
    }
  },
  {
    id: "batam-3d2n-essential",
    nama: "3. Batam 3D2N (Essential)",
    harga_rm: 499,
    min_pax: 4,
    image: "/batam_city_mall.jpg",
    deskripsi_fasilitas: [
      "Tiket Ferry PP (Singapore/Johor/Batam)",
      "Transportasi AC selama tour Batam",
      "Hotel Bintang 3 (2 Malam + Sarapan)",
      "Full Day Tour Batam & Shopping Tour",
      "Makan Siang & Malam Seafood/Kuliner lokal",
      "Dokumentasi foto/video gratis"
    ],
    aturan_bonus: {
      step: 10, // 10 pax = 1 free, 20 = 2 free, etc.
      free_per_step: 1
    }
  }
];
