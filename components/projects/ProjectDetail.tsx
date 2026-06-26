import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Wrench,
  AlertTriangle,
  Repeat,
  Clock4,
  GitBranch,
  CheckCircle2,
} from "lucide-react";
import type { Project } from "@/types";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { EyebrowLabel } from "@/components/ui/Pill";
import { Button } from "@/components/ui/Button";

export function ProjectDetail({ project }: { project: Project }) {
  return (
    <article>
      {/* Section 1 — Overview / Hero */}
      <section className="relative flex min-h-[70vh] items-end overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={project.coverImage}
            alt={project.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/40" />
          <div className="grid-overlay absolute inset-0 opacity-40" />
        </div>

        <div className="relative z-10 w-full px-margin-mobile pb-20 pt-40 md:px-margin-desktop">
          <Link
            href="/work"
            className="mb-8 inline-flex items-center gap-2 font-geist text-label-caps uppercase tracking-[0.1em] text-on-surface-variant transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" /> All Projects
          </Link>
          <div className="mb-5">
            <EyebrowLabel>{project.industry}</EyebrowLabel>
          </div>
          <h1 className="mb-6 max-w-4xl font-inter text-headline-lg-mobile font-bold uppercase tracking-tight md:text-headline-display">
            {project.title}
          </h1>
          <p className="mb-2 font-geist text-mono-data uppercase tracking-widest text-primary">
            {project.clientName}
          </p>
          <p className="max-w-2xl font-body-lg text-body-lg text-on-surface-variant">
            {project.overview.whatBusinessDoes}
          </p>
        </div>
      </section>

      {/* Problem before automation strip */}
      <section className="border-y border-outline-variant/30 bg-surface-container-low px-margin-mobile py-20 md:px-margin-desktop">
        <Reveal className="mx-auto max-w-4xl">
          <EyebrowLabel>The Situation</EyebrowLabel>
          <p className="mt-5 font-headline-md text-headline-md font-semibold leading-relaxed">
            {project.overview.problemBeforeAutomation}
          </p>
        </Reveal>
      </section>

      {/* Section 2 — Pain Points */}
      <section className="px-margin-mobile py-section-gap md:px-margin-desktop">
        <Reveal className="mb-16 text-center">
          <EyebrowLabel>Pain Points</EyebrowLabel>
          <h2 className="mt-4 font-inter text-headline-lg-mobile font-bold uppercase md:text-headline-lg">
            What Was Slowing Them Down
          </h2>
        </Reveal>
        <RevealGroup className="grid grid-cols-1 gap-gutter md:grid-cols-2">
          {[
            { icon: Wrench, label: "Manual Work", text: project.painPoints.manualWork },
            { icon: Repeat, label: "Repetitive Tasks", text: project.painPoints.repetitiveTasks },
            { icon: AlertTriangle, label: "Mistakes & Delays", text: project.painPoints.mistakesOrDelays },
            { icon: Clock4, label: "Bottlenecks", text: project.painPoints.bottlenecks },
          ].map(({ icon: Icon, label, text }) => (
            <RevealItem key={label}>
              <div className="h-full bg-surface-container-lowest p-8 thin-border">
                <div className="mb-4 flex items-center gap-3">
                  <Icon className="h-5 w-5 text-error" />
                  <h3 className="font-geist text-label-caps uppercase tracking-[0.1em] text-error">
                    {label}
                  </h3>
                </div>
                <p className="text-on-surface-variant">{text}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* Section 3 — Automation Built */}
      <section className="border-y border-outline-variant/30 bg-surface px-margin-mobile py-section-gap md:px-margin-desktop">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <EyebrowLabel>System Built</EyebrowLabel>
            <h2 className="mt-4 font-inter text-headline-lg-mobile font-bold uppercase md:text-headline-lg">
              The Automation
            </h2>
            <p className="mt-6 max-w-3xl font-body-lg text-body-lg text-on-surface-variant">
              {project.automationBuilt.description}
            </p>
          </Reveal>

          {project.automationBuilt.flowDiagramImage && (
            <Reveal className="relative mt-12 aspect-[16/9] w-full overflow-hidden thin-border">
              <Image
                src={project.automationBuilt.flowDiagramImage}
                alt={`${project.title} system flow diagram`}
                fill
                sizes="(max-width: 1024px) 100vw, 1024px"
                className="object-cover"
              />
            </Reveal>
          )}

          <Reveal className="mt-12 flex gap-4 border-l-2 border-primary bg-surface-container-lowest p-8">
            <GitBranch className="mt-1 h-5 w-5 shrink-0 text-primary" />
            <div>
              <h3 className="mb-3 font-geist text-label-caps uppercase tracking-[0.1em] text-primary">
                How It Connects
              </h3>
              <p className="font-body-md text-on-surface-variant">
                {project.automationBuilt.toolConnections}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Section 4 — Tools Used */}
      <section className="px-margin-mobile py-section-gap md:px-margin-desktop">
        <Reveal className="mb-12 text-center">
          <EyebrowLabel>Stack</EyebrowLabel>
          <h2 className="mt-4 font-inter text-headline-lg-mobile font-bold uppercase md:text-headline-lg">
            Tools Used
          </h2>
        </Reveal>
        <Reveal className="flex flex-wrap justify-center gap-3">
          {project.tools.map((tool) => (
            <span
              key={tool}
              className="inline-flex items-center gap-2 rounded-full border border-outline-variant bg-surface-container-lowest px-5 py-2.5 font-geist text-mono-data text-on-surface"
            >
              <Wrench className="h-4 w-4 text-primary" />
              {tool}
            </span>
          ))}
        </Reveal>
      </section>

      {/* Section 5 — Media Gallery */}
      <section className="border-y border-outline-variant/30 bg-surface-container-low px-margin-mobile py-section-gap md:px-margin-desktop">
        <Reveal className="mb-12 text-center">
          <EyebrowLabel>In Action</EyebrowLabel>
          <h2 className="mt-4 font-inter text-headline-lg-mobile font-bold uppercase md:text-headline-lg">
            Screens & Walkthroughs
          </h2>
        </Reveal>
        <RevealGroup className="grid grid-cols-1 gap-gutter md:grid-cols-2">
          {project.media.map((item) => (
            <RevealItem key={item.src}>
              <figure className="group bg-surface-container-lowest thin-border">
                <div className="relative aspect-[16/10] w-full overflow-hidden">
                  {item.type === "video" ? (
                    <video
                      src={item.src}
                      controls
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Image
                      src={item.src}
                      alt={item.caption}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  )}
                </div>
                <figcaption className="border-t border-outline-variant/30 px-6 py-4 font-geist text-mono-data text-on-surface-variant">
                  {item.caption}
                </figcaption>
              </figure>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* Section 6 — Value Created */}
      <section className="px-margin-mobile py-section-gap md:px-margin-desktop">
        <Reveal className="mb-16 text-center">
          <EyebrowLabel>Outcomes</EyebrowLabel>
          <h2 className="mt-4 font-inter text-headline-lg-mobile font-bold uppercase md:text-headline-lg">
            Value Created
          </h2>
        </Reveal>
        <RevealGroup className="grid grid-cols-1 gap-gutter sm:grid-cols-2 lg:grid-cols-3">
          {[
            { label: "Time Saved", value: project.valueCreated.timeSaved },
            { label: "Manual Tasks Removed", value: project.valueCreated.manualWorkRemoved },
            { label: "Error Rate Reduction", value: project.valueCreated.errorsReduced },
            { label: "Client Experience", value: project.valueCreated.clientExperienceImproved },
            { label: "Operational Impact", value: project.valueCreated.revenueImpact },
          ]
            .filter((m) => m.value)
            .map((m) => (
              <RevealItem key={m.label}>
                <div className="flex h-full flex-col bg-surface-container-lowest p-8 thin-border">
                  <span className="mb-4 font-geist text-label-caps uppercase tracking-[0.1em] text-on-surface-variant">
                    {m.label}
                  </span>
                  <span className="font-inter text-headline-md font-bold text-primary md:text-headline-lg">
                    {m.value}
                  </span>
                </div>
              </RevealItem>
            ))}
        </RevealGroup>
      </section>

      {/* Section 7 — Skills Showcased */}
      <section className="border-t border-outline-variant/30 bg-surface px-margin-mobile py-section-gap md:px-margin-desktop">
        <Reveal className="mb-12 text-center">
          <EyebrowLabel>Capabilities</EyebrowLabel>
          <h2 className="mt-4 font-inter text-headline-lg-mobile font-bold uppercase md:text-headline-lg">
            Skills Showcased
          </h2>
        </Reveal>
        <Reveal className="mx-auto flex max-w-3xl flex-wrap justify-center gap-3">
          {project.skillsShowcased.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/5 px-5 py-2.5 font-geist text-mono-data text-primary"
            >
              <CheckCircle2 className="h-4 w-4" />
              {skill}
            </span>
          ))}
        </Reveal>
      </section>

      {/* CTA */}
      <section className="px-margin-mobile py-section-gap text-center md:px-margin-desktop">
        <Reveal className="mx-auto max-w-3xl">
          <h2 className="mb-8 font-inter text-headline-lg-mobile font-bold uppercase md:text-headline-lg">
            Want a system like this?
          </h2>
          <Button href="/contact" variant="primary">
            Let&rsquo;s Build Your System →
          </Button>
        </Reveal>
      </section>
    </article>
  );
}
