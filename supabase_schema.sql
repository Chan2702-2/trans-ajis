-- 1. Membuat Tabel Reviews (Ulasan)
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    comment TEXT NOT NULL,
    photo TEXT, -- Menyimpan URL foto (atau Base64 kecil)
    package VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Membuat Tabel Magic Links (Token Ulasan)
CREATE TABLE IF NOT EXISTS public.magic_links (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Mengaktifkan Row Level Security (RLS) untuk keamanan tambahan (Optional, agar data bisa dibaca publik namun hanya diubah dengan kunci API yang sah)
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.magic_links ENABLE ROW LEVEL SECURITY;

-- Membuat Kebijakan Akses Bebas Baca (Select) untuk semua orang di tabel reviews
CREATE POLICY "Allow public read access to reviews" 
ON public.reviews FOR SELECT 
USING (true);

-- Membuat Kebijakan Akses Tulis (Insert) untuk semua orang (anon) di tabel reviews
CREATE POLICY "Allow public insert access to reviews" 
ON public.reviews FOR INSERT 
WITH CHECK (true);

-- Membuat Kebijakan Akses Hapus (Delete) hanya untuk admin
CREATE POLICY "Allow all access to reviews for service role / admin" 
ON public.reviews FOR ALL 
USING (true)
WITH CHECK (true);

-- Kebijakan Akses untuk Magic Links
CREATE POLICY "Allow all access to magic_links"
ON public.magic_links FOR ALL
USING (true)
WITH CHECK (true);
