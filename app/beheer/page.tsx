import { cookies } from "next/headers";
import { loginAction, logoutAction } from "./actions";
import { cookieName, hasAdminConfig, verifyAdminSessionToken } from "../../lib/admin-auth";
import { getContactLeads, hasLeadStorageConfig } from "../../lib/contact-leads";

type BeheerPageProps = {
  searchParams?: Promise<{
    error?: string;
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

export default async function BeheerPage({ searchParams }: BeheerPageProps) {
  const cookieStore = await cookies();
  const isLoggedIn = verifyAdminSessionToken(cookieStore.get(cookieName)?.value);
  const resolvedSearchParams = await searchParams;

  if (!isLoggedIn) {
    return <LoginPanel hasError={resolvedSearchParams?.error === "1"} />;
  }

  const storageConfigured = hasLeadStorageConfig();
  const { leads } = await getContactLeads();
  const newLeadCount = leads.filter((lead) => lead.status === "new").length;

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
            <span>{storageConfigured ? "Actief" : "Nog niet"}</span>
            <p>database</p>
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

        <div className="lead-list">
          {leads.length ? (
            leads.map((lead) => (
              <article className="lead-card" key={lead.id}>
                <div className="lead-card-top">
                  <div>
                    <h2>{lead.name}</h2>
                    <a href={`mailto:${lead.email}`}>{lead.email}</a>
                  </div>
                  <span>{formatDate(lead.created_at)}</span>
                </div>
                <div className="lead-topic">{lead.topic}</div>
                <p>{lead.message}</p>
              </article>
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
