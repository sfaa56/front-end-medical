import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const sessionCookie = req.cookies.get('session')?.value;
  const backendRes = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/cities`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(sessionCookie ? { 'Cookie': `session=${sessionCookie}` } : {}),
      },
      body: await req.text(),
    }
  );
  const data = await backendRes.json();
  return NextResponse.json(data, { status: backendRes.status });
}