import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

type Payload = {
  id: string; // User ID or session ID
  expiresAt: Date; // Expiration time for the session (ISO string)
};



export async function createSession(accessToken: string) {
  let expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  // const session = await encrypt({ id, expiresAt });
  try {
    // Set the session cookie
    const cookieStore = await cookies();
    cookieStore.set("session", accessToken, {
      expires: expiresAt,
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
    });
  } catch (error) {
    console.error("Error creating session:", error);
    return null;
  }
}



export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
  redirect("/sign-in");
}
