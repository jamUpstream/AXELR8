"use client";

import { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";

type Status = "idle" | "submitting" | "sent";

const fieldClass =
  "w-full border-0 border-b border-outline-variant bg-transparent py-3 font-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:outline-none focus:ring-0 transition-colors";

const labelClass =
  "mb-2 block font-geist text-label-caps uppercase tracking-[0.1em] text-on-surface-variant";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Phase 2: POST to a Supabase edge function / table.
    setStatus("submitting");
    setTimeout(() => setStatus("sent"), 700);
  }

  if (status === "sent") {
    return (
      <div className="flex flex-col items-center justify-center bg-surface-container-lowest p-12 text-center thin-border">
        <CheckCircle2 className="mb-4 h-10 w-10 text-primary" />
        <h3 className="mb-2 font-inter text-headline-md font-semibold">
          Transmission Received
        </h3>
        <p className="text-on-surface-variant">
          We&rsquo;ll be in touch within one business day to schedule your
          mission review.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 bg-surface-container-lowest p-8 thin-border md:p-10"
    >
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div>
          <label htmlFor="name" className={labelClass}>
            Full Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="Jane Cooper"
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor="email" className={labelClass}>
            Work Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="jane@company.com"
            className={fieldClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="company" className={labelClass}>
          Company
        </label>
        <input
          id="company"
          name="company"
          type="text"
          placeholder="Acme Inc."
          className={fieldClass}
        />
      </div>

      <div>
        <label htmlFor="message" className={labelClass}>
          What do you want to automate?
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          required
          placeholder="Tell us about the manual processes slowing you down…"
          className={`${fieldClass} resize-none`}
        />
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex items-center gap-2 bg-primary px-10 py-4 font-geist text-label-caps uppercase tracking-widest text-on-primary transition-all hover:brightness-110 active:scale-95 disabled:opacity-60"
      >
        {status === "submitting" ? "Transmitting…" : "Book a Call"}
        <Send className="h-4 w-4" />
      </button>
    </form>
  );
}
