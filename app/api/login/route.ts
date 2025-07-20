import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();

  const backendRes = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      credentials: 'include',
    }
  );

  const data = await backendRes.json();
  const backendSetCookie = backendRes.headers.get('set-cookie');

  const response = NextResponse.json(data, { status: backendRes.status });

if (backendSetCookie) {
  // Always set SameSite=None; Secure for cross-origin
  const fixedCookie = backendSetCookie
    .replace(/Domain=[^;]+;/, '') // Remove domain
    .replace(/SameSite=[^;]+;/, 'SameSite=None;') // Ensure None
    .replace(/Secure/, 'Secure'); // Make sure secure is present

  response.headers.set('Set-Cookie', fixedCookie);
}

  return response;
}