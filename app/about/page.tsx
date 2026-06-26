import type { Metadata } from "next";
import { Target, Layers, ShieldCheck, Gauge } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { ClosingCTA } from "@/components/sections/ClosingCTA";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { EyebrowLabel } from "@/components/ui/Pill";

export const metadata: Metadata = {
  title: "About | AXLER8",
  description:
    "AXLER8 builds aerospace-grade automation systems — functional, stark, and uncompromisingly efficient.",
};

const principles = [
  {
    icon: Target,
    title: "Precision First",
    text: "Every workflow is engineered like flight hardware — tested, deterministic, and built to a spec, not a vibe.",
  },
  {
    icon: ShieldCheck,
    title: "Mission-Critical Reliability",
    text: "Your systems run the business. We build with error handling, monitoring, and graceful recovery baked in.",
  },
  {
    icon: Layers,
    title: "Scalable Architecture",
    text: "We design for the operation you'll have in two years, not just the one you have today.",
  },
  {
    icon: Gauge,
    title: "Velocity Without Friction",
    text: "Zero-downtime deployment and clean handoffs mean your team feels the lift, not the disruption.",
  },
];

const stats = [
  { value: "120+", label: "Workflows Shipped" },
  { value: "40k+", label: "Hours Saved / Year" },
  { value: "99.9%", label: "Automation Uptime" },
  { value: "5", label: "Industries Served" },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="Who We Are"
        title="Engineered Like Aerospace"
        subtitle="AXLER8 is an automation studio built on the principles of modern space engineering: functional, stark, and uncompromisingly efficient."
      />

      <section className="px-margin-mobile py-section-gap md:px-margin-desktop">
        <Reveal className="mx-auto max-w-3xl text-center">
          <EyebrowLabel>Our Approach</EyebrowLabel>
          <p className="mt-6 font-body-lg text-body-lg leading-relaxed text-on-surface-variant">
            We treat your operations like a flight deck — focused on
            mission-critical data with zero decorative noise. Where most
            agencies bolt tools together and hope, we architect systems: mapping
            every trigger, action, and edge case before a single automation goes
            live. The result is software that feels less like duct tape and more
            like instrumentation.
          </p>
        </Reveal>
      </section>

      <section className="border-y border-outline-variant/30 bg-surface-container-low px-margin-mobile py-section-gap md:px-margin-desktop">
        <Reveal className="mb-16 text-center">
          <EyebrowLabel>Operating Principles</EyebrowLabel>
          <h2 className="mt-4 font-inter text-headline-lg-mobile font-bold uppercase md:text-headline-lg">
            How We Build
          </h2>
        </Reveal>
        <RevealGroup className="grid grid-cols-1 gap-gutter md:grid-cols-2">
          {principles.map(({ icon: Icon, title, text }) => (
            <RevealItem key={title}>
              <div className="flex h-full gap-5 bg-surface-container-lowest p-8 thin-border">
                <Icon className="mt-1 h-6 w-6 shrink-0 text-primary" />
                <div>
                  <h3 className="mb-2 font-inter text-headline-md font-semibold">
                    {title}
                  </h3>
                  <p className="text-on-surface-variant">{text}</p>
                </div>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      <section className="px-margin-mobile py-section-gap md:px-margin-desktop">
        <RevealGroup className="grid grid-cols-2 gap-gutter md:grid-cols-4">
          {stats.map((s) => (
            <RevealItem key={s.label}>
              <div className="bg-surface-container-lowest p-8 text-center thin-border">
                <p className="font-inter text-headline-lg font-bold text-primary">
                  {s.value}
                </p>
                <p className="mt-2 font-geist text-mono-data uppercase tracking-wide text-on-surface-variant">
                  {s.label}
                </p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      <ClosingCTA />
    </>
  );
}
