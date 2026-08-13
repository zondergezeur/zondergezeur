"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Resend } from "resend";
import {
  cookieName,
  createAdminSessionToken,
  sessionMaxAgeSeconds,
  verifyAdminSessionToken,
  verifyPassword,
} from "../../lib/admin-auth";
import { saveContactLeadFollowUp } from "../../lib/contact-leads";
import { emailShell, escapeHtml, htmlToPlainText, paragraphsToHtml } from "../../lib/email-template";

const fromEmail = "Zonder Gezeur <contact@zondergezeur.nl>";
const replyToEmail = "contact@zondergezeur.nl";

function clean(value: FormDataEntryValue | null) {
  return String(value ?? "").trim();
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

async function requireAdmin() {
  const cookieStore = await cookies();

  if (!verifyAdminSessionToken(cookieStore.get(cookieName)?.value)) {
    redirect("/beheer");
  }
}

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

export async function sendFollowUpAction(formData: FormData) {
  await requireAdmin();

  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    redirect("/beheer?mail=missing-config");
  }

  const to = clean(formData.get("email")).toLowerCase();
  const name = clean(formData.get("name"));
  const contactLeadId = clean(formData.get("contactLeadId"));
  const subject = clean(formData.get("subject"));
  const message = clean(formData.get("message"));

  if (!to || !name || !contactLeadId || !subject || !message || !isValidEmail(to)) {
    redirect("/beheer?mail=invalid");
  }

  const resend = new Resend(apiKey);
  const safeName = escapeHtml(name);
  const bodyHtml = emailShell(`
    <p style="margin:0 0 18px;font-size:18px;line-height:1.55;color:#16211f;">Hoi ${safeName},</p>
    ${paragraphsToHtml(message)}
    <div style="background:#ecfff4;border-left:5px solid #42d9c8;border-radius:12px;margin-top:24px;padding:18px;font-size:15px;line-height:1.6;color:#5e6b67;">
      Je kunt op deze mail reageren als je nog iets wilt aanvullen.
    </div>
  `);

  const result = await resend.emails.send({
    from: fromEmail,
    to,
    replyTo: replyToEmail,
    subject,
    html: bodyHtml,
    text: `Hoi ${name},\n\n${htmlToPlainText(paragraphsToHtml(message))}\n\nJe kunt op deze mail reageren als je nog iets wilt aanvullen.`,
  });

  if (result.error) {
    console.error("Follow-up mail failed", result.error);
    redirect("/beheer?mail=error");
  }

  const storageResult = await saveContactLeadFollowUp({
    contactLeadId,
    toEmail: to,
    subject,
    message,
    resendEmailId: result.data?.id ?? null,
  });

  if (!storageResult.ok) {
    redirect("/beheer?mail=sent-not-stored");
  }

  redirect("/beheer?mail=sent");
}
