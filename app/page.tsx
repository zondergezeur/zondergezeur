import { ContactForm } from "./contact-form";

const services = [
  {
    title: "Nieuw gebouwd",
    text: "Een frisse website die goed werkt op telefoon, tablet en desktop.",
  },
  {
    title: "Opnieuw opgezet",
    text: "Een bestaande website duidelijker, mooier en makkelijker vindbaar maken.",
  },
  {
    title: "Snel aangepast",
    text: "Kleine wijzigingen gewoon snel geregeld, zonder lange wachttijden.",
  },
];

const campingProblems = [
  {
    title: "Zelf bouwen kost tijd",
    text: "Je wilt wel een goede website, maar hebt geen zin om avonden te verdwalen in technische keuzes.",
  },
  {
    title: "Simpel wordt vaak rommelig",
    text: "Een snelle doe-het-zelf-site staat online, maar oogt al snel onduidelijk of verouderd.",
  },
  {
    title: "Vindbaar zijn is lastig",
    text: "Gasten moeten je camping kunnen vinden, snappen en vertrouwen voordat ze contact opnemen.",
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

const faqs = [
  {
    question: "Blijf ik eigenaar van mijn website?",
    answer:
      "Ja. De website hoort bij jou. Ik zorg dat alles netjes wordt ingericht en leg duidelijk uit waar je site staat.",
  },
  {
    question: "Hoe regel ik kleine wijzigingen?",
    answer:
      "Stuur gewoon door wat aangepast moet worden. Kleine wijzigingen pak ik snel op, zodat je er zelf niet mee hoeft te puzzelen.",
  },
  {
    question: "Hoe lang duurt het van start tot livegang?",
    answer:
      "Gemiddeld 2 tot 4 weken, afhankelijk van hoe snel content wordt aangeleverd.",
  },
  {
    question: "Wat kost het maandelijks aan hosting en onderhoud?",
    answer: "De prijzen volgen later. We maken dit straks duidelijk en overzichtelijk.",
  },
  {
    question: "Werkt de site ook goed op mobiel?",
    answer:
      "Ja. De meeste campinggasten zoeken en boeken vanaf hun telefoon, dus dat is het uitgangspunt, niet een extra.",
  },
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
          <a href="#prijzen">Prijzen</a>
          <a href="#vragen">Vragen</a>
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
          <p className="eyebrow">Websites voor campings</p>
          <h1>Een site die gasten vertrouwen.</h1>
          <p className="hero-lead">
            Zonder Gezeur bouwt en vernieuwt websites voor campings. Helder,
            snel en goed vindbaar, zonder gedoe of maanden wachten.
          </p>
          <div className="hero-actions">
            <a className="button primary" href="#contact">
              Plan een eerste gesprek
            </a>
            <a className="button secondary" href="#voorbeeld">
              Bekijk het voorbeeld
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
              <span>Camping preview</span>
              <strong>Duidelijk. Vindbaar. Snel.</strong>
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

      <section className="section" id="herkenbaar">
        <div className="section-heading">
          <p className="eyebrow">Herkenbaar?</p>
          <h2>Een goede website maken is lastiger dan het lijkt.</h2>
        </div>
        <div className="service-grid">
          {campingProblems.map((problem) => (
            <article className="service-card" key={problem.title}>
              <h3>{problem.title}</h3>
              <p>{problem.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section" id="websites">
        <div className="section-heading">
          <p className="eyebrow">Wat Zonder Gezeur doet</p>
          <h2>Mooi. Duidelijk. Vindbaar.</h2>
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
          <h2>
            <span>Duidelijk proces.</span>
            <span>Korte lijnen.</span>
          </h2>
          <p>
            We beginnen met de kern, maken snel iets zichtbaar en scherpen
            daarna gericht aan.
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
          <p className="eyebrow">Zo kan het eruitzien</p>
          <h2>Minicamping Het Eekhoorntje: een voorbeeld van de aanpak.</h2>
          <p>
            Dit is een demo-uitwerking, gebouwd om te laten zien hoe een
            campingwebsite bij Zonder Gezeur eruitziet: sfeervol, snel, en
            duidelijk voor gasten die op hun telefoon aan het zoeken zijn.
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

      <section className="section pricing-section" id="prijzen">
        <div className="section-heading">
          <p className="eyebrow">Investering</p>
          <h2>Prijzen volgen later.</h2>
        </div>
        <p className="pricing-note">
          De pakketten en maandelijkse kosten worden nog uitgewerkt. Het doel:
          duidelijk weten waar je aan toe bent, zonder verrassingen achteraf.
        </p>
      </section>

      <section className="faq-section" id="vragen">
        <div className="section-heading">
          <p className="eyebrow">Vragen vooraf</p>
          <h2>Wat je vooraf wil weten.</h2>
        </div>
        <div className="faq-list">
          {faqs.map((item) => (
            <details key={item.question}>
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="contact-section" id="contact">
        <div>
          <p className="eyebrow">Contact</p>
          <h2>Klaar voor een betere website?</h2>
          <p>
            Vertel kort wat je hebt en wat je anders wilt. Dan kijken we samen
            naar de snelste route.
          </p>
          <p className="direct-contact">
            Liever direct contact? Stuur een bericht via het formulier, dan
            plannen we een belmoment.
          </p>
        </div>
        <div className="contact-panel">
          <ContactForm />
        </div>
      </section>
      <footer className="business-footer">
        <p>
          Bedrijfsgegevens, KVK-nummer en algemene voorwaarden worden toegevoegd
          zodra de definitieve gegevens vaststaan.
        </p>
      </footer>
    </main>
  );
}
