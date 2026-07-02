import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/src/lib/prisma";

const SESSION_COOKIE_NAME = "almasa_admin_auth";

function createSessionValue(email: string) {
  const payload = JSON.stringify({
    email,
    exp: Date.now() + 1000 * 60 * 60 * 8,
  });

  return Buffer.from(payload).toString("base64url");
}

async function validateAdmin(email: string, password: string) {
  const admin = await prisma.admin.findUnique({
    where: { email },
  });

  if (admin && (await bcrypt.compare(password, admin.password))) {
    return true;
  }

  const envEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const envPassword = process.env.ADMIN_PASSWORD?.trim();

  if (envEmail && envPassword && email === envEmail && password === envPassword) {
    return true;
  }

  return false;
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const email = body?.email?.toString().trim().toLowerCase() || "";
  const password = body?.password?.toString() || "";

  if (!email || !password) {
    return NextResponse.json(
      { success: false, message: "يرجى إدخال البريد الإلكتروني وكلمة المرور" },
      { status: 400 }
    );
  }

  const valid = await validateAdmin(email, password);

  if (!valid) {
    return NextResponse.json(
      { success: false, message: "البريد الإلكتروني أو كلمة المرور غير صحيحة" },
      { status: 401 }
    );
  }

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, createSessionValue(email), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  return NextResponse.json({ success: true });
}
