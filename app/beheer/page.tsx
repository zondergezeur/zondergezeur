import { cookies } from "next/headers";
import { loginAction, logoutAction, sendFollowUpAction } from "./actions";
import { cookieName, hasAdminConfig, verifyAdminSessionToken } from "../../lib/admin-auth";
import { getContactLeads, hasLeadStorageConfig } from "../../lib/contact-leads";

type BeheerPageProps = {
  searchParams?: Promise<{
    error?: string;
    mail?: string;
  }>;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("nl-NL", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Europe/Amsterdam",
  }).format(new Date(value));
}

function LoginPanel({ hasError }: { hasError: boolean }) {
  return (
    <main className="admin-shell">
      <section className="admin-login">
        <p className="eyebrow">Beheer</p>
        <h1>Dashboard</h1>
        <p>
          Log in om berichten via het contactformulier te bekijken.
        </p>
        {!hasAdminConfig() ? (
          <div className="admin-notice">
            Stel eerst <strong>ADMIN_PASSWORD</strong> en{" "}
            <strong>ADMIN_SESSION_SECRET</strong> in bij de omgevingsvariabelen.
          </div>
        ) : null}
        <form action={loginAction} className="admin-login-form">
          <label>
            <span>Wachtwoord</span>
            <input name="password" required type="password" />
          </label>
          <button type="submit">Inloggen</button>
        </form>
        {hasError ? (
          <p className="admin-error">Dit wachtwoord klopt niet.</p>
        ) : null}
      </section>
    </main>
  );
}

function mailStatusText(status: string | undefined) {
  if (status === "sent") {
    return "Follow-up is verstuurd.";
  }

  if (status === "sent-not-stored") {
    return "Follow-up is verstuurd, maar nog niet opgeslagen in de geschiedenis.";
  }

  if (status === "missing-config") {
    return "Mail is nog niet geconfigureerd.";
  }

  if (status === "invalid") {
    return "Controleer ontvanger, onderwerp en bericht.";
  }

  if (status === "error") {
    return "Versturen is niet gelukt. Probeer het later opnieuw.";
  }

  return "";
}

export default async function BeheerPage({ searchParams }: BeheerPageProps) {
  const cookieStore = await cookies();
  const isLoggedIn = verifyAdminSessionToken(cookieStore.get(cookieName)?.value);
  const resolvedSearchParams = await searchParams;

  if (!isLoggedIn) {
    return <LoginPanel hasError={resolvedSearchParams?.error === "1"} />;
  }

  const storageConfigured = hasLeadStorageConfig();
  const { leads, followUpsConfigured } = await getContactLeads();
  const newLeadCount = leads.filter((lead) => lead.status === "new").length;
  const mailStatus = mailStatusText(resolvedSearchParams?.mail);
  const followUpCount = leads.reduce(
    (total, lead) => total + lead.follow_ups.length,
    0,
  );

  return (
    <main className="admin-shell">
      <section className="admin-dashboard">
        <header className="admin-dashboard-header">
          <div>
            <p className="eyebrow">Beheer</p>
            <h1>Reacties via de website</h1>
            <p>
              Nieuwe aanvragen en berichten die via Zonder Gezeur binnenkomen.
            </p>
          </div>
          <form action={logoutAction}>
            <button className="admin-ghost-button" type="submit">
              Uitloggen
            </button>
          </form>
        </header>

        <div className="admin-stats">
          <div>
            <span>{leads.length}</span>
            <p>berichten</p>
          </div>
          <div>
            <span>{newLeadCount}</span>
            <p>nieuw</p>
          </div>
          <div>
            <span>{followUpCount}</span>
            <p>follow-ups</p>
          </div>
        </div>

        {!storageConfigured ? (
          <div className="admin-notice">
            De dashboardpagina staat klaar. Koppel Supabase met{" "}
            <strong>SUPABASE_URL</strong> en{" "}
            <strong>SUPABASE_SERVICE_ROLE_KEY</strong> om inzendingen op te
            slaan en hier te tonen.
          </div>
        ) : null}

        {storageConfigured && !followUpsConfigured ? (
          <div className="admin-notice">
            Follow-upgeschiedenis is nog niet ingesteld. Draai eerst{" "}
            <strong>db/002_contact_lead_follow_ups.sql</strong> in Supabase.
          </div>
        ) : null}

        {mailStatus ? (
          <div
            className={
              resolvedSearchParams?.mail === "sent"
                ? "admin-success"
                : "admin-error"
            }
          >
            {mailStatus}
          </div>
        ) : null}

        <div className="lead-list">
          {leads.length ? (
            leads.map((lead) => (
              <details className="lead-card" key={lead.id}>
                <summary className="lead-card-summary">
                  <div>
                    <h2>{lead.name}</h2>
                    <span>{lead.topic}</span>
                  </div>
                  <div className="lead-card-meta">
                    <span>{formatDate(lead.created_at)}</span>
                    <strong>
                      {lead.follow_ups.length
                        ? `${lead.follow_ups.length} follow-up${lead.follow_ups.length === 1 ? "" : "s"}`
                        : "geen follow-up"}
                    </strong>
                  </div>
                </summary>
                <div className="lead-card-body">
                  <div className="lead-card-top">
                    <div>
                      <h3>Bericht van {lead.name}</h3>
                      <a href={`mailto:${lead.email}`}>{lead.email}</a>
                    </div>
                    <span>{formatDate(lead.created_at)}</span>
                  </div>
                  <div className="lead-topic">{lead.topic}</div>
                  <p>{lead.message}</p>
                  <div className="follow-up-history">
                    <h3>Follow-ups</h3>
                    {lead.follow_ups.length ? (
                      lead.follow_ups.map((followUp) => (
                        <article key={followUp.id}>
                          <div className="follow-up-history-top">
                            <strong>{followUp.subject}</strong>
                            <span>{formatDate(followUp.created_at)}</span>
                          </div>
                          <p>{followUp.message}</p>
                        </article>
                      ))
                    ) : (
                      <p>Nog geen follow-up verstuurd.</p>
                    )}
                  </div>
                  <details className="follow-up-panel">
                    <summary>Follow-up mail maken</summary>
                    <form action={sendFollowUpAction}>
                      <input
                        name="contactLeadId"
                        type="hidden"
                        value={lead.id}
                      />
                      <input name="email" type="hidden" value={lead.email} />
                      <input name="name" type="hidden" value={lead.name} />
                      <label>
                        <span>Onderwerp</span>
                        <input
                          defaultValue={`Re: ${lead.topic}`}
                          name="subject"
                          required
                          type="text"
                        />
                      </label>
                      <label>
                        <span>Bericht</span>
                        <textarea
                          defaultValue={`Hoi ${lead.name},\n\nDank je wel voor je bericht via Zonder Gezeur. Ik heb even meegekeken en denk graag met je mee.\n\nZullen we binnenkort kort bellen om je website door te nemen?\n\nGroet,\nZonder Gezeur`}
                          name="message"
                          required
                          rows={8}
                        />
                      </label>
                      <button type="submit">Verstuur mooie follow-up</button>
                    </form>
                  </details>
                </div>
              </details>
            ))
          ) : (
            <div className="admin-empty">
              Nog geen berichten om te tonen.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
