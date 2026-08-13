"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  cookieName,
  createAdminSessionToken,
  sessionMaxAgeSeconds,
  verifyPassword,
} from "../../lib/admin-auth";

export async function loginAction(formData: FormData) {
  const password = String(formData.get("password") ?? "");

  if (!verifyPassword(password)) {
    redirect("/beheer?error=1");
  }

  const cookieStore = await cookies();
  cookieStore.set(cookieName, createAdminSessionToken(), {
    httpOnly: true,
    maxAge: sessionMaxAgeSeconds,
    path: "/beheer",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  redirect("/beheer");
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(cookieName);
  redirect("/beheer");
}
