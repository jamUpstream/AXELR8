import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import type { Service } from "@/types";

export function Services({
  services,
  eyebrow,
  subheadline,
}: {
  services: Service[];
  eyebrow: string;
  subheadline: string;
}) {
  return (
    <section className="px-margin-mobile py-section-gap md:px-margin-desktop">
      <Reveal className="mb-20 text-center">
        <h2 className="mb-4 font-inter text-headline-lg-mobile font-bold uppercase md:text-headline-lg">
          {eyebrow}
        </h2>
        <p className="mx-auto max-w-2xl text-on-surface-variant">
          {subheadline}
        </p>
      </Reveal>

      <RevealGroup className="grid grid-cols-1 gap-gutter sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => {
          const Icon = service.icon;
          return (
            <RevealItem key={service.slug}>
              <div className="group h-full bg-surface-container-lowest p-10 thin-border transition-all hover:border-primary/50">
                <Icon className="mb-6 h-9 w-9 text-primary" />
                <h3 className="mb-4 font-inter text-headline-md font-semibold">
                  {service.title}
                </h3>
                <p className="mb-8 font-body-md text-body-md text-on-surface-variant">
                  {service.description}
                </p>
                <Link
                  href={`/services#${service.slug}`}
                  className="flex items-center gap-2 font-geist text-label-caps uppercase tracking-[0.1em] text-primary transition-all group-hover:gap-4"
                >
                  View Details <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </RevealItem>
          );
        })}
      </RevealGroup>
    </section>
  );
}
