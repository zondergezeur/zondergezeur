import { ContactForm } from "./contact-form";

const services = [
  {
    title: "Nieuwe websites",
    text: "Van eerste idee naar een snelle, verzorgde site die werkt op telefoon, tablet en desktop.",
  },
  {
    title: "Vernieuwen wat er al is",
    text: "Een bestaande site opschonen, moderniseren en duidelijker maken zonder alles onnodig ingewikkeld te maken.",
  },
  {
    title: "Online zetten en beheren",
    text: "GitHub voor versiebeheer, Vercel voor hosting en Resend voor nette contact- en servicemails.",
  },
];

const steps = [
  "Scherp krijgen wat de site moet doen",
  "Een eerste versie bouwen die meteen echt voelt",
  "Samen aanscherpen op inhoud, vorm en mobiel gebruik",
  "Live zetten en zorgen dat alles netjes blijft draaien",
];

const proofPoints = [
  "Fris ontwerp zonder standaard template-gevoel",
  "Duidelijke teksten in gewone taal",
  "Snel, vindbaar en technisch netjes opgebouwd",
  "Preview-links voordat iets live gaat",
];

export default function Home() {
  return (
    <main>
      <header className="site-header" id="top">
        <a className="brand" href="#top" aria-label="Zonder Gezeur home">
          <span className="brand-logo" aria-hidden="true" />
          <span>Zonder Gezeur</span>
        </a>
        <nav className="top-nav" aria-label="Hoofdnavigatie">
          <a href="#websites">Websites</a>
          <a href="#werkwijze">Werkwijze</a>
          <a href="#voorbeeld">Voorbeeld</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <section className="hero">
        <div className="hero-art" aria-hidden="true">
          <span className="art-dot-grid" />
          <span className="art-sun" />
          <span className="art-coral" />
          <span className="art-blue" />
        </div>
        <div className="hero-copy">
          <p className="eyebrow">Websites bouwen, helder geregeld</p>
          <h1>Een mooie website zonder eindeloos gedoe.</h1>
          <p className="hero-lead">
            Zonder Gezeur maakt frisse, snelle websites voor ondernemers,
            verenigingen en projecten die goed voor de dag willen komen.
          </p>
          <div className="hero-actions">
            <a className="button primary" href="#contact">
              Plan een eerste gesprek
            </a>
            <a className="button secondary" href="#voorbeeld">
              Bekijk de aanpak
            </a>
          </div>
        </div>

        <div className="hero-showcase" aria-label="Website impressie">
          <span className="showcase-yellow" aria-hidden="true" />
          <span className="showcase-aqua" aria-hidden="true" />
          <span className="showcase-coral" aria-hidden="true" />
          <span className="showcase-blue" aria-hidden="true" />
          <div className="browser-bar">
            <span />
            <span />
            <span />
          </div>
          <div className="mock-site">
            <div className="mock-hero">
              <span>Nieuw project</span>
              <strong>Helder. Snel. Mooi.</strong>
            </div>
            <div className="mock-grid">
              <span className="tile-yellow" />
              <span className="tile-aqua" />
              <span className="tile-blue" />
            </div>
            <div className="mock-card">
              <b>Live preview</b>
              <p>Elke stap zichtbaar voordat de site online gaat.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="intro-band" aria-label="Belofte">
        <p>
          <span>Rust</span>
          <span>Structuur</span>
          <span>Vakmanschap</span>
          <span>Vertrouwen</span>
        </p>
      </section>

      <section className="section" id="websites">
        <div className="section-heading">
          <p className="eyebrow">Wat Zonder Gezeur doet</p>
          <h2>Websites die er goed uitzien en praktisch werken.</h2>
        </div>
        <div className="service-grid">
          {services.map((service) => (
            <article className="service-card" key={service.title}>
              <h3>{service.title}</h3>
              <p>{service.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="split-section" id="werkwijze">
        <div>
          <p className="eyebrow">Werkwijze</p>
          <h2>Duidelijk proces, korte lijnen.</h2>
          <p>
            Geen dik projectdocument voordat er iets zichtbaar is. We beginnen
            met de kern, bouwen snel een echte eerste versie en scherpen daarna
            gericht aan.
          </p>
        </div>
        <ol className="step-list">
          {steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>

      <section className="case-section" id="voorbeeld">
        <div className="case-copy">
          <p className="eyebrow">Eerste voorbeeld</p>
          <h2>Camping De Hanen als bewijs van aanpak.</h2>
          <p>
            Een campingwebsite vraagt om sfeer, duidelijkheid en gemak op ieder
            scherm. Precies die combinatie vormt ook de basis voor Zonder
            Gezeur: mooi genoeg om indruk te maken, praktisch genoeg om snel te
            gebruiken.
          </p>
        </div>
        <div className="proof-grid">
          {proofPoints.map((point) => (
            <div className="proof-item" key={point}>
              {point}
            </div>
          ))}
        </div>
      </section>

      <section className="contact-section" id="contact">
        <div>
          <p className="eyebrow">Contact</p>
          <h2>Zullen we je website strak neerzetten?</h2>
          <p>
            Vertel kort wat je nodig hebt. Dan kijken we samen wat de snelste
            route is naar een site die gezien mag worden.
          </p>
        </div>
        <div className="contact-panel">
          <ContactForm />
        </div>
      </section>
    </main>
  );
}
