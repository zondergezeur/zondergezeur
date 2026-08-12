import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

const forwardTo = "zondergezeur@gmail.com";
const forwardFrom = "Zonder Gezeur <contact@zondergezeur.nl>";
const acceptedRecipient = "contact@zondergezeur.nl";

type EmailReceivedEvent = {
  type?: string;
  data?: {
    email_id?: string;
    to?: unknown;
    received_for?: unknown;
  };
};

function includesAcceptedRecipient(to: unknown) {
  const values = Array.isArray(to) ? to : [to];

  return values.some((value) => {
    if (typeof value === "string") {
      return value.toLowerCase().includes(acceptedRecipient);
    }

    if (value && typeof value === "object" && "email" in value) {
      return String(value.email).toLowerCase() === acceptedRecipient;
    }

    return false;
  });
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.RESEND_API_KEY;
  const webhookSecret = process.env.RESEND_WEBHOOK_SECRET;

  if (!apiKey || !webhookSecret) {
    return new NextResponse("Missing Resend configuration", { status: 500 });
  }

  const resend = new Resend(apiKey);
  const payload = await request.text();

  let event: EmailReceivedEvent;

  try {
    event = resend.webhooks.verify({
      payload,
      headers: {
        id: request.headers.get("svix-id") ?? "",
        timestamp: request.headers.get("svix-timestamp") ?? "",
        signature: request.headers.get("svix-signature") ?? "",
      },
      webhookSecret,
    }) as EmailReceivedEvent;
  } catch {
    return new NextResponse("Invalid webhook", { status: 400 });
  }

  if (event.type !== "email.received") {
    return NextResponse.json({ ok: true, ignored: true });
  }

  if (
    !includesAcceptedRecipient(event.data?.to) &&
    !includesAcceptedRecipient(event.data?.received_for)
  ) {
    return NextResponse.json({ ok: true, ignored: true });
  }

  const emailId = event.data?.email_id;

  if (!emailId) {
    return new NextResponse("Missing email id", { status: 400 });
  }

  const { data, error } = await resend.emails.receiving.forward({
    emailId,
    from: forwardFrom,
    to: forwardTo,
  });

  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }

  return NextResponse.json({ ok: true, id: data?.id });
}
