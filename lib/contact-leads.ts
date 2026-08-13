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
};

export type NewContactLead = {
  name: string;
  email: string;
  topic: string;
  message: string;
  source?: string;
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
  return {
    apikey: config.serviceRoleKey,
    authorization: `Bearer ${config.serviceRoleKey}`,
    "content-type": "application/json",
  };
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

export async function getContactLeads(limit = 50) {
  const config = getSupabaseConfig();

  if (!config) {
    return { configured: false, leads: [] as ContactLead[] };
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

  const leads = (await response.json()) as ContactLead[];
  return { configured: true, leads };
}
