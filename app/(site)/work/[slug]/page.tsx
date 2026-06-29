import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectDetail } from "@/components/projects/ProjectDetail";
import {
  getProjectBySlug,
  getPublishedProjectSlugs,
} from "@/lib/queries";

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getPublishedProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const project = await getProjectBySlug(params.slug);
  if (!project) return { title: "Project Not Found | AXLER8" };
  return {
    title: `${project.title} | AXLER8`,
    description: project.summary,
    openGraph: {
      title: `${project.title} | AXLER8`,
      description: project.summary,
      images: project.coverImage ? [project.coverImage] : [],
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: { slug: string };
}) {
  const project = await getProjectBySlug(params.slug);
  if (!project) notFound();
  return <ProjectDetail project={project} />;
}
