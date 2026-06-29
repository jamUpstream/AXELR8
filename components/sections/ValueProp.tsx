import { Reveal } from "@/components/ui/Reveal";
import { EyebrowLabel } from "@/components/ui/Pill";

export function ValueProp({
  eyebrow,
  statement,
}: {
  eyebrow: string;
  statement: string;
}) {
  return (
    <section className="px-margin-mobile py-section-gap text-center md:px-margin-desktop">
      <Reveal className="mx-auto max-w-4xl">
        <div className="mb-6">
          <EyebrowLabel>{eyebrow}</EyebrowLabel>
        </div>
        <h2 className="mb-8 font-inter text-headline-lg-mobile font-bold leading-tight md:text-headline-display md:tracking-tight">
          {statement}
        </h2>
        <div className="mx-auto h-1 w-24 bg-primary" />
      </Reveal>
    </section>
  );
}
