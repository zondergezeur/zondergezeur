"use client";

import { FormEvent, useState } from "react";

type FormState = "idle" | "sending" | "sent" | "error";

export function ContactForm() {
  const [state, setState] = useState<FormState>("idle");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("sending");
    setError("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    const response = await fetch("/api/contact", {
      method: "POST",
      body: JSON.stringify(Object.fromEntries(formData)),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      setError(payload?.error ?? "Versturen lukt nu niet. Probeer het later opnieuw.");
      setState("error");
      return;
    }

    form.reset();
    setState("sent");
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <input
        aria-hidden="true"
        className="form-honey"
        name="company"
        tabIndex={-1}
        type="text"
      />

      <label>
        <span>Naam</span>
        <input autoComplete="name" name="name" required type="text" />
      </label>

      <label>
        <span>E-mail</span>
        <input autoComplete="email" name="email" required type="email" />
      </label>

      <label>
        <span>Waarmee kan ik helpen?</span>
        <select defaultValue="" name="topic" required>
          <option disabled value="">
            Kies een onderwerp
          </option>
          <option>Nieuwe website</option>
          <option>Bestaande website verbeteren</option>
          <option>Onderhoud of hosting</option>
          <option>Iets anders</option>
        </select>
      </label>

      <label>
        <span>Bericht</span>
        <textarea
          name="message"
          placeholder="Vertel kort wat je wilt maken, verbeteren of uitzoeken."
          required
          rows={6}
        />
      </label>

      <button className="form-submit" disabled={state === "sending"} type="submit">
        {state === "sending" ? "Bezig met versturen" : "Verstuur bericht"}
      </button>

      {state === "sent" ? (
        <p className="form-status success">
          Je bericht is verstuurd. Je ontvangt ook een bevestiging per mail.
        </p>
      ) : null}

      {state === "error" ? <p className="form-status error">{error}</p> : null}
    </form>
  );
}
