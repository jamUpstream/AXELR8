import type { Metadata } from "next";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { getPublishedProjects } from "@/lib/queries";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Work | AXLER8",
  description:
    "Case studies of precision automation systems built across e-commerce, healthcare, real estate, SaaS, and professional services.",
};

export default async function WorkPage() {
  const projects = await getPublishedProjects();
  return (
    <>
      <PageHeader
        eyebrow="Case Studies"
        title="Recent Work"
        subtitle="Mission-critical automation systems engineered across industries — from order fulfillment to client onboarding."
      />

      <section className="px-margin-mobile py-section-gap md:px-margin-desktop">
        <RevealGroup className="grid grid-cols-1 gap-gutter md:grid-cols-2">
          {projects.map((project) => (
            <RevealItem key={project.slug} className="h-full">
              <ProjectCard project={project} />
            </RevealItem>
          ))}
        </RevealGroup>
      </section>
    </>
  );
}
