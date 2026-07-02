import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE_NAME = "almasa_admin_auth";

function createSessionValue(username: string) {
  const payload = JSON.stringify({
    username,
    exp: Date.now() + 1000 * 60 * 60 * 8,
  });

  return Buffer.from(payload).toString("base64url");
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const username = body?.username?.toString().trim() || "";
  const password = body?.password?.toString() || "";

  const expectedUsername = process.env.ADMIN_USERNAME?.trim() || "admin";
  const expectedPassword = process.env.ADMIN_PASSWORD?.trim() || "admin123";

  if (username !== expectedUsername || password !== expectedPassword) {
    return NextResponse.json(
      { success: false, message: "اسم المستخدم أو كلمة المرور غير صحيحة" },
      { status: 401 }
    );
  }

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, createSessionValue(username), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  return NextResponse.json({ success: true });
}
