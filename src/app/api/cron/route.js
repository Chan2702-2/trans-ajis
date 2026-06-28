import { NextResponse } from 'next/server';
import { supabase } from '@/supabaseClient';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  // Ambil token Authorization dari request headers
  const authHeader = request.headers.get('authorization');

  // Proteksi keamanan: Bandingkan dengan CRON_SECRET bawaan Vercel
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    // Jalankan query ringan untuk memicu aktivitas database Supabase
    // Menggunakan query simple select 1 atau membaca data minimal
    const { data, error } = await supabase.from('paket_tour').select('id').limit(1);

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: 'Database pinged successfully',
      timestamp: new Date().toISOString(),
      data
    });
  } catch (err) {
    console.error('Cron job database ping failed:', err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
