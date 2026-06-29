import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ProjectForm } from "@/components/admin/ProjectForm";

export const dynamic = "force-dynamic";

export default function NewProjectPage() {
  return (
    <div>
      <Link
        href="/admin/projects"
        className="mb-6 inline-flex items-center gap-2 font-geist text-label-caps uppercase tracking-[0.1em] text-on-surface-variant hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" /> Projects
      </Link>
      <h1 className="mb-8 font-inter text-headline-lg-mobile font-bold">
        New Project
      </h1>
      <ProjectForm />
    </div>
  );
}
