import { Reveal } from "@/components/ui/Reveal";
import { EyebrowLabel } from "@/components/ui/Pill";

export function PageHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="relative overflow-hidden border-b border-outline-variant/30 px-margin-mobile pb-20 pt-40 text-center md:px-margin-desktop">
      <div className="grid-overlay pointer-events-none absolute inset-0 opacity-40" />
      <Reveal className="relative z-10 mx-auto max-w-3xl">
        <div className="mb-5">
          <EyebrowLabel>{eyebrow}</EyebrowLabel>
        </div>
        <h1 className="mb-6 font-inter text-headline-lg-mobile font-bold uppercase tracking-tight md:text-headline-display">
          {title}
        </h1>
        {subtitle && (
          <p className="mx-auto max-w-2xl font-body-lg text-body-lg text-on-surface-variant">
            {subtitle}
          </p>
        )}
      </Reveal>
    </section>
  );
}
