import { Reveal } from "@/components/ui/Reveal";
import { EyebrowLabel } from "@/components/ui/Pill";

export function ValueProp() {
  return (
    <section className="px-margin-mobile py-section-gap text-center md:px-margin-desktop">
      <Reveal className="mx-auto max-w-4xl">
        <div className="mb-6">
          <EyebrowLabel>Our Core Mission</EyebrowLabel>
        </div>
        <h2 className="mb-8 font-inter text-headline-lg-mobile font-bold leading-tight md:text-headline-display md:tracking-tight">
          We build high-performance automations. Rigorously engineered to run
          faster, cleaner, and exactly how your business needs it.
        </h2>
        <div className="mx-auto h-1 w-24 bg-primary" />
      </Reveal>
    </section>
  );
}
