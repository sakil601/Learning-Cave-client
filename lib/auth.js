import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
const secret = new TextEncoder().encode(
  process.env.AUTH_SECRET || "dev-secret-change-me",
);
export async function createSession(email) {
  return new SignJWT({ email, role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}
export async function getSession() {
  const c = await cookies();
  const token = c.get("lc_session")?.value;
  if (!token) return null;
  try {
    return (await jwtVerify(token, secret)).payload;
  } catch {
    return null;
  }
}
export async function requireAdmin() {
  const s = await getSession();
  if (!s || s.role !== "admin") return null;
  return s;
}
