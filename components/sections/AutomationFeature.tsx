import { CheckCircle2 } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { EyebrowLabel } from "@/components/ui/Pill";
import { Button } from "@/components/ui/Button";

const checklist = [
  "Zero Friction Deployment",
  "Mission-Critical Reliability",
  "Scalable Architecture",
];

export function AutomationFeature() {
  return (
    <section className="grid grid-cols-1 border-y border-outline-variant/30 bg-surface-container-low py-section-gap md:grid-cols-2 md:py-0">
      <div className="relative h-[400px] overflow-hidden md:h-auto">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 hover:scale-105"
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDBy-pEya5BkbyYTJy8oEDCfUkB6mxZUprrGGM-hveGhlH4ujPnGv9hyOVFgwHpmn4Q9p8VtIi2aTHReZo0wVFuiMkZPPrK_yAP7nlYhQykjBruTHV-9hOSHv7VpOHZrWOngaCZZeXDtg_kd9V78kZl995wPfobpqWNocBvhYu_-13LsKN39dJVSfP5U_SxqX0PjKLgk2DhowUZpf6RyMSmewiCEV5K_m0uYHxi9bamcjXuirqGXgxNNxaZWzXZbiwDVIoO-sW1Kv1k')",
          }}
        />
      </div>

      <Reveal className="flex flex-col justify-center px-margin-mobile py-20 md:px-margin-desktop">
        <div className="mb-6">
          <EyebrowLabel>Precision Automation</EyebrowLabel>
        </div>
        <h2 className="mb-8 font-inter text-headline-lg-mobile font-bold uppercase tracking-tight md:text-headline-lg">
          Automation where it matters most
        </h2>
        <p className="mb-8 max-w-xl font-body-lg text-body-lg text-on-surface-variant">
          From customer onboarding to lead routing, we automate the processes
          you rely on every day—built with aerospace precision to reduce effort,
          eliminate lag, and scale as you grow.
        </p>
        <ul className="mb-10 space-y-4">
          {checklist.map((item) => (
            <li
              key={item}
              className="flex items-center gap-3 font-geist text-mono-data uppercase tracking-wide"
            >
              <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
              {item}
            </li>
          ))}
        </ul>
        <Button href="/services" variant="ghost" className="w-fit">
          Explore our services →
        </Button>
      </Reveal>
    </section>
  );
}
