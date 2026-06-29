import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

export function ClosingCTA({
  quote = "Why didn't we do this earlier?",
  attribution = "~ You, next week.",
  buttonLabel = "Let's Build Your System →",
}: {
  quote?: string;
  attribution?: string;
  buttonLabel?: string;
} = {}) {
  return (
    <section className="relative overflow-hidden bg-surface-container-lowest px-margin-mobile py-section-gap text-center md:px-margin-desktop">
      <div className="pointer-events-none absolute inset-0 opacity-10">
        <div className="h-full w-full bg-[radial-gradient(circle_at_center,rgba(163,201,255,0.4),transparent_60%)]" />
      </div>

      <Reveal className="relative z-10 mx-auto max-w-4xl">
        <h2 className="mb-8 font-inter text-headline-lg-mobile font-bold md:text-headline-display">
          &ldquo;{quote}&rdquo;
        </h2>
        <p className="mb-12 font-body-lg text-body-lg text-on-surface-variant">
          {attribution}
        </p>
        <Button href="/contact" variant="primary">
          {buttonLabel}
        </Button>
      </Reveal>
    </section>
  );
}
