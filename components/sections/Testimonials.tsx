import { testimonials } from "@/data/testimonials";
import { Reveal } from "@/components/ui/Reveal";

export function Testimonials() {
  return (
    <section className="overflow-hidden bg-surface px-margin-mobile py-section-gap md:px-margin-desktop">
      <div className="grid grid-cols-1 items-center gap-20 md:grid-cols-2">
        {/* Pull-quote cards */}
        <Reveal className="relative order-2 md:order-1">
          <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
          <div className="relative z-10 space-y-6">
            {testimonials.map((t, i) => (
              <div
                key={t.status}
                className={`bg-surface-container p-8 thin-border ${
                  i === 1 ? "translate-x-4 md:translate-x-12" : ""
                }`}
              >
                <p className="font-body-md italic text-on-surface">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="mt-4 flex items-center gap-2">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      t.statusTone === "error" ? "bg-error" : "bg-primary"
                    }`}
                  />
                  <span
                    className={`font-geist text-label-caps uppercase tracking-[0.1em] ${
                      t.statusTone === "error" ? "text-error" : "text-primary"
                    }`}
                  >
                    {t.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Headline */}
        <Reveal className="order-1 md:order-2">
          <h2 className="mb-6 font-inter text-headline-lg-mobile font-bold uppercase md:text-headline-lg">
            Your business is growing.
          </h2>
          <p className="mb-8 font-inter text-headline-md font-semibold text-primary">
            And that&rsquo;s exactly why your systems need to evolve.
          </p>
          <p className="mb-8 font-body-lg text-body-lg text-on-surface-variant">
            The challenge? You&rsquo;ve got more tools, more apps, more data —
            but they&rsquo;re not talking to each other. Instead of making things
            faster, it&rsquo;s just slowing everything down.
          </p>
          <p className="border-l-2 border-primary pl-6 font-geist text-label-caps uppercase tracking-widest text-on-surface">
            Stop letting &ldquo;tech&rdquo; complicate your workflow.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
