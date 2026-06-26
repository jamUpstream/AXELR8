import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { projects } from "@/data/projects";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { EyebrowLabel } from "@/components/ui/Pill";

export function ProjectsPreview() {
  const featured = projects.slice(0, 5);

  return (
    <section className="border-y border-outline-variant/30 bg-surface-container-low px-margin-mobile py-section-gap md:px-margin-desktop">
      <Reveal className="mb-16 text-center">
        <div className="mb-4">
          <EyebrowLabel>Case Studies</EyebrowLabel>
        </div>
        <h2 className="font-inter text-headline-lg-mobile font-bold uppercase md:text-headline-lg">
          Recent Work
        </h2>
      </Reveal>

      <RevealGroup className="grid grid-cols-1 gap-gutter md:grid-cols-2">
        {featured.map((project) => (
          <RevealItem key={project.slug} className="h-full">
            <ProjectCard project={project} />
          </RevealItem>
        ))}
      </RevealGroup>

      <div className="mt-16 text-center">
        <Link
          href="/work"
          className="inline-flex items-center gap-2 border-b border-primary pb-1 font-geist text-label-caps uppercase tracking-[0.1em] text-primary transition-all hover:gap-4"
        >
          View All Projects <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
