import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(req: NextRequest, { params }) {
  const specialtyId = params.id;
  const sessionCookie = req.cookies.get('session')?.value;

  const backendRes = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/specialties/delete/${specialtyId}`,
    {
      method: 'DELETE',
      headers: {
        ...(sessionCookie ? { Cookie: `session=${sessionCookie}` } : {}),
      },
    }
  );
  const data = await backendRes.json();
  return NextResponse.json(data, { status: backendRes.status });
}