import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

export function ClosingCTA() {
  return (
    <section className="relative overflow-hidden bg-surface-container-lowest px-margin-mobile py-section-gap text-center md:px-margin-desktop">
      <div className="pointer-events-none absolute inset-0 opacity-10">
        <div className="h-full w-full bg-[radial-gradient(circle_at_center,rgba(163,201,255,0.4),transparent_60%)]" />
      </div>

      <Reveal className="relative z-10 mx-auto max-w-4xl">
        <h2 className="mb-8 font-inter text-headline-lg-mobile font-bold md:text-headline-display">
          &ldquo;Why didn&rsquo;t we do this earlier?&rdquo;
        </h2>
        <p className="mb-12 font-body-lg text-body-lg text-on-surface-variant">
          ~ You, next week.
        </p>
        <Button href="/contact" variant="primary">
          Let&rsquo;s Build Your System →
        </Button>
      </Reveal>
    </section>
  );
}
