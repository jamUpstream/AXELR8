import type { Metadata } from "next";
import { Check } from "lucide-react";
import { services } from "@/data/services";
import { PageHeader } from "@/components/ui/PageHeader";
import { SystemArchitecture } from "@/components/sections/SystemArchitecture";
import { ClosingCTA } from "@/components/sections/ClosingCTA";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Services | AXLER8",
  description:
    "Strategy & setup, ongoing optimization, and unlimited support — automation handled end-to-end with aerospace precision.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Capabilities"
        title="Automation, Handled End-to-End"
        subtitle="A modular service suite that takes your operation from manual chaos to a precision-engineered system."
      />

      <section className="px-margin-mobile py-section-gap md:px-margin-desktop">
        <RevealGroup className="grid grid-cols-1 gap-gutter md:grid-cols-3">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <RevealItem key={service.slug} className="h-full">
                <div
                  id={service.slug}
                  className="flex h-full scroll-mt-32 flex-col bg-surface-container-lowest p-10 thin-border transition-all hover:border-primary/50"
                >
                  <Icon className="mb-6 h-9 w-9 text-primary" />
                  <h2 className="mb-4 font-inter text-headline-md font-semibold">
                    {service.title}
                  </h2>
                  <p className="mb-8 font-body-md text-body-md text-on-surface-variant">
                    {service.description}
                  </p>
                  <ul className="mt-auto space-y-3">
                    {service.details.map((d) => (
                      <li
                        key={d}
                        className="flex items-start gap-3 font-body-md text-on-surface"
                      >
                        <Check className="mt-1 h-4 w-4 shrink-0 text-primary" />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </section>

      <Reveal>
        <SystemArchitecture />
      </Reveal>

      <ClosingCTA />
    </>
  );
}
