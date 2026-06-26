import type { Metadata } from "next";
import { Mail, Clock, MapPin } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { ContactForm } from "@/components/sections/ContactForm";
import { Reveal } from "@/components/ui/Reveal";
import { EyebrowLabel } from "@/components/ui/Pill";

export const metadata: Metadata = {
  title: "Contact | AXLER8",
  description:
    "Book a mission review with AXLER8. Tell us what you want to automate and we'll architect the system.",
};

const details = [
  { icon: Mail, label: "Email", value: "hello@axler8.io" },
  { icon: Clock, label: "Response Time", value: "Within 1 business day" },
  { icon: MapPin, label: "Operating", value: "Remote · Global" },
];

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Initiate Contact"
        title="Book a Mission Review"
        subtitle="Tell us about the processes slowing you down. We'll map the system and show you what's possible."
      />

      <section className="px-margin-mobile py-section-gap md:px-margin-desktop">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-16 lg:grid-cols-[1fr_1.4fr]">
          <Reveal>
            <EyebrowLabel>Direct Channels</EyebrowLabel>
            <h2 className="mb-8 mt-4 font-inter text-headline-md font-semibold">
              Let&rsquo;s talk systems.
            </h2>
            <ul className="space-y-8">
              {details.map(({ icon: Icon, label, value }) => (
                <li key={label} className="flex items-start gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-outline-variant">
                    <Icon className="h-5 w-5 text-primary" />
                  </span>
                  <div>
                    <p className="font-geist text-label-caps uppercase tracking-[0.1em] text-on-surface-variant">
                      {label}
                    </p>
                    <p className="mt-1 font-body-md text-on-surface">{value}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.1}>
            <ContactForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
