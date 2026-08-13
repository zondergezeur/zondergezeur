import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

const ownerEmail = "zondergezeur@gmail.com";
const fromEmail = "Zonder Gezeur <contact@zondergezeur.nl>";
const emailLogoUrl = "https://www.zondergezeur.nl/icon-192.png";

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

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function emailShell(content: string) {
  return `
    <div style="margin:0;background:#fbfff8;padding:32px 16px;font-family:Arial,Helvetica,sans-serif;color:#16211f;">
      <div style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid rgba(22,33,31,0.13);border-radius:18px;overflow:hidden;">
        <div style="background:#16211f;padding:28px 30px;color:#fbfff8;">
          <img src="${emailLogoUrl}" width="74" height="74" alt="Zonder Gezeur" style="display:block;width:74px;height:74px;border-radius:50%;margin:0 0 16px;" />
          <div style="font-size:13px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#42d9c8;">Zonder Gezeur</div>
          <div style="margin-top:10px;font-size:30px;line-height:1.05;font-weight:900;">Websites bouwen zonder gedoe</div>
        </div>
        <div style="padding:30px;">
          ${content}
        </div>
        <div style="border-top:1px solid rgba(22,33,31,0.1);padding:18px 30px;color:#5e6b67;font-size:14px;">
          Rust. Structuur. Vakmanschap. Vertrouwen.
        </div>
      </div>
    </div>
  `;
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
