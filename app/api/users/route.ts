import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const sessionCookie = req.cookies.get('session')?.value;
  const { searchParams } = new URL(req.url);

  const page = searchParams.get('page') || '1';
  const limit = searchParams.get('limit') || '10';

  const backendRes = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/users?page=${page}&limit=${limit}`,
    {
      method: 'GET',
      headers: {
        ...(sessionCookie ? { Cookie: `session=${sessionCookie}` } : {}),
      },
    }
  );

  const data = await backendRes.json();
  return NextResponse.json(data, { status: backendRes.status });
}