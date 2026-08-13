import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { saveContactLead } from "../../../lib/contact-leads";
import { emailShell, escapeHtml } from "../../../lib/email-template";

export const runtime = "nodejs";

const ownerEmail = "zondergezeur@gmail.com";
const fromEmail = "Zonder Gezeur <contact@zondergezeur.nl>";

type ContactPayload = {
  name?: string;
  email?: string;
  topic?: string;
  message?: string;
  company?: string;
};

function clean(value: unknown) {
  return String(value ?? "").trim();
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: "Mail is nog niet geconfigureerd." }, { status: 500 });
  }

  const payload = (await request.json().catch(() => null)) as ContactPayload | null;

  if (!payload) {
    return NextResponse.json({ error: "Ongeldig formulier." }, { status: 400 });
  }

  if (clean(payload.company)) {
    return NextResponse.json({ ok: true });
  }

  const name = clean(payload.name);
  const email = clean(payload.email).toLowerCase();
  const topic = clean(payload.topic);
  const message = clean(payload.message);

  if (!name || !email || !topic || !message) {
    return NextResponse.json({ error: "Vul alle velden in." }, { status: 400 });
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Vul een geldig e-mailadres in." }, { status: 400 });
  }

  const resend = new Resend(apiKey);
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeTopic = escapeHtml(topic);
  const safeMessage = escapeHtml(message).replaceAll("\n", "<br />");
  const subject = `Nieuw bericht via Zonder Gezeur: ${topic}`;

  try {
    await saveContactLead({
      name,
      email,
      topic,
      message,
    });
  } catch (error) {
    console.error("Contact lead storage failed", error);
  }

  const ownerHtml = emailShell(`
    <p style="margin:0 0 18px;font-size:18px;line-height:1.55;color:#5e6b67;">Er is een nieuw bericht binnengekomen via het formulier op zondergezeur.nl.</p>
    <div style="display:grid;gap:12px;margin:24px 0;">
      <div><strong>Naam</strong><br />${safeName}</div>
      <div><strong>E-mail</strong><br /><a href="mailto:${safeEmail}" style="color:#275efe;">${safeEmail}</a></div>
      <div><strong>Onderwerp</strong><br />${safeTopic}</div>
    </div>
    <div style="background:#f7fbf9;border-left:5px solid #ff7b5f;border-radius:12px;padding:18px;font-size:16px;line-height:1.6;">
      ${safeMessage}
    </div>
  `);

  const confirmationHtml = emailShell(`
    <p style="margin:0 0 18px;font-size:18px;line-height:1.55;">Hoi ${safeName},</p>
    <p style="margin:0 0 18px;font-size:18px;line-height:1.55;color:#5e6b67;">Dank je wel voor je bericht. Ik heb het ontvangen en reageer zo snel mogelijk.</p>
    <p style="margin:0 0 24px;font-size:16px;line-height:1.55;color:#5e6b67;">Hieronder staat een kopie van wat je hebt gestuurd.</p>
    <div style="display:grid;gap:12px;margin:24px 0;">
      <div><strong>Onderwerp</strong><br />${safeTopic}</div>
    </div>
    <div style="background:#f7fbf9;border-left:5px solid #42d9c8;border-radius:12px;padding:18px;font-size:16px;line-height:1.6;">
      ${safeMessage}
    </div>
  `);

  const [ownerResult, confirmationResult] = await Promise.all([
    resend.emails.send({
      from: fromEmail,
      to: ownerEmail,
      replyTo: email,
      subject,
      html: ownerHtml,
    }),
    resend.emails.send({
      from: fromEmail,
      to: email,
      replyTo: "contact@zondergezeur.nl",
      subject: "We hebben je bericht ontvangen",
      html: confirmationHtml,
    }),
  ]);

  if (ownerResult.error || confirmationResult.error) {
    return NextResponse.json(
      { error: "Versturen lukt nu niet. Probeer het later opnieuw." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
