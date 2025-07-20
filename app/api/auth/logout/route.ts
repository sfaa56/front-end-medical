import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const sessionCookie = req.cookies.get('session')?.value;

  const backendRes = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/logout`,
    {
      method: 'POST',
      headers: {
        ...(sessionCookie ? { Cookie: `session=${sessionCookie}` } : {}),
      },
      body: await req.text(),
    }
  );
  const data = await backendRes.json();

  // Create response
  const response = NextResponse.json(data, { status: backendRes.status });

  // Remove the session cookie (set to expired)
  response.headers.set(
    'Set-Cookie',
    // Adjust domain/path if needed
    `session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=None; Secure`
  );

  return response;
}