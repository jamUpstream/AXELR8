import { partnerLogos } from "@/data/testimonials";

export function LogoBar() {
  return (
    <section className="border-y border-outline-variant/20 bg-surface-container-lowest py-20">
      <div className="overflow-hidden px-margin-mobile md:px-margin-desktop">
        <p className="mb-10 text-center font-geist text-label-caps uppercase tracking-[0.1em] text-on-surface-variant opacity-50">
          Integrated With Industry Leaders
        </p>
        <div className="flex flex-wrap items-center justify-center gap-12 opacity-40 grayscale transition-all duration-700 hover:opacity-70 hover:grayscale-0 md:gap-20">
          {partnerLogos.map((name) => (
            <div
              key={name}
              className="flex h-8 w-24 items-center justify-center bg-on-surface/20 font-bold italic tracking-wide"
            >
              {name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
