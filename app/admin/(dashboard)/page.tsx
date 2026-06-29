import Link from "next/link";
import {
  FolderKanban,
  CheckCircle2,
  Inbox,
  Quote,
  ArrowRight,
} from "lucide-react";
import {
  getAdminProjects,
  getAdminTestimonials,
  getAdminLeads,
} from "@/lib/admin-queries";
import { isSupabaseConfigured } from "@/lib/supabase-server";
import { StatusPill } from "@/components/admin/ui";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  if (!isSupabaseConfigured()) {
    return <NotConfigured />;
  }

  const [projects, testimonials, leads] = await Promise.all([
    getAdminProjects(),
    getAdminTestimonials(),
    getAdminLeads(),
  ]);

  const published = projects.filter((p) => p.published).length;
  const newLeads = leads.filter((l) => l.status === "new").length;

  const stats = [
    { label: "New Leads", value: newLeads, icon: Inbox, href: "/admin/leads" },
    {
      label: "Total Projects",
      value: projects.length,
      icon: FolderKanban,
      href: "/admin/projects",
    },
    {
      label: "Published",
      value: published,
      icon: CheckCircle2,
      href: "/admin/projects",
    },
    {
      label: "Testimonials",
      value: testimonials.length,
      icon: Quote,
      href: "/admin/testimonials",
    },
  ];

  const recent = projects.slice(0, 5);

  return (
    <div>
      <h1 className="mb-2 font-inter text-headline-lg-mobile font-bold">
        Dashboard
      </h1>
      <p className="mb-10 font-geist text-mono-data text-on-surface-variant">
        Content overview and quick actions.
      </p>

      <div className="mb-12 grid grid-cols-2 gap-gutter lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, href }) => (
          <Link
            key={label}
            href={href}
            className="bg-surface-container-lowest p-6 thin-border transition-colors hover:border-primary/50"
          >
            <Icon className="mb-4 h-5 w-5 text-primary" />
            <p className="font-inter text-4xl font-bold text-primary">
              {value}
            </p>
            <p className="mt-1 font-geist text-label-caps uppercase tracking-[0.1em] text-on-surface-variant">
              {label}
            </p>
          </Link>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <h2 className="font-inter text-headline-md font-semibold">
          Recently Updated
        </h2>
        <Link
          href="/admin/projects"
          className="flex items-center gap-2 font-geist text-label-caps uppercase tracking-[0.1em] text-primary hover:gap-3"
        >
          All Projects <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-6 divide-y divide-outline-variant/40 border border-outline-variant/40">
        {recent.length === 0 && (
          <p className="p-6 font-geist text-mono-data text-on-surface-variant">
            No projects yet. Run the seed script or create one.
          </p>
        )}
        {recent.map((p) => (
          <Link
            key={p.slug}
            href={`/admin/projects/${p.slug}/edit`}
            className="flex items-center justify-between gap-4 p-4 transition-colors hover:bg-surface-container-lowest"
          >
            <span className="min-w-0">
              <span className="block truncate font-body-md text-on-surface">
                {p.title}
              </span>
              <span className="font-geist text-mono-data text-on-surface-variant">
                {p.client_name} · {p.industry}
              </span>
            </span>
            <StatusPill published={p.published} />
          </Link>
        ))}
      </div>
    </div>
  );
}

function NotConfigured() {
  return (
    <div className="max-w-2xl">
      <h1 className="mb-4 font-inter text-headline-md font-semibold">
        Supabase not configured
      </h1>
      <p className="font-body-md text-on-surface-variant">
        Set <code className="text-primary">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
        <code className="text-primary">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> in{" "}
        <code className="text-primary">.env.local</code>, run the SQL in{" "}
        <code className="text-primary">/supabase</code>, then restart. See{" "}
        <code className="text-primary">supabase/README.md</code>.
      </p>
    </div>
  );
}
