import { getAdminProjects } from "@/lib/admin-queries";
import { isSupabaseConfigured } from "@/lib/supabase-server";
import { ProjectsTable } from "@/components/admin/ProjectsTable";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  if (!isSupabaseConfigured()) {
    return (
      <p className="font-geist text-mono-data text-on-surface-variant">
        Supabase not configured — see the dashboard.
      </p>
    );
  }

  const projects = await getAdminProjects();
  const published = projects.filter((p) => p.published).length;

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-inter text-headline-lg-mobile font-bold">
          Projects
        </h1>
        <p className="mt-1 font-geist text-mono-data text-on-surface-variant">
          {projects.length} total · {published} published
        </p>
      </div>

      <ProjectsTable projects={projects} />
    </div>
  );
}
