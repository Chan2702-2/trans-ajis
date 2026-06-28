import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request) {
  try {
    const { passcode } = await request.json();

    const correctPasscode = process.env.ADMIN_PASSCODE || 'fajribtm123';

    if (passcode === correctPasscode) {
      // Simpan session aman di cookie (berlaku selama 1 hari)
      const response = NextResponse.json({ success: true, message: 'Authorized' });
      
      response.cookies.set('admin_session', 'authorized', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24, // 1 hari
        path: '/'
      });

      return response;
    }

    return NextResponse.json(
      { success: false, error: 'Passcode salah! Silakan coba lagi.' },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan server.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');

  if (session && session.value === 'authorized') {
    return NextResponse.json({ authorized: true });
  }

  return NextResponse.json({ authorized: false });
}

export async function DELETE() {
  // Logout endpoint
  const response = NextResponse.json({ success: true });
  response.cookies.set('admin_session', '', { maxAge: 0, path: '/' });
  return response;
}
