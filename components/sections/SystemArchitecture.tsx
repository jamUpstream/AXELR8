import { Reveal } from "@/components/ui/Reveal";

const steps = [
  {
    n: "01",
    title: "Discover",
    desc: "Deep audit of your current processes to identify bottlenecks and leakage.",
    side: "left" as const,
  },
  {
    n: "02",
    title: "Implement",
    desc: "Seamless integration of cross-platform automations with no downtime.",
    side: "right" as const,
  },
  {
    n: "03",
    title: "Optimize",
    desc: "Testing and refinement to ensure the engine is humming at max efficiency.",
    side: "left" as const,
  },
];

export function SystemArchitecture() {
  return (
    <section className="bg-black px-margin-mobile py-section-gap md:px-margin-desktop">
      <Reveal className="mb-32 text-center">
        <h2 className="font-inter text-headline-lg-mobile font-bold uppercase md:text-headline-lg">
          System Architecture
        </h2>
      </Reveal>

      <div className="relative mx-auto max-w-5xl">
        {/* Vertical lines (desktop alternating layout only) */}
        <div className="absolute bottom-0 left-1/2 top-0 hidden w-px -translate-x-1/2 bg-outline-variant md:block" />
        <div className="timeline-glow absolute left-1/2 top-0 hidden h-1/2 w-px -translate-x-1/2 bg-primary md:block" />

        <div className="space-y-gutter md:space-y-32">
          {steps.map((step, i) => {
            const last = i === steps.length - 1;
            const textBlock = (
              <div
                className={`hidden w-[45%] md:block ${
                  step.side === "left" ? "pr-12 text-right" : "pl-12 text-left"
                }`}
              >
                <h4 className="mb-2 font-inter text-headline-md font-semibold">
                  {step.title}
                </h4>
                <p className="text-on-surface-variant">{step.desc}</p>
              </div>
            );
            const numberBlock = (
              <div
                className={`w-full md:w-[45%] ${
                  step.side === "left"
                    ? "pl-0 md:pl-12"
                    : "pr-0 text-right md:pr-12"
                }`}
              >
                {/* Mobile card */}
                <div className="bg-surface-container-lowest p-8 text-left thin-border md:hidden">
                  <h4 className="mb-2 font-inter text-headline-md font-semibold">
                    {step.title}
                  </h4>
                  <p className="text-on-surface-variant">{step.desc}</p>
                </div>
                <div className="hidden font-geist text-4xl opacity-30 md:block">
                  {step.n}
                </div>
              </div>
            );

            return (
              <div
                key={step.n}
                className={`relative flex items-center justify-between ${
                  step.side === "right" ? "flex-row-reverse" : ""
                }`}
              >
                {textBlock}
                <div
                  className={`absolute left-1/2 z-10 hidden h-4 w-4 -translate-x-1/2 rounded-full md:block ${
                    last ? "bg-outline" : "timeline-glow bg-primary"
                  }`}
                />
                {numberBlock}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
