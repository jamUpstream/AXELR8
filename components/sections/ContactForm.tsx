"use client";

import { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";
import { submitLead } from "@/app/actions/leads";

type Status = "idle" | "submitting" | "sent";

/** Fixed list of integration partners shown as tool checkboxes. */
const TOOL_OPTIONS = [
  "Zapier",
  "Make",
  "HubSpot",
  "Airtable",
  "Salesforce",
  "Monday.com",
  "Notion",
  "Slack",
];

export interface ContactServiceOption {
  slug: string;
  title: string;
}

const fieldClass =
  "w-full border-0 border-b border-outline-variant bg-transparent py-3 font-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:outline-none focus:ring-0 transition-colors";

const labelClass =
  "mb-3 block font-geist text-label-caps uppercase tracking-[0.1em] text-on-surface-variant";

export function ContactForm({
  services,
}: {
  services: ContactServiceOption[];
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");
  const [tools, setTools] = useState<string[]>([]);
  const [otherChecked, setOtherChecked] = useState(false);
  const [toolsOther, setToolsOther] = useState("");
  const [serviceSlugs, setServiceSlugs] = useState<string[]>([]);

  function toggle(list: string[], value: string): string[] {
    return list.includes(value)
      ? list.filter((v) => v !== value)
      : [...list, value];
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setStatus("submitting");

    const res = await submitLead({
      name,
      email,
      company,
      message,
      tools,
      tools_other: otherChecked ? toolsOther : "",
      service_slugs: serviceSlugs,
    });

    if (res.error) {
      setError(res.error);
      setStatus("idle");
      return;
    }
    setStatus("sent");
  }

  if (status === "sent") {
    return (
      <div className="flex flex-col items-center justify-center bg-surface-container-lowest p-12 text-center thin-border">
        <CheckCircle2 className="mb-4 h-10 w-10 text-primary" />
        <h3 className="mb-2 font-inter text-headline-md font-semibold">
          Thank You
        </h3>
        <p className="text-on-surface-variant">
          We&rsquo;ve received your message and will be in touch within one
          business day.
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
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
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
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
          type="text"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          placeholder="Acme Inc."
          className={fieldClass}
        />
      </div>

      {/* Tools — multi checkboxes + Other */}
      <fieldset>
        <legend className={labelClass}>Which tools do you use?</legend>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {TOOL_OPTIONS.map((tool) => (
            <label
              key={tool}
              className="flex cursor-pointer items-center gap-2.5 font-body-md text-on-surface"
            >
              <input
                type="checkbox"
                checked={tools.includes(tool)}
                onChange={() => setTools((t) => toggle(t, tool))}
                className="h-4 w-4 accent-primary"
              />
              {tool}
            </label>
          ))}
          <label className="flex cursor-pointer items-center gap-2.5 font-body-md text-on-surface">
            <input
              type="checkbox"
              checked={otherChecked}
              onChange={(e) => setOtherChecked(e.target.checked)}
              className="h-4 w-4 accent-primary"
            />
            Other
          </label>
        </div>
        {otherChecked && (
          <input
            type="text"
            value={toolsOther}
            onChange={(e) => setToolsOther(e.target.value)}
            placeholder="Tell us which other tools…"
            className={`${fieldClass} mt-4`}
          />
        )}
      </fieldset>

      {/* Services — multi checkboxes from the live services list */}
      {services.length > 0 && (
        <fieldset>
          <legend className={labelClass}>
            Which services are you interested in?
          </legend>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {services.map((s) => (
              <label
                key={s.slug}
                className="flex cursor-pointer items-center gap-2.5 font-body-md text-on-surface"
              >
                <input
                  type="checkbox"
                  checked={serviceSlugs.includes(s.slug)}
                  onChange={() => setServiceSlugs((v) => toggle(v, s.slug))}
                  className="h-4 w-4 accent-primary"
                />
                {s.title}
              </label>
            ))}
          </div>
        </fieldset>
      )}

      <div>
        <label htmlFor="message" className={labelClass}>
          What do you want to automate?
        </label>
        <textarea
          id="message"
          rows={4}
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tell us about the manual processes slowing you down…"
          className={`${fieldClass} resize-none`}
        />
      </div>

      {error && (
        <p className="border-l-2 border-error bg-error/10 px-4 py-3 font-geist text-mono-data text-error">
          {error}
        </p>
      )}

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
