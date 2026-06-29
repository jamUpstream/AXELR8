import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getAdminProjectBySlug } from "@/lib/admin-queries";
import { ProjectForm } from "@/components/admin/ProjectForm";

export const dynamic = "force-dynamic";

export default async function EditProjectPage({
  params,
}: {
  params: { slug: string };
}) {
  const project = await getAdminProjectBySlug(params.slug);
  if (!project) notFound();

  return (
    <div>
      <Link
        href="/admin/projects"
        className="mb-6 inline-flex items-center gap-2 font-geist text-label-caps uppercase tracking-[0.1em] text-on-surface-variant hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" /> Projects
      </Link>
      <h1 className="mb-8 font-inter text-headline-lg-mobile font-bold">
        Edit Project
      </h1>
      <ProjectForm project={project} />
    </div>
  );
}
