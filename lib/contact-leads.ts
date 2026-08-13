type LeadStatus = "new" | "read" | "archived";

export type ContactLead = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  topic: string;
  message: string;
  status: LeadStatus;
  source: string;
  follow_ups: ContactLeadFollowUp[];
};

export type NewContactLead = {
  name: string;
  email: string;
  topic: string;
  message: string;
  source?: string;
};

export type ContactLeadFollowUp = {
  id: string;
  contact_lead_id: string;
  created_at: string;
  to_email: string;
  subject: string;
  message: string;
  resend_email_id: string | null;
};

export type NewContactLeadFollowUp = {
  contactLeadId: string;
  toEmail: string;
  subject: string;
  message: string;
  resendEmailId?: string | null;
};

type SupabaseConfig = {
  restUrl: string;
  serviceRoleKey: string;
};

function getSupabaseConfig(): SupabaseConfig | null {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return null;
  }

  return {
    restUrl: `${supabaseUrl.replace(/\/$/, "")}/rest/v1`,
    serviceRoleKey,
  };
}

function supabaseHeaders(config: SupabaseConfig) {
  const headers: Record<string, string> = {
    apikey: config.serviceRoleKey,
    "content-type": "application/json",
  };

  if (!config.serviceRoleKey.startsWith("sb_secret_")) {
    headers.authorization = `Bearer ${config.serviceRoleKey}`;
  }

  return headers;
}

export function hasLeadStorageConfig() {
  return Boolean(getSupabaseConfig());
}

export async function saveContactLead(lead: NewContactLead) {
  const config = getSupabaseConfig();

  if (!config) {
    return { ok: false, skipped: true };
  }

  const response = await fetch(`${config.restUrl}/contact_leads`, {
    method: "POST",
    headers: {
      ...supabaseHeaders(config),
      prefer: "return=minimal",
    },
    body: JSON.stringify({
      name: lead.name,
      email: lead.email,
      topic: lead.topic,
      message: lead.message,
      source: lead.source ?? "contact_form",
      status: "new",
    }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    console.error("Contact lead storage failed", response.status, errorText);
    return { ok: false, skipped: false };
  }

  return { ok: true, skipped: false };
}

export async function saveContactLeadFollowUp(followUp: NewContactLeadFollowUp) {
  const config = getSupabaseConfig();

  if (!config) {
    return { ok: false, skipped: true };
  }

  const response = await fetch(`${config.restUrl}/contact_lead_follow_ups`, {
    method: "POST",
    headers: {
      ...supabaseHeaders(config),
      prefer: "return=minimal",
    },
    body: JSON.stringify({
      contact_lead_id: followUp.contactLeadId,
      to_email: followUp.toEmail,
      subject: followUp.subject,
      message: followUp.message,
      resend_email_id: followUp.resendEmailId ?? null,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    console.error("Follow-up storage failed", response.status, errorText);
    return { ok: false, skipped: false };
  }

  return { ok: true, skipped: false };
}

export async function getContactLeads(limit = 50) {
  const config = getSupabaseConfig();

  if (!config) {
    return {
      configured: false,
      followUpsConfigured: false,
      leads: [] as ContactLead[],
    };
  }

  const params = new URLSearchParams({
    select: "id,created_at,name,email,topic,message,status,source",
    order: "created_at.desc",
    limit: String(limit),
  });

  const response = await fetch(`${config.restUrl}/contact_leads?${params}`, {
    headers: supabaseHeaders(config),
    cache: "no-store",
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(`Leads ophalen mislukt (${response.status}): ${errorText}`);
  }

  const leads = ((await response.json()) as Omit<ContactLead, "follow_ups">[]).map(
    (lead) => ({ ...lead, follow_ups: [] }),
  );

  if (!leads.length) {
    return { configured: true, followUpsConfigured: true, leads };
  }

  const followUpParams = new URLSearchParams({
    select: "id,contact_lead_id,created_at,to_email,subject,message,resend_email_id",
    order: "created_at.desc",
  });

  followUpParams.set(
    "contact_lead_id",
    `in.(${leads.map((lead) => `"${lead.id}"`).join(",")})`,
  );

  const followUpsResponse = await fetch(
    `${config.restUrl}/contact_lead_follow_ups?${followUpParams}`,
    {
      headers: supabaseHeaders(config),
      cache: "no-store",
    },
  );

  if (!followUpsResponse.ok) {
    const errorText = await followUpsResponse.text().catch(() => "");
    console.error("Follow-ups ophalen mislukt", followUpsResponse.status, errorText);
    return { configured: true, followUpsConfigured: false, leads };
  }

  const followUps = (await followUpsResponse.json()) as ContactLeadFollowUp[];
  const followUpsByLead = new Map<string, ContactLeadFollowUp[]>();

  for (const followUp of followUps) {
    const items = followUpsByLead.get(followUp.contact_lead_id) ?? [];
    items.push(followUp);
    followUpsByLead.set(followUp.contact_lead_id, items);
  }

  return {
    configured: true,
    followUpsConfigured: true,
    leads: leads.map((lead) => ({
      ...lead,
      follow_ups: followUpsByLead.get(lead.id) ?? [],
    })),
  };
}
